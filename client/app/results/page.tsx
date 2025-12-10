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
  const [searchMode, setSearchMode] = useState<"text" | "file">("text")
  const [fileName, setFileName] = useState<string | null>(null)


  useEffect(() => {
    if (query) {
      setFileName(null)
      setSearchMode("text")
      
      fetchResults(query)
    }
  }, [query])

  const fetchResults = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const results = await apiClient.search(searchQuery)

      setDocuments(results || [])
      setTotalCount(results.length || 0)
    } catch (error) {
      console.error("Failed to fetch results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchResultsFile = async (file: File) => {
    try {
      const results = await apiClient.searchByFile(file)
      setDocuments(results || [])
      setTotalCount(results.length || 0)
    } catch (error) {
      console.error("Failed to search by file:", error)
    } finally {
      setIsLoading(false)
    }
  } 

  const handleSearch = async (newQuery: string) => {
    // setFileName(null)
    // setSearchMode("text")
    // setIsLoading(true)
    
    const url = new URL(window.location.href)
    url.searchParams.set("q", newQuery)
    window.history.pushState({}, "", url)
    // await fetchResults(newQuery)
  }

  const handleFileSearch = async (file: File) => {
    setFileName(file.name)
    setSearchMode("file")
    setIsLoading(true)
    
    const url = new URL(window.location.href)
    url.searchParams.delete("q")
    window.history.pushState({}, "", url)
    await fetchResultsFile(file)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#0E1D40] hover:opacity-80 mb-4">
            <ChevronLeft size={20} />
            Back to search
          </Link>
          <SearchBar onSearch={handleSearch} onFileUpload={handleFileSearch} isLoading={isLoading} />
        </div>

        {!isLoading && searchMode === "text" && query && (
          <div className="mb-6">
            <h2 className="font-sans font-bold text-2xl text-[#0E1D40]">Search results for "{query}"</h2>
            <p className="text-gray-600 text-sm mt-1">Found {totalCount} documents</p>
          </div>
        )}

        {!isLoading && searchMode === "file" && (
          <div className="mb-6">
            <h2 className="font-sans font-bold text-2xl text-[#0E1D40]">
              {query ? `Search results for "${query}"` : `Search results from ${fileName}`}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Found {totalCount} documents
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-[#0E1D40]" size={32} />
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
