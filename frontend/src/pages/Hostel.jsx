import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPost } from "../utils/api";

export default function Hostel() {
    const { user } = useAuth();

    const [complaints, setComplaints] = useState([]);
    const [messMenu, setMessMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    // Complaint form
    const [complaintForm, setComplaintForm] = useState({ room_no: "", category: "Electrical", description: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const today = days[new Date().getDay()];
            const [compRes, messRes] = await Promise.all([
                apiGet("/hostel/complaints"),
                apiGet(`/hostel/mess?day=${today}`),
            ]);
            setComplaints(compRes.data);
            setMessMenu(messRes.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        if (!complaintForm.room_no || !complaintForm.category) return alert("Room No and Category are required");
        setSubmitting(true);
        try {
            await apiPost("/hostel/complaints", complaintForm);
            setComplaintForm({ room_no: "", category: "Electrical", description: "" });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
            fetchData();
        } catch (e) {
            alert(e.message);
        }
        setSubmitting(false);
    };

    const MEAL_COLORS = { Breakfast: "neo-accent-green", Lunch: "neo-accent-yellow", Snacks: "neo-accent-orange", Dinner: "neo-accent-blue" };
    const STATUS_BADGE = { Pending: "bg-neo-accent-orange text-white", "In Progress": "bg-neo-accent-yellow text-black", Resolved: "bg-neo-accent-green text-black" };

    return (
        <div className="bg-[#f0f0f0] text-black min-h-screen pb-10 p-6 -m-6 font-display" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8">
                    {/* Header Card */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white border-4 border-black p-6 shadow-neo">
                        <div>
                            <h1 className="text-5xl font-black text-black mb-2 uppercase tracking-tighter">Hostel <span className="text-neo-accent-blue stroke-black" style={{ WebkitTextStroke: "2px black" }}>Dashboard</span></h1>
                            <p className="text-black font-bold text-lg border-l-4 border-neo-accent-pink pl-3">Manage your stay, submit complaints, and check the mess menu.</p>
                        </div>
                        <div className="px-4 py-2 bg-neo-accent-green border-4 border-black font-bold text-black flex items-center gap-2 shadow-neo-sm">
                            <span className="w-3 h-3 bg-black rounded-full animate-pulse"></span>
                            RESIDENT
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: "wifi_password", label: "Wifi Access", color: "neo-accent-green" },
                            { icon: "laundry", label: "Laundry", color: "neo-accent-yellow" },
                            { icon: "local_shipping", label: "Out Pass", color: "neo-accent-orange" },
                            { icon: "calendar_month", label: "Events", color: "neo-accent-blue" },
                        ].map((a, i) => (
                            <button key={i} className={`bg-white hover:bg-${a.color} border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 p-6 group`}>
                                <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">{a.icon}</span>
                                <span className="text-sm font-black text-black uppercase">{a.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mess Menu */}
                    <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] bg-white">
                        <div className="border-b-4 border-black bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold text-3xl">restaurant_menu</span>
                                Mess Menu <span className="bg-black text-white px-2 text-lg italic">Today</span>
                            </h2>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center font-bold text-slate-400">Loading...</div>
                        ) : messMenu.length === 0 ? (
                            <div className="p-8 text-center font-bold text-slate-400">No menu available for today</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                                {messMenu.map((meal, i) => (
                                    <div key={i} className={`p-6 hover:bg-${MEAL_COLORS[meal.meal]}/20 transition-colors`}>
                                        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                            <h3 className={`font-black text-lg uppercase bg-${MEAL_COLORS[meal.meal]} inline-block px-1 border-2 border-black shadow-neo-sm`}>{meal.meal}</h3>
                                            <span className="text-xs font-bold bg-black text-white px-1">{meal.time_slot}</span>
                                        </div>
                                        <ul className="text-sm space-y-3 font-bold">
                                            {meal.items.map((item, j) => (
                                                <li key={j} className="flex items-center gap-3"><span className="w-3 h-3 bg-black"></span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* New Complaint Form */}
                        <div className="lg:col-span-1 border-4 border-black shadow-[6px_6px_0px_0px_#000] bg-neo-accent-orange">
                            <div className="border-b-4 border-black bg-white p-4">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined font-bold">build</span>
                                    New Complaint
                                </h2>
                            </div>
                            <div className="p-6">
                                {submitSuccess && (
                                    <div className="bg-neo-accent-green border-3 border-black p-3 mb-4 font-black text-sm uppercase text-center shadow-neo-sm animate-bounce">
                                        ✅ Complaint Submitted!
                                    </div>
                                )}
                                <form onSubmit={handleSubmitComplaint} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Room No</label>
                                        <input
                                            value={complaintForm.room_no}
                                            onChange={e => setComplaintForm({ ...complaintForm, room_no: e.target.value })}
                                            className="w-full bg-white border-3 border-black p-3 text-sm font-bold outline-none shadow-neo-sm focus:shadow-neo transition-shadow"
                                            placeholder="B-304"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Issue Category</label>
                                        <select
                                            value={complaintForm.category}
                                            onChange={e => setComplaintForm({ ...complaintForm, category: e.target.value })}
                                            className="w-full bg-white border-3 border-black p-3 text-sm focus:outline-none font-bold shadow-neo-sm"
                                        >
                                            <option>Electrical</option>
                                            <option>Plumbing</option>
                                            <option>Furniture</option>
                                            <option>Cleaning</option>
                                            <option>Internet</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Description</label>
                                        <textarea
                                            value={complaintForm.description}
                                            onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })}
                                            className="w-full bg-white border-3 border-black p-3 text-sm font-bold outline-none shadow-neo-sm focus:shadow-neo transition-shadow h-20 resize-none"
                                            placeholder="Describe the issue..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-black text-white border-3 border-black shadow-[4px_4px_0px_0px_#000] font-extrabold uppercase py-3 text-sm hover:bg-gray-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "Submitting..." : "Submit Complaint"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Complaint History */}
                        <div className="lg:col-span-2 border-4 border-black shadow-[6px_6px_0px_0px_#000] bg-white">
                            <div className="border-b-4 border-black bg-white p-4 flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined font-bold">history</span>
                                    My Complaints
                                </h2>
                                <span className="bg-black text-white px-2 py-1 text-xs font-black">{complaints.length} TOTAL</span>
                            </div>
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="p-8 text-center font-bold text-slate-400">Loading...</div>
                                ) : complaints.length === 0 ? (
                                    <div className="p-12 text-center font-bold text-slate-400">No complaints yet. Submit one if you have an issue!</div>
                                ) : (
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead className="text-xs font-black uppercase bg-gray-100 border-b-4 border-black">
                                            <tr>
                                                <th className="px-4 py-4 border-r-2 border-black">Category</th>
                                                <th className="px-4 py-4 border-r-2 border-black">Room</th>
                                                <th className="px-4 py-4 border-r-2 border-black">Date</th>
                                                <th className="px-4 py-4 border-r-2 border-black">Status</th>
                                                <th className="px-4 py-4">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-black font-bold">
                                            {complaints.map((c) => (
                                                <tr key={c.id} className="hover:bg-neo-accent-yellow/20 transition-colors">
                                                    <td className="px-4 py-4 border-r-2 border-black font-black">{c.category}</td>
                                                    <td className="px-4 py-4 font-mono border-r-2 border-black">{c.room_no}</td>
                                                    <td className="px-4 py-4 border-r-2 border-black">{new Date(c.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 border-r-2 border-black">
                                                        <span className={`px-2 py-1 text-xs font-black border-2 border-black shadow-neo-sm ${STATUS_BADGE[c.status]}`}>
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs max-w-[200px] truncate">{c.description || "—"}</td>
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
