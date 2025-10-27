"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  visit_date: string;
  notes: string | null;
  customer: {
    id: string;
    full_name: string | null;
    email: string | null;
  };
  property: {
    id: string;
    title: string;
    address: string;
    city: string;
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast({
            title: "Error",
            description: "You must be logged in to view leads",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("scheduled_visits")
          .select(`
            id,
            visit_date,
            notes,
            profiles!scheduled_visits_user_id_fkey(id, full_name, email),
            properties!scheduled_visits_property_id_fkey(id, title, address, city)
          `)
          .eq("properties.agent_id", user.id) // only visits for properties owned by this agent
          .order("visit_date", { ascending: false });

        if (error) {
          console.error("Error fetching leads:", error);
          toast({
            title: "Error",
            description: "Failed to fetch leads",
            variant: "destructive",
          });
        } else if (data) {
          const formatted: Lead[] = data.map((d: any) => ({
            id: d.id,
            visit_date: d.visit_date,
            notes: d.notes,
            customer: {
              id: d.profiles.id,
              full_name: d.profiles.full_name,
              email: d.profiles.email,
            },
            property: {
              id: d.properties.id,
              title: d.properties.title,
              address: d.properties.address,
              city: d.properties.city,
            },
          }));
          setLeads(formatted);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [toast]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (leads.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">No scheduled visits yet</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Scheduled Visits</h1>
        <p className="text-text-light">All visits requested by customers for your properties</p>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.property.title}</TableCell>
                  <TableCell>{lead.customer.full_name || "N/A"}</TableCell>
                  <TableCell>{lead.customer.email || "N/A"}</TableCell>
                  <TableCell>{new Date(lead.visit_date).toLocaleString()}</TableCell>
                  <TableCell>{lead.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
