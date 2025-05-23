"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Avatar from "./Avatar";

export default function NewChatModal({
  onClose,
  onCreateChat,
}: {
  onClose: () => void;
  onCreateChat: (users: any[], groupName?: string) => void;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const authUserId = String(user.id).trim();
      console.log("Current Auth User ID:", authUserId, typeof authUserId);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("auth_user_id", authUserId)
        .not("auth_user_id", "is", null);

      console.log("Fetched users:", data, error);
      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);
  
  
  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    const selectedUsers = users.filter((u) => selected.includes(u.id));
    onCreateChat(selectedUsers, selected.length > 1 ? groupName : undefined);
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Start New Chat</h2>
        <ul>
          {users.map((u) => (
            <li
              key={u.id}
              className={`flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer ${
                selected.includes(u.id) ? "bg-green-50" : ""
              }`}
              onClick={() => handleToggle(u.id)}
            >
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => handleToggle(u.id)}
                className="accent-green-500"
                onClick={(e) => e.stopPropagation()}
              />
              <Avatar
                src={u.avatar_url || "/avatar1.png"}
                alt={u.name}
                className="w-8 h-8"
              />
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
            </li>
          ))}
        </ul>
        {selected.length > 1 && (
          <input
            type="text"
            className="w-full border mt-3 mb-2 px-3 py-2 rounded text-sm"
            placeholder="Group chat name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCreate}
            disabled={
              selected.length === 0 || (selected.length > 1 && !groupName)
            }
            className={`flex-1 py-2 rounded ${
              selected.length === 0 || (selected.length > 1 && !groupName)
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {selected.length > 1 ? "Create Group" : "Start Chat"}
          </button>
          <button onClick={onClose} className="flex-1 py-2 bg-gray-200 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
