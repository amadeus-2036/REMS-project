"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  searchTerm: string
  minPrice: number
  maxPrice: number
  bedrooms: number | null
  bathrooms: number | null
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: null,
    bathrooms: null,
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="bg-card rounded-lg p-6 space-y-4 border border-border">
      <h3 className="font-semibold text-lg text-foreground">Filters</h3>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="City, address..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              variant={filters.bedrooms === num ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ bedrooms: filters.bedrooms === num ? null : num })}
              className={filters.bedrooms === num ? "bg-primary hover:bg-primary/90" : ""}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bathrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <Button
              key={num}
              variant={filters.bathrooms === num ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange({ bathrooms: filters.bathrooms === num ? null : num })}
              className={filters.bathrooms === num ? "bg-primary hover:bg-primary/90" : ""}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
