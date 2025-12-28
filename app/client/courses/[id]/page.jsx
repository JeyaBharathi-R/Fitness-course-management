"use client"

import { use } from "react"
import { CourseDetails } from "@/components/course-details"
import { useUser } from "@/contexts/user-context"
import { useData } from "@/contexts/data-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CourseDetailsPage({ params }) {
  const { id } = use(params)
  const { currentUser } = useUser()
  const { courses, enrollments, dispatch } = useData()
  const router = useRouter()
  const { toast } = useToast()

  const course = courses.find((c) => c.id === id)
  const enrollment = enrollments.find((e) => e.clientId === currentUser?.id && e.courseId === id)
  const isEnrolled = !!enrollment

  if (!course) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Course not found</p>
      </main>
    )
  }

  const handleEnroll = (courseId) => {
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
      description: `You have been enrolled in ${course.title}`,
    })
    router.push("/client/my-courses")
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <CourseDetails
        course={course}
        onEnroll={handleEnroll}
        onBack={handleBack}
        isEnrolled={isEnrolled}
        enrollment={enrollment}
      />
    </main>
  )
}
