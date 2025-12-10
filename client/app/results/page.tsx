"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { DocumentCard } from "@/components/document-card"
import { apiClient } from "@/lib/api-client"
import type { Document } from "@/lib/types"
import { ChevronLeft, Loader } from "lucide-react"

function ResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(!!query)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    if (query) {
      fetchResults(query)
    }
  }, [query])

  const fetchResults = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const results = await apiClient.search(searchQuery)
      setDocuments(results.documents || [])
      setTotalCount(results.totalCount || 0)
    } catch (error) {
      console.error("Failed to fetch results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (newQuery: string) => {
    setIsLoading(true)
    const url = new URL(window.location.href)
    url.searchParams.set("q", newQuery)
    window.history.pushState({}, "", url)
    await fetchResults(newQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1F43C0] hover:opacity-80 mb-4">
            <ChevronLeft size={20} />
            Back to search
          </Link>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {!isLoading && query && (
          <div className="mb-6">
            <h2 className="font-sans font-bold text-2xl text-[#1F43C0]">Search results for "{query}"</h2>
            <p className="text-gray-600 text-sm mt-1">Found {totalCount} documents</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-[#1F43C0]" size={32} />
          </div>
        )}

        {!isLoading && documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}

        {!isLoading && documents.length === 0 && query && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No documents found for your search.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
