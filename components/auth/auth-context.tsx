"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "hq_admin" | "station_personnel" | "driver"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  stationId?: string
  busId?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@stc.com",
    role: "hq_admin",
  },
  {
    id: "2",
    name: "Mary Station",
    email: "station@stc.com",
    role: "station_personnel",
    stationId: "accra-central",
  },
  {
    id: "3",
    name: "David Driver",
    email: "driver@stc.com",
    role: "driver",
    busId: "GH-1234-20",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "password") {
      setUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
