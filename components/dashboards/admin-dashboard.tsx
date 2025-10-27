"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, AlertCircle, Users } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Admin Dashboard</h1>
        <p className="text-text-light">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Pending Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-secondary">5</div>
              <AlertCircle className="w-8 h-8 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Pending Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-secondary">12</div>
              <AlertCircle className="w-8 h-8 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-secondary">1,234</div>
              <Users className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-light">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-success">Healthy</div>
              <CheckCircle className="w-8 h-8 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Verification</CardTitle>
            <CardDescription>Review and approve new agent registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-lg">
                <p className="text-sm text-text-light mb-4">5 agents pending verification</p>
                <Link href="/dashboard/verify-agents">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">Review Agents</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing Verification</CardTitle>
            <CardDescription>Review and approve new property listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-lg">
                <p className="text-sm text-text-light mb-4">12 listings pending approval</p>
                <Link href="/dashboard/verify-listings">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">Review Listings</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-lg">
                <p className="text-sm text-text-light mb-4">1,234 total users</p>
                <Link href="/dashboard/users">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">Manage Users</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>Review and moderate user-generated content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-lg">
                <p className="text-sm text-text-light mb-4">3 items flagged for review</p>
                <Link href="/dashboard/moderate">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">Review Content</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
