import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/types"; // Import the new Database type

// This function creates the Supabase client instance for use in client components
// and regular utility functions where we need access to the environment variables.
export function createClient() {
  // Pass the Database type to createBrowserClient for strong typing
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
