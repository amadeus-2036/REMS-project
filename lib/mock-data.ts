// Mock data for the REMS MVP
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "buyer" | "agent"
  agentInfo?: {
    phone: string
    agency: string
    bio: string
    avatar: string
  }
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  address: string
  city: string
  state: string
  zipCode: string
  image: string
  agentId: string
  createdAt: string
}

export interface Lead {
  id: string
  propertyId: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  message: string
  status: "new" | "contacted" | "viewing" | "offer" | "closed"
  createdAt: string
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "buyer@example.com",
    password: "password123",
    name: "John Buyer",
    role: "buyer",
  },
  {
    id: "agent-1",
    email: "agent@example.com",
    password: "password123",
    name: "Sarah Agent",
    role: "agent",
    agentInfo: {
      phone: "(555) 123-4567",
      agency: "Premier Realty Group",
      bio: "Experienced real estate agent with 10+ years in the industry.",
      avatar: "/professional-woman.png",
    },
  },
]

// Mock properties
export const mockProperties: Property[] = [
  {
    id: "prop-1",
    title: "Modern Downtown Loft",
    description: "Beautiful modern loft in the heart of downtown with stunning city views.",
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    image: "/modern-downtown-loft.jpg",
    agentId: "agent-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prop-2",
    title: "Suburban Family Home",
    description: "Spacious family home with large backyard, perfect for growing families.",
    price: 650000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    address: "456 Oak Avenue",
    city: "San Jose",
    state: "CA",
    zipCode: "95110",
    image: "/suburban-family-home.jpg",
    agentId: "agent-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "prop-3",
    title: "Luxury Penthouse",
    description: "Exclusive penthouse with panoramic views and premium finishes.",
    price: 1200000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2000,
    address: "789 Park Boulevard",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    image: "/luxury-penthouse.png",
    agentId: "agent-1",
    createdAt: new Date().toISOString(),
  },
]

// Mock leads
export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    propertyId: "prop-1",
    buyerId: "user-1",
    buyerName: "John Buyer",
    buyerEmail: "buyer@example.com",
    buyerPhone: "(555) 987-6543",
    message: "Very interested in this property. Would like to schedule a viewing.",
    status: "new",
    createdAt: new Date().toISOString(),
  },
]

export let globalLeads = mockLeads

export function addLead(lead: Lead) {
  globalLeads = [...globalLeads, lead]
}

export function getLeadsByProperty(propertyId: string) {
  return globalLeads.filter((l) => l.propertyId === propertyId)
}
