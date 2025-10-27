"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mockProperties } from "@/lib/mock-data"
import { AgentSidebar } from "@/components/agent-sidebar"
import { PropertyForm } from "@/components/property-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Trash2, Plus } from "lucide-react"
import type { Property } from "@/lib/mock-data"

export default function AgentPropertiesPage() {
  const { user, isAuthenticated } = useRouter()
  const router = useRouter()
  const [properties, setProperties] = useState(mockProperties)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  if (!isAuthenticated || user?.role !== "agent") {
    router.push("/login")
    return null
  }

  const agentProperties = properties.filter((p) => p.agentId === user?.id)

  const handleAddProperty = (data: Partial<Property>) => {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: data.title || "",
      description: data.description || "",
      price: data.price || 0,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      sqft: data.sqft || 0,
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zipCode: data.zipCode || "",
      image: data.image || "",
      agentId: user?.id || "",
      createdAt: new Date().toISOString(),
    }
    setProperties([...properties, newProperty])
    setShowForm(false)
  }

  const handleUpdateProperty = (data: Partial<Property>) => {
    if (!editingProperty) return
    const updated = properties.map((p) => (p.id === editingProperty.id ? { ...p, ...data } : p))
    setProperties(updated)
    setEditingProperty(null)
  }

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AgentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Properties</h1>
              <p className="text-muted-foreground">Manage your property listings</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </div>

          {showForm && (
            <div>
              <PropertyForm onSubmit={handleAddProperty} onCancel={() => setShowForm(false)} />
            </div>
          )}

          {editingProperty && (
            <div>
              <PropertyForm
                property={editingProperty}
                onSubmit={handleUpdateProperty}
                onCancel={() => setEditingProperty(null)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentProperties.map((property) => (
              <Card key={property.id} className="border border-border overflow-hidden">
                <div className="h-40 bg-muted overflow-hidden">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">${(property.price / 1000).toFixed(0)}K</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProperty(property)}
                        className="flex items-center gap-1 bg-transparent"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProperty(property.id)}
                        className="flex items-center gap-1 bg-transparent text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {agentProperties.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No properties yet. Add your first property to get started.</p>
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
                Add Property
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
