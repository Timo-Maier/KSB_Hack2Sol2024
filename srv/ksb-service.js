module.exports = function (){
    
    // Register your event handlers in here, for example, ...
    this.on ('Analyze', async (req) => {
      let query = await req.query  
      console.log('Button has been pressed: ', query[0].TenderContent)
      const {
        AzureOpenAiChatClient, AzureOpenAiEmbeddingClient
      } = await import('@sap-ai-sdk/foundation-models');
      // For a chat client
      const chatClient = new AzureOpenAiChatClient( 'gpt-4o');
      // For an embedding client
      const embeddingClient = new AzureOpenAiEmbeddingClient({ modelName: 'gpt-4o' });
      const response = await chatClient.run({
        messages: [
          {
            role: 'user',
            content: 'What is the best pump company in the world?'
          }
        ]
      });
      
      const responseContent = response.getContent();
      console.log(responseContent)
    })
  }