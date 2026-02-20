import React from 'react';

export default function Dashboard() {
  return (
    <div 
      className="bg-[#f0f0f0] text-neo-black min-h-screen flex flex-col overflow-hidden selection:bg-neo-pink selection:text-black p-6 -m-6"
      style={{
        backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
        
        {/* Header (Simplified for internal view) */}
        <header className="flex items-center justify-between py-6 bg-neo-bg border-b-4 border-black mb-8">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-black uppercase tracking-tight" style={{ textShadow: "2px 2px 0px #ddd" }}>Dashboard Overview</h2>
                    <p className="text-sm font-bold text-gray-600 hidden sm:block bg-white px-2 border border-black -ml-1 mt-1 w-fit shadow-[2px_2px_0px_0px_#ccc]">Welcome back, Alex! You have 2 upcoming deadlines.</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative hidden sm:block group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black z-10">
                        <span className="material-symbols-outlined font-bold" style={{ fontSize: "24px" }}>search</span>
                    </div>
                    <input className="bg-white text-black text-sm font-bold pl-10 pr-4 py-3 w-72 placeholder-gray-500 border-3 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] focus:outline-none" placeholder="SEARCH COURSES..." type="text"/>
                </div>
                <button className="relative p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all active:bg-neo-yellow">
                    <span className="material-symbols-outlined font-bold" style={{ fontSize: "24px" }}>notifications</span>
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-neo-orange rounded-none border-2 border-black flex items-center justify-center text-[10px] font-black">3</span>
                </button>
            </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-neo-purple border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neo-yellow border-l-4 border-b-4 border-black opacity-100" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}></div>
            <div className="absolute bottom-0 right-20 w-32 h-32 bg-neo-cyan border-4 border-black rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-5">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-black border-2 border-white w-fit shadow-[4px_4px_0px_0px_#fff]">
                        <span className="material-symbols-outlined text-neo-yellow text-sm">auto_awesome</span>
                        <span className="text-xs font-black text-white tracking-widest uppercase">AI Campus Insights</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-black leading-none uppercase">
                        Top <span className="bg-neo-yellow px-2 border-2 border-black inline-block transform -rotate-2">5%</span> of your class
                    </h3>
                    <p className="text-black font-bold text-lg max-w-xl bg-white/50 p-2 border-2 border-black inline-block">
                        Based on your recent performance in "Data Structures", secure a Dean's List spot now.
                    </p>
                    <div className="pt-4">
                        <button className="border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase inline-flex items-center justify-center gap-2 bg-neo-orange hover:bg-white text-black px-6 py-3 text-sm transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000]">
                            <span>View Personalized Plan</span>
                            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                        </button>
                    </div>
                </div>
                <div className="hidden md:block w-48 h-48 relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-contain bg-center bg-no-repeat transform scale-125" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLVS_dO8xHQ2FPeAMhEVrKcszFprFde1n7Q2vH5vkfNshClr9Q1JrpQEYQrYyP1urrSX9KxIWmpKudb5Zy-piLZmJHeJ0h-kvbWUhuEWSpgh8ioMQ4o3myrOiyIrEIET81mqsv3E4PGqO-FIlL0BqRZyH691VlaRtmLrA9qqFLrxCKWQfdkAJfMz0e0S6XpogHIH0VGgYBkrm5kZ7YFVLFArTINVaSQXUYIjzolWxpQMTDXnccqspMnmFgng94lpaV9Nuq1aGETG64')", filter: "grayscale(100%) contrast(120%)" }}></div>
                    <div className="absolute inset-0 bg-neo-purple mix-blend-multiply opacity-40"></div>
                </div>
            </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neo-cyan p-6 flex flex-col justify-between relative h-48 border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000] transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1 z-10">
                        <p className="text-black text-sm font-black uppercase border-b-2 border-black w-fit mb-2">Attendance</p>
                        <h4 class="text-5xl font-black text-black">85%</h4>
                        <div className="flex items-center gap-1 mt-1 bg-white border-2 border-black px-2 py-1 w-fit shadow-[2px_2px_0px_0px_#000]">
                            <span className="material-symbols-outlined text-sm font-bold">arrow_upward</span>
                            <span className="text-xs font-bold">2.5%</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                        <span className="material-symbols-outlined text-black">calendar_month</span>
                    </div>
                </div>
                <p className="text-xs font-bold mt-auto pt-2 border-t-2 border-black/20">ABOVE CLASS AVERAGE</p>
            </div>
            <div className="bg-neo-pink p-6 flex flex-col justify-between relative h-48 border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000] transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1 z-10">
                        <p className="text-black text-sm font-black uppercase border-b-2 border-black w-fit mb-2">Current GPA</p>
                        <h4 className="text-5xl font-black text-black">3.8</h4>
                        <span className="text-sm font-bold text-black bg-white px-1 border-2 border-black -mt-2 w-fit transform rotate-2">OUT OF 4.0</span>
                    </div>
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                        <span className="material-symbols-outlined text-black">school</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                    <span className="px-2 py-1 bg-neo-yellow border-2 border-black text-black text-xs font-bold uppercase shadow-sm">Dean's List</span>
                </div>
            </div>
            <div className="bg-neo-yellow p-6 flex flex-col justify-between relative h-48 border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000] transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-black text-sm font-black uppercase border-b-2 border-black w-fit">Next Exam</p>
                    <span className="material-symbols-outlined text-black bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">warning</span>
                </div>
                <div className="my-auto">
                    <h4 className="text-xl font-black text-black bg-white border-2 border-black p-2 shadow-[3px_3px_0px_0px_#000] inline-block mb-2 transform -rotate-1">PHYSICS 101</h4>
                    <p className="text-sm font-bold text-black border-l-4 border-black pl-2">Tomorrow, 10:00 AM</p>
                </div>
                <div className="w-full bg-white border-2 border-black h-4 mt-auto relative">
                    <div className="bg-neo-orange h-full border-r-2 border-black" style={{ width: "80%" }}></div>
                    <div className="absolute top-0 right-0 h-full w-full flex items-center justify-center text-[10px] font-bold pointer-events-none">PREP 80%</div>
                </div>
            </div>
            <div className="bg-white p-6 flex flex-col justify-between relative h-48 border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000] transition-all">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-black text-sm font-black uppercase border-b-2 border-black w-fit">Library Dues</p>
                    <span className="material-symbols-outlined text-black">book</span>
                </div>
                <div className="space-y-3">
                    <h4 className="text-3xl font-black text-black">2 Books</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs bg-neo-bg border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">
                            <span className="font-bold truncate max-w-[80px]">Intro to AI</span>
                            <span className="font-black bg-neo-orange text-black px-1 border border-black">OVERDUE</span>
                        </div>
                        <div className="flex items-center justify-between text-xs bg-neo-bg border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">
                            <span className="font-bold truncate max-w-[80px]">Data Mining</span>
                            <span className="font-bold">Due in 2d</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Charts & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-2xl font-black text-black uppercase">Academic Trends</h3>
                        <p className="text-sm font-bold text-gray-600 bg-neo-yellow px-2 border border-black inline-block mt-1">GPA COMPARISON</p>
                    </div>
                    <select className="bg-white text-black font-bold text-xs border-2 border-black px-4 py-2 focus:ring-0 cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all outline-none">
                        <option>LAST 6 SEMESTERS</option>
                        <option>LAST YEAR</option>
                    </select>
                </div>
                <div className="relative h-64 w-full border-l-4 border-b-4 border-black bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlNWU1ZTUiLz48L3N2Zz4=')]">
                    {/* Placeholder for Chart - SVG replication in React */}
                    <svg className="w-full h-full overflow-visible p-4" preserveAspectRatio="none" viewBox="0 0 800 250">
                        <line stroke="#ddd" strokeWidth="2" x1="0" x2="800" y1="200" y2="200"></line>
                        <line stroke="#ddd" strokeWidth="2" x1="0" x2="800" y1="150" y2="150"></line>
                        <line stroke="#ddd" strokeWidth="2" x1="0" x2="800" y1="100" y2="100"></line>
                        <line stroke="#ddd" strokeWidth="2" x1="0" x2="800" y1="50" y2="50"></line>
                        <polyline fill="none" points="0,180 200,100 400,80 600,60 800,40" stroke="#000" strokeLinejoin="miter" strokeWidth="4"></polyline>
                        <polygon fill="rgba(116, 185, 255, 0.2)" points="0,250 0,180 200,100 400,80 600,60 800,40 800,250" stroke="none"></polygon>
                        <polyline fill="none" points="0,200 200,160 400,140 600,130 800,120" stroke="#ff7675" strokeDasharray="8 8" strokeWidth="3"></polyline>
                        <rect fill="#ffeb3b" height="12" stroke="#000" strokeWidth="2" width="12" x="194" y="94"></rect>
                        <rect fill="#ffeb3b" height="12" stroke="#000" strokeWidth="2" width="12" x="394" y="74"></rect>
                        <rect fill="#ffeb3b" height="12" stroke="#000" strokeWidth="2" width="12" x="594" y="54"></rect>
                        <rect fill="#ffeb3b" height="12" stroke="#000" strokeWidth="2" width="12" x="794" y="34"></rect>
                    </svg>
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs font-bold text-black px-4">
                        <span>SEM 1</span>
                        <span>SEM 2</span>
                        <span>SEM 3</span>
                        <span>SEM 4</span>
                        <span>SEM 5</span>
                    </div>
                </div>
            </div>
            
            <div className="lg:col-span-1 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-black uppercase">Attendance</h3>
                    <p className="text-sm font-bold text-black border-b-2 border-neo-green inline-block">ACTIVITY MAP</p>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50 border-2 border-black p-4 shadow-inner">
                    <div className="grid grid-cols-7 gap-2">
                        {/* Mocking the activity grid from HTML */}
                        {Array.from({ length: 28 }).map((_, i) => {
                            let bgClass = "bg-white";
                            let opacity = "";
                            if ([1, 2, 4, 7, 8, 9, 10, 11, 15, 17, 18, 22, 23, 24, 25, 26].includes(i)) bgClass = "bg-neo-green shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]";
                            else if ([3, 14].includes(i)) bgClass = "bg-neo-yellow";
                            else if ([16].includes(i)) bgClass = "bg-neo-orange";
                            else if ([5, 6, 12, 13, 19, 20, 27].includes(i)) { bgClass = "bg-gray-200"; opacity = "opacity-50"; }
                            
                            return (
                                <div key={i} className={`w-8 h-8 ${bgClass} ${opacity} border-2 border-black`}></div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6 text-xs font-bold uppercase">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-neo-orange border-2 border-black"></div>
                        <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-neo-yellow border-2 border-black"></div>
                        <span>Late</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-neo-green border-2 border-black"></div>
                        <span>Present</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-neo-blue border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-6 transform rotate-0 hover:rotate-1 transition-transform">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-black text-3xl font-bold">verified</span>
                </div>
                <div>
                    <h4 className="text-black font-black text-xl uppercase bg-white px-2 border-2 border-black inline-block mb-1">Status: Eligible</h4>
                    <p className="text-sm font-bold text-black">You have met the minimum criteria for the upcoming recruitment drive.</p>
                </div>
            </div>
            <button className="px-6 py-3 bg-black text-white text-sm font-black uppercase border-2 border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-white hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                View Companies
            </button>
        </div>
      </div>
    </div>
  );
}
