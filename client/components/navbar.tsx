"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-[#1F43C0] border-b border-[#0D2580]">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif font-bold text-3xl text-[#9DFECB] hover:opacity-80 transition-opacity">
          DocBert
        </Link>

        <button
          onClick={handleLogout}
          className="px-6 py-2 border-2 border-[#9DFECB] rounded-full text-[#9DFECB] font-serif font-bold text-lg hover:bg-[#9DFECB] hover:text-[#1F43C0] transition-colors"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
