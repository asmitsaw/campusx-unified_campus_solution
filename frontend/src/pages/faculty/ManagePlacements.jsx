import React, { useState } from "react";
import { Briefcase, Plus, Users, TrendingUp, Building2, Calendar, Eye } from "lucide-react";

const DRIVES = [
    {
        id: 1,
        company: "Google",
        role: "Software Engineer",
        package: "32 LPA",
        deadline: "Nov 10, 2026",
        applicants: 89,
        shortlisted: 24,
        status: "Active",
        type: "On-Campus",
    },
    {
        id: 2,
        company: "Microsoft",
        role: "SDE Intern",
        package: "12 LPA",
        deadline: "Nov 15, 2026",
        applicants: 156,
        shortlisted: 45,
        status: "Active",
        type: "On-Campus",
    },
    {
        id: 3,
        company: "Infosys",
        role: "System Engineer",
        package: "6.5 LPA",
        deadline: "Nov 20, 2026",
        applicants: 210,
        shortlisted: 0,
        status: "Upcoming",
        type: "On-Campus",
    },
    {
        id: 4,
        company: "Deloitte",
        role: "Analyst",
        package: "8 LPA",
        deadline: "Oct 30, 2026",
        applicants: 78,
        shortlisted: 30,
        status: "Completed",
        type: "Off-Campus",
    },
];

const STATUS_COLORS = {
    Active: "bg-neo-green",
    Upcoming: "bg-neo-blue",
    Completed: "bg-neo-yellow",
};

export default function ManagePlacements() {
    const [showForm, setShowForm] = useState(false);

    const totalPlaced = 156;
    const totalEligible = 420;

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #00D1FF" }}
                    >
                        Manage Placements
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-neo-cyan text-black border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Post Drive
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-neo-cyan border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Companies</p>
                        <p className="text-3xl font-black">{DRIVES.length}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Students Placed</p>
                        <p className="text-3xl font-black">{totalPlaced}</p>
                    </div>
                    <div className="bg-neo-purple border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/80 mb-1">Avg Package</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>8.5 LPA</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Placement Rate</p>
                        <p className="text-3xl font-black">{Math.round((totalPlaced / totalEligible) * 100)}%</p>
                    </div>
                </div>

                {/* Post New Drive Form */}
                {showForm && (
                    <div className="bg-white border-3 border-black shadow-neo p-6">
                        <h3 className="text-xl font-black uppercase mb-6 border-b-3 border-black pb-3">Post New Placement Drive</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Company Name</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="Google" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Role</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="Software Engineer" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Package (LPA)</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="12" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Deadline</label>
                                <input type="date" className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Eligibility Criteria</label>
                                <textarea className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm resize-none" rows={3} placeholder="Min CGPA, Branch, etc." />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Type</label>
                                <select className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white">
                                    <option>On-Campus</option>
                                    <option>Off-Campus</option>
                                    <option>Pool Drive</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button className="bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-cyan hover:text-black transition-colors active:shadow-none active:translate-y-[2px]">
                                Post Drive
                            </button>
                            <button onClick={() => setShowForm(false)} className="bg-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg active:shadow-none active:translate-y-[2px] transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Drives Table */}
                <div className="bg-white border-3 border-black shadow-neo">
                    <div className="px-6 py-4 border-b-3 border-black bg-neo-cyan">
                        <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                            <Building2 className="w-5 h-5" /> Placement Drives
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-3">Company</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20">Role</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20">Package</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20">Deadline</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20">Applicants</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20 text-center">Status</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {DRIVES.map((drive) => (
                                    <tr key={drive.id} className="hover:bg-neo-bg transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-black text-lg">{drive.company}</p>
                                            <p className="text-xs font-bold text-slate-500">{drive.type}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold">{drive.role}</td>
                                        <td className="px-6 py-4 font-black text-neo-purple">{drive.package}</td>
                                        <td className="px-6 py-4 font-bold">{drive.deadline}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-black">{drive.applicants}</span>
                                            {drive.shortlisted > 0 && (
                                                <span className="text-xs font-bold text-slate-500 ml-1">({drive.shortlisted} shortlisted)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${STATUS_COLORS[drive.status]}`}>
                                                {drive.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="border-2 border-black bg-white px-3 py-1 text-sm font-bold hover:bg-neo-blue transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                                <Eye className="w-4 h-4 inline mr-1" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
