import ChatWindow from "@/components/ChatWindow";

export default async function ChatIdPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return <ChatWindow chatId={chatId} />;
}
