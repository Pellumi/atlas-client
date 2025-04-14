import api from "./api"

const careerProfileService = {
  // Get user's career profile
  getProfile: async () => {
    const response = await api.get("/career-profile/")
    return response.data
  },

  // Create or update career profile
  updateProfile: async (formData) => {
    const response = await api.post("/career-profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  // Test file upload functionality
  testUpload: async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/career-profile/test", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },
}

export default careerProfileService
