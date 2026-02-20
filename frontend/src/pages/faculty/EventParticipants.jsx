import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Mail, Calendar, Loader, Download, Search } from "lucide-react";

const API = "http://localhost:5000/api/ev-events";

export default function EventParticipants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [regs, setRegs] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, regsRes] = await Promise.all([
          fetch(`${API}/${id}`),
          fetch(`${API}/${id}/registrations`)
        ]);
        
        if (eventRes.ok) setEvent(await eventRes.json());
        if (regsRes.ok) setRegs(await regsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filtered = regs.filter(r => 
    r.student_name?.toLowerCase().includes(search.toLowerCase()) || 
    r.student_email?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["Student Name", "Email", "Registration Date"];
    const rows = filtered.map(r => [
      r.student_name,
      r.student_email,
      new Date(r.registered_at).toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `participants_${event?.title || "event"}.csv`);
    link.click();
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f0f0f0]">
      <Loader className="w-12 h-12 animate-spin text-black" />
    </div>
  );

  return (
    <div className="font-display bg-[#f0f0f0] text-black min-h-screen p-6 -m-6">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter"
                style={{ textShadow: "2px 2px 0px #00BFFF" }}>
              Registered Students
            </h1>
            <div className="flex items-center gap-3">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#00BFFF]">
                {event?.title}
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {regs.length} Total Signups
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={downloadCSV}
              className="bg-[#39FF14] text-black border-[3px] border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Search and Table */}
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="p-4 border-b-[3px] border-black bg-neo-bg flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="bg-transparent border-none outline-none font-bold text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 font-black uppercase text-xs tracking-widest border-r border-white/20">Name</th>
                  <th className="p-4 font-black uppercase text-xs tracking-widest border-r border-white/20">Email</th>
                  <th className="p-4 font-black uppercase text-xs tracking-widest">Signed Up At</th>
                </tr>
              </thead>
              <tbody className="divide-y-[2px] divide-black">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-12 text-center opacity-30">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-black uppercase">No students found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-neo-bg transition-colors group">
                      <td className="p-4 border-r-[2px] border-black">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FF6FD8] border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
                            {r.student_name?.charAt(0)}
                          </div>
                          <span className="font-black uppercase tracking-tight text-lg">{r.student_name}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r-[2px] border-black font-bold text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#00BFFF]" />
                          {r.student_email}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-gray-500 italic">
                         <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4" />
                           {new Date(r.registered_at).toLocaleString('en-US', { 
                             month: 'short', 
                             day: 'numeric', 
                             year: 'numeric',
                             hour: '2-digit', 
                             minute: '2-digit' 
                           })}
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
