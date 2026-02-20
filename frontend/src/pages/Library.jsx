import React from 'react';

export default function Library() {
  return (
    <div className="font-display bg-neo-bg text-neo-black min-h-screen overflow-x-hidden p-6 -m-6">
      <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
        
        {/* Header Section (Replicated from HTML) */}
        <header className="flex h-20 items-center justify-between border-b-3 border-black bg-white px-6 sticky top-0 z-30 shadow-sm hidden">
             {/* This header is usually handled by the main layout, but for exact replication internally: */}
             {/* We will implement the content within the main page area as requested */}
        </header>
        
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter" style={{ textShadow: "2px 2px 0px #A259FF" }}>
                Library Resource Manager
            </h1>
        </div>

        {/* Action Required Section */}
        <div className="grid gap-6 md:grid-cols-12">
            <div className="col-span-12 bg-neo-red border-3 border-black p-0 flex flex-col sm:flex-row shadow-neo">
                <div className="flex-1 p-5 flex gap-4 items-center">
                    <div className="flex size-14 shrink-0 items-center justify-center bg-black text-white border-2 border-white">
                        <span className="material-symbols-outlined text-3xl font-bold">warning</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase mb-1" style={{ textShadow: "2px 2px 0px #000" }}>Action Required</h3>
                        <p className="text-sm font-bold text-black bg-white inline-block px-2 py-1 border-2 border-black">'Introduction to Algorithms' is 3 days overdue. Fine: $1.50.</p>
                    </div>
                </div>
                <button className="sm:border-l-3 border-t-3 sm:border-t-0 border-black bg-white hover:bg-gray-100 px-8 py-4 font-black text-lg uppercase transition-colors flex items-center justify-center gap-2 group">
                    Pay Now
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Catalog Search */}
                <div className="bg-white p-6 border-3 border-black shadow-neo">
                    <h3 className="font-black text-xl mb-4 uppercase">Catalog Search</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                                <span className="material-symbols-outlined">manage_search</span>
                            </div>
                            <input className="w-full h-14 border-2 border-black pl-12 pr-4 text-black font-bold placeholder-gray-500 focus:bg-neo-yellow focus:ring-0 transition-colors shadow-sm outline-none" placeholder="Search by title, author, or ISBN..." type="text"/>
                        </div>
                        <div className="flex gap-4">
                            <select className="h-14 border-2 border-black bg-white px-4 font-bold focus:ring-0 focus:bg-neo-blue transition-colors shadow-neo-sm">
                                <option>All Categories</option>
                                <option>Computer Science</option>
                                <option>Literature</option>
                                <option>History</option>
                            </select>
                            <button className="h-14 px-8 border-2 border-black bg-neo-purple text-white font-black hover:bg-purple-600 transition-colors shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2">
                                <span>SEARCH</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Issued Books Table */}
                <div className="flex flex-col bg-white border-3 border-black shadow-neo">
                    <div className="flex items-center justify-between px-6 py-5 border-b-3 border-black bg-neo-blue">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-1 border-2 border-white shadow-sm">
                                <span className="material-symbols-outlined block">library_books</span>
                            </div>
                            <h3 className="text-2xl font-black text-black uppercase italic">Issued Books</h3>
                        </div>
                        <button className="text-sm font-bold text-black border-2 border-black bg-white px-3 py-1 hover:bg-black hover:text-white transition-colors shadow-neo-sm">View History</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white text-sm uppercase font-bold border-b-3 border-black">
                                <tr>
                                    <th className="px-6 py-4">Book Details</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Issued On</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Due Date</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20 text-center">Status</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black text-black">
                                <tr className="group bg-neo-red/10 hover:bg-neo-red/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-14 shrink-0 overflow-hidden border-2 border-black bg-gray-200 shadow-neo-sm group-hover:scale-110 transition-transform">
                                                <img alt="Book cover" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuSYOxXpnacqkStBUARHAIZSUicSOTJBI6CdNQG-eMpAYB7HxHxUY_stp1dPzuZ7y_EtbuFvx3D6SND_UgpbAQ3nPCuBT76vYCkRXPgjSZjTG7GkVlYEiloJv8RqTqp61nw__mmsUTyN01jZQjlyaqGDHJBVYwueWR-CaVXWb3mQTdHNDLwGSE2sioqAMZO6odwtZBthBnOdLo6sVt_0iX1OOEjFR6otgRL2XAlEtCm7jP0sp0MD8bw_Z-ZWQIXKjW0nA8m3kHm7w_"/>
                                            </div>
                                            <div>
                                                <p className="font-black text-lg">Intro to Algorithms</p>
                                                <p className="text-sm font-bold">Cormen, Leiserson</p>
                                                <p className="text-xs mt-1 font-mono bg-white inline-block border border-black px-1">ISBN: 978-0262033848</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">Oct 10, 2023</td>
                                    <td className="px-6 py-4 font-black text-neo-red">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center bg-neo-red border-2 border-black px-3 py-1 text-xs font-black text-white uppercase shadow-neo-sm transform -rotate-2">
                                            Overdue
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="border-2 border-black bg-neo-black text-white px-4 py-2 text-sm font-bold hover:bg-neo-red transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">Pay Fine</button>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-neo-bg transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-14 shrink-0 overflow-hidden border-2 border-black bg-gray-200 shadow-neo-sm group-hover:scale-110 transition-transform">
                                                <img alt="Book cover" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw-5t6J7eBDZch0oQ5dyBGvQtsLEzrno4RSCjiQnSdyUqK9jbEVrLOzHIQZzRLbOEHyL075hzhRyXA2aOnmoM2UES0FiocRN_qgSMOQkiXkGxMnf-r_X_J36GtJGXkXAVB6ci4An3uh-jy1AW0jqWAGDw87xLYNjsme8DrgdJZn5w8k9m_fiB3GYimNTJ14IJsknkopMIf_hxrAMkMhPwVy_selqlNFR7uY7VE0dY3JhrM-NTP2hJI-kDZ2zCRrjr8HZwfh30cf0yp"/>
                                            </div>
                                            <div>
                                                <p className="font-black text-lg">Design Patterns</p>
                                                <p className="text-sm font-bold">Erich Gamma et al.</p>
                                                <p className="text-xs mt-1 font-mono bg-white inline-block border border-black px-1">ISBN: 978-0201633610</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">Oct 15, 2023</td>
                                    <td className="px-6 py-4 font-bold">Oct 29, 2023</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center bg-neo-green border-2 border-black px-3 py-1 text-xs font-black text-black uppercase shadow-neo-sm">
                                            On Time
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-green hover:text-black transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">Renew</button>
                                    </td>
                                </tr>
                                <tr className="group bg-neo-yellow/10 hover:bg-neo-yellow/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-14 shrink-0 overflow-hidden border-2 border-black bg-gray-200 shadow-neo-sm group-hover:scale-110 transition-transform">
                                                <img alt="Book cover" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS4d5vFNgHCC3Vc5eQoxNrdEVbigAOwN_XQYq2T0m4ntP5omhJqVCSnXy5bpXPfwzxgAFLUXTVVWDZWaA6yAd7oeabA5DuUhpCOugF4R3TRdY_So_3jtbfVR4oYqx9ZenIfmrHJps-NbxwrJay0PMvGC68cv132-vyE1rDe6HXyX_q9BN8Brbdl5mJDyDv9lwAarsfXC_QCqln6aEC-X1OqXIVNZyeupWZHWROXvRcWVN95HxouvZefC-w0oDotJUT3F2wdL5bt-GG"/>
                                            </div>
                                            <div>
                                                <p className="font-black text-lg">Clean Code</p>
                                                <p className="text-sm font-bold">Robert C. Martin</p>
                                                <p className="text-xs mt-1 font-mono bg-white inline-block border border-black px-1">ISBN: 978-0132350884</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">Oct 12, 2023</td>
                                    <td className="px-6 py-4 font-black text-neo-black underline decoration-wavy decoration-neo-red">Tomorrow</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center bg-neo-yellow border-2 border-black px-3 py-1 text-xs font-black text-black uppercase shadow-neo-sm transform rotate-2">
                                            Due Soon
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-yellow transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">Renew</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 bg-neo-purple border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <span className="material-symbols-outlined text-2xl text-white">book</span>
                        </div>
                        <p className="text-xs font-bold text-white/90 uppercase mb-1">Total Issued</p>
                        <p className="text-4xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>3</p>
                    </div>
                    <div className="col-span-1 bg-neo-green border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-2">
                            <span className="material-symbols-outlined text-2xl text-black">bookmark_add</span>
                        </div>
                        <p className="text-xs font-bold text-black/80 uppercase mb-1">Requested</p>
                        <p className="text-4xl font-black text-black">1</p>
                    </div>
                    <div className="col-span-2 bg-neo-red border-3 border-black p-4 shadow-neo flex items-center justify-between hover:-translate-y-1 transition-transform">
                        <div>
                            <p className="text-xs font-bold text-white uppercase mb-1">Total Fines Due</p>
                            <p className="text-4xl font-black text-white" style={{ textShadow: "3px 3px 0px #000" }}>$1.50</p>
                        </div>
                        <div className="flex size-14 items-center justify-center bg-white border-3 border-black shadow-neo-sm transform rotate-6">
                            <span className="material-symbols-outlined text-3xl text-black">attach_money</span>
                        </div>
                    </div>
                </div>

                {/* Fine Calculator */}
                <div className="bg-white border-3 border-black p-0 shadow-neo">
                    <div className="bg-neo-yellow border-b-3 border-black p-4 flex items-center gap-2">
                        <span className="material-symbols-outlined font-bold">calculate</span>
                        <h3 className="font-black text-lg uppercase">Fine Calculator</h3>
                    </div>
                    <div className="p-5 space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Select Book</label>
                            <select className="w-full border-2 border-black bg-neo-bg py-3 px-4 text-sm font-bold focus:ring-0 focus:border-neo-purple shadow-neo-sm outline-none">
                                <option>Clean Code (Due Tomorrow)</option>
                                <option>Design Patterns</option>
                                <option>Intro to Algorithms</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Days Overdue</label>
                            <div className="flex items-center gap-4 bg-neo-bg border-2 border-black p-2 shadow-neo-sm">
                                <input className="w-full h-3 bg-white rounded-none appearance-none cursor-pointer border-2 border-black accent-neo-purple" max="30" min="0" type="range" defaultValue="3"/>
                                <div className="bg-neo-purple text-white font-black border-2 border-black w-10 h-8 flex items-center justify-center">3</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t-2 border-dashed border-black flex items-center justify-between">
                            <span className="text-sm font-bold">Estimated Fine:</span>
                            <span className="text-3xl font-black bg-neo-red text-white px-2 border-2 border-black transform -rotate-2">$1.50</span>
                        </div>
                        <button className="w-full border-2 border-black bg-black text-white py-3 text-sm font-black uppercase hover:bg-neo-purple hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-1">
                            Check Policy
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border-3 border-black p-5 shadow-neo relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-neo-blue rounded-full border-2 border-black"></div>
                    <h3 className="font-black text-lg uppercase mb-4 relative z-10">Quick Actions</h3>
                    <div className="space-y-3 relative z-10">
                        <button className="w-full flex items-center justify-between border-2 border-black bg-white p-3 hover:bg-neo-yellow hover:-translate-y-1 hover:shadow-neo-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-neo-purple flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                                </div>
                                <span className="text-sm font-bold">Book a Room</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button className="w-full flex items-center justify-between border-2 border-black bg-white p-3 hover:bg-neo-blue hover:-translate-y-1 hover:shadow-neo-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-neo-blue flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm">recommend</span>
                                </div>
                                <span className="text-sm font-bold">Suggest Purchase</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button className="w-full flex items-center justify-between border-2 border-black bg-white p-3 hover:bg-neo-green hover:-translate-y-1 hover:shadow-neo-sm transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 border-2 border-black bg-neo-green flex items-center justify-center text-black">
                                    <span className="material-symbols-outlined text-sm">help</span>
                                </div>
                                <span className="text-sm font-bold">Librarian Chat</span>
                            </div>
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
