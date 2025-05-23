"use client";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "./Avatar";
import clsx from "clsx";


function tagColor(tag: string) {
  switch (tag) {
    case "Demo":
      return "bg-yellow-100 text-yellow-800";
    case "internal":
      return "bg-green-100 text-green-700";
    case "Signup":
      return "bg-blue-100 text-blue-700";
    case "Content":
      return "bg-green-100 text-green-700";
    case "Dont Send":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function ChatListItem({
  chat,
  currentUserId,
}: {
  chat: any;
  currentUserId: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const members = chat.chat_members.map((cm: any) => cm.users);
  const isGroup = chat.is_group;
  let displayName = chat.name;
  let avatarUrl = chat.avatar_url || "/avatar1.png";

  // For 1:1 chat, show the other user's info
  if (!isGroup && members.length === 2 && currentUserId) {
    const other =
      members.find((u: any) => u.id !== currentUserId) || members[0];
    displayName = other.name;
    avatarUrl = other.avatar_url || "/avatar1.png";
  }

  // Show phone/email under name if available
  let displaySub = "";
  if (!isGroup && members.length === 2 && currentUserId) {
    const other =
      members.find((u: any) => u.id !== currentUserId) || members[0];
    displaySub = other.phone || other.email || "";
  }

  // Tags/labels
  const tags = chat.tags || []; // e.g., ["Demo", "internal"]
  // Last message preview
  const lastMsg = chat.lastMsg ? chat.lastMsg.message : "";
  // Date (last updated)
  const date = chat.updated_at
    ? new Date(chat.updated_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
    : "";

  // Active state
  const isActive = pathname.endsWith(`/${chat.id}`);

  return (
    <li
      className={clsx(
        "flex items-center px-4 py-2 cursor-pointer border-b border-gray-100 transition select-none",
        isActive ? "bg-gray-100" : "hover:bg-gray-50"
      )}
      onClick={() => router.push(`/chats/${chat.id}`)}
    >
      {/* Avatar */}
      <Avatar
        src={avatarUrl}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
      {/* Main info */}
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate text-sm">{displayName}</span>
          {/* Tags */}
          {tags.map((tag: string) => (
            <span
              key={tag}
              className={`ml-1 text-[11px] rounded-full px-2 py-0.5 font-medium ${tagColor(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>
        {displaySub && (
          <div className="text-xs text-gray-500 truncate">{displaySub}</div>
        )}
        {/* Last message preview */}
        <div className="text-xs text-gray-500 truncate">{lastMsg}</div>
      </div>
      {/* Right: Date */}
      <div className="flex flex-col items-end ml-2 min-w-[60px]">
        <span className="text-xs text-gray-400">{date}</span>
        {/* Optionally, show unread badge */}
      </div>
    </li>
  );
}
