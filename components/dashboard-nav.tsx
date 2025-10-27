"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Home, LogOut, Menu } from "lucide-react"
import { useState } from "react"

interface DashboardNavProps {
  userRole: string
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = {
    customer: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Browse Properties", href: "/properties" },
      { label: "My Favorites", href: "/dashboard/favorites" },
      { label: "Scheduled Visits", href: "/dashboard/visits" },
      { label: "Profile", href: "/dashboard/profile" },
    ],
    agent: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Listings", href: "/dashboard/listings" },
      { label: "Add Listing", href: "/dashboard/listings/new" },
      { label: "Leads", href: "/dashboard/leads" },
      { label: "Profile", href: "/dashboard/profile" },
    ],
    admin: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Verify Agents", href: "/dashboard/verify-agents" },
      { label: "Verify Listings", href: "/dashboard/verify-listings" },
      { label: "Manage Users", href: "/dashboard/users" },
      { label: "Moderate Content", href: "/dashboard/moderate" },
    ],
  }

  const items = navItems[userRole as keyof typeof navItems] || navItems.customer

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-secondary">REMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="text-text hover:bg-surface">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hidden md:flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-surface rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="w-full justify-start text-text">
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
