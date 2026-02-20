import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  const diffMs  = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHrs / 24);
  if (diffMin < 1)   return 'Just now';
  if (diffMin < 60)  return `${diffMin} min ago`;
  if (diffHrs < 24)  return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay} days ago`;
}

const STATUS_COLORS = {
  pending:  { bar: 'bg-neo-yellow-accent', badge: 'bg-neo-yellow-accent text-black', label: 'PENDING'  },
  approved: { bar: 'bg-green-400',         badge: 'bg-green-400 text-black',         label: 'APPROVED' },
  rejected: { bar: 'bg-red-500',           badge: 'bg-red-500 text-white',           label: 'REJECTED' },
};

// ── lib_Profile: used only for librarian / admin roles ────────────────────────
export default function LibProfile() {
  const { user } = useAuth();

  const [filterTab,    setFilterTab]    = useState('All');
  const [bookRequests, setBookRequests] = useState([]);
  const [loadingReqs,  setLoadingReqs]  = useState(false);

  const fullName   = user?.name  || 'Librarian';
  const email      = user?.email || '';
  const nameParts  = fullName.split(' ');
  const firstName  = nameParts[0] || '';
  const lastName   = nameParts.slice(1).join(' ') || '';

  // ── fetch live book requests ──────────────────────────────────────────────
  useEffect(() => {
    setLoadingReqs(true);
    fetch('http://localhost:5000/api/library/requests')
      .then((r) => r.json())
      .then((data) => setBookRequests(Array.isArray(data) ? data : []))
      .catch((e) => console.error('[lib_Profile] alert fetch failed:', e))
      .finally(() => setLoadingReqs(false));
  }, []);

  // ── build alert card objects ──────────────────────────────────────────────
  const librarianAlerts = bookRequests.map((r) => ({
    id:         r.id,
    status:     r.status,
    title:      `📚 ${r.student_name || 'A student'} requested a book`,
    body:       `"${r.title}"${r.author ? ` by ${r.author}` : ''}`,
    time:       timeAgo(r.requested_at),
    isNew:      r.status === 'pending',
    barColor:   STATUS_COLORS[r.status]?.bar    || 'bg-neo-yellow-accent',
    badgeColor: STATUS_COLORS[r.status]?.badge  || 'bg-neo-yellow-accent text-black',
    badgeLabel: STATUS_COLORS[r.status]?.label  || r.status?.toUpperCase(),
  }));

  const filterTabs = ['All', 'Pending', 'Approved', 'Rejected'];

  const filteredAlerts = librarianAlerts.filter((a) => {
    if (filterTab === 'All') return true;
    return a.status?.toLowerCase() === filterTab.toLowerCase();
  });

  const pendingCount = librarianAlerts.filter((a) => a.isNew).length;

  return (
    <div className="bg-neo-lavender font-display text-black min-h-screen flex flex-col overflow-hidden selection:bg-neo-yellow-accent selection:text-black">
      <main className="flex-1 flex overflow-hidden relative">
        <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row h-full z-10 p-4 lg:p-6 gap-6">

          {/* ── Live Book Request Alerts Panel ── */}
          <section className="flex flex-col w-full lg:w-[450px] bg-white border-3 border-black shadow-neo shrink-0 h-full relative">

            {/* Header */}
            <div className="p-5 border-b-3 border-black bg-white flex justify-between items-end sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                  Book Requests
                </h2>
                <p className="font-bold text-sm mt-1 bg-black text-white inline-block px-2 py-0.5">
                  {pendingCount > 0 ? `${pendingCount} PENDING` : 'ALL CAUGHT UP'}
                </p>
              </div>
              <button
                onClick={() =>
                  setBookRequests((prev) =>
                    prev.map((r) => ({ ...r, status: r.status === 'pending' ? 'approved' : r.status }))
                  )
                }
                className="text-black text-xs font-bold border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all shadow-neo-sm active:shadow-none active:translate-y-[2px]"
              >
                MARK ALL READ
              </button>
            </div>

            {/* Filter tabs */}
            <div className="px-5 py-4 border-b-3 border-black flex gap-3 overflow-x-auto no-scrollbar bg-neo-lavender">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-4 py-1.5 border-2 border-black text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5 transition-all whitespace-nowrap
                    ${filterTab === tab ? 'bg-black text-white' : 'bg-white hover:bg-neo-lavender'}`}
                >
                  {tab}
                  {tab !== 'All' && (
                    <span className="ml-1 opacity-60">
                      ({bookRequests.filter((r) => r.status === tab.toLowerCase()).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Alert cards */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f8f8]">
              {loadingReqs ? (
                <div className="text-center py-12 font-black uppercase text-slate-400 text-sm animate-pulse">
                  Loading…
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-12 font-black uppercase text-slate-400 text-sm">
                  No requests here.
                </div>
              ) : filteredAlerts.map((alert, i) => (
                <div
                  key={alert.id || i}
                  className={`group relative bg-white border-3 border-black p-0 shadow-neo hover:shadow-neo-hover transition-all cursor-pointer ${!alert.isNew ? 'opacity-70' : ''}`}
                >
                  <div className={`h-full w-3 absolute left-0 top-0 bottom-0 ${alert.barColor} border-r-3 border-black`} />
                  <div className="pl-6 p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase border border-black shrink-0 ${alert.badgeColor}`}>
                        {alert.badgeLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                        {alert.time.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-black font-black text-base mb-1 leading-tight group-hover:underline decoration-4">
                      {alert.title}
                    </h3>
                    <p className="text-gray-700 font-medium text-sm leading-snug line-clamp-2">
                      {alert.body}
                    </p>
                    {!alert.isNew && (
                      <div className="mt-2 flex justify-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Read</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Account Settings ── */}
          <section className="flex flex-col flex-1 bg-white border-3 border-black shadow-neo-lg h-full overflow-hidden">
            <div className="p-6 md:p-8 pb-6 bg-neo-yellow-accent border-b-3 border-black">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-xs uppercase bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">Faculty</span>
                <span className="font-black">/</span>
                <span className="font-bold text-xs uppercase bg-black text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#fff]">Settings</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black text-black mb-0 uppercase italic">Account Settings</h1>
                <span className="bg-neo-cyan border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm">Librarian</span>
              </div>
              <p className="font-medium text-black max-w-2xl border-l-4 border-black pl-4">
                Manage your personal details here.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
              <form className="max-w-5xl space-y-8">

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  <div className="md:col-span-4 bg-neo-lavender p-4 border-3 border-black shadow-neo h-fit">
                    <h3 className="text-black text-xl font-black uppercase mb-2">Personal Info</h3>
                    <p className="text-black font-medium text-sm">Update your photo and personal details here.</p>
                  </div>
                  <div className="md:col-span-8 space-y-6">
                    <div className="flex items-center gap-6 p-4 border-3 border-dashed border-gray-300">
                      <div className="w-24 h-24 bg-neo-cyan border-3 border-black shadow-neo-sm flex items-center justify-center">
                        <span className="text-3xl font-black">
                          {fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                          <button className="px-4 py-2 bg-neo-teal text-black font-bold border-2 border-black shadow-neo-sm hover:-translate-y-0.5 transition-all uppercase text-xs" type="button">Change Photo</button>
                          <button className="px-4 py-2 bg-white text-black font-bold border-2 border-black shadow-neo-sm hover:-translate-y-0.5 transition-all uppercase text-xs hover:bg-red-100" type="button">Remove</button>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase">JPG, GIF or PNG. Max 800K</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">First Name</label>
                        <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm" type="text" defaultValue={firstName} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">Last Name</label>
                        <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm" type="text" defaultValue={lastName} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-black uppercase tracking-wide">Email Address</label>
                      <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm" type="email" defaultValue={email} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">Staff ID</label>
                        <input className="w-full bg-gray-100 border-3 border-black px-4 py-3 text-gray-500 font-bold cursor-not-allowed border-dashed uppercase" disabled type="text" value={user?.id?.toString()?.slice(0, 8)?.toUpperCase() || 'N/A'} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">Department</label>
                        <select className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm appearance-none">
                          <option>Central Library</option>
                          <option>Digital Library</option>
                          <option>Archives</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
