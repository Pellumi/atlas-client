import api from "./api"

const careerProfileService = {
  // Get user's career profile
  getProfile: async () => {
    try {
      const response = await api.get("/career-profile/")
      return response.data
    } catch (error) {
      console.error("Error fetching career profile:", error)
      throw error
    }
  },

  // Create or update career profile
  updateProfile: async (formData) => {
    try {
      const response = await api.post("/career-profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error updating career profile:", error)
      throw error
    }
  },
}

export default careerProfileService
