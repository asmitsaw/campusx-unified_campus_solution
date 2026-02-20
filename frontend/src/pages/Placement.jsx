import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPost } from '../utils/api';
import {
  Search, TrendingUp, Check, Code, Users, Award,
  FileText, MonitorPlay, ArrowRight, Briefcase,
  Loader2, AlertCircle, CalendarDays, BookOpen, Building2
} from 'lucide-react';

const STATUS_STEPS = ["Applied", "Shortlisted", "Coding Round", "Interview", "Selected"];
const STATUS_COLOR = {
  Applied: "bg-neo-blue",
  Shortlisted: "bg-neo-yellow",
  "Coding Round": "bg-neo-strong-purple",
  Interview: "bg-neo-accent-orange",
  Selected: "bg-neo-green",
  Rejected: "bg-neo-primary",
};

const STEP_ICON = [Check, Check, Code, Users, Award];

export default function Placement() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("drives");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, d, a, t] = await Promise.all([
        apiGet("/placements/stats"),
        apiGet("/placements/drives"),
        apiGet("/placements/my-applications"),
        apiGet("/placements/training-sessions"),
      ]);
      setStats(s.data);
      setDrives(d.data || []);
      setMyApps(a.data || []);
      setTrainingSessions(t.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApply = async (placement_id) => {
    setApplying(placement_id);
    try {
      await apiPost("/placements/apply", { placement_id });
      showToast("Applied successfully! 🎉");
      fetchAll();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setApplying(null);
    }
  };

  const getApplicationForDrive = (driveId) =>
    myApps.find(a => a.placement_id === driveId);

  const filteredDrives = drives.filter(d =>
    d.company?.toLowerCase().includes(search.toLowerCase()) ||
    d.role?.toLowerCase().includes(search.toLowerCase())
  );

  const activeDriveApp = myApps.find(a => ["Applied", "Shortlisted", "Coding Round", "Interview"].includes(a.status));

  const TABS = [
    { key: "drives", label: "Open Drives" },
    { key: "applications", label: "My Applications" },
    { key: "training", label: "Training Sessions" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-black uppercase">Loading Placement Hub...</p>
        </div>
      </div>
    );
  }

  // Show setup guide if tables are missing
  if (error && (error.includes("non-JSON") || error.includes("does not exist") || error.includes("relation"))) {
    return (
      <div className="min-h-screen bg-neo-bg font-sans p-8 text-black flex items-center justify-center">
        <div className="max-w-xl w-full bg-white border-3 border-black shadow-neo-lg p-8">
          <div className="bg-neo-yellow border-3 border-black px-4 py-2 font-black uppercase text-sm mb-6 w-fit shadow-neo-sm">⚠️ Setup Required</div>
          <h2 className="text-3xl font-black uppercase mb-4">Supabase Tables Missing</h2>
          <p className="font-bold text-gray-700 mb-6">The placement database tables haven't been created yet. Follow these steps:</p>
          <ol className="space-y-3 text-sm font-bold">
            <li className="flex gap-3 items-start bg-neo-bg border-2 border-black p-3">
              <span className="bg-black text-white font-black px-2 py-0.5 text-xs shrink-0">1</span>
              <span>Open your <a href="https://supabase.com/dashboard" target="_blank" className="underline text-blue-600">Supabase Dashboard</a></span>
            </li>
            <li className="flex gap-3 items-start bg-neo-bg border-2 border-black p-3">
              <span className="bg-black text-white font-black px-2 py-0.5 text-xs shrink-0">2</span>
              <span>Go to <strong>SQL Editor</strong></span>
            </li>
            <li className="flex gap-3 items-start bg-neo-bg border-2 border-black p-3">
              <span className="bg-black text-white font-black px-2 py-0.5 text-xs shrink-0">3</span>
              <span>Paste and run the contents of <code className="bg-neo-yellow px-1 border border-black">backend/setup_placements.sql</code></span>
            </li>
            <li className="flex gap-3 items-start bg-neo-bg border-2 border-black p-3">
              <span className="bg-black text-white font-black px-2 py-0.5 text-xs shrink-0">4</span>
              <span>Refresh this page</span>
            </li>
          </ol>
          <button onClick={fetchAll} className="mt-6 bg-black text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-green hover:text-black transition-colors flex items-center gap-2">
            <Loader2 size={16} /> Retry Connection
          </button>
          <p className="mt-4 text-xs text-gray-500 font-bold border-l-4 border-neo-primary pl-3">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-neo-bg font-sans p-6 md:p-8 text-black relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 border-3 border-black px-5 py-3 font-black shadow-neo text-sm uppercase flex items-center gap-2 ${toast.type === "error" ? "bg-neo-primary text-white" : "bg-neo-green"}`}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-3 border-black pb-6 gap-4">
        <div className="border-l-8 border-black pl-4">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Placement Hub</h1>
          <p className="text-sm font-bold text-gray-600 mt-1 uppercase">Welcome, {user?.name || "Student"}! 🎯</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="SEARCH COMPANIES, ROLES..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 border-3 border-black shadow-neo-sm focus:outline-none font-bold w-full placeholder:text-gray-400 text-sm bg-white"
          />
        </div>
      </header>

      {error && (
        <div className="bg-neo-primary border-3 border-black p-4 mb-6 text-white font-bold flex items-center gap-3 shadow-neo">
          <AlertCircle size={20} />
          {error} — <button className="underline" onClick={fetchAll}>Retry</button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all">
          <p className="text-[10px] font-black uppercase bg-black text-white px-2 mb-3 w-fit">Avg Package</p>
          <div className="text-4xl font-black">{stats?.avg_package || 0} <span className="text-base">LPA</span></div>
          <div className="w-full bg-white h-3 border-2 border-black mt-3 relative">
            <div className="absolute top-0 left-0 h-full bg-black" style={{ width: `${Math.min((stats?.avg_package || 0) / 50 * 100, 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-neo-pink border-3 border-black p-5 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all">
          <p className="text-[10px] font-black uppercase bg-black text-white px-2 mb-3 w-fit">Highest Pkg</p>
          <div className="text-4xl font-black">{stats?.highest_package || 0} <span className="text-base">LPA</span></div>
          <div className="w-full bg-white h-3 border-2 border-black mt-3 relative">
            <div className="absolute top-0 left-0 h-full bg-black" style={{ width: `${Math.min((stats?.highest_package || 0) / 100 * 100, 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all">
          <p className="text-[10px] font-black uppercase bg-black text-white px-2 mb-3 w-fit">Placed</p>
          <div className="text-4xl font-black">{stats?.students_placed || 0}</div>
          <p className="text-xs font-bold mt-3 uppercase">Students Selected</p>
        </div>
        <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all">
          <p className="text-[10px] font-black uppercase bg-black text-white px-2 mb-3 w-fit">Active Drives</p>
          <div className="text-4xl font-black">{stats?.active_drives || 0}</div>
          <p className="text-xs font-bold mt-3 uppercase">Currently Open</p>
        </div>
      </div>

      {/* Journey Tracker for active application */}
      {activeDriveApp && (
        <div className="bg-white border-3 border-black p-6 md:p-8 shadow-neo-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">Your Journey</div>
          <div className="mb-10">
            <h3 className="text-2xl font-black uppercase mb-1">{activeDriveApp.placements?.company}</h3>
            <p className="text-gray-500 font-bold uppercase text-sm">{activeDriveApp.placements?.role}</p>
          </div>

          <div className="relative flex justify-between items-center px-2 md:px-6 mb-6">
            {/* Track background */}
            <div className="absolute top-6 left-0 w-full h-3 bg-gray-200 border-y-2 border-gray-300 -z-10"></div>
            {/* Active track */}
            {(() => {
              const idx = STATUS_STEPS.indexOf(activeDriveApp.status);
              const pct = idx >= 0 ? `${(idx / (STATUS_STEPS.length - 1)) * 100}%` : "0%";
              return <div className="absolute top-6 left-0 h-3 bg-neo-strong-purple border-y-2 border-black -z-10 transition-all" style={{ width: pct }}></div>;
            })()}

            {STATUS_STEPS.map((step, i) => {
              const Icon = STEP_ICON[i];
              const activeIdx = STATUS_STEPS.indexOf(activeDriveApp.status);
              const isDone = i < activeIdx;
              const isCurrent = i === activeIdx;
              const isFuture = i > activeIdx;

              return (
                <div key={step} className="flex flex-col items-center gap-3 group">
                  <div className={`flex items-center justify-center border-3 border-black shadow-neo-sm transition-all
                    ${isCurrent ? "w-14 h-14 bg-neo-strong-purple animate-bounce" : isDone ? "w-10 h-10 bg-neo-green" : "w-10 h-10 bg-white opacity-50"}`}>
                    <Icon className={`${isCurrent ? "w-7 h-7 text-white" : "w-5 h-5 text-black"} stroke-[3]`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase whitespace-nowrap ${isCurrent ? "bg-black text-white px-2 py-1 -rotate-3 shadow-sm" : isFuture ? "text-gray-400" : ""}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Tabs + Content */}
        <div className="lg:col-span-8 space-y-6">

          {/* Tabs */}
          <div className="flex border-3 border-black overflow-hidden shadow-neo-sm">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 font-black text-xs uppercase border-r-2 last:border-r-0 border-black transition-colors
                  ${activeTab === tab.key ? "bg-black text-white" : "bg-white hover:bg-neo-bg"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Open Drives Tab */}
          {activeTab === "drives" && (
            <div className="space-y-4">
              {filteredDrives.length === 0 && (
                <div className="bg-white border-3 border-black p-8 text-center shadow-neo">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-black uppercase text-gray-400">No drives found</p>
                </div>
              )}
              {filteredDrives.map((drive) => {
                const myApp = getApplicationForDrive(drive.id);
                return (
                  <div key={drive.id} className="bg-white border-3 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <div className={`px-6 py-2 text-xs font-black uppercase ${drive.status === "Active" ? "bg-neo-green" : drive.status === "Upcoming" ? "bg-neo-blue" : "bg-neo-yellow"} border-b-3 border-black flex justify-between items-center`}>
                      <span>{drive.status}</span>
                      <span>{drive.type || "On-Campus"}</span>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 border-3 border-black bg-neo-bg flex items-center justify-center font-black text-xl shadow-neo-sm">
                            {drive.company?.[0]}
                          </div>
                          <div>
                            <h3 className="font-black text-xl uppercase">{drive.company}</h3>
                            <p className="text-sm font-bold text-gray-600">{drive.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold">
                          <span className="bg-neo-yellow border-2 border-black px-2 py-1">💰 {drive.package_lpa} LPA</span>
                          <span className="bg-white border-2 border-black px-2 py-1">📅 Deadline: {drive.deadline ? new Date(drive.deadline).toLocaleDateString() : "TBD"}</span>
                          {drive.location && <span className="bg-white border-2 border-black px-2 py-1">📍 {drive.location}</span>}
                          {drive.drive_date && <span className="bg-neo-blue border-2 border-black px-2 py-1">🗓️ Drive: {new Date(drive.drive_date).toLocaleDateString()}</span>}
                        </div>
                        {drive.eligibility && (
                          <p className="mt-3 text-xs font-bold text-gray-500 border-l-4 border-black pl-3">{drive.eligibility}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3 min-w-[140px]">
                        {myApp ? (
                          <div className={`${STATUS_COLOR[myApp.status] || "bg-gray-200"} border-3 border-black px-4 py-2 text-xs font-black uppercase shadow-neo-sm text-center`}>
                            {myApp.status}
                          </div>
                        ) : drive.status === "Active" ? (
                          <button
                            onClick={() => handleApply(drive.id)}
                            disabled={!!applying}
                            className="bg-black text-white border-3 border-black px-6 py-2 font-black uppercase text-sm hover:bg-neo-green hover:text-black transition-colors shadow-neo-sm active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center gap-2"
                          >
                            {applying === drive.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Apply Now
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 uppercase">{drive.status}</span>
                        )}
                        {drive.description && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase text-right max-w-[160px] leading-tight">{drive.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* My Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-4">
              {myApps.length === 0 && (
                <div className="bg-white border-3 border-black p-8 text-center shadow-neo">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-black uppercase text-gray-400">No Applications Yet</p>
                  <p className="text-sm font-bold text-gray-400 mt-2">Browse open drives and apply!</p>
                </div>
              )}
              {myApps.map((app) => (
                <div key={app.id} className="bg-white border-3 border-black shadow-neo">
                  <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border-3 border-black bg-neo-bg flex items-center justify-center font-black text-xl shadow-neo-sm">
                        {app.placements?.company?.[0]}
                      </div>
                      <div>
                        <p className="font-black text-lg uppercase">{app.placements?.company}</p>
                        <p className="text-sm font-bold text-gray-600">{app.placements?.role} — {app.placements?.package_lpa} LPA</p>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`${STATUS_COLOR[app.status] || "bg-gray-200"} border-3 border-black px-4 py-2 text-sm font-black uppercase shadow-neo-sm whitespace-nowrap`}>
                      {app.status}
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="border-t-3 border-black px-5 py-3 flex gap-1">
                    {STATUS_STEPS.map((step, i) => {
                      const activeIdx = STATUS_STEPS.indexOf(app.status);
                      return (
                        <div
                          key={step}
                          title={step}
                          className={`flex-1 h-2 border border-black ${i <= activeIdx ? "bg-black" : "bg-gray-200"}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Training Sessions Tab */}
          {activeTab === "training" && (
            <div className="space-y-4">
              {trainingSessions.length === 0 && (
                <div className="bg-white border-3 border-black p-8 text-center shadow-neo">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-black uppercase text-gray-400">No Training Sessions Scheduled</p>
                </div>
              )}
              {trainingSessions.map((session) => (
                <div key={session.id} className="bg-white border-3 border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className={`px-5 py-2 border-b-3 border-black text-xs font-black uppercase bg-neo-accent`}>
                    {session.type || "General"} Training
                    {session.placements && <span className="ml-2 opacity-70">— {session.placements.company}</span>}
                  </div>
                  <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-black text-lg uppercase mb-1">{session.title}</h3>
                      {session.description && <p className="text-sm font-bold text-gray-600 mb-3">{session.description}</p>}
                      <div className="flex flex-wrap gap-3 text-xs font-bold">
                        {session.date && <span className="bg-neo-yellow border-2 border-black px-2 py-1">📅 {new Date(session.date).toLocaleDateString()}</span>}
                        {session.time && <span className="bg-white border-2 border-black px-2 py-1">⏰ {session.time}</span>}
                        {session.venue && <span className="bg-neo-blue border-2 border-black px-2 py-1">📍 {session.venue}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Profile + Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Student Profile Card */}
          <div className="bg-neo-accent border-3 border-black p-6 shadow-neo-lg text-center group">
            <div className="w-24 h-24 mx-auto bg-white border-3 border-black mb-4 overflow-hidden shadow-neo-sm group-hover:scale-105 transition-transform">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "student"}&backgroundColor=c0aede`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border-3 border-black inline-block px-4 py-2 font-black text-lg mb-1 shadow-neo-sm transform -rotate-1 group-hover:rotate-0 transition-transform">
              {user?.name?.toUpperCase() || "STUDENT"}
            </div>
            <div className="font-bold text-xs uppercase tracking-widest mb-6 mt-2 text-gray-700">{user?.email}</div>

            <div className="space-y-3">
              <div className="bg-white border-3 border-black p-3 flex justify-between items-center shadow-neo-sm">
                <div className="flex items-center gap-2 font-bold text-xs uppercase">
                  <div className="bg-neo-accent-orange p-1 border-2 border-black"><Award size={14} /></div>
                  My Applications
                </div>
                <span className="text-2xl font-black">{myApps.length}</span>
              </div>
              <div className="bg-white border-3 border-black p-3 flex justify-between items-center shadow-neo-sm">
                <div className="flex items-center gap-2 font-bold text-xs uppercase">
                  <div className="bg-neo-green p-1 border-2 border-black"><Check size={14} /></div>
                  Shortlisted
                </div>
                <span className="text-2xl font-black">{myApps.filter(a => ["Shortlisted", "Coding Round", "Interview", "Selected"].includes(a.status)).length}</span>
              </div>
              <div className="bg-white border-3 border-black p-3 flex justify-between items-center shadow-neo-sm">
                <div className="flex items-center gap-2 font-bold text-xs uppercase">
                  <div className="bg-neo-blue p-1 border-2 border-black"><Building2 size={14} /></div>
                  Open Drives
                </div>
                <span className="text-2xl font-black">{drives.filter(d => d.status === "Active").length}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Drives Checklist */}
          <div className="bg-white border-3 border-black p-6 shadow-neo-lg">
            <h3 className="text-xl font-black uppercase mb-5 border-b-3 border-black pb-3 flex items-center gap-2">
              <CalendarDays size={20} /> Open Drives
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {drives.filter(d => d.status === "Active").slice(0, 6).map((drive) => {
                const applied = getApplicationForDrive(drive.id);
                return (
                  <div key={drive.id} className="flex items-center gap-3 hover:bg-neo-bg transition-colors p-2 cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-neo-green border border-black flex-shrink-0 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase leading-none truncate">{drive.company}</p>
                      <p className="text-[10px] font-bold text-gray-500 mt-0.5">{drive.role} · {drive.package_lpa} LPA</p>
                    </div>
                    {applied ? (
                      <span className="text-[9px] font-black bg-neo-green border border-black px-1.5 py-0.5">APPLIED</span>
                    ) : (
                      <button
                        onClick={() => handleApply(drive.id)}
                        disabled={!!applying}
                        className="text-[9px] font-black bg-black text-white border border-black px-1.5 py-0.5 hover:bg-neo-green hover:text-black transition-colors"
                      >
                        APPLY
                      </button>
                    )}
                  </div>
                );
              })}
              {drives.filter(d => d.status === "Active").length === 0 && (
                <p className="text-sm font-bold text-gray-400 text-center py-4">No active drives right now</p>
              )}
            </div>
          </div>

          {/* Upcoming Training */}
          <div className="bg-neo-strong-blue border-3 border-black p-6 shadow-neo-lg text-white">
            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2" style={{ textShadow: "2px 2px 0px #000" }}>
              <BookOpen size={20} /> Training
            </h3>
            <div className="space-y-3">
              {trainingSessions.slice(0, 3).map((s) => (
                <div key={s.id} className="bg-white/10 border-2 border-white/30 p-3 hover:bg-white/20 transition-colors">
                  <p className="font-black text-sm uppercase leading-none">{s.title}</p>
                  <p className="text-[10px] font-bold opacity-70 mt-1">{s.date ? new Date(s.date).toLocaleDateString() : "TBD"} {s.time ? `· ${s.time}` : ""}</p>
                </div>
              ))}
              {trainingSessions.length === 0 && (
                <p className="text-sm font-bold opacity-60 text-center py-3">No upcoming sessions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
