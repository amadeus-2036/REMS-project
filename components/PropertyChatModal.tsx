"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

interface Message {
  id?: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatModalProps {
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  onClose: () => void;
}

export default function PropertyChatModal({ propertyId, propertyTitle, agentId, onClose }: ChatModalProps) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    getUser();
  }, [supabase]);

  // Fetch existing messages
  useEffect(() => {
    if (!userId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${agentId}),and(sender_id.eq.${agentId},receiver_id.eq.${userId})`)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true });

      if (!error && data) setMessages(data);
    };

    loadMessages();
  }, [userId, agentId, propertyId, supabase]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        const msg = payload.new as Message;
        if (
          msg.property_id === propertyId &&
          ((msg.sender_id === userId && msg.receiver_id === agentId) ||
            (msg.sender_id === agentId && msg.receiver_id === userId))
        ) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, agentId, propertyId, supabase]);

  // Scroll to latest
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !userId) return;

    const newMsg: Message = {
      property_id: propertyId,
      sender_id: userId,
      receiver_id: agentId,
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]); // instant render
    setText("");

    await supabase.from("messages").insert([newMsg]); // store in DB
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[400px] bg-white rounded-2xl shadow-xl">
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle className="text-lg font-semibold">
            Chat about: <span className="text-blue-600">{propertyTitle}</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col h-[500px] p-4">
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    msg.sender_id === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="w-4 h-4 mr-1" /> Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
