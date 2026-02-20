import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

// ── helpers ──────────────────────────────────────────────────────────────────
const API = "http://localhost:5000/api/library";

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "–";

const STATUS_BADGE = {
  pending:  "bg-neo-yellow text-black",
  approved: "bg-neo-green  text-black",
  rejected: "bg-neo-red    text-white",
  issued:   "bg-neo-blue   text-white",
  overdue:  "bg-neo-red    text-white",
};

// ── component ─────────────────────────────────────────────────────────────────
export default function ManageLibrary() {
  const { user } = useAuth();

  // state
  const [requests, setRequests]     = useState([]);
  const [issued,   setIssued]       = useState([]);
  const [search,   setSearch]       = useState("");
  const [tab,      setTab]          = useState("pending"); // 'pending' | 'all'
  const [loading,  setLoading]      = useState({ requests: false, issued: false });
  const [toast,    setToast]        = useState(null); // { msg, type }

  // direct-issue form
  const [showIssue,   setShowIssue]   = useState(false);
  const [issueForm,   setIssueForm]   = useState({ user_id: "", title: "", author: "" });
  const [issuing,     setIssuing]     = useState(false);

  // ── data fetching ────────────────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoading((l) => ({ ...l, requests: true }));
    try {
      const r = await fetch(`${API}/requests`);
      const d = await r.json();
      setRequests(Array.isArray(d) ? d : []);
    } catch (e) {
      showToast("Failed to load requests", "error");
    } finally {
      setLoading((l) => ({ ...l, requests: false }));
    }
  }, []);

  const fetchIssued = useCallback(async () => {
    setLoading((l) => ({ ...l, issued: true }));
    try {
      const r = await fetch(`${API}/my-books`);
      const d = await r.json();
      setIssued(Array.isArray(d) ? d : []);
    } catch (e) {
      showToast("Failed to load issued books", "error");
    } finally {
      setLoading((l) => ({ ...l, issued: false }));
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchIssued();
  }, [fetchRequests, fetchIssued]);

  // ── toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── handle approve / reject ───────────────────────────────────────────────
  const handleDecision = async (id, status) => {
    try {
      const res = await fetch(`${API}/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`Request ${status} successfully!`);
      fetchRequests();
      if (status === "approved") fetchIssued();
    } catch (e) {
      showToast(e.message || "Action failed", "error");
    }
  };

  // ── direct issue ─────────────────────────────────────────────────────────
  const handleDirectIssue = async (e) => {
    e.preventDefault();
    if (!issueForm.user_id.trim() || !issueForm.title.trim()) {
      showToast("Student ID and Book Title are required", "error");
      return;
    }
    setIssuing(true);
    try {
      const res = await fetch(`${API}/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: issueForm.user_id, title: issueForm.title, author: issueForm.author }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Book issued successfully!");
      setIssueForm({ user_id: "", title: "", author: "" });
      setShowIssue(false);
      fetchIssued();
    } catch (e) {
      showToast(e.message || "Issue failed", "error");
    } finally {
      setIssuing(false);
    }
  };

  // ── derived ───────────────────────────────────────────────────────────────
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const displayedRequests = tab === "pending" ? pendingRequests : requests;

  const now = new Date();
  const overdueCount = issued.filter((b) => new Date(b.due_date) < now).length;

  const filteredIssued = issued.filter(
    (b) =>
      !search ||
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_id?.toLowerCase().includes(search.toLowerCase()) ||
      b.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.student_email?.toLowerCase().includes(search.toLowerCase())
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 border-3 border-black font-black text-sm shadow-neo animate-bounce-in
            ${toast.type === "error" ? "bg-neo-red text-white" : "bg-neo-green text-black"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-4xl font-black uppercase italic tracking-tighter"
              style={{ textShadow: "3px 3px 0px #2d5bff" }}
            >
              Librarian Dashboard
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-1">
              Logged in as <span className="text-black uppercase">{user?.name || user?.email}</span>
            </p>
          </div>
          <button
            onClick={() => setShowIssue((v) => !v)}
            className="bg-neo-blue text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Direct Issue
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Issued",     value: issued.length,          bg: "bg-neo-blue",   text: "text-white" },
            { label: "Pending Requests", value: pendingRequests.length,  bg: "bg-neo-yellow", text: "text-black" },
            { label: "Overdue Books",    value: overdueCount,            bg: "bg-neo-red",    text: "text-white" },
            { label: "All Requests",     value: requests.length,         bg: "bg-white",      text: "text-black" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`${kpi.bg} border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform`}
            >
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${kpi.text} opacity-70`}>{kpi.label}</p>
              <p className={`text-4xl font-black ${kpi.text}`} style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Direct Issue Form ── */}
        {showIssue && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 animate-slide-down">
            <h3 className="text-xl font-black uppercase mb-5 border-b-4 border-black pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">library_add</span>
              Issue Book Directly
            </h3>
            <form onSubmit={handleDirectIssue} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-black uppercase mb-2">Student ID / Email</label>
                <input
                  className="w-full border-4 border-black p-3 font-bold outline-none focus:border-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-neo-bg"
                  placeholder="e.g. CS2101 or student@uni.edu"
                  value={issueForm.user_id}
                  onChange={(e) => setIssueForm((f) => ({ ...f, user_id: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-2">Book Title</label>
                <input
                  className="w-full border-4 border-black p-3 font-bold outline-none focus:border-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-neo-bg"
                  placeholder="e.g. Clean Code"
                  value={issueForm.title}
                  onChange={(e) => setIssueForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-black uppercase mb-2">Author (optional)</label>
                  <input
                    className="w-full border-4 border-black p-3 font-bold outline-none focus:border-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-neo-bg"
                    placeholder="e.g. Robert C. Martin"
                    value={issueForm.author}
                    onChange={(e) => setIssueForm((f) => ({ ...f, author: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={issuing}
                  className="h-[52px] px-6 border-4 border-black bg-neo-green text-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {issuing ? "..." : "ISSUE"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Borrow Requests Table ── */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-widest border-l-8 border-neo-red pl-4">
              Borrow Requests
            </h2>
            <div className="flex border-4 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setTab("pending")}
                className={`px-5 py-2 font-black uppercase text-sm transition-colors ${
                  tab === "pending" ? "bg-neo-red text-white" : "bg-white hover:bg-neo-bg"
                }`}
              >
                Pending ({pendingRequests.length})
              </button>
              <button
                onClick={() => setTab("all")}
                className={`px-5 py-2 font-black uppercase text-sm border-l-4 border-black transition-colors ${
                  tab === "all" ? "bg-black text-white" : "bg-white hover:bg-neo-bg"
                }`}
              >
                All Requests
              </button>
            </div>
          </div>

          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            {loading.requests ? (
              <div className="p-12 text-center font-black uppercase text-slate-400 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Loading requests...
              </div>
            ) : displayedRequests.length === 0 ? (
              <div className="p-12 text-center font-black uppercase text-slate-400">
                No {tab === "pending" ? "pending" : ""} requests found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 font-black uppercase italic text-sm">Student</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20">Book</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20">Requested</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20 text-center">Status</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b-2 border-black hover:bg-neo-yellow/20 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-black text-sm">{req.student_name || "Unknown Student"}</p>
                        {req.student_email && (
                          <p className="text-xs font-bold text-slate-400">{req.student_email}</p>
                        )}
                        <span className="text-[10px] font-mono bg-neo-bg border border-black px-1 mt-1 inline-block text-slate-500">
                          ID: {req.user_id}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-black">{req.title}</p>
                        {req.author && (
                          <p className="text-xs font-bold text-slate-500">{req.author}</p>
                        )}
                      </td>
                      <td className="p-4 font-mono text-sm font-bold">{fmt(req.requested_at)}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 border-2 border-black font-black text-xs uppercase ${
                            STATUS_BADGE[req.status] || "bg-gray-200"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {req.status === "pending" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDecision(req.id, "approved")}
                              className="px-4 py-1.5 border-2 border-black bg-neo-green text-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleDecision(req.id, "rejected")}
                              className="px-4 py-1.5 border-2 border-black bg-neo-red text-white font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                              REJECT
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 uppercase">
                            {req.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ── Currently Issued Books ── */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-widest border-l-8 border-neo-blue pl-4">
              Currently Issued Books
            </h2>
            {/* Search within issued */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                search
              </span>
              <input
                className="border-4 border-black pl-9 pr-4 py-2 font-bold outline-none focus:border-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                placeholder="Filter by title or student ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            {loading.issued ? (
              <div className="p-12 text-center font-black uppercase text-slate-400 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Loading issued books...
              </div>
            ) : filteredIssued.length === 0 ? (
              <div className="p-12 text-center font-black uppercase text-slate-400">
                No issued books found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neo-blue text-white">
                    <th className="p-4 font-black uppercase italic text-sm">Cover</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20">Title & Student</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20 text-center">Issued On</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20 text-center">Due Date</th>
                    <th className="p-4 font-black uppercase italic text-sm border-l-2 border-white/20 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssued.map((book) => {
                    const isOverdue = new Date(book.due_date) < now;
                    const daysLeft = Math.ceil(
                      (new Date(book.due_date) - now) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr
                        key={book.id}
                        className={`border-b-2 border-black transition-colors ${
                          isOverdue ? "bg-neo-red/10 hover:bg-neo-red/20" : "hover:bg-neo-bg"
                        }`}
                      >
                        <td className="p-4 w-20">
                          <div className="w-12 h-16 border-2 border-black bg-gray-200 overflow-hidden">
                            <img
                              src={book.image || "https://placehold.co/80x110?text=📖"}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => (e.target.src = "https://placehold.co/80x110?text=📖")}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-black text-base uppercase leading-tight">{book.title}</p>
                          {book.author && (
                            <p className="text-xs font-bold text-slate-500 mt-0.5">{book.author}</p>
                          )}
                          <div className="mt-2 pt-2 border-t border-black/10">
                            <p className="font-black text-sm">{book.student_name || "Unknown Student"}</p>
                            {book.student_email && (
                              <p className="text-xs font-bold text-slate-400">{book.student_email}</p>
                            )}
                            <span className="text-[10px] font-mono bg-neo-bg border border-black px-1 mt-0.5 inline-block text-slate-500">
                              ID: {book.user_id}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-sm">
                          {fmt(book.issue_date)}
                        </td>
                        <td className={`p-4 text-center font-black ${isOverdue ? "text-neo-red" : ""}`}>
                          <p className="font-mono text-sm">{fmt(book.due_date)}</p>
                          <p className="text-xs font-bold mt-0.5 text-slate-500">
                            {isOverdue
                              ? `${Math.abs(daysLeft)} days overdue`
                              : `${daysLeft} days left`}
                          </p>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 border-2 border-black font-black text-xs uppercase ${
                              isOverdue ? "bg-neo-red text-white -rotate-2" : "bg-neo-green text-black"
                            }`}
                          >
                            {isOverdue ? "OVERDUE" : "ON TIME"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
