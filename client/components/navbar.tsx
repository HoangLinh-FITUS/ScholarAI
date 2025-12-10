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
    <nav className="bg-[#0E1D40] border-b border-[#0D2580]">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif font-bold text-3xl text-[#CCF5AC] hover:opacity-80 transition-opacity">
          DocBert
        </Link>

        <button
          onClick={handleLogout}
          className="px-6 py-2 border-2 border-[#CCF5AC] rounded-full text-[#CCF5AC] font-serif font-bold text-lg hover:bg-[#CCF5AC] hover:text-[#0E1D40] transition-colors"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
