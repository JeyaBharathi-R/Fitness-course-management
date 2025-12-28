"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { Users, Clock, Calendar, Target, CheckCircle, Star } from "lucide-react"
import Image from "next/image"

export function CourseDetails({ course, onEnroll, onBack, isEnrolled, enrollment }) {
  const spotsLeft = course.maxCapacity - course.currentEnrollment
  const isAlmostFull = spotsLeft <= 3

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Courses
        </Button>
      </div>

      {/* Course Hero */}
      <Card>
        <div className="relative h-64 md:h-80">
          <Image
            src={course.image || "/placeholder.svg?height=300&width=800"}
            alt={course.title}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/40 rounded-t-lg" />
          <div className="absolute bottom-6 left-6 text-white">
            <Badge className={`mb-2 ${course.difficulty === 'Beginner' ? 'bg-green-500' : course.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`}>
              {course.difficulty}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg opacity-90">{course.description}</p>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{course.currentEnrollment}/{course.maxCapacity}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{course.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Schedule</p>
                <p className="font-medium">{course.schedule}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Trainer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Your Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">{course.trainer.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{course.trainer}</p>
                  <p className="text-sm text-muted-foreground">Certified Fitness Instructor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Status */}
          {isEnrolled && enrollment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sessions Attended</p>
                    <p className="font-medium">{enrollment.sessionsAttended}/{enrollment.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrolled</p>
                    <p className="font-medium">{new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enrollment Action */}
          <Card>
            <CardContent className="p-6">
              {!isEnrolled ? (
                <div className="space-y-4">
                  {isAlmostFull && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium">Only {spotsLeft} spots left!</span>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => onEnroll(course.id)}
                    disabled={spotsLeft === 0}
                  >
                    {spotsLeft === 0 ? "Course Full" : "Enroll Now"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Free to cancel anytime
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-700">Enrolled</p>
                  <p className="text-sm text-muted-foreground">You're all set for this course!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

