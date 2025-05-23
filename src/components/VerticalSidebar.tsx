import { useState } from "react";
import {
  FaHome,
  FaCommentDots,
  FaRegEdit,
  FaChartLine,
  FaBullhorn,
  FaUsers,
  FaAddressBook,
} from "react-icons/fa";
import { MdOutlineLightbulb, MdOutlineAutoAwesome } from "react-icons/md";
import { PiListBulletsBold } from "react-icons/pi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { TbPhoto } from "react-icons/tb";
import { RxShuffle } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";

export default function VerticalSidebar() {
  const [active, setActive] = useState("");

  
  const mainIcons = [
    { key: "home", icon: FaHome, label: "Home" },
    { key: "chats", icon: FaCommentDots, label: "Chats" },
    { key: "edit", icon: FaRegEdit, label: "Edit" },
    { key: "chart", icon: FaChartLine, label: "Analytics" },
    { key: "list", icon: PiListBulletsBold, label: "List" },
    { key: "bullhorn", icon: FaBullhorn, label: "Announcements" },
    {
      key: "lightbulb",
      icon: MdOutlineLightbulb,
      label: "Tips",
      notification: true,
    },
    { key: "users", icon: FaUsers, label: "Users" },
    { key: "documents", icon: HiOutlineDocumentDuplicate, label: "Documents" },
    { key: "photos", icon: TbPhoto, label: "Photos" },
    { key: "shuffle", icon: RxShuffle, label: "Shuffle" },
  ];

  const settingsIcon = {
    key: "settings",
    icon: IoSettingsOutline,
    label: "Settings",
  };

  // Bottom group
  const bottomIcons = [
    { key: "addressbook", icon: FaAddressBook, label: "Contacts" },
    { key: "stars", icon: MdOutlineAutoAwesome, label: "Highlights" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-14 bg-white border-r border-gray-200 h-full flex flex-col justify-between items-center z-20">
      <div className="flex flex-col items-center w-full">
        
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mt-2 mb-4 overflow-hidden">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        
        <nav className="flex flex-col items-center w-full">
          {mainIcons.map(({ key, icon: Icon, label, notification }, idx) => (
            <div
              key={key}
              onClick={() => setActive(key)}
              className={`
                flex items-center justify-center w-full h-9 cursor-pointer relative
                ${active === key ? "bg-gray-100" : ""}
                group border-b border-gray-100 transition
              `}
              style={{
                borderRadius: active === key ? "9999px" : "0",
                borderBottomWidth: idx === mainIcons.length - 1 ? 0 : undefined,
              }}
              aria-label={label}
            >
              <Icon
                className={`text-base transition-colors
                  ${
                    active === key
                      ? "text-green-500"
                      : "text-gray-400 group-hover:text-green-500"
                  }
                `}
              />
              
              {notification && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </div>
          ))}
          
          <div
            onClick={() => setActive(settingsIcon.key)}
            className={`
              flex items-center justify-center w-full h-9 cursor-pointer relative
              ${active === settingsIcon.key ? "bg-gray-100" : ""}
              group border-b border-gray-100 transition
              mb-16
            `}
            style={{
              borderRadius: active === settingsIcon.key ? "9999px" : "0",
            }}
            aria-label={settingsIcon.label}
          >
            <settingsIcon.icon
              className={`text-base transition-colors
                ${
                  active === settingsIcon.key
                    ? "text-green-500"
                    : "text-gray-400 group-hover:text-green-500"
                }
              `}
            />
          </div>
        </nav>
      </div>
      
      <div className="flex flex-col items-center w-full gap-0 mb-1">
        {bottomIcons.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            onClick={() => setActive(key)}
            className={`
              flex items-center justify-center w-full h-9 cursor-pointer
              ${active === key ? "bg-gray-100" : ""}
              group
              transition
            `}
            style={{ borderRadius: active === key ? "9999px" : "0" }}
            aria-label={label}
          >
            <Icon
              className={`text-base transition-colors
                ${
                  active === key
                    ? "text-green-500"
                    : "text-gray-400 group-hover:text-green-500"
                }
              `}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
