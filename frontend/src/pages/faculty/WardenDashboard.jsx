import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../utils/api";
import {
    Users,
    Home,
    AlertTriangle,
    CheckCircle,
    Clock,
    Wrench,
    Utensils,
    TrendingUp,
    BedDouble,
} from "lucide-react";

const STATUS_COLORS = {
    Pending: "bg-neo-red text-white",
    "In Progress": "bg-neo-yellow text-black",
    Resolved: "bg-neo-green text-black",
};

export default function WardenDashboard() {
    const { user } = useAuth();

    const [rooms, setRooms] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [messMenu, setMessMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const today = days[new Date().getDay()];
            const [roomRes, compRes, messRes] = await Promise.all([
                apiGet("/hostel/rooms"),
                apiGet("/hostel/complaints"),
                apiGet(`/hostel/mess?day=${today}`),
            ]);
            setRooms(roomRes.data || []);
            setComplaints(compRes.data || []);
            setMessMenu(messRes.data || []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    // Computed stats
    const totalRooms = rooms.length;
    const occupied = rooms.filter(r => r.status === "Occupied").length;
    const vacant = rooms.filter(r => r.status === "Vacant").length;
    const maintenance = rooms.filter(r => r.status === "Maintenance").length;
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === "Pending").length;
    const inProgressComplaints = complaints.filter(c => c.status === "In Progress").length;
    const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;
    const recentComplaints = complaints.slice(0, 6);

    const stats = [
        { label: "Total Rooms", value: String(totalRooms), icon: Home, color: "bg-neo-blue" },
        { label: "Occupied", value: String(occupied), icon: BedDouble, color: "bg-neo-green" },
        { label: "Vacant", value: String(vacant), icon: CheckCircle, color: "bg-neo-yellow" },
        { label: "Open Complaints", value: String(pendingComplaints + inProgressComplaints), icon: AlertTriangle, color: "bg-neo-red" },
    ];

    const MEAL_COLORS = { Breakfast: "bg-neo-green", Lunch: "bg-neo-yellow", Snacks: "bg-neo-pink", Dinner: "bg-neo-blue" };

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter" style={{ textShadow: "2px 2px 0px #fbef23" }}>
                            Warden Dashboard
                        </h1>
                        <p className="text-sm font-bold text-slate-600 mt-1">
                            Welcome back, {user?.name || "Warden"} 👋
                        </p>
                    </div>
                    <div className="bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-black text-sm uppercase">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                    </div>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white border-3 border-black p-5 shadow-neo animate-pulse h-28" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className={`${stat.color} border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform`}>
                                <div className="flex justify-between items-start mb-3">
                                    <stat.icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                                </div>
                                <p className="text-xs font-black uppercase text-black/70 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-black" style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.5)" }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Secondary Stats Row */}
                {!loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white border-3 border-black p-4 shadow-neo-sm">
                            <p className="text-xs font-black uppercase text-black/60 mb-1">Occupancy Rate</p>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-black">{occupancyRate}%</p>
                                <TrendingUp className="w-4 h-4 text-neo-green mb-1" />
                            </div>
                            <div className="w-full bg-gray-200 border border-black h-2 mt-2">
                                <div className="bg-neo-green h-full border-r border-black transition-all" style={{ width: `${occupancyRate}%` }} />
                            </div>
                        </div>
                        <div className="bg-white border-3 border-black p-4 shadow-neo-sm">
                            <p className="text-xs font-black uppercase text-black/60 mb-1">Maintenance</p>
                            <p className="text-2xl font-black">{maintenance}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">rooms under repair</p>
                        </div>
                        <div className="bg-white border-3 border-black p-4 shadow-neo-sm">
                            <p className="text-xs font-black uppercase text-black/60 mb-1">In Progress</p>
                            <p className="text-2xl font-black text-neo-yellow" style={{ textShadow: "1px 1px 0px #000" }}>{inProgressComplaints}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">complaints being handled</p>
                        </div>
                        <div className="bg-white border-3 border-black p-4 shadow-neo-sm">
                            <p className="text-xs font-black uppercase text-black/60 mb-1">Resolved</p>
                            <p className="text-2xl font-black text-neo-green" style={{ textShadow: "1px 1px 0px #000" }}>{resolvedComplaints}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">complaints closed</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Complaints */}
                    <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                        <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-red">
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-white p-1 border-2 border-white shadow-sm">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic">Recent Complaints</h3>
                            </div>
                            <span className="bg-white border-2 border-black px-3 py-1 text-xs font-black">{totalComplaints} TOTAL</span>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center font-bold text-slate-400">Loading...</div>
                        ) : recentComplaints.length === 0 ? (
                            <div className="p-12 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-neo-green" />
                                <p className="text-lg font-black text-slate-400 uppercase">No complaints! 🎉</p>
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-black">
                                {recentComplaints.map((c, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-neo-bg transition-colors">
                                        <div className="w-10 h-10 bg-neo-purple border-2 border-black flex items-center justify-center text-white shrink-0">
                                            <Wrench className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm truncate">{c.category} — <span className="font-mono">{c.room_no}</span></p>
                                            <p className="text-xs font-bold text-slate-400">{c.student_name} · {new Date(c.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm shrink-0 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Today's Mess */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-yellow">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Utensils className="w-5 h-5" /> Today's Mess
                            </h3>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center font-bold text-slate-400">Loading...</div>
                        ) : messMenu.length === 0 ? (
                            <div className="p-8 text-center font-bold text-slate-400 uppercase text-sm">No menu set for today</div>
                        ) : (
                            <div className="divide-y-2 divide-black">
                                {messMenu.map((meal, i) => (
                                    <div key={i} className="px-5 py-4 hover:bg-neo-bg transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`font-black uppercase text-sm ${MEAL_COLORS[meal.meal] || "bg-neo-blue"} px-2 py-0.5 border-2 border-black shadow-neo-sm`}>{meal.meal}</span>
                                            <span className="text-[10px] font-bold bg-black text-white px-1">{meal.time_slot}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-600">{meal.items.join(", ")}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Block Distribution */}
                {!loading && rooms.length > 0 && (
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-blue">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Home className="w-5 h-5" /> Block-wise Distribution
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                            {Object.entries(
                                rooms.reduce((acc, r) => {
                                    if (!acc[r.block]) acc[r.block] = { total: 0, occupied: 0, vacant: 0 };
                                    acc[r.block].total++;
                                    if (r.status === "Occupied") acc[r.block].occupied++;
                                    if (r.status === "Vacant") acc[r.block].vacant++;
                                    return acc;
                                }, {})
                            ).map(([block, data]) => (
                                <div key={block} className="p-5 hover:bg-neo-bg transition-colors">
                                    <h4 className="font-black text-lg uppercase mb-3">{block}</h4>
                                    <div className="space-y-2 text-sm font-bold">
                                        <div className="flex justify-between">
                                            <span>Total</span>
                                            <span className="bg-black text-white px-2 text-xs font-black">{data.total}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neo-green">Occupied</span>
                                            <span>{data.occupied}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neo-blue">Vacant</span>
                                            <span>{data.vacant}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
