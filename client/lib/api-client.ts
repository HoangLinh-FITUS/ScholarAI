// Centralized API client for backend integration
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const SEARCH_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export const apiClient = {
  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error("Login failed")
    return response.json()
  },

  async signup(email: string, password: string, name: string) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        "email": email, 
        "password": password, 
        "full_name": name, 
        "role": "user", 
        "phone": "1234567889"
      }),
    })
    if (!response.ok) throw new Error("Signup failed")
    return response.json()
  },

  async logout() {
    const token = localStorage.getItem("docbert_token")

    const response = await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
    })
    console.log(response.ok)
    if (!response.ok) throw new Error("Logout failed")
    return response.json()
  },

  // Search for documents
  async search(query: string, limit = 10, offset = 0) {
    const response = await fetch(`${SEARCH_BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit }),
    })
    if (!response.ok) throw new Error("Search failed")
    return response.json()
  },

  // Search by uploading a file
  async searchByFile(file: File, limit=10) {
    const formData = new FormData()
    formData.append("file", file)
    
    const response = await fetch(`${SEARCH_BASE_URL}/search-by-file?limit=${limit}`, {
      method: "POST",
      body: formData,
    })
    if (!response.ok) throw new Error("File upload failed")
    return response.json()
  },

  // Get document details
  async getDocumentDetails(documentId: string) {
    const response = await fetch(`${SEARCH_BASE_URL}/documents/${documentId}`)
    if (!response.ok) throw new Error("Failed to fetch document details")
    return response.json()
  },
}
