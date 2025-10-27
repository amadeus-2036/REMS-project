"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, FileText, Users, LogOut, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function AgentSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { href: "/agent/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/agent/properties", label: "My Properties", icon: FileText },
    { href: "/agent/leads", label: "Leads", icon: Users },
  ]

  return (
    /* Modernized sidebar with sleek styling and better visual hierarchy */
    <div className="w-64 bg-card border-r border-border/50 min-h-screen flex flex-col">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">REMS</h1>
        </div>
        <p className="text-xs text-muted-foreground font-medium">Agent Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 transition-all duration-200 ${
                  isActive
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-foreground hover:bg-secondary/50 border-border/50 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  )
}
