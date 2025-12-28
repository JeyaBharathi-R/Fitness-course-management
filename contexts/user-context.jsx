"use client"

import { createContext, useContext, useState } from "react"
import { mockUsers } from "@/lib/data"

const UserContext = createContext(undefined)

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(mockUsers[0])

  const switchRole = (role) => {
    const user = mockUsers.find((u) => u.role === role)
    if (user) {
      setCurrentUser(user)
    }
  }

  return <UserContext.Provider value={{ currentUser, setCurrentUser, switchRole }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

