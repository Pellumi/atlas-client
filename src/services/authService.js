import api from "./api"

const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  register: async (data) => {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },
}

export default authService
