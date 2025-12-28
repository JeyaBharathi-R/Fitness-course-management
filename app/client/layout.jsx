import React from "react"
import { UserProvider } from "@/contexts/user-context"
import { Header } from "@/components/header"

export default function ClientLayout({ children }) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-background">
        <Header />
        {children}
      </div>
    </UserProvider>
  )
}

