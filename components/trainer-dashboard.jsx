"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Progress } from "./ui/progress"
import { Users, Calendar, TrendingUp, Plus, Eye, Edit, BarChart3 } from "lucide-react"

export function TrainerDashboard({ courses, sessions, enrollments, progressRecords, onCreateCourse, onEditCourse, onViewAttendance, onViewReports }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

  const myCourses = courses.filter(course => course.trainerId === "2") // Assuming trainer ID is 2
  const mySessions = sessions.filter(session => myCourses.some(course => course.id === session.courseId))
  const myEnrollments = enrollments.filter(enrollment => myCourses.some(course => course.id === enrollment.courseId))

  const totalStudents = new Set(myEnrollments.map(e => e.clientId)).size
  const averageAttendance = mySessions.length > 0
    ? Math.round((mySessions.reduce((sum, session) => sum + session.attendance.length, 0) / mySessions.length) / myEnrollments.length * 100)
    : 0

  const upcomingSessions = mySessions
    .filter(session => new Date(session.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{myCourses.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">My Courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalStudents}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{mySessions.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{averageAttendance}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Avg Attendance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Course Management</h3>
            <Button onClick={onCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map(course => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Enrollment</p>
                      <p className="font-medium">{course.currentEnrollment}/{course.maxCapacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Difficulty</p>
                      <Badge variant="outline">{course.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditCourse(course.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onViewAttendance(course.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Manage your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSessions.map(session => {
                      const course = myCourses.find(c => c.id === session.courseId)
                      return (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{course?.title}</TableCell>
                          <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                          <TableCell>{session.time}</TableCell>
                          <TableCell>{session.attendance.length} / {course?.currentEnrollment || 0}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming sessions.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Track student attendance across all your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myCourses.map(course => {
                  const courseSessions = mySessions.filter(s => s.courseId === course.id)
                  const totalAttendance = courseSessions.reduce((sum, s) => sum + s.attendance.length, 0)
                  const possibleAttendance = courseSessions.length * course.currentEnrollment
                  const attendanceRate = possibleAttendance > 0 ? Math.round((totalAttendance / possibleAttendance) * 100) : 0

                  return (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {courseSessions.length} sessions • {course.currentEnrollment} students
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold">{attendanceRate}%</span>
                        </div>
                        <Progress value={attendanceRate} className="w-24 h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>View detailed analytics and student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex-col" onClick={() => onViewReports('attendance')}>
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Attendance Report
                </Button>
                <Button variant="outline" className="h-24 flex-col" onClick={() => onViewReports('performance')}>
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Performance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

