"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

interface ScheduledVisit {
  id: string
  visit_date: string
  notes: string
  status: string
  properties: {
    title: string
    address: string
    city: string
  }
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<ScheduledVisit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisits = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("scheduled_visits")
        .select("*, properties(title, address, city)")
        .eq("user_id", user.id)
        .order("visit_date", { ascending: true })

      if (data) {
        setVisits(data as ScheduledVisit[])
      }
      setLoading(false)
    }

    fetchVisits()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Scheduled Visits</h1>
        <p className="text-text-light">Manage your property viewing appointments</p>
      </div>

      {visits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-text-light opacity-50 mx-auto mb-4" />
            <p className="text-text-light">No scheduled visits yet</p>
            <Link href="/properties">
              <Button className="mt-4 bg-primary hover:bg-primary-dark text-white">Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <Card key={visit.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-secondary mb-2">{visit.properties.title}</h3>
                    <div className="flex flex-col gap-2 text-sm text-text-light">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {visit.properties.address}, {visit.properties.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(visit.visit_date).toLocaleString()}
                      </div>
                      {visit.notes && <p className="text-text-light">{visit.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        visit.status === "scheduled"
                          ? "bg-primary text-white"
                          : visit.status === "completed"
                            ? "bg-success text-white"
                            : "bg-error text-white"
                      }`}
                    >
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
