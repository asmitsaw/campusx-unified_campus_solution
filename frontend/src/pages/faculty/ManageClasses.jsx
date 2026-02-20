import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Users, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiGet, apiPost, apiDelete } from "../../utils/api";

export default function ManageClasses() {
    const { user } = useAuth();

    const [classes, setClasses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: "", subject_code: "", batch_id: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classRes, batchRes] = await Promise.all([
                apiGet("/classes"),
                apiGet("/batches"),
            ]);
            setClasses(classRes.data);
            setBatches(batchRes.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!form.name || !form.batch_id) return alert("Class name and batch are required");
        setCreating(true);
        try {
            await apiPost("/classes", form);
            setShowForm(false);
            setForm({ name: "", subject_code: "", batch_id: "" });
            fetchData();
        } catch (e) {
            alert(e.message);
        }
        setCreating(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this class?")) return;
        try {
            await apiDelete(`/classes/${id}`);
            fetchData();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #5CE65C" }}
                    >
                        Manage Classes
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-neo-green text-black border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Create Class
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">My Classes</p>
                        <p className="text-3xl font-black">{classes.length}</p>
                    </div>
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Available Batches</p>
                        <p className="text-3xl font-black">{batches.length}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Role</p>
                        <p className="text-lg font-black uppercase">{user?.role?.replace("_", " ")}</p>
                    </div>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white border-3 border-black shadow-neo p-6 relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-neo-red hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-black uppercase mb-6 border-b-3 border-black pb-3">Create New Class</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Class Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm"
                                    placeholder="Data Structures"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Subject Code</label>
                                <input
                                    value={form.subject_code}
                                    onChange={(e) => setForm({ ...form, subject_code: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm"
                                    placeholder="CS-301"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Select Batch</label>
                                <select
                                    value={form.batch_id}
                                    onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white"
                                >
                                    <option value="">-- Select Batch --</option>
                                    {batches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name} ({b.branch} · {b.year} · {b.academic_year})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleCreate}
                                disabled={creating}
                                className="bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-green hover:text-black transition-colors active:shadow-none active:translate-y-[2px] disabled:opacity-50"
                            >
                                {creating ? "Creating..." : "Create Class"}
                            </button>
                            <button onClick={() => setShowForm(false)} className="bg-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg active:shadow-none active:translate-y-[2px] transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Classes List */}
                <div className="bg-white border-3 border-black shadow-neo">
                    <div className="px-6 py-4 border-b-3 border-black bg-neo-green">
                        <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> {user?.role === "admin" ? "All Classes" : "My Classes"}
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-12 text-center font-bold text-slate-400">Loading...</div>
                    ) : classes.length === 0 ? (
                        <div className="p-12 text-center">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-black text-slate-400 uppercase">No classes yet</p>
                            <p className="text-sm font-bold text-slate-300 mt-1">Create your first class using the button above</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black text-white text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-3">Class</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Subject Code</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Batch</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20">Branch / Year</th>
                                        <th className="px-6 py-3 border-l-2 border-white/20 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {classes.map((cls) => (
                                        <tr key={cls.id} className="hover:bg-neo-bg transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-neo-green border-2 border-black flex items-center justify-center font-black text-sm shadow-neo-sm group-hover:-translate-y-[2px] transition-transform">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-black text-lg">{cls.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold">{cls.subject_code || "—"}</td>
                                            <td className="px-6 py-4 font-bold">{cls.batches?.name || "—"}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-neo-blue border border-black px-2 py-0.5 text-xs font-black">{cls.batches?.branch}</span>
                                                <span className="ml-2 text-sm font-bold">{cls.batches?.year}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(cls.id)}
                                                    className="border-2 border-black bg-white p-1.5 hover:bg-neo-red hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
