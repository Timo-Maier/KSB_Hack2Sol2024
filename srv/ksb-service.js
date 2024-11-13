const { log } = require('@sap/cds');
const {getBase64ForLLM, parseJsonContent} = require("./utils/processPDF")

module.exports = function () {

  const {
    Tender, 'Tender.attachments': Attachments
  } = cds.entities('KSBHack2Sol');

  this.on("pdfAnalyze", async (req) => {

    const {
      AzureOpenAiChatClient, AzureOpenAiEmbeddingClient, ChatMessages
    } = await import('@sap-ai-sdk/foundation-models');

    const tender_instruction = `
      Extract from the text at the end of this prompt if 
      a pump is requested in the text (haspump) and if there any hints that the 
      pump should be manufactured by a specific company other than KSB (hascompetitor).
      Provide the response as JSON in the example format below.
      There should be only one JSON message for the complete text.
      
      {
             "HasPump": "True",
             "HasCompetitor" : "False"
      }
      The text is a base64 document
      `;
      const chatClient = new AzureOpenAiChatClient('gpt-4o');

    const tender = await req.query
    const AttachmentService = await cds.connect.to("attachments")
    const attachment = await SELECT.one.from(Attachments).where({up__ID: tender[0].ID})

    const fileStream = await AttachmentService.get(Attachments, attachment)
    const base64 = await getBase64ForLLM(fileStream, attachment.mimeType)

    const llm_instruction = tender_instruction + base64


    const res = await chatClient.run({
      messages: [
        {
          role: 'user',
          content: llm_instruction
        }
      ]
    })
    const content = res.data?.choices?.[0]?.message?.content;
    const json = parseJsonContent(content)
    console.log(json)

  })

  // Register your event handlers in here, for example, ...
  this.on('Analyze', async (req) => {
    let query = await req.query
    //console.log('Button Analyze has been pressed: ')
    const {
      AzureOpenAiChatClient, AzureOpenAiEmbeddingClient
    } = await import('@sap-ai-sdk/foundation-models');

    const tender_instruction = `
    You are a valid json interpreter.  
    Extract from the text at the end of this prompt if 
      a pump is requested in the text (haspump) and if there any hints that the 
      pump should be manufactured by a specific company other than KSB (hascompetitor).
      Provide the response as JSON in the example format below.
      The answer must be a valid json in the valid json format, nothing else.
      There should be only one JSON message for the complete text.
      Please remove any unnecessary characters.
      
      {
             "HasPump": "True",
             "HasCompetitor" : "False"
      }
      `;

    let tender_llmRequest = tender_instruction + query[0].TenderContent
    //console.log('LLM request: ', llmRequest)


    // For a chat client
    const chatClient = new AzureOpenAiChatClient('gpt-4o');
    // For an embedding client
    const embeddingClient = new AzureOpenAiEmbeddingClient({ modelName: 'gpt-4o' });
    let response = await chatClient.run({
      messages: [
        {
          role: 'user',
          content: tender_llmRequest
        }
      ]
    });

    let tender_responseContent = response.getContent();
    tender_responseContent = tender_responseContent.replace('```json','');
    tender_responseContent = tender_responseContent.replace('```','');

    console.log(tender_responseContent)

    const requirements_instruction = `
      Extract from the text at the end of this prompt the pressure head (Head), 
      nominal flow (Flow), voltage (ratedvoltage), frequency (supply frequency) and provide 
      the response as JSON in the example format below.
      Return only the number values for above JSON without the units.
      For every detected pump there should be one JSON message.
      The answer must be a valid json array in the valid json format, nothing else.
      Please just return plain text without any JSON formatting.
      
      {
             "Flow" : "5 m³/h",
             "Head" : "1 m",
             "SupplyFrequency" : "50 Hz",
             "RatedVoltage" : "400 V"
      }
      `;

    //Also, check if a pump is requested in the text (haspump) and if there any hints that the 
    //pump should be manufactured by a specific company other than KSB (hascompetitor).

    const requirements_llmRequest = requirements_instruction + query[0].TenderContent
    //console.log('LLM request: ', llmRequest)

    response = await chatClient.run({
      messages: [
        {
          role: 'user',
          content: requirements_llmRequest
        }
      ]
    });

    let requirements_responseContent = response.getContent();
    requirements_responseContent = requirements_responseContent.replace('```json','');
    requirements_responseContent = requirements_responseContent.replace('```','');
    console.log(requirements_responseContent)

    //String der Tender-Response als json
    let jsonObject = JSON.parse(tender_responseContent);
    console.log("Resulting json: \n", jsonObject)

    //Speichern des Tenders ANALYZE mit:
    // - Last analyzed at: <timestamp>
    // - Description
    // - Tender Content
    // - Tender has pump
    // - Tender has competitors
    //...

    const lastAnalyzedAt = new Date();
    const tender = { Description: query[0].Description, TenderContent: query[0].TenderContent, LastAnalyzedAt: lastAnalyzedAt, ContainsPump: jsonObject.ContainsPump, HasCompetitor: jsonObject.HasCompetitor };
    //await INSERT.into(Tender).entries(tender);
    //await cds.tx(req).run(INSERT.into(Tender).entries(tender));
    let tenderID = query[0].ID;
    await UPDATE(Tender).where({ ID: tenderID }).set(tender);

    //String der Requirements-Responses jeweils als json
    //@Loop über die json Requirements!
    jsonObject = JSON.parse(requirements_responseContent);

    console.log("Concat HZ to SupplyFrequency")
    jsonObject.SupplyFrequency += 'HZ'

    console.log("Concat V to RatedVoltage")
    jsonObject.RatedVoltage += 'V'

    console.log("Resulting json: \n", jsonObject)

    //@todo: Requirements speichern:
    // - Flow, Head, Voltage mit V ohne Leerzeichen, Frequenz mit Hz ohne Leerzeichen

    const prd_rcmd = await cds.connect.to('API_PRODUCT_RECOMMENDATION');
    const prd_rcmd_response = await prd_rcmd.send({
      method: "POST",
      path: "/DetermineProductSrv/Root",
      data: {
        "mlModel": "MDL62BB0FC9-FCE1-472A-9F67-1A76B10F977C",
        "productCategory": "Pumps",
        "topN": 1,
        "features": [
          {
            "name": "KSB_FLOW",
            "value": "30"
          },
          {
            "name": "KSB_HEAD",
            "value": "50"
          },
          {
            "name": "KSB_SUPPLYFREQUENCY",
            "value": "50HZ"
          },
          {
            "name": "KSB_RATEDVOLTAGE",
            "value": "400V"
          }
        ],
        "lowerthreshold": 0.00
      }
    });

    const prd_rcmd_response_2 = await prd_rcmd.send({
      method: "POST",
      path: "/DetermineProductConfigurationSrv/Root",
      data: {
        "topN": 1,
        "features": [
          {
            "name": "KSB_FLOW",
            "value": "30"
          },
          {
            "name": "KSB_HEAD",
            "value": "50"
          },
          {
            "name": "KSB_SUPPLYFREQUENCY",
            "value": "50HZ"
          },
          {
            "name": "KSB_RATEDVOLTAGE",
            "value": "400V"
          },
          {
            "name": "KMAT",
            "value": "S01B0T"
          }
        ],
        "commercialAttributesDeterminationModel": "MDLD73A2552-8AEC-4E47-8071-F5A4699E61C1",
        "configurationDeterminationModel": "MDL71D1A5B4-8848-470C-9498-9971829954EF"
      }
    });

    console.log(prd_rcmd_response);
    console.log('_________________________________')
    console - log(prd_rcmd_response_2);
  })
}