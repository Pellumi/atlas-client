import api from "./api"

const chatService = {
  // Get all conversations for the current user
  getConversations: async () => {
    const response = await api.get("/conversation/get")
    return response.data
  },

  // Get a specific conversation by ID with its messages
  getConversation: async (conversationId) => {
    // First get the conversation details
    const conversations = await chatService.getConversations()
    const conversation = conversations.find((c) => c._id === conversationId || c.id === conversationId)

    // Then get the messages
    const messagesResponse = await api.get(`/conversation/${conversationId}/get-message`)

    return {
      ...conversation,
      messages: messagesResponse.data,
    }
  },

  // Create a new conversation
  createConversation: async (question = "New conversation") => {
    const response = await api.post("/conversation/create", { question })
    return response.data
  },

  // Update conversation title
  updateConversationTitle: async (conversationId, title) => {
    const response = await api.put(`/conversations/${conversationId}`, { title })
    return response.data
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/conversations/${conversationId}`)
    return response.data
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`)
    return response.data
  },

  // Send a message in a conversation
  sendMessage: async (conversationId, question) => {
    const response = await api.post("/conversation/send-message", {
      conversation_id: conversationId,
      question,
    })
    return response.data
  },

  // Provide feedback on an AI message (if your API supports this)
  provideFeedback: async (messageId, feedback) => {
    // If your API doesn't support this yet, you can implement it later
    try {
      const response = await api.post(`/message/${messageId}/feedback`, { feedback })
      return response.data
    } catch (error) {
      console.warn("Feedback API not implemented yet:", error)
      return { success: true } // Return mock success for now
    }
  },
}

export default chatService
