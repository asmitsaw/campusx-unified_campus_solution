import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../utils/api";
import {
    Users, BookOpen, Calendar, ClipboardList, TrendingUp,
    Clock, CheckCircle, AlertTriangle, Building2, Loader2,
} from "lucide-react";
import WardenDashboard from "./WardenDashboard";

// ── Time-ago helper ───────────────────────────────────────────────────────────
function timeAgo(iso) {
    if (!iso) return "";
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHrs / 24);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

// ── Status color for applications ────────────────────────────────────────────
const STATUS_COLORS = {
    Applied: "bg-neo-blue",
    Shortlisted: "bg-neo-yellow",
    "Coding Round": "bg-neo-purple",
    Interview: "bg-orange-400",
    Selected: "bg-neo-green",
    Rejected: "bg-neo-primary",
};

// ── Static stats for non-TPO / non-librarian roles ───────────────────────────
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
    admin: [
        { label: "Total Users", value: "2,340", icon: Users, color: "bg-neo-blue" },
        { label: "Faculty Members", value: "86", icon: ClipboardList, color: "bg-neo-green" },
        { label: "Active Modules", value: "9", icon: CheckCircle, color: "bg-neo-purple" },
        { label: "System Alerts", value: "2", icon: AlertTriangle, color: "bg-neo-red" },
    ],
};

// ── Librarian: live book-request alerts ──────────────────────────────────────
function useLibrarianAlerts() {
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/library/requests");
                if (!res.ok) return;
                const data = await res.json();
                const colorMap = { pending: "bg-neo-yellow", approved: "bg-neo-green", rejected: "bg-neo-red" };
                setAlerts(
                    (Array.isArray(data) ? data : []).slice(0, 8).map((r) => ({
                        text: `📚 ${r.student_name || "A student"} requested "${r.title}"`,
                        time: timeAgo(r.requested_at),
                        color: colorMap[r.status] || "bg-neo-yellow",
                        status: r.status,
                    }))
                );
            } catch { }
        };
        fetchAlerts();
    }, []);
    return alerts;
}

// ── Librarian stats ───────────────────────────────────────────────────────────
function useLibrarianStats() {
    const [stats, setStats] = useState([
        { label: "Total Issued", value: "–", icon: BookOpen, color: "bg-neo-blue" },
        { label: "Issued Today", value: "–", icon: ClipboardList, color: "bg-neo-green" },
        { label: "Overdue", value: "–", icon: AlertTriangle, color: "bg-neo-red" },
        { label: "Pending Requests", value: "–", icon: Clock, color: "bg-neo-yellow" },
    ]);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [issuedRes, requestsRes] = await Promise.all([
                    fetch("http://localhost:5000/api/library/my-books"),
                    fetch("http://localhost:5000/api/library/requests"),
                ]);
                const issued = issuedRes.ok ? await issuedRes.json() : [];
                const requests = requestsRes.ok ? await requestsRes.json() : [];
                const now = new Date(), todayStr = now.toDateString();
                setStats([
                    { label: "Total Issued", value: String(Array.isArray(issued) ? issued.length : 0), icon: BookOpen, color: "bg-neo-blue" },
                    { label: "Issued Today", value: String(Array.isArray(issued) ? issued.filter(b => new Date(b.issue_date).toDateString() === todayStr).length : 0), icon: ClipboardList, color: "bg-neo-green" },
                    { label: "Overdue", value: String(Array.isArray(issued) ? issued.filter(b => new Date(b.due_date) < now).length : 0), icon: AlertTriangle, color: "bg-neo-red" },
                    { label: "Pending Requests", value: String(Array.isArray(requests) ? requests.filter(r => r.status === "pending").length : 0), icon: Clock, color: "bg-neo-yellow" },
                ]);
            } catch { }
        };
        fetchStats();
    }, []);
    return stats;
}

// ── TPO: live placement data ──────────────────────────────────────────────────
function useTpoData() {
    const [tpoStats, setTpoStats] = useState(null);
    const [todaySessions, setTodaySessions] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const errs = [];

            // Fetch each independently so one failure doesn't kill the rest
            try {
                const s = await apiGet("/placements/stats");
                setTpoStats(s.data);
            } catch (e) {
                console.error("[Dashboard] stats failed:", e.message);
                errs.push("stats");
            }

            try {
                const t = await apiGet("/placements/training-sessions");
                const sessions = t.data || [];
                const todayStr = new Date().toISOString().split("T")[0];
                // Prefer today's sessions; fall back to ALL upcoming if none today
                const todayOnly = sessions.filter(s => s.date && s.date.startsWith(todayStr));
                const upcoming = sessions.filter(s => !s.date || s.date >= todayStr);
                setTodaySessions(todayOnly.length > 0 ? todayOnly : upcoming.slice(0, 5));
            } catch (e) {
                console.error("[Dashboard] training-sessions failed:", e.message);
                errs.push("sessions");
            }

            try {
                const a = await apiGet("/placements/recent-activity");
                const activityItems = (a.data || []).map(item => ({
                    text: `${item.student_name} applied to ${item.company} — ${item.role}`,
                    badge: item.status,
                    time: timeAgo(item.created_at),
                    color: STATUS_COLORS[item.status] || "bg-neo-blue",
                }));
                setActivity(activityItems);
            } catch (e) {
                console.error("[Dashboard] recent-activity failed:", e.message);
                errs.push("activity");
            }

            setErrors(errs);
            setLoading(false);
        };
        load();
    }, []);

    return { tpoStats, todaySessions, activity, loading, errors };
}


