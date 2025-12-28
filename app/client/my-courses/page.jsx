"use client"

import { CourseCard } from "@/components/course-card"
import { mockCourses, mockEnrollments } from "@/lib/data"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function MyCoursesPage() {
  const { currentUser } = useUser()
  const router = useRouter()

  const enrolledCourses = mockEnrollments
    .filter((e) => e.clientId === currentUser?.id)
    .map((enrollment) => {
      const course = mockCourses.find((c) => c.id === enrollment.courseId)
      return { ...enrollment, course }
    })
    .filter((e) => e.course)

  const handleViewDetails = (courseId) => {
    router.push(`/client/courses/${courseId}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">My Courses</h1>
        <p className="text-muted-foreground">Track and manage your enrolled fitness courses</p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((enrollment) =>
            enrollment.course ? (
              <CourseCard
                key={enrollment.id}
                course={enrollment.course}
                onViewDetails={handleViewDetails}
                isEnrolled={true}
                progress={enrollment.progress}
              />
            ) : null,
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2 text-foreground">No Enrolled Courses</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start your fitness journey by browsing and enrolling in courses that match your goals
            </p>
            <Button size="lg" onClick={() => router.push("/client/courses")}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

