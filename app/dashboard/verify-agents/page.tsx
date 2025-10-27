"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Agent {
  id: string
  email: string
  full_name: string
  phone: string
  bio: string
  role: string
}

export default function VerifyAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAgents = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("*").eq("role", "agent")

      if (data) {
        setAgents(data as Agent[])
      }
      setLoading(false)
    }

    fetchAgents()
  }, [])

  const handleApprove = async (agentId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({ verified: true }).eq("id", agentId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Agent approved successfully",
      })
      setAgents(agents.filter((a) => a.id !== agentId))
    }
  }

  const handleReject = async (agentId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").delete().eq("id", agentId)

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Agent rejected",
      })
      setAgents(agents.filter((a) => a.id !== agentId))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary mb-2">Verify Agents</h1>
        <p className="text-text-light">Review and approve new agent registrations</p>
      </div>

      {agents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-success opacity-50 mx-auto mb-4" />
            <p className="text-text-light">All agents have been verified</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-secondary mb-2">{agent.full_name}</h3>
                    <div className="flex flex-col gap-2 text-sm text-text-light mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {agent.email}
                      </div>
                      {agent.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {agent.phone}
                        </div>
                      )}
                    </div>
                    {agent.bio && <p className="text-sm text-text-light">{agent.bio}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(agent.id)}
                      className="bg-success hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(agent.id)} className="bg-error hover:bg-red-700 text-white">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
