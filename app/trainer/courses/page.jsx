"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/contexts/user-context"
import { useData } from "@/contexts/data-context"
import { Plus, Users, Calendar, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function TrainerCoursesPage() {
  const { currentUser } = useUser()
  const { courses, enrollments, dispatch } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const trainerCourses = courses.filter((c) => c.trainerId === currentUser?.id)

  const handleCreateCourse = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newCourse = {
      id: Date.now().toString(),
      title: formData.get("title"),
      description: formData.get("description"),
      trainer: currentUser.name,
      trainerId: currentUser.id,
      duration: formData.get("duration"),
      difficulty: formData.get("difficulty"),
      maxCapacity: parseInt(formData.get("capacity")),
      currentEnrollment: 0,
      schedule: formData.get("schedule"),
      objectives: formData.get("objectives").split(",").map(obj => obj.trim()),
      image: "/placeholder.svg",
    }
    dispatch({ type: "ADD_COURSE", payload: newCourse })
    toast({
      title: "Course Created!",
      description: "Your new fitness course has been created successfully.",
    })
    setIsDialogOpen(false)
  }

  const handleDeleteCourse = (courseId) => {
    dispatch({ type: "DELETE_COURSE", payload: courseId })
    toast({
      title: "Course Deleted",
      description: "The course has been removed from your list.",
      variant: "destructive",
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Manage Courses</h1>
          <p className="text-muted-foreground">Create and manage your fitness courses</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleCreateCourse}>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>Add a new fitness course for your clients to enroll in.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" name="title" placeholder="e.g., HIIT Fundamentals" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe your course..." rows={3} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" name="duration" placeholder="e.g., 6 weeks" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select name="difficulty" required>
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input id="schedule" name="schedule" placeholder="e.g., Mon & Wed, 6:00 PM" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Max Capacity</Label>
                    <Input id="capacity" name="capacity" type="number" placeholder="e.g., 15" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objectives (comma separated)</Label>
                  <Textarea
                    id="objectives"
                    name="objectives"
                    placeholder="e.g., Improve endurance, Build strength, Increase flexibility"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Course</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {trainerCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {trainerCourses.map((course) => {
            const enrollmentCount = enrollments.filter((e) => e.courseId === course.id).length
            return (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">{course.description}</CardDescription>
                    </div>
                    <Badge>{course.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {enrollmentCount}/{course.maxCapacity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Schedule:</p>
                    <p>{course.schedule}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/trainer/courses/${course.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Plus className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2 text-foreground">No Courses Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first fitness course and start managing students
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

