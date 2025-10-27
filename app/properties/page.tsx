"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockProperties } from "@/lib/mock-data"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters, type FilterState } from "@/components/property-filters"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function PropertiesPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: null,
    bathrooms: null,
  })

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesPrice = property.price >= filters.minPrice && property.price <= filters.maxPrice

      const matchesBedrooms = filters.bedrooms === null || property.bedrooms === filters.bedrooms

      const matchesBathrooms = filters.bathrooms === null || property.bathrooms === filters.bathrooms

      return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms
    })
  }, [filters])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">REMS</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Properties</h1>
          <p className="text-muted-foreground">Find your perfect property from our listings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <PropertyFilters onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
