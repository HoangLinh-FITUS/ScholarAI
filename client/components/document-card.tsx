"use client"

import type { Document } from "@/lib/types"
import Link from "next/link"

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`${document.url_abs}`} target="_blank" rel="noopener noreferrer">
      <article className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
        <h3 className="font-sans font-bold text-lg text-[#0E1D40] mb-2 line-clamp-2">{document.title}</h3>
        <span className="inline-block mb-3 text-xs bg-[#0E1D40]/10 text-[#0E1D40] px-2 py-1 rounded">
          {document.category}
        </span>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{document.abstract}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {document.authors.split(",").slice(0, 3).map((author, idx) => (
            <span key={idx} className="text-xs bg-[#CCF5AC]/20 text-[#0E1D40] px-2 py-1 rounded">
              {author}
            </span>
          ))}
          {document.authors.split(",").length > 3 && (
            <span className="text-xs text-gray-500">+{document.authors.split(",").length - 3} more</span>
          )}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{new Date(document.publicationDate).toLocaleDateString("vi-VN")}</span>
          <span className="font-sans font-bold text-[#0E1D40]">
            {(document.relevanceScore * 100).toFixed(0)}% match
          </span>
        </div>
      </article>
    </Link>
  )
}
