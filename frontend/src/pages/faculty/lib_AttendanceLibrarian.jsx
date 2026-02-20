import React, { useState, useRef, useEffect } from 'react';

// ── Mock seed data ────────────────────────────────────────────────────────────
const MOCK_TODAY = [
  { id: 1, name: 'Aarav Sharma',    studentId: 'CS21001', checkIn: '09:15 AM', checkOut: '12:40 PM', duration: '3h 25m', status: 'COMPLETED' },
  { id: 2, name: 'Priya Mehta',     studentId: 'CS21047', checkIn: '10:00 AM', checkOut: null,        duration: '—',      status: 'IN_LIBRARY' },
  { id: 3, name: 'Rohan Verma',     studentId: 'ME22013', checkIn: '11:30 AM', checkOut: '01:10 PM', duration: '1h 40m', status: 'COMPLETED' },
  { id: 4, name: 'Sneha Patil',     studentId: 'IT21089', checkIn: '08:45 AM', checkOut: null,        duration: '—',      status: 'IN_LIBRARY' },
  { id: 5, name: 'Karan Joshi',     studentId: 'EC22044', checkIn: '02:00 PM', checkOut: null,        duration: '—',      status: 'IN_LIBRARY' },
  { id: 6, name: 'Divya Nair',      studentId: 'CS22031', checkIn: '09:50 AM', checkOut: '11:05 AM', duration: '1h 15m', status: 'COMPLETED' },
  { id: 7, name: 'Rahul Das',       studentId: 'ME21005', checkIn: null,        checkOut: null,        duration: '—',      status: 'INCOMPLETE' },
];

const STATUS_CFG = {
  IN_LIBRARY:  { label: 'IN LIBRARY',  cls: 'bg-blue-400  border-blue-600',   dot: 'bg-blue-500'  },
  COMPLETED:   { label: 'COMPLETED',   cls: 'bg-green-400 border-green-600',  dot: 'bg-green-500' },
  INCOMPLETE:  { label: 'INCOMPLETE',  cls: 'bg-red-400   border-red-600',    dot: 'bg-red-500'   },
};

const SCAN_DELAY_MS = 2200;

function now() { return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }); }
function today() { return new Date().toISOString().split('T')[0]; }

// ── fake parse of scanned QR text ────────────────────────────────────────────
function parseQR(raw) {
  try {
    const d = JSON.parse(raw);
    if (d.source === 'LIBRARY_ATTENDANCE') return d;
  } catch (_) { /* ignore */ }
  return null;
}

