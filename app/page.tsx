// app/page.tsx - This is a Next.js Async Server Component (default behavior)
// Data fetching occurs securely on the server before the page is rendered.

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Property } from "@/lib/types";
import Link from "next/link";

// --- 1. Server-Side Data Fetching Function ---
/**
 * Fetches all approved and available properties from the Supabase database.
 * @returns An array of Property objects or an empty array on error.
 */
async function getAvailableProperties(): Promise<Property[]> {
  // Initialize the secure server-side client
  const supabase = createServerSupabaseClient();

  // Query the 'properties' table from your schema
  const { data, error } = await supabase
    .from("properties")
    .select("*") // Selects all columns defined in the Property type
    .eq("approved", true) // Filter: only show properties approved by an admin
    .eq("status", "available") // Filter: only show properties marked as available
    .order("created_at", { ascending: false }) // Show newest properties first
    .limit(12); // Limit the results for performance

  if (error) {
    // Log the error securely on the server and return an empty array
    console.error("Error fetching available properties:", error.message);
    return [];
  }

  // Cast and return the fetched data
  return data as Property[];
}

// --- 2. Main Page Component (Async Server Component) ---
export default async function Home() {
  // Await the data fetch. This pauses rendering until data is ready.
  const properties = await getAvailableProperties();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Header/Hero Section (Placeholder) --- */}
      <div className="bg-white shadow-md p-10 mb-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-indigo-700">
            Find Your Dream Home
          </h1>
          <p className="text-gray-600 mt-2">
            Explore the newest real estate listings managed by our certified
            agents.
          </p>
        </div>
      </div>

      {/* --- Property Grid Section --- */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Available Listings ({properties.length} found)
        </h2>

        {properties.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow-inner">
            <p className="text-xl text-gray-500">
              No available properties found at this time.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Check back later or ensure your database has records.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Map over the fetched data */}
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                {/* Image Placeholder */}
                <div className="h-48 w-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                  Property Image Placeholder
                </div>

                <div className="p-4">
                  {/* Property Title and Price */}
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {property.title}
                  </h3>
                  {/* Use toLocaleString for proper currency formatting */}
                  <p className="text-2xl font-bold text-green-600 my-2">
                    ${property.price.toLocaleString("en-US")}
                  </p>

                  {/* Key Features */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3 border-t pt-3">
                    <div className="flex items-center">
                      {/* Icon for Beds (Lucide-React might be used here, but using SVG placeholder) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 2a1 1 0 00-1 1v1h2V3a1 1 0 00-1-1zm6 8a6 6 0 11-12 0 6 6 0 0112 0z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {property.bedrooms} Beds
                    </div>
                    <div className="flex items-center">
                      {/* Icon for Baths */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2v1h2V4a1 1 0 00-2 0V2z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 100 12 6 6 0 000-12zm-3 5a1 1 0 000 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {property.bathrooms} Baths
                    </div>
                    <div className="flex items-center">
                      {/* Icon for Square Footage */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {property.square_feet.toLocaleString("en-US")} sq ft
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 border-t">
                  {/* Link to a detail page for the property */}
                  <Link
                    href={`/properties/${property.id}`}
                    className="block text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View Property
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
