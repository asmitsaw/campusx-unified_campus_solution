import React, { useState } from "react";
import { Users, Search, Eye, MoreVertical, GraduationCap } from "lucide-react";

const STUDENTS = [
    { id: "CS2101", name: "Aarav Patel", branch: "CSE", year: "3rd", cgpa: "8.9", status: "Active", attendance: "92%" },
    { id: "CS2102", name: "Priya Sharma", branch: "CSE", year: "3rd", cgpa: "9.2", status: "Active", attendance: "88%" },
    { id: "CS2103", name: "Rahul Kumar", branch: "ECE", year: "2nd", cgpa: "7.5", status: "Active", attendance: "76%" },
    { id: "CS2104", name: "Sneha Reddy", branch: "CSE", year: "4th", cgpa: "8.1", status: "Active", attendance: "95%" },
    { id: "CS2105", name: "Vikram Singh", branch: "ME", year: "1st", cgpa: "7.8", status: "Active", attendance: "82%" },
    { id: "CS2106", name: "Ananya Gupta", branch: "CSE", year: "3rd", cgpa: "9.5", status: "Active", attendance: "97%" },
    { id: "CS2107", name: "Deepak Joshi", branch: "IT", year: "2nd", cgpa: "6.9", status: "Detained", attendance: "62%" },
    { id: "CS2108", name: "Kavita Nair", branch: "CSE", year: "4th", cgpa: "8.7", status: "Active", attendance: "91%" },
];

export default function ManageStudents() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = STUDENTS.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.id.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || s.branch === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #137fec" }}
                    >
                        Manage Students
                    </h1>
                    <button className="bg-neo-purple text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all">
                        + Add Student
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Students</p>
                        <p className="text-3xl font-black">{STUDENTS.length}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Active</p>
                        <p className="text-3xl font-black">{STUDENTS.filter((s) => s.status === "Active").length}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Avg. CGPA</p>
                        <p className="text-3xl font-black">
                            {(STUDENTS.reduce((a, s) => a + parseFloat(s.cgpa), 0) / STUDENTS.length).toFixed(1)}
                        </p>
                    </div>
                    <div className="bg-neo-red border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/90 mb-1">Detained</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>
                            {STUDENTS.filter((s) => s.status === "Detained").length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border-3 border-black shadow-neo">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-blue gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-1 border-2 border-white">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-black uppercase italic">Student Directory</h3>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border-2 border-black pl-9 pr-3 py-2 text-sm font-bold outline-none shadow-neo-sm"
                                    placeholder="Search..."
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border-2 border-black bg-white px-3 py-2 text-sm font-bold shadow-neo-sm"
                            >
                                <option>All</option>
                                <option>CSE</option>
                                <option>ECE</option>
                                <option>ME</option>
                                <option>IT</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white text-xs uppercase font-bold border-b-3 border-black">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Branch</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Year</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">CGPA</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20">Attendance</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20 text-center">Status</th>
                                    <th className="px-6 py-4 border-l-2 border-white/20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {filtered.map((student) => (
                                    <tr key={student.id} className="group hover:bg-neo-bg transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-neo-purple border-2 border-black flex items-center justify-center text-white font-black text-sm shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                                    {student.name.split(" ").map((n) => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-black">{student.name}</p>
                                                    <p className="text-xs font-mono font-bold text-slate-500">{student.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">{student.branch}</td>
                                        <td className="px-6 py-4 font-bold">{student.year}</td>
                                        <td className="px-6 py-4 font-black">{student.cgpa}</td>
                                        <td className="px-6 py-4 font-bold">{student.attendance}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${student.status === "Active"
                                                        ? "bg-neo-green text-black"
                                                        : "bg-neo-red text-white"
                                                    }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="border-2 border-black bg-white px-3 py-1 text-sm font-bold hover:bg-neo-blue transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                                <Eye className="w-4 h-4 inline" /> View
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
