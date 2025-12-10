"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { apiClient } from "@/lib/api-client"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    try {
      // const results = await apiClient.search(query)
      router.push(`/results?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error("Search error:", error)
      alert("Search failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // const handleFileUpload = async (file: File) => {
  //   setIsLoading(true)
  //   try {
  //     const results = await apiClient.searchByFile(file)
  //     router.push(`/results?file=${file.name}`)
  //   } catch (error) {
  //     console.error("File upload error:", error)
  //     alert("File upload failed. Please try again.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="min-h-screen bg-[#0E1D40] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <h2 className="font-sans font-bold text-5xl md:text-6xl text-[#CCF5AC] text-center mb-6">MyTalkingBert</h2>

          <p className="font-serif font-bold text-2xl md:text-3xl text-center mb-12">
            <span className="text-[#CCF5AC]">Hello! Ready to find the </span>
            <span className="text-white">documents</span>
            <span className="text-[#CCF5AC]"> you need?</span>
          </p>

          {/* <SearchBar onSearch={handleSearch} onFileUpload={handleFileUpload} isLoading={isLoading} /> */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}
