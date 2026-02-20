import React from 'react';

export default function Hostel() {
  return (
    <div className="bg-[#f0f0f0] text-black min-h-screen pb-10 p-6 -m-6 font-display" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
                {/* Header Card */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white border-4 border-black p-6 shadow-neo">
                    <div>
                        <h1 className="text-5xl font-black text-black mb-2 uppercase tracking-tighter">Hostel <span className="text-neo-accent-blue stroke-black" style={{ WebkitTextStroke: "2px black" }}>Dashboard</span></h1>
                        <p className="text-black font-bold text-lg border-l-4 border-neo-accent-pink pl-3">Manage your stay, payments, and requests.</p>
                    </div>
                    <div className="px-4 py-2 bg-neo-accent-green border-4 border-black font-bold text-black flex items-center gap-2 shadow-neo-sm">
                        <span className="w-3 h-3 bg-black rounded-full animate-pulse"></span>
                        CHECKED IN
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Hostel Info */}
                    <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all p-0 relative overflow-hidden group bg-neo-accent-yellow">
                        <div className="border-b-4 border-black bg-white p-4 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold">info</span>
                                Hostel Info
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-white border-4 border-black p-4 shadow-neo-sm transform -rotate-1">
                                <span className="text-xs font-black uppercase tracking-wider block mb-1">Allocated Room</span>
                                <span className="font-mono text-3xl font-black text-black">B-304</span>
                            </div>
                            <div className="bg-white border-4 border-black p-4 shadow-neo-sm transform rotate-1">
                                <span className="text-xs font-black uppercase tracking-wider block mb-1">Hostel Block</span>
                                <span className="font-black text-xl text-black">Cauvery (Boys)</span>
                            </div>
                            <div className="pt-2 border-t-4 border-black border-dashed">
                                <p className="text-xs font-black uppercase bg-black text-white inline-block px-2 py-1 mb-3">Warden Contact</p>
                                <div className="flex items-center gap-4 bg-white border-2 border-black p-2">
                                    <div className="h-10 w-10 bg-neo-accent-pink border-2 border-black flex items-center justify-center">
                                        <span className="material-symbols-outlined text-black font-bold">person</span>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-black">Dr. S. K. Gupta</p>
                                        <p className="text-sm font-bold text-gray-600">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fee Details */}
                    <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all p-0 relative bg-white">
                        <div className="border-b-4 border-black bg-white p-4 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold">payments</span>
                                Fee Details
                            </h2>
                            <span className="px-2 py-1 bg-neo-accent-orange border-2 border-black text-white text-xs font-black flex items-center gap-1 shadow-neo-sm animate-bounce">
                                <span className="material-symbols-outlined text-[14px] font-bold">warning</span>
                                OVERDUE
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col gap-2 mb-6 bg-gray-100 border-4 border-black p-4">
                                <span className="text-xs font-black uppercase">Outstanding Balance</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-black">₹ 24,500</span>
                                    <span className="text-sm font-bold text-gray-600">/ Sem</span>
                                </div>
                                <span className="text-xs font-bold text-white bg-neo-accent-orange px-2 py-1 inline-block w-fit border-2 border-black">Due: 15 Oct 2023</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button className="w-full bg-neo-accent-blue border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-blue-400 font-extrabold uppercase py-4 px-4 text-lg flex justify-center items-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all">
                                    Pay Now
                                    <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                </button>
                                <button className="w-full py-2 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-extrabold uppercase active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all">
                                    <span className="material-symbols-outlined text-lg">receipt_long</span>
                                    View History
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all p-0 flex flex-col bg-neo-accent-pink">
                        <div className="border-b-4 border-black bg-white p-4">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold">bolt</span>
                                Quick Actions
                            </h2>
                        </div>
                        <div className="p-6 h-full flex items-center">
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button className="aspect-square bg-white hover:bg-neo-accent-green border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group">
                                    <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">wifi_password</span>
                                    <span className="text-sm font-black text-black uppercase">Wifi Access</span>
                                </button>
                                <button className="aspect-square bg-white hover:bg-neo-accent-yellow border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group">
                                    <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">laundry</span>
                                    <span className="text-sm font-black text-black uppercase">Laundry</span>
                                </button>
                                <button className="aspect-square bg-white hover:bg-neo-accent-orange border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group">
                                    <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">local_shipping</span>
                                    <span className="text-sm font-black text-black uppercase">Out Pass</span>
                                </button>
                                <button className="aspect-square bg-white hover:bg-neo-accent-blue border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group">
                                    <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">calendar_month</span>
                                    <span className="text-sm font-black text-black uppercase">Events</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mess Menu */}
                <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all p-0 bg-white">
                    <div className="border-b-4 border-black bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                            <span className="material-symbols-outlined font-bold text-3xl">restaurant_menu</span>
                            Mess Menu <span className="bg-black text-white px-2 text-lg italic">Weekly</span>
                        </h2>
                        <div className="flex gap-2 items-center bg-neo-accent-yellow border-2 border-black p-2 shadow-neo-sm">
                            <span className="text-xs font-black uppercase mr-2">Rate today's food:</span>
                            <div className="flex gap-1">
                                <button className="text-black hover:scale-125 transition-transform"><span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></button>
                                <button className="text-black hover:scale-125 transition-transform"><span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></button>
                                <button className="text-black hover:scale-125 transition-transform"><span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></button>
                                <button className="text-black hover:scale-125 transition-transform"><span className="material-symbols-outlined font-bold">star</span></button>
                                <button className="text-black/30 hover:text-black hover:scale-125 transition-transform"><span className="material-symbols-outlined font-bold">star</span></button>
                            </div>
                        </div>
                    </div>
                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                         <div className="p-6 bg-white hover:bg-neo-accent-green/20 transition-colors">
                            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                <h3 className="font-black text-lg uppercase bg-neo-accent-green inline-block px-1 border-2 border-black shadow-neo-sm">Breakfast</h3>
                                <span className="text-xs font-bold bg-black text-white px-1">07:30 - 09:30</span>
                            </div>
                            <ul className="text-sm space-y-3 font-bold">
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Masala Dosa</li>
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Sambar & Chutney</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-white hover:bg-neo-accent-yellow/20 transition-colors">
                            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                <h3 className="font-black text-lg uppercase bg-neo-accent-yellow inline-block px-1 border-2 border-black shadow-neo-sm">Lunch</h3>
                                <span className="text-xs font-bold bg-black text-white px-1">12:30 - 14:30</span>
                            </div>
                            <ul className="text-sm space-y-3 font-bold">
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Veg Pulao</li>
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Dal Fry</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-white hover:bg-neo-accent-orange/20 transition-colors">
                             <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                <h3 className="font-black text-lg uppercase bg-neo-accent-orange inline-block px-1 border-2 border-black shadow-neo-sm">Snacks</h3>
                                <span className="text-xs font-bold bg-black text-white px-1">17:00 - 18:00</span>
                            </div>
                            <ul className="text-sm space-y-3 font-bold">
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Samosa</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-neo-accent-blue/10 relative overflow-hidden">
                            <div className="absolute inset-0 border-l-4 border-black pointer-events-none md:block hidden"></div>
                            <div className="absolute -right-8 -top-8 bg-neo-accent-blue w-24 h-24 rotate-45 border-4 border-black z-0"></div>
                            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2 relative z-10">
                                <h3 className="font-black text-lg uppercase bg-neo-accent-blue inline-block px-1 border-2 border-black shadow-neo-sm text-white">Dinner</h3>
                                <span className="text-xs font-black bg-black text-white px-2 py-1 animate-pulse">UPCOMING</span>
                            </div>
                           <ul className="text-sm space-y-3 font-bold relative z-10">
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Chapati</li>
                                <li className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> Paneer Butter Masala</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Request Form */}
                    <div className="lg:col-span-1 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all p-0 bg-neo-accent-orange">
                        <div className="border-b-4 border-black bg-white p-4">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold">build</span>
                                New Complaint
                            </h2>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase mb-1">Issue Category</label>
                                    <select className="w-full bg-white border-3 border-black p-3 text-sm focus:outline-none focus:shadow-[5px_5px_0px_0px_#000] font-bold">
                                        <option>Electrical</option>
                                        <option>Plumbing</option>
                                    </select>
                                </div>
                                <button className="w-full bg-black text-white border-3 border-black shadow-[4px_4px_0px_0px_#000] font-extrabold uppercase py-3 text-sm hover:bg-gray-800 hover:text-white active:translate-x-[2px] active:translate-y-[2px] transition-all">
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    {/* History Table */}
                    <div className="lg:col-span-2 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all p-0">
                        <div className="border-b-4 border-black bg-white p-4 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold">history</span>
                                Request History
                            </h2>
                            <button className="text-xs font-black underline hover:text-neo-accent-blue uppercase">View All</button>
                        </div>
                        <div className="overflow-x-auto p-0">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-xs font-black uppercase bg-gray-100 border-b-4 border-black">
                                    <tr>
                                        <th className="px-4 py-4 border-r-2 border-black">Ticket ID</th>
                                        <th className="px-4 py-4 border-r-2 border-black">Category</th>
                                        <th className="px-4 py-4 border-r-2 border-black">Date</th>
                                        <th className="px-4 py-4 border-r-2 border-black">Status</th>
                                        <th className="px-4 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black font-bold">
                                    <tr className="hover:bg-neo-accent-yellow/20 transition-colors">
                                        <td className="px-4 py-4 font-mono border-r-2 border-black">#REQ-2024</td>
                                        <td className="px-4 py-4 border-r-2 border-black">Plumbing</td>
                                        <td className="px-4 py-4 border-r-2 border-black">Oct 28, 2023</td>
                                        <td className="px-4 py-4 border-r-2 border-black">
                                            <span className="px-2 py-1 text-xs font-black bg-neo-accent-yellow border-2 border-black shadow-neo-sm">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button className="hover:text-neo-accent-blue border-2 border-transparent hover:border-black hover:bg-white p-1 rounded-none transition-all"><span className="material-symbols-outlined font-bold text-xl">visibility</span></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