export default function LibAttendanceLibrarian() {
  const [view,          setView]          = useState('SCAN');   // 'SCAN' | 'HISTORY'
  const [records,       setRecords]       = useState(MOCK_TODAY);
  const [scanState,     setScanState]     = useState('IDLE');   // IDLE | SCANNING | SUCCESS | DUPLICATE | ERROR
  const [scanMsg,       setScanMsg]       = useState('');
  const [manualInput,   setManualInput]   = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyDate,   setHistoryDate]   = useState(today());
  const scanTimerRef = useRef(null);

  // cleanup timer on unmount
  useEffect(() => () => clearTimeout(scanTimerRef.current), []);

  // simulate camera scan — pretend we scanned a valid QR after SCAN_DELAY_MS
  const simulateScan = (overridePayload) => {
    if (scanState === 'SCANNING') return;
    setScanState('SCANNING');
    setScanMsg('');
    clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => {
      const raw = overridePayload || JSON.stringify({
        studentId:   'CS22099',
        studentName: 'Demo Student',
        action:      'CHECK_IN',
        timestamp:   new Date().toISOString(),
        source:      'LIBRARY_ATTENDANCE',
      });
      const data = parseQR(raw);
      if (!data) {
        setScanState('ERROR');
        setScanMsg('Invalid or unrecognised QR code.');
        return;
      }
      // duplicate check
      const existing = records.find(r => r.studentId === data.studentId);
      if (existing) {
        if (data.action === 'CHECK_IN' && existing.checkIn) {
          setScanState('DUPLICATE');
          setScanMsg(`${existing.name} is already checked in.`);
          return;
        }
        if (data.action === 'CHECK_OUT' && existing.checkOut) {
          setScanState('DUPLICATE');
          setScanMsg(`${existing.name} already checked out.`);
          return;
        }
        // update existing record
        const time = now();
        setRecords(prev => prev.map(r => {
          if (r.studentId !== data.studentId) return r;
          if (data.action === 'CHECK_IN')  return { ...r, checkIn: time,  status: 'IN_LIBRARY' };
          if (data.action === 'CHECK_OUT') return { ...r, checkOut: time, status: 'COMPLETED' };
          return r;
        }));
        setScanState('SUCCESS');
        setScanMsg(`${data.studentName} — ${data.action === 'CHECK_IN' ? 'Checked In ✅' : 'Checked Out ✅'} at ${time}`);
        return;
      }
      // new record
      const time = now();
      setRecords(prev => [{
        id: Date.now(), name: data.studentName, studentId: data.studentId,
        checkIn: data.action === 'CHECK_IN' ? time : null,
        checkOut: null, duration: '—', status: data.action === 'CHECK_IN' ? 'IN_LIBRARY' : 'INCOMPLETE',
      }, ...prev]);
      setScanState('SUCCESS');
      setScanMsg(`${data.studentName} — ${data.action === 'CHECK_IN' ? 'Checked In ✅' : 'Checked Out ✅'} at ${time}`);
    }, SCAN_DELAY_MS);
  };

  const handleManualScan = () => {
    if (!manualInput.trim()) return;
    simulateScan(manualInput.trim());
    setManualInput('');
  };

  const resetScanner = () => { setScanState('IDLE'); setScanMsg(''); };

  const activeStudents = records.filter(r => r.status === 'IN_LIBRARY');
  const filteredHistory = records.filter(r => {
    const q = historySearch.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q);
  });

  // ── scan panel styles ──────────────────────────────────────────────────────
  const scanBorderCls = {
    IDLE:      'border-black',
    SCANNING:  'border-yellow-400 animate-pulse',
    SUCCESS:   'border-green-500',
    DUPLICATE: 'border-yellow-500',
    ERROR:     'border-red-500',
  }[scanState];

  const scanBgCls = {
    IDLE:      'bg-[#111]',
    SCANNING:  'bg-[#1a1a00]',
    SUCCESS:   'bg-[#001a00]',
    DUPLICATE: 'bg-[#1a1500]',
    ERROR:     'bg-[#1a0000]',
  }[scanState];

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-display p-4 md:p-6">

      {/* ── Page Header ── */}
      <div className="mb-5 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Library Attendance Monitor
          </h1>
          <p className="font-bold text-sm text-gray-500 uppercase tracking-wide mt-0.5">
            QR Scanner + Real-Time Attendance Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-400 border-[2px] border-black px-3 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]">
            🟢 {activeStudents.length} Inside
          </div>
          <div className="bg-black text-white border-[2px] border-black px-3 py-1 font-black text-xs uppercase">
            {records.length} Total Today
          </div>
        </div>
      </div>

      {/* ── Top Two Buttons ── */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
        <button
          id="lib-att-scan-btn"
          onClick={() => setView('SCAN')}
          className={`py-4 border-[3px] border-black font-black text-sm uppercase tracking-widest transition-all
            ${view === 'SCAN'
              ? 'bg-black text-white shadow-none translate-x-[3px] translate-y-[3px]'
              : 'bg-[#39FF14] text-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px]'
            }`}
        >
          📷 Scan QR
        </button>
        <button
          id="lib-att-history-btn"
          onClick={() => setView('HISTORY')}
          className={`py-4 border-[3px] border-black font-black text-sm uppercase tracking-widest transition-all
            ${view === 'HISTORY'
              ? 'bg-black text-white shadow-none translate-x-[3px] translate-y-[3px]'
              : 'bg-[#FFE600] text-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px]'
            }`}
        >
          🗂 History
        </button>
      </div>

      {/* ══════════════════ SCAN VIEW ══════════════════ */}
      {view === 'SCAN' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── QR Scanner ── */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            <div className={`border-[4px] ${scanBorderCls} ${scanBgCls} transition-all duration-500`}>
              {/* Camera viewport */}
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
                {/* corner brackets */}
                {['top-3 left-3 border-t-4 border-l-4',
                  'top-3 right-3 border-t-4 border-r-4',
                  'bottom-3 left-3 border-b-4 border-l-4',
                  'bottom-3 right-3 border-b-4 border-r-4'].map((cls, i) => (
                  <div key={i} className={`absolute w-8 h-8 ${cls} ${
                    scanState === 'SUCCESS' ? 'border-green-400' :
                    scanState === 'ERROR'   ? 'border-red-400' :
                    scanState === 'DUPLICATE' ? 'border-yellow-400' :
                    'border-white'}`} />
                ))}

                {/* scan line animation */}
                {scanState === 'SCANNING' && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-yellow-400 animate-[scan_1.5s_ease-in-out_infinite]"
                    style={{ animation: 'scan 1.5s ease-in-out infinite' }} />
                )}

                <div className="text-center px-4">
                  {scanState === 'IDLE' && (
                    <>
                      <div className="text-white text-5xl mb-3 opacity-40">⬛</div>
                      <p className="text-gray-400 font-bold text-sm uppercase">Scan Student QR Code</p>
                    </>
                  )}
                  {scanState === 'SCANNING' && (
                    <>
                      <div className="text-yellow-400 text-5xl mb-3 animate-pulse">⬛</div>
                      <p className="text-yellow-300 font-black text-sm uppercase animate-pulse">Scanning…</p>
                    </>
                  )}
                  {scanState === 'SUCCESS' && (
                    <>
                      <div className="w-16 h-16 bg-green-400 border-[3px] border-white flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl font-black">✓</span>
                      </div>
                      <p className="text-green-300 font-black text-sm uppercase">Valid QR</p>
                    </>
                  )}
                  {scanState === 'DUPLICATE' && (
                    <>
                      <div className="w-16 h-16 bg-yellow-400 border-[3px] border-white flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl">⚠️</span>
                      </div>
                      <p className="text-yellow-300 font-black text-sm uppercase">Already Scanned</p>
                    </>
                  )}
                  {scanState === 'ERROR' && (
                    <>
                      <div className="w-16 h-16 bg-red-500 border-[3px] border-white flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl font-black text-white">✕</span>
                      </div>
                      <p className="text-red-300 font-black text-sm uppercase">Invalid QR</p>
                    </>
                  )}
                </div>
              </div>

              {/* Scan result message */}
              {scanMsg && (
                <div className={`px-4 py-3 font-bold text-sm border-t-[3px] border-current
                  ${scanState === 'SUCCESS'   ? 'bg-green-900 text-green-200 border-green-500' :
                    scanState === 'DUPLICATE' ? 'bg-yellow-900 text-yellow-200 border-yellow-500' :
                                               'bg-red-900   text-red-200   border-red-500'}`}>
                  {scanMsg}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="lib-att-simulate-btn"
                onClick={() => { resetScanner(); setTimeout(simulateScan, 100); }}
                disabled={scanState === 'SCANNING'}
                className="py-3 bg-[#39FF14] border-[3px] border-black font-black text-xs uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {scanState === 'SCANNING' ? '⏳ Scanning…' : '▶ Simulate Scan'}
              </button>
              <button
                id="lib-att-reset-btn"
                onClick={resetScanner}
                className="py-3 bg-white border-[3px] border-black font-black text-xs uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                ↺ Reset
              </button>
            </div>

            {/* Manual QR input */}
            <div className="bg-white border-[3px] border-black shadow-[3px_3px_0px_0px_#000] p-4">
              <p className="font-black uppercase text-xs mb-2 text-gray-500">Manual QR Entry (paste JSON)</p>
              <textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                rows={3}
                className="w-full border-[2px] border-black px-3 py-2 font-mono text-xs outline-none focus:bg-yellow-50 resize-none"
                placeholder={'{"studentId":"CS22001","studentName":"Test Student","action":"CHECK_IN","source":"LIBRARY_ATTENDANCE"}'}
              />
              <button
                onClick={handleManualScan}
                className="mt-2 w-full py-2 bg-black text-white font-black uppercase text-xs border-[2px] border-black shadow-[3px_3px_0px_0px_#555] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Process QR
              </button>
            </div>
          </div>

          {/* ── Main Panel ── */}
          <div className="xl:col-span-2 flex flex-col gap-5">

            {/* Active Students */}
            <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
              <div className="bg-[#39FF14] border-b-[3px] border-black px-5 py-3 flex items-center justify-between">
                <h2 className="font-black uppercase tracking-widest text-sm">
                  Currently Inside the Library
                </h2>
                <span className="bg-black text-white font-black text-xs px-2 py-0.5">
                  {activeStudents.length} students
                </span>
              </div>
              {activeStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-bold uppercase text-sm">
                  No students currently inside.
                </div>
              ) : (
                <div className="divide-y-[2px] divide-black">
                  {activeStudents.map((s) => (
                    <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#f8ffe0] transition-colors">
                      <div>
                        <p className="font-black uppercase">{s.name}</p>
                        <p className="text-xs font-bold text-gray-500">{s.studentId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm">In at {s.checkIn}</p>
                        <p className="text-xs font-bold text-gray-500">Still inside</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Attendance Table */}
            <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
              <div className="bg-black text-white border-b-[3px] border-black px-5 py-3">
                <h2 className="font-black uppercase tracking-widest text-sm">Today's Attendance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f0f0f0] border-b-[3px] border-black">
                      {['Student Name', 'Student ID', 'Check-In', 'Check-Out', 'Duration', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-black uppercase text-xs tracking-wide border-r-[2px] border-black last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-[2px] divide-black">
                    {records.map((r) => {
                      const sc = STATUS_CFG[r.status];
                      return (
                        <tr key={r.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 font-black border-r-[2px] border-black">{r.name}</td>
                          <td className="px-4 py-3 font-bold font-mono text-xs border-r-[2px] border-black">{r.studentId}</td>
                          <td className="px-4 py-3 font-bold border-r-[2px] border-black">{r.checkIn || '—'}</td>
                          <td className="px-4 py-3 font-bold border-r-[2px] border-black">{r.checkOut || '—'}</td>
                          <td className="px-4 py-3 font-bold border-r-[2px] border-black">{r.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase border-[2px] ${sc.cls}`}>
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ HISTORY VIEW ══════════════════ */}
      {view === 'HISTORY' && (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
          <div className="bg-[#FFE600] border-b-[3px] border-black px-5 py-3">
            <h2 className="font-black uppercase tracking-widest text-sm">Attendance History</h2>
          </div>

          {/* Filters */}
          <div className="px-5 py-4 border-b-[3px] border-black flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-wide">Filter by Date</label>
              <input
                type="date"
                value={historyDate}
                onChange={(e) => setHistoryDate(e.target.value)}
                className="border-[2px] border-black px-3 py-2 font-bold text-sm outline-none focus:bg-yellow-50"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase tracking-wide">Search by Name / ID</label>
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Type to search…"
                className="border-[2px] border-black px-3 py-2 font-bold text-sm outline-none focus:bg-yellow-50 w-full"
              />
            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f0f0f0] border-b-[3px] border-black">
                  {['Student Name', 'Student ID', 'Check-In', 'Check-Out', 'Duration', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-black uppercase text-xs tracking-wide border-r-[2px] border-black last:border-r-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-[2px] divide-black">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400 font-bold uppercase text-sm">
                      No records match your search.
                    </td>
                  </tr>
                ) : filteredHistory.map((r) => {
                  const sc = STATUS_CFG[r.status];
                  return (
                    <tr key={r.id} className="hover:bg-[#fffde0] transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-black border-r-[2px] border-black">{r.name}</td>
                      <td className="px-4 py-3 font-bold font-mono text-xs border-r-[2px] border-black">{r.studentId}</td>
                      <td className="px-4 py-3 font-bold border-r-[2px] border-black">{r.checkIn || '—'}</td>
                      <td className="px-4 py-3 font-bold border-r-[2px] border-black">{r.checkOut || '—'}</td>
                      <td className="px-4 py-3 font-bold border-r-[2px] border-black">{r.duration}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase border-[2px] ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%   { top: 0;    }
          50%  { top: calc(100% - 4px); }
          100% { top: 0;    }
        }
      `}</style>
    </div>
  );
}
