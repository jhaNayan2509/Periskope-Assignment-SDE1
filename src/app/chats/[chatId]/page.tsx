import ChatWindow from "@/components/ChatWindow";

export default function ChatIdPage({ params }: { params: { chatId: string } }) {
  // No await needed here!
  const { chatId } = params;
  return <ChatWindow chatId={chatId} />;
}
