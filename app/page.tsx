import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search,Home, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-secondary">REMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary-dark text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-xl text-teal-100">
              Discover the perfect home with our comprehensive real estate platform
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input placeholder="Enter location, city, or address" className="pl-10 h-12 border-border" />
              </div>
              <Button className="bg-primary hover:bg-primary-dark text-white h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-secondary mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-primary-light to-primary h-48 flex items-center justify-center">
                  <Home className="w-16 h-16 text-white opacity-50" />
                </div>
                <CardHeader>
                  <CardTitle>Modern Apartment</CardTitle>
                  <CardDescription>Downtown District</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">$450,000</span>
                      <span className="text-sm bg-primary text-white px-3 py-1 rounded">Available</span>
                    </div>
                    <div className="flex gap-4 text-sm text-text-light">
                      <span>3 Beds</span>
                      <span>2 Baths</span>
                      <span>1,200 sqft</span>
                    </div>
                    <Link href="/properties/1">
                      <Button className="w-full bg-primary hover:bg-primary-dark text-white">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Home className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-2">5,000+</h3>
              <p className="text-text-light">Properties Listed</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-2">10,000+</h3>
              <p className="text-text-light">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-2">$2B+</h3>
              <p className="text-text-light">Total Transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-teal-100">Join thousands of satisfied customers finding their perfect home</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">Sign Up Now</Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-primary-dark px-8 py-6 text-lg bg-transparent"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">About REMS</h3>
              <p className="text-gray-400">Your trusted real estate platform</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    My Favorites
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Schedule Visits
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Agents</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Manage Listings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    View Leads
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-gray-400">support@rems.com</p>
              <p className="text-gray-400">1-800-REMS-123</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Real Estate Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
