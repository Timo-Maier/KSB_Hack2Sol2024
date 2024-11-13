const { log } = require('@sap/cds');
const {getBase64ForLLM, parseJsonContent} = require("./utils/processPDF");
const { message } = require('@sap/cds/lib/log/cds-error');
const {getDestination} = require("./utils/destination");
const { getToken } = require('./utils/oauth');
const axios = require("axios").default;

module.exports = function () {

  const {
    Tender, 'Tender.attachments': Attachments, Requirement
  } = cds.entities('KSBHack2Sol');

  this.on("getProductRecommendations", async (req) => {
    const requirement = (await req.query)[0]
    const destination = await getDestination("KSB-ProductRecommendation")
    const token = await getToken(destination)
    const prd_rcmd_response = await axios({
      method: "POST",
      url: destination.URL + "/DetermineProductSrv/Root?sap-language=en",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
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

    const prd_rcmd_response_2 = await axios({
      method: "POST",
      url: destination.URL + "/DetermineProductConfigurationSrv/Root?sap-language=en",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
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
            "value": prd_rcmd_response.data.Response[0].configurableProductId
          }
        ],
        "commercialAttributesDeterminationModel": "MDLD73A2552-8AEC-4E47-8071-F5A4699E61C1",
        "configurationDeterminationModel": "MDL71D1A5B4-8848-470C-9498-9971829954EF"
      }
    });
    console.log(prd_rcmd_response_2)

    const pump = {}

    prd_rcmd_response_2.data.configurations.forEach((config) => {
      pump[config.characteristicName] = config.characteristicValueDescription
    })

    await UPDATE(Requirement).where({ID:requirement.ID}).set({
      status: 1,
      pump: {
        InletWidth            : pump.KSB_INLETWIDTH,
        OutletWidth           : pump.KSB_OUTLETWIDTH,
        MotorPerformance      : pump.KSB_MOTORPERFORMANCE,
        MotorPoles            : pump.KSB_MOTORPOLES,
        ImpellerDesign        : pump.KSB_IMPELLERDESIGN,
        ImpellerTrim          : pump.KSB_IMPELLERTRIM,
        InstallationType      : pump.KSB_INSTALLATIONTYPE,
        MotorEfficiency       : pump.KSB_MOTOREFFICIENCY,
        MaxInletPressure      : pump.KSB_MAXINLETPRESSURE,
        MaxOutletPressure     : pump.KSB_MAXOUTLETPRESSURE,
        ShaftAxisPosition     : pump.KSB_SHAFTAXISPOSITION,
        Materials             : pump.KSB_MATERIALS,
        GrossPrice            : prd_rcmd_response_2.data.commercialAttributes[0].unitGrossPrice,
        NetPrice              : prd_rcmd_response_2.data.commercialAttributes[0].unitNetPrice,
        COGS                  : prd_rcmd_response_2.data.commercialAttributes[0].unitCogs
      }
    })

  })

  this.on("pdfAnalyze", async (req) => {

    const {
      AzureOpenAiChatClient, AzureOpenAiEmbeddingClient, ChatMessages
    } = await import('@sap-ai-sdk/foundation-models');

    
      const chatClient = new AzureOpenAiChatClient('gpt-4o');

    const tender = await req.query
    const AttachmentService = await cds.connect.to("attachments")
    const attachment = await SELECT.one.from(Attachments).where({up__ID: tender[0].ID})

    const fileStream = await AttachmentService.get(Attachments, attachment)
    const base64 = await getBase64ForLLM(fileStream, attachment.mimeType)

    const tender_requirements_instruction = `
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

      const messageContentBase = [
        {
          "type": "text",
          "text": tender_instruction,
        }
      ]
      const messageContentRequirements = [
        {
          "type": "text",
          "text": tender_requirements_instruction,
        }
      ]

      base64.forEach((image) => {
        messageContentBase.push({
          "type": "image_url",
          "image_url": {
            "url":  `data:image/jpeg;base64,${image}`
          },
        })
        messageContentRequirements.push({
          "type": "image_url",
          "image_url": {
            "url":  `data:image/jpeg;base64,${image}`
          },
        })
      })


    const resBase = await chatClient.run({
      messages: [
        {
          role: 'user',
          content: messageContentBase
        }
      ]
    })

    let tenderBase_responseContent = resBase.getContent();
    tenderBase_responseContent = tenderBase_responseContent.replace('```json','');
    tenderBase_responseContent = tenderBase_responseContent.replace('```','');
    let jsonBase = JSON.parse(tenderBase_responseContent);
    
    // const jsonBase = parseJsonContent(resBase.getContent())

    const resRequirements = await chatClient.run({
      messages: [
        {
          role: 'user',
          content: messageContentRequirements
        }
      ]
    })
    let tenderRequirements_responseContent = resRequirements.getContent();
    tenderRequirements_responseContent = tenderRequirements_responseContent.replace('```json','');
    tenderRequirements_responseContent = tenderRequirements_responseContent.replace('```','');
    let jsonRequirements = JSON.parse(tenderRequirements_responseContent);
    // const jsonRequirements = parseJsonContent(resRequirements.getContent())

    const lastAnalyzedAt = new Date();
    const tenderObject = { status: 1, Description: tender[0].Description, TenderContent: tender[0].TenderContent, LastAnalyzedAt: lastAnalyzedAt, ContainsPump: jsonBase.HasPump == "True", HasCompetitor: jsonBase.HasCompetitor == "True", requirements: jsonRequirements };
    //await INSERT.into(Tender).entries(tender);
    //await cds.tx(req).run(INSERT.into(Tender).entries(tender));
    let tenderID = tender[0].ID;
    await UPDATE(Tender).where({ ID: tenderID }).set(tenderObject);

  })


    //@todo: Requirements speichern:
    // - Flow, Head, Voltage mit V ohne Leerzeichen, Frequenz mit Hz ohne Leerzeichen

    // const prd_rcmd = await cds.connect.to('API_PRODUCT_RECOMMENDATION');
    // const prd_rcmd_response = await prd_rcmd.send({
    //   method: "POST",
    //   path: "/DetermineProductSrv/Root",
    //   data: {
    //     "mlModel": "MDL62BB0FC9-FCE1-472A-9F67-1A76B10F977C",
    //     "productCategory": "Pumps",
    //     "topN": 1,
    //     "features": [
    //       {
    //         "name": "KSB_FLOW",
    //         "value": "30"
    //       },
    //       {
    //         "name": "KSB_HEAD",
    //         "value": "50"
    //       },
    //       {
    //         "name": "KSB_SUPPLYFREQUENCY",
    //         "value": "50HZ"
    //       },
    //       {
    //         "name": "KSB_RATEDVOLTAGE",
    //         "value": "400V"
    //       }
    //     ],
    //     "lowerthreshold": 0.00
    //   }
    // });

    // const prd_rcmd_response_2 = await prd_rcmd.send({
    //   method: "POST",
    //   path: "/DetermineProductConfigurationSrv/Root",
    //   data: {
    //     "topN": 1,
    //     "features": [
    //       {
    //         "name": "KSB_FLOW",
    //         "value": "30"
    //       },
    //       {
    //         "name": "KSB_HEAD",
    //         "value": "50"
    //       },
    //       {
    //         "name": "KSB_SUPPLYFREQUENCY",
    //         "value": "50HZ"
    //       },
    //       {
    //         "name": "KSB_RATEDVOLTAGE",
    //         "value": "400V"
    //       },
    //       {
    //         "name": "KMAT",
    //         "value": "S01B0T"
    //       }
    //     ],
    //     "commercialAttributesDeterminationModel": "MDLD73A2552-8AEC-4E47-8071-F5A4699E61C1",
    //     "configurationDeterminationModel": "MDL71D1A5B4-8848-470C-9498-9971829954EF"
    //   }
    // });

    // console.log(prd_rcmd_response);
    // console.log('_________________________________')
    // console - log(prd_rcmd_response_2);
}