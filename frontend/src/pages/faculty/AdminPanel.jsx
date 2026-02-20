import React, { useState } from "react";
import { ShieldCheck, Users, Plus, Edit, Trash2, Search, Settings, Activity } from "lucide-react";

const USERS_DATA = [
    { id: 1, name: "Dr. S. K. Gupta", email: "skgupta@campusx.edu", role: "hostel_warden", status: "Active", lastLogin: "Feb 20, 2026" },
    { id: 2, name: "Prof. R. Kumar", email: "rkumar@campusx.edu", role: "faculty", status: "Active", lastLogin: "Feb 20, 2026" },
    { id: 3, name: "Ms. Priya Nair", email: "pnair@campusx.edu", role: "librarian", status: "Active", lastLogin: "Feb 19, 2026" },
    { id: 4, name: "Mr. Arvind Joshi", email: "ajoshi@campusx.edu", role: "tpo", status: "Active", lastLogin: "Feb 20, 2026" },
    { id: 5, name: "Ms. Kavita Mehta", email: "kmehta@campusx.edu", role: "event_manager", status: "Active", lastLogin: "Feb 18, 2026" },
    { id: 6, name: "Admin User", email: "admin@campusx.edu", role: "admin", status: "Active", lastLogin: "Feb 20, 2026" },
    { id: 7, name: "Aarav Patel", email: "aarav@campusx.edu", role: "student", status: "Active", lastLogin: "Feb 20, 2026" },
    { id: 8, name: "Rahul Kumar", email: "rahulk@campusx.edu", role: "student", status: "Suspended", lastLogin: "Jan 15, 2026" },
];

const ROLE_LABELS = {
    student: "Student",
    faculty: "Faculty",
    event_manager: "Event Mgr",
    librarian: "Librarian",
    hostel_warden: "Warden",
    tpo: "TPO",
    admin: "Admin",
};

const ROLE_COLORS = {
    student: "bg-neo-blue",
    faculty: "bg-neo-green",
    event_manager: "bg-neo-purple",
    librarian: "bg-neo-cyan",
    hostel_warden: "bg-neo-yellow",
    tpo: "bg-neo-pink",
    admin: "bg-neo-red text-white",
};

const SYSTEM_STATS = [
    { label: "Total Users", value: "2,340", color: "bg-neo-blue" },
    { label: "Faculty", value: "86", color: "bg-neo-green" },
    { label: "Students", value: "2,248", color: "bg-neo-purple" },
    { label: "System Health", value: "99.8%", color: "bg-neo-cyan" },
];

export default function AdminPanel() {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [filterRole, setFilterRole] = useState("All");

    const filtered = USERS_DATA.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === "All" || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #FF5252" }}
                    >
                        Admin Panel
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-neo-red text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add User
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {SYSTEM_STATS.map((stat, i) => (
                        <div key={i} className={`${stat.color} border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform`}>
                            <p className="text-xs font-black uppercase text-black/70 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Create User Form */}
                {showForm && (
                    <div className="bg-white border-3 border-black shadow-neo p-6">
                        <h3 className="text-xl font-black uppercase mb-6 border-b-3 border-black pb-3">Create New User</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Full Name</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="Enter name" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Email</label>
                                <input type="email" className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="user@campusx.edu" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Password</label>
                                <input type="password" className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Role</label>
                                <select className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white">
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="event_manager">Event Manager</option>
                                    <option value="librarian">Librarian</option>
                                    <option value="hostel_warden">Hostel Warden</option>
                                    <option value="tpo">T&P Officer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button className="bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-red transition-colors active:shadow-none active:translate-y-[2px]">
                                Create User
                            </button>
                            <button onClick={() => setShowForm(false)} className="bg-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg active:shadow-none active:translate-y-[2px] transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* User Management Table */}
                <div className="bg-white border-3 border-black shadow-neo">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-red gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-1 border-2 border-white">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic">User Management</h3>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1 md:w-56">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border-2 border-black pl-9 pr-3 py-2 text-sm font-bold outline-none shadow-neo-sm"
                                    placeholder="Search users..."
                                />
                            </div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="border-2 border-black bg-white px-3 py-2 text-sm font-bold shadow-neo-sm"
                            >
                                <option>All</option>
                                <option value="student">Students</option>
                                <option value="faculty">Faculty</option>
                                <option value="event_manager">Event Mgr</option>
                                <option value="librarian">Librarian</option>
                                <option value="hostel_warden">Warden</option>
                                <option value="tpo">TPO</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20">Email</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20 text-center">Role</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20 text-center">Status</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20">Last Login</th>
                                    <th className="px-6 py-3 border-l-2 border-white/20 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {filtered.map((user) => (
                                    <tr key={user.id} className="hover:bg-neo-bg transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-neo-purple border-2 border-black flex items-center justify-center text-white font-black text-sm shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                </div>
                                                <p className="font-black">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-sm">{user.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${ROLE_COLORS[user.role]}`}>
                                                {ROLE_LABELS[user.role]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center border-2 border-black px-2 py-0.5 text-xs font-black uppercase ${user.status === "Active" ? "bg-neo-green" : "bg-neo-red text-white"}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm">{user.lastLogin}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="border-2 border-black bg-white p-1.5 hover:bg-neo-blue transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="border-2 border-black bg-white p-1.5 hover:bg-neo-red hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
