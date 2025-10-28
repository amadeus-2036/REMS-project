"use client";

// 1. ALL imports are now included
import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home, Users, TrendingUp, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the type for the new property form
interface NewPropertyForm {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
}

// 2. Moved constant outside component, no need for useMemo
const initialFormState: NewPropertyForm = {
  title: "",
  description: "",
  address: "",
  city: "",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  square_feet: 0,
  property_type: "Apartment", // Default value
};

interface AgentDashboardProps {
  userId: string;
}

export function AgentDashboard({ userId }: AgentDashboardProps) {
  const [stats, setStats] = useState({ listings: 0, leads: 0, views: 0 });
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<NewPropertyForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // 3. OPTIMIZED fetchStats to be more reliable
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    try {
      // First, get the count of listings
      const { count: listingsCount, error: listingsError } = await supabase
        .from("properties")
        .select("id", { count: "exact" })
        .eq("agent_id", userId);

      if (listingsError) throw listingsError;

      // Get the property IDs for the agent
      const { data: propertyIds, error: propIdError } = await supabase
        .from("properties")
        .select("id")
        .eq("agent_id", userId);

      if (propIdError) throw propIdError;

      const pIds = propertyIds.map((p) => p.id);

      // Get the count of leads (scheduled visits) for those properties
      const { count: leadsCount, error: leadsError } = await supabase
        .from("scheduled_visits")
        .select("id", { count: "exact" })
        .in("property_id", pIds);
        
      if (leadsError) throw leadsError;

      setStats({
        listings: listingsCount || 0,
        leads: leadsCount || 0,
        views: Math.floor(Math.random() * 500) + 100, // Placeholder
      });
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  // Fetch stats on initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle new listing submission
  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Basic validation
    if (!formData.title || !formData.address || !formData.city || formData.price <= 0) {
      setFormError("Please fill in all required fields: Title, Address, City, and Price.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("properties").insert({
        ...formData,
        agent_id: userId, // This is the crucial link
        approved: true,   // 4. Set to TRUE as requested
      });

      if (error) throw error;

      // Success!
      setIsDialogOpen(false);     // Close the dialog
      setFormData(initialFormState); // Reset the form
      await fetchStats();           // Refresh the stats
      router.refresh();             

    } catch (err: any) {
      setFormError("Failed to create listing: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-secondary mb-2">Agent Dashboard</h1>
          <p className="text-text-light">Manage your listings and leads</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a New Property Listing</DialogTitle>
              <DialogDescription>
                Fill out the details below. The listing will be posted immediately.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitListing} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleFormChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleFormChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Input id="property_type" name="property_type" value={formData.property_type} onChange={handleFormChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" min="0" value={formData.bedrooms} onChange={handleFormChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" name="bathrooms" type="number" min="0" value={formData.bathrooms} onChange={handleFormChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input id="square_feet" name="square_feet" type="number" min="0" value={formData.square_feet} onChange={handleFormChange} />
                </div>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Post Listing"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/dashboard/listings")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Active Listings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-secondary">{stats.listings}</div>
            <Home className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/dashboard/leads")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Active Leads</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-secondary">{stats.leads}</div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Total Views</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-secondary">{stats.views}</div>
            <TrendingUp className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}