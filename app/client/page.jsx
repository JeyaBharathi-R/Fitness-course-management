"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { mockCourses, mockEnrollments } from "@/lib/data"
import { Calendar, TrendingUp, Award, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ClientDashboard() {
  const { currentUser } = useUser()
  const router = useRouter()

  // Get enrolled courses for the current client
  const enrolledCourses = mockEnrollments
    .filter((e) => e.clientId === currentUser?.id)
    .map((enrollment) => {
      const course = mockCourses.find((c) => c.id === enrollment.courseId)
      return { ...enrollment, course }
    })
    .filter((e) => e.course)

  const totalSessions = enrolledCourses.reduce((acc, e) => acc + e.totalSessions, 0)
  const attendedSessions = enrolledCourses.reduce((acc, e) => acc + e.sessionsAttended, 0)
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((acc, e) => acc + e.progress, 0) / enrolledCourses.length)
    : 0

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back, {currentUser?.name}!</h1>
        <p className="text-muted-foreground">Track your fitness progress and manage your courses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {attendedSessions}/{totalSessions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalSessions ? Math.round((attendedSessions / totalSessions) * 100) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {attendedSessions >= 10 ? 3 : attendedSessions >= 5 ? 2 : 1}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Active Courses</h2>
          <Button onClick={() => router.push("/client/courses")}>Browse More Courses</Button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourses.map((enrollment) => (
              <Card key={enrollment.id} className="overflow-hidden">
                <div className="relative h-32 bg-muted">
                  <img
                    src={enrollment.course?.image || "/placeholder.svg?height=150&width=400"}
                    alt={enrollment.course?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{enrollment.course?.title}</CardTitle>
                      <CardDescription className="mt-1">Trainer: {enrollment.course?.trainer}</CardDescription>
                    </div>
                    <Badge>{enrollment.course?.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="font-medium">{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-medium">
                      {enrollment.sessionsAttended}/{enrollment.totalSessions}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push("/client/progress")}
                  >
                    View Progress
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-foreground">No Active Courses</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start your fitness journey by enrolling in a course
              </p>
              <Button onClick={() => router.push("/client/courses")}>Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

