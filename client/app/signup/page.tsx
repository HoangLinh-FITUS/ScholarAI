"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      await signup(email, password, name)
    } catch (err) {
      setError("Signup failed. Please try again.")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#1F43C0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif font-bold text-4xl text-[#9DFECB]">DocBert</h1>
          <p className="text-[#9DFECB] mt-2 text-sm">Document Search Engine</p>
        </div>

        {/* Signup form */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="font-sans font-bold text-2xl text-[#1F43C0] mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F43C0]"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F43C0]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F43C0]"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Confirm password input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F43C0]"
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
              className="w-full bg-[#1F43C0] text-white font-bold py-2 rounded-lg hover:bg-[#0D2580] disabled:opacity-50 transition-colors mt-6"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1F43C0] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
