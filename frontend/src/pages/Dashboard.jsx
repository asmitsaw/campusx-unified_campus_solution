import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../utils/api";
import {
    Calendar, BookOpen, TrendingUp, Users, Bell,
    CheckCircle, XCircle, Clock, AlertTriangle, ChevronRight,
    Building2, ArrowUpRight, Loader2, Star
} from "lucide-react";

// ── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
    return <div className={`animate-pulse bg-black/10 ${className}`} />;
}

// ── Attendance Heatmap — built from real perDate data ────────────────────────
function AttendanceHeatmap({ perDate }) {
    // Build a map: date → status
    const dateMap = {};
    (perDate || []).forEach(r => { dateMap[r.date] = r.status; });

    // Show last 28 weekdays (4 weeks × 7 days)
    const today = new Date("2026-02-20");
    const days = [];
    let d = new Date(today);
    while (days.length < 28) {
        const iso = d.toISOString().slice(0, 10);
        days.unshift({ date: iso, dow: d.getDay() });
        d.setDate(d.getDate() - 1);
    }

    return (
        <div className="grid grid-cols-7 gap-1.5 mt-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((l, i) => (
                <div key={i} className="text-center text-[9px] font-black text-black/40 uppercase">{l}</div>
            ))}
            {days.map(({ date, dow }) => {
                const status = dateMap[date];
                const isWeekend = dow === 0 || dow === 6;
                let bg = "bg-gray-100 border-black/20";
                if (isWeekend) bg = "bg-gray-100 border-black/10 opacity-50";
                else if (status === "present") bg = "bg-neo-green border-black shadow-[2px_2px_0px_rgba(0,0,0,0.4)]";
                else if (status === "absent") bg = "bg-neo-danger border-black shadow-[1px_1px_0px_rgba(0,0,0,0.3)]";
                else if (status === "late") bg = "bg-neo-yellow border-black";
                return (
                    <div
                        key={date}
                        title={`${date}: ${status || (isWeekend ? "weekend" : "no class")}`}
                        className={`h-7 border-2 ${bg} transition-transform hover:scale-110`}
                    />
                );
            })}
        </div>
    );
}

