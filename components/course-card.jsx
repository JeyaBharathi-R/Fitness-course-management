"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, Clock, Calendar } from "lucide-react"
import Image from "next/image"

export function CourseCard({ course, onEnroll, onViewDetails, isEnrolled, progress }) {
  const difficultyColor = {
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    Intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  }

  const spotsLeft = course.maxCapacity - course.currentEnrollment
  const isAlmostFull = spotsLeft <= 3

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted">
        <Image
          src={course.image || "/placeholder.svg?height=200&width=400"}
          alt={course.title}
          fill
          className="object-cover"
        />
        <Badge className={`absolute top-4 right-4 ${difficultyColor[course.difficulty]}`}>{course.difficulty}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{course.schedule}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {course.currentEnrollment}/{course.maxCapacity}
            </span>
          </div>
          {isAlmostFull && <Badge variant="destructive">{spotsLeft} spots left</Badge>}
        </div>
        {isEnrolled && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onViewDetails?.(course.id)}>
          View Details
        </Button>
        {!isEnrolled && onEnroll && (
          <Button className="flex-1" onClick={() => onEnroll(course.id)} disabled={spotsLeft === 0}>
            {spotsLeft === 0 ? "Full" : "Enroll Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

