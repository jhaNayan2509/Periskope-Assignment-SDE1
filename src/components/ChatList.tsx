"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatListItem from "./ChatListItem";

export default function ChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchChats() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    const { data: userRows, error: userRowsError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id);

    if (userRowsError || !userRows || userRows.length === 0) {
      console.error("Error fetching user row:", userRowsError);
      setChats([]);
      setLoading(false);
      return;
    }

    const currentUserRow = userRows[0];
    setCurrentUserId(currentUserRow.id);

    const { data: chatMembers, error: chatMembersError } = await supabase
      .from("chat_members")
      .select("chat_id")
      .eq("user_id", currentUserRow.id);

    if (chatMembersError || !chatMembers || chatMembers.length === 0) {
      console.error("Error fetching chat memberships:", chatMembersError);
      setChats([]);
      setLoading(false);
      return;
    }

    const chatIds = chatMembers.map((cm: any) => cm.chat_id);

    console.log("Fetching chats with IDs:", chatIds);

    const { data: chatsData, error: chatsError } = await supabase
      .from("chats")
      .select(
        `
        *,
        chat_members(
          user_id,
          users(name, avatar_url, id, phone_number, email)
        ),
        messages(
          id, message, created_at, sender_id
        )
      `
      )
      .in("id", chatIds)
      .order("updated_at", { ascending: false });

    if (chatsError) {
      console.error("Supabase chat fetch error:", chatsError);
      setChats([]);
      setLoading(false);
      return;
    }

    console.log("Fetched chats data:", chatsData);

    const chatsWithLastMsg = (chatsData || []).map((chat: any) => {
      const lastMsg =
        chat.messages && chat.messages.length > 0
          ? chat.messages.sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0]
          : null;
      return { ...chat, lastMsg };
    });

    setChats(chatsWithLastMsg);
    setLoading(false);
  }

  useEffect(() => {
    fetchChats();

    const msgChannel = supabase
      .channel("messages-listen")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;
          setChats((prevChats) => {
            const chatIndex = prevChats.findIndex(
              (chat) => chat.id === newMessage.chat_id
            );
            if (chatIndex !== -1) {
              const updatedChats = [...prevChats];
              updatedChats[chatIndex] = {
                ...updatedChats[chatIndex],
                lastMsg: newMessage,
                updated_at: newMessage.created_at,
              };
              return updatedChats.sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              );
            }
            return prevChats;
          });
        }
      )
      .subscribe();

    const chatChannel = supabase
      .channel("chats-listen")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_members" },
        (payload) => {
          if (payload.new.user_id === currentUserId) {
            fetchChats();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(chatChannel);
    };
  }, [currentUserId]);

  if (loading) return <div className="p-4 text-gray-400">Loading chats...</div>;

  return (
    <ul className="overflow-y-auto h-full px-0">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} currentUserId={currentUserId} />
      ))}
    </ul>
  );
}
