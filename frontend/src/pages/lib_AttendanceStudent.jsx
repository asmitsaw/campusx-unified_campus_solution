import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const QR_EXPIRY_SECONDS = 120; // 2 minutes

function buildQRPayload(user, action) {
  return JSON.stringify({
    studentId:   user?.id    || 'STU-001',
    studentName: user?.name  || 'Student',
    action,
    timestamp:   new Date().toISOString(),
    source:      'LIBRARY_ATTENDANCE',
  });
}

function qrUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}&bgcolor=FFFFFF&color=000000&margin=8`;
}

function fmtTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function LibAttendanceStudent() {
  const { user } = useAuth();

  const [action,      setAction]      = useState(null);   // 'CHECK_IN' | 'CHECK_OUT'
  const [qrPayload,   setQrPayload]   = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [checkedIn,   setCheckedIn]   = useState(null);   // Date — set externally after librarian scan
  const [checkedOut,  setCheckedOut]  = useState(null);   // Date — set externally after librarian scan

  const department = user?.department || 'Computer Science';
  const studentId  = user?.id?.toString()?.slice(0, 10)?.toUpperCase() || 'STU-0000';
  const today      = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // countdown timer — resets whenever action changes
  useEffect(() => {
    if (!action) return;
    setSecondsLeft(QR_EXPIRY_SECONDS);
  }, [action]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() =>
      setSecondsLeft((s) => (s <= 1 ? (clearInterval(t), 0) : s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft > 0]); // eslint-disable-line

  const handleAction = useCallback((type) => {
    setAction(type);
    setQrPayload(buildQRPayload(user, type));
  }, [user]);

  const isExpired    = !!action && secondsLeft === 0;
  const canCheckOut  = !!checkedIn && !checkedOut;

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-display p-4 md:p-8 flex flex-col items-center">

      {/* ── Page Title ── */}
      <div className="w-full max-w-xl mb-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter border-b-4 border-black pb-2">
          Library Attendance
        </h1>
        <p className="font-bold text-sm mt-1 text-gray-600 uppercase tracking-wide">
          QR-Based Check-In / Check-Out System
        </p>
      </div>

      {/* ── Student Identity Card ── */}
      <div className="w-full max-w-xl bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000] mb-6">
        <div className="bg-black text-white px-5 py-3 flex items-center justify-between">
          <span className="font-black uppercase text-sm tracking-widest">Student Identity</span>
          <span className="font-bold text-xs bg-white text-black px-2 py-0.5">LIBRARY PASS</span>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</p>
            <p className="font-black text-xl uppercase">{user?.name || 'Student User'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Student ID</p>
            <p className="font-black text-xl uppercase">{studentId}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Department</p>
            <p className="font-bold text-sm">{department}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</p>
            <p className="font-bold text-sm">{today}</p>
          </div>
        </div>
      </div>

      {/* ── Status Banners — shown after librarian scans ── */}
      {(checkedIn || checkedOut) && (
        <div className="w-full max-w-xl mb-5 space-y-2">
          {checkedIn && (
            <div className="bg-green-400 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] px-5 py-3 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-black uppercase text-sm">Checked In</p>
                <p className="font-bold text-xs">at {fmtTime(checkedIn)}</p>
              </div>
            </div>
          )}
          {checkedOut && (
            <div className="bg-red-400 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] px-5 py-3 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-black uppercase text-sm">Checked Out</p>
                <p className="font-bold text-xs">at {fmtTime(checkedOut)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="w-full max-w-xl grid grid-cols-2 gap-4 mb-6">
        <button
          id="lib-checkin-btn"
          onClick={() => handleAction('CHECK_IN')}
          disabled={!!checkedIn}
          className={`py-5 border-[3px] border-black font-black text-lg uppercase tracking-widest transition-all
            ${checkedIn
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-dashed'
              : 'bg-[#39FF14] text-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px]'
            }`}
        >
          {checkedIn ? '✓ Checked In' : 'Check In'}
        </button>
        <button
          id="lib-checkout-btn"
          onClick={() => handleAction('CHECK_OUT')}
          disabled={!canCheckOut}
          className={`py-5 border-[3px] border-black font-black text-lg uppercase tracking-widest transition-all
            ${!canCheckOut
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-dashed'
              : 'bg-[#FF3131] text-white shadow-[5px_5px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px]'
            }`}
        >
          {checkedOut ? '✓ Checked Out' : 'Check Out'}
        </button>
      </div>

      {/* ── QR Code Display Panel ── */}
      {action && (
        <div className="w-full max-w-xl bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000] mb-6">
          {/* Header */}
          <div className={`px-5 py-3 border-b-[3px] border-black flex items-center justify-between
            ${action === 'CHECK_IN' ? 'bg-[#39FF14]' : 'bg-[#FF3131] text-white'}`}>
            <span className="font-black uppercase tracking-widest text-sm">
              {action === 'CHECK_IN' ? '🟢 Check-In QR' : '🔴 Check-Out QR'}
            </span>
            {secondsLeft > 0 ? (
              <span className={`font-black text-sm border-2 border-black px-2 py-0.5 tabular-nums
                ${secondsLeft <= 30 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-white text-black'}`}>
                ⏱ {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
              </span>
            ) : (
              <span className="font-black text-sm bg-red-100 text-red-700 border-2 border-black px-2 py-0.5">
                EXPIRED
              </span>
            )}
          </div>

          <div className="p-6 flex flex-col items-center gap-4">
            {isExpired ? (
              /* ── Expired state ── */
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-20 h-20 bg-[#FFE600] border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                  <span className="text-4xl">⚠️</span>
                </div>
                <p className="font-black uppercase text-xl">QR Expired</p>
                <p className="font-bold text-sm text-gray-600">Generate a new QR to continue.</p>
                <button
                  onClick={() => handleAction(action)}
                  className="mt-2 px-6 py-2 bg-black text-white font-black uppercase border-[2px] border-black shadow-[3px_3px_0px_0px_#555] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  Regenerate QR
                </button>
              </div>
            ) : (
              /* ── Active QR — waiting for librarian ── */
              <>
                <div className="border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-2 bg-white">
                  <img
                    src={qrUrl(qrPayload)}
                    alt="Library Attendance QR"
                    className="w-[220px] h-[220px] block"
                  />
                </div>

                {/* Waiting indicator */}
                <div className="w-full flex items-center gap-3 bg-[#FFF9C4] border-[2px] border-black px-4 py-3">
                  <span className="text-xl animate-pulse">📡</span>
                  <div>
                    <p className="font-black uppercase text-sm">Waiting for librarian scan…</p>
                    <p className="font-bold text-xs text-gray-600">Show this screen to the librarian at the desk.</p>
                  </div>
                </div>

                <div className="w-full bg-[#f0f0f0] border-[2px] border-dashed border-gray-400 p-3 space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Security Info</p>
                  <p className="text-xs font-bold text-gray-700">🔒 QR expires after 2 minutes</p>
                  <p className="text-xs font-bold text-gray-700">🔒 One-time scan only — prevents proxy attendance</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Placeholder when no action ── */}
      {!action && (
        <div className="w-full max-w-xl bg-white border-[3px] border-dashed border-gray-300 p-10 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-16 h-16 border-[3px] border-dashed border-gray-300 flex items-center justify-center text-3xl">
            📱
          </div>
          <p className="font-black uppercase text-sm">Tap a button above to generate your QR</p>
        </div>
      )}

    </div>
  );
}
