module.exports = function (){
    
    // Register your event handlers in here, for example, ...
    this.on ('Analyze', async (req) => {
      let query = await req.query  
      console.log('Button has been pressed: ', query[0].TenderContent)
      const {
        AzureOpenAiChatClient, AzureOpenAiEmbeddingClient
      } = await import('@sap-ai-sdk/foundation-models');

      const instruction = `
      Extract from the text at the end of this prompt the pressure head, nominal flow, voltage and frequency and provide the response as JSON in the example format below.
      Return only the number values for above JSON without the units.
      
      {
             "Flow" : "5 m³/h",
             "Head" : "1 m",
             "SupplyFrequency" : "50 Hz",
             "RatedVoltage" : "400 V"
      }
      `;

      const llmRequest = instruction + query[0].TenderContent
      console.log('LLM request: ', llmRequest)


      // For a chat client
      const chatClient = new AzureOpenAiChatClient( 'gpt-4o');
      // For an embedding client
      const embeddingClient = new AzureOpenAiEmbeddingClient({ modelName: 'gpt-4o' });
      const response = await chatClient.run({
        messages: [
          {
            role: 'user',
            content: llmRequest
          }
        ]
      });
      
      const responseContent = response.getContent();
      console.log(responseContent)
    })
  }