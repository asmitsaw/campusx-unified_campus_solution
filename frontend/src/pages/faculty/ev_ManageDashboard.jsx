import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar, Clock, MapPin, Users, Plus, Edit,
  Trash2, Image, Tag, AlignLeft, Hash, Loader, X, Eye, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/ev-events";
const STATIC = "http://localhost:5000";

const CATEGORIES = ["Technical", "Cultural", "Placement", "Workshop", "Sports", "Seminar"];

const CAT_COLORS = {
  Technical:  { bg: "bg-[#00BFFF]", text: "text-black" },
  Cultural:   { bg: "bg-[#FF6FD8]", text: "text-black" },
  Placement:  { bg: "bg-[#FFE600]", text: "text-black" },
  Workshop:   { bg: "bg-[#39FF14]", text: "text-black" },
  Sports:     { bg: "bg-[#FF3131]", text: "text-white" },
  Seminar:    { bg: "bg-[#A259FF]", text: "text-white" },
};

const EMPTY_FORM = {
  title: "", description: "", category: "Technical",
  date: "", time_start: "", time_end: "",
  venue: "", total_seats: "", status: "Active",
  bannerFile: null, bannerPreview: "",
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

// ── Field component — OUTSIDE the main component so it never remounts ─────────
function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </label>
      {children}
      {error && <p className="text-xs font-bold text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(err) {
  return `w-full border-[2px] ${err ? "border-red-500" : "border-black"} px-3 py-2.5 font-bold text-sm outline-none focus:bg-yellow-50 transition-colors`;
}

// ... cleaned up ParticipantModal ...

// ── Live card preview ─────────────────────────────────────────────────────────
function EventCardPreview({ form }) {
  const cat  = CAT_COLORS[form.category] || CAT_COLORS.Technical;
  const seats = parseInt(form.total_seats) || 0;

  return (
    <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000] w-full max-w-[280px]">
      <div className="relative h-[150px] bg-[#d9c5a8] overflow-hidden border-b-[3px] border-black">
        {form.bannerPreview ? (
          <img src={form.bannerPreview} alt="banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-10 h-10 text-[#b89a72] opacity-50" />
          </div>
        )}
        <span className={`absolute top-2 right-2 ${cat.bg} ${cat.text} font-black text-[9px] uppercase px-2 py-0.5 border-[2px] border-black`}>
          {form.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-black text-base uppercase leading-tight mb-1">
          {form.title || "Event Title"}
        </h3>
        <p className="text-xs font-bold text-gray-500 mb-3 border-l-[3px] border-black pl-2 line-clamp-2">
          {form.description || "Event description…"}
        </p>
        <div className="bg-[#f4f4f4] border-[2px] border-black px-3 py-2 space-y-1 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Calendar className="w-3 h-3 flex-shrink-0" />{fmtDate(form.date)}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {form.time_start && form.time_end
              ? `${fmt12h(form.time_start)} – ${fmt12h(form.time_end)}`
              : "10:00 AM – 4:00 PM"}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <MapPin className="w-3 h-3 flex-shrink-0" />{form.venue || "Venue"}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2 py-1 font-black text-[10px] uppercase border-[2px] border-black ${seats > 0 ? "bg-[#39FF14] text-black" : "bg-gray-200 text-gray-400"}`}>
            {seats > 0 ? `${seats} SEATS LEFT` : "— SEATS"}
          </span>
          <button className="px-3 py-1 bg-black text-white font-black text-[10px] uppercase border-[2px] border-black">
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EvManageDashboard() {
  const navigate = useNavigate();
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [toast,    setToast]    = useState(null);
  const fileRef = useRef();

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch events ─────────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEvents(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // ── Form helpers ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM); setEditId(null); setErrors({}); setShowForm(true);
  };
  const openEdit = (ev) => {
    setForm({
      title:        ev.title,
      description:  ev.description || "",
      category:     ev.category,
      date:         ev.date,
      time_start:   ev.time_start?.slice(0, 5) || "",
      time_end:     ev.time_end?.slice(0, 5) || "",
      venue:        ev.venue,
      total_seats:  String(ev.total_seats),
      status:       ev.status,
      bannerFile:   null,
      bannerPreview: ev.banner_path ? bannerUrl(ev.banner_path) : "",
    });
    setEditId(ev.id); setErrors({}); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const onChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm(f => ({ ...f, bannerFile: file, bannerPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())                         e.title      = "Title is required";
    if (!form.date)                                  e.date       = "Date is required";
    if (!form.time_start)                            e.time_start = "Start time required";
    if (!form.time_end)                              e.time_end   = "End time required";
    if (!form.venue.trim())                          e.venue      = "Venue is required";
    if (!form.total_seats || +form.total_seats < 1) e.total_seats = "Enter valid seat count";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("category",    form.category);
      fd.append("date",        form.date);
      fd.append("time_start",  form.time_start);
      fd.append("time_end",    form.time_end);
      fd.append("venue",       form.venue);
      fd.append("total_seats", form.total_seats);
      fd.append("status",      form.status);
      if (form.bannerFile) fd.append("banner", form.bannerFile);

      const url    = editId !== null ? `${API}/${editId}` : API;
      const method = editId !== null ? "PUT" : "POST";
      const res    = await fetch(url, { method, body: fd });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(editId !== null ? "Event updated!" : "Event created!");
      closeForm();
      fetchEvents();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Event deleted.");
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const totalReg = events.reduce((a, e) => a + (e.registered || 0), 0);
  const active   = events.filter(e => e.status === "Active").length;
  const drafts   = events.filter(e => e.status === "Draft").length;

  return (
    <div className="font-display bg-[#f0f0f0] text-black min-h-screen p-6 -m-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[110] px-5 py-3 border-[3px] border-black font-black text-sm shadow-[4px_4px_0px_0px_#000]
          ${toast.type === "error" ? "bg-[#FF3131] text-white" : "bg-[#39FF14] text-black"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">

        {/* ── Header ── */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter"
                style={{ textShadow: "2px 2px 0px #A259FF" }}>
              Event Dashboard
            </h1>
            <p className="font-bold text-sm text-gray-500 uppercase tracking-wide mt-0.5">
              Create, edit &amp; monitor campus events
            </p>
          </div>
          <button
            id="ev-create-btn"
            onClick={openCreate}
            className="bg-[#A259FF] text-white border-[3px] border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Event
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Events",  value: events.length, bg: "bg-[#A259FF]", text: "text-white" },
            { label: "Active",        value: active,         bg: "bg-[#39FF14]", text: "text-black" },
            { label: "Registrations", value: totalReg,       bg: "bg-[#00BFFF]", text: "text-black" },
            { label: "Drafts",        value: drafts,         bg: "bg-[#FFE600]", text: "text-black" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform`}>
              <p className={`text-[10px] font-black uppercase tracking-wider ${s.text} opacity-70 mb-1`}>{s.label}</p>
              <p className={`text-4xl font-black ${s.text}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ══ CREATE / EDIT FORM ══ */}
        {showForm && (
          <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
            <div className="bg-[#A259FF] border-b-[3px] border-black px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase text-white tracking-wide">
                {editId !== null ? "✏️ Edit Event" : "➕ Create New Event"}
              </h2>
              <button onClick={closeForm}
                className="bg-white border-[2px] border-black w-8 h-8 font-black flex items-center justify-center hover:bg-red-100 transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Event Title" icon={Hash} error={errors.title}>
                    <input className={inputCls(errors.title)} value={form.title} onChange={e => onChange("title", e.target.value)} placeholder="e.g. AI & Robotics Summit" />
                  </Field>
                  <Field label="Category" icon={Tag}>
                    <select className={inputCls(false) + " bg-white"} value={form.category} onChange={e => onChange("category", e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Description" icon={AlignLeft}>
                  <textarea className={inputCls(false) + " resize-none"} rows={3} value={form.description} onChange={e => onChange("description", e.target.value)} placeholder="Describe what this event is about…" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Field label="Event Date" icon={Calendar} error={errors.date}>
                    <input type="date" className={inputCls(errors.date)} value={form.date} onChange={e => onChange("date", e.target.value)} />
                  </Field>
                  <Field label="Start Time" icon={Clock} error={errors.time_start}>
                    <input type="time" className={inputCls(errors.time_start)} value={form.time_start} onChange={e => onChange("time_start", e.target.value)} />
                  </Field>
                  <Field label="End Time" icon={Clock} error={errors.time_end}>
                    <input type="time" className={inputCls(errors.time_end)} value={form.time_end} onChange={e => onChange("time_end", e.target.value)} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Field label="Venue / Location" icon={MapPin} error={errors.venue}>
                    <input className={inputCls(errors.venue)} value={form.venue} onChange={e => onChange("venue", e.target.value)} placeholder="e.g. Main Auditorium" />
                  </Field>
                  <Field label="Total Seats" icon={Users} error={errors.total_seats}>
                    <input type="number" min={1} className={inputCls(errors.total_seats)} value={form.total_seats} onChange={e => onChange("total_seats", e.target.value)} placeholder="200" />
                  </Field>
                  <Field label="Status">
                    <select className={inputCls(false) + " bg-white"} value={form.status} onChange={e => onChange("status", e.target.value)}>
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Cancelled</option>
                    </select>
                  </Field>
                </div>
                <Field label="Event Banner Image" icon={Image}>
                  <div onClick={() => fileRef.current?.click()} className="border-[2px] border-dashed border-black p-4 cursor-pointer hover:bg-yellow-50 flex items-center gap-4">
                    {form.bannerPreview ? (
                      <>
                        <img src={form.bannerPreview} alt="preview" className="w-24 h-16 object-cover border-[2px] border-black" />
                        <div><p className="font-black text-sm">Banner uploaded ✓</p><p className="text-xs text-gray-500 font-bold">Click to change</p></div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-12 h-12 border-[2px] border-dashed border-gray-400 flex items-center justify-center"><Image className="w-6 h-6" /></div>
                        <div><p className="font-black text-sm text-black">Click to upload banner</p><p className="text-xs font-bold">JPG, PNG, WEBP — max 5 MB</p></div>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
                </Field>
                <div className="flex gap-4 pt-2">
                  <button onClick={handleSubmit} disabled={saving} className="bg-black text-white border-[3px] border-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#555] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 disabled:opacity-50">
                    {saving && <Loader className="w-4 h-4 animate-spin" />}
                    {editId !== null ? "Save Changes" : "Create Event"}
                  </button>
                  <button onClick={closeForm} className="bg-white border-[3px] border-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">Cancel</button>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Card Preview</p>
                <EventCardPreview form={form} />
              </div>
            </div>
          </div>
        )}

        {/* ══ EVENTS GRID ══ */}
        <div>
          <h2 className="font-black uppercase text-lg border-b-[3px] border-black pb-2 mb-5">All Events ({events.length})</h2>
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3"><Loader className="w-8 h-8 animate-spin" /><span className="font-black uppercase">Loading events…</span></div>
          ) : error ? (
            <div className="bg-[#FF3131] border-[3px] border-black p-6 text-white font-black">Error: {error}</div>
          ) : events.length === 0 ? (
            <div className="bg-white border-[3px] border-dashed border-gray-300 p-16 text-center text-gray-400"><p className="font-black uppercase">No events yet. Create your first event!</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {events.map((ev) => {
                const cat  = CAT_COLORS[ev.category] || CAT_COLORS.Technical;
                const left = Math.max(0, ev.total_seats - (ev.registered || 0));
                const pct  = Math.min(100, Math.round(((ev.registered || 0) / ev.total_seats) * 100));
                return (
                  <div key={ev.id} className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all group flex flex-col">
                    <div className="relative h-[140px] bg-[#d9c5a8] border-b-[3px] border-black overflow-hidden">
                      {ev.banner_path ? <img src={bannerUrl(ev.banner_path)} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-10 h-10 text-[#b89a72] opacity-50" /></div>}
                      <span className={`absolute top-2 right-2 ${cat.bg} ${cat.text} font-black text-[9px] uppercase px-2 py-0.5 border-[2px] border-black`}>{ev.category}</span>
                      <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 border-[2px] border-black ${ev.status === "Active" ? "bg-[#39FF14] text-black" : ev.status === "Draft" ? "bg-white text-black" : "bg-[#FF3131] text-white"}`}>{ev.status}</span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-base uppercase leading-tight mb-1">{ev.title}</h3>
                      <div className="bg-[#f4f4f4] border-[2px] border-black px-3 py-2 space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-xs font-bold"><Calendar className="w-3 h-3 flex-shrink-0" />{fmtDate(ev.date)}</div>
                        <div className="flex items-center gap-2 text-xs font-bold"><Clock className="w-3 h-3 flex-shrink-0" />{fmt12h(ev.time_start?.slice(0, 5))} – {fmt12h(ev.time_end?.slice(0, 5))}</div>
                        <div className="flex items-center gap-2 text-xs font-bold"><MapPin className="w-3 h-3 flex-shrink-0" />{ev.venue}</div>
                      </div>
                      <div className="mb-3 cursor-pointer group/reg" onClick={() => navigate(`/faculty/events/${ev.id}/participants`)}>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                          <span className="flex items-center gap-1 group-hover/reg:text-neo-primary transition-colors"><ExternalLink className="w-3 h-3" /> View Participants</span>
                          <span>{ev.registered || 0}/{ev.total_seats}</span>
                        </div>
                        <div className="h-3 bg-[#f0f0f0] border-[2px] border-black">
                          <div className={`h-full transition-all ${pct >= 90 ? "bg-[#FF3131]" : pct >= 70 ? "bg-[#FFE600]" : "bg-[#39FF14]"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className={`px-2 py-1 font-black text-[10px] uppercase border-[2px] border-black ${left > 0 ? "bg-[#39FF14] text-black" : "bg-[#FF3131] text-white"}`}>{left > 0 ? `${left} SEATS LEFT` : "FULL"}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(ev)} className="flex items-center gap-1 border-[2px] border-black bg-white px-3 py-1.5 text-xs font-bold hover:bg-[#00BFFF] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><Edit className="w-3 h-3" /> Edit</button>
                          <button onClick={() => handleDelete(ev.id)} className="flex items-center border-[2px] border-black bg-white px-2 py-1.5 text-xs font-bold hover:bg-[#FF3131] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