// ── Placement status banner ──────────────────────────────────────────────────
function PlacementBanner({ stats, myApps, loading, navigate }) {
    const latestApp = myApps?.[0];
    return (
        <div className="bg-neo-blue border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-6 hover:rotate-0 hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] shrink-0">
                    <Building2 className="w-7 h-7 text-black" />
                </div>
                <div>
                    {loading ? (
                        <Skeleton className="h-6 w-48 mb-2" />
                    ) : latestApp ? (
                        <>
                            <h4 className="text-black font-black text-lg uppercase bg-white px-2 border-2 border-black inline-block mb-1">
                                {latestApp.placements?.company} — <span className="text-neo-purple">{latestApp.status}</span>
                            </h4>
                            <p className="text-sm font-bold text-black">
                                {stats?.active_drives || 0} active drive{stats?.active_drives !== 1 ? "s" : ""} · {stats?.students_placed || 0} placed this season
                            </p>
                        </>
                    ) : (
                        <>
                            <h4 className="text-black font-black text-lg uppercase bg-white px-2 border-2 border-black inline-block mb-1">
                                {stats?.active_drives || 0} Drive{stats?.active_drives !== 1 ? "s" : ""} Open — Start Applying!
                            </h4>
                            <p className="text-sm font-bold text-black">
                                {stats?.students_placed || 0} students placed · Avg package {stats?.avg_package || "—"} LPA
                            </p>
                        </>
                    )}
                </div>
            </div>
            <button
                onClick={() => navigate("/dashboard/placement")}
                className="px-6 py-3 bg-black text-white text-sm font-black uppercase border-2 border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-white hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_#000] transition-all whitespace-nowrap"
            >
                View Companies
            </button>
        </div>
    );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [attendance, setAttendance] = useState(null);
    const [attLoading, setAttLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(true);
    const [placementStats, setPlacementStats] = useState(null);
    const [myApps, setMyApps] = useState([]);
    const [plLoading, setPlLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    useEffect(() => {
        // Attendance
        apiGet("/attendance/my")
            .then(r => setAttendance(r.data))
            .catch(() => { })
            .finally(() => setAttLoading(false));

        // Library
        apiGet("/library/my-books")
            .then(r => setBooks(Array.isArray(r.data) ? r.data : []))
            .catch(() => setBooks([]))
            .finally(() => setBooksLoading(false));

        // Placements
        Promise.all([
            apiGet("/placements/stats"),
            apiGet("/placements/my-applications"),
        ])
            .then(([s, a]) => {
                setPlacementStats(s.data);
                setMyApps(a.data || []);
            })
            .catch(() => { })
            .finally(() => setPlLoading(false));

        // Events (from dashboard endpoint)
        apiGet("/dashboard")
            .then(r => setEvents(r.data?.events || []))
            .catch(() => setEvents([]))
            .finally(() => setEventsLoading(false));
    }, []);

    // ── Derived stats ────────────────────────────────────────────────────────
    const overallPct = attendance?.overallPct ?? null;
    const totalPresent = attendance?.totalPresent ?? 0;
    const totalClasses = attendance?.totalClasses ?? 0;
    const criticalSubjects = (attendance?.subjects || []).filter(s => s.percentage < 75);
    const overdueBooks = books.filter(b => {
        if (!b.due_date) return false;
        return new Date(b.due_date) < new Date();
    });

    // Greet user
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    const firstName = user?.name?.split(" ")?.[0] || "Student";

    // ── Stat cards config ────────────────────────────────────────────────────
    const stats = [
        {
            label: "Attendance",
            value: attLoading ? null : overallPct !== null ? `${overallPct}%` : "—",
            sub: attLoading ? null : overallPct !== null
                ? (overallPct >= 75 ? "Above threshold ✓" : `⚠️ ${criticalSubjects.length} subject${criticalSubjects.length !== 1 ? "s" : ""} critical`)
                : "No data yet",
            icon: Calendar,
            bg: "bg-neo-cyan",
            tag: overallPct !== null ? (overallPct >= 75 ? "Safe" : "At Risk") : null,
            tagBg: overallPct >= 75 ? "bg-neo-green" : "bg-neo-danger",
            link: "/dashboard/attendance",
        },
        {
            label: "Library Books",
            value: booksLoading ? null : `${books.length}`,
            sub: booksLoading ? null : overdueBooks.length > 0
                ? `${overdueBooks.length} OVERDUE`
                : books.length === 0 ? "No books borrowed" : "All on time ✓",
            icon: BookOpen,
            bg: "bg-neo-pink",
            tag: overdueBooks.length > 0 ? "Overdue" : books.length > 0 ? "Active" : "Clear",
            tagBg: overdueBooks.length > 0 ? "bg-neo-danger" : "bg-neo-green",
            link: "/dashboard/library",
        },
        {
            label: "Placements",
            value: plLoading ? null : `${placementStats?.active_drives ?? "—"}`,
            sub: plLoading ? null : `${placementStats?.students_placed || 0} placed · ${placementStats?.companies_visiting || 0} companies`,
            icon: Building2,
            bg: "bg-neo-yellow",
            tag: myApps.length > 0 ? `${myApps.length} Applied` : "Browse",
            tagBg: myApps.length > 0 ? "bg-neo-purple" : "bg-white",
            link: "/dashboard/placement",
        },
        {
            label: "Events",
            value: eventsLoading ? null : `${events.length}`,
            sub: eventsLoading ? null : events.length > 0
                ? `Next: ${events[0]?.title?.slice(0, 22) || "—"}`
                : "No upcoming events",
            icon: Star,
            bg: "bg-white",
            tag: events.length > 0 ? "Upcoming" : "Clear",
            tagBg: events.length > 0 ? "bg-neo-blue" : "bg-gray-200",
            link: "/dashboard/events",
        },
    ];

    return (
        <div
            className="bg-[#f0f0f0] text-neo-black min-h-screen flex flex-col overflow-hidden selection:bg-neo-pink selection:text-black p-6 -m-6"
            style={{ backgroundImage: "radial-gradient(#00000022 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
            <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">

                {/* ── Header ── */}
                <header className="flex items-center justify-between py-5 border-b-4 border-black mb-2">
                    <div>
                        <p className="text-xs font-black text-black/50 uppercase tracking-widest">{greeting}</p>
                        <h2 className="text-3xl font-black text-black uppercase tracking-tight"
                            style={{ textShadow: "2px 2px 0px #ddd" }}>
                            {firstName}&apos;s Dashboard
                        </h2>
                        <p className="text-sm font-bold text-gray-600 bg-white px-2 border border-black mt-1 w-fit shadow-[2px_2px_0px_0px_#ccc]">
                            {attLoading ? "Loading your data…"
                                : overallPct === null ? "Run SQL setup to see live data"
                                    : criticalSubjects.length > 0
                                        ? `⚠️ ${criticalSubjects.length} subject${criticalSubjects.length > 1 ? "s" : ""} below 75% — action needed`
                                        : `✅ Attendance healthy · ${overdueBooks.length > 0 ? `${overdueBooks.length} book${overdueBooks.length > 1 ? "s" : ""} overdue` : "No overdue books"}`
                            }
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <Link to="/dashboard/attendance"
                            className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all">
                            <Bell className="w-6 h-6" />
                        </Link>
                    </div>
                </header>

                {/* ── Hero Banner ── */}
                <section className="relative overflow-hidden bg-neo-purple border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neo-yellow border-l-4 border-b-4 border-black opacity-100"
                        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
                    <div className="absolute bottom-0 right-20 w-32 h-32 bg-neo-cyan border-4 border-black rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-black border-2 border-white w-fit shadow-[4px_4px_0px_0px_#fff]">
                                <TrendingUp className="w-4 h-4 text-neo-yellow" />
                                <span className="text-xs font-black text-white tracking-widest uppercase">Live Campus Overview</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-black leading-none uppercase">
                                {attLoading ? "Loading…"
                                    : overallPct !== null
                                        ? <>Overall attendance: <span className="bg-neo-yellow px-2 border-2 border-black inline-block transform -rotate-1">{overallPct}%</span></>
                                        : <>Welcome back, <span className="bg-neo-yellow px-2 border-2 border-black inline-block transform -rotate-1">{firstName}!</span></>
                                }
                            </h3>
                            <p className="text-black font-bold text-base max-w-xl bg-white/60 p-2 border-2 border-black inline-block">
                                {attLoading ? "Fetching your academic data…"
                                    : totalClasses > 0
                                        ? `${totalPresent} of ${totalClasses} classes attended · ${criticalSubjects.length === 0 ? "All subjects above threshold 🎉" : `${criticalSubjects.length} subject${criticalSubjects.length > 1 ? "s" : ""} need attention`}`
                                        : "No attendance records yet — ask your faculty to mark attendance."}
                            </p>
                            <div className="pt-2 flex gap-3 flex-wrap">
                                <Link to="/dashboard/attendance"
                                    className="border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase inline-flex items-center gap-2 bg-neo-orange hover:bg-white text-black px-6 py-3 text-sm transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000]">
                                    View Full Attendance <ArrowUpRight className="w-4 h-4" />
                                </Link>
                                <Link to="/dashboard/placement"
                                    className="border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase inline-flex items-center gap-2 bg-white hover:bg-neo-yellow text-black px-6 py-3 text-sm transition-all active:translate-y-[2px]">
                                    Placements <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        {/* Attendance ring widget */}
                        <div className="hidden md:flex flex-col items-center justify-center w-44 h-44 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] relative shrink-0">
                            <p className="text-xs font-black uppercase text-black/50 mb-1">Attendance</p>
                            {attLoading
                                ? <Skeleton className="w-16 h-10 mx-auto" />
                                : <span className="text-5xl font-black text-black leading-none">
                                    {overallPct !== null ? `${overallPct}%` : "—"}
                                </span>
                            }
                            <p className={`text-xs font-black uppercase mt-2 px-2 border-2 border-black ${overallPct >= 75 ? "bg-neo-green" : overallPct !== null ? "bg-neo-danger" : "bg-gray-200"}`}>
                                {overallPct >= 75 ? "Safe" : overallPct !== null ? "At Risk" : "No Data"}
                            </p>
                            {/* Mini bar */}
                            {overallPct !== null && (
                                <div className="w-full px-3 mt-3">
                                    <div className="h-3 bg-gray-100 border-2 border-black w-full relative overflow-hidden">
                                        <div
                                            className={`h-full ${overallPct >= 75 ? "bg-neo-green" : "bg-neo-danger"} border-r-2 border-black`}
                                            style={{ width: `${Math.min(overallPct, 100)}%` }}
                                        />
                                        <div className="absolute top-0 h-full border-l-2 border-black border-dashed" style={{ left: "75%" }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── 4 Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <Link key={s.label} to={s.link}
                            className={`${s.bg} p-6 flex flex-col justify-between relative h-48 border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] transition-all group`}>
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1 z-10">
                                    <p className="text-black text-sm font-black uppercase border-b-2 border-black w-fit mb-2">{s.label}</p>
                                    {s.value === null
                                        ? <Skeleton className="h-12 w-24 mb-1" />
                                        : <h4 className="text-5xl font-black text-black leading-none">{s.value}</h4>
                                    }
                                    {s.tag && (
                                        <span className={`text-xs font-black uppercase px-2 py-0.5 border-2 border-black ${s.tagBg} mt-1 w-fit shadow-[2px_2px_0px_0px_#000]`}>
                                            {s.tag}
                                        </span>
                                    )}
                                </div>
                                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] group-hover:scale-110 transition-transform">
                                    <s.icon className="w-6 h-6 text-black" />
                                </div>
                            </div>
                            <p className="text-xs font-bold mt-auto pt-2 border-t-2 border-black/20 uppercase truncate">
                                {s.sub === null ? "Loading…" : s.sub}
                            </p>
                            <ArrowUpRight className="absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>

                {/* ── Bottom: Attendance Heatmap + Borrowed Books + Events ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Attendance heatmap */}
                    <div className="lg:col-span-1 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-black text-black uppercase">Attendance</h3>
                                <p className="text-sm font-bold text-black border-b-2 border-neo-green inline-block">Activity Map — Feb 2026</p>
                            </div>
                            <Link to="/dashboard/attendance"
                                className="text-xs font-black uppercase bg-neo-green border-2 border-black px-2 py-1 hover:bg-neo-yellow transition-colors shadow-[2px_2px_0px_0px_#000]">
                                Full →
                            </Link>
                        </div>
                        {attLoading ? (
                            <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
                        ) : (
                            <>
                                <AttendanceHeatmap perDate={attendance?.perDate || []} />
                                <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold uppercase">
                                    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-neo-danger border-2 border-black" /><span>Absent</span></div>
                                    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-neo-green border-2 border-black" /><span>Present</span></div>
                                    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-gray-100 border-2 border-black" /><span>No Class</span></div>
                                </div>
                                <div className="mt-4 pt-3 border-t-2 border-black flex justify-between text-sm font-black uppercase">
                                    <span>{totalPresent} Present</span>
                                    <span className="text-neo-danger">{totalClasses - totalPresent} Absent</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Borrowed Books */}
                    <div className="lg:col-span-1 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col">
                        <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-3">
                            <h3 className="text-xl font-black uppercase">Library Dues</h3>
                            <Link to="/dashboard/library"
                                className="text-xs font-black uppercase bg-neo-pink border-2 border-black px-2 py-1 hover:bg-neo-accent transition-colors shadow-[2px_2px_0px_0px_#000]">
                                View All →
                            </Link>
                        </div>
                        {booksLoading ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                            </div>
                        ) : books.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-black/40 py-6">
                                <BookOpen className="w-10 h-10 opacity-20" />
                                <p className="font-black uppercase text-sm">No Books Borrowed</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 flex-1">
                                {books.slice(0, 4).map((b, i) => {
                                    const due = b.due_date ? new Date(b.due_date) : null;
                                    const overdue = due && due < new Date();
                                    const daysLeft = due ? Math.ceil((due - new Date()) / 86400000) : null;
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] ${overdue ? "bg-red-50" : "bg-neo-bg"}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <BookOpen className="w-4 h-4 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-black text-sm truncate">{b.books?.title || b.title || "Book"}</p>
                                                    <p className="text-xs font-mono text-black/50">{due ? due.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase border border-black px-1.5 py-0.5 shrink-0 ${overdue ? "bg-neo-danger" : daysLeft <= 3 ? "bg-neo-yellow" : "bg-neo-green"}`}>
                                                {overdue ? "OVERDUE" : daysLeft !== null ? `${daysLeft}d left` : "—"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events / Recent Activity */}
                    <div className="lg:col-span-1 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col">
                        <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-3">
                            <h3 className="text-xl font-black uppercase">Upcoming Events</h3>
                            <Link to="/dashboard/events"
                                className="text-xs font-black uppercase bg-neo-blue border-2 border-black px-2 py-1 hover:bg-neo-yellow transition-colors shadow-[2px_2px_0px_0px_#000]">
                                All →
                            </Link>
                        </div>
                        {eventsLoading ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
                            </div>
                        ) : events.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-black/40 py-6">
                                <Calendar className="w-10 h-10 opacity-20" />
                                <p className="font-black uppercase text-sm">No Upcoming Events</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 flex-1">
                                {events.slice(0, 4).map((ev, i) => {
                                    const evDate = ev.date ? new Date(ev.date) : null;
                                    const colors = ["bg-neo-purple", "bg-neo-cyan", "bg-neo-yellow", "bg-neo-orange"];
                                    return (
                                        <div key={i} className="flex items-center gap-3 p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-neo-bg hover:bg-neo-accent transition-colors group">
                                            <div className={`shrink-0 w-10 h-10 flex flex-col items-center justify-center border-2 border-black ${colors[i % colors.length]}`}>
                                                <span className="text-[10px] font-black leading-none">{evDate ? evDate.toLocaleDateString("en-US", { month: "short" }) : "—"}</span>
                                                <span className="text-base font-black leading-none">{evDate ? evDate.getDate() : "—"}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-sm uppercase truncate">{ev.title}</p>
                                                <p className="text-xs font-bold text-black/50 truncate">{ev.description?.slice(0, 40) || "—"}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Placement Strip ── */}
                <PlacementBanner stats={placementStats} myApps={myApps} loading={plLoading} navigate={navigate} />

                {/* ── Subject Attendance Quick View ── */}
                {!attLoading && (attendance?.subjects?.length > 0) && (
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-2xl font-black uppercase">Subject Snapshot</h3>
                            <Link to="/dashboard/attendance"
                                className="text-sm font-black uppercase border-2 border-black px-4 py-2 bg-white hover:bg-neo-accent shadow-[3px_3px_0px_0px_#000] hover:shadow-none transition-all">
                                Full Details →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {attendance.subjects.map((s) => {
                                const pct = s.percentage;
                                const barColor = pct >= 75 ? "bg-neo-green" : pct >= 60 ? "bg-neo-yellow" : "bg-neo-danger";
                                const badge = pct >= 75 ? "bg-neo-green" : pct >= 60 ? "bg-neo-yellow" : "bg-neo-danger";
                                return (
                                    <div key={s.subject} className={`p-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] ${pct < 75 ? "bg-red-50" : "bg-neo-bg"} group hover:-translate-y-0.5 transition-transform`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-black text-sm uppercase">{s.subject}</p>
                                                <p className="text-xs font-bold text-black/50 uppercase">{s.type}</p>
                                            </div>
                                            <span className={`text-sm font-black px-2 border-2 border-black ${badge}`}>{pct}%</span>
                                        </div>
                                        <div className="h-5 bg-white border-2 border-black relative overflow-hidden">
                                            <div className={`h-full ${barColor} border-r-2 border-black`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                            <div className="absolute top-0 h-full border-l-2 border-black border-dashed opacity-60" style={{ left: "75%" }} />
                                        </div>
                                        <div className="flex justify-between text-xs font-bold mt-2 text-black/60">
                                            <span>{s.present}/{s.total} attended</span>
                                            {pct < 75 && <span className="text-neo-danger font-black">CRITICAL</span>}
                                            {pct >= 75 && <span className="text-neo-success">Safe ✓</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
