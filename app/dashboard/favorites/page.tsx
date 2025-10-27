"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin } from "lucide-react"
import Link from "next/link"

interface Property {
  id: string
  title: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase.from("favorites").select("properties(*)").eq("user_id", user.id)

      if (data) {
        setFavorites(data.map((fav: any) => fav.properties).filter(Boolean))
      }
      setLoading(false)
    }

    fetchFavorites()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">My Favorites</h1>
        <p className="text-text-light">Properties you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 text-text-light opacity-50 mx-auto mb-4" />
            <p className="text-text-light">No favorite properties yet</p>
            <Link href="/properties">
              <Button className="mt-4 bg-primary hover:bg-primary-dark text-white">Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-primary-light to-primary h-48 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-white opacity-50" />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {property.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</span>
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                </div>
                <div className="flex gap-4 text-sm text-text-light">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.bathrooms} Baths</span>
                  <span>{property.square_feet} sqft</span>
                </div>
                <Link href={`/properties/${property.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
