"use client"

import { CourseList } from "@/components/course-list"
import { useUser } from "@/contexts/user-context"
import { useData } from "@/contexts/data-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function BrowseCoursesPage() {
  const { currentUser } = useUser()
  const { courses, enrollments, dispatch } = useData()
  const router = useRouter()
  const { toast } = useToast()

  const enrolledCourses = enrollments.filter((e) => e.clientId === currentUser?.id)

  const handleEnroll = (courseId) => {
    // Add enrollment logic here
    const newEnrollment = {
      id: Date.now().toString(),
      clientId: currentUser.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      sessionsAttended: 0,
      totalSessions: 12, // Default value
    }
    dispatch({ type: "ADD_ENROLLMENT", payload: newEnrollment })

    toast({
      title: "Enrollment Successful!",
      description: "You have been enrolled in the course.",
    })
  }

  const handleViewDetails = (courseId) => {
    router.push(`/client/courses/${courseId}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Browse Fitness Courses</h1>
        <p className="text-muted-foreground">Find the perfect course to match your fitness goals</p>
      </div>

      <CourseList
        courses={courses}
        onEnroll={handleEnroll}
        onViewDetails={handleViewDetails}
        enrolledCourses={enrolledCourses}
      />
    </main>
  )
}

