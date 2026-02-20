import React from 'react';

export default function Analytics() {
  return (
    <div className="bg-[#fffdf5] text-black antialiased min-h-screen flex flex-col p-6 -m-6" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        
        {/* Header - Not needed as Sidebar/Header exist, but preserving look if requested */}
        {/* Actually, the layout already has a header. We'll focus on the main content area */}
        
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-0 lg:p-4 gap-8 scroll-smooth">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center text-sm font-bold uppercase tracking-wider bg-white w-fit px-3 py-1 border-2 border-neo-border shadow-neo-sm">
                        <a className="hover:underline decoration-2" href="#">Home</a>
                        <span className="material-symbols-outlined text-base mx-2 font-bold">chevron_right</span>
                        <a className="hover:underline decoration-2" href="#">Academics</a>
                        <span className="material-symbols-outlined text-base mx-2 font-bold">chevron_right</span>
                        <span className="bg-neo-yellow px-1">Tracker</span>
                    </div>
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="bg-white border-4 border-black p-4 shadow-neo">
                            <h1 className="text-4xl lg:text-5xl font-black text-black uppercase leading-none">Academic<br/>Performance</h1>
                            <p className="text-base font-bold mt-2 bg-black text-white inline-block px-2">Sem 5 • Computer Science Engineering</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 border-2 border-black bg-white hover:bg-gray-100 text-black font-bold uppercase shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                <span className="material-symbols-outlined">history</span>
                                History
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 border-2 border-black bg-neo-purple text-white hover:bg-neo-purple/90 font-bold uppercase shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                <span className="material-symbols-outlined">download</span>
                                Transcript
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-neo-blue border-4 border-black p-6 shadow-neo relative overflow-hidden group">
                        <div className="absolute right-2 top-2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-8xl text-black">school</span>
                        </div>
                        <p className="text-black font-bold text-sm uppercase mb-1 border-b-2 border-black inline-block">Current CGPA</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-5xl font-black text-black">8.92</h3>
                            <span className="text-white text-xs font-bold bg-black border border-black px-1 py-0.5 flex items-center shadow-[2px_2px_0px_#fff]">
                                <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +0.2
                            </span>
                        </div>
                        <div className="w-full bg-white border-2 border-black h-4 mt-4 flex p-0.5">
                            <div className="bg-black h-full w-[89%]"></div>
                        </div>
                    </div>
                    <div className="bg-neo-pink border-4 border-black p-6 shadow-neo relative overflow-hidden group">
                        <div className="absolute right-2 top-2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-8xl text-black">menu_book</span>
                        </div>
                        <p className="text-black font-bold text-sm uppercase mb-1 border-b-2 border-black inline-block">Semester GPA</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-5xl font-black text-black">9.15</h3>
                            <span className="text-white text-xs font-bold bg-black border border-black px-1 py-0.5 flex items-center shadow-[2px_2px_0px_#fff]">
                                <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +0.4
                            </span>
                        </div>
                        <div className="w-full bg-white border-2 border-black h-4 mt-4 flex p-0.5">
                            <div className="bg-black h-full w-[91%]"></div>
                        </div>
                    </div>
                    <div className="bg-neo-green border-4 border-black p-6 shadow-neo relative overflow-hidden group">
                        <div className="absolute right-2 top-2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-8xl text-black">workspace_premium</span>
                        </div>
                        <p className="text-black font-bold text-sm uppercase mb-1 border-b-2 border-black inline-block">Total Credits</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-5xl font-black text-black">22</h3>
                            <span className="text-black text-xs font-bold bg-white border-2 border-black px-1">/ 24</span>
                        </div>
                        <div className="w-full bg-white border-2 border-black h-4 mt-4 flex p-0.5">
                            <div className="bg-black h-full w-[92%]"></div>
                        </div>
                    </div>
                    <div className="bg-neo-yellow border-4 border-black p-6 shadow-neo relative overflow-hidden group">
                        <div className="absolute right-2 top-2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-8xl text-black">warning</span>
                        </div>
                        <p className="text-black font-bold text-sm uppercase mb-1 border-b-2 border-black inline-block bg-neo-pink text-white px-1">Backlog Risk</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-5xl font-black text-black">1</h3>
                            <span className="text-white text-xs font-bold bg-black px-2 py-0.5 shadow-neo-sm transform -rotate-2">
                                ALERT
                            </span>
                        </div>
                        <p className="text-xs text-black font-bold mt-4 border-2 border-black bg-white p-1 inline-block">Calculus needs attention!</p>
                    </div>
                </div>

                <div className="bg-white rounded-none border-4 border-black p-6 shadow-neo">
                    <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                        <h3 className="text-2xl font-black uppercase text-black flex items-center gap-2">
                            <span className="bg-black text-white p-1 block w-8 h-8 flex items-center justify-center">
                                <span className="material-symbols-outlined">show_chart</span>
                            </span>
                            Performance Trend
                        </h3>
                        <select className="bg-neo-yellow border-2 border-black text-sm font-bold text-black py-2 px-4 focus:ring-0 focus:outline-none cursor-pointer shadow-neo-sm">
                            <option>LAST 4 SEMESTERS</option>
                            <option>ALL SEMESTERS</option>
                        </select>
                    </div>
                    <div className="relative h-64 w-full flex items-end justify-between px-4 gap-4 bg-gray-50 border-2 border-black border-dashed">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4">
                            <div className="border-b-2 border-black/10 w-full h-full"></div>
                            <div className="border-b-2 border-black/10 w-full h-full"></div>
                            <div className="border-b-2 border-black/10 w-full h-full"></div>
                            <div className="border-b-2 border-black/10 w-full h-full"></div>
                        </div>
                        <div className="relative w-full h-full flex items-end p-4">
                            <svg className="absolute inset-0 w-full h-full overflow-visible p-4" preserveAspectRatio="none">
                                <path d="M0,180 L100,160 L300,120 L600,60 L1200,30" fill="none" stroke="#000" strokeLinejoin="round" strokeWidth="4" vectorEffect="non-scaling-stroke"></path>
                            </svg>
                            <div className="absolute left-[25%] top-[45%] size-4 bg-neo-yellow border-4 border-black z-10 group cursor-pointer hover:scale-150 transition-transform">
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap border-2 border-white shadow-neo-sm">
                                    SEM 2: 8.4
                                </div>
                            </div>
                            <div className="absolute left-[50%] top-[20%] size-4 bg-neo-blue border-4 border-black z-10 group cursor-pointer hover:scale-150 transition-transform">
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap border-2 border-white shadow-neo-sm">
                                    SEM 3: 9.1
                                </div>
                            </div>
                            <div className="absolute left-[75%] top-[10%] size-6 bg-neo-pink border-4 border-black z-10 cursor-pointer hover:scale-125 transition-transform shadow-neo-sm">
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-sm font-bold px-3 py-1 whitespace-nowrap border-2 border-white shadow-neo">
                                    CURRENT: 9.15
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm font-bold uppercase border-t-4 border-black pt-2">
                        <span className="px-2">Sem 1</span>
                        <span className="px-2">Sem 2</span>
                        <span className="px-2">Sem 3</span>
                        <span className="px-2">Sem 4</span>
                        <span className="bg-black text-white px-2">Sem 5 (Now)</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-3xl font-black text-black mb-6 uppercase tracking-tight bg-neo-yellow inline-block px-2 border-2 border-black shadow-neo-sm">Current Subjects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div className="bg-white rounded-none border-4 border-black p-0 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 group">
                            <div className="bg-neo-purple border-b-4 border-black p-4 flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-black text-black bg-white border-2 border-black px-2 py-0.5 shadow-neo-sm">CS501</span>
                                    <h4 className="text-white font-black text-xl mt-2 uppercase tracking-wide">Data Structures</h4>
                                </div>
                                <button className="bg-black text-white p-1 hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                            </div>
                            <div className="p-5 space-y-5">
                                <p className="text-black font-bold text-sm border-b-2 border-dashed border-black pb-2">Prof. Sarah Jenkins</p>
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2 uppercase">
                                        <span className="bg-gray-200 px-1">Internal Marks</span>
                                        <span className="bg-black text-white px-1">24/30</span>
                                    </div>
                                    <div className="flex w-full h-4 gap-1">
                                        <div className="bg-neo-green w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-green w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-green w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-green w-[19%] border-2 border-black"></div>
                                        <div className="bg-gray-200 w-[19%] border-2 border-black"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2 font-bold text-sm">
                                        <span className="material-symbols-outlined text-black">check_circle</span>
                                        <span>Att: 92%</span>
                                    </div>
                                    <span className="text-xs font-black uppercase bg-neo-green border-2 border-black px-2 py-1 shadow-neo-sm">On Track</span>
                                </div>
                            </div>
                        </div>

                        {/* More Cards omitted for brevity but following same pattern */}
                         <div className="bg-white rounded-none border-4 border-black p-0 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 group relative">
                            <div className="absolute -top-3 -right-3 bg-neo-pink text-white border-4 border-black px-2 py-1 font-bold text-xs uppercase shadow-neo z-10 rotate-3">
                                Warning!
                            </div>
                            <div className="bg-neo-yellow border-b-4 border-black p-4 flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-black text-black bg-white border-2 border-black px-2 py-0.5 shadow-neo-sm">MA502</span>
                                    <h4 className="text-black font-black text-xl mt-2 uppercase tracking-wide">Adv. Calculus</h4>
                                </div>
                                <button className="bg-black text-white p-1 hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
                            </div>
                            <div className="p-5 space-y-5">
                                <p className="text-black font-bold text-sm border-b-2 border-dashed border-black pb-2">Dr. Alan Turing</p>
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2 uppercase">
                                        <span className="bg-gray-200 px-1">Internal Marks</span>
                                        <span className="bg-neo-pink text-white px-1">12/30</span>
                                    </div>
                                    <div className="flex w-full h-4 gap-1">
                                        <div className="bg-neo-pink w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-pink w-[19%] border-2 border-black"></div>
                                        <div className="bg-gray-200 w-[19%] border-2 border-black"></div>
                                        <div className="bg-gray-200 w-[19%] border-2 border-black"></div>
                                        <div className="bg-gray-200 w-[19%] border-2 border-black"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2 font-bold text-sm">
                                        <span className="material-symbols-outlined text-neo-pink">warning</span>
                                        <span>Att: <span className="text-neo-pink">74%</span></span>
                                    </div>
                                    <button className="text-xs font-black uppercase bg-neo-black text-white hover:bg-neo-pink border-2 border-transparent px-2 py-1 transition-colors">Contact</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-none border-4 border-black p-0 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 group">
                            <div className="bg-neo-blue border-b-4 border-black p-4 flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-black text-black bg-white border-2 border-black px-2 py-0.5 shadow-neo-sm">CS503</span>
                                    <h4 className="text-white font-black text-xl mt-2 uppercase tracking-wide">OS Systems</h4>
                                </div>
                                <button className="bg-black text-white p-1 hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
                            </div>
                            <div className="p-5 space-y-5">
                                <p className="text-black font-bold text-sm border-b-2 border-dashed border-black pb-2">Prof. Linus T.</p>
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2 uppercase">
                                        <span className="bg-gray-200 px-1">Internal Marks</span>
                                        <span className="bg-black text-white px-1">27/30</span>
                                    </div>
                                    <div className="flex w-full h-4 gap-1">
                                        <div className="bg-neo-blue w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-blue w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-blue w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-blue w-[19%] border-2 border-black"></div>
                                        <div className="bg-neo-blue w-[9%] border-2 border-black"></div>
                                        <div className="bg-gray-200 w-[10%] border-2 border-black"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2 font-bold text-sm">
                                        <span className="material-symbols-outlined text-black">check_circle</span>
                                        <span>Att: 88%</span>
                                    </div>
                                    <span className="text-xs font-black uppercase bg-neo-blue border-2 border-black px-2 py-1 shadow-neo-sm">Excellent</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <aside className="w-full lg:w-96 bg-white border-l-4 border-black p-6 flex flex-col gap-8 overflow-y-auto shrink-0 relative mt-8 lg:mt-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neo-pink via-neo-yellow to-neo-blue"></div>
                
                {/* Sidebar Widgets */}
                <div className="flex items-center gap-4 p-4 border-4 border-black shadow-neo bg-neo-yellow">
                    <div className="bg-white p-2 border-2 border-black text-black shadow-neo-sm">
                        <span className="material-symbols-outlined font-bold">psychology</span>
                    </div>
                    <div>
                        <h4 className="text-black font-black text-lg uppercase leading-none">Focus Mode</h4>
                        <p className="text-xs font-bold text-black mt-1">EXAMS IN 14 DAYS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                        <input checked="" className="sr-only peer" type="checkbox" defaultValue=""/>
                        <div className="w-10 h-6 bg-white border-2 border-black peer-focus:outline-none shadow-neo-sm peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-black after:border after:border-black after:h-4 after:w-4 after:transition-all peer-checked:bg-neo-green"></div>
                    </label>
                </div>

                <div className="flex flex-col gap-4 border-4 border-black p-6 shadow-neo-lg bg-white relative">
                    <div className="absolute -top-3 left-6 bg-black text-white px-2 font-bold uppercase text-sm">Calculator</div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-3xl text-black">calculate</span>
                        <h3 className="text-black font-black text-xl uppercase">GPA Predictor</h3>
                    </div>
                    <div className="bg-black p-6 border-2 border-black flex flex-col items-center justify-center gap-2 shadow-neo transform rotate-1 hover:rotate-0 transition-transform duration-300">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Projected GPA</span>
                        <span className="text-6xl font-black text-neo-yellow tracking-tighter drop-shadow-[4px_4px_0px_#FF6B6B]">9.05</span>
                        <span className="text-xs font-bold bg-white text-black border-2 border-transparent px-3 py-1 uppercase mt-2">
                            On Track for Dean's List
                        </span>
                    </div>
                    {/* Simplified predictor form */}
                    <button className="w-full mt-6 bg-white hover:bg-black hover:text-white text-black font-black uppercase py-3 border-2 border-black shadow-neo active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">
                        Reset Calculation
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="mt-auto">
                    <h4 className="text-black font-black text-lg mb-4 uppercase bg-neo-blue inline-block px-2 border-2 border-black shadow-neo-sm">Quick Actions</h4>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 bg-white border-2 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-left group">
                            <div className="bg-neo-pink text-white border-2 border-black p-2 group-hover:bg-black transition-colors">
                                <span className="material-symbols-outlined text-xl">assignment_late</span>
                            </div>
                            <div>
                                <p className="text-black text-sm font-black uppercase">Re-evaluation</p>
                                <p className="text-xs text-gray-600 font-bold">Request Review</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-white border-2 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-left group">
                            <div className="bg-neo-blue text-white border-2 border-black p-2 group-hover:bg-black transition-colors">
                                <span className="material-symbols-outlined text-xl">calendar_month</span>
                            </div>
                            <div>
                                <p className="text-black text-sm font-black uppercase">Exam Schedule</p>
                                <p className="text-xs text-gray-600 font-bold">PDF Download</p>
                            </div>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
}
