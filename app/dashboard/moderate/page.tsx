"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  comment: string
  rating: number
  approved: boolean
  user_id: string
  property_id: string
  profiles: {
    full_name: string
    email: string
  }
  properties: {
    title: string
  }
}

export default function ModeratePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, email), properties(title)")
        .eq("approved", false)

      if (data) {
        setReviews(data as Review[])
      }
      setLoading(false)
    }

    fetchReviews()
  }, [])

  const handleApprove = async (reviewId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("reviews").update({ approved: true }).eq("id", reviewId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Review approved",
      })
      setReviews(reviews.filter((r) => r.id !== reviewId))
    }
  }

  const handleReject = async (reviewId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Review rejected",
      })
      setReviews(reviews.filter((r) => r.id !== reviewId))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Content Moderation</h1>
        <p className="text-text-light">Review and moderate user-generated content</p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-success opacity-50 mx-auto mb-4" />
            <p className="text-text-light">All content has been moderated</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-secondary">{review.profiles.full_name}</h3>
                      <Badge variant="outline" className="bg-primary text-white">
                        {review.rating} ⭐
                      </Badge>
                    </div>
                    <p className="text-sm text-text-light mb-3">
                      Review for: <span className="font-semibold">{review.properties.title}</span>
                    </p>
                    <p className="text-text-light mb-3">{review.comment}</p>
                    <p className="text-xs text-text-light">{review.profiles.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(review.id)}
                      className="bg-success hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(review.id)} className="bg-error hover:bg-red-700 text-white">
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
