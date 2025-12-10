"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onFileUpload?: (file: File) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, onFileUpload, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileUpload) {
      onFileUpload(file)
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <div className="flex-1 relative flex items-center bg-[#9DFECB] rounded-full px-5 py-3 border-2 border-[#9DFECB]">
        {onFileUpload && (
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            title="Upload a document"
          />
        )}
        
        {onFileUpload && (
          <button
            type="button"
            onClick={() => document.querySelector('input[type="file"]')?.click()}
            className="text-2xl font-bold text-[#1F43C0] mr-3 hover:opacity-80 cursor-pointer"
          >
            +
          </button>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for documents..."
          className="flex-1 bg-transparent outline-none text-[#1F43C0] placeholder-[#1F43C0]/60 font-blinker"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="text-[#1F43C0] hover:opacity-80 disabled:opacity-50 cursor-pointer"
          title="Search"
        >
          <Search size={24} />
        </button>
      </div>
    </div>
  )
}
