"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Eye } from "lucide-react";

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

export default function ListingsPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setListings(data as Property[]);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    setListings(listings.filter((l) => l.id !== id));
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
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
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => window.location.href=`/dashboard/listings/${listing.id}/view`}>
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-secondary">{listing.title}</h3>
                      <div className="flex gap-2">
                        {!listing.approved && <Badge variant="outline" className="bg-warning text-white">Pending</Badge>}
                        <Badge
                          variant="outline"
                          className={
                            listing.status === "available" ? "bg-success text-white" :
                            listing.status === "pending" ? "bg-warning text-white" : "bg-error text-white"
                          }
                        >
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-text-light mb-3">
                      <MapPin className="w-4 h-4" />
                      {listing.address}, {listing.city}
                    </div>
                    <div className="flex gap-4 text-sm text-text-light mb-3">
                      <span>{listing.bedrooms} Beds</span>
                      <span>{listing.bathrooms} Baths</span>
                      <span>{listing.square_feet} sqft</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">${listing.price.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/listings/${listing.id}/view`}>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/listings/${listing.id}/edit`}>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-error hover:bg-error hover:text-white"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
