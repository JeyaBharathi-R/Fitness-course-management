export type UserRole = "client" | "trainer" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Course {
  id: string
  title: string
  description: string
  trainer: string
  trainerId: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  maxCapacity: number
  currentEnrollment: number
  schedule: string
  objectives: string[]
  image?: string
}

export interface Session {
  id: string
  courseId: string
  date: string
  time: string
  exercises: string[]
  attendance: string[]
  notes?: string
}

export interface Enrollment {
  id: string
  clientId: string
  courseId: string
  enrolledAt: string
  progress: number
  sessionsAttended: number
  totalSessions: number
}

export interface ProgressRecord {
  id: string
  clientId: string
  sessionId: string
  courseId: string
  date: string
  performance: number
  notes?: string
}
