// src/components/RightSidebar.tsx
import {
  MdSearch,
  MdAttachFile,
  MdInsertEmoticon,
  MdPhotoCamera,
  MdNote,
  MdPerson,
} from "react-icons/md";

export default function RightSidebar() {
  return (
    <div className="w-12 bg-white border-l flex flex-col items-center py-4 space-y-6">
      <MdSearch className="text-gray-400 text-xl" />
      <MdAttachFile className="text-gray-400 text-xl" />
      <MdInsertEmoticon className="text-gray-400 text-xl" />
      <MdPhotoCamera className="text-gray-400 text-xl" />
      <MdNote className="text-gray-400 text-xl" />
      <MdPerson className="text-gray-400 text-xl" />
    </div>
  );
}
