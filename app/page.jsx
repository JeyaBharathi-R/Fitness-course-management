"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserProvider, useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, TrendingUp, Calendar } from "lucide-react"

function HomeContent() {
  const router = useRouter()
  const { currentUser } = useUser()

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "client") {
        router.push("/client")
      } else if (currentUser.role === "trainer") {
        router.push("/trainer")
      }
    }
  }, [currentUser, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground">
              Transform Your Fitness Journey
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
              Manage courses, track progress, and achieve your fitness goals with our comprehensive course management
              system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => router.push("/client")}>
                Get Started as Client
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/trainer")}>
                Trainer Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">Course Management</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create, update, and manage fitness courses with detailed schedules and objectives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">Client Enrollment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Browse available courses and enroll in sessions that match your fitness goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">Progress Tracking</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Monitor your performance and track progress across all your enrolled courses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">Attendance Monitoring</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track attendance and ensure participation criteria are met for all sessions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  )
}

