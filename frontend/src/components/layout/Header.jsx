import React from 'react';
import { Bell, Search } from 'lucide-react';

export function Header() {
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
        <button className="relative p-2 text-black hover:bg-background-light border-2 border-transparent hover:border-black hover:shadow-neo-sm rounded-full transition-all">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" strokeWidth={2.5} />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-accent-yellow border-2 border-black" />
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l-3 border-black">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-black leading-tight">Alex Johnson</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Year 3</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary border-2 border-black flex items-center justify-center text-white font-black shadow-sm cursor-pointer hover:shadow-neo-sm transition-all">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
}
