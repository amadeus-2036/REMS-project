import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/mock-data"
import { Phone, Mail } from "lucide-react"

interface AgentCardProps {
  agent: User
}

export function AgentCard({ agent }: AgentCardProps) {
  if (!agent.agentInfo) return null

  return (
    <Card className="border border-border">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={agent.agentInfo.avatar || "/placeholder.svg"}
            alt={agent.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.agentInfo.agency}</p>
          </div>
        </div>

        <p className="text-sm text-foreground">{agent.agentInfo.bio}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{agent.agentInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{agent.email}</span>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90">Contact Agent</Button>
      </CardContent>
    </Card>
  )
}
