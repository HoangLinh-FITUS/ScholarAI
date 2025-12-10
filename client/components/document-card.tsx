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
        <h3 className="font-sans font-bold text-lg text-[#1F43C0] mb-2 line-clamp-2">{document.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{document.abstract}</p>
        {/* <div className="flex flex-wrap gap-2 mb-3">
          {document.authors.slice(0, 3).map((author, idx) => (
            <span key={idx} className="text-xs bg-[#9DFECB]/20 text-[#1F43C0] px-2 py-1 rounded">
              {author}
            </span>
          ))}
          {document.authors.length > 3 && (
            <span className="text-xs text-gray-500">+{document.authors.length - 3} more</span>
          )}
        </div> */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{new Date(document.publicationDate).toLocaleDateString("vi-VN")}</span>
          <span className="font-sans font-bold text-[#1F43C0]">
            {(document.relevanceScore * 100).toFixed(0)}% match
          </span>
        </div>
      </article>
    </Link>
  )
}
