import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/types"; // Import the new Database type

/**
 * Creates a specialized Supabase client for use in Next.js Server Components.
 * This client securely reads environment variables and uses the Next.js cookies()
 * function to manage the user's session without making them accessible to the client.
 * * @returns A Supabase client instance configured for server-side usage.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  // Pass the Database type to createServerClient for strong typing
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Function to get a cookie value from the request headers
        get: (name: string) => cookieStore.get(name)?.value,

        // Functions to set/remove cookies in the response headers (required for Auth)
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          // This must set an expired cookie to clear it from the browser
          cookieStore.set({ name, value: "", ...options });
        },
      },
      // Note: Setting schema to 'public' explicitly
      db: {
        schema: "public",
      },
    }
  );
}
