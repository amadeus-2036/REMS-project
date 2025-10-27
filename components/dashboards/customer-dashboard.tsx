"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Calendar, User, Home, MapPin } from "lucide-react"

interface CustomerDashboardProps {
  userId: string
}

interface Property {
  id: string
  title: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
  status: string
}

export function CustomerDashboard({ userId }: CustomerDashboardProps) {
  const [stats, setStats] = useState({ favorites: 0, visits: 0 })
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch stats
      const [favs, visits, props] = await Promise.all([
        supabase.from("favorites").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("scheduled_visits").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
      ])

      setStats({
        favorites: favs.count || 0,
        visits: visits.count || 0,
      })

      setProperties(props.data as Property[] || [])
      setLoading(false)
    }

    fetchData()
  }, [userId])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Welcome Back!</h1>
        <p className="text-text-light">Manage your properties and preferences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Favorite Properties</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-3xl font-bold text-secondary">{stats.favorites}</div>
            <Heart className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Visits</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-3xl font-bold text-secondary">{stats.visits}</div>
            <Calendar className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-lg font-semibold text-success">Complete</div>
            <User className="w-8 h-8 text-success opacity-50" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties Listed</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-3xl font-bold text-secondary">{properties.length}</div>
            <Home className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Properties */}
      <div className="space-y-4">
        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 text-text-light opacity-50 mx-auto mb-4" />
              <p className="text-text-light mb-4">No properties available yet</p>
              <Link href="/dashboard/listings/new">
                <Button className="bg-primary hover:bg-primary-dark text-white">Add Your First Property</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          properties.map((prop) => (
            <Card key={prop.id}>
              <CardHeader>
                <CardTitle>{prop.title}</CardTitle>
                <CardDescription>{prop.address}, {prop.city}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p>{prop.bedrooms} Beds | {prop.bathrooms} Baths | {prop.square_feet} sqft</p>
                  <p className="text-lg font-bold text-primary">${prop.price.toLocaleString()}</p>
                </div>
                <Link href={`/properties/${prop.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
