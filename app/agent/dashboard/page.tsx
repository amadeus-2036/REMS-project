"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockProperties, mockLeads } from "@/lib/mock-data"
import { AgentSidebar } from "@/components/agent-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AgentDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated || user?.role !== "agent") {
    router.push("/login")
    return null
  }

  const agentProperties = mockProperties.filter((p) => p.agentId === user.id)
  const agentLeads = mockLeads.filter((l) => {
    const property = mockProperties.find((p) => p.id === l.propertyId)
    return property?.agentId === user.id
  })

  const leadsByStatus = {
    new: agentLeads.filter((l) => l.status === "new").length,
    contacted: agentLeads.filter((l) => l.status === "contacted").length,
    viewing: agentLeads.filter((l) => l.status === "viewing").length,
    offer: agentLeads.filter((l) => l.status === "offer").length,
    closed: agentLeads.filter((l) => l.status === "closed").length,
  }

  const chartData = [
    { name: "New", value: leadsByStatus.new },
    { name: "Contacted", value: leadsByStatus.contacted },
    { name: "Viewing", value: leadsByStatus.viewing },
    { name: "Offer", value: leadsByStatus.offer },
    { name: "Closed", value: leadsByStatus.closed },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AgentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Here's an overview of your real estate business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Properties</p>
                <p className="text-3xl font-bold text-primary">{agentProperties.length}</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Leads</p>
                <p className="text-3xl font-bold text-primary">{agentLeads.length}</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">New Leads</p>
                <p className="text-3xl font-bold text-accent">{leadsByStatus.new}</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Closed Deals</p>
                <p className="text-3xl font-bold text-primary">{leadsByStatus.closed}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Lead Status Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.625rem",
                    }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
