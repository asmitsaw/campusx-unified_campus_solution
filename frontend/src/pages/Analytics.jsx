import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-8 text-slate-900">
      <div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Student Analytics</h1>
        <p className="text-slate-600 font-medium mt-2 border-l-4 border-primary pl-3">Detailed insights into your academic performance.</p>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-3 border-black shadow-neo rounded p-6 hover:-translate-y-1 hover:shadow-neo-hover transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary text-white p-3 border-2 border-black rounded shadow-neo-sm">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-slate-500">CGPA Trend</p>
              <h3 className="text-3xl font-black">9.2</h3>
            </div>
          </div>
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} /> +0.4 since last semester
          </p>
        </div>

        <div className="bg-white border-3 border-black shadow-neo rounded p-6 hover:-translate-y-1 hover:shadow-neo-hover transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-accent-yellow text-black p-3 border-2 border-black rounded shadow-neo-sm">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-slate-500">Class Rank</p>
              <h3 className="text-3xl font-black">Top 5%</h3>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-600">
            OutOf 120 Students
          </p>
        </div>

        <div className="bg-white border-3 border-black shadow-neo rounded p-6 hover:-translate-y-1 hover:shadow-neo-hover transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-400 text-black p-3 border-2 border-black rounded shadow-neo-sm">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-slate-500">Credits Earned</p>
              <h3 className="text-3xl font-black">45/60</h3>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-600">
            75% Completion Rate
          </p>
        </div>
      </div>

      {/* Big Chart Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-3 border-black shadow-neo rounded p-8">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                <BarChart className="text-primary" />
                Performance By Subject
            </h3>
            {/* Mock Chart Visual */}
            <div className="flex items-end justify-between h-64 gap-4 px-4 border-b-3 border-black pb-4">
                {[65, 80, 45, 90, 75, 55].map((h, i) => (
                    <div key={i} className="w-full relative group">
                        <div 
                            className="bg-primary/20 border-2 border-black w-full absolute bottom-0 transition-all duration-300 group-hover:bg-primary"
                            style={{ height: `${h}%` }}
                        ></div>
                         <div className="absolute -top-8 w-full text-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}%
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold uppercase text-slate-500 px-4">
                <span>Math</span>
                <span>CS</span>
                <span>Eng</span>
                <span>Phy</span>
                <span>Chem</span>
                <span>Bio</span>
            </div>
        </div>

        {/* Notifications / List */}
        <div className="bg-white border-3 border-black shadow-neo rounded flex flex-col">
            <div className="p-6 border-b-3 border-black bg-background-light">
                <h3 className="text-xl font-black uppercase">Recent Alerts</h3>
            </div>
            <div className="flex-1 p-6 space-y-4">
                {[
                    { type: 'warning', msg: 'Assignment: Data Structures due tomorrow', time: '2h ago' },
                    { type: 'success', msg: 'Your project submission was approved', time: '5h ago' },
                    { type: 'info', msg: 'New seamless integration for LMS available', time: '1d ago' }
                ].map((alert, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-2 border-black rounded shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white">
                        {alert.type === 'warning' && <AlertCircle className="text-amber-600 shrink-0" />}
                        {alert.type === 'success' && <CheckCircle className="text-emerald-600 shrink-0" />}
                        {alert.type === 'info' && <BookOpen className="text-primary shrink-0" />}
                        <div className="flex-1">
                            <p className="font-bold text-sm leading-tight">{alert.msg}</p>
                            <span className="text-xs font-bold text-slate-400 uppercase mt-1 block">{alert.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
