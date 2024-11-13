module.exports = function (){
    
    // Register your event handlers in here, for example, ...
    this.on ('Analyze', async (req) => {
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
      const chatClient = new AzureOpenAiChatClient( 'gpt-4o');
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

      //String der Responses jeweils als json
      //

      //Speichern des Tenders ANLEGEN (separater Button) mit:
      // - Last analyzed at: leer
      // - Description
      // - Tender Content      

      //Speichern des Tenders ANALYZE mit:
      // - Last analyzed at: <timestamp>
      // - Description
      // - Tender Content
      // - Tender has pump
      // - Tender has competitors
      //...

      //zusätzlich Requirements speichern:
      // - Flow, Head, Voltage mit V ohne Leerzeichen, Frequenz mit Hz ohne Leerzeichen

      //const bupa = await cds.connect.to('API_PRODUCT_RECOMMENDATION');


    })
  }