import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
    Users,
    BookOpen,
    Calendar,
    ClipboardList,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

const ROLE_STATS = {
    faculty: [
        { label: "Total Students", value: "342", icon: Users, color: "bg-neo-blue" },
        { label: "Classes Today", value: "4", icon: Calendar, color: "bg-neo-green" },
        { label: "Pending Reviews", value: "12", icon: ClipboardList, color: "bg-neo-yellow" },
        { label: "Avg. Attendance", value: "87%", icon: TrendingUp, color: "bg-neo-purple" },
    ],
    event_manager: [
        { label: "Active Events", value: "8", icon: Calendar, color: "bg-neo-purple" },
        { label: "Registrations", value: "1,247", icon: Users, color: "bg-neo-blue" },
        { label: "Upcoming", value: "3", icon: Clock, color: "bg-neo-green" },
        { label: "Completed", value: "24", icon: CheckCircle, color: "bg-neo-yellow" },
    ],
    librarian: [
        { label: "Total Books", value: "12,450", icon: BookOpen, color: "bg-neo-blue" },
        { label: "Issued Today", value: "34", icon: ClipboardList, color: "bg-neo-green" },
        { label: "Overdue", value: "17", icon: AlertTriangle, color: "bg-neo-red" },
        { label: "New Arrivals", value: "45", icon: TrendingUp, color: "bg-neo-purple" },
    ],
    hostel_warden: [
        { label: "Total Residents", value: "580", icon: Users, color: "bg-neo-blue" },
        { label: "Open Complaints", value: "7", icon: AlertTriangle, color: "bg-neo-red" },
        { label: "Rooms Occupied", value: "290", icon: CheckCircle, color: "bg-neo-green" },
        { label: "Check-outs Today", value: "3", icon: Clock, color: "bg-neo-yellow" },
    ],
    tpo: [
        { label: "Companies Visiting", value: "18", icon: Users, color: "bg-neo-purple" },
        { label: "Students Placed", value: "156", icon: CheckCircle, color: "bg-neo-green" },
        { label: "Active Drives", value: "5", icon: Calendar, color: "bg-neo-blue" },
        { label: "Avg. Package", value: "8.5 LPA", icon: TrendingUp, color: "bg-neo-yellow" },
    ],
    admin: [
        { label: "Total Users", value: "2,340", icon: Users, color: "bg-neo-blue" },
        { label: "Faculty Members", value: "86", icon: ClipboardList, color: "bg-neo-green" },
        { label: "Active Modules", value: "9", icon: CheckCircle, color: "bg-neo-purple" },
        { label: "System Alerts", value: "2", icon: AlertTriangle, color: "bg-neo-red" },
    ],
};

const RECENT_ACTIVITY = [
    { text: "New student registration — Priya Sharma (CSE)", time: "2 min ago", color: "bg-neo-blue" },
    { text: "Attendance marked for DSA Lab — Section A", time: "15 min ago", color: "bg-neo-green" },
    { text: "Library fine collected — ₹150 from Rahul K.", time: "1 hr ago", color: "bg-neo-yellow" },
    { text: "Hostel complaint resolved — Room B-204", time: "2 hrs ago", color: "bg-neo-purple" },
    { text: "TCS placement drive registration open", time: "3 hrs ago", color: "bg-neo-cyan" },
];

const TODAY_SCHEDULE = [
    { time: "09:00 AM", title: "Data Structures — Section A", location: "Room 301" },
    { time: "11:00 AM", title: "Operating Systems — Section B", location: "Lab 204" },
    { time: "02:00 PM", title: "Faculty Meeting", location: "Conference Hall" },
    { time: "04:00 PM", title: "Project Reviews — Final Year", location: "Room 105" },
];

export default function FacultyDashboard() {
    const { user } = useAuth();
    const role = user?.role || "faculty";
    const stats = ROLE_STATS[role] || ROLE_STATS.faculty;

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1
                            className="text-4xl font-black uppercase italic tracking-tighter"
                            style={{ textShadow: "2px 2px 0px #A259FF" }}
                        >
                            Dashboard
                        </h1>
                        <p className="text-sm font-bold text-slate-600 mt-1">
                            Welcome back, {user?.name || "User"} 👋
                        </p>
                    </div>
                    <div className="bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-black text-sm uppercase">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`${stat.color} border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <stat.icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                            </div>
                            <p className="text-xs font-black uppercase text-black/70 mb-1">
                                {stat.label}
                            </p>
                            <p
                                className="text-3xl font-black text-black"
                                style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.5)" }}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Schedule */}
                    <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                        <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-blue">
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-white p-1 border-2 border-white shadow-sm">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-black uppercase italic">
                                    Today's Schedule
                                </h3>
                            </div>
                            <button className="text-sm font-bold text-black border-2 border-black bg-white px-3 py-1 hover:bg-black hover:text-white transition-colors shadow-neo-sm">
                                View All
                            </button>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {TODAY_SCHEDULE.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-6 px-6 py-5 hover:bg-neo-bg transition-colors group"
                                >
                                    <div className="bg-black text-white px-3 py-2 border-2 border-black font-mono font-black text-sm min-w-[100px] text-center shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                        {item.time}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-lg">{item.title}</p>
                                        <p className="text-sm font-bold text-slate-500">
                                            📍 {item.location}
                                        </p>
                                    </div>
                                    <button className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-green transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-yellow">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Recent Activity
                            </h3>
                        </div>
                        <div className="divide-y-2 divide-black">
                            {RECENT_ACTIVITY.map((item, i) => (
                                <div
                                    key={i}
                                    className="px-5 py-4 hover:bg-neo-bg transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-3 h-3 ${item.color} border-2 border-black mt-1.5 shrink-0`}
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-black">{item.text}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-1">
                                                {item.time}
                                            </p>
                                        </div>
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
