import React, { useState, useEffect, useCallback } from "react";
import { Loader, Calendar, Clock, MapPin, ArrowRight, Info, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5055/api/ev-events";
const STATIC = "http://localhost:5055";

const CAT_COLORS = {
  Technical:  { bg: "bg-neo-blue",      text: "text-black" },
  Cultural:   { bg: "bg-neo-secondary", text: "text-black" },
  Placement:  { bg: "bg-neo-accent",    text: "text-black" },
  Workshop:   { bg: "bg-neo-green",     text: "text-black" },
  Sports:     { bg: "bg-red-500",       text: "text-white" },
  Seminar:    { bg: "bg-[#A259FF]",     text: "text-white" },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmt12h(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00")
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}
function bannerUrl(path) {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${STATIC}/uploads/events/${path}`;
}

export default function Events() {
  const { token } = useAuth();
  const [events,    setEvents]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [filter,    setFilter]    = useState("All");
  const [search,    setSearch]    = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEvents(data.filter(e => e.status === "Active"));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleRegister = async (id) => {
    if (!token) {
        alert("Please login to register for events");
        return;
    }
    try {
        const res = await fetch(`${API}/${id}/register`, { 
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) alert(data.message);
        else {
            alert("Successfully registered!");
            fetchEvents();
        }
    } catch (e) {
        alert("Registration failed");
    }
  };

  const filtered = events.filter(e => {
    const matchesCat = filter === "All" || e.category === filter;
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const spotlight = events[0];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-neo-bg">
      <Loader className="w-12 h-12 animate-spin text-neo-black" />
    </div>
  );

  return (
    <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
        
        {/* Spotlight Section */}
        {spotlight && filter === "All" && !search && (
          <section className="animate-in fade-in duration-700">
            <div className="relative overflow-hidden border-3 border-neo-black bg-white shadow-neo-lg">
              <div className="flex flex-col lg:flex-row">
                <div className="relative z-10 flex flex-col items-start gap-6 p-8 md:p-12 lg:w-3/5 lg:p-16 bg-white border-b-3 lg:border-b-0 lg:border-r-3 border-neo-black">
                  <div className="inline-flex items-center gap-2 border-3 border-neo-black bg-neo-red px-4 py-1.5 shadow-neo-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white border border-black"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-white">Featured Event</span>
                  </div>
                  
                  <div>
                    <h1 className="font-display text-4xl font-black leading-none text-neo-black md:text-6xl uppercase truncate max-w-full">
                      {spotlight.title}
                    </h1>
                    <p className="mt-6 max-w-xl text-lg font-medium text-neo-black border-l-4 border-neo-accent pl-4">
                      {spotlight.description || "Don't miss out on this amazing opportunity!"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button 
                      onClick={() => handleRegister(spotlight.id)}
                      className="flex items-center gap-2 border-3 border-neo-black bg-neo-black px-8 py-3.5 text-sm font-bold uppercase text-white shadow-neo-sm transition-all hover:-translate-y-1 hover:bg-neo-primary hover:shadow-neo">
                      <span>Register Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 border-3 border-neo-black bg-neo-accent px-6 py-3.5 text-sm font-black uppercase text-neo-black shadow-neo-sm">
                      {spotlight.total_seats - spotlight.registered} Seats Left
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 w-full">
                    {[
                      { icon: Calendar, label: fmtDate(spotlight.date) },
                      { icon: Clock, label: `${fmt12h(spotlight.time_start)} - ${fmt12h(spotlight.time_end)}` },
                      { icon: MapPin, label: spotlight.venue },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center border-3 border-neo-black bg-neo-bg p-3 shadow-neo-sm transition-all hover:bg-neo-blue">
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-black uppercase text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-2/5 relative min-h-[300px] bg-neo-black">
                  {spotlight.banner_path ? (
                    <img src={bannerUrl(spotlight.banner_path)} alt={spotlight.title} className="h-full w-full object-cover grayscale mix-blend-hard-light hover:grayscale-0 transition-all duration-500 opacity-90" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-neo-accent">
                        <Loader className="w-20 h-20 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center border-b-3 border-neo-black pb-4">
            <h2 className="text-4xl font-black uppercase text-neo-black tracking-tighter decoration-neo-accent decoration-4 underline underline-offset-4">
              Explore Events
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neo-black" />
                <input 
                  type="text" 
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-3 border-neo-black px-10 py-2 font-bold outline-none shadow-neo-sm group-focus-within:bg-neo-yellow transition-all"
                />
              </div>

              <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
                {["All", ...Object.keys(CAT_COLORS)].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`whitespace-nowrap border-3 border-neo-black px-6 py-2 text-sm font-bold uppercase shadow-neo-sm transition-all
                      ${filter === cat ? "bg-neo-black text-white" : "bg-white text-neo-black hover:bg-neo-blue"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {filtered.length === 0 ? (
            <div className="p-20 text-center border-3 border-dashed border-gray-400 bg-white">
               <p className="text-2xl font-black uppercase text-gray-400">No events found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((ev) => {
                const colors = CAT_COLORS[ev.category] || { bg: "bg-white", text: "text-black" };
                const left = ev.total_seats - (ev.registered || 0);
                
                return (
                  <article key={ev.id} className="group relative flex flex-col border-3 border-neo-black bg-white shadow-neo transition-all duration-300 hover:-translate-y-2 hover:shadow-neo-lg">
                    <div className="relative aspect-[4/3] w-full border-b-3 border-neo-black overflow-hidden">
                      {ev.banner_path ? (
                        <img src={bannerUrl(ev.banner_path)} alt={ev.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <Loader className="w-10 h-10 text-gray-400 animate-pulse" />
                        </div>
                      )}
                      <div className={`absolute right-0 top-0 border-b-3 border-l-3 border-neo-black ${colors.bg} px-4 py-1.5 text-xs font-black uppercase ${colors.text}`}>
                        {ev.category}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-5 bg-white">
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-neo-black uppercase leading-tight line-clamp-2 min-h-[3rem]">{ev.title}</h3>
                        <p className="text-xs font-semibold text-gray-500 mt-2 border-l-2 border-neo-black pl-2 line-clamp-2">
                          {ev.description || "Join us for this event!"}
                        </p>
                      </div>

                      <div className="mb-5 flex flex-col gap-2 bg-neo-bg p-3 border-2 border-neo-black">
                        <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                          <Calendar className="w-4 h-4 text-neo-primary" />
                          <span>{fmtDate(ev.date)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                          <Clock className="w-4 h-4 text-neo-primary" />
                          <span>{fmt12h(ev.time_start)} - {fmt12h(ev.time_end)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-neo-black">
                          <MapPin className="w-4 h-4 text-neo-primary" />
                          <span>{ev.venue}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <div className={`text-xs font-black border-2 border-neo-black px-2 py-1 uppercase shadow-neo-xs
                          ${left <= 10 ? "bg-neo-red text-white" : "bg-neo-green text-black"}`}>
                          {left > 0 ? `${left} Seats left` : "FULL"}
                        </div>
                        <button 
                          onClick={() => handleRegister(ev.id)}
                          disabled={left <= 0}
                          className={`border-2 border-neo-black px-4 py-2 text-xs font-black uppercase transition-all shadow-neo-sm active:translate-y-1 active:shadow-none
                            ${left > 0 ? "bg-neo-black text-white hover:bg-neo-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                          {left > 0 ? "Register" : "Full"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
