import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
    ClipboardList, Search, CheckCircle, XCircle, Calendar,
    Clock, Loader2, ChevronLeft, ChevronRight, Users,
} from "lucide-react";
import { apiGet, apiPost } from "../../utils/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(t) {
    if (!t) return "TBD";
    try {
        const [h, m] = t.split(":").map(Number);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
    } catch { return t; }
}

function isoToDisplay(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

const TYPE_COLORS = {
    Lecture: "bg-neo-blue",
    Lab: "bg-neo-green",
    Tutorial: "bg-neo-yellow",
};

// ── Mini calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ selectedDate, onSelect, markedDates }) {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="bg-white border-3 border-black shadow-neo">
            <div className="flex items-center justify-between px-4 py-3 bg-neo-purple border-b-3 border-black">
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-black/20 rounded transition">
                    <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <span className="font-black text-white uppercase text-sm">{MONTHS[month]} {year}</span>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-black/20 rounded transition">
                    <ChevronRight className="w-4 h-4 text-white" />
                </button>
            </div>
            <div className="grid grid-cols-7 border-b-2 border-black">
                {DAYS.map((d, i) => (
                    <div key={i} className="text-center py-1.5 text-[10px] font-black uppercase text-slate-500">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 p-2 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
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
                                ${isSelected ? "bg-black text-white border-2 border-black" :
                                    isToday ? "bg-neo-yellow border-2 border-black" :
                                        "hover:bg-neo-bg border border-transparent hover:border-black"}`}
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function ManageAttendance() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const preSelectedId = queryParams.get("scheduleId");

    // ── State ─────────────────────────────────────────────────────
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [monthDates, setMonthDates] = useState({});         // { date: [sessions] }
    const [daySchedule, setDaySchedule] = useState([]);       // sessions for selected date
    const [selectedSession, setSelectedSession] = useState(null);
    const [students, setStudents] = useState([]);             // all students
    const [attendance, setAttendance] = useState({});         // { student_id: "present"|"absent" }
    const [recentRecords, setRecentRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Fetch month calendar data ──────────────────────────────────
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
            })
            .catch(e => console.error("[Attendance] month:", e.message));
    }, []);

    // ── Fetch all students ─────────────────────────────────────────
    useEffect(() => {
        apiGet("/attendance/students")
            .then(r => {
                setStudents(r.data || []);
                // Default all to present
                const defaults = {};
                (r.data || []).forEach(s => { defaults[s.id] = "present"; });
                setAttendance(defaults);
            })
            .catch(e => console.error("[Attendance] students:", e.message));
    }, []);

    // ── Fetch day schedule ─────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setSelectedSession(null);
        apiGet(`/attendance/schedule?date=${selectedDate}`)
            .then(r => setDaySchedule(r.data || []))
            .catch(e => console.error("[Attendance] schedule:", e.message))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    // ── If pre-selected session from dashboard link ────────────────
    useEffect(() => {
        if (preSelectedId && daySchedule.length > 0) {
            const found = daySchedule.find(s => s.id === preSelectedId);
            if (found) setSelectedSession(found);
        }
    }, [preSelectedId, daySchedule]);

    // ── Load existing attendance when session is selected ──────────
    const loadExistingAttendance = useCallback(async (session) => {
        try {
            const r = await apiGet(`/attendance/records/${session.id}`);
            if (r.data && r.data.length > 0) {
                const existing = {};
                r.data.forEach(rec => { existing[rec.student_id] = rec.status; });
                setAttendance(prev => ({ ...prev, ...existing }));
            }
        } catch (e) { console.error("[Attendance] load records:", e.message); }
    }, []);

    useEffect(() => {
        if (selectedSession) loadExistingAttendance(selectedSession);
    }, [selectedSession, loadExistingAttendance]);

    // ── Fetch recent records ───────────────────────────────────────
    useEffect(() => {
        apiGet("/attendance/recent")
            .then(r => setRecentRecords(r.data || []))
            .catch(e => console.error("[Attendance] recent:", e.message));
    }, []);

    // ── Toggle attendance ──────────────────────────────────────────
    const toggle = (id) => setAttendance(prev => ({
        ...prev,
        [id]: prev[id] === "present" ? "absent" : "present"
    }));

    const markAll = (status) => {
        const next = {};
        students.forEach(s => { next[s.id] = status; });
        setAttendance(next);
    };

    // ── Filter students ────────────────────────────────────────────
    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_no.toLowerCase().includes(search.toLowerCase())
    );

    // ── Filter by section if session has one ──────────────────────
    const sessionStudents = selectedSession
        ? filtered.filter(s => !selectedSession.section || s.section === selectedSession.section)
        : filtered;

    const presentCount = sessionStudents.filter(s => attendance[s.id] === "present").length;
    const absentCount = sessionStudents.length - presentCount;

    // ── Submit ─────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!selectedSession) {
            showToast("Please select a class session first", "error");
            return;
        }
        setSubmitting(true);
        try {
            const records = sessionStudents.map(s => ({
                student_id: s.id,
                status: attendance[s.id] || "absent",
            }));
            await apiPost("/attendance/mark", {
                schedule_id: selectedSession.id,
                records,
            });
            showToast(`✅ Attendance saved — ${presentCount}/${sessionStudents.length} present`);
            // Refresh recent records
            const r = await apiGet("/attendance/recent");
            setRecentRecords(r.data || []);
        } catch (e) {
            showToast(`❌ ${e.message}`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #4CAF50" }}>
                        Manage Attendance
                    </h1>
                    <div className="bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-black text-sm uppercase">
                        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </div>
                </div>

                {/* Toast */}
                {toast && (
                    <div className={`border-3 border-black px-5 py-3 font-black text-sm shadow-neo-sm
                        ${toast.type === "error" ? "bg-neo-red text-white" : "bg-neo-green text-black"}`}>
                        {toast.msg}
                    </div>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Students", value: sessionStudents.length, color: "bg-neo-blue" },
                        { label: "Present", value: presentCount, color: "bg-neo-green" },
                        { label: "Absent", value: absentCount, color: "bg-neo-red" },
                        { label: "Percentage", value: sessionStudents.length > 0 ? `${Math.round((presentCount / sessionStudents.length) * 100)}%` : "–", color: "bg-neo-yellow" },
                    ].map((s, i) => (
                        <div key={i} className={`${s.color} border-3 border-black p-4 shadow-neo`}>
                            <p className="text-xs font-black uppercase text-black/70 mb-1">{s.label}</p>
                            <p className="text-3xl font-black">{s.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* ── Left: Calendar + Sessions ── */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <MiniCalendar
                            selectedDate={selectedDate}
                            onSelect={setSelectedDate}
                            markedDates={monthDates}
                        />

                        {/* Class sessions for the selected date */}
                        <div className="bg-white border-3 border-black shadow-neo">
                            <div className="px-4 py-3 bg-neo-blue border-b-3 border-black flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <h3 className="font-black text-sm uppercase">
                                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} — Classes
                                </h3>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    <span className="text-sm font-bold text-gray-500">Loading…</span>
                                </div>
                            ) : daySchedule.length === 0 ? (
                                <div className="py-6 text-center text-sm font-bold text-slate-400 uppercase">
                                    No classes on this day
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-black">
                                    {daySchedule.map(session => (
                                        <button
                                            key={session.id}
                                            onClick={() => setSelectedSession(session)}
                                            className={`w-full text-left px-4 py-3 hover:bg-neo-bg transition-colors
                                                ${selectedSession?.id === session.id ? "bg-neo-yellow" : ""}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-black uppercase border border-black px-1 ${TYPE_COLORS[session.type] || "bg-neo-blue"}`}>
                                                    {session.type}
                                                </span>
                                                <span className="text-xs font-mono font-bold text-slate-500">{formatTime(session.time_start)}</span>
                                            </div>
                                            <p className="font-black text-sm leading-snug">{session.subject}</p>
                                            <p className="text-[11px] text-slate-500 font-bold">Sec {session.section} · {session.room}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Center: Mark Attendance ── */}
                    <div className="lg:col-span-2 bg-white border-3 border-black shadow-neo flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-green">
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-white p-1 border-2 border-white">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-black uppercase italic">Mark Attendance</h3>
                                    {selectedSession && (
                                        <p className="text-xs font-bold text-black/70">
                                            {selectedSession.subject} — Sec {selectedSession.section} · {isoToDisplay(selectedDate)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {selectedSession && (
                                <div className="flex gap-2">
                                    <button onClick={() => markAll("present")}
                                        className="text-xs border-2 border-black bg-neo-green px-2 py-1 font-black shadow-neo-sm hover:bg-black hover:text-white transition">
                                        All Present
                                    </button>
                                    <button onClick={() => markAll("absent")}
                                        className="text-xs border-2 border-black bg-neo-red text-white px-2 py-1 font-black shadow-neo-sm hover:bg-black transition">
                                        All Absent
                                    </button>
                                </div>
                            )}
                        </div>

                        {!selectedSession ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-16 text-slate-400">
                                <Calendar className="w-12 h-12 opacity-20 mb-3" />
                                <p className="font-black uppercase text-sm">Select a class session</p>
                                <p className="text-xs font-bold mt-1">Pick a date on the calendar, then choose a class</p>
                            </div>
                        ) : (
                            <>
                                {/* Search */}
                                <div className="px-6 py-4 border-b-2 border-black bg-neo-bg">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                                        <input
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="w-full border-2 border-black pl-10 pr-4 py-2 font-bold placeholder:text-gray-400 outline-none shadow-neo-sm focus:shadow-neo"
                                            placeholder="Search by name or roll no…"
                                        />
                                    </div>
                                </div>

                                {/* Student list */}
                                <div className="divide-y-2 divide-black flex-1 overflow-y-auto max-h-[480px]">
                                    {sessionStudents.length === 0 ? (
                                        <div className="py-8 text-center text-sm font-bold text-slate-400">No students found</div>
                                    ) : sessionStudents.map(student => (
                                        <div key={student.id}
                                            className={`flex items-center justify-between px-6 py-4 hover:bg-neo-bg transition-colors
                                                ${attendance[student.id] === "absent" ? "bg-red-50" : ""}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-neo-purple border-2 border-black flex items-center justify-center text-white font-black text-sm shrink-0">
                                                    {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-black">{student.name}</p>
                                                    <p className="text-xs font-mono font-bold text-slate-500">
                                                        {student.roll_no} · Sec {student.section}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggle(student.id)}
                                                className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-black text-sm uppercase shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all
                                                    ${attendance[student.id] === "present" ? "bg-neo-green text-black" : "bg-neo-red text-white"}`}
                                            >
                                                {attendance[student.id] === "present"
                                                    ? <><CheckCircle className="w-4 h-4" /> Present</>
                                                    : <><XCircle className="w-4 h-4" /> Absent</>
                                                }
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Submit */}
                                <div className="px-6 py-4 border-t-3 border-black bg-neo-bg">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full bg-black text-white border-3 border-black py-3 font-black text-lg uppercase shadow-neo-sm hover:bg-neo-purple active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                                    >
                                        {submitting
                                            ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
                                            : <><CheckCircle className="w-5 h-5" /> Submit Attendance ({presentCount}/{sessionStudents.length} Present)</>
                                        }
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Right: Recent Records ── */}
                    <div className="lg:col-span-1 bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-yellow flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <h3 className="text-xl font-black text-black uppercase italic">Recent Records</h3>
                        </div>

                        {recentRecords.length === 0 ? (
                            <div className="py-8 text-center font-bold text-slate-400 text-sm uppercase">
                                No records yet
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-black overflow-y-auto max-h-[640px]">
                                {recentRecords.map((rec, i) => (
                                    <div key={i} className="px-5 py-4 hover:bg-neo-bg transition-colors">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div>
                                                <p className="font-black text-sm">{rec.subject}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`text-[10px] font-black uppercase border border-black px-1 ${TYPE_COLORS[rec.type] || "bg-neo-blue"}`}>
                                                        {rec.type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-500">Sec {rec.section}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono border border-black px-1 shrink-0 ml-2">{rec.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex-1 h-3 bg-neo-bg border-2 border-black">
                                                <div
                                                    className={`h-full ${rec.total > 0 && (rec.present / rec.total) >= 0.75 ? "bg-neo-green" :
                                                        rec.total > 0 && (rec.present / rec.total) >= 0.5 ? "bg-neo-yellow" : "bg-neo-red"}`}
                                                    style={{ width: rec.total > 0 ? `${(rec.present / rec.total) * 100}%` : "0%" }}
                                                />
                                            </div>
                                            <span className="text-sm font-black whitespace-nowrap">
                                                {rec.present}/{rec.total}
                                            </span>
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
