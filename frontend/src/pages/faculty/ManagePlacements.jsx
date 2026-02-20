import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/api";
import {
    Briefcase, Plus, Users, TrendingUp, Building2, Calendar, Eye,
    X, Loader2, AlertCircle, Check, ChevronDown, Trash2, BookOpen,
    Award, ArrowLeft, Save, MoreVertical
} from "lucide-react";

const STATUS_COLORS = {
    Active: "bg-neo-green",
    Upcoming: "bg-neo-blue",
    Completed: "bg-neo-yellow",
};
const APP_STATUS_COLORS = {
    Applied: "bg-neo-blue",
    Shortlisted: "bg-neo-yellow",
    "Coding Round": "bg-neo-purple",
    Interview: "bg-neo-accent-orange text-white",
    Selected: "bg-neo-green",
    Rejected: "bg-neo-primary text-white",
};

const APP_STATUSES = ["Applied", "Shortlisted", "Coding Round", "Interview", "Selected", "Rejected"];

const EMPTY_FORM = {
    company: "", role: "", package_lpa: "", deadline: "", description: "",
    eligibility: "", type: "On-Campus", location: "", drive_date: "", status: "Active"
};

const EMPTY_SESSION = { title: "", description: "", date: "", time: "", venue: "", type: "General", placement_id: "" };

