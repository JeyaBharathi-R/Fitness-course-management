"use client"

import { ProgressDashboard } from "@/components/progress-dashboard"
import { useUser } from "@/contexts/user-context"
import { useData } from "@/contexts/data-context"

export default function ClientProgressPage() {
  const { currentUser } = useUser()
  const { enrollments, progressRecords, sessions } = useData()

  const userEnrollments = enrollments.filter((e) => e.clientId === currentUser?.id)
  const userProgressRecords = progressRecords.filter((p) => p.clientId === currentUser?.id)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">My Progress</h1>
        <p className="text-muted-foreground">Track your performance and achievements across all courses</p>
      </div>

      <ProgressDashboard
        enrollments={userEnrollments}
        progressRecords={userProgressRecords}
        sessions={sessions}
      />
    </main>
  )
}

