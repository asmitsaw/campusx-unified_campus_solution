import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../utils/api";
import {
    Users, BookOpen, Calendar, ClipboardList, TrendingUp,
    Clock, CheckCircle, AlertTriangle, Building2, Loader2, ChevronLeft, ChevronRight,
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

function formatTime(t) {
    if (!t) return "TBD";
    try {
        const [h, m] = t.split(":").map(Number);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
    } catch { return t; }
}

const TYPE_COLORS = {
    Lecture: "bg-neo-blue",
    Lab: "bg-neo-green",
    Tutorial: "bg-neo-yellow",
};

const STATUS_COLORS_TPO = {
    Applied: "bg-neo-blue",
    Shortlisted: "bg-neo-yellow",
    "Coding Round": "bg-neo-purple",
    Interview: "bg-orange-400",
    Selected: "bg-neo-green",
    Rejected: "bg-red-400",
};

// ── Static stats for non-TPO / non-librarian roles ───────────────────────────
const ROLE_STATS_STATIC = {
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

// ── Librarian hooks ───────────────────────────────────────────────────────────
function useLibrarianAlerts() {
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/library/requests")
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const colorMap = { pending: "bg-neo-yellow", approved: "bg-neo-green", rejected: "bg-neo-red" };
                setAlerts((Array.isArray(data) ? data : []).slice(0, 8).map(r => ({
                    text: `📚 ${r.student_name || "A student"} requested "${r.title}"`,
                    time: timeAgo(r.requested_at),
                    color: colorMap[r.status] || "bg-neo-yellow",
                    status: r.status,
                })));
            }).catch(() => { });
    }, []);
    return alerts;
}

function useLibrarianStats() {
    const [stats, setStats] = useState([
        { label: "Total Issued", value: "–", icon: BookOpen, color: "bg-neo-blue" },
        { label: "Issued Today", value: "–", icon: ClipboardList, color: "bg-neo-green" },
        { label: "Overdue", value: "–", icon: AlertTriangle, color: "bg-neo-red" },
        { label: "Pending Requests", value: "–", icon: Clock, color: "bg-neo-yellow" },
    ]);
    useEffect(() => {
        Promise.all([
            fetch("http://localhost:5000/api/library/my-books").then(r => r.ok ? r.json() : []),
            fetch("http://localhost:5000/api/library/requests").then(r => r.ok ? r.json() : []),
        ]).then(([issued, requests]) => {
            const now = new Date(), todayStr = now.toDateString();
            setStats([
                { label: "Total Issued", value: String(Array.isArray(issued) ? issued.length : 0), icon: BookOpen, color: "bg-neo-blue" },
                { label: "Issued Today", value: String(Array.isArray(issued) ? issued.filter(b => new Date(b.issue_date).toDateString() === todayStr).length : 0), icon: ClipboardList, color: "bg-neo-green" },
                { label: "Overdue", value: String(Array.isArray(issued) ? issued.filter(b => new Date(b.due_date) < now).length : 0), icon: AlertTriangle, color: "bg-neo-red" },
                { label: "Pending Requests", value: String(Array.isArray(requests) ? requests.filter(r => r.status === "pending").length : 0), icon: Clock, color: "bg-neo-yellow" },
            ]);
        }).catch(() => { });
    }, []);
    return stats;
}

// ── TPO hook ─────────────────────────────────────────────────────────────────
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
            try {
                const s = await apiGet("/placements/stats");
                setTpoStats(s.data);
            } catch (e) { console.error("[TPO stats]", e.message); errs.push("stats"); }

            try {
                const t = await apiGet("/placements/training-sessions");
                const sessions = t.data || [];
                const todayStr = new Date().toISOString().split("T")[0];
                const todayOnly = sessions.filter(s => s.date && s.date.startsWith(todayStr));
                const upcoming = sessions.filter(s => !s.date || s.date >= todayStr);
                setTodaySessions(todayOnly.length > 0 ? todayOnly : upcoming.slice(0, 5));
            } catch (e) { console.error("[TPO sessions]", e.message); errs.push("sessions"); }

            try {
                const a = await apiGet("/placements/recent-activity");
                setActivity((a.data || []).map(item => ({
                    text: `${item.student_name} applied to ${item.company} — ${item.role}`,
                    badge: item.status,
                    time: timeAgo(item.created_at),
                    color: STATUS_COLORS_TPO[item.status] || "bg-neo-blue",
                })));
            } catch (e) { console.error("[TPO activity]", e.message); errs.push("activity"); }

            setErrors(errs);
            setLoading(false);
        };
        load();
    }, []);

    return { tpoStats, todaySessions, activity, loading, errors };
}

