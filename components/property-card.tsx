import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Property } from "@/lib/mock-data"
import { Heart, MapPin, Bed, Bath, Ruler } from "lucide-react"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-border/50 hover:border-primary/30">
        <div className="relative h-56 bg-muted overflow-hidden group">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg">
            <Heart className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-1">{property.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {property.address}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">${(property.price / 1000).toFixed(0)}K</span>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
