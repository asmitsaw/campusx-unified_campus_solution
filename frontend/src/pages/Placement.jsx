import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Settings, 
  TrendingUp, 
  Check, 
  Code, 
  Users, 
  Award, 
  FileText, 
  MonitorPlay, 
  ArrowRight,
  Briefcase
} from 'lucide-react';

const Placement = () => {
  return (
    <div className="min-h-screen bg-neo-bg font-sans p-8 text-black">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-10 border-b-3 border-black pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl border-2 border-transparent">
             <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Use Placement Hub</h1>
            <div className="text-xs font-bold bg-neo-yellow px-1 border border-black inline-block uppercase">ERP SYSTEM</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input 
              type="text" 
              placeholder="SEARCH JOBS..." 
              className="pl-10 pr-4 py-2 border-3 border-black shadow-neo-sm focus:outline-none font-bold w-64 placeholder:text-gray-500 bg-white"
            />
          </div>
          <button className="p-2 bg-neo-pink border-3 border-black shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1 active:shadow-none">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-2 bg-neo-green border-3 border-black shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1 active:shadow-none">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Welcome Section */}
          <div className="border-l-8 border-black pl-6 py-2">
            <h2 className="text-6xl font-black uppercase mb-2">Welcome, Alex!</h2>
            <div className="bg-white border-3 border-black p-3 font-bold flex items-center gap-2 shadow-neo-sm w-fit transform -rotate-1">
              <span className="w-3 h-3 bg-neo-green border-2 border-black rounded-full"></span>
              5 new companies visiting. Microsoft application updated.
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="bg-neo-yellow border-3 border-black p-6 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all cursor-pointer relative group">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-sm bg-black text-white px-2 py-0.5 uppercase">Avg Package</span>
                <span className="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold flex items-center gap-1 group-hover:bg-black group-hover:text-white transition-colors">
                  <TrendingUp size={12} /> +12%
                </span>
              </div>
              <div className="text-5xl font-black mb-4">14.5 <span className="text-xl font-bold">LPA</span></div>
              <div className="w-full bg-white h-4 border-2 border-black relative">
                <div className="absolute top-0 left-0 h-full bg-black w-3/4"></div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-neo-pink border-3 border-black p-6 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all cursor-pointer relative group">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-sm bg-black text-white px-2 py-0.5 uppercase">Highest Pkg</span>
                <span className="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold group-hover:bg-black group-hover:text-white transition-colors flex items-center gap-1">
                   <Check size={12}/> NEW
                </span>
              </div>
              <div className="text-5xl font-black mb-4">45 <span className="text-xl font-bold">LPA</span></div>
              <div className="w-full bg-white h-4 border-2 border-black relative">
                <div className="absolute top-0 left-0 h-full bg-black w-[90%]"></div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-neo-green border-3 border-black p-6 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all cursor-pointer relative group">
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-sm bg-black text-white px-2 py-0.5 uppercase">Placement %</span>
                <span className="bg-white border-2 border-black px-2 py-0.5 text-xs font-bold flex items-center gap-1 group-hover:bg-black group-hover:text-white transition-colors">
                  <TrendingUp size={12} /> +8%
                </span>
              </div>
              <div className="text-5xl font-black mb-4">85<span className="text-xl font-bold">%</span></div>
              <div className="w-full bg-white h-4 border-2 border-black relative">
                <div className="absolute top-0 left-0 h-full bg-black w-[85%]"></div>
              </div>
            </div>
          </div>

          {/* Journey Tracker */}
          <div className="bg-white border-3 border-black p-8 shadow-neo-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">Tracker</div>
            
            <div className="flex justify-between items-end mb-16 relative z-10">
              <div>
                <h3 className="text-3xl font-black uppercase mb-1">Your Journey</h3>
                <p className="text-gray-500 font-bold uppercase tracking-wide text-sm border-b-2 border-gray-300 inline-block pb-1">Microsoft • Product Manager</p>
              </div>
              <button className="bg-white border-3 border-black px-6 py-2 font-black uppercase hover:bg-black hover:text-white transition-all shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-sm">
                View Details
              </button>
            </div>

            <div className="relative flex justify-between items-center px-4 mb-4">
              {/* Connecting Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-3 bg-gray-200 -z-10 -translate-y-1/2 border-y-2 border-gray-300"></div>
              
              {/* Active Progress Line */}
              <div className="absolute top-1/2 left-0 w-[50%] h-3 bg-neo-strong-purple -z-10 -translate-y-1/2 border-y-2 border-black"></div>

              {/* Step 1: Applied */}
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-12 h-12 bg-neo-green border-3 border-black flex items-center justify-center shadow-neo-sm transition-transform group-hover:scale-110">
                  <Check className="w-6 h-6 text-black stroke-[3]" />
                </div>
                <div className="bg-white border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Applied
                </div>
              </div>

              {/* Step 2: Shortlist */}
              <div className="flex flex-col items-center gap-4 group">
                <div className="w-12 h-12 bg-neo-green border-3 border-black flex items-center justify-center shadow-neo-sm transition-transform group-hover:scale-110">
                  <Check className="w-6 h-6 text-black stroke-[3]" />
                </div>
                <div className="bg-white border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Shortlist
                </div>
              </div>

              {/* Step 3: Coding Round (Active) */}
              <div className="flex flex-col items-center gap-4 relative">
                <div className="w-16 h-16 bg-neo-strong-purple border-3 border-black flex items-center justify-center shadow-neo animate-bounce z-10">
                  <Code className="w-8 h-8 text-white stroke-[3]" />
                </div>
                <div className="bg-black text-white border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] -rotate-3 absolute -bottom-10 whitespace-nowrap z-20">
                  Coding Round
                </div>
              </div>

              {/* Step 4: Interview */}
              <div className="flex flex-col items-center gap-4 opacity-50">
                <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shadow-neo-sm">
                  <Users className="w-6 h-6 text-black stroke-[3]" />
                </div>
                <div className="text-gray-500 font-bold text-[10px] uppercase pt-1">
                  Interview
                </div>
              </div>

               {/* Step 5: Offer */}
               <div className="flex flex-col items-center gap-4 opacity-50">
                <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shadow-neo-sm">
                  <Award className="w-6 h-6 text-black stroke-[3]" />
                </div>
                <div className="text-gray-500 font-bold text-[10px] uppercase pt-1">
                  Offer
                </div>
              </div>

            </div>
          </div>

          {/* Visiting Companies (List) */}
          <div className="pt-4">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-3xl font-black uppercase underline decoration-4 decoration-black underline-offset-4">Visiting Companies</h3>
              <button className="font-bold underline uppercase hover:text-neo-strong-purple text-sm">View all companies</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company 1 */}
               <div className="bg-white border-3 border-black p-4 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col gap-4 relative group">
                  <div className="absolute top-2 right-2">
                       <span className="bg-neo-green px-2 py-0.5 text-[10px] border border-black font-bold uppercase block shadow-sm">Eligible</span>
                  </div>
                  <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center font-bold text-2xl shadow-sm mt-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase leading-none">Google</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase mt-1">SDE Intern</p>
                  </div>
                  <div className="w-full h-[2px] bg-black"></div>
                  <div className="flex justify-between items-center text-xs font-bold">
                      <span>₹12 LPA</span>
                      <span>Bangalore</span>
                  </div>
               </div>

               {/* Company 2 */}
               <div className="bg-white border-3 border-black p-4 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col gap-4 relative">
                  <div className="absolute top-2 right-2">
                       <span className="bg-neo-strong-purple text-white px-2 py-0.5 text-[10px] border border-black font-bold uppercase block shadow-sm">Applied</span>
                  </div>
                  <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center font-bold text-2xl shadow-sm mt-2">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase leading-none">Microsoft</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase mt-1">Product Mgr</p>
                  </div>
                  <div className="w-full h-[2px] bg-black"></div>
                  <div className="flex justify-between items-center text-xs font-bold">
                      <span>₹18 LPA</span>
                      <span>Hyderabad</span>
                  </div>
               </div>

               {/* Company 3 */}
               <div className="bg-gray-100 border-3 border-gray-400 p-4 flex flex-col gap-4 relative opacity-60 grayscale hover:grayscale-0 hover:bg-white hover:border-black hover:opacity-100 transition-all cursor-not-allowed">
                  <div className="absolute top-2 right-2">
                       <span className="bg-gray-300 px-2 py-0.5 text-[10px] border border-gray-500 font-bold uppercase block">Ineligible</span>
                  </div>
                  <div className="w-16 h-16 bg-white border-2 border-gray-400 flex items-center justify-center font-bold text-2xl mt-2">
                     <span className="text-2xl font-black text-gray-400">D</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg uppercase leading-none text-gray-500">Deloitte</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase mt-1">Analyst</p>
                  </div>
                  <div className="w-full h-[2px] bg-gray-400"></div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span>₹8 LPA</span>
                      <span>Pune</span>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Profile Card */}
          <div className="bg-neo-accent border-3 border-black p-6 shadow-neo-lg text-center relative group">
            <div className="absolute top-4 right-4 animate-spin-slow">
                 <Briefcase size={24} className="opacity-20"/>
            </div>
            
            <div className="w-32 h-32 mx-auto bg-white border-3 border-black mb-4 relative overflow-hidden shadow-neo-sm group-hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede" alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <div className="bg-white border-3 border-black inline-block px-4 py-2 font-black text-xl mb-1 shadow-neo-sm transform -rotate-2 group-hover:rotate-0 transition-transform">
              ALEX MORGAN
            </div>
            <div className="font-bold text-sm uppercase tracking-widest mb-8 mt-2">Class of 2024</div>

            <div className="space-y-4 mb-8">
              <div className="bg-white border-3 border-black p-4 flex justify-between items-center shadow-neo-sm hover:translate-x-1 transition-transform">
                 <div className="flex items-center gap-3 font-bold uppercase text-sm">
                    <div className="bg-neo-accent-orange p-1.5 border-2 border-black shadow-sm"><Award size={16}/></div>
                    CGPA
                 </div>
                 <span className="text-3xl font-black">8.9</span>
              </div>
              <div className="bg-white border-3 border-black p-4 flex justify-between items-center shadow-neo-sm hover:translate-x-1 transition-transform">
                 <div className="flex items-center gap-3 font-bold uppercase text-sm">
                    <div className="bg-neo-accent-pink p-1.5 border-2 border-black shadow-sm"><FileText size={16}/></div>
                    Backlogs
                 </div>
                 <span className="text-3xl font-black">0</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="group/btn relative">
                 <button className="w-full bg-white border-3 border-black py-3 font-black text-xs uppercase hover:bg-black hover:text-white transition-colors shadow-neo-sm flex items-center justify-center gap-2 group-hover/btn:translate-y-1 group-hover/btn:shadow-none active:translate-y-1 active:shadow-none">
                   Resume
                 </button>
              </div>
              <div className="group/btn relative">
                 <button className="w-full bg-black text-white border-3 border-black py-3 font-black text-xs uppercase hover:bg-gray-800 transition-colors shadow-neo-sm flex items-center justify-center gap-2 group-hover/btn:translate-y-1 group-hover/btn:shadow-none active:translate-y-1 active:shadow-none">
                   Mocks
                 </button>
              </div>
            </div>
          </div>

          {/* Mini Profile / Quick Link */}
          <div className="bg-white border-3 border-black p-4 shadow-neo flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-200 border-2 border-black overflow-hidden shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede" alt="Profile" className="w-full h-full" />
               </div>
               <div className="leading-tight">
                 <div className="font-black text-lg uppercase">Alex Morgan</div>
                 <div className="text-xs font-bold text-neo-strong-blue uppercase">CS Dept.</div>
               </div>
             </div>
             <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Trends placeholder */}
           <div className="bg-white border-3 border-black p-6 shadow-neo-lg relative">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black uppercase text-xl">Trends</h3>
                 <TrendingUp size={20} />
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase">
                       <span>CS</span>
                       <span>92%</span>
                    </div>
                    <div className="h-3 bg-gray-100 border-2 border-black w-full overflow-hidden relative">
                        <div className="absolute h-full bg-neo-blue w-[92%] border-r-2 border-black"></div>
                        <div className="absolute h-full w-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase">
                       <span>IT</span>
                       <span>88%</span>
                    </div>
                    <div className="h-3 bg-gray-100 border-2 border-black w-full overflow-hidden relative">
                        <div className="absolute h-full bg-neo-green w-[88%] border-r-2 border-black"></div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase">
                       <span>ECE</span>
                       <span>76%</span>
                    </div>
                    <div className="h-3 bg-gray-100 border-2 border-black w-full overflow-hidden relative">
                        <div className="absolute h-full bg-neo-pink w-[76%] border-r-2 border-black"></div>
                    </div>
                 </div>
              </div>
              <p className="mt-6 text-[10px] font-bold text-gray-500 uppercase border-t border-gray-300 pt-2 text-center">Analysis based on last 5 years</p>
           </div>

        </div>
      </div>
    </div>
  );
}

export default Placement;
