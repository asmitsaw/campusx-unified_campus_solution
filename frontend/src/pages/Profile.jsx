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

// ── static alerts for non-librarian roles ─────────────────────────────────────
const STATIC_ALERTS = [
  {
    category:   'Academic',
    barColor:   'bg-neo-strong-blue',
    badgeColor: 'bg-neo-strong-blue text-white',
    title:      'Mid-term Schedule Released',
    body:       'The schedule for the upcoming mid-term examinations for Computer Science Dept has been published.',
    time:       '2 hrs ago',
    isNew:      true,
  },
  {
    category:   'Placement',
    barColor:   'bg-neo-strong-purple',
    badgeColor: 'bg-neo-strong-purple text-white',
    title:      'Google Campus Drive',
    body:       "Registration for Google's campus recruitment drive 2024 is now open for final year students.",
    time:       '5 hrs ago',
    isNew:      true,
    action:     'REGISTER NOW',
    actionColor:'bg-neo-strong-purple',
  },
  {
    category:   'System',
    barColor:   '',
    badgeColor: 'bg-gray-800 text-white',
    title:      'Scheduled Maintenance',
    body:       'The ERP portal will be undergoing maintenance on Saturday from 2:00 AM to 4:00 AM.',
    time:       'Yesterday',
    isNew:      false,
  },
  {
    category:   'Library',
    barColor:   '',
    badgeColor: 'bg-neo-yellow-accent text-black',
    title:      'Book Due Reminder',
    body:       '"Introduction to Algorithms" is due tomorrow. Please renew or return to avoid fines.',
    time:       '2 days ago',
    isNew:      false,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Profile() {
  const { user } = useAuth();
  const isLibrarian = user?.role === 'librarian' || user?.role === 'admin';

  const [filterTab,    setFilterTab]    = useState('All');
  const [bookRequests, setBookRequests] = useState([]);
  const [loadingReqs,  setLoadingReqs]  = useState(false);

  // fetch live book requests for librarian
  useEffect(() => {
    if (!isLibrarian) return;
    setLoadingReqs(true);
    fetch('http://localhost:5000/api/library/requests')
      .then((r) => r.json())
      .then((data) => setBookRequests(Array.isArray(data) ? data : []))
      .catch((e) => console.error('[Profile] alert fetch failed:', e))
      .finally(() => setLoadingReqs(false));
  }, [isLibrarian]);

  // build alert card objects from book requests
  const librarianAlerts = bookRequests.map((r) => ({
    id:         r.id,
    category:   'Library',
    status:     r.status,
    title:      `📚 ${r.student_name || 'A student'} requested a book`,
    body:       `"${r.title}"${r.author ? ` by ${r.author}` : ''}`,
    time:       timeAgo(r.requested_at),
    isNew:      r.status === 'pending',
    barColor:   STATUS_COLORS[r.status]?.bar    || 'bg-neo-yellow-accent',
    badgeColor: STATUS_COLORS[r.status]?.badge  || 'bg-neo-yellow-accent text-black',
    badgeLabel: STATUS_COLORS[r.status]?.label  || r.status?.toUpperCase(),
  }));

  const displayedAlerts = isLibrarian ? librarianAlerts : STATIC_ALERTS;
  const filterTabs = isLibrarian
    ? ['All', 'Pending', 'Approved', 'Rejected']
    : ['All', 'Academic', 'Placement', 'System'];

  const filteredAlerts = displayedAlerts.filter((a) => {
    if (filterTab === 'All') return true;
    if (isLibrarian) return a.status?.toLowerCase() === filterTab.toLowerCase();
    return a.category === filterTab;
  });

  const newCount = displayedAlerts.filter((a) => a.isNew).length;

  return (
    <div className="bg-neo-lavender font-display text-black min-h-screen flex flex-col overflow-hidden selection:bg-neo-yellow-accent selection:text-black">
      <main className="flex-1 flex overflow-hidden relative">
        <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row h-full z-10 p-4 lg:p-6 gap-6">

          {/* ── Alerts Panel ── */}
          <section className="flex flex-col w-full lg:w-[450px] bg-white border-3 border-black shadow-neo shrink-0 h-full relative">

            {/* Header */}
            <div className="p-5 border-b-3 border-black bg-white flex justify-between items-end sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                  {isLibrarian ? 'Book Requests' : 'Alerts'}
                </h2>
                <p className="font-bold text-sm mt-1 bg-black text-white inline-block px-2 py-0.5">
                  {newCount > 0 ? `${newCount} PENDING` : 'ALL CAUGHT UP'}
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
                  {tab !== 'All' && isLibrarian && (
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
                  No alerts here.
                </div>
              ) : filteredAlerts.map((alert, i) => (
                <div
                  key={alert.id || i}
                  className={`group relative bg-white border-3 border-black p-0 shadow-neo hover:shadow-neo-hover transition-all cursor-pointer ${!alert.isNew ? 'opacity-70' : ''}`}
                >
                  {alert.barColor && (
                    <div className={`h-full w-3 absolute left-0 top-0 bottom-0 ${alert.barColor} border-r-3 border-black`} />
                  )}
                  <div className={`${alert.barColor ? 'pl-6' : ''} p-4`}>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase border border-black shrink-0 ${alert.badgeColor}`}>
                        {alert.badgeLabel || alert.category}
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
                    {alert.action && (
                      <div className="mt-4 flex items-center gap-2">
                        <button className={`text-xs ${alert.actionColor} text-white font-bold border-2 border-black px-4 py-1 shadow-neo-sm active:translate-y-[2px] active:shadow-none`}>
                          {alert.action}
                        </button>
                      </div>
                    )}
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
                <span className="font-bold text-xs uppercase bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">Dashboard</span>
                <span className="font-black">/</span>
                <span className="font-bold text-xs uppercase bg-black text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#fff]">Settings</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase italic">Account Settings</h1>
              <p className="font-medium text-black max-w-2xl border-l-4 border-black pl-4">
                Manage your personal details here.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
              <form className="max-w-5xl space-y-12">

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  <div className="md:col-span-4 bg-neo-lavender p-4 border-3 border-black shadow-neo h-fit">
                    <h3 className="text-black text-xl font-black uppercase mb-2">Personal Info</h3>
                    <p className="text-black font-medium text-sm">Update your photo and personal details here.</p>
                  </div>
                  <div className="md:col-span-8 space-y-6">
                    <div className="flex items-center gap-6 p-4 border-3 border-dashed border-gray-300">
                      <img
                        alt="Profile avatar preview"
                        className="w-24 h-24 object-cover border-3 border-black shadow-neo-sm"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ6mC6ITqI-CM1_LQUI6jiKf8NFiZvPguzNBxLWHj8rtJCcjFC5o-hx1g1PKcezH7b1PP5_1UuUto-s5EwoHRP2hLPLf2hk3qoc4yleBlSeZ-LUnv-Rhmft8lVhlX3lUwXekVckLb8TMP3QEmFWKJuoSMZU6Kx49JK3E3YNcwN3n1OcOpK7rXr8R-mAKVIiTWcGLvJ0_EzUsYnmOL-e_RB0UO1-BgRSNimMrrT1wCZanIG7gNsjv3NKzYcktMTQCT_rO90vhUu7UBr"
                      />
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                          <button className="px-4 py-2 bg-neo-teal text-black font-bold border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all uppercase text-xs" type="button">Change Photo</button>
                          <button className="px-4 py-2 bg-white text-black font-bold border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all uppercase text-xs hover:bg-red-100" type="button">Remove</button>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase">JPG, GIF or PNG. Max 800K</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">First Name</label>
                        <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="text" defaultValue={user?.name?.split(' ')[0] || 'Alex'} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">Last Name</label>
                        <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="text" defaultValue={user?.name?.split(' ').slice(1).join(' ') || 'Chen'} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-black uppercase tracking-wide">Email Address</label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-3.5 text-black font-bold">mail</span>
                        <input className="w-full bg-white border-3 border-black pl-12 pr-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="email" defaultValue={user?.email || 'alex.chen@university.edu'} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">Role</label>
                        <input className="w-full bg-gray-100 border-3 border-black px-4 py-3 text-gray-500 font-bold cursor-not-allowed border-dashed uppercase" disabled type="text" value={user?.role || 'Student'} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black uppercase tracking-wide">Department</label>
                        <div className="relative">
                          <select className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm focus:shadow-neo-hover appearance-none">
                            <option>Computer Science</option>
                            <option>Mechanical Engineering</option>
                            <option>Business Administration</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-3.5 pointer-events-none font-bold">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </form>
            </div>
          </section>

        </div>
      </main>

      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: #000; }
        .toggle-checkbox:checked + .toggle-label { background-color: #4ECDC4; }
      `}</style>
    </div>
  );
}
