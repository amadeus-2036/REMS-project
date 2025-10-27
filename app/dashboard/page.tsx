"use client" // <-- This is the most important line

import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client" // <-- Use the client
import { DashboardNav } from "@/components/dashboard-nav"
import { CustomerDashboard } from "@/components/dashboards/customer-dashboard"
import { AgentDashboard } from "@/components/dashboards/agent-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const checkUser = async () => {
      // 1. Get the user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        redirect("/auth/login")
        return
      }

      // 2. Get the user's role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setUser(user)
      setRole(profile?.role || "customer")
      setLoading(false)
    }

    checkUser()
  }, [])

  // Show a loading screen while we fetch the user's role
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  // Once loaded, show the correct dashboard
  return (
    <div className="min-h-screen bg-surface">
      <DashboardNav userRole={role!} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === "customer" && <CustomerDashboard userId={user!.id} />}
        {role ==="agent" && <AgentDashboard userId={user!.id} />}
        {role === "admin" && <AdminDashboard />}
      </main>
    </div>
  )
}