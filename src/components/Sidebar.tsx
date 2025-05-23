import {
  FaFolder,
  FaDownload,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";
import ChatList from "./ChatList";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import NewChatModal from "./NewChatModal";

export default function Sidebar() {
  const router = useRouter();
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  }, [router]);

  const handleStartChat = () => setShowNewChatModal(true);

  
  const handleCreateChat = async (selectedUsers: any[], groupName?: string) => {
    setShowNewChatModal(false);
    console.log("Selected users:", selectedUsers, "Group name:", groupName);

    
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) {
      console.error("No current user!");
      return;
    }

    
    const { data: userRows, error: userRowError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", currentUser.id);

    const currentUserRow = userRows && userRows.length > 0 ? userRows[0] : null;

    if (!currentUserRow) {
      console.error("Could not find current user row", userRowError);
      return;
    }

    let chatId: string | null = null;

    if (selectedUsers.length === 1) {
      const { data: existing, error: existErr } = await supabase
        .from("chat_members")
        .select("chat_id")
        .eq("user_id", currentUserRow.id);

      if (existErr) console.error("Error checking existing chat:", existErr);

      let foundChatId: string | null = null;
      if (existing) {
        for (const row of existing) {
          const { data: members, error: memErr } = await supabase
            .from("chat_members")
            .select("user_id")
            .eq("chat_id", row.chat_id);
          if (memErr) console.error("Error fetching members:", memErr);
          const memberIds = members?.map((m) => m.user_id) || [];
          if (
            memberIds.length === 2 &&
            memberIds.includes(currentUserRow.id) &&
            memberIds.includes(selectedUsers[0].id)
          ) {
            foundChatId = row.chat_id;
            break;
          }
        }
      }

      if (foundChatId) {
        chatId = foundChatId;
      } else {
        
        const otherUser = selectedUsers[0];
        const chatName = otherUser.name || otherUser.email || "Direct Chat";
        const { data: chat, error: chatErr } = await supabase
          .from("chats")
          .insert([{ name: chatName, is_group: false }])
          .select()
          .single();

        if (!chat || chatErr) {
          console.error("Error creating chat:", chatErr);
          return;
        }
        chatId = chat.id;
        
        const { error: memberErr } = await supabase
          .from("chat_members")
          .insert([
            { chat_id: chatId, user_id: currentUserRow.id },
            { chat_id: chatId, user_id: otherUser.id },
          ]);
        if (memberErr) {
          console.error("Error adding members:", memberErr);
          return;
        }
      }
    } else if (selectedUsers.length > 1) {
      
      const { data: chat, error: chatErr } = await supabase
        .from("chats")
        .insert([{ name: groupName, is_group: true }])
        .select()
        .single();
      if (!chat || chatErr) {
        console.error("Error creating group chat:", chatErr);
        return;
      }
      chatId = chat.id;
      
      const { error: memberErr } = await supabase.from("chat_members").insert([
        { chat_id: chatId, user_id: currentUserRow.id },
        ...selectedUsers.map((u) => ({
          chat_id: chatId,
          user_id: u.id,
        })),
      ]);
      if (memberErr) {
        console.error("Error adding group members:", memberErr);
        return;
      }
    }

    if (chatId) {
      console.log("Navigating to chat:", chatId);
      router.push(`/chats/${chatId}`);
    } else {
      console.error("No chatId generated!");
    }
  };
  
  

  return (
    <aside className="relative w-[400px] bg-white border-r flex flex-col">
      
      <div className="flex items-center px-4 py-2 border-b bg-white w-full">
    
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
            <span className="relative w-5 h-5 flex items-center justify-center">
              <FaFolder className="text-green-600 text-[20px]" />
              <FaDownload
                className="absolute left-1/2 top-1/2 text-white text-[8px]"
                style={{ transform: "translate(-50%, -50%)" }}
              />
            </span>
            Custom filter
          </span>
          <button className="border border-gray-300 bg-white px-2 py-1 text-sm font-bold text-gray-700 rounded-md">
            Save
          </button>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <button className="border border-gray-300 bg-white px-2 py-1 text-sm font-bold text-gray-700 flex items-center gap-1 rounded-md">
            <FaSearch className="text-gray-700 text-[13px]" />
            Search
          </button>
          <span className="relative flex items-center gap-1 border border-gray-300 bg-white px-2 py-1 text-sm font-bold text-green-600 rounded-md">
            <FaFilter className="text-green-600 text-base" />
            Filtered
            <span className="absolute -top-2 -right-2 flex items-center justify-center bg-green-500 text-white rounded-full w-4 h-4 shadow border-2 border-white cursor-pointer">
              <FaTimes className="text-xs" />
            </span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
      
      <div className="absolute left-0 bottom-0 w-full flex items-center px-4 pb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
          style={{ minWidth: "80px", textAlign: "left" }}
        >
          Logout
        </button>
      </div>
      
      <button
        className="absolute bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl z-50"
        onClick={handleStartChat}
        aria-label="Start new chat"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        <FaCommentDots />
      </button>
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleCreateChat}
        />
      )}
    </aside>
  );
}
