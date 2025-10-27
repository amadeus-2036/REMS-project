"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockLeads, mockProperties } from "@/lib/mock-data"
import { AgentSidebar } from "@/components/agent-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare } from "lucide-react"

export default function AgentLeadsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [leads, setLeads] = useState(mockLeads)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)

  if (!isAuthenticated || user?.role !== "agent") {
    router.push("/login")
    return null
  }

  const agentLeads = leads.filter((l) => {
    const property = mockProperties.find((p) => p.id === l.propertyId)
    return property?.agentId === user.id
  })

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(
      leads.map((l) =>
        l.id === leadId ? { ...l, status: newStatus as "new" | "contacted" | "viewing" | "offer" | "closed" } : l,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "viewing":
        return "bg-purple-100 text-purple-800"
      case "offer":
        return "bg-orange-100 text-orange-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AgentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Leads Management</h1>
            <p className="text-muted-foreground">Track and manage buyer inquiries</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {agentLeads.length > 0 ? (
                agentLeads.map((lead) => {
                  const property = mockProperties.find((p) => p.id === lead.propertyId)
                  const isSelected = selectedLead === lead.id

                  return (
                    <Card
                      key={lead.id}
                      className={`border cursor-pointer transition-all ${
                        isSelected ? "border-primary bg-secondary" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedLead(isSelected ? null : lead.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{lead.buyerName}</h3>
                            <p className="text-sm text-muted-foreground">{property?.title}</p>
                          </div>
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </div>

                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{lead.buyerEmail}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{lead.buyerPhone}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="pt-4 border-t border-border space-y-3">
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">Message:</p>
                              <p className="text-sm text-muted-foreground">{lead.message}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">Update Status:</p>
                              <div className="flex flex-wrap gap-2">
                                {["new", "contacted", "viewing", "offer", "closed"].map((status) => (
                                  <Button
                                    key={status}
                                    size="sm"
                                    variant={lead.status === status ? "default" : "outline"}
                                    onClick={() => handleStatusChange(lead.id, status)}
                                    className={
                                      lead.status === status
                                        ? "bg-primary hover:bg-primary/90"
                                        : "bg-transparent hover:bg-secondary"
                                    }
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No leads yet. When buyers show interest, they'll appear here.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card className="border border-border">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-foreground">Lead Statistics</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Leads</span>
                      <span className="font-semibold text-foreground">{agentLeads.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">New</span>
                      <span className="font-semibold text-blue-600">
                        {agentLeads.filter((l) => l.status === "new").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Contacted</span>
                      <span className="font-semibold text-yellow-600">
                        {agentLeads.filter((l) => l.status === "contacted").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Viewing</span>
                      <span className="font-semibold text-purple-600">
                        {agentLeads.filter((l) => l.status === "viewing").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Offer</span>
                      <span className="font-semibold text-orange-600">
                        {agentLeads.filter((l) => l.status === "offer").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Closed</span>
                      <span className="font-semibold text-green-600">
                        {agentLeads.filter((l) => l.status === "closed").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg text-foreground">Quick Actions</h3>
                  <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Lead
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
