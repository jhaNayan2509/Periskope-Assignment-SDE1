"use client";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import clsx from "clsx";
import { supabase } from "@/lib/supabaseClient";
import { FaCheckDouble } from "react-icons/fa";

export default function MessageBubble({
  msg,
  members,
}: {
  msg: any;
  members: any[];
}) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUserId() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // Get the users.id, not auth user id
      const { data: userRows } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id);
      if (userRows && userRows.length > 0) {
        setUserId(userRows[0].id);
      }
    }
    getUserId();
  }, []);

  const isSent = msg.sender_id === userId;
  const sender = members.find((u: any) => u.id === msg.sender_id);

  // Show phone/email below name if available
  const senderDetails = sender?.phone || sender?.email || "";

  return (
    <div
      className={clsx("flex mb-3", isSent ? "justify-end" : "justify-start")}
    >
      {!isSent && (
        <Avatar
          src={sender?.avatar_url || "/avatar1.png"}
          alt={sender?.name}
          className="mr-2"
        />
      )}
      <div
        className={clsx(
          "max-w-[60%] px-4 py-2 rounded-lg shadow-sm",
          isSent ? "bg-[#e6f9ea] text-right" : "bg-white border text-left"
        )}
      >
        <div className="text-xs font-bold mb-0.5">{sender?.name}</div>
        {senderDetails && (
          <div className="text-[11px] text-gray-400 mb-1">{senderDetails}</div>
        )}
        <div className="text-sm">{msg.message}</div>
        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-xs text-gray-400">
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSent && (
            <FaCheckDouble
              className="text-green-500 text-xs ml-1"
              title="Delivered"
            />
          )}
        </div>
      </div>
    </div>
  );
}
