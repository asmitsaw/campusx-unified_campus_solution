import React, { useState } from "react";
import { Home, Users, AlertTriangle, Utensils, CheckCircle, Clock, Wrench } from "lucide-react";

const ROOMS = [
    { block: "Cauvery", room: "B-101", student: "Aarav Patel", status: "Occupied" },
    { block: "Cauvery", room: "B-102", student: "Rahul Kumar", status: "Occupied" },
    { block: "Cauvery", room: "B-103", student: null, status: "Vacant" },
    { block: "Godavari", room: "G-201", student: "Priya Sharma", status: "Occupied" },
    { block: "Godavari", room: "G-202", student: null, status: "Maintenance" },
    { block: "Godavari", room: "G-203", student: "Sneha Reddy", status: "Occupied" },
];

const COMPLAINTS = [
    { id: "#REQ-2024", room: "B-204", category: "Plumbing", student: "Vikram Singh", date: "Feb 18, 2026", status: "In Progress" },
    { id: "#REQ-2025", room: "G-108", category: "Electrical", student: "Ananya Gupta", date: "Feb 19, 2026", status: "Pending" },
    { id: "#REQ-2023", room: "B-312", category: "Furniture", student: "Deepak Joshi", date: "Feb 15, 2026", status: "Resolved" },
];

const MESS_MENU = [
    { meal: "Breakfast", time: "07:30 - 09:30", items: ["Masala Dosa", "Sambar & Chutney", "Tea/Coffee"], color: "bg-neo-green" },
    { meal: "Lunch", time: "12:30 - 14:30", items: ["Veg Pulao", "Dal Fry", "Raita", "Roti"], color: "bg-neo-yellow" },
    { meal: "Snacks", time: "17:00 - 18:00", items: ["Samosa", "Tea"], color: "bg-neo-pink" },
    { meal: "Dinner", time: "20:00 - 21:30", items: ["Chapati", "Paneer Butter Masala", "Rice"], color: "bg-neo-blue" },
];

const STATUS_COLORS = {
    Occupied: "bg-neo-green",
    Vacant: "bg-neo-blue",
    Maintenance: "bg-neo-yellow",
    "In Progress": "bg-neo-yellow",
    Pending: "bg-neo-red",
    Resolved: "bg-neo-green",
};

export default function ManageHostel() {
    const [tab, setTab] = useState("rooms");

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #fbef23" }}
                    >
                        Manage Hostel
                    </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Rooms</p>
                        <p className="text-3xl font-black">{ROOMS.length}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Occupied</p>
                        <p className="text-3xl font-black">{ROOMS.filter((r) => r.status === "Occupied").length}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Vacant</p>
                        <p className="text-3xl font-black">{ROOMS.filter((r) => r.status === "Vacant").length}</p>
                    </div>
                    <div className="bg-neo-red border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/90 mb-1">Open Complaints</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>
                            {COMPLAINTS.filter((c) => c.status !== "Resolved").length}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3">
                    {[
                        { key: "rooms", label: "Rooms", icon: Home },
                        { key: "complaints", label: "Complaints", icon: Wrench },
                        { key: "mess", label: "Mess Menu", icon: Utensils },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 px-6 py-3 border-3 border-black font-black uppercase text-sm shadow-neo-sm transition-all ${tab === t.key
                                    ? "bg-black text-white translate-x-[2px] translate-y-[2px] shadow-none"
                                    : "bg-white hover:-translate-y-1 hover:shadow-neo"
                                }`}
                        >
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Rooms Tab */}
                {tab === "rooms" && (
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-blue">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Home className="w-5 h-5" /> Room Allocation
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black text-white text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-3">Block</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Room</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Student</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20 text-center">Status</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {ROOMS.map((room, i) => (
                                        <tr key={i} className="hover:bg-neo-bg transition-colors">
                                            <td className="px-6 py-4 font-black">{room.block}</td>
                                            <td className="px-6 py-4 font-mono font-bold">{room.room}</td>
                                            <td className="px-6 py-4 font-bold">{room.student || "—"}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${STATUS_COLORS[room.status]}`}>
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="border-2 border-black bg-white px-3 py-1 text-sm font-bold hover:bg-neo-blue transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                                    {room.status === "Vacant" ? "Allocate" : "Details"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Complaints Tab */}
                {tab === "complaints" && (
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-red">
                            <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Complaints
                            </h3>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {COMPLAINTS.map((c, i) => (
                                <div key={i} className="px-6 py-5 hover:bg-neo-bg transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-neo-purple border-2 border-black flex items-center justify-center text-white">
                                            <Wrench className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-black">{c.category} — <span className="font-mono">{c.room}</span></p>
                                            <p className="text-sm font-bold text-slate-500">{c.student} · {c.date}</p>
                                            <p className="text-xs font-mono font-bold text-slate-400">{c.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${STATUS_COLORS[c.status]} ${c.status === "Pending" ? "text-white" : ""}`}>
                                            {c.status}
                                        </span>
                                        {c.status !== "Resolved" && (
                                            <button className="border-2 border-black bg-neo-green px-4 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">
                                                <CheckCircle className="w-4 h-4 inline mr-1" /> Resolve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mess Menu Tab */}
                {tab === "mess" && (
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-yellow">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Utensils className="w-5 h-5" /> Weekly Mess Menu
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                            {MESS_MENU.map((meal, i) => (
                                <div key={i} className="p-6 hover:bg-neo-bg transition-colors">
                                    <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                        <h4 className={`font-black text-lg uppercase ${meal.color} inline-block px-2 border-2 border-black shadow-neo-sm`}>
                                            {meal.meal}
                                        </h4>
                                        <span className="text-xs font-bold bg-black text-white px-1">{meal.time}</span>
                                    </div>
                                    <ul className="text-sm space-y-3 font-bold">
                                        {meal.items.map((item, j) => (
                                            <li key={j} className="flex items-center gap-3">
                                                <span className="w-3 h-3 bg-black" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t-3 border-black bg-neo-bg">
                            <button className="bg-black text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-purple active:shadow-none active:translate-y-[2px] transition-all">
                                Edit Menu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
