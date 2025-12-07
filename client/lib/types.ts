// Document types for API responses
export interface Document {
  id: string
  title: string
  abstract: string
  authors: string[]
  publicationDate: string
  relevanceScore: number
  fileUrl?: string
  citations?: number
  tags?: string[]
}

export interface SearchQuery {
  query: string
  fileId?: string
  limit?: number
  offset?: number
}

export interface SearchResponse {
  documents: Document[]
  totalCount: number
  query: string
}

export interface DocumentDetails extends Document {
  fullContent?: string
  relatedDocuments?: Document[]
}
