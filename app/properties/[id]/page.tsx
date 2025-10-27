"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Home, Heart, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Property {
  id: string
  title: string
  description: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
  property_type: string
  agent_id: string
}

interface Review {
  id: string
  rating: number
  comment: string
  profiles: {
    full_name: string
  }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: "5", comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [visitDate, setVisitDate] = useState("")
  const [visitNotes, setVisitNotes] = useState("")
  const [schedulingVisit, setSchedulingVisit] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      const supabase = createClient()
      const { data: propertyData } = await supabase.from("properties").select("*").eq("id", propertyId).single()

      if (propertyData) {
        setProperty(propertyData as Property)
      }

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*, profiles(full_name)")
        .eq("property_id", propertyId)
        .eq("approved", true)

      if (reviewsData) {
        setReviews(reviewsData as Review[])
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: favData } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("property_id", propertyId)
          .single()

        setIsFavorite(!!favData)
      }

      setLoading(false)
    }

    fetchProperty()
  }, [propertyId])

  const handleToggleFavorite = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add favorites",
        variant: "destructive",
      })
      return
    }

    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", propertyId)
      setIsFavorite(false)
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id,
        property_id: propertyId,
      })
      setIsFavorite(true)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingReview(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      })
      setSubmittingReview(false)
      return
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      property_id: propertyId,
      rating: Number.parseInt(reviewData.rating),
      comment: reviewData.comment,
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Review submitted for moderation",
      })
      setReviewData({ rating: "5", comment: "" })
      setShowReviewForm(false)
    }
    setSubmittingReview(false)
  }

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSchedulingVisit(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to schedule a visit",
        variant: "destructive",
      })
      setSchedulingVisit(false)
      return
    }

    const { error } = await supabase.from("scheduled_visits").insert({
      user_id: user.id,
      property_id: propertyId,
      visit_date: visitDate,
      notes: visitNotes,
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Visit scheduled successfully",
      })
      setVisitDate("")
      setVisitNotes("")
    }
    setSchedulingVisit(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!property) {
    return <div className="text-center py-12">Property not found</div>
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Link>

        {/* Property Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-br from-primary-light to-primary h-64 flex items-center justify-center">
            <Home className="w-24 h-24 text-white opacity-50" />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-base">
                  <MapPin className="w-4 h-4" />
                  {property.address}, {property.city}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                className={`${isFavorite ? "bg-primary text-white" : "bg-transparent"}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-text-light text-sm">Price</p>
                <p className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-text-light text-sm">Bedrooms</p>
                <p className="text-2xl font-bold text-secondary">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-text-light text-sm">Bathrooms</p>
                <p className="text-2xl font-bold text-secondary">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-text-light text-sm">Square Feet</p>
                <p className="text-2xl font-bold text-secondary">{property.square_feet}</p>
              </div>
            </div>

            {property.description && (
              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">Description</h3>
                <p className="text-text-light">{property.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Visit */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Schedule a Visit</CardTitle>
            <CardDescription>Book a viewing for this property</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleVisit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visit_date">Preferred Date & Time</Label>
                <Input
                  id="visit_date"
                  type="datetime-local"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit_notes">Notes (Optional)</Label>
                <Textarea
                  id="visit_notes"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="Any special requests or questions?"
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={schedulingVisit} className="bg-primary hover:bg-primary-dark text-white">
                {schedulingVisit ? "Scheduling..." : "Schedule Visit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>What customers think about this property</CardDescription>
              </div>
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {showReviewForm ? "Cancel" : "Write Review"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="space-y-4 pb-6 border-b border-border">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={reviewData.rating}
                    onValueChange={(value) => setReviewData({ ...reviewData, rating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4">4 Stars - Good</SelectItem>
                      <SelectItem value="3">3 Stars - Average</SelectItem>
                      <SelectItem value="2">2 Stars - Poor</SelectItem>
                      <SelectItem value="1">1 Star - Terrible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Share your experience with this property"
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-text-light text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-secondary">{review.profiles.full_name}</p>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-light">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
