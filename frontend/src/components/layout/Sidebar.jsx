import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Briefcase, Calendar, Settings, LogOut, Verified, BarChart, School, Home } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard/overview', icon: LayoutDashboard }, // Added as top link
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
  { name: 'Hostel', href: '/dashboard/hostel', icon: Home },
  { name: 'Library', href: '/dashboard/library', icon: BookOpen },
  { name: 'Events', href: '/dashboard/events', icon: Verified },
  { name: 'Placement', href: '/dashboard/placement', icon: Briefcase },
  { name: 'LMS Portal', href: '/dashboard/lms', icon: BookOpen },
  { name: 'Profile', href: '/dashboard/profile', icon: Users }, // Moved to bottom
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r-3 border-black text-slate-900">
      <div className="flex h-16 items-center px-6 border-b-3 border-black bg-accent-yellow">
        <School className="h-6 w-6 text-black mr-2" strokeWidth={2.5} />
        <span className="text-xl font-black uppercase tracking-tighter italic">
          CampusX
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-3 text-sm font-bold border-2 border-black rounded transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-neo-sm translate-x-[2px] translate-y-[2px]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-neo-sm hover:-translate-y-[2px] hover:-translate-x-[1px]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-900'}`} strokeWidth={2.5} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t-3 border-black p-4 bg-slate-50">
        <button className="group flex w-full items-center px-3 py-2 text-sm font-bold border-2 border-transparent hover:border-black hover:bg-white hover:shadow-neo-sm rounded transition-all">
          <Settings className="mr-3 h-5 w-5" strokeWidth={2.5} />
          Settings
        </button>
        <button className="group flex w-full items-center px-3 py-2 text-sm font-bold text-red-600 border-2 border-transparent hover:border-black hover:bg-red-50 hover:shadow-neo-sm rounded mt-1 transition-all">
          <LogOut className="mr-3 h-5 w-5" strokeWidth={2.5} />
          Logout
        </button>
      </div>
    </div>
  );
}
