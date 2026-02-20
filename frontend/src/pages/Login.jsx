import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, School, User, Lock, Building2, HelpCircle, FileText } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, redirect to the main dashboard
    navigate('/dashboard/overview');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f0f0] font-display text-slate-900 overflow-hidden relative">
      
      {/* Background Decoration */}
      <div className="fixed top-20 -left-10 -z-10 opacity-10 select-none pointer-events-none rotate-12">
        <School size={300} className="text-[#137fec]" />
      </div>
      <div className="fixed bottom-20 -right-10 -z-10 opacity-10 select-none pointer-events-none -rotate-12">
        <Building2 size={300} className="text-[#fbef23]" />
      </div>

      <div className="w-full max-w-[480px] space-y-8 relative z-10">
        {/* Brand Header */}
        <header className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3 bg-white border-3 border-black p-3 shadow-neo-sm">
            <School className="w-10 h-10 text-[#137fec]" strokeWidth={2.5} />
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">CampusX</h1>
          </div>
        </header>

        {/* Main Login Card */}
        <main className="bg-white border-3 border-black shadow-neo rounded p-8 md:p-12 space-y-8 transition-all duration-200">
          <div className="space-y-2">
            <h2 className="text-3xl font-black leading-none uppercase">Sign In</h2>
            <p className="text-slate-600 font-medium">Enter your credentials to access the portal.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Email/Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wide">ID / Username</label>
              <div className="relative group">
                 <div className="absolute top-3.5 left-3 pointer-events-none z-10">
                    <User className="w-6 h-6 text-black" strokeWidth={2.5} />
                 </div>
                 <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-3 border-black pl-12 pr-4 py-3 text-black font-bold outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover focus:translate-x-[-2px] focus:translate-y-[-2px]"
                    placeholder="student@campusx.edu"
                 />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-black uppercase underline decoration-2 hover:text-[#137fec]">Forgot?</a>
              </div>
              <div className="relative group">
                 <div className="absolute top-3.5 left-3 pointer-events-none z-10">
                    <Lock className="w-6 h-6 text-black" strokeWidth={2.5} />
                 </div>
                 <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-3 border-black pl-12 pr-4 py-3 text-black font-bold outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover focus:translate-x-[-2px] focus:translate-y-[-2px]"
                    placeholder="••••••••"
                 />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              className="w-full py-4 px-6 flex items-center justify-center gap-2 group bg-[#fbef23] border-3 border-black shadow-neo-sm rounded hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 mt-2"
            >
              <span className="block text-xl font-black text-black leading-none uppercase">Login</span>
              <ArrowRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t-3 border-black"></div>
            <span className="flex-shrink mx-4 text-xs font-black uppercase text-black bg-white px-2">Or</span>
            <div className="flex-grow border-t-3 border-black"></div>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white text-sm font-black py-4 px-2 border-3 border-black shadow-neo-sm rounded hover:bg-slate-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 uppercase">
              Parent Portal
            </button>
            <button className="bg-white text-sm font-black py-4 px-2 border-3 border-black shadow-neo-sm rounded hover:bg-slate-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 uppercase">
              Apply Now
            </button>
          </div>
        </main>

        {/* Footer Links */}
        <footer className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-4">
          <a href="#" className="flex items-center gap-1 text-sm font-bold underline decoration-3 decoration-[#137fec] underline-offset-4 hover:text-[#137fec] transition-colors">
            <HelpCircle size={14} /> Help Desk
          </a>
          <a href="#" className="flex items-center gap-1 text-sm font-bold underline decoration-3 decoration-black underline-offset-4 hover:text-[#137fec] transition-colors">
            <FileText size={14} /> Terms of Service
          </a>
          <a href="#" className="flex items-center gap-1 text-sm font-bold underline decoration-3 decoration-black underline-offset-4 hover:text-[#137fec] transition-colors">
            <Lock size={14} /> Privacy Policy
          </a>
        </footer>
      </div>
    </div>
  );
}
