import { FaSyncAlt, FaQuestionCircle, FaCommentDots } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../components/Avatar";


export default function Topbar() {
  return (
    <div className="flex items-center justify-between px-6 h-14 bg-white border-b border-gray-200 w-full">
      
      <div className="flex items-center">
        <FaCommentDots className="text-gray-400 mr-2 text-base" />
        <span className="text-gray-400 font-semibold text-sm lowercase select-none">
          chats
        </span>
        
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
          <FaSyncAlt className="mr-1" /> Refresh
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
          <FaQuestionCircle className="text-yellow-400 mr-1" /> Help
        </button>
        <span className="text-sm text-gray-600 bg-yellow-50 px-2 py-1 rounded">
          <span className="font-semibold text-yellow-500">5</span> / 6 phones
        </span>
        <div className="flex -space-x-2">
          {[
            "/avatar1.png",
            "/avatar2.png",
            "/avatar3.png",
            "/avatar4.png",
            "/avatar5.png",
          ].map((src, i) => (
            <Avatar
              key={i}
              src={src}
              className="w-7 h-7 border-2 border-white"
            />
          ))}
        </div>
        <button>
          <BsThreeDotsVertical className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
