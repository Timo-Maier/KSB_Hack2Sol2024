module.exports = function () {

  const {
    Tender
  } = cds.entities('KSBHack2Sol');

  // Register your event handlers in here, for example, ...
  this.on('Analyze', async (req) => {
    let query = await req.query
    //console.log('Button Analyze has been pressed: ')
    const {
      AzureOpenAiChatClient, AzureOpenAiEmbeddingClient
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
      `;

    const tender_llmRequest = tender_instruction + query[0].TenderContent
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

    const tender_responseContent = response.getContent();
    console.log(tender_responseContent)

    const requirements_instruction = `
      Extract from the text at the end of this prompt the pressure head (Head), 
      nominal flow (Flow), voltage (ratedvoltage), frequency (supply frequency) and provide 
      the response as JSON in the example format below.
      Return only the number values for above JSON without the units.
      For every detected pump there should be one JSON message.
      The answer must be a valid json in the valid json format, nothing else.
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

    const requirements_responseContent = response.getContent();
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
    await UPDATE(Tender).where({ID: tenderID}).set(tender);

    //String der Requirements-Responses jeweils als json
    //@Loop über die json Requirements!
    jsonObject = JSON.parse(requirement_responseContent);

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
      path: "/Bulk",
      data: {
        
      }

    });





  })
}