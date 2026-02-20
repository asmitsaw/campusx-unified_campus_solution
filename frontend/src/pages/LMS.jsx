import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  CheckSquare,
  Megaphone,
  Calendar,
  Upload,
  Ticket,
  ChevronDown,
  Download,
  Loader2,
  Eye
} from 'lucide-react';
import { apiGet } from '../utils/api';

const LMS = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await apiGet("/notes");
        if (res.success) {
          setNotes(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredNotes = notes.filter(note =>
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardColors = [
    'bg-neo-strong-blue',
    'bg-neo-primary',
    'bg-neo-yellow',
    'bg-neo-green',
    'bg-neo-purple'
  ];

  return (
    <div className="min-h-screen bg-neo-bg font-sans p-8 text-black">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-3 border-black pb-6 gap-4">
        <div>
          <h2 className="text-sm font-bold text-neo-strong-blue tracking-widest uppercase mb-1">Academic Year 2023-24 • Fall Semester</h2>
          <h1 className="text-6xl font-black italic tracking-tighter text-black">
            LMS <span className="text-neo-strong-blue">PORTAL</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="SEARCH SUBJECTS OR TEACHERS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-3 border-black shadow-neo-sm focus:outline-none font-bold w-full md:w-80 placeholder:text-gray-400 text-sm bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-3 border-black shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all font-black uppercase text-sm active:translate-y-1 active:shadow-none">
            Filter <Filter size={16} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Notes) */}
        <div className="md:col-span-12 lg:col-span-8 space-y-8">

          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-3xl font-black italic uppercase">
              Available <span className="text-neo-strong-blue">Notes</span>
            </h3>
            {loading && <Loader2 className="animate-spin text-neo-strong-blue" />}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 border-3 border-black bg-white shadow-neo">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-gray-400">Loading Academic Repository...</p>
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNotes.map((note, index) => (
                <div key={note.id} className={`${cardColors[index % cardColors.length]} border-3 border-black p-0 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col group`}>
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex-grow relative">
                    <span className="bg-white border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-sm inline-block mb-3">
                      {note.subject}
                    </span>
                    <h3 className="text-2xl font-black uppercase leading-tight mb-6 text-white" style={{ textShadow: '2px 2px 0px #000' }}>
                      {note.originalName.replace(/\.pdf$/i, '')}
                    </h3>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center overflow-hidden shadow-sm">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${note.facultyName}`}
                          alt={note.facultyName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="block font-bold italic text-xs text-black/70 uppercase">Instructor</span>
                        <span className="font-black text-sm text-black bg-white/50 px-2 py-0.5 border-black border-collapse">{note.facultyName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions (Bottom) */}
                  <div className="bg-white border-t-3 border-black grid grid-cols-2 divide-x-2 divide-black text-xs">
                    <div className="flex flex-col items-center justify-center py-3">
                      <span className="font-bold text-gray-500 uppercase">File Size</span>
                      <span className="font-black">{formatBytes(note.size)}</span>
                    </div>
                    <a
                      href={`/api/notes/download/${note.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 hover:bg-neo-yellow transition-colors group/btn font-black uppercase"
                    >
                      <Eye size={18} className="stroke-[2.5] group-hover/btn:scale-110 transition-transform" />
                      View Note
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-3 border-black bg-white shadow-neo">
              <FileText className="w-16 h-16 text-gray-200 mb-4" />
              <p className="font-black uppercase tracking-widest text-gray-400">No notes found matching your search</p>
            </div>
          )}

          {/* Dropbox Section */}
          <div className="bg-white border-3 border-black p-8 shadow-neo-lg space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-3xl font-black italic uppercase">
                Assignment <span className="text-neo-strong-blue">Dropbox</span>
              </h3>
              <div className="relative">
                <button className="flex items-center gap-2 border-3 border-black px-4 py-2 font-bold uppercase text-sm shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1 active:shadow-none bg-white">
                  Select Subject <ChevronDown size={16} />
                </button>
              </div>
            </div>

            <div className="border-4 border-dashed border-neo-strong-blue bg-blue-50/30 p-12 text-center group cursor-pointer hover:bg-blue-50 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
              <div className="w-16 h-16 bg-white border-3 border-black mx-auto flex items-center justify-center shadow-neo mb-4 group-hover:scale-110 transition-transform relative z-10">
                <Upload size={32} strokeWidth={2.5} />
              </div>
              <p className="font-bold text-gray-400 uppercase text-sm relative z-10 group-hover:text-black transition-colors">Drag & Drop or Click to Upload</p>
            </div>
          </div>

        </div>

        {/* Sidebar (Right) */}
        <div className="md:col-span-12 lg:col-span-4 space-y-8">

          {/* Coming Up */}
          <div className="bg-white border-3 border-black p-6 shadow-neo-lg relative">
            <div className="flex items-center gap-2 mb-6 border-b-3 border-black pb-4">
              <Calendar className="w-6 h-6 text-neo-strong-blue fill-current stroke-black stroke-2" />
              <h3 className="text-2xl font-black uppercase">Coming Up</h3>
            </div>

            <div className="space-y-4">
              {/* Event 1 */}
              <div className="bg-neo-bg border-3 border-black p-4 flex gap-4 hover:-translate-y-1 hover:shadow-neo transition-all cursor-pointer group bg-neo-cream text-black">
                <div className="bg-white border-2 border-black p-1 flex flex-col items-center justify-center w-14 h-14 shadow-sm flex-shrink-0 group-hover:bg-neo-pink group-hover:text-white transition-colors">
                  <span className="text-[9px] font-black uppercase">OCT</span>
                  <span className="text-2xl font-black leading-none">24</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neo-primary uppercase mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-neo-primary rounded-full inline-block"></span>
                    CS-402 • Midnight
                  </div>
                  <h4 className="font-bold leading-tight text-sm">Complex Logic Implementation</h4>
                  <div className="mt-2 text-[10px] font-black underline decoration-2 decoration-black underline-offset-2">VIEW DETAILS</div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="bg-neo-bg border-3 border-black p-4 flex gap-4 hover:-translate-y-1 hover:shadow-neo transition-all cursor-pointer group bg-neo-cream text-black">
                <div className="bg-white border-2 border-black p-1 flex flex-col items-center justify-center w-14 h-14 shadow-sm flex-shrink-0 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                  <span className="text-[9px] font-black uppercase">OCT</span>
                  <span className="text-2xl font-black leading-none">28</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                    DSGN-310 • 4:00 PM
                  </div>
                  <h4 className="font-bold leading-tight text-sm">Design Token Mapping</h4>
                  <div className="mt-2 text-[10px] font-black underline decoration-2 decoration-black underline-offset-2">VIEW DETAILS</div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 border-3 border-black font-black uppercase text-sm hover:bg-black hover:text-white transition-colors shadow-neo-sm active:translate-y-1 active:shadow-none bg-white">
              View Full Calendar
            </button>
          </div>

          {/* Overall Progress */}
          <div className="bg-neo-strong-blue border-3 border-black p-6 shadow-neo-lg text-white">
            <h3 className="text-2xl font-black italic uppercase mb-6 text-white" style={{ textShadow: '3px 3px 0px #000' }}>Overall Progress</h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-1">
                  <span>Academic Load</span>
                  <span>72%</span>
                </div>
                <div className="h-4 bg-white border-3 border-black w-full relative text-black">
                  <div className="absolute top-0 left-0 h-full bg-neo-bg w-[72%] border-r-3 border-black"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-1">
                  <span>Tasks Completed</span>
                  <span>12/15</span>
                </div>
                <div className="h-4 bg-white border-3 border-black w-full relative text-black">
                  <div className="absolute top-0 left-0 h-full bg-neo-yellow w-[80%] border-r-3 border-black"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white border-3 border-black p-6 shadow-neo-lg relative overflow-hidden text-black">
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase mb-2">Need Help?</h3>
              <p className="text-xs font-bold text-gray-500 mb-4 leading-relaxed">
                Contact your faculty head or the IT support desk for LMS issues.
              </p>
              <button className="bg-black text-white px-4 py-2 text-xs font-black uppercase border-2 border-black hover:bg-neo-primary hover:text-black transition-colors shadow-neo-sm active:translate-y-1 active:shadow-none">
                Open Support Ticket
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Ticket size={100} strokeWidth={1} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LMS;

