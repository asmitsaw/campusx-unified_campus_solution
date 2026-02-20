import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, PieChart, Users, AlertCircle } from 'lucide-react';

const subjects = [
  { name: 'Data Structures & Algorithms', attended: 24, total: 28, color: 'text-emerald-600', bar: 'bg-emerald-500' },
  { name: 'Database Management', attended: 20, total: 28, color: 'text-amber-600', bar: 'bg-amber-500' },
  { name: 'Operating Systems', attended: 15, total: 28, color: 'text-red-600', bar: 'bg-red-500' },
  { name: 'Computer Networks', attended: 26, total: 28, color: 'text-primary', bar: 'bg-primary' },
];

export default function Attendance() {
  return (
    <div className="space-y-8 text-slate-900">
      <div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Attendance Tracking</h1>
        <p className="text-slate-600 font-medium mt-2 border-l-4 border-accent-yellow pl-3">Monitor your class attendance and eligibility.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-3 border-black shadow-neo rounded md:col-span-2 p-8 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm mb-1">Overall Attendance</p>
                <h2 className="text-6xl font-black tracking-tighter">85%</h2>
              </div>
              <div className="h-16 w-16 rounded-full border-3 border-black bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-neo-sm">
                <PieChart size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-8">
              <div className="w-full bg-slate-100 border-2 border-black rounded-full h-6 overflow-hidden">
                <div className="bg-emerald-500 h-full border-r-2 border-black" style={{ width: '85%' }}></div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                 <div className="bg-emerald-100 border-2 border-black p-1 rounded">
                    <Verified className="w-4 h-4 text-emerald-700" />
                 </div>
                 <p className="text-sm font-bold text-emerald-700">You are eligible for exams.</p>
              </div>
            </div>
        </div>

        <div className="bg-white border-3 border-black shadow-neo rounded md:col-span-2 flex flex-col">
           <div className="p-6 border-b-3 border-black bg-background-light">
              <h3 className="text-xl font-black uppercase">Quick Stats</h3>
           </div>
           <div className="p-6 grid grid-cols-2 gap-4 flex-1">
              <div className="p-4 bg-white border-2 border-black rounded shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <div className="text-primary font-bold uppercase text-xs">Total Classes</div>
                  <div className="text-3xl font-black text-black">112</div>
              </div>
              <div className="p-4 bg-white border-2 border-black rounded shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <div className="text-emerald-600 font-bold uppercase text-xs">Present</div>
                  <div className="text-3xl font-black text-black">95</div>
              </div>
              <div className="p-4 bg-white border-2 border-black rounded shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <div className="text-amber-600 font-bold uppercase text-xs">Leaves</div>
                  <div className="text-3xl font-black text-black">12</div>
              </div>
              <div className="p-4 bg-white border-2 border-black rounded shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <div className="text-red-600 font-bold uppercase text-xs">Absent</div>
                  <div className="text-3xl font-black text-black">5</div>
              </div>
           </div>
        </div>
      </div>

      <h2 className="text-2xl font-black uppercase italic border-b-3 border-black pb-2 inline-block">Subject Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject, index) => {
           const percentage = Math.round((subject.attended / subject.total) * 100);
           return (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white border-3 border-black shadow-neo rounded p-6 h-full hover:shadow-neo-hover transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg leading-tight w-2/3">{subject.name}</h3>
                    <span className={`text-2xl font-black ${subject.color}`}>{percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 border-2 border-black rounded-full h-4 mb-3 overflow-hidden">
                    <div className={`h-full border-r-2 border-black ${subject.bar}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>{subject.attended} / {subject.total} Classes</span>
                    {percentage < 75 && (
                      <span className="text-red-600 flex items-center gap-1 bg-red-50 px-2 border-2 border-red-200 rounded">
                        <AlertCircle size={14} /> Low Attendance
                      </span>
                    )}
                  </div>
              </div>
            </motion.div>
           );
        })}
      </div>
    </div>
  );
}

import { Verified } from 'lucide-react';
