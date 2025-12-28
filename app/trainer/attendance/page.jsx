"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/contexts/user-context"
import { mockCourses, mockSessions, mockEnrollments, mockUsers } from "@/lib/data"
import { Calendar, Users, CheckCircle, XCircle, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AttendancePage() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [selectedCourse, setSelectedCourse] = useState("all")

  const trainerCourses = mockCourses.filter((c) => c.trainerId === currentUser?.id)

  const filteredSessions = mockSessions
    .filter((s) => trainerCourses.some((c) => c.id === s.courseId))
    .filter((s) => selectedCourse === "all" || s.courseId === selectedCourse)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSaveAttendance = (sessionId) => {
    toast({
      title: "Attendance Saved",
      description: "Session attendance has been updated successfully.",
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Attendance Tracking</h1>
        <p className="text-muted-foreground">Monitor and manage student attendance for your sessions</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {trainerCourses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{filteredSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {filteredSessions.length > 0
                ? Math.round(
                    filteredSessions.reduce((acc, s) => acc + s.attendance.length, 0) / filteredSessions.length,
                  )
                : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {filteredSessions.length > 0
                ? Math.round(
                    (filteredSessions.reduce((acc, s) => acc + s.attendance.length, 0) /
                      (filteredSessions.length *
                        mockEnrollments.filter((e) => trainerCourses.some((c) => c.id === e.courseId)).length)) *
                      100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-6">
          {filteredSessions.map((session) => {
            const course = trainerCourses.find((c) => c.id === session.courseId)
            const enrolledStudents = mockEnrollments
              .filter((e) => e.courseId === session.courseId)
              .map((enrollment) => {
                const student = mockUsers.find((u) => u.id === enrollment.clientId)
                const attended = session.attendance.includes(enrollment.clientId)
                return { ...enrollment, student, attended }
              })
              .filter((e) => e.student)

            const attendanceRate =
              enrolledStudents.length > 0 ? Math.round((session.attendance.length / enrolledStudents.length) * 100) : 0

            const isPast = new Date(session.date) < new Date()

            return (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course?.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>{session.time}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={isPast ? "secondary" : "default"}>{isPast ? "Completed" : "Upcoming"}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {session.attendance.length}/{enrolledStudents.length} attended ({attendanceRate}%)
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">Student Attendance</h4>
                    <div className="space-y-2">
                      {enrolledStudents.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Checkbox id={`${session.id}-${enrollment.clientId}`} checked={enrollment.attended} />
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={enrollment.student?.avatar || "/placeholder.svg"}
                                alt={enrollment.student?.name}
                              />
                              <AvatarFallback>{enrollment.student?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{enrollment.student?.name}</p>
                              <p className="text-sm text-muted-foreground">{enrollment.student?.email}</p>
                            </div>
                          </div>
                          {enrollment.attended ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Present
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Absent
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {isPast && (
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => handleSaveAttendance(session.id)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Update Attendance
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2 text-foreground">No Sessions Found</h3>
            <p className="text-muted-foreground text-center">No sessions available for the selected course</p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

