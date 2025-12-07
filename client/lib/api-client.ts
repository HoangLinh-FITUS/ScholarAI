// Centralized API client for backend integration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const apiClient = {
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
