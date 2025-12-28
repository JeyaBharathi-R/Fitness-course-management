"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/user-context"
import { mockCourses, mockEnrollments, mockSessions, mockProgressRecords, mockUsers } from "@/lib/data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Download, TrendingUp, Users, Calendar, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [selectedCourse, setSelectedCourse] = useState("all")

  const trainerCourses = mockCourses.filter((c) => c.trainerId === currentUser?.id)

  const filteredCourses =
    selectedCourse === "all" ? trainerCourses : trainerCourses.filter((c) => c.id === selectedCourse)

  // Calculate stats
  const totalEnrollments = mockEnrollments.filter((e) => trainerCourses.some((c) => c.id === e.courseId))
  const totalSessions = mockSessions.filter((s) => trainerCourses.some((c) => c.id === s.courseId))
  const avgAttendance =
    totalSessions.length > 0
      ? Math.round(totalSessions.reduce((acc, s) => acc + s.attendance.length, 0) / totalSessions.length)
      : 0

  // Performance data by course
  const performanceData = filteredCourses.map((course) => {
    const courseEnrollments = mockEnrollments.filter((e) => e.courseId === course.id)
    const avgProgress =
      courseEnrollments.length > 0
        ? Math.round(courseEnrollments.reduce((acc, e) => acc + e.progress, 0) / courseEnrollments.length)
        : 0
    return {
      name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
      enrollment: courseEnrollments.length,
      avgProgress,
      capacity: course.maxCapacity,
    }
  })

  // Attendance trend data
  const attendanceTrendData = totalSessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10)
    .map((session) => {
      const course = trainerCourses.find((c) => c.id === session.courseId)
      return {
        date: new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        attendance: session.attendance.length,
        course: course?.title.substring(0, 10) || "Unknown",
      }
    })

  // Student performance distribution
  const performanceDistribution = [
    {
      range: "0-50%",
      students: totalEnrollments.filter((e) => e.progress < 50).length,
    },
    {
      range: "50-70%",
      students: totalEnrollments.filter((e) => e.progress >= 50 && e.progress < 70).length,
    },
    {
      range: "70-85%",
      students: totalEnrollments.filter((e) => e.progress >= 70 && e.progress < 85).length,
    },
    {
      range: "85-100%",
      students: totalEnrollments.filter((e) => e.progress >= 85).length,
    },
  ]

  const handleExport = () => {
    toast({
      title: "Report Exported",
      description: "Your report has been downloaded successfully.",
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into course performance and student progress</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
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

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEnrollments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSessions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Conducted sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgAttendance}</div>
            <p className="text-xs text-muted-foreground mt-1">Students per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalEnrollments.length > 0
                ? Math.round((totalEnrollments.filter((e) => e.progress >= 80).length / totalEnrollments.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Students at 80%+</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance Overview</CardTitle>
              <CardDescription>Enrollment and progress statistics by course</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrollment" fill="hsl(var(--primary))" name="Enrollments" />
                  <Bar dataKey="avgProgress" fill="hsl(var(--chart-2))" name="Avg Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Performance Distribution</CardTitle>
              <CardDescription>Number of students by progress range</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(var(--chart-3))" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Session attendance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" name="Attendees" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary by Course</CardTitle>
              <CardDescription>Average attendance rates across courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCourses.map((course) => {
                  const courseSessions = mockSessions.filter((s) => s.courseId === course.id)
                  const courseEnrollments = mockEnrollments.filter((e) => e.courseId === course.id)
                  const avgSessionAttendance =
                    courseSessions.length > 0
                      ? Math.round(
                          courseSessions.reduce((acc, s) => acc + s.attendance.length, 0) / courseSessions.length,
                        )
                      : 0
                  const attendanceRate =
                    courseEnrollments.length > 0
                      ? Math.round((avgSessionAttendance / courseEnrollments.length) * 100)
                      : 0

                  return (
                    <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{avgSessionAttendance} avg students per session</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
                        <Badge variant={attendanceRate >= 70 ? "default" : "secondary"}>
                          {attendanceRate >= 70 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Effectiveness</CardTitle>
              <CardDescription>Student progress and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredCourses.map((course) => {
                  const courseEnrollments = mockEnrollments.filter((e) => e.courseId === course.id)
                  const avgProgress =
                    courseEnrollments.length > 0
                      ? Math.round(courseEnrollments.reduce((acc, e) => acc + e.progress, 0) / courseEnrollments.length)
                      : 0

                  const courseProgressRecords = mockProgressRecords.filter((p) => p.courseId === course.id)
                  const avgPerformance =
                    courseProgressRecords.length > 0
                      ? Math.round(
                          courseProgressRecords.reduce((acc, p) => acc + p.performance, 0) /
                            courseProgressRecords.length,
                        )
                      : 0

                  return (
                    <div key={course.id} className="border border-border rounded-lg p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{courseEnrollments.length} students enrolled</p>
                        </div>
                        <Badge>{course.difficulty}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Avg Progress</p>
                          <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Avg Performance</p>
                          <p className="text-2xl font-bold text-foreground">{avgPerformance}/100</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                          <p className="text-2xl font-bold text-foreground">
                            {courseEnrollments.length > 0
                              ? Math.round(
                                  (courseEnrollments.filter((e) => e.progress >= 80).length /
                                    courseEnrollments.length) *
                                    100,
                                )
                              : 0}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>Students with the highest overall performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {totalEnrollments
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 10)
                  .map((enrollment, index) => {
                    const student = mockUsers.find((u) => u.id === enrollment.clientId)
                    const course = trainerCourses.find((c) => c.id === enrollment.courseId)
                    return (
                      <div key={enrollment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student?.name}</p>
                            <p className="text-sm text-muted-foreground">{course?.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{enrollment.progress}%</p>
                          <p className="text-xs text-muted-foreground">
                            {enrollment.sessionsAttended}/{enrollment.totalSessions} sessions
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students Needing Support</CardTitle>
              <CardDescription>Students with progress below 60%</CardDescription>
            </CardHeader>
            <CardContent>
              {totalEnrollments.filter((e) => e.progress < 60).length > 0 ? (
                <div className="space-y-3">
                  {totalEnrollments
                    .filter((e) => e.progress < 60)
                    .map((enrollment) => {
                      const student = mockUsers.find((u) => u.id === enrollment.clientId)
                      const course = trainerCourses.find((c) => c.id === enrollment.courseId)
                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5"
                        >
                          <div>
                            <p className="font-medium text-foreground">{student?.name}</p>
                            <p className="text-sm text-muted-foreground">{course?.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-destructive">{enrollment.progress}%</p>
                            <Badge variant="destructive">Needs Support</Badge>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  All students are performing well! No students need additional support.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