// ── Event Manager: live stats, schedule & activity ─────────────────────────
function useEventManagerData() {
    const [stats, setStats] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, schedRes, actRes] = await Promise.all([
                    fetch("http://localhost:5000/api/ev-events/stats"),
                    fetch("http://localhost:5000/api/ev-events/schedule"),
                    fetch("http://localhost:5000/api/ev-events/activity")
                ]);
                
                if (statsRes.ok) {
                    const d = await statsRes.json();
                    setStats([
                        { label: "Active Events", value: String(d.active), icon: Calendar, color: "bg-neo-purple" },
                        { label: "Registrations", value: String(d.registrations), icon: Users, color: "bg-neo-blue" },
                        { label: "Upcoming", value: String(d.upcoming), icon: Clock, color: "bg-neo-green" },
                        { label: "Completed", value: String(d.completed), icon: CheckCircle, color: "bg-neo-yellow" },
                    ]);
                }
                if (schedRes.ok) {
                    const d = await schedRes.json();
                    setSchedule(d.map(ev => ({
                        time: ev.time_start,
                        title: ev.title,
                        location: ev.venue,
                        type: ev.category
                    })));
                }
                if (actRes.ok) {
                    const d = await actRes.json();
                    setActivity(d.map(item => ({
                        text: item.text,
                        time: timeAgo(item.time),
                        status: item.status,
                        color: "bg-neo-blue"
                    })));
                }
            } catch { } finally { setLoading(false); }
        };
        load();
    }, []);
    return { stats, schedule, activity, loading };
}

