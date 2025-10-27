// lib/types.ts

// --- Custom Database Types (Based on SQL Schema) ---
// Note: In SQL, 'user-defined' types like lead_status and user_role are often
// stored as text/string in TypeScript, representing the possible enum values.

export type UserRole = "customer" | "agent" | "admin";
export type LeadStatus =
  | "interested"
  | "viewed"
  | "negotiation"
  | "closed"
  | "lost";
export type PropertyStatus = "available" | "under_contract" | "sold";

// --- Table Interfaces ---

// Matches the public.profiles table
export interface Profile {
  id: string; // uuid from auth.users
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
  role: UserRole;
}

// Matches the public.properties table
export interface Property {
  id: string; // uuid
  created_at: string;
  title: string;
  description: string | null;
  address: string;
  city: string;
  price: number; // numeric (we use number in TS)
  bedrooms: number; // smallint
  bathrooms: number; // smallint
  square_feet: number; // integer
  property_type: string | null; // USER-DEFINED in SQL, using string here
  agent_id: string; // uuid (references public.profiles)
  status: PropertyStatus;
  approved: boolean;
}

// Matches the public.leads table
export interface Lead {
  id: string; // uuid
  created_at: string;
  status: LeadStatus;
  agent_id: string; // uuid (references public.profiles)
  customer_id: string; // uuid (references public.profiles)
  property_id: string; // uuid (references public.properties)
}

// Matches the public.reviews table
export interface Review {
  id: string; // uuid
  created_at: string;
  comment: string | null;
  rating: number; // smallint, 1 to 5
  approved: boolean;
  user_id: string; // uuid (references public.profiles)
  property_id: string; // uuid (references public.properties)
}

// Matches the public.scheduled_visits table
export interface ScheduledVisit {
  id: string; // uuid
  created_at: string;
  visit_date: string; // timestamp with time zone (use string for simplicity)
  notes: string | null;
  user_id: string; // uuid (references public.profiles)
  property_id: string; // uuid (references public.properties)
}

// Matches the public.favorites table
export interface Favorite {
  user_id: string; // uuid (references public.profiles)
  property_id: string; // uuid (references public.properties)
  created_at: string;
}

// --- Supabase Utility Type (REQUIRED for generic client typing) ---
// This maps your interfaces to the format expected by the Supabase TypeScript client.
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile };
      properties: { Row: Property };
      leads: { Row: Lead };
      reviews: { Row: Review };
      scheduled_visits: { Row: ScheduledVisit };
      favorites: { Row: Favorite };
    };
    // Include other database objects like Views, Functions, Enums, etc., if needed.
    // For this basic setup, we only map the tables.
  };
};

// We don't need to export this here as we only use the Database type
// export type TypedSupabaseClient = SupabaseClient<Database>;
