// Centralized API client for backend integration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const apiClient = {
  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error("Login failed")
    return response.json()
  },

  async signup(email: string, password: string, name: string) {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    if (!response.ok) throw new Error("Signup failed")
    return response.json()
  },

  async logout() {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Logout failed")
    return response.json()
  },

  // Search for documents
  async search(query: string, limit = 10, offset = 0) {
    const response = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit, offset }),
    })
    if (!response.ok) throw new Error("Search failed")
    return response.json()
  },

  // Search by uploading a file
  async searchByFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch(`${BASE_URL}/search-by-file`, {
      method: "POST",
      body: formData,
    })
    if (!response.ok) throw new Error("File upload failed")
    return response.json()
  },

  // Get document details
  async getDocumentDetails(documentId: string) {
    const response = await fetch(`${BASE_URL}/documents/${documentId}`)
    if (!response.ok) throw new Error("Failed to fetch document details")
    return response.json()
  },
}
