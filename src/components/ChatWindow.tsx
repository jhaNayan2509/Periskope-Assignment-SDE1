"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ChatWindow({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return; // don't fetch if chatId is undefined/null

    let mounted = true;
    let subscription: any = null;

    async function fetchData() {
      setLoading(true);

      // Fetch chat members
      const { data: memberRows, error: memberRowsError } = await supabase
        .from("chat_members")
        .select("users(id, name, avatar_url, phone, email)")
        .eq("chat_id", chatId);

      if (memberRowsError) {
        console.error("Error fetching chat members:", memberRowsError);
        if (mounted) setMembers([]);
      } else if (mounted) {
        setMembers(memberRows?.map((m: any) => m.users) || []);
      }

      // Fetch chat info
      const { data: chatData, error: chatDataError } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .single();
      if (chatDataError) {
        console.error("Error fetching chat info:", chatDataError);
        if (mounted) setChat(null);
      } else if (mounted) {
        setChat(chatData);
      }

      // Fetch messages
      const { data: msgs, error: msgsError } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
      if (msgsError) {
        console.error("Error fetching messages:", msgsError);
        if (mounted) setMessages([]);
      } else if (mounted) {
        setMessages(msgs || []);
      }

      setLoading(false);
    }

    fetchData();

    // Set up real-time listener for new messages in this chat
    subscription = supabase
      .channel(`messages-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((msgs) => {
            // Avoid duplicate if already present
            if (msgs.some((m) => m.id === payload.new.id)) return msgs;
            return [...msgs, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading)
    return <div className="p-4 text-gray-400">Loading messages...</div>;

  // Group messages by date for date separators
  const messageGroups = messages.reduce((acc: any[], msg) => {
    const msgDate = msg.created_at.split("T")[0];
    if (!acc.length || acc[acc.length - 1].date !== msgDate) {
      acc.push({ date: msgDate, messages: [msg] });
    } else {
      acc[acc.length - 1].messages.push(msg);
    }
    return acc;
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[url('/wa-bg.png')] bg-repeat px-0">
      {/* Chat header */}
      <div className="px-8 pt-4 pb-2 bg-white/80">
        <div className="font-semibold text-base text-gray-900">
          {chat?.name || "Chat"}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {members.map((m: any) => m.name).join(", ")}
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex justify-center my-4">
              <span className="bg-white text-gray-400 text-xs px-3 py-1 rounded-full shadow-sm">
                {formatDate(group.date)}
              </span>
            </div>
            {/* Messages for this date */}
            {group.messages.map((msg: any) => (
              <MessageBubble key={msg.id} msg={msg} members={members} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message input */}
      <MessageInput chatId={chatId} />
    </div>
  );
}
