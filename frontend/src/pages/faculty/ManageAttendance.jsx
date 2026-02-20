import React, { useState } from "react";
import { ClipboardList, Search, CheckCircle, XCircle, Calendar } from "lucide-react";

const SUBJECTS = ["Data Structures", "Operating Systems", "DBMS", "Computer Networks", "Software Engineering"];

const STUDENTS = [
    { id: "CS2101", name: "Aarav Patel", present: true },
    { id: "CS2102", name: "Priya Sharma", present: true },
    { id: "CS2103", name: "Rahul Kumar", present: false },
    { id: "CS2104", name: "Sneha Reddy", present: true },
    { id: "CS2105", name: "Vikram Singh", present: true },
    { id: "CS2106", name: "Ananya Gupta", present: false },
    { id: "CS2107", name: "Deepak Joshi", present: true },
    { id: "CS2108", name: "Kavita Nair", present: true },
    { id: "CS2109", name: "Rohan Mehta", present: true },
    { id: "CS2110", name: "Divya Iyer", present: false },
];

const RECORDS = [
    { date: "Feb 19, 2026", subject: "Data Structures", present: 38, total: 42 },
    { date: "Feb 18, 2026", subject: "Operating Systems", present: 35, total: 42 },
    { date: "Feb 17, 2026", subject: "DBMS", present: 40, total: 42 },
    { date: "Feb 16, 2026", subject: "Data Structures", present: 36, total: 42 },
];

export default function ManageAttendance() {
    const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
    const [attendance, setAttendance] = useState(
        STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: s.present }), {})
    );
    const [search, setSearch] = useState("");

    const toggleAttendance = (id) => {
        setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredStudents = STUDENTS.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    );

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = STUDENTS.length - presentCount;

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #4CAF50" }}
                    >
                        Manage Attendance
                    </h1>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Present</p>
                        <p className="text-3xl font-black">{presentCount}</p>
                    </div>
                    <div className="bg-neo-red border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/90 mb-1">Absent</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>{absentCount}</p>
                    </div>
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Percentage</p>
                        <p className="text-3xl font-black">{Math.round((presentCount / STUDENTS.length) * 100)}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mark Attendance */}
                    <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                        <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-green">
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-white p-1 border-2 border-white">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-black uppercase italic">Mark Attendance</h3>
                            </div>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="border-2 border-black bg-white px-3 py-1 font-bold text-sm shadow-neo-sm"
                            >
                                {SUBJECTS.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="px-6 py-4 border-b-2 border-black bg-neo-bg">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border-2 border-black pl-10 pr-4 py-2 font-bold placeholder:text-gray-400 outline-none shadow-neo-sm focus:shadow-neo"
                                    placeholder="Search by name or ID..."
                                />
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="divide-y-2 divide-black">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className={`flex items-center justify-between px-6 py-4 hover:bg-neo-bg transition-colors ${!attendance[student.id] ? "bg-neo-red/10" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neo-purple border-2 border-black flex items-center justify-center text-white font-black text-sm">
                                            {student.name.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="font-black">{student.name}</p>
                                            <p className="text-xs font-mono font-bold text-slate-500">{student.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleAttendance(student.id)}
                                        className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-black text-sm uppercase shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all ${attendance[student.id]
                                                ? "bg-neo-green text-black"
                                                : "bg-neo-red text-white"
                                            }`}
                                    >
                                        {attendance[student.id] ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" /> Present
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4" /> Absent
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="px-6 py-4 border-t-3 border-black bg-neo-bg">
                            <button className="w-full bg-black text-white border-3 border-black py-3 font-black text-lg uppercase shadow-neo-sm hover:bg-neo-purple hover:text-white active:shadow-none active:translate-y-[2px] transition-all">
                                Submit Attendance
                            </button>
                        </div>
                    </div>

                    {/* Recent Records */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-yellow">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Recent Records
                            </h3>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {RECORDS.map((record, i) => (
                                <div key={i} className="px-5 py-4 hover:bg-neo-bg transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-black text-sm">{record.subject}</p>
                                        <span className="text-xs font-mono font-bold bg-white border border-black px-1">
                                            {record.date}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-3 bg-neo-bg border-2 border-black">
                                            <div
                                                className="h-full bg-neo-green"
                                                style={{ width: `${(record.present / record.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-black">
                                            {record.present}/{record.total}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
