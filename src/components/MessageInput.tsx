"use client";
import { useState } from "react";
import {
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaPaperPlane,
  FaStickyNote,
  FaCamera,
} from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function MessageInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Send message to Supabase
  const sendMessage = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    try {
      // Get current user info (for sender_id)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Could not get user info.");
      }

      // Get current user's row from users table
      const { data: userRows, error: userRowsError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id);

      if (userRowsError || !userRows || userRows.length === 0) {
        throw new Error("Could not find your user profile.");
      }

      const currentUserRow = userRows[0];

      // Insert message
      const { error: insertError } = await supabase.from("messages").insert([
        {
          chat_id: chatId,
          sender_id: currentUserRow.id,
          message: message,
        },
      ]);

      if (insertError) {
        throw new Error("Failed to send message. Try again.");
      }

      setMessage("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex items-center px-8 py-3 bg-[#f8fafb] border-t">
      <button type="button">
        <FaSmile className="text-gray-400 text-lg" />
      </button>
      <button type="button" className="ml-2">
        <FaPaperclip className="text-gray-400 text-lg" />
      </button>
      <button type="button" className="ml-2">
        <FaCamera className="text-gray-400 text-lg" />
      </button>
      <button type="button" className="ml-2">
        <FaStickyNote className="text-gray-400 text-lg" />
      </button>
      <input
        type="text"
        placeholder="Message..."
        className="flex-1 mx-4 px-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={sending}
      />
      <button type="button">
        <FaMicrophone className="text-gray-400 text-lg mr-2" />
      </button>
      <button
        type="button"
        className="ml-2 bg-green-500 p-2 rounded-full text-white"
        onClick={sendMessage}
        disabled={sending || !message.trim()}
        aria-label="Send"
      >
        <FaPaperPlane />
      </button>
      <span className="ml-4 text-sm text-gray-500">Periskope</span>
    </div>
  );
}
