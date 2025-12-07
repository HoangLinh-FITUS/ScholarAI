"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { DocumentCard } from "@/components/document-card"
import { apiClient } from "@/lib/api-client"
import type { DocumentDetails } from "@/lib/types"
import { ChevronLeft, Download, Loader } from "lucide-react"

export default function DocumentDetailsPage() {
  const params = useParams()
  const documentId = params.id as string
  const [document, setDocument] = useState<DocumentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true)
      try {
        const details = await apiClient.getDocumentDetails(documentId)
        setDocument(details)
      } catch (error) {
        console.error("Failed to fetch document:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocument()
  }, [documentId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader className="animate-spin text-[#1F43C0]" size={32} />
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1F43C0] hover:opacity-80 mb-4">
            <ChevronLeft size={20} />
            Back to search
          </Link>
          <p className="text-gray-500">Document not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#1F43C0] hover:opacity-80 mb-6">
          <ChevronLeft size={20} />
          Back to search
        </Link>

        {/* Document header */}
        <article className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h1 className="font-sans font-bold text-4xl text-[#1F43C0] mb-4">{document.title}</h1>

          {/* Authors */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Authors</p>
            <div className="flex flex-wrap gap-2">
              {document.authors.map((author, idx) => (
                <span key={idx} className="bg-[#9DFECB]/20 text-[#1F43C0] px-3 py-1 rounded text-sm">
                  {author}
                </span>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Publication Date</p>
              <p className="font-sans font-bold text-[#1F43C0]">
                {new Date(document.publicationDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Relevance Score</p>
              <p className="font-sans font-bold text-[#1F43C0]">{(document.relevanceScore * 100).toFixed(1)}%</p>
            </div>
            {document.citations !== undefined && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Citations</p>
                <p className="font-sans font-bold text-[#1F43C0]">{document.citations}</p>
              </div>
            )}
            {document.fileUrl && (
              <div>
                <a
                  href={document.fileUrl}
                  download
                  className="inline-flex items-center gap-1 bg-[#1F43C0] text-white px-3 py-2 rounded text-sm hover:opacity-90"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            )}
          </div>

          {/* Abstract */}
          <div className="mb-8">
            <h2 className="font-sans font-bold text-xl text-[#1F43C0] mb-3">Abstract</h2>
            <p className="text-gray-700 leading-relaxed">{document.abstract}</p>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="font-sans font-bold text-xl text-[#1F43C0] mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related documents */}
        {document.relatedDocuments && document.relatedDocuments.length > 0 && (
          <section>
            <h2 className="font-sans font-bold text-2xl text-[#1F43C0] mb-4">Related Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {document.relatedDocuments.map((relatedDoc) => (
                <DocumentCard key={relatedDoc.id} document={relatedDoc} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