// ── Faculty hook ──────────────────────────────────────────────────────────────
function useFacultyData(selectedDate) {
    const [schedule, setSchedule] = useState([]);
    const [monthDates, setMonthDates] = useState({}); // { "2026-02-20": [sessions] }
    const [recentActivity, setRecentActivity] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 30, classesToday: 0, pending: 0, avgAttendance: "–" });
    const [loading, setLoading] = useState(true);

    // Fetch month schedule once
    useEffect(() => {
        const now = new Date();
        apiGet(`/attendance/schedule/month?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
            .then(r => {
                const grouped = {};
                (r.data || []).forEach(s => {
                    if (!grouped[s.date]) grouped[s.date] = [];
                    grouped[s.date].push(s);
                });
                setMonthDates(grouped);
                setStats(prev => ({ ...prev, classesToday: (grouped[now.toISOString().split("T")[0]] || []).length }));
            })
            .catch(e => console.error("[Faculty month]", e.message));
    }, []);

    // Fetch schedule for selected date
    useEffect(() => {
        setLoading(true);
        apiGet(`/attendance/schedule?date=${selectedDate}`)
            .then(r => setSchedule(r.data || []))
            .catch(e => console.error("[Faculty schedule]", e.message))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    // Fetch recent attendance activity
    useEffect(() => {
        apiGet("/attendance/recent")
            .then(r => {
                setRecentActivity(r.data || []);
                if (r.data && r.data.length > 0) {
                    const totalPresent = r.data.reduce((acc, s) => acc + s.present, 0);
                    const totalAll = r.data.reduce((acc, s) => acc + s.total, 0);
                    const avg = totalAll > 0 ? Math.round((totalPresent / totalAll) * 100) : 0;
                    setStats(prev => ({ ...prev, avgAttendance: `${avg}%` }));
                }
            })
            .catch(e => console.error("[Faculty recent]", e.message));
    }, []);

    return { schedule, monthDates, recentActivity, stats, loading };
}

// ── Mini calendar component ───────────────────────────────────────────────────
function MiniCalendar({ selectedDate, onSelect, markedDates }) {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="bg-white border-3 border-black shadow-neo select-none">
            {/* Month header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neo-purple border-b-3 border-black">
                <button onClick={prevMonth} className="p-1 hover:bg-black/20 rounded transition-colors">
                    <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <span className="font-black text-white uppercase text-sm">{MONTHS[month]} {year}</span>
                <button onClick={nextMonth} className="p-1 hover:bg-black/20 rounded transition-colors">
                    <ChevronRight className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 border-b-2 border-black">
                {DAYS.map((d, i) => (
                    <div key={i} className="text-center py-1.5 text-[10px] font-black uppercase text-slate-500">{d}</div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 p-2 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    const hasClasses = !!markedDates[dateStr];

                    return (
                        <button
                            key={day}
                            onClick={() => onSelect(dateStr)}
                            className={`relative w-8 h-8 text-xs font-black flex items-center justify-center transition-all
                                ${isSelected ? "bg-black text-white border-2 border-black shadow-neo-sm" :
                                    isToday ? "bg-neo-yellow border-2 border-black" :
                                        "hover:bg-neo-bg border border-transparent hover:border-black"}
                            `}
                        >
                            {day}
                            {hasClasses && !isSelected && (
                                <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-neo-green border border-black rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FacultyDashboard() {
    const { user } = useAuth();
    const role = user?.role || "faculty";

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    if (role === "hostel_warden") return <WardenDashboard />;

    const librarianStats = useLibrarianStats();
    const librarianAlerts = useLibrarianAlerts();
    const { tpoStats, todaySessions, activity: tpoActivity, loading: tpoLoading, errors: tpoErrors } = useTpoData();
    const { schedule: facultySchedule, monthDates, recentActivity, stats: facStats, loading: facLoading } = useFacultyData(selectedDate);
    const { stats: evStats, schedule: evSchedule, activity: evActivity, loading: evLoading } = useEventManagerData();

    const isFaculty = role === "faculty";
    const isTPO = role === "tpo";
    const isEM = role === "event_manager";

    // ── Build stats ────────────────────────────────────────────────────────────
    let stats;
    if (role === "librarian") {
        stats = librarianStats;
    } else if (isEM) {
        stats = evStats || ROLE_STATS_STATIC.event_manager;
    } else if (isTPO) {
        stats = [
            { label: "Companies Visiting", value: tpoLoading ? "…" : String(tpoStats?.companies_visiting ?? "–"), icon: Building2, color: "bg-neo-purple" },
            { label: "Students Placed", value: tpoLoading ? "…" : String(tpoStats?.students_placed ?? "–"), icon: CheckCircle, color: "bg-neo-green" },
            { label: "Active Drives", value: tpoLoading ? "…" : String(tpoStats?.active_drives ?? "–"), icon: Calendar, color: "bg-neo-blue" },
            { label: "Avg. Package", value: tpoLoading ? "…" : `${tpoStats?.avg_package ?? "–"} LPA`, icon: TrendingUp, color: "bg-neo-yellow" },
        ];
    } else if (isFaculty) {
        stats = [
            { label: "Total Students", value: "30", icon: Users, color: "bg-neo-blue" },
            { label: "Classes Today", value: String(facStats.classesToday), icon: Calendar, color: "bg-neo-green" },
            { label: "Pending Reviews", value: "–", icon: ClipboardList, color: "bg-neo-yellow" },
            { label: "Avg. Attendance", value: facStats.avgAttendance, icon: TrendingUp, color: "bg-neo-purple" },
        ];
    } else {
        stats = ROLE_STATS_STATIC[role] || ROLE_STATS_STATIC.admin;
    }

    // ── Recent activity feed ───────────────────────────────────────────────────
    let activityFeed = [];
    if (role === "librarian") {
        activityFeed = librarianAlerts;
    } else if (isEM) {
        activityFeed = evActivity;
    } else if (isTPO) {
        activityFeed = tpoActivity;
    } else if (isFaculty) {
        activityFeed = recentActivity.map(r => ({
            text: `${r.subject} (${r.type}) — Sec ${r.section}`,
            sub: `${r.present}/${r.total} present`,
            time: timeAgo(r.marked_at),
            pct: r.total > 0 ? Math.round((r.present / r.total) * 100) : 0,
            date: r.date,
        }));
    }

    const isLoading = (isFaculty && facLoading) || (isTPO && tpoLoading);

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter"
                            style={{ textShadow: "2px 2px 0px #A259FF" }}>Dashboard</h1>
                        <p className="text-sm font-bold text-slate-600 mt-1">Welcome back, {user?.name || "User"} 👋</p>
                    </div>
                    <div className="bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-black text-sm uppercase">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                    </div>
                </div>

                {/* TPO error banner */}
                {isTPO && tpoErrors.length > 0 && (
                    <div className="bg-orange-400 border-3 border-black px-5 py-3 shadow-neo-sm flex items-center gap-3 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>Some data failed ({tpoErrors.join(", ")}). Check F12 console. Make sure tables exist.</span>
                    </div>
                )}

                {/* Stats */}
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

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── FACULTY: Calendar + Schedule ── */}
                    {isFaculty && (
                        <>
                            {/* Calendar picker */}
                            <div className="flex flex-col gap-6">
                                <MiniCalendar
                                    selectedDate={selectedDate}
                                    onSelect={setSelectedDate}
                                    markedDates={monthDates}
                                />
                                {/* Legend */}
                                <div className="flex items-center gap-4 text-xs font-black uppercase">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-neo-green border border-black inline-block rounded-full" /> Has classes
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-neo-yellow border border-black inline-block" /> Today
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-black border border-black inline-block" /> Selected
                                    </span>
                                </div>
                            </div>

                            {/* Schedule for selected date */}
                            <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                                <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-blue">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-black text-white p-1 border-2 border-white shadow-sm">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-black text-black uppercase italic">Schedule</h3>
                                    </div>
                                    <div className="text-sm font-black border-2 border-black bg-white px-3 py-1 shadow-neo-sm">
                                        {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </div>
                                </div>

                                {facLoading ? (
                                    <div className="flex items-center justify-center py-12 gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="font-bold text-sm text-gray-500 uppercase">Loading…</span>
                                    </div>
                                ) : facultySchedule.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                                        <Calendar className="w-10 h-10 opacity-20" />
                                        <p className="font-black uppercase text-sm">No classes on this day</p>
                                        <p className="text-xs font-bold">Pick a date with a green dot on the calendar</p>
                                    </div>
                                ) : (
                                    <div className="divide-y-2 divide-black">
                                        {facultySchedule.map((item, i) => (
                                            <div key={i} className="flex items-center gap-6 px-6 py-5 hover:bg-neo-bg transition-colors group">
                                                <div className="bg-black text-white px-3 py-2 border-2 border-black font-mono font-black text-sm min-w-[100px] text-center shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                                    {formatTime(item.time_start)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-lg leading-tight">{item.subject}</p>
                                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                        <span className={`text-[10px] font-black uppercase border border-black px-1.5 ${TYPE_COLORS[item.type] || "bg-neo-blue"}`}>
                                                            {item.type}
                                                        </span>
                                                        <span className="text-sm font-bold text-slate-500">📍 {item.room}</span>
                                                        <span className="text-xs font-bold text-slate-400">Sec {item.section}</span>
                                                        <span className="text-xs font-mono text-slate-400">{formatTime(item.time_start)} – {formatTime(item.time_end)}</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/faculty/attendance?scheduleId=${item.id}`}
                                                    className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-green transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px] whitespace-nowrap"
                                                >
                                                    Mark Attendance
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── TPO & Event Manager: Today's schedule ── */}
                    {(isTPO || isEM) && (
                        <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                            <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-blue">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black text-white p-1 border-2 border-white shadow-sm">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-black uppercase italic">Today's Schedule</h3>
                                </div>
                                <span className="text-xs font-black border-2 border-black bg-white px-3 py-1 shadow-neo-sm uppercase">
                                    {isTPO ? "Training Sessions" : "Events"}
                                </span>
                            </div>
                            {(tpoLoading || evLoading) ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    <span className="font-bold text-sm text-gray-500">Loading...</span>
                                </div>
                            ) : (isTPO ? todaySessions : evSchedule).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                                    <Calendar className="w-10 h-10 opacity-20" />
                                    <p className="font-black uppercase text-sm">No {isTPO ? "training sessions" : "events"} today</p>
                                    <p className="text-xs font-bold">{isTPO ? "Post a session from Manage Placements" : "Create an event from Event Dashboard"}</p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-black">
                                    {(isTPO ? todaySessions : evSchedule).map((item, i) => (
                                        <div key={i} className="flex items-center gap-6 px-6 py-5 hover:bg-neo-bg transition-colors group">
                                            <div className="bg-black text-white px-3 py-2 border-2 border-black font-mono font-black text-sm min-w-[100px] text-center shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                                {isTPO 
                                                    ? (item.time ? formatTime(item.time) : "TBD")
                                                    : formatTime(item.time)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-lg leading-tight truncate">{item.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-sm font-bold text-slate-500">📍 {isTPO ? (item.venue || "—") : item.location}</p>
                                                    {item.type && <span className="text-[10px] font-black uppercase border border-black bg-neo-cyan px-1.5">{item.type}</span>}
                                                </div>
                                            </div>
                                            <button className="border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-green transition-colors shadow-neo-sm">View</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── OTHER roles: Static schedule placeholder ── */}
                    {!isFaculty && !isTPO && !isEM && (
                        <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo">
                            <div className="flex items-center gap-3 px-6 py-4 border-b-3 border-black bg-neo-blue">
                                <div className="bg-black text-white p-1 border-2 border-white"><Calendar className="w-5 h-5" /></div>
                                <h3 className="text-xl font-black text-black uppercase italic">Today's Schedule</h3>
                            </div>
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Calendar className="w-10 h-10 opacity-20 mb-2" />
                                <p className="font-black uppercase text-sm">No schedule module</p>
                            </div>
                        </div>
                    )}

                    {/* ── Recent Activity (all roles) ── */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className={`px-6 py-4 border-b-3 border-black ${role === "librarian" ? "bg-neo-red" : "bg-neo-yellow"}`}>
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {isFaculty ? "Attendance Log" : role === "librarian" ? "Book Request Alerts" : "Recent Activity"}
                            </h3>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                <span className="font-bold text-sm text-gray-500">Loading…</span>
                            </div>
                        ) : activityFeed.length === 0 ? (
                            <div className="px-5 py-8 text-center font-bold text-slate-400 uppercase text-sm">
                                {isFaculty ? "No attendance marked yet" : "No recent activity"}
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-black max-h-[480px] overflow-y-auto">
                                {activityFeed.map((item, i) => (
                                    <div key={i} className="px-5 py-4 hover:bg-neo-bg transition-colors">
                                        {isFaculty ? (
                                            /* Faculty attendance log entry */
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-black leading-snug">{item.text}</p>
                                                    <span className="text-[10px] font-mono border border-black px-1 ml-2 shrink-0">{item.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="flex-1 h-2 bg-neo-bg border border-black">
                                                        <div className={`h-full ${item.pct >= 75 ? "bg-neo-green" : item.pct >= 50 ? "bg-neo-yellow" : "bg-neo-red"}`}
                                                            style={{ width: `${item.pct}%` }} />
                                                    </div>
                                                    <span className="text-xs font-black">{item.sub}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-bold mt-1">{item.time}</p>
                                            </div>
                                        ) : (
                                            /* Other roles activity entry */
                                            <div className="flex items-start gap-3">
                                                <div className={`w-3 h-3 ${item.color} border-2 border-black mt-1.5 shrink-0`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-black leading-snug">{item.text}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-xs font-bold text-slate-400">{item.time}</p>
                                                        {(item.badge || item.status) && (
                                                            <span className={`text-[10px] font-black uppercase px-1.5 border border-black ${STATUS_COLORS_TPO[item.badge || item.status] || "bg-neo-blue"}`}>
                                                                {item.badge || item.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
