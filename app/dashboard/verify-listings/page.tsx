"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Property {
  id: string
  title: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
  description: string
  approved: boolean
}

export default function VerifyListingsPage() {
  const [listings, setListings] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchListings = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("properties").select("*").eq("approved", false)

      if (data) {
        setListings(data as Property[])
      }
      setLoading(false)
    }

    fetchListings()
  }, [])

  const handleApprove = async (listingId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("properties").update({ approved: true }).eq("id", listingId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Listing approved successfully",
      })
      setListings(listings.filter((l) => l.id !== listingId))
    }
  }

  const handleReject = async (listingId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("properties").delete().eq("id", listingId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Listing rejected",
      })
      setListings(listings.filter((l) => l.id !== listingId))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Verify Listings</h1>
        <p className="text-text-light">Review and approve new property listings</p>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-success opacity-50 mx-auto mb-4" />
            <p className="text-text-light">All listings have been verified</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-secondary mb-2">{listing.title}</h3>
                    <div className="flex items-center gap-2 text-text-light mb-3">
                      <MapPin className="w-4 h-4" />
                      {listing.address}, {listing.city}
                    </div>
                    {listing.description && <p className="text-sm text-text-light mb-3">{listing.description}</p>}
                    <div className="flex gap-4 text-sm text-text-light mb-3">
                      <span>{listing.bedrooms} Beds</span>
                      <span>{listing.bathrooms} Baths</span>
                      <span>{listing.square_feet} sqft</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">${listing.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(listing.id)}
                      className="bg-success hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(listing.id)} className="bg-error hover:bg-red-700 text-white">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
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
