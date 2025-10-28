"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PropertyChatProps {
  propertyId: string
  propertyTitle: string
  agentId: string
  userId: string
  userName: string
}

export default function PropertyChat({
  propertyId,
  propertyTitle,
  agentId,
  userId,
  userName,
}: PropertyChatProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadMessages()
    const unsubscribe = subscribeToMessages()
    return () => {
      unsubscribe()
    }
  }, [propertyId])

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, sender_id, receiver_id, content, created_at")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: true })

    if (!error && data) setMessages(data)
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat_${propertyId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `property_id=eq.${propertyId}` },
        (payload) => {
          const newMsg = payload.new
          setMessages((prev) => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const receiverId = userId === agentId ? null : agentId // if agent is chatting, no receiver

    const { error } = await supabase.from("messages").insert([
      {
        property_id: propertyId,
        sender_id: userId,
        receiver_id: receiverId || agentId, // ensures receiver_id exists
        content: newMessage.trim(),
      },
    ])

    if (error) {
      console.error("Error sending message:", error)
      return
    }

    setNewMessage("")
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === userId
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs p-2 px-3 rounded-2xl ${
                    isMine
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-xs mb-1 font-semibold">
                    {isMine ? "You" : "Agent"}
                  </p>
                  <p>{msg.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t p-3 flex items-center gap-2">
        <Input
          type="text"
          placeholder={`Message about "${propertyTitle}"...`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1"
        />
        <Button onClick={sendMessage} className="bg-primary text-white">
          Send
        </Button>
      </div>
    </div>
  )
}
