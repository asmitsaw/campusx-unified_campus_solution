import React from "react";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NotificationBell } from "./NotificationBell";

const ROLE_LABELS = {
  student: "Student",
  faculty: "Faculty",
  event_manager: "Event Manager",
  librarian: "Librarian",
  hostel_warden: "Hostel Warden",
  tpo: "T&P Officer",
  admin: "Administrator",
};

export function Header() {
  const { user } = useAuth();

  const displayName = user?.name || "User";
  const displayRole = ROLE_LABELS[user?.role] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-white border-b-3 border-black h-16 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-2 border-black rounded-sm leading-5 bg-background-light placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-black focus:shadow-neo-sm transition-all font-medium"
            placeholder="Search for courses, students, or resources..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationBell />

        <div className="flex items-center space-x-3 pl-4 border-l-3 border-black">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-black leading-tight">
              {displayName}
            </p>
            <p className="text-xs font-bold text-slate-500 uppercase">
              {displayRole}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary border-2 border-black flex items-center justify-center text-white font-black shadow-sm cursor-pointer hover:shadow-neo-sm transition-all">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
