"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Users, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface AgentDashboardProps {
  userId: string;
}

export function AgentDashboard({ userId }: AgentDashboardProps) {
  const [stats, setStats] = useState({ listings: 0, leads: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      if (!userId) return;

      try {
        const [listingsRes, leadsRes] = await Promise.all([
          supabase
            .from("properties")
            .select("id", { count: "exact" })
            .eq("agent_id", userId),
          supabase
            .from("scheduled_visits")
            .select("id", { count: "exact" })
            .in(
              "property_id",
              (await supabase.from("properties").select("id").eq("agent_id", userId)).data?.map(
                (p: any) => p.id
              ) || []
            ),
        ]);

        setStats({
          listings: listingsRes.count || 0,
          leads: leadsRes.count || 0,
          views: Math.floor(Math.random() * 500) + 100,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Agent Dashboard</h1>
        <p className="text-text-light">Manage your listings and leads</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer" onClick={() => router.push("/dashboard/listings")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Active Listings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-secondary">{stats.listings}</div>
            <Home className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => router.push("/dashboard/leads")}>
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
