"use client"


import { use, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockCourses, mockEnrollments, mockUsers } from "@/lib/data"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Users, Save } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EditCoursePage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const course = mockCourses.find((c) => c.id === id)
  const enrolledStudents = mockEnrollments
    .filter((e) => e.courseId === id)
    .map((enrollment) => {
      const student = mockUsers.find((u) => u.id === enrollment.clientId)
      return { ...enrollment, student }
    })
    .filter((e) => e.student)

  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    duration: course?.duration || "",
    schedule: course?.schedule || "",
    // store as string to avoid NaN being passed to the input `value`
    maxCapacity: course?.maxCapacity?.toString() || "",
  })

  if (!course) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Course not found</p>
      </main>
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    toast({
      title: "Course Updated",
      description: "Your changes have been saved successfully.",
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Course Details</CardTitle>
              <CardDescription>Update your course information and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Max Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Objectives</CardTitle>
              <CardDescription>Key learning outcomes for this course</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrolled Students
                </CardTitle>
                <Badge variant="secondary">{enrolledStudents.length}</Badge>
              </div>
              <CardDescription>Students currently enrolled in this course</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledStudents.length > 0 ? (
                <div className="space-y-3">
                  {enrolledStudents.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={enrollment.student?.avatar || "/placeholder.svg"}
                          alt={enrollment.student?.name}
                        />
                        <AvatarFallback>{enrollment.student?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-foreground">{enrollment.student?.name}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.progress}% complete</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No students enrolled yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge>{course.difficulty}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Enrollment</span>
                <span className="text-sm font-medium text-foreground">
                  {enrolledStudents.length}/{course.maxCapacity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium text-foreground">{course.duration}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
