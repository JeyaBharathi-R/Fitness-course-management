"use client"

import { TrainerDashboard } from "@/components/trainer-dashboard"
import { useUser } from "@/contexts/user-context"
import { useData } from "@/contexts/data-context"
import { useRouter } from "next/navigation"

export default function TrainerDashboardPage() {
  const { currentUser } = useUser()
  const { courses, sessions, enrollments, progressRecords } = useData()
  const router = useRouter()

  const handleCreateCourse = () => {
    router.push("/trainer/courses/new")
  }

  const handleEditCourse = (courseId) => {
    router.push(`/trainer/courses/${courseId}/edit`)
  }

  const handleViewAttendance = (courseId) => {
    router.push(`/trainer/attendance?course=${courseId}`)
  }

  const handleViewReports = (type) => {
    router.push(`/trainer/reports?type=${type}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Trainer Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses, sessions, and track student progress</p>
      </div>

      <TrainerDashboard
        courses={courses}
        sessions={sessions}
        enrollments={enrollments}
        progressRecords={progressRecords}
        onCreateCourse={handleCreateCourse}
        onEditCourse={handleEditCourse}
        onViewAttendance={handleViewAttendance}
        onViewReports={handleViewReports}
      />
    </main>
  )
}

