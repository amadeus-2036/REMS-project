"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

interface ShowInterestFormProps {
  propertyId: string
  onSubmit: (data: InterestData) => void
}

export interface InterestData {
  name: string
  email: string
  phone: string
  message: string
}

export function ShowInterestForm({ propertyId, onSubmit }: ShowInterestFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<InterestData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">Show Interest</h3>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            Thank you! Your interest has been recorded. The agent will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell the agent about your interest..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit Interest
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
