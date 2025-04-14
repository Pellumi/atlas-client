import api from "./api"

const resumeGuidanceService = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get("/career-conversation/get")
    return response.data
  },

  // Get a specific conversation by ID
  getConversation: async (conversationId) => {
    const response = await api.get(`/career-conversation/${conversationId}/get-message`)
    return response.data
  },

  // Create a new conversation
  createConversation: async (question, file = null, useProfileResume = false) => {
    // For now, we'll ignore file uploads since the career API doesn't support it
    // We'll just pass the question
    const response = await api.post("/career-conversation/create", {
      question,
      // We could add metadata about files here if needed
      hasFile: !!file || useProfileResume,
    })
    return response.data
  },

  // Send a message to an existing conversation
  sendMessage: async (conversationId, message, file = null, useProfileResume = false) => {
    const response = await api.post("/career-conversation/send-message", {
      conversation_id: conversationId,
      question: message,
      // We could add metadata about files here if needed
      hasFile: !!file || useProfileResume,
    })
    return response.data
  },

  // Provide feedback for a message (mock implementation)
  provideFeedback: async (messageId, feedback) => {
    try {
      // Since there's no feedback API, we'll just mock a successful response
      console.log(`Feedback provided for message ${messageId}: ${feedback}`)
      return { success: true }
    } catch (error) {
      console.warn("Feedback API not implemented:", error)
      return { success: true } // Return mock success
    }
  },

  // Get suggested questions (mock implementation)
  getSuggestedQuestions: async (type = "resume") => {
    // Since there's no API for this, we'll return hardcoded questions
    if (type === "career") {
      return [
        "What career path is best for me with my current skills?",
        "How can I transition to a software engineering role?",
        "What skills should I develop for my dream job?",
        "What volunteer work would benefit my career?",
      ]
    } else {
      return [
        "How can I improve my resume?",
        "What skills should I highlight for a software developer role?",
        "How should I format my work experience section?",
        "What's the best resume format for recent graduates?",
      ]
    }
  },
}

export default resumeGuidanceService
