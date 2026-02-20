import React from 'react';

export default function Profile() {
  return (
    <div className="bg-[#E0E7FF] font-display text-black min-h-screen flex flex-col overflow-hidden selection:bg-neo-accent selection:text-black p-6 -m-6">
      <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row h-full z-10 gap-6">
        
        {/* Alerts Section */}
        <section className="flex flex-col w-full lg:w-[450px] bg-white border-3 border-black shadow-neo shrink-0 h-full relative">
            <div className="absolute top-0 right-0 w-full h-2 bg-pattern-stripes opacity-10"></div>
            <div className="p-5 border-b-3 border-black bg-white flex justify-between items-end sticky top-0 z-10">
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Alerts</h2>
                    <p className="font-bold text-sm mt-1 bg-black text-white inline-block px-2 py-0.5">3 NEW MESSAGES</p>
                </div>
                <button className="text-black text-xs font-bold border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                    MARK ALL READ
                </button>
            </div>
            <div className="px-5 py-4 border-b-3 border-black flex gap-3 overflow-x-auto no-scrollbar bg-neo-bg">
                <button className="px-4 py-1.5 border-2 border-black bg-black text-white text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5 transition-transform">All</button>
                <button className="px-4 py-1.5 border-2 border-black bg-white hover:bg-neo-blue hover:text-white transition-colors text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5 transition-transform">Academic</button>
                <button className="px-4 py-1.5 border-2 border-black bg-white hover:bg-neo-purple hover:text-white transition-colors text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5 transition-transform">Placement</button>
                <button className="px-4 py-1.5 border-2 border-black bg-white hover:bg-gray-200 transition-colors text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5 transition-transform">System</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f8f8]">
                <div className="group relative bg-white border-3 border-black p-0 shadow-neo hover:shadow-neo-hover transition-all cursor-pointer">
                    <div className="h-full w-3 absolute left-0 top-0 bottom-0 bg-neo-blue border-r-3 border-black"></div>
                    <div className="pl-6 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-neo-blue text-white uppercase border border-black">Academic</span>
                            <span className="text-xs font-bold">2 HRS AGO</span>
                        </div>
                        <h3 className="text-black font-black text-lg mb-1 leading-tight group-hover:underline decoration-4 decoration-neo-blue">Mid-term Schedule Released</h3>
                        <p className="text-gray-800 font-medium text-sm leading-snug line-clamp-2">The schedule for the upcoming mid-term examinations for Computer Science Dept has been published.</p>
                        <div className="mt-3 flex items-center justify-end">
                            <span className="w-3 h-3 bg-neo-blue border-2 border-black"></span>
                        </div>
                    </div>
                </div>
                <div className="group relative bg-white border-3 border-black p-0 shadow-neo hover:shadow-neo-hover transition-all cursor-pointer">
                    <div className="h-full w-3 absolute left-0 top-0 bottom-0 bg-neo-purple border-r-3 border-black"></div>
                    <div className="pl-6 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-neo-purple text-white uppercase border border-black">Placement</span>
                            <span className="text-xs font-bold">5 HRS AGO</span>
                        </div>
                        <h3 className="text-black font-black text-lg mb-1 leading-tight group-hover:underline decoration-4 decoration-neo-purple">Google Campus Drive</h3>
                        <p className="text-gray-800 font-medium text-sm leading-snug line-clamp-2">Registration for Google's campus recruitment drive 2024 is now open for final year students.</p>
                        <div className="mt-4 flex items-center gap-2">
                            <button className="text-xs bg-neo-purple text-white font-bold border-2 border-black px-4 py-1 hover:bg-purple-700 transition-colors shadow-neo-sm active:translate-y-[2px] active:shadow-none">REGISTER NOW</button>
                        </div>
                    </div>
                </div>
                <div className="group relative bg-gray-100 border-3 border-black p-4 shadow-sm hover:shadow-neo transition-all cursor-pointer opacity-90 hover:opacity-100">
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-gray-800 text-white uppercase border border-black">System</span>
                        <span className="text-xs font-bold text-gray-500">YESTERDAY</span>
                    </div>
                    <h3 className="text-gray-700 font-black text-lg mb-1">Scheduled Maintenance</h3>
                    <p className="text-gray-600 font-medium text-sm leading-snug line-clamp-2">The ERP portal will be undergoing maintenance on Saturday from 2:00 AM to 4:00 AM.</p>
                </div>
                <div className="group relative bg-gray-100 border-3 border-black p-4 shadow-sm hover:shadow-neo transition-all cursor-pointer opacity-90 hover:opacity-100">
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-neo-accent text-black uppercase border border-black">Library</span>
                        <span className="text-xs font-bold text-gray-500">2 DAYS AGO</span>
                    </div>
                    <h3 className="text-gray-700 font-black text-lg mb-1">Book Due Reminder</h3>
                    <p className="text-gray-600 font-medium text-sm leading-snug line-clamp-2">"Introduction to Algorithms" is due tomorrow. Please renew or return to avoid fines.</p>
                </div>
            </div>
        </section>

        {/* Account Settings Section */}
        <section className="flex flex-col flex-1 bg-white border-3 border-black shadow-neo-lg h-full overflow-hidden">
            <div className="p-6 md:p-8 pb-0 bg-neo-accent border-b-3 border-black">
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-xs uppercase bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">Dashboard</span>
                    <span className="font-black">/</span>
                    <span className="font-bold text-xs uppercase bg-black text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#fff]">Settings</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase italic">Account Settings</h1>
                <p className="font-medium text-black max-w-2xl border-l-4 border-black pl-4 mb-6">Manage your personal details, security preferences, and how you receive updates from the university.</p>
                <div className="flex items-end gap-1 mt-6 overflow-x-auto">
                    <button className="px-6 py-3 bg-white border-t-3 border-x-3 border-black font-black text-sm uppercase translate-y-[3px] z-10">Profile</button>
                    <button className="px-6 py-3 bg-black text-white border-t-3 border-x-3 border-black font-bold text-sm uppercase hover:bg-gray-800 transition-colors">Security</button>
                    <button className="px-6 py-3 bg-black text-white border-t-3 border-x-3 border-black font-bold text-sm uppercase hover:bg-gray-800 transition-colors">Preferences</button>
                    <button className="px-6 py-3 bg-black text-white border-t-3 border-x-3 border-black font-bold text-sm uppercase hover:bg-gray-800 transition-colors">Billing</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
                <form className="max-w-5xl space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                        <div className="md:col-span-4 bg-neo-bg p-4 border-3 border-black shadow-neo h-fit">
                            <h3 className="text-black text-xl font-black uppercase mb-2">Personal Info</h3>
                            <p className="text-black font-medium text-sm">Update your photo and personal details here.</p>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <div className="flex items-center gap-6 p-4 border-3 border-dashed border-gray-300">
                                <img alt="Profile avatar preview" className="w-24 h-24 object-cover border-3 border-black shadow-neo-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ6mC6ITqI-CM1_LQUI6jiKf8NFiZvPguzNBxLWHj8rtJCcjFC5o-hx1g1PKcezH7b1PP5_1UuUto-s5EwoHRP2hLPLf2hk3qoc4yleBlSeZ-LUnv-Rhmft8lVhlX3lUwXekVckLb8TMP3QEmFWKJuoSMZU6Kx49JK3E3YNcwN3n1OcOpK7rXr8R-mAKVIiTWcGLvJ0_EzUsYnmOL-e_RB0UO1-BgRSNimMrrT1wCZanIG7gNsjv3NKzYcktMTQCT_rO90vhUu7UBr"/>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-neo-secondary text-black font-bold border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all uppercase text-xs" type="button">Change Photo</button>
                                        <button className="px-4 py-2 bg-white text-black font-bold border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all uppercase text-xs hover:bg-red-100" type="button">Remove</button>
                                    </div>
                                    <p className="text-gray-500 text-xs font-bold uppercase">JPG, GIF or PNG. Max 800K</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-black uppercase tracking-wide">First Name</label>
                                    <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-bg outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="text" defaultValue="Alex"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-black uppercase tracking-wide">Last Name</label>
                                    <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-bg outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="text" defaultValue="Chen"/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-black uppercase tracking-wide">Email Address</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-black font-bold">mail</span>
                                    <input className="w-full bg-white border-3 border-black pl-12 pr-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-bg outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover group-hover:shadow-neo-hover" type="email" defaultValue="alex.chen@university.edu"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-black uppercase tracking-wide">Student ID</label>
                                    <input className="w-full bg-gray-100 border-3 border-black px-4 py-3 text-gray-500 font-bold cursor-not-allowed border-dashed" disabled type="text" defaultValue="CS-2024-8821"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-black uppercase tracking-wide">Department</label>
                                    <div className="relative">
                                        <select className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-bg outline-none transition-all shadow-neo-sm focus:shadow-neo-hover appearance-none">
                                            <option>Computer Science</option>
                                            <option>Mechanical Engineering</option>
                                            <option>Business Administration</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-3.5 pointer-events-none font-bold">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
      </div>
    </div>
  );
}