// ── Component ─────────────────────────────────────────────────────────────────
export default function FacultyDashboard() {
    const { user } = useAuth();
    const role = user?.role || "faculty";

    if (role === "hostel_warden") return <WardenDashboard />;

    const librarianStats = useLibrarianStats();
    const librarianAlerts = useLibrarianAlerts();
    const { tpoStats, todaySessions, activity: tpoActivity, loading: tpoLoading, errors: tpoErrors } = useTpoData();

    // ── Build stats array ──────────────────────────────────────────────────────
    let stats;
    if (role === "librarian") {
        stats = librarianStats;
    } else if (role === "tpo" || role === "admin") {
        stats = [
            { label: "Companies Visiting", value: tpoLoading ? "…" : String(tpoStats?.companies_visiting ?? "–"), icon: Building2, color: "bg-neo-purple" },
            { label: "Students Placed", value: tpoLoading ? "…" : String(tpoStats?.students_placed ?? "–"), icon: CheckCircle, color: "bg-neo-green" },
            { label: "Active Drives", value: tpoLoading ? "…" : String(tpoStats?.active_drives ?? "–"), icon: Calendar, color: "bg-neo-blue" },
            { label: "Avg. Package", value: tpoLoading ? "…" : `${tpoStats?.avg_package ?? "–"} LPA`, icon: TrendingUp, color: "bg-neo-yellow" },
        ];
    } else {
        stats = ROLE_STATS[role] || ROLE_STATS.faculty;
    }

    // ── Today's schedule ───────────────────────────────────────────────────────
    const isTPO = role === "tpo" || role === "admin";
    const scheduleItems = todaySessions.map(s => ({
        time: s.time ? formatTime(s.time) : "TBD",
        title: s.title,
        location: s.venue || "—",
        type: s.type,
    }));

    // ── Recent activity ────────────────────────────────────────────────────────
    const activity = role === "librarian"
        ? librarianAlerts
        : isTPO
            ? tpoActivity
            : [];

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter"
                            style={{ textShadow: "2px 2px 0px #A259FF" }}>
                            Dashboard
                        </h1>
                        <p className="text-sm font-bold text-slate-600 mt-1">
                            Welcome back, {user?.name || "User"} 👋
                        </p>
                    </div>
                    <div className="bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-black text-sm uppercase">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                    </div>
                </div>

                {/* Error banner for TPO — visible if any API call failed */}
                {isTPO && tpoErrors.length > 0 && (
                    <div className="bg-orange-400 border-3 border-black px-5 py-3 shadow-neo-sm flex items-center gap-3 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>
                            Some data failed to load ({tpoErrors.join(", ")}).
                            Check browser console (F12) for details. Make sure backend is running and Supabase tables exist.
                        </span>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.color} border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform`}>
                            <div className="flex justify-between items-start mb-3">
                                <stat.icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                            </div>
                            <p className="text-xs font-black uppercase text-black/70 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-black" style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.5)" }}>
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
                                <h3 className="text-xl font-black text-black uppercase italic">Today's Schedule</h3>
                            </div>
                            <span className="text-xs font-black border-2 border-black bg-white px-3 py-1 shadow-neo-sm uppercase">
                                {isTPO ? "Training Sessions" : "Classes"}
                            </span>
                        </div>

                        {isTPO && tpoLoading ? (
                            <div className="flex items-center justify-center py-12 gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="font-bold uppercase text-sm text-gray-500">Loading sessions...</span>
                            </div>
                        ) : scheduleItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                                <Calendar className="w-10 h-10 opacity-20" />
                                <p className="font-black uppercase text-sm">
                                    {isTPO ? "No training sessions today" : "No classes scheduled"}
                                </p>
                                {isTPO && (
                                    <p className="text-xs font-bold">Post a session from Manage Placements → Post Training</p>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-black">
                                {scheduleItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 px-6 py-5 hover:bg-neo-bg transition-colors group">
                                        <div className="bg-black text-white px-3 py-2 border-2 border-black font-mono font-black text-sm min-w-[100px] text-center shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                            {item.time}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-lg leading-tight truncate">{item.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-sm font-bold text-slate-500">📍 {item.location}</p>
                                                {item.type && (
                                                    <span className="text-[10px] font-black uppercase border border-black bg-neo-cyan px-1.5">
                                                        {item.type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-green transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className={`px-6 py-4 border-b-3 border-black ${role === "librarian" ? "bg-neo-red" : "bg-neo-yellow"}`}>
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {role === "librarian" ? "Book Request Alerts" : "Recent Activity"}
                            </h3>
                        </div>

                        {isTPO && tpoLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                <span className="font-bold text-sm text-gray-500">Loading activity...</span>
                            </div>
                        ) : activity.length === 0 ? (
                            <div className="px-5 py-8 text-center font-bold text-slate-400 uppercase text-sm">
                                {isTPO ? "No applications yet" : "No recent activity"}
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-black max-h-[480px] overflow-y-auto">
                                {activity.map((item, i) => (
                                    <div key={i} className="px-5 py-4 hover:bg-neo-bg transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-3 h-3 ${item.color} border-2 border-black mt-1.5 shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-black leading-snug">{item.text}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <p className="text-xs font-bold text-slate-400">{item.time}</p>
                                                    {(item.badge || item.status) && (
                                                        <span className={`text-[10px] font-black uppercase px-1.5 border border-black
                                                            ${STATUS_COLORS[item.badge || item.status] || "bg-neo-blue"}`}>
                                                            {item.badge || item.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Util: convert "HH:MM" → "09:00 AM" ──────────────────────────────────────
function formatTime(t) {
    if (!t) return "TBD";
    try {
        const [h, m] = t.split(":").map(Number);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
    } catch { return t; }
}
