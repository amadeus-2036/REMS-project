"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Eye, MessageCircle, X, Star } from "lucide-react";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  status: string;
  approved: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id: string;
  content: string;
  created_at: string;
  sender: { full_name: string };
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  user: { full_name: string };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});
  const [chatReviews, setChatReviews] = useState<Review[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchListings = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });
      if (data) {
        setListings(data as Property[]);
        // Fetch reviews for all properties
        data.forEach((property) => fetchReviews(property.id));
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  const fetchReviews = async (propertyId: string) => {
    const supabase = createClient();
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("id, comment, rating, created_at, user:user_id(full_name)")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    const revs =
      reviewsData?.map((r: any) => ({
        id: r.id,
        comment: r.comment,
        rating: r.rating,
        created_at: r.created_at,
        user: { full_name: r.user?.[0]?.full_name || "Unknown" },
      })) || [];

    setReviews((prev) => ({ ...prev, [propertyId]: revs }));
  };

  const fetchMessagesAndReviews = async (propertyId: string) => {
    const supabase = createClient();

    // Fetch messages
    const { data: messagesData } = await supabase
      .from("messages")
      .select("id, sender_id, receiver_id, property_id, content, created_at, sender:sender_id(full_name)")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: true });

    const msgs =
      messagesData?.map((m: any) => ({
        id: m.id,
        sender_id: m.sender_id,
        receiver_id: m.receiver_id,
        property_id: m.property_id,
        content: m.content,
        created_at: m.created_at,
        sender: { full_name: m.sender?.[0]?.full_name || "Unknown" },
      })) || [];

    setMessages(msgs as Message[]);

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("id, comment, rating, created_at, user:user_id(full_name)")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    const revs =
      reviewsData?.map((r: any) => ({
        id: r.id,
        comment: r.comment,
        rating: r.rating,
        created_at: r.created_at,
        user: { full_name: r.user?.[0]?.full_name || "Unknown" },
      })) || [];

    setChatReviews(revs as Review[]);
  };

  const handleOpenChat = async (property: Property) => {
    setSelectedProperty(property);
    await fetchMessagesAndReviews(property.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !selectedProperty) return;

    const supabase = createClient();
    const receiverId =
      messages.find((m) => m.sender_id !== currentUser.id)?.sender_id || null;

    if (!receiverId) return alert("No customer found to send message to.");

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: receiverId,
          property_id: selectedProperty.id,
          content: newMessage,
        },
      ])
      .select("*, sender:sender_id(full_name)")
      .single();

    if (!error && data) {
      const msg = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        property_id: data.property_id,
        content: data.content,
        created_at: data.created_at,
        sender: { full_name: data.sender?.[0]?.full_name || "Unknown" },
      };
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    setListings(listings.filter((l) => l.id !== id));
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setMessages([]);
    setChatReviews([]);
    setNewMessage("");
  };

  const getAverageRating = (propertyId: string) => {
    const propertyReviews = reviews[propertyId] || [];
    if (propertyReviews.length === 0) return 0;
    const sum = propertyReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / propertyReviews.length).toFixed(1);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-secondary mb-2">My Listings</h1>
            <p className="text-text-light">Manage your property listings</p>
          </div>
          <Link href="/dashboard/listings/new">
            <Button className="bg-primary hover:bg-primary-dark text-white">Add New Listing</Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 text-text-light opacity-50 mx-auto mb-4" />
              <p className="text-text-light mb-4">No listings yet</p>
              <Link href="/dashboard/listings/new">
                <Button className="bg-primary hover:bg-primary-dark text-white">Create Your First Listing</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main listing info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-2xl text-secondary">{listing.title}</h3>
                            <div className="flex gap-2">
                              {!listing.approved && (
                                <Badge className="bg-yellow-500 text-white border-0">
                                  Pending Approval
                                </Badge>
                              )}
                              <Badge
                                className={`border-0 ${
                                  listing.status === "available"
                                    ? "bg-green-500 text-white"
                                    : listing.status === "pending"
                                    ? "bg-orange-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{listing.address}, {listing.city}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-gray-700 mb-4">
                        <span className="font-medium">{listing.bedrooms} Beds</span>
                        <span className="font-medium">{listing.bathrooms} Baths</span>
                        <span className="font-medium">{listing.square_feet.toLocaleString()} sqft</span>
                      </div>

                      <p className="text-3xl font-bold text-primary mb-6">${listing.price.toLocaleString()}</p>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/dashboard/listings/${listing.id}/view`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" /> View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary-dark text-white"
                          onClick={() => handleOpenChat(listing)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" /> Chat with Customers
                        </Button>
                      </div>
                    </div>

                    {/* Reviews section */}
                    <div className="lg:w-96 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">Reviews</h4>
                        {reviews[listing.id] && reviews[listing.id].length > 0 && (
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{getAverageRating(listing.id)}</span>
                            <span className="text-gray-500 text-sm">({reviews[listing.id].length})</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {!reviews[listing.id] || reviews[listing.id].length === 0 ? (
                          <p className="text-gray-500 text-center py-8 text-sm">No reviews yet</p>
                        ) : (
                          reviews[listing.id].slice(0, 3).map((review) => (
                            <div key={review.id} className="bg-gray-50 rounded-lg p-3 border">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-sm">{review.user.full_name}</p>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                        {reviews[listing.id] && reviews[listing.id].length > 3 && (
                          <p className="text-center text-sm text-primary font-medium">
                            +{reviews[listing.id].length - 3} more reviews
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
          {/* Header */}
          <div className="bg-white border-b shadow-sm flex-shrink-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h2>
                <p className="text-gray-600 text-sm mt-1">Customer Messages & Reviews</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content - takes up remaining space */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Messages Section */}
                <div className="bg-white rounded-xl border shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Messages</h3>
                    
                    <div className="border rounded-lg bg-gray-50 h-96 overflow-y-auto p-4 mb-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">No messages yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-sm ${
                                  msg.sender_id === currentUser?.id
                                    ? "bg-primary text-white"
                                    : "bg-white border"
                                } rounded-lg px-4 py-3 shadow-sm`}
                              >
                                <p className={`text-xs mb-1 ${msg.sender_id === currentUser?.id ? "opacity-75" : "text-gray-600"}`}>
                                  {msg.sender.full_name}
                                </p>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        className="bg-primary hover:bg-primary-dark text-white px-8"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-xl border shadow-sm">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {chatReviews.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-gray-500">No reviews yet</p>
                        </div>
                      ) : (
                        chatReviews.map((review) => (
                          <div key={review.id} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-gray-900">{review.user.full_name}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}