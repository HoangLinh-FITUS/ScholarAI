"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AuthContext, type User } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("docbert_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect to login if not authenticated and trying to access protected routes
  useEffect(() => {
    if (!isLoading && !user && !["/login", "/signup"].includes(pathname)) {
      router.push("/login")
    }
  }, [isLoading, user, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.login(email, password)
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
      }
      setUser(userData)
      localStorage.setItem("docbert_user", JSON.stringify(userData))
      localStorage.setItem("docbert_token", response.token)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.signup(email, password, name)
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
      }
      setUser(userData)
      localStorage.setItem("docbert_user", JSON.stringify(userData))
      localStorage.setItem("docbert_token", response.token)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("docbert_user")
      localStorage.removeItem("docbert_token")
      router.push("/login")
    }
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
