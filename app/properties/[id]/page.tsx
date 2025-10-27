"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockProperties, mockUsers, mockLeads, addLead } from "@/lib/mock-data"
import { PropertyCard } from "@/components/property-card"
import { AgentCard } from "@/components/agent-card"
import { ShowInterestForm, type InterestData } from "@/components/show-interest-form"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft, MapPin, Ruler, DollarSign, Home } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [leads, setLeads] = useState(mockLeads)

  const property = mockProperties.find((p) => p.id === params.id)
  const agent = property ? mockUsers.find((u) => u.id === property.agentId) : null
  const relatedProperties = mockProperties
    .filter((p) => p.id !== params.id && p.agentId === property?.agentId)
    .slice(0, 3)

  const handleShowInterest = (data: InterestData) => {
    const newLead = {
      id: `lead-${Date.now()}`,
      propertyId: params.id,
      buyerId: user?.id || "",
      buyerName: data.name,
      buyerEmail: data.email,
      buyerPhone: data.phone,
      message: data.message,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    }
    addLead(newLead)
    setLeads([...leads, newLead])
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  if (!property || !agent) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">REMS</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-muted-foreground">Property not found</p>
          <Link href="/properties">
            <Button className="mt-4 bg-primary hover:bg-primary/90">Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">REMS</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties">
          <Button variant="outline" className="mb-6 flex items-center gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg overflow-hidden h-96 bg-muted">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Price</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">${(property.price / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Home className="w-4 h-4" />
                      <span className="text-sm">Bedrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Home className="w-4 h-4" />
                      <span className="text-sm">Bathrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Ruler className="w-4 h-4" />
                      <span className="text-sm">Square Feet</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{property.sqft.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>
            </div>

            {relatedProperties.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">More from this agent</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <AgentCard agent={agent} />
            <ShowInterestForm propertyId={params.id} onSubmit={handleShowInterest} />
          </div>
        </div>
      </main>
    </div>
  )
}
