"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (data) {
        setUsers(data as User[])
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const customerCount = users.filter((u) => u.role === "customer").length
  const agentCount = users.filter((u) => u.role === "agent").length
  const adminCount = users.filter((u) => u.role === "admin").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">User Management</h1>
        <p className="text-text-light">Manage all user accounts and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">{customerCount}</p>
              <p className="text-text-light">Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">{agentCount}</p>
              <p className="text-text-light">Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">{adminCount}</p>
              <p className="text-text-light">Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-secondary mb-2">{user.full_name || "No name"}</h3>
                  <div className="flex items-center gap-2 text-text-light mb-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <p className="text-sm text-text-light">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    user.role === "admin"
                      ? "bg-error text-white"
                      : user.role === "agent"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                  }
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
