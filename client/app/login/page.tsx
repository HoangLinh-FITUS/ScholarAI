"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
    } catch (err) {
      setError("Login failed. Please check your credentials.")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E1D40] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif font-bold text-4xl text-[#CCF5AC]">DocBert</h1>
          <p className="text-[#CCF5AC] mt-2 text-sm">Document Search Engine</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="font-sans font-bold text-2xl text-[#0E1D40] mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E1D40]"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E1D40]"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Error message */}
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0E1D40] text-white font-bold py-2 rounded-lg hover:bg-[#0D2580] disabled:opacity-50 transition-colors mt-6"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#0E1D40] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
