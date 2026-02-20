import React, { useState, useEffect, useRef } from "react";
import { Users, Search, Eye, GraduationCap, Upload, Download, Plus, Trash2, FolderOpen, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiGet, apiPost, apiDelete } from "../../utils/api";

// Sample CSV content for download
const SAMPLE_CSV = `roll_no,name,email
CS2101,Aarav Patel,aarav@campusx.edu
CS2102,Priya Sharma,priya@campusx.edu
CS2103,Rahul Kumar,rahul@campusx.edu`;

export default function ManageStudents() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const fileInput = useRef(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [tab, setTab] = useState("students");

    // Batch state
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchStudents, setBatchStudents] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    // Create batch form
    const [showCreateBatch, setShowCreateBatch] = useState(false);
    const [createMode, setCreateMode] = useState("manual"); // "manual" | "csv"
    const [batchForm, setBatchForm] = useState({ name: "", branch: "CSE", year: "1st", academic_year: "2025-26" });
    const [manualStudents, setManualStudents] = useState([{ roll_no: "", name: "", email: "" }]);
    const [csvStudents, setCsvStudents] = useState([]);
    const [creating, setCreating] = useState(false);

    // Load batches
    useEffect(() => {
        if (isAdmin) fetchBatches();
    }, []);

    const fetchBatches = async () => {
        setLoadingBatches(true);
        try {
            const res = await apiGet("/batches");
            setBatches(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoadingBatches(false);
    };

    const fetchBatchStudents = async (batchId) => {
        try {
            const res = await apiGet(`/batches/${batchId}/students`);
            setBatchStudents(res.data);
            setSelectedBatch(batchId);
        } catch (e) {
            console.error(e);
        }
    };

    // CSV handling
    const downloadSampleCSV = () => {
        const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sample_batch_students.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            const lines = text.split("\n").filter((l) => l.trim());
            const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
            const rollIdx = header.indexOf("roll_no");
            const nameIdx = header.indexOf("name");
            const emailIdx = header.indexOf("email");

            if (rollIdx === -1 || nameIdx === -1) {
                alert("CSV must have 'roll_no' and 'name' columns");
                return;
            }

            const students = [];
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(",").map((c) => c.trim());
                if (cols[rollIdx] && cols[nameIdx]) {
                    students.push({
                        roll_no: cols[rollIdx],
                        name: cols[nameIdx],
                        email: emailIdx >= 0 ? cols[emailIdx] || "" : "",
                    });
                }
            }
            setCsvStudents(students);
        };
        reader.readAsText(file);
    };

    // Manual entry helpers
    const addManualRow = () => setManualStudents([...manualStudents, { roll_no: "", name: "", email: "" }]);
    const removeManualRow = (i) => setManualStudents(manualStudents.filter((_, idx) => idx !== i));
    const updateManualRow = (i, field, value) => {
        const updated = [...manualStudents];
        updated[i][field] = value;
        setManualStudents(updated);
    };

    // Create batch
    const handleCreateBatch = async () => {
        const students = createMode === "csv" ? csvStudents : manualStudents.filter((s) => s.roll_no && s.name);
        if (!batchForm.name) return alert("Batch name is required");
        if (students.length === 0) return alert("Add at least one student");

        setCreating(true);
        try {
            const res = await apiPost("/batches", { ...batchForm, students });

            // Download credential CSV if available
            if (res.credentials && res.credentials.length > 0) {
                downloadCredentialCSV(res.credentials, batchForm.name);
            }

            setShowCreateBatch(false);
            setBatchForm({ name: "", branch: "CSE", year: "1st", academic_year: "2025-26" });
            setManualStudents([{ roll_no: "", name: "", email: "" }]);
            setCsvStudents([]);
            fetchBatches();
        } catch (e) {
            alert(e.message || "Failed to create batch");
        }
        setCreating(false);
    };

    // Generate and download credential CSV
    const downloadCredentialCSV = (credentials, batchName) => {
        const header = "Roll No,Name,Email,Password";
        const rows = credentials.map(c =>
            `${c.roll_no},${c.name},${c.email},${c.password}`
        );
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${batchName.replace(/\s+/g, "_")}_credentials.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Delete batch
    const handleDeleteBatch = async (id) => {
        if (!confirm("Delete this batch and all its students?")) return;
        try {
            await apiDelete(`/batches/${id}`);
            fetchBatches();
            if (selectedBatch === id) {
                setSelectedBatch(null);
                setBatchStudents([]);
            }
        } catch (e) {
            alert(e.message);
        }
    };

    // Student display (from selected batch or fallback mock)
    const displayStudents = selectedBatch ? batchStudents : [];
    const filtered = displayStudents.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.roll_no.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #137fec" }}
                    >
                        Manage Students
                    </h1>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateBatch(true)}
                            className="bg-neo-purple text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Create Batch
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Batches</p>
                        <p className="text-3xl font-black">{batches.length}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Students</p>
                        <p className="text-3xl font-black">{batches.reduce((a, b) => a + (b.student_count || 0), 0)}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Selected Batch</p>
                        <p className="text-lg font-black truncate">{batches.find((b) => b.id === selectedBatch)?.name || "None"}</p>
                    </div>
                    <div className="bg-neo-purple border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/80 mb-1">Viewing</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>
                            {filtered.length}
                        </p>
                    </div>
                </div>

                {/* Create Batch Modal */}
                {showCreateBatch && (
                    <div className="bg-white border-3 border-black shadow-neo p-6 relative">
                        <button onClick={() => setShowCreateBatch(false)} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-neo-red hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-2xl font-black uppercase italic mb-6 border-b-3 border-black pb-3" style={{ textShadow: "1px 1px 0 #A259FF" }}>
                            Create New Batch
                        </h3>

                        {/* Batch details */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Batch Name</label>
                                <input value={batchForm.name} onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm outline-none" placeholder="CSE-A-2025" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Branch</label>
                                <select value={batchForm.branch} onChange={(e) => setBatchForm({ ...batchForm, branch: e.target.value })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white">
                                    <option>CSE</option><option>ECE</option><option>ME</option><option>IT</option><option>EE</option><option>CE</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Year</label>
                                <select value={batchForm.year} onChange={(e) => setBatchForm({ ...batchForm, year: e.target.value })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white">
                                    <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Academic Year</label>
                                <input value={batchForm.academic_year} onChange={(e) => setBatchForm({ ...batchForm, academic_year: e.target.value })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm outline-none" placeholder="2025-26" />
                            </div>
                        </div>

                        {/* Mode toggle */}
                        <div className="flex gap-3 mb-6">
                            <button onClick={() => setCreateMode("manual")} className={`flex items-center gap-2 px-5 py-2 border-2 border-black font-black uppercase text-sm shadow-neo-sm transition-all ${createMode === "manual" ? "bg-black text-white translate-x-[2px] translate-y-[2px] shadow-none" : "bg-white hover:-translate-y-1"}`}>
                                <Users className="w-4 h-4" /> Manual Entry
                            </button>
                            <button onClick={() => setCreateMode("csv")} className={`flex items-center gap-2 px-5 py-2 border-2 border-black font-black uppercase text-sm shadow-neo-sm transition-all ${createMode === "csv" ? "bg-black text-white translate-x-[2px] translate-y-[2px] shadow-none" : "bg-white hover:-translate-y-1"}`}>
                                <Upload className="w-4 h-4" /> CSV Upload
                            </button>
                        </div>

                        {/* Manual Entry */}
                        {createMode === "manual" && (
                            <div>
                                <div className="overflow-x-auto border-2 border-black">
                                    <table className="w-full text-left">
                                        <thead className="bg-black text-white text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-4 py-3">Roll No</th>
                                                <th className="px-4 py-3 border-l border-white/20">Name</th>
                                                <th className="px-4 py-3 border-l border-white/20">Email</th>
                                                <th className="px-4 py-3 border-l border-white/20 w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black">
                                            {manualStudents.map((s, i) => (
                                                <tr key={i}>
                                                    <td className="px-2 py-2"><input value={s.roll_no} onChange={(e) => updateManualRow(i, "roll_no", e.target.value)} className="w-full border border-black p-2 font-bold text-sm outline-none" placeholder="CS2101" /></td>
                                                    <td className="px-2 py-2"><input value={s.name} onChange={(e) => updateManualRow(i, "name", e.target.value)} className="w-full border border-black p-2 font-bold text-sm outline-none" placeholder="Student Name" /></td>
                                                    <td className="px-2 py-2"><input value={s.email} onChange={(e) => updateManualRow(i, "email", e.target.value)} className="w-full border border-black p-2 font-bold text-sm outline-none" placeholder="email@campusx.edu" /></td>
                                                    <td className="px-2 py-2 text-center">
                                                        {manualStudents.length > 1 && (
                                                            <button onClick={() => removeManualRow(i)} className="border border-black p-1 hover:bg-neo-red hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button onClick={addManualRow} className="mt-3 border-2 border-black bg-neo-bg px-4 py-2 text-sm font-bold shadow-neo-sm hover:-translate-y-0.5 transition-transform">
                                    + Add Row
                                </button>
                            </div>
                        )}

                        {/* CSV Upload */}
                        {createMode === "csv" && (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <button onClick={downloadSampleCSV} className="flex items-center gap-2 border-2 border-black bg-neo-cyan px-5 py-2 font-bold shadow-neo-sm hover:-translate-y-0.5 transition-transform text-sm">
                                        <Download className="w-4 h-4" /> Download Sample CSV
                                    </button>
                                    <button onClick={() => fileInput.current?.click()} className="flex items-center gap-2 border-2 border-black bg-neo-yellow px-5 py-2 font-bold shadow-neo-sm hover:-translate-y-0.5 transition-transform text-sm">
                                        <Upload className="w-4 h-4" /> Upload CSV
                                    </button>
                                    <input ref={fileInput} type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                                </div>

                                {csvStudents.length > 0 && (
                                    <div className="border-2 border-black">
                                        <div className="bg-neo-green px-4 py-2 border-b-2 border-black font-black text-sm uppercase">
                                            {csvStudents.length} students parsed from CSV
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-black text-white text-xs uppercase font-bold sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-2">Roll No</th>
                                                        <th className="px-4 py-2">Name</th>
                                                        <th className="px-4 py-2">Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-black/30">
                                                    {csvStudents.map((s, i) => (
                                                        <tr key={i} className="hover:bg-neo-bg">
                                                            <td className="px-4 py-2 font-mono font-bold">{s.roll_no}</td>
                                                            <td className="px-4 py-2 font-bold">{s.name}</td>
                                                            <td className="px-4 py-2">{s.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-6 flex gap-4">
                            <button onClick={handleCreateBatch} disabled={creating} className="bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-purple transition-colors active:shadow-none active:translate-y-[2px] disabled:opacity-50">
                                {creating ? "Creating..." : "Create Batch"}
                            </button>
                            <button onClick={() => setShowCreateBatch(false)} className="bg-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg active:shadow-none active:translate-y-[2px] transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Batch List + Student Table */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Batch List Sidebar */}
                    {isAdmin && (
                        <div className="lg:col-span-4 bg-white border-3 border-black shadow-neo">
                            <div className="px-5 py-4 border-b-3 border-black bg-neo-purple">
                                <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-2">
                                    <FolderOpen className="w-5 h-5" /> Batches
                                </h3>
                            </div>
                            <div className="divide-y-2 divide-black max-h-[500px] overflow-y-auto">
                                {loadingBatches ? (
                                    <div className="p-6 text-center font-bold text-slate-400">Loading...</div>
                                ) : batches.length === 0 ? (
                                    <div className="p-6 text-center font-bold text-slate-400">No batches yet. Create one!</div>
                                ) : (
                                    batches.map((b) => (
                                        <div
                                            key={b.id}
                                            onClick={() => fetchBatchStudents(b.id)}
                                            className={`px-5 py-4 cursor-pointer hover:bg-neo-bg transition-colors flex justify-between items-center ${selectedBatch === b.id ? "bg-neo-bg border-l-4 border-neo-purple" : ""}`}
                                        >
                                            <div>
                                                <p className="font-black">{b.name}</p>
                                                <p className="text-xs font-bold text-slate-500">{b.branch} · {b.year} · {b.academic_year}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-neo-blue border border-black px-2 py-0.5 text-xs font-black">{b.student_count}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteBatch(b.id); }}
                                                    className="border border-black p-1 hover:bg-neo-red hover:text-white transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Student Table */}
                    <div className={isAdmin ? "lg:col-span-8" : "lg:col-span-12"}>
                        <div className="bg-white border-3 border-black shadow-neo">
                            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-4 border-b-3 border-black bg-neo-blue gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black text-white p-1 border-2 border-white">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-black uppercase italic">
                                        {selectedBatch ? `Students — ${batches.find((b) => b.id === selectedBatch)?.name}` : "Student Directory"}
                                    </h3>
                                </div>
                                <div className="relative md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full border-2 border-black pl-9 pr-3 py-2 text-sm font-bold outline-none shadow-neo-sm"
                                        placeholder="Search..."
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                {!selectedBatch ? (
                                    <div className="p-12 text-center">
                                        <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                        <p className="text-lg font-black text-slate-400 uppercase">Select a batch to view students</p>
                                        <p className="text-sm font-bold text-slate-300 mt-1">Or create a new batch using the button above</p>
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-lg font-black text-slate-400">No students found</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-black text-white text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-3">Roll No</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20">Name</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-black">
                                            {filtered.map((s) => (
                                                <tr key={s.id} className="hover:bg-neo-bg transition-colors">
                                                    <td className="px-6 py-4 font-mono font-bold">{s.roll_no}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-neo-purple border-2 border-black flex items-center justify-center text-white font-black text-xs">
                                                                {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                            </div>
                                                            <span className="font-black">{s.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-sm">{s.email || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
