import React from 'react';

export default function Attendance() {
  return (
    <div className="bg-[#F0F0F0] text-black font-display antialiased overflow-x-hidden selection:bg-neo-accent selection:text-black p-6 -m-6 min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
                <div className="flex items-center gap-2 text-sm font-black text-black mb-2 uppercase tracking-wide">
                    <a className="hover:text-neo-primary underline decoration-3 underline-offset-2" href="#">Academics</a>
                    <span className="material-symbols-outlined text-[16px] font-black">chevron_right</span>
                    <span className="bg-neo-accent px-2 py-0.5 border-2 border-black">ATTENDANCE</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]">Attendance Analytics</h1>
                <p className="text-black mt-2 font-black text-xl border-l-8 border-neo-primary pl-4 uppercase">Fall Semester 2023 • CS Dept</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none items-center justify-center gap-2 px-8 py-4 bg-white border-3 border-black text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-neo font-black transition-all text-sm uppercase">
                    <span className="material-symbols-outlined font-black">calendar_month</span> Timetable
                </button>
                <button className="flex-1 md:flex-none items-center justify-center gap-2 px-8 py-4 bg-neo-primary border-3 border-black text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-neo font-black transition-all text-sm uppercase">
                    <span className="material-symbols-outlined font-black">download</span> Report
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Overall Status Card */}
            <div className="lg:col-span-1 bg-white border-3 border-black shadow-neo-lg p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 border-3 border-black bg-neo-accent px-3 py-1 font-black text-sm uppercase shadow-neo-sm">Overall</div>
                <h3 className="text-2xl font-black text-black mb-10 uppercase border-b-4 border-black inline-block self-start pb-1">Attendance Status</h3>
                <div className="flex flex-col items-center gap-8 py-4">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-7xl font-black text-black leading-none">82%</span>
                            <span className="text-sm font-black text-black bg-neo-success px-3 py-1 border-3 border-black shadow-neo-sm uppercase mb-1">Good Standing</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1 w-full">
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-neo-primary"></div>
                            <div className="h-10 border-2 border-black bg-white" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 20px)" }}></div>
                            <div className="h-10 border-2 border-black bg-white"></div>
                        </div>
                        <div className="flex justify-between text-xs font-black uppercase text-black pt-2 border-t-2 border-black border-dashed">
                            <span>0%</span>
                            <span className="text-neo-primary">Threshold: 75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
                <p className="text-sm font-black text-black mt-6 p-4 bg-[#F0F0F0] border-3 border-black">
                    YOU ARE MAINTAINING AN AVERAGE ABOVE THE <span className="bg-neo-success px-1 border-2 border-black">75% THRESHOLD</span>. KEEP GOING!
                </p>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Warning Card */}
                <div className="bg-[#F0F0F0] border-3 border-black p-6 flex flex-col sm:flex-row items-center gap-6 shadow-neo-lg relative" style={{ backgroundImage: "repeating-linear-gradient(45deg, #FF4D4D, #FF4D4D 10px, #e02e2e 10px, #e02e2e 20px)" }}>
                    <div className="size-20 bg-white border-3 border-black flex items-center justify-center shrink-0 z-10 shadow-neo-sm">
                        <span className="material-symbols-outlined text-5xl text-black font-black">priority_high</span>
                    </div>
                    <div className="flex-1 z-10 bg-white p-5 border-3 border-black shadow-neo-sm">
                        <h3 className="text-2xl font-black text-black uppercase mb-1 flex items-center gap-2">
                            <span className="bg-black text-white px-3 py-0.5 text-sm">WARNING</span>
                            Linear Algebra Alert
                        </h3>
                        <p className="text-black font-bold text-base">
                            YOUR ATTENDANCE HAS DROPPED TO <span className="font-black bg-neo-danger px-2 border-2 border-black">68%</span>. YOU ARE AT RISK OF DEBARMENT.
                        </p>
                    </div>
                    <button className="z-10 whitespace-nowrap px-8 py-4 bg-black text-white text-sm font-black uppercase border-3 border-white hover:bg-gray-800 hover:scale-105 transition-transform shadow-neo-sm">
                        Contact Faculty
                    </button>
                </div>

                {/* Calculator */}
                <div className="flex-1 bg-white border-3 border-black shadow-neo-lg p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-neo-accent border-3 border-black p-3 text-black shadow-neo-sm">
                                <span className="material-symbols-outlined font-black">calculate</span>
                            </div>
                            <h3 className="text-2xl font-black text-black uppercase">Classes Calculator</h3>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-stretch h-full">
                        <div className="flex-1 w-full space-y-8">
                            <div>
                                <label className="block text-sm font-black uppercase text-black mb-3 bg-[#F0F0F0] inline-block px-3 py-1 border-3 border-black">Select Subject</label>
                                <div className="relative">
                                    <select className="w-full bg-white border-3 border-black text-black py-4 pl-5 pr-12 focus:ring-0 focus:border-black font-black appearance-none shadow-neo-sm rounded-none text-lg uppercase outline-none">
                                        <option>Linear Algebra (68%)</option>
                                        <option>Data Structures (78%)</option>
                                        <option>Computer Networks (85%)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black border-l-3 border-black bg-neo-accent">
                                        <span className="material-symbols-outlined font-black">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#F0F0F0] p-5 border-3 border-black shadow-neo-sm">
                                <div className="flex justify-between text-sm mb-3 font-black uppercase">
                                    <span>Target Goal</span>
                                    <span className="bg-neo-accent px-2 border-2 border-black shadow-neo-sm">75%</span>
                                </div>
                                <div className="w-full bg-white border-3 border-black h-8 relative overflow-hidden">
                                    <div className="bg-neo-primary h-full border-r-3 border-black" style={{ width: "75%" }}></div>
                                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 20px)" }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block w-1 bg-black self-stretch"></div>
                        <div className="w-full md:w-auto md:min-w-[280px] flex flex-col justify-center bg-white border-3 border-black p-6 shadow-neo-sm">
                            <p className="text-black font-black text-sm mb-4 uppercase border-b-3 border-black pb-2 text-center">Requirement:</p>
                            <div className="flex flex-col items-center justify-center py-6 bg-[#F0F0F0] border-3 border-black mb-4">
                                <span className="text-8xl font-black text-black leading-none drop-shadow-[4px_4px_0_#8b5cf6]">4</span>
                            </div>
                            <span className="text-sm font-black uppercase text-center bg-black text-white py-2 px-4 border-2 border-black">Consecutive Classes</span>
                            <p className="text-xs font-black text-gray-500 text-center mt-4 italic uppercase">
                                *Assume perfect attendance from now
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Subject Breakdown Table */}
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Subject Breakdown</h2>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border-3 border-black hover:bg-neo-accent text-black font-black text-sm shadow-neo-sm transition-all uppercase">
                        <span className="material-symbols-outlined font-black">filter_list</span> Filter
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border-3 border-black hover:bg-neo-accent text-black font-black text-sm shadow-neo-sm transition-all uppercase">
                        <span className="material-symbols-outlined font-black">sort</span> Sort
                    </button>
                </div>
            </div>
            <div className="bg-white border-4 border-black shadow-neo-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="p-5 text-sm font-black uppercase tracking-widest border-r-3 border-white/40">Subject</th>
                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center border-r-3 border-white/40">Total</th>
                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center border-r-3 border-white/40">Attended</th>
                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center border-r-3 border-white/40">Missed</th>
                                <th className="p-5 text-sm font-black uppercase tracking-widest text-left pl-8 border-r-3 border-white/40">Progress Bar</th>
                                <th className="p-5 text-sm font-black uppercase tracking-widest text-right border-r-3 border-white/40">Status</th>
                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-black text-black">
                            {/* Rows */}
                            <tr className="group hover:bg-[#F0F0F0] transition-colors">
                                <td className="p-5 border-r-3 border-black">
                                    <div className="flex items-center gap-5">
                                        <div className="size-14 bg-white border-3 border-black flex items-center justify-center text-black font-black shadow-neo-sm group-hover:bg-neo-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined font-black">functions</span>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black uppercase">Linear Algebra</p>
                                            <p className="text-xs font-black text-black bg-neo-accent px-2 py-0.5 inline-block border-2 border-black mt-1 uppercase">MAT-101 • Dr. Richards</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 text-center font-black text-xl border-r-3 border-black">45</td>
                                <td className="p-5 text-center font-black text-xl border-r-3 border-black">31</td>
                                <td className="p-5 text-center font-black text-xl text-neo-danger border-r-3 border-black bg-red-50">14</td>
                                <td className="p-5 pl-8 border-r-3 border-black">
                                    <div className="flex items-center gap-5">
                                        <div className="flex-1 h-7 min-w-32 bg-white border-3 border-black relative overflow-hidden">
                                            <div className="h-full bg-neo-danger border-r-3 border-black" style={{ width: "68%", backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 20px)" }}></div>
                                        </div>
                                        <span className="text-base font-black text-black bg-neo-danger px-2 border-2 border-black shadow-neo-sm">68%</span>
                                    </div>
                                </td>
                                <td className="p-5 text-right border-r-3 border-black">
                                    <span className="inline-flex items-center px-4 py-2 font-black text-xs uppercase bg-neo-danger text-black border-3 border-black shadow-neo-sm">
                                        Critical
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <button className="size-10 inline-flex items-center justify-center border-3 border-transparent hover:border-black hover:bg-neo-accent text-black transition-all">
                                        <span className="material-symbols-outlined font-black">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* More rows omitted for brevity, but structure is clear */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
