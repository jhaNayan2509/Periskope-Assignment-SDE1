// src/components/ChatListHeader.tsx
export default function ChatListHeader() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
      <button className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs hover:bg-green-200 transition">
        Custom filter
      </button>
      <button className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition">
        Save
      </button>
      <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1">
        Filtered
        <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold ml-1 leading-none">
          3
        </span>
      </span>
    </div>
  );
}
