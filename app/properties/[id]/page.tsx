"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Home,
  Heart,
  ArrowLeft,
  MessageCircle,
  X,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import PropertyChat from "@/components/PropertyChat"

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
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch property
      const { data: propertyData } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single()
      if (propertyData) setProperty(propertyData as Property)

      // Fetch reviews (no moderation filter)
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*, profiles(full_name)")
        .eq("property_id", propertyId)
      if (reviewsData) setReviews(reviewsData as Review[])

      // Fetch user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
        setUserName(profile?.full_name || "You")

        const { data: favData } = await supabase
          .from("favorites")
          .select("property_id")
          .eq("user_id", user.id)
          .eq("property_id", propertyId)
          .single()
        setIsFavorite(!!favData)
      }

      setLoading(false)
    }

    fetchData()
  }, [propertyId])

  // Toggle favorite
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
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
      setIsFavorite(false)
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, property_id: propertyId })
      setIsFavorite(true)
    }
  }

  // Schedule visit
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
      toast({ title: "Success", description: "Visit scheduled successfully" })
      setVisitDate("")
      setVisitNotes("")
    }
    setSchedulingVisit(false)
  }

  // Submit review (instant insert + refresh)
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
        description: "Review submitted",
      })
      setReviewData({ rating: "5", comment: "" })
      setShowReviewForm(false)

      const { data: updated } = await supabase
        .from("reviews")
        .select("*, profiles(full_name)")
        .eq("property_id", propertyId)
      if (updated) setReviews(updated as Review[])
    }

    setSubmittingReview(false)
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!property) return <div className="text-center py-12">Property not found</div>

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Button>
        </Link>

        {/* Property Details */}
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`${isFavorite ? "bg-primary text-white" : "bg-transparent"}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowChat(true)}
                  className="bg-primary text-white hover:bg-primary-dark"
                >
                  <MessageCircle className="w-5 h-5 mr-1" /> Chat
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-text-light text-sm">Price</p>
                <p className="text-2xl font-bold text-primary">
                  ${property.price.toLocaleString()}
                </p>
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
              <Label htmlFor="visit_date">Preferred Date & Time</Label>
              <Input
                id="visit_date"
                type="datetime-local"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
              <Label htmlFor="visit_notes">Notes (Optional)</Label>
              <Textarea
                id="visit_notes"
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                placeholder="Any special requests or questions?"
              />
              <Button
                type="submit"
                disabled={schedulingVisit}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {schedulingVisit ? "Scheduling..." : "Schedule Visit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>What others think about this property</CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-2">
                    <p className="font-medium">{review.profiles.full_name}</p>
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {!showReviewForm ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 bg-primary text-white"
              >
                Add Review
              </Button>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-4 space-y-3">
                <Label>Rating</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                />
                <Label>Comment</Label>
                <Textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-primary text-white"
                  >
                    {submittingReview ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Modal */}
      {showChat && property && userId && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b shadow-sm bg-primary text-white">
            <div>
              <p className="font-semibold">{property.title}</p>
              <p className="text-sm opacity-80">Chat about this property</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-primary-dark"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <PropertyChat
              propertyId={property.id}
              propertyTitle={property.title}
              agentId={property.agent_id}
              userId={userId}
              userName={userName || "You"}
            />
          </div>
        </div>
      )}
    </div>
  )
}
