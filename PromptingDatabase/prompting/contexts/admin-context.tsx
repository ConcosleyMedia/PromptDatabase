"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  login: () => void
  logout: () => void
  requireAdmin: () => Promise<boolean>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check localStorage for admin session
    const adminSession = localStorage.getItem("admin-session")
    if (adminSession) {
      const sessionData = JSON.parse(adminSession)
      // Check if session is still valid (24 hours)
      const now = Date.now()
      if (now - sessionData.timestamp < 24 * 60 * 60 * 1000) {
        setIsAdmin(true)
      } else {
        localStorage.removeItem("admin-session")
      }
    }
  }, [])

  const login = () => {
    setIsAdmin(true)
    // Store admin session in localStorage
    localStorage.setItem("admin-session", JSON.stringify({
      authenticated: true,
      timestamp: Date.now()
    }))
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("admin-session")
  }

  const requireAdmin = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isAdmin) {
        resolve(true)
      } else {
        // This will be handled by components that need admin access
        resolve(false)
      }
    })
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, requireAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}