
import ChatWindow from "@/components/ChatWindow";

export default async function ChatIdPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chatId } = await params; // Await the params object
  return <ChatWindow chatId={chatId} />;
}