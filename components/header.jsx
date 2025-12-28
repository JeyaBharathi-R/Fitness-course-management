"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { Dumbbell, User, LogOut } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { currentUser, switchRole } = useUser()

  const navLinks =
    currentUser?.role === "trainer"
      ? [
          { href: "/trainer", label: "Dashboard" },
          { href: "/trainer/courses", label: "My Courses" },
          { href: "/trainer/sessions", label: "Sessions" },
          { href: "/trainer/attendance", label: "Attendance" },
          { href: "/trainer/reports", label: "Reports" },
        ]
      : currentUser?.role === "client"
        ? [
            { href: "/client", label: "Dashboard" },
            { href: "/client/courses", label: "Browse Courses" },
            { href: "/client/my-courses", label: "My Courses" },
            { href: "/client/progress", label: "Progress" },
          ]
        : [{ href: "/", label: "Home" }]

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">FitFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{currentUser.name}</span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {currentUser.role}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => switchRole("client")}>
                    <User className="mr-2 h-4 w-4" />
                    Switch to Client
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchRole("trainer")}>
                    <User className="mr-2 h-4 w-4" />
                    Switch to Trainer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

