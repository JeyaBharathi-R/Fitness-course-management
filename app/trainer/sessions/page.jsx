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
import { mockCourses, mockSessions } from "@/lib/data"
import { Plus, Calendar, Clock, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SessionsPage() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const trainerCourses = mockCourses.filter((c) => c.trainerId === currentUser?.id)
  const trainerSessions = mockSessions
    .filter((s) => trainerCourses.some((c) => c.id === s.courseId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleCreateSession = (e) => {
    e.preventDefault()
    toast({
      title: "Session Created!",
      description: "New training session has been scheduled.",
    })
    setIsDialogOpen(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Manage Sessions</h1>
          <p className="text-muted-foreground">Schedule and track your training sessions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateSession}>
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
                <DialogDescription>Create a new training session for your course.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select required>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainerCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercises">Exercises (comma separated)</Label>
                  <Textarea id="exercises" placeholder="e.g., Burpees, Jump Squats, Push-ups" rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Session Notes (optional)</Label>
                  <Textarea id="notes" placeholder="Additional notes for this session" rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Session</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {trainerSessions.length > 0 ? (
        <div className="space-y-4">
          {trainerSessions.map((session) => {
            const course = trainerCourses.find((c) => c.id === session.courseId)
            const isPast = new Date(session.date) < new Date()
            return (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course?.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.time}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={isPast ? "secondary" : "default"}>{isPast ? "Completed" : "Upcoming"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2 text-foreground">Exercises</p>
                    <div className="flex flex-wrap gap-2">
                      {session.exercises.map((exercise, idx) => (
                        <Badge key={idx} variant="outline">
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {session.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-foreground">Notes</p>
                      <p className="text-sm text-muted-foreground">{session.notes}</p>
                    </div>
                  )}
                  {isPast && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{session.attendance.length} students attended</span>
                    </div>
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
            <h3 className="font-semibold text-xl mb-2 text-foreground">No Sessions Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Schedule your first training session for your courses
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

