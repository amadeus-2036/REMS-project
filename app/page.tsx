"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, TrendingUp } from "lucide-react"
// Changed from default import to named import and removed redundant Home import

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "agent") {
        router.push("/agent/dashboard")
      } else {
        router.push("/properties")
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary-foreground" /> {/* Updated to use ArrowRight icon directly */}
            </div>
            <span className="text-xl font-semibold text-foreground">REMS</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:bg-secondary">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 space-y-12">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-block">
              <span className="px-3 py-1 bg-secondary text-primary text-sm font-medium rounded-full">
                Welcome to REMS
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">Find Your Perfect Property</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Discover amazing properties and connect with experienced real estate agents. Whether you're buying,
              selling, or renting, we've got you covered.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/properties">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  Browse Properties
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-border hover:bg-secondary bg-transparent">
                  Become an Agent
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              {
                icon: ArrowRight,
                title: "Browse Properties",
                description: "Explore thousands of listings with advanced filters and detailed information.",
              },
              {
                icon: Users,
                title: "Connect with Agents",
                description: "Get in touch with experienced professionals who know the market.",
              },
              {
                icon: TrendingUp,
                title: "Track Your Leads",
                description: "Agents can manage properties and leads all in one place.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
