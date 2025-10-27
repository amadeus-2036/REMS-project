"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Property } from "@/lib/mock-data"

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: Partial<Property>) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function PropertyForm({ property, onSubmit, onCancel, isLoading }: PropertyFormProps) {
  const [formData, setFormData] = useState<Partial<Property>>(
    property || {
      title: "",
      description: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      image: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <Input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Property title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price</label>
              <Input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bedrooms</label>
              <Input
                type="number"
                value={formData.bedrooms || 0}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bathrooms</label>
              <Input
                type="number"
                value={formData.bathrooms || 0}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Square Feet</label>
              <Input
                type="number"
                value={formData.sqft || 0}
                onChange={(e) => setFormData({ ...formData, sqft: Number(e.target.value) })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <Input
                type="text"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">City</label>
              <Input
                type="text"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">State</label>
              <Input
                type="text"
                value={formData.state || ""}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Zip Code</label>
              <Input
                type="text"
                value={formData.zipCode || ""}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="Zip code"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
              <Input
                type="text"
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Property description"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Saving..." : property ? "Update Property" : "Add Property"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