export default function ManagePlacements() {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    // Modals
    const [showForm, setShowForm] = useState(false);
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState(null); // viewing applicants
    const [applicants, setApplicants] = useState([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);

    const [form, setForm] = useState(EMPTY_FORM);
    const [sessionForm, setSessionForm] = useState(EMPTY_SESSION);
    const [submitting, setSubmitting] = useState(false);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [d, s] = await Promise.all([
                apiGet("/placements/drives"),
                apiGet("/placements/stats"),
            ]);
            setDrives(d.data || []);
            setStats(s.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const fetchApplicants = async (driveId) => {
        setApplicantsLoading(true);
        try {
            const res = await apiGet(`/placements/drives/${driveId}/applicants`);
            setApplicants(res.data || []);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setApplicantsLoading(false);
        }
    };

    const openDrive = (drive) => {
        setSelectedDrive(drive);
        fetchApplicants(drive.id);
    };

    const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleSessionChange = (e) => setSessionForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handlePostDrive = async () => {
        if (!form.company || !form.role || !form.package_lpa || !form.deadline) {
            showToast("Company, role, package & deadline are required", "error"); return;
        }
        setSubmitting(true);
        try {
            await apiPost("/placements/drives", form);
            showToast("Placement drive posted! 🎉");
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchData();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (driveId, newStatus) => {
        try {
            await apiPut(`/placements/drives/${driveId}`, { status: newStatus });
            showToast("Drive status updated");
            fetchData();
            if (selectedDrive?.id === driveId) setSelectedDrive(d => ({ ...d, status: newStatus }));
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleDeleteDrive = async (driveId) => {
        if (!window.confirm("Delete this drive? All applications will also be removed.")) return;
        try {
            await apiDelete(`/placements/drives/${driveId}`);
            showToast("Drive deleted");
            fetchData();
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleUpdateApplicantStatus = async (applicationId, status) => {
        try {
            await apiPut(`/placements/applications/${applicationId}/status`, { status });
            showToast(`Applicant status → ${status}`);
            setApplicants(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a));
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handlePostSession = async () => {
        if (!sessionForm.title || !sessionForm.date) {
            showToast("Title and date are required", "error"); return;
        }
        setSubmitting(true);
        try {
            await apiPost("/placements/training-sessions", sessionForm);
            showToast("Training session posted! 📚");
            setSessionForm(EMPTY_SESSION);
            setShowSessionForm(false);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    // ─── APPLICANT DETAIL VIEW ─────────────────────────────
    if (selectedDrive) {
        return (
            <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
                <div className="flex flex-col gap-6 mx-auto max-w-[1400px]">
                    {/* Back + Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSelectedDrive(null)}
                                className="flex items-center gap-2 border-3 border-black bg-white px-4 py-2 font-black uppercase text-sm shadow-neo-sm hover:bg-black hover:text-white transition-colors"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <div>
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter"
                                    style={{ textShadow: "2px 2px 0px #00D1FF" }}>
                                    {selectedDrive.company}
                                </h1>
                                <p className="text-sm font-bold text-gray-600">{selectedDrive.role} · {selectedDrive.package_lpa} LPA</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`${STATUS_COLORS[selectedDrive.status] || "bg-gray-200"} border-3 border-black px-4 py-2 text-sm font-black uppercase shadow-neo-sm`}>
                                {selectedDrive.status}
                            </span>
                            <select
                                className="border-3 border-black bg-white px-3 py-2 text-sm font-bold shadow-neo-sm focus:outline-none"
                                value={selectedDrive.status}
                                onChange={e => handleUpdateStatus(selectedDrive.id, e.target.value)}
                            >
                                <option>Active</option>
                                <option>Upcoming</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Applicants", value: applicants.length, color: "bg-neo-blue" },
                            { label: "Shortlisted", value: applicants.filter(a => ["Shortlisted", "Coding Round", "Interview"].includes(a.status)).length, color: "bg-neo-yellow" },
                            { label: "Selected", value: applicants.filter(a => a.status === "Selected").length, color: "bg-neo-green" },
                            { label: "Rejected", value: applicants.filter(a => a.status === "Rejected").length, color: "bg-neo-primary" },
                        ].map(stat => (
                            <div key={stat.label} className={`${stat.color} border-3 border-black p-4 shadow-neo`}>
                                <p className="text-xs font-black uppercase opacity-70 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Applicants Table */}
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-cyan flex items-center justify-between">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Users className="w-5 h-5" /> Applicants
                            </h3>
                            <span className="text-sm font-bold">{applicants.length} total</span>
                        </div>
                        {applicantsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : applicants.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-black uppercase text-gray-400">No Applicants Yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black text-white text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-5 py-3">Student</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20">Email</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20">Applied On</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20 text-center">Status</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20 text-center">Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-black">
                                        {applicants.map((app) => (
                                            <tr key={app.id} className="hover:bg-neo-bg transition-colors group">
                                                <td className="px-5 py-4 font-black text-base">{app.users?.name || "Unknown"}</td>
                                                <td className="px-5 py-4 font-bold text-sm text-gray-600">{app.users?.email}</td>
                                                <td className="px-5 py-4 text-sm font-bold text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`inline-block border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${APP_STATUS_COLORS[app.status] || "bg-gray-100"}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <select
                                                        className="border-2 border-black bg-white px-2 py-1.5 text-xs font-black focus:outline-none shadow-neo-sm cursor-pointer hover:bg-neo-bg"
                                                        value={app.status}
                                                        onChange={e => handleUpdateApplicantStatus(app.id, e.target.value)}
                                                    >
                                                        {APP_STATUSES.map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─── MAIN DASHBOARD VIEW ──────────────────────────────
    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 border-3 border-black px-5 py-3 font-black shadow-neo text-sm uppercase flex items-center gap-2 ${toast.type === "error" ? "bg-neo-primary text-white" : "bg-neo-green"}`}>
                    {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
                    {toast.msg}
                    <button onClick={() => setToast(null)} className="ml-2"><X size={14} /></button>
                </div>
            )}

            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter"
                            style={{ textShadow: "2px 2px 0px #00D1FF" }}>
                            Manage Placements
                        </h1>
                        <p className="text-sm font-bold text-gray-600 mt-1">TPO Dashboard — Welcome, {user?.name}!</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setShowSessionForm(!showSessionForm)}
                            className="flex items-center gap-2 border-3 border-black bg-white px-5 py-3 font-black uppercase text-sm shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all hover:bg-neo-yellow"
                        >
                            <BookOpen size={18} /> Post Training
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-neo-cyan border-3 border-black px-6 py-3 font-black uppercase text-sm shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all"
                        >
                            <Plus size={18} /> Post Drive
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-neo-primary border-3 border-black p-4 text-white font-bold flex items-center gap-3 shadow-neo">
                        <AlertCircle size={20} /> {error}
                        <button className="underline ml-2" onClick={fetchData}>Retry</button>
                    </div>
                )}

                {/* Stats */}
                {loading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-neo-cyan border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                            <p className="text-xs font-black uppercase text-black/70 mb-1">Total Drives</p>
                            <p className="text-3xl font-black">{stats?.total_drives || drives.length}</p>
                        </div>
                        <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                            <p className="text-xs font-black uppercase text-black/70 mb-1">Students Placed</p>
                            <p className="text-3xl font-black">{stats?.students_placed || 0}</p>
                        </div>
                        <div className="bg-neo-purple border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                            <p className="text-xs font-black uppercase text-white/80 mb-1">Avg Package</p>
                            <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>{stats?.avg_package || 0} LPA</p>
                        </div>
                        <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                            <p className="text-xs font-black uppercase text-black/70 mb-1">Active Drives</p>
                            <p className="text-3xl font-black">{stats?.active_drives || 0}</p>
                        </div>
                    </div>
                )}

                {/* Post Drive Form */}
                {showForm && (
                    <div className="bg-white border-3 border-black shadow-neo-lg p-6 md:p-8 relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-black hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                        <h3 className="text-2xl font-black uppercase mb-6 border-b-3 border-black pb-3 flex items-center gap-2">
                            <Building2 size={22} /> Post New Placement Drive
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {[
                                { name: "company", label: "Company Name", placeholder: "Google" },
                                { name: "role", label: "Role / Position", placeholder: "Software Engineer" },
                                { name: "package_lpa", label: "Package (LPA)", placeholder: "32", type: "number" },
                                { name: "deadline", label: "Application Deadline", type: "date" },
                                { name: "drive_date", label: "Drive Date", type: "date" },
                                { name: "location", label: "Location", placeholder: "Bangalore / Remote" },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="block text-xs font-black uppercase mb-1.5">{field.label}</label>
                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleFormChange}
                                        placeholder={field.placeholder}
                                        className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm focus:border-neo-cyan text-sm"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Drive Type</label>
                                <select name="type" value={form.type} onChange={handleFormChange} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white focus:outline-none text-sm">
                                    <option>On-Campus</option>
                                    <option>Off-Campus</option>
                                    <option>Pool Drive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Status</label>
                                <select name="status" value={form.status} onChange={handleFormChange} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white focus:outline-none text-sm">
                                    <option>Active</option>
                                    <option>Upcoming</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 xl:col-span-1">
                                <label className="block text-xs font-black uppercase mb-1.5">Eligibility Criteria</label>
                                <textarea name="eligibility" value={form.eligibility} onChange={handleFormChange} className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm resize-none text-sm" rows={3} placeholder="Min CGPA 7.0, No active backlogs, CSE/IT branches" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase mb-1.5">Description / JD</label>
                                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm resize-none text-sm" rows={3} placeholder="Job description and responsibilities..." />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button onClick={handlePostDrive} disabled={submitting} className="flex items-center gap-2 bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-cyan hover:text-black transition-colors active:shadow-none active:translate-y-[2px] disabled:opacity-50 text-sm">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />} Post Drive
                            </button>
                            <button onClick={() => setShowForm(false)} className="bg-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg active:shadow-none active:translate-y-[2px] transition-all text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Post Training Session Form */}
                {showSessionForm && (
                    <div className="bg-neo-yellow border-3 border-black shadow-neo-lg p-6 md:p-8 relative">
                        <button onClick={() => setShowSessionForm(false)} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-black hover:text-white transition-colors bg-white">
                            <X size={18} />
                        </button>
                        <h3 className="text-2xl font-black uppercase mb-6 border-b-3 border-black pb-3 flex items-center gap-2">
                            <BookOpen size={22} /> Post Training Session
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            <div className="md:col-span-2 xl:col-span-1">
                                <label className="block text-xs font-black uppercase mb-1.5">Session Title</label>
                                <input type="text" name="title" value={sessionForm.title} onChange={handleSessionChange} placeholder="Aptitude Training, DSA Workshop..." className="w-full border-2 border-black p-3 font-bold outline-none bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Session Type</label>
                                <select name="type" value={sessionForm.type} onChange={handleSessionChange} className="w-full border-2 border-black p-3 font-bold bg-white focus:outline-none text-sm">
                                    <option>General</option>
                                    <option>Technical</option>
                                    <option>Aptitude</option>
                                    <option>Soft Skills</option>
                                    <option>HR Prep</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Linked Drive (optional)</label>
                                <select name="placement_id" value={sessionForm.placement_id} onChange={handleSessionChange} className="w-full border-2 border-black p-3 font-bold bg-white focus:outline-none text-sm">
                                    <option value="">None</option>
                                    {drives.map(d => <option key={d.id} value={d.id}>{d.company} — {d.role}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Date</label>
                                <input type="date" name="date" value={sessionForm.date} onChange={handleSessionChange} className="w-full border-2 border-black p-3 font-bold outline-none bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Time</label>
                                <input type="time" name="time" value={sessionForm.time} onChange={handleSessionChange} className="w-full border-2 border-black p-3 font-bold outline-none bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">Venue</label>
                                <input type="text" name="venue" value={sessionForm.venue} onChange={handleSessionChange} placeholder="Seminar Hall A, Online (Teams)..." className="w-full border-2 border-black p-3 font-bold outline-none bg-white text-sm" />
                            </div>
                            <div className="md:col-span-2 xl:col-span-3">
                                <label className="block text-xs font-black uppercase mb-1.5">Description</label>
                                <textarea name="description" value={sessionForm.description} onChange={handleSessionChange} className="w-full border-2 border-black p-3 font-bold outline-none resize-none bg-white text-sm" rows={3} placeholder="What will be covered in this session?" />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button onClick={handlePostSession} disabled={submitting} className="flex items-center gap-2 bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-white hover:text-black transition-colors active:translate-y-[2px] disabled:opacity-50 text-sm">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />} Post Session
                            </button>
                            <button onClick={() => setShowSessionForm(false)} className="bg-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg active:translate-y-[2px] transition-all text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Drives Table */}
                {loading ? (
                    <div className="bg-white border-3 border-black p-12 flex items-center justify-center shadow-neo">
                        <Loader2 className="w-8 h-8 animate-spin mr-3" />
                        <span className="font-black uppercase">Loading drives...</span>
                    </div>
                ) : (
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-cyan flex items-center justify-between">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Building2 className="w-5 h-5" /> Placement Drives ({drives.length})
                            </h3>
                        </div>
                        {drives.length === 0 ? (
                            <div className="text-center py-16">
                                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-black uppercase text-gray-400">No drives posted yet</p>
                                <button onClick={() => setShowForm(true)} className="mt-4 bg-neo-cyan border-3 border-black px-6 py-2 font-black uppercase text-sm shadow-neo-sm hover:shadow-none hover:translate-y-1 transition-all">
                                    Post Your First Drive
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black text-white text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-5 py-3">Company</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20">Role</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20">Package</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20">Deadline</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20 text-center">Status</th>
                                            <th className="px-5 py-3 border-l-2 border-white/20 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-black">
                                        {drives.map((drive) => (
                                            <tr key={drive.id} className="hover:bg-neo-bg transition-colors group">
                                                <td className="px-5 py-4">
                                                    <p className="font-black text-lg leading-none">{drive.company}</p>
                                                    <p className="text-xs font-bold text-slate-500 mt-0.5">{drive.type || "On-Campus"}</p>
                                                </td>
                                                <td className="px-5 py-4 font-bold">{drive.role}</td>
                                                <td className="px-5 py-4 font-black text-neo-purple">{drive.package_lpa} LPA</td>
                                                <td className="px-5 py-4 font-bold text-sm">{drive.deadline ? new Date(drive.deadline).toLocaleDateString() : "—"}</td>
                                                <td className="px-5 py-4 text-center">
                                                    <select
                                                        className={`border-2 border-black px-2 py-1 text-xs font-black focus:outline-none cursor-pointer shadow-neo-sm ${STATUS_COLORS[drive.status] || "bg-gray-100"}`}
                                                        value={drive.status}
                                                        onChange={e => handleUpdateStatus(drive.id, e.target.value)}
                                                    >
                                                        <option>Active</option>
                                                        <option>Upcoming</option>
                                                        <option>Completed</option>
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <button
                                                            onClick={() => openDrive(drive)}
                                                            className="border-2 border-black bg-white px-3 py-1.5 text-xs font-bold hover:bg-neo-blue transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px] flex items-center gap-1"
                                                        >
                                                            <Eye className="w-3 h-3" /> View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDrive(drive.id)}
                                                            className="border-2 border-black bg-white px-2 py-1.5 text-xs font-bold hover:bg-neo-primary hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
