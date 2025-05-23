// import ChatWindow from "@/components/ChatWindow";

// export default function ChatsPage() {
//   return <ChatWindow />;
// }
"use client";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export default function ChatIdPage() {
  const params = useParams();
  const chatId = params?.chatId as string;
  return <ChatWindow chatId={chatId} />;
}
