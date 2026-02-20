import React, { useState, useEffect } from "react";
import { Home, Users, AlertTriangle, Utensils, CheckCircle, Clock, Wrench, Plus, Trash2, X, Edit3, Save, Search, FolderOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/api";

const STATUS_COLORS = {
    Occupied: "bg-neo-green",
    Vacant: "bg-neo-blue",
    Maintenance: "bg-neo-yellow",
    "In Progress": "bg-neo-yellow",
    Pending: "bg-neo-red text-white",
    Resolved: "bg-neo-green",
};

const MEAL_COLORS = {
    Breakfast: "bg-neo-green",
    Lunch: "bg-neo-yellow",
    Snacks: "bg-neo-pink",
    Dinner: "bg-neo-blue",
};

const BLOCKS = ["Cauvery", "Godavari", "Narmada", "Krishna"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_MEALS = [
    { meal: "Breakfast", time_slot: "7:30 - 9:30 AM", items: [] },
    { meal: "Lunch", time_slot: "12:00 - 2:00 PM", items: [] },
    { meal: "Snacks", time_slot: "5:00 - 6:00 PM", items: [] },
    { meal: "Dinner", time_slot: "8:00 - 10:00 PM", items: [] },
];

export default function ManageHostel() {
    const { user } = useAuth();
    const [tab, setTab] = useState("rooms");

    // Rooms
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({ block: "Cauvery", room_no: "", capacity: 1 });
    const [roomFilter, setRoomFilter] = useState("All");

    // Allocation modal — batch-based
    const [allocatingRoom, setAllocatingRoom] = useState(null);
    const [batches, setBatches] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [batchStudents, setBatchStudents] = useState([]);
    const [loadingBatchStudents, setLoadingBatchStudents] = useState(false);
    const [studentSearch, setStudentSearch] = useState("");

    // Complaints
    const [complaints, setComplaints] = useState([]);
    const [loadingComplaints, setLoadingComplaints] = useState(true);
    const [complaintFilter, setComplaintFilter] = useState("All");

    // Mess
    const [messMenu, setMessMenu] = useState([]);
    const [loadingMess, setLoadingMess] = useState(true);
    const [editingMess, setEditingMess] = useState(false);
    const [editedMeals, setEditedMeals] = useState([]);
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [savingMess, setSavingMess] = useState(false);

    useEffect(() => {
        fetchRooms();
        fetchComplaints();
        fetchBatches();
    }, []);

    useEffect(() => {
        fetchMess();
    }, [selectedDay]);

    // ---- Fetch ----
    const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const res = await apiGet("/hostel/rooms");
            setRooms(res.data || []);
        } catch (e) { console.error(e); }
        setLoadingRooms(false);
    };

    const fetchComplaints = async () => {
        setLoadingComplaints(true);
        try {
            const res = await apiGet("/hostel/complaints");
            setComplaints(res.data || []);
        } catch (e) { console.error(e); }
        setLoadingComplaints(false);
    };

    const fetchMess = async () => {
        setLoadingMess(true);
        try {
            const res = await apiGet(`/hostel/mess?day=${selectedDay}`);
            const data = res.data || [];
            setMessMenu(data);
            if (data.length > 0) {
                setEditedMeals(data.map(m => ({ ...m, items: [...m.items] })));
            } else {
                setEditedMeals(DEFAULT_MEALS.map(m => ({ ...m, items: [...m.items], day_of_week: selectedDay })));
            }
        } catch (e) { console.error(e); }
        setLoadingMess(false);
    };

    const fetchBatches = async () => {
        try {
            const res = await apiGet("/batches");
            setBatches(res.data || []);
        } catch (e) {
            console.error("Failed to fetch batches:", e);
            // Show alert so warden knows if it's a permission issue
            if (e.message?.includes("Access denied") || e.message?.includes("403")) {
                alert("Cannot load batches: Access denied. Ask admin to check permissions.");
            }
        }
    };

    const fetchBatchStudents = async (batchId) => {
        if (!batchId) { setBatchStudents([]); return; }
        setLoadingBatchStudents(true);
        try {
            const res = await apiGet(`/batches/${batchId}/students`);
            setBatchStudents(res.data || []);
        } catch (e) { console.error(e); setBatchStudents([]); }
        setLoadingBatchStudents(false);
    };

    // ---- Room actions ----
    const handleAddRoom = async () => {
        if (!roomForm.room_no) return alert("Room number required");
        try {
            await apiPost("/hostel/rooms", roomForm);
            setShowAddRoom(false);
            setRoomForm({ block: "Cauvery", room_no: "", capacity: 1 });
            fetchRooms();
        } catch (e) { alert(e.message); }
    };

    const handleDeleteRoom = async (id) => {
        if (!confirm("Delete this room?")) return;
        try {
            await apiDelete(`/hostel/rooms/${id}`);
            fetchRooms();
        } catch (e) { alert(e.message); }
    };

    // Open allocation modal
    const openAllocateModal = (room) => {
        setAllocatingRoom(room);
        setSelectedBatchId("");
        setBatchStudents([]);
        setStudentSearch("");
    };

    // When batch is selected, load its students
    const handleBatchSelect = (batchId) => {
        setSelectedBatchId(batchId);
        setStudentSearch("");
        fetchBatchStudents(batchId);
    };

    // Allocate a student from batch to room
    const handleAllocateStudent = async (student) => {
        if (!allocatingRoom) return;
        // Use user_id from batch_students if available, otherwise fall back to student name
        const userId = student.user_id;
        if (!userId) {
            alert("This student doesn't have a linked user account. Ask admin to re-create the batch.");
            return;
        }
        try {
            await apiPut(`/hostel/rooms/${allocatingRoom.id}`, {
                student_id: userId,
                student_name: student.name,
                status: "Occupied",
            });
            setAllocatingRoom(null);
            setSelectedBatchId("");
            setBatchStudents([]);
            setStudentSearch("");
            fetchRooms();
        } catch (e) { alert(e.message); }
    };

    const handleVacateRoom = async (room) => {
        if (!confirm(`Vacate ${room.room_no}?`)) return;
        try {
            await apiPut(`/hostel/rooms/${room.id}`, {
                student_name: null,
                student_id: null,
                status: "Vacant",
            });
            fetchRooms();
        } catch (e) { alert(e.message); }
    };

    const handleMaintenanceRoom = async (room) => {
        try {
            await apiPut(`/hostel/rooms/${room.id}`, {
                student_name: null,
                student_id: null,
                status: "Maintenance",
            });
            fetchRooms();
        } catch (e) { alert(e.message); }
    };

    // ---- Complaint actions ----
    const handleUpdateComplaint = async (id, status) => {
        try {
            await apiPut(`/hostel/complaints/${id}`, { status });
            fetchComplaints();
        } catch (e) { alert(e.message); }
    };

    // ---- Mess actions ----
    const handleUpdateMessItem = (mealIdx, itemIdx, value) => {
        const updated = [...editedMeals];
        updated[mealIdx] = { ...updated[mealIdx], items: [...updated[mealIdx].items] };
        updated[mealIdx].items[itemIdx] = value;
        setEditedMeals(updated);
    };

    const handleAddMessItem = (mealIdx) => {
        const updated = [...editedMeals];
        updated[mealIdx] = { ...updated[mealIdx], items: [...updated[mealIdx].items, ""] };
        setEditedMeals(updated);
    };

    const handleRemoveMessItem = (mealIdx, itemIdx) => {
        const updated = [...editedMeals];
        updated[mealIdx] = { ...updated[mealIdx], items: updated[mealIdx].items.filter((_, j) => j !== itemIdx) };
        setEditedMeals(updated);
    };

    const handleSaveMess = async () => {
        setSavingMess(true);
        try {
            const meals = editedMeals.map(m => ({
                meal: m.meal,
                time_slot: m.time_slot,
                items: m.items.filter(i => i.trim()),
                day_of_week: selectedDay,
            }));
            await apiPut("/hostel/mess", { meals });
            setEditingMess(false);
            fetchMess();
        } catch (e) { alert(e.message); }
        setSavingMess(false);
    };

    // ---- Computed ----
    const occupied = rooms.filter(r => r.status === "Occupied").length;
    const vacant = rooms.filter(r => r.status === "Vacant").length;
    const maintenanceCount = rooms.filter(r => r.status === "Maintenance").length;
    const openComplaints = complaints.filter(c => c.status !== "Resolved").length;

    const filteredRooms = roomFilter === "All" ? rooms : rooms.filter(r => r.status === roomFilter);
    const filteredComplaints = complaintFilter === "All" ? complaints : complaints.filter(c => c.status === complaintFilter);

    // Filter batch students by search within allocation modal
    const filteredBatchStudents = studentSearch.trim()
        ? batchStudents.filter(s =>
            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.roll_no.toLowerCase().includes(studentSearch.toLowerCase()) ||
            (s.email && s.email.toLowerCase().includes(studentSearch.toLowerCase()))
        )
        : batchStudents;

    // Check which students are already allocated to any room
    const allocatedStudentIds = new Set(rooms.filter(r => r.student_id).map(r => r.student_id));

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter" style={{ textShadow: "2px 2px 0px #fbef23" }}>
                        Manage Hostel
                    </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="bg-neo-blue border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Rooms</p>
                        <p className="text-3xl font-black">{rooms.length}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Occupied</p>
                        <p className="text-3xl font-black">{occupied}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Vacant</p>
                        <p className="text-3xl font-black">{vacant}</p>
                    </div>
                    <div className="bg-neo-pink border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Maintenance</p>
                        <p className="text-3xl font-black">{maintenanceCount}</p>
                    </div>
                    <div className="bg-neo-red border-3 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/90 mb-1">Open Complaints</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>{openComplaints}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3">
                    {[
                        { key: "rooms", label: "Rooms", icon: Home },
                        { key: "complaints", label: "Complaints", icon: Wrench },
                        { key: "mess", label: "Mess Menu", icon: Utensils },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 px-6 py-3 border-3 border-black font-black uppercase text-sm shadow-neo-sm transition-all ${tab === t.key ? "bg-black text-white translate-x-[2px] translate-y-[2px] shadow-none" : "bg-white hover:-translate-y-1 hover:shadow-neo"}`}
                        >
                            <t.icon className="w-4 h-4" /> {t.label}
                            {t.key === "complaints" && openComplaints > 0 && (
                                <span className="bg-neo-red text-white border border-black px-1.5 py-0.5 text-[10px] font-black ml-1">{openComplaints}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ==================== ROOMS TAB ==================== */}
                {tab === "rooms" && (
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-3 justify-between items-center">
                            <div className="flex gap-2">
                                {["All", "Vacant", "Occupied", "Maintenance"].map(f => (
                                    <button key={f} onClick={() => setRoomFilter(f)}
                                        className={`px-4 py-2 border-2 border-black text-sm font-bold transition-all ${roomFilter === f ? "bg-black text-white" : "bg-white hover:bg-neo-bg"}`}>{f}</button>
                                ))}
                            </div>
                            <button onClick={() => setShowAddRoom(true)} className="bg-neo-green text-black border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Add Room
                            </button>
                        </div>

                        {showAddRoom && (
                            <div className="bg-white border-3 border-black shadow-neo p-6 relative">
                                <button onClick={() => setShowAddRoom(false)} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-neo-red hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                <h3 className="text-xl font-black uppercase mb-4">Add Room</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Block</label>
                                        <select value={roomForm.block} onChange={e => setRoomForm({ ...roomForm, block: e.target.value })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white">
                                            {BLOCKS.map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Room No</label>
                                        <input value={roomForm.room_no} onChange={e => setRoomForm({ ...roomForm, room_no: e.target.value })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm outline-none" placeholder="B-101" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Capacity</label>
                                        <input type="number" min={1} max={4} value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 1 })} className="w-full border-2 border-black p-3 font-bold shadow-neo-sm outline-none" />
                                    </div>
                                </div>
                                <button onClick={handleAddRoom} className="mt-4 bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-green hover:text-black transition-colors active:shadow-none active:translate-y-[2px]">Add Room</button>
                            </div>
                        )}

                        {/* Allocation Modal — Batch-based */}
                        {allocatingRoom && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setAllocatingRoom(null); setSelectedBatchId(""); setBatchStudents([]); setStudentSearch(""); }}>
                                <div className="bg-white border-4 border-black shadow-neo max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                                    <div className="bg-neo-green border-b-4 border-black p-4 flex justify-between items-center shrink-0">
                                        <h3 className="font-black uppercase text-lg">Allocate Room {allocatingRoom.room_no}</h3>
                                        <button onClick={() => { setAllocatingRoom(null); setSelectedBatchId(""); setBatchStudents([]); setStudentSearch(""); }} className="border-2 border-black p-1 bg-white hover:bg-neo-red hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                        {/* Step 1: Select Batch */}
                                        <div>
                                            <label className="block text-xs font-black uppercase mb-2">
                                                <FolderOpen className="w-4 h-4 inline mr-1" /> Select Batch
                                            </label>
                                            <select
                                                value={selectedBatchId}
                                                onChange={e => handleBatchSelect(e.target.value)}
                                                className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white"
                                            >
                                                <option value="">-- Choose a batch --</option>
                                                {batches.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name} ({b.branch} · {b.year} · {b.student_count} students)</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Step 2: Search & Pick Student */}
                                        {selectedBatchId && (
                                            <>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
                                                    <input
                                                        value={studentSearch}
                                                        onChange={e => setStudentSearch(e.target.value)}
                                                        className="w-full border-2 border-black p-3 pl-10 font-bold outline-none shadow-neo-sm"
                                                        placeholder="Filter by name, roll no, or email..."
                                                    />
                                                </div>

                                                {loadingBatchStudents ? (
                                                    <p className="text-center font-bold text-slate-400 py-4">Loading students...</p>
                                                ) : filteredBatchStudents.length === 0 ? (
                                                    <p className="text-center font-bold text-slate-400 text-sm py-4">No students found in this batch</p>
                                                ) : (
                                                    <div className="border-2 border-black divide-y-2 divide-black max-h-72 overflow-y-auto">
                                                        {filteredBatchStudents.map(s => {
                                                            const isAllocated = s.user_id && allocatedStudentIds.has(s.user_id);
                                                            return (
                                                                <button
                                                                    key={s.id}
                                                                    onClick={() => !isAllocated && handleAllocateStudent(s)}
                                                                    disabled={isAllocated || !s.user_id}
                                                                    className={`w-full text-left px-4 py-3 flex justify-between items-center transition-colors ${isAllocated ? "bg-gray-100 opacity-50 cursor-not-allowed" : !s.user_id ? "bg-red-50 opacity-60 cursor-not-allowed" : "hover:bg-neo-green group"}`}
                                                                >
                                                                    <div>
                                                                        <p className="font-black text-sm">{s.name}</p>
                                                                        <p className="text-xs font-bold text-slate-400">
                                                                            <span className="font-mono">{s.roll_no}</span>
                                                                            {s.email && <span className="ml-2">· {s.email}</span>}
                                                                        </p>
                                                                    </div>
                                                                    {isAllocated ? (
                                                                        <span className="text-xs font-black uppercase border-2 border-black px-2 py-1 bg-neo-yellow">Already Allocated</span>
                                                                    ) : !s.user_id ? (
                                                                        <span className="text-xs font-black uppercase border-2 border-black px-2 py-1 bg-neo-red text-white">No Account</span>
                                                                    ) : (
                                                                        <span className="text-xs font-black uppercase border-2 border-black px-2 py-1 bg-white group-hover:bg-black group-hover:text-white transition-colors">Allocate</span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {!selectedBatchId && (
                                            <div className="py-8 text-center">
                                                <FolderOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                                                <p className="font-black text-slate-400 uppercase text-sm">Select a batch to see students</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border-3 border-black shadow-neo">
                            <div className="px-6 py-4 border-b-3 border-black bg-neo-blue">
                                <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2"><Home className="w-5 h-5" /> Room Allocation</h3>
                            </div>
                            {loadingRooms ? <div className="p-8 text-center font-bold text-slate-400">Loading...</div> : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-black text-white text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-3">Block</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20">Room</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20">Student</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20">Capacity</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20 text-center">Status</th>
                                                <th className="px-6 py-3 border-l-2 border-white/20 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-black">
                                            {filteredRooms.map((room) => (
                                                <tr key={room.id} className="hover:bg-neo-bg transition-colors">
                                                    <td className="px-6 py-4 font-black">{room.block}</td>
                                                    <td className="px-6 py-4 font-mono font-bold">{room.room_no}</td>
                                                    <td className="px-6 py-4 font-bold">{room.student_name || "—"}</td>
                                                    <td className="px-6 py-4 font-bold">{room.capacity}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${STATUS_COLORS[room.status]}`}>{room.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex gap-2 justify-end flex-wrap">
                                                            {room.status === "Vacant" && (
                                                                <button onClick={() => openAllocateModal(room)} className="border-2 border-black bg-neo-green px-3 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">Allocate</button>
                                                            )}
                                                            {room.status === "Occupied" && (
                                                                <button onClick={() => handleVacateRoom(room)} className="border-2 border-black bg-neo-yellow px-3 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">Vacate</button>
                                                            )}
                                                            {room.status !== "Maintenance" && (
                                                                <button onClick={() => handleMaintenanceRoom(room)} className="border-2 border-black bg-white px-3 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all hover:bg-neo-yellow" title="Mark as under maintenance">🔧</button>
                                                            )}
                                                            {room.status === "Maintenance" && (
                                                                <button onClick={async () => { await apiPut(`/hostel/rooms/${room.id}`, { status: "Vacant" }); fetchRooms(); }} className="border-2 border-black bg-neo-blue px-3 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">Ready</button>
                                                            )}
                                                            <button onClick={() => handleDeleteRoom(room.id)} className="border-2 border-black bg-white p-1 hover:bg-neo-red hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredRooms.length === 0 && (
                                                <tr><td colSpan={6} className="px-6 py-12 text-center font-bold text-slate-400">No rooms {roomFilter !== "All" ? `with status "${roomFilter}"` : "added yet"}</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== COMPLAINTS TAB ==================== */}
                {tab === "complaints" && (
                    <div className="space-y-6">
                        <div className="flex gap-2">
                            {["All", "Pending", "In Progress", "Resolved"].map(f => (
                                <button key={f} onClick={() => setComplaintFilter(f)}
                                    className={`px-4 py-2 border-2 border-black text-sm font-bold transition-all ${complaintFilter === f ? "bg-black text-white" : "bg-white hover:bg-neo-bg"}`}>{f}
                                    {f !== "All" && <span className="ml-1 text-[10px]">({complaints.filter(c => f === "All" ? true : c.status === f).length})</span>}
                                </button>
                            ))}
                        </div>
                        <div className="bg-white border-3 border-black shadow-neo">
                            <div className="px-6 py-4 border-b-3 border-black bg-neo-red">
                                <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" /> Complaints ({filteredComplaints.length})
                                </h3>
                            </div>
                            {loadingComplaints ? <div className="p-8 text-center font-bold text-slate-400">Loading...</div> : filteredComplaints.length === 0 ? (
                                <div className="p-12 text-center">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-neo-green" />
                                    <p className="text-lg font-black text-slate-400 uppercase">No {complaintFilter !== "All" ? complaintFilter.toLowerCase() : ""} complaints! 🎉</p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-black">
                                    {filteredComplaints.map((c) => (
                                        <div key={c.id} className="px-6 py-5 hover:bg-neo-bg transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-neo-purple border-2 border-black flex items-center justify-center text-white shrink-0">
                                                    <Wrench className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black">{c.category} — <span className="font-mono">{c.room_no}</span></p>
                                                    <p className="text-sm font-bold text-slate-500">{c.student_name} · {new Date(c.created_at).toLocaleDateString()}</p>
                                                    {c.description && <p className="text-xs text-slate-400 mt-1 max-w-md">{c.description}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 flex-wrap">
                                                <span className={`border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                                                {c.status === "Pending" && (
                                                    <button onClick={() => handleUpdateComplaint(c.id, "In Progress")} className="border-2 border-black bg-neo-yellow px-3 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">
                                                        <Clock className="w-4 h-4 inline mr-1" /> In Progress
                                                    </button>
                                                )}
                                                {c.status !== "Resolved" && (
                                                    <button onClick={() => handleUpdateComplaint(c.id, "Resolved")} className="border-2 border-black bg-neo-green px-3 py-1 text-sm font-bold shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">
                                                        <CheckCircle className="w-4 h-4 inline mr-1" /> Resolve
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== MESS MENU TAB ==================== */}
                {tab === "mess" && (
                    <div className="bg-white border-3 border-black shadow-neo">
                        <div className="px-6 py-4 border-b-3 border-black bg-neo-yellow flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <h3 className="text-xl font-black text-black uppercase italic flex items-center gap-2">
                                <Utensils className="w-5 h-5" /> Mess Menu
                            </h3>
                            <div className="flex items-center gap-3 flex-wrap">
                                <select value={selectedDay} onChange={e => { setSelectedDay(e.target.value); setEditingMess(false); }} className="border-2 border-black bg-white px-3 py-2 font-bold text-sm shadow-neo-sm">
                                    {DAYS.map(d => <option key={d}>{d}</option>)}
                                </select>
                                {!editingMess ? (
                                    <button onClick={() => setEditingMess(true)} className="flex items-center gap-1 bg-black text-white border-2 border-black px-4 py-2 font-bold text-sm uppercase shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingMess(false); fetchMess(); }} className="flex items-center gap-1 bg-white border-2 border-black px-4 py-2 font-bold text-sm uppercase shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveMess} disabled={savingMess} className="flex items-center gap-1 bg-neo-green border-2 border-black px-4 py-2 font-bold text-sm uppercase shadow-neo-sm active:shadow-none active:translate-y-[2px] transition-all disabled:opacity-50">
                                            <Save className="w-4 h-4" /> {savingMess ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loadingMess ? <div className="p-8 text-center font-bold text-slate-400">Loading...</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
                                {(editingMess ? editedMeals : (messMenu.length > 0 ? messMenu : DEFAULT_MEALS)).map((meal, i) => (
                                    <div key={meal.meal || i} className="p-6 hover:bg-neo-bg transition-colors">
                                        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                            <h4 className={`font-black text-lg uppercase ${MEAL_COLORS[meal.meal] || "bg-neo-blue"} inline-block px-2 border-2 border-black shadow-neo-sm`}>{meal.meal}</h4>
                                            <span className="text-xs font-bold bg-black text-white px-1">{meal.time_slot}</span>
                                        </div>
                                        {editingMess ? (
                                            <div className="space-y-2">
                                                {meal.items.map((item, j) => (
                                                    <div key={j} className="flex gap-2">
                                                        <input value={item} onChange={e => handleUpdateMessItem(i, j, e.target.value)} className="flex-1 border border-black p-1.5 text-sm font-bold outline-none" />
                                                        <button onClick={() => handleRemoveMessItem(i, j)} className="border border-black p-1 hover:bg-neo-red hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => handleAddMessItem(i)} className="text-xs font-bold border border-dashed border-black px-2 py-1 hover:bg-neo-bg transition-colors w-full text-center">+ Add Item</button>
                                            </div>
                                        ) : (
                                            <ul className="text-sm space-y-3 font-bold">
                                                {meal.items.map((item, j) => (
                                                    <li key={j} className="flex items-center gap-3"><span className="w-3 h-3 bg-black" /> {item}</li>
                                                ))}
                                                {meal.items.length === 0 && <li className="text-slate-400 italic">No items set</li>}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
