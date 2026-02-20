import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../utils/api";
import { Loader2, AlertTriangle, TrendingUp, TrendingDown, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function pctColor(pct) {
    if (pct >= 75) return { bar: "bg-neo-success", badge: "bg-neo-success", label: "Safe", textClass: "text-neo-success" };
    if (pct >= 60) return { bar: "bg-neo-accent", badge: "bg-neo-accent", label: "Low", textClass: "text-yellow-700" };
    return { bar: "bg-neo-danger", badge: "bg-neo-danger", label: "Critical", textClass: "text-neo-danger" };
}

const SUBJECT_ICONS = ["📐", "💻", "🌐", "🗄️", "⚙️"];

// How many classes must the student attend to hit 75% if currently below
function calcRequired(present, total, target = 0.75) {
    // solve: (present + x) / (total + x) >= target
    // x >= (target * total - present) / (1 - target)
    if (total === 0) return 0;
    const current = present / total;
    if (current >= target) return 0;
    const x = Math.ceil((target * total - present) / (1 - target));
    return Math.max(x, 0);
}

// How many more can they miss before dropping below 75%
function calcCanMiss(present, total, target = 0.75) {
    // solve: present / (total + x) >= target  => x <= present/target - total
    if (total === 0) return 0;
    const canMiss = Math.floor(present / target) - total;
    return Math.max(canMiss, 0);
}

function formatDate(d) {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Attendance() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calcSubject, setCalcSubject] = useState(null);
    const [activeTab, setActiveTab] = useState("breakdown"); // "breakdown" | "history"

    useEffect(() => {
        apiGet("/attendance/my")
            .then(r => {
                setData(r.data);
                if (r.data?.subjects?.length > 0) setCalcSubject(r.data.subjects[0]);
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="bg-[#F0F0F0] min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 bg-white border-3 border-black px-8 py-6 shadow-neo">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-black uppercase text-lg">Loading Attendance…</span>
            </div>
        </div>
    );

    // ── Error or not in roster ─────────────────────────────────────────────────
    if (error || !data?.student) return (
        <div className="bg-[#F0F0F0] text-black font-display antialiased p-6 -m-6 min-h-screen">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-black text-black mb-2 uppercase tracking-wide">
                            <span>Academics</span>
                            <span>›</span>
                            <span className="bg-neo-accent px-2 py-0.5 border-2 border-black">ATTENDANCE</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-black uppercase">Attendance Analytics</h1>
                    </div>
                </div>

                <div className="bg-white border-3 border-black p-10 shadow-neo flex flex-col items-center gap-5 text-center max-w-xl mx-auto">
                    <AlertTriangle className="w-14 h-14 text-neo-danger" />
                    <h2 className="text-2xl font-black uppercase">
                        {error ? "Could Not Load Attendance" : "Not Linked to Roster"}
                    </h2>

                    {error ? (
                        <p className="text-black/70 font-bold">{error}</p>
                    ) : (
                        <>
                            <p className="text-black font-bold">
                                Your account email is not in the student roster yet.
                            </p>
                            <div className="bg-[#F0F0F0] border-3 border-black p-4 w-full text-left">
                                <p className="text-xs font-black uppercase text-black/50 mb-1">Looked-up email</p>
                                <p className="font-mono font-bold text-sm break-all">
                                    {data?.email || user?.email || "—"}
                                </p>
                            </div>
                            <div className="bg-neo-accent border-3 border-black p-4 w-full text-left">
                                <p className="text-xs font-black uppercase mb-2">✅ Fix: Run the SQL setup</p>
                                <p className="text-sm font-bold">
                                    Open <span className="font-mono bg-white border border-black px-1">backend/setup_attendance.sql</span> in your{" "}
                                    <span className="font-black">Supabase SQL Editor</span> and run it. This creates the roster tables and seeds demo attendance data for your account.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const { subjects, perDate, totalPresent, totalClasses, overallPct, student } = data;
    const overallColors = pctColor(overallPct);
    const criticalSubjects = subjects.filter(s => s.percentage < 75);
    const calculatorSubject = calcSubject || subjects[0] || null;

    return (
        <div className="bg-[#F0F0F0] text-black font-display antialiased overflow-x-hidden selection:bg-neo-accent selection:text-black p-6 -m-6 min-h-screen">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-10">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-black text-black mb-2 uppercase tracking-wide">
                            <span>Academics</span>
                            <span>›</span>
                            <span className="bg-neo-accent px-2 py-0.5 border-2 border-black">ATTENDANCE</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                            Attendance Analytics
                        </h1>
                        <p className="text-black mt-2 font-black text-lg border-l-8 border-neo-primary pl-4 uppercase">
                            {student.name} · {student.roll_no} · Sec {student.section}
                        </p>
                    </div>
                </div>

                {/* ── Top Row: Overall card + Warnings + Calculator ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Overall Status */}
                    <div className="bg-white border-3 border-black shadow-neo-lg p-6 flex flex-col relative overflow-hidden">
                        <div className={`absolute top-4 right-4 border-3 border-black px-3 py-1 font-black text-sm uppercase shadow-neo-sm ${overallColors.badge}`}>
                            {overallColors.label}
                        </div>
                        <h3 className="text-2xl font-black text-black mb-8 uppercase border-b-4 border-black inline-block self-start pb-1">
                            Overall Status
                        </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <span className={`text-7xl font-black leading-none ${overallColors.textClass}`}>{overallPct}%</span>
                                {overallPct >= 75
                                    ? <span className="text-sm font-black bg-neo-success px-3 py-1 border-3 border-black shadow-neo-sm uppercase mb-1">Good Standing</span>
                                    : <span className="text-sm font-black bg-neo-danger px-3 py-1 border-3 border-black shadow-neo-sm uppercase mb-1">At Risk</span>
                                }
                            </div>
                            {/* Block progress bar */}
                            <div className="grid grid-cols-10 gap-1 w-full">
                                {Array.from({ length: 10 }).map((_, i) => {
                                    const filled = i < Math.round(overallPct / 10);
                                    return (
                                        <div key={i} className={`h-10 border-2 border-black ${filled ? overallColors.bar : "bg-white"}`}
                                            style={!filled ? { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)" } : {}} />
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-xs font-black uppercase text-black pt-2 border-t-2 border-black border-dashed">
                                <span>0%</span>
                                <span className="text-neo-primary">Threshold: 75%</span>
                                <span>100%</span>
                            </div>
                            <div className="flex justify-between mt-2 border-3 border-black p-4 bg-[#F0F0F0]">
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase text-black/60">Attended</p>
                                    <p className="text-2xl font-black">{totalPresent}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase text-black/60">Total</p>
                                    <p className="text-2xl font-black">{totalClasses}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase text-black/60">Absent</p>
                                    <p className="text-2xl font-black text-neo-danger">{totalClasses - totalPresent}</p>
                                </div>
                            </div>
                        </div>
                        <p className={`text-sm font-black text-black mt-4 p-4 border-3 border-black ${overallPct >= 75 ? "bg-neo-success/20" : "bg-neo-danger/20"}`}>
                            {overallPct >= 75
                                ? `✅ MAINTAINING ABOVE 75% THRESHOLD. YOU CAN MISS ${calcCanMiss(totalPresent, totalClasses)} MORE CLASSES.`
                                : `⚠️ BELOW 75% THRESHOLD. ATTEND ${calcRequired(totalPresent, totalClasses)} MORE CONSECUTIVE CLASSES TO RECOVER.`
                            }
                        </p>
                    </div>

                    {/* Right column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">

                        {/* Critical subject warnings */}
                        {criticalSubjects.length > 0 && (
                            <div className="border-3 border-black p-6 flex flex-col sm:flex-row items-center gap-6 shadow-neo-lg relative overflow-hidden"
                                style={{ backgroundImage: "repeating-linear-gradient(45deg, #FF4D4D, #FF4D4D 10px, #e02e2e 10px, #e02e2e 20px)" }}>
                                <div className="size-20 bg-white border-3 border-black flex items-center justify-center shrink-0 shadow-neo-sm z-10">
                                    <AlertTriangle className="w-10 h-10 text-black" />
                                </div>
                                <div className="flex-1 z-10 bg-white p-5 border-3 border-black shadow-neo-sm">
                                    <h3 className="text-2xl font-black text-black uppercase mb-1 flex items-center gap-2">
                                        <span className="bg-black text-white px-3 py-0.5 text-sm">WARNING</span>
                                        {criticalSubjects.length} Subject{criticalSubjects.length > 1 ? "s" : ""} Critical
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {criticalSubjects.map(s => (
                                            <span key={s.subject} className="bg-neo-danger px-2 py-1 border-2 border-black font-black text-xs uppercase">
                                                {s.subject} — {s.percentage}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Classes Calculator */}
                        {subjects.length > 0 && calculatorSubject && (
                            <div className="flex-1 bg-white border-3 border-black shadow-neo-lg p-6 flex flex-col">
                                <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
                                    <div className="bg-neo-accent border-3 border-black p-3 shadow-neo-sm">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl font-black text-black uppercase">Classes Calculator</h3>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8 items-stretch h-full">
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <label className="block text-sm font-black uppercase text-black mb-3 bg-[#F0F0F0] inline-block px-3 py-1 border-3 border-black">
                                                Select Subject
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={calculatorSubject.subject}
                                                    onChange={e => setCalcSubject(subjects.find(s => s.subject === e.target.value))}
                                                    className="w-full bg-white border-3 border-black text-black py-4 pl-5 pr-12 font-black appearance-none rounded-none text-lg uppercase outline-none shadow-neo-sm"
                                                >
                                                    {subjects.map(s => (
                                                        <option key={s.subject} value={s.subject}>
                                                            {s.subject} ({s.percentage}%)
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 border-l-3 border-black bg-neo-accent">
                                                    <span className="font-black">▾</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-[#F0F0F0] p-5 border-3 border-black">
                                            <div className="flex justify-between text-sm mb-3 font-black uppercase">
                                                <span>Current</span>
                                                <span className={`px-2 border-2 border-black shadow-neo-sm ${pctColor(calculatorSubject.percentage).badge}`}>
                                                    {calculatorSubject.percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-white border-3 border-black h-8 relative overflow-hidden">
                                                <div
                                                    className={`${pctColor(calculatorSubject.percentage).bar} h-full border-r-3 border-black`}
                                                    style={{ width: `${Math.min(calculatorSubject.percentage, 100)}%` }}
                                                />
                                                {/* 75% target marker */}
                                                <div className="absolute top-0 bottom-0 border-l-3 border-black border-dashed" style={{ left: "75%" }} />
                                            </div>
                                            <p className="text-xs font-black uppercase mt-2 text-black/60">
                                                {calculatorSubject.present}/{calculatorSubject.total} classes attended
                                            </p>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-1 bg-black self-stretch" />

                                    <div className="w-full md:min-w-[220px] flex flex-col gap-4">
                                        {calculatorSubject.percentage >= 75 ? (
                                            <div className="bg-white border-3 border-black p-5 shadow-neo-sm text-center">
                                                <p className="text-sm font-black uppercase border-b-3 border-black pb-2 mb-4">Can Still Miss</p>
                                                <div className="flex flex-col items-center justify-center py-4 bg-neo-success/20 border-3 border-black mb-3">
                                                    <span className="text-6xl font-black leading-none text-neo-black drop-shadow-[3px_3px_0_#4CAF50]">
                                                        {calcCanMiss(calculatorSubject.present, calculatorSubject.total)}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-black uppercase bg-neo-success px-3 py-1 border-2 border-black">Classes Safely</span>
                                            </div>
                                        ) : (
                                            <div className="bg-white border-3 border-black p-5 shadow-neo-sm text-center">
                                                <p className="text-sm font-black uppercase border-b-3 border-black pb-2 mb-4">Must Attend</p>
                                                <div className="flex flex-col items-center justify-center py-4 bg-neo-danger/20 border-3 border-black mb-3">
                                                    <span className="text-6xl font-black leading-none drop-shadow-[3px_3px_0_#FF4D4D]">
                                                        {calcRequired(calculatorSubject.present, calculatorSubject.total)}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-black uppercase bg-neo-danger px-3 py-1 border-2 border-black text-white">Consecutive Classes</span>
                                            </div>
                                        )}
                                        <p className="text-xs font-black text-gray-500 text-center italic uppercase">*to maintain/reach 75% threshold</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Tabs: Subject Breakdown / Recent History ── */}
                {subjects.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-0 border-b-4 border-black">
                            {[
                                { id: "breakdown", label: "Subject Breakdown" },
                                { id: "history", label: "Recent History" },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-3 font-black text-sm uppercase border-t-3 border-x-3 border-black transition-colors
                                        ${activeTab === tab.id ? "bg-black text-white" : "bg-white hover:bg-neo-accent"}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Subject Breakdown Table */}
                        {activeTab === "breakdown" && (
                            <div className="bg-white border-4 border-black shadow-neo-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-black text-white">
                                                <th className="p-5 text-sm font-black uppercase tracking-widest border-r-3 border-white/40">Subject</th>
                                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center border-r-3 border-white/40">Total</th>
                                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center border-r-3 border-white/40">Attended</th>
                                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center border-r-3 border-white/40">Missed</th>
                                                <th className="p-5 text-sm font-black uppercase tracking-widest text-left pl-8 border-r-3 border-white/40">Progress</th>
                                                <th className="p-5 text-sm font-black uppercase tracking-widest text-right border-r-3 border-white/40">Status</th>
                                                <th className="p-5 text-sm font-black uppercase tracking-widest text-center">Need</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-4 divide-black text-black">
                                            {subjects.map((s, i) => {
                                                const colors = pctColor(s.percentage);
                                                const need = calcRequired(s.present, s.total);
                                                return (
                                                    <tr key={s.subject} className={`group hover:bg-[#F0F0F0] transition-colors ${s.percentage < 75 ? "bg-red-50" : ""}`}>
                                                        <td className="p-5 border-r-3 border-black">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`size-12 border-3 border-black flex items-center justify-center text-xl shadow-neo-sm group-hover:scale-110 transition-transform ${colors.badge}`}>
                                                                    {SUBJECT_ICONS[i % SUBJECT_ICONS.length]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-base font-black uppercase">{s.subject}</p>
                                                                    <p className="text-xs font-bold text-black/50 uppercase">{s.type} · Sec {s.section}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-center font-black text-xl border-r-3 border-black">{s.total}</td>
                                                        <td className="p-5 text-center font-black text-xl border-r-3 border-black text-neo-success">{s.present}</td>
                                                        <td className={`p-5 text-center font-black text-xl border-r-3 border-black ${s.absent > 0 ? "text-neo-danger bg-red-50" : ""}`}>{s.absent}</td>
                                                        <td className="p-5 pl-8 border-r-3 border-black">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex-1 h-7 min-w-32 bg-white border-3 border-black relative overflow-hidden">
                                                                    <div className={`h-full border-r-3 border-black ${colors.bar}`}
                                                                        style={{ width: `${Math.min(s.percentage, 100)}%`, backgroundImage: s.percentage < 75 ? "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(0,0,0,0.1) 8px,rgba(0,0,0,0.1) 16px)" : "none" }} />
                                                                </div>
                                                                <span className={`text-base font-black px-2 border-2 border-black shadow-neo-sm ${colors.badge}`}>{s.percentage}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-right border-r-3 border-black">
                                                            <span className={`inline-flex items-center px-4 py-2 font-black text-xs uppercase border-3 border-black shadow-neo-sm ${colors.badge}`}>
                                                                {colors.label}
                                                            </span>
                                                        </td>
                                                        <td className="p-5 text-center">
                                                            {need > 0
                                                                ? <span className="font-black text-neo-danger text-sm border-2 border-black px-2 py-1 bg-red-50">+{need} to attend</span>
                                                                : <CheckCircle className="w-6 h-6 text-neo-success mx-auto" />
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Recent History */}
                        {activeTab === "history" && (
                            <div className="bg-white border-4 border-black shadow-neo-lg overflow-hidden">
                                {perDate.length === 0 ? (
                                    <div className="py-12 text-center font-black text-slate-400 uppercase">No attendance records yet</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-black text-white">
                                                    <th className="p-4 text-sm font-black uppercase border-r-3 border-white/40">Date</th>
                                                    <th className="p-4 text-sm font-black uppercase border-r-3 border-white/40">Subject</th>
                                                    <th className="p-4 text-sm font-black uppercase border-r-3 border-white/40">Type</th>
                                                    <th className="p-4 text-sm font-black uppercase border-r-3 border-white/40">Room</th>
                                                    <th className="p-4 text-sm font-black uppercase text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-3 divide-black">
                                                {perDate.map((r, i) => (
                                                    <tr key={i} className={`hover:bg-[#F0F0F0] transition-colors ${r.status === "absent" ? "bg-red-50" : ""}`}>
                                                        <td className="p-4 border-r-3 border-black">
                                                            <div>
                                                                <p className="font-black text-sm">{formatDate(r.date)}</p>
                                                                <p className="text-xs font-mono text-slate-500">{r.time ? r.time.slice(0, 5) : "—"}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-black text-sm border-r-3 border-black">{r.subject}</td>
                                                        <td className="p-4 border-r-3 border-black">
                                                            <span className={`text-[10px] font-black uppercase border border-black px-1.5 py-0.5 
                                                                ${r.type === "Lab" ? "bg-neo-green" : r.type === "Tutorial" ? "bg-neo-yellow" : "bg-neo-blue"}`}>
                                                                {r.type}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm font-bold text-slate-600 border-r-3 border-black">{r.room || "—"}</td>
                                                        <td className="p-4 text-center">
                                                            {r.status === "present"
                                                                ? <span className="inline-flex items-center gap-1.5 bg-neo-success border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-neo-sm">
                                                                    <CheckCircle className="w-3.5 h-3.5" /> Present
                                                                </span>
                                                                : <span className="inline-flex items-center gap-1.5 bg-neo-danger text-white border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-neo-sm">
                                                                    <XCircle className="w-3.5 h-3.5" /> Absent
                                                                </span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Empty state if no records at all */}
                {subjects.length === 0 && (
                    <div className="bg-white border-3 border-black p-12 shadow-neo flex flex-col items-center gap-3 text-slate-400">
                        <Clock className="w-12 h-12 opacity-20" />
                        <p className="font-black uppercase text-lg">No Attendance Records Yet</p>
                        <p className="text-sm font-bold">Your faculty hasn't marked attendance for your section yet.</p>
                        <p className="text-xs font-mono mt-1">Linked as: {student.name} · {student.roll_no}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
