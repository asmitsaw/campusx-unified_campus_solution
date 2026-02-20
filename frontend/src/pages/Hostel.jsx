import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPost } from "../utils/api";

const STATUS_BADGE = {
    Pending: "bg-neo-accent-orange border-black text-white",
    "In Progress": "bg-neo-accent-yellow border-black text-black",
    Resolved: "bg-neo-accent-green border-black text-black",
};

export default function Hostel() {
    const { user } = useAuth();

    const [myRoom, setMyRoom] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [messMenu, setMessMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    // Complaint form
    const [complaintForm, setComplaintForm] = useState({ room_no: "", category: "Electrical", description: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Food rating
    const [foodRating, setFoodRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);

    // Wifi modal
    const [showWifi, setShowWifi] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const today = days[new Date().getDay()];
            const [roomRes, compRes, messRes] = await Promise.all([
                apiGet("/hostel/my-room"),
                apiGet("/hostel/complaints"),
                apiGet(`/hostel/mess?day=${today}`),
            ]);
            setMyRoom(roomRes.data);
            setComplaints(compRes.data || []);
            setMessMenu(messRes.data || []);
            // Pre-fill room in complaint form
            if (roomRes.data?.room_no) {
                setComplaintForm(prev => ({ ...prev, room_no: roomRes.data.room_no }));
            }
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
            setComplaintForm({ ...complaintForm, category: "Electrical", description: "" });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
            fetchAll();
        } catch (e) {
            alert(e.message);
        }
        setSubmitting(false);
    };

    const handleRateFood = (rating) => {
        setFoodRating(rating);
        setRatingSubmitted(true);
        setTimeout(() => setRatingSubmitted(false), 2000);
    };

    const pendingCount = complaints.filter(c => c.status === "Pending").length;
    const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

    // Get current meal based on time
    const getCurrentMeal = () => {
        const hour = new Date().getHours();
        if (hour >= 7 && hour < 10) return "Breakfast";
        if (hour >= 12 && hour < 15) return "Lunch";
        if (hour >= 17 && hour < 18) return "Snacks";
        if (hour >= 20 && hour < 22) return "Dinner";
        return null;
    };
    const currentMeal = getCurrentMeal();

    return (
        <div className="bg-[#f0f0f0] text-black min-h-screen pb-10 p-6 -m-6 font-display" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8">
                    {/* Header Card */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white border-4 border-black p-6 shadow-neo">
                        <div>
                            <h1 className="text-5xl font-black text-black mb-2 uppercase tracking-tighter">
                                Hostel <span className="text-neo-accent-blue" style={{ WebkitTextStroke: "2px black" }}>Dashboard</span>
                            </h1>
                            <p className="text-black font-bold text-lg border-l-4 border-neo-accent-pink pl-3">
                                Your stay, complaints, and mess menu — all in one place.
                            </p>
                        </div>
                        <div className="px-4 py-2 bg-neo-accent-green border-4 border-black font-bold text-black flex items-center gap-2 shadow-neo-sm">
                            <span className="w-3 h-3 bg-black rounded-full animate-pulse"></span>
                            {myRoom ? "CHECKED IN" : "NOT ALLOCATED"}
                        </div>
                    </div>

                    {/* Top Row: Room Info, Fee, Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Hostel Info */}
                        <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all bg-neo-accent-yellow">
                            <div className="border-b-4 border-black bg-white p-4 flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined font-bold">info</span>
                                    My Room
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {loading ? (
                                    <div className="text-center font-bold text-black/60 py-6">Loading...</div>
                                ) : myRoom ? (
                                    <>
                                        <div className="bg-white border-4 border-black p-4 shadow-neo-sm transform -rotate-1">
                                            <span className="text-xs font-black uppercase tracking-wider block mb-1">Allocated Room</span>
                                            <span className="font-mono text-3xl font-black text-black">{myRoom.room_no}</span>
                                        </div>
                                        <div className="bg-white border-4 border-black p-4 shadow-neo-sm transform rotate-1">
                                            <span className="text-xs font-black uppercase tracking-wider block mb-1">Hostel Block</span>
                                            <span className="font-black text-xl text-black">{myRoom.block}</span>
                                        </div>
                                        <div className="bg-white border-4 border-black p-4 shadow-neo-sm">
                                            <span className="text-xs font-black uppercase tracking-wider block mb-1">Capacity</span>
                                            <span className="font-black text-lg text-black">{myRoom.capacity} {myRoom.capacity > 1 ? "persons" : "person"}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white border-4 border-black p-6 shadow-neo-sm text-center">
                                        <span className="material-symbols-outlined text-5xl text-black/30 mb-2 block">hotel</span>
                                        <p className="font-black text-sm uppercase text-black/50">No room allocated yet</p>
                                        <p className="text-xs font-bold text-black/40 mt-1">Contact the hostel warden for allocation</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all bg-white">
                            <div className="border-b-4 border-black bg-white p-4">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined font-bold">monitoring</span>
                                    My Stats
                                </h2>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="bg-neo-accent-blue border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-black/70">Total Complaints</p>
                                    <p className="text-3xl font-black">{complaints.length}</p>
                                </div>
                                <div className="bg-neo-accent-orange border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-white/90">Pending</p>
                                    <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>{pendingCount}</p>
                                </div>
                                <div className="bg-neo-accent-green border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-black/70">Resolved</p>
                                    <p className="text-3xl font-black">{resolvedCount}</p>
                                </div>
                                <div className="bg-neo-accent-yellow border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-black/70">Room</p>
                                    <p className="text-xl font-black font-mono">{myRoom?.room_no || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all bg-neo-accent-pink">
                            <div className="border-b-4 border-black bg-white p-4">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined font-bold">bolt</span>
                                    Quick Actions
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowWifi(!showWifi)}
                                        className="aspect-square bg-white hover:bg-neo-accent-green border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group"
                                    >
                                        <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">wifi_password</span>
                                        <span className="text-sm font-black text-black uppercase">Wifi</span>
                                    </button>
                                    <button
                                        onClick={() => document.getElementById("complaint-form")?.scrollIntoView({ behavior: "smooth" })}
                                        className="aspect-square bg-white hover:bg-neo-accent-orange border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group"
                                    >
                                        <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">build</span>
                                        <span className="text-sm font-black text-black uppercase">Complaint</span>
                                    </button>
                                    <button
                                        onClick={() => document.getElementById("mess-menu")?.scrollIntoView({ behavior: "smooth" })}
                                        className="aspect-square bg-white hover:bg-neo-accent-yellow border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group"
                                    >
                                        <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">restaurant_menu</span>
                                        <span className="text-sm font-black text-black uppercase">Mess</span>
                                    </button>
                                    <button
                                        onClick={() => document.getElementById("complaint-history")?.scrollIntoView({ behavior: "smooth" })}
                                        className="aspect-square bg-white hover:bg-neo-accent-blue border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col items-center justify-center gap-2 text-center group"
                                    >
                                        <span className="material-symbols-outlined text-4xl font-bold text-black group-hover:scale-110 transition-transform">history</span>
                                        <span className="text-sm font-black text-black uppercase">History</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wifi Info Panel */}
                    {showWifi && (
                        <div className="bg-white border-4 border-black shadow-neo p-6 relative">
                            <button onClick={() => setShowWifi(false)} className="absolute top-3 right-3 border-2 border-black bg-white w-8 h-8 flex items-center justify-center font-black hover:bg-neo-accent-red hover:text-white transition-colors">✕</button>
                            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold">wifi</span>
                                Hostel Wifi Credentials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-neo-accent-blue border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-black/70 mb-1">Network Name</p>
                                    <p className="text-lg font-mono font-black">CampusX-Hostel</p>
                                </div>
                                <div className="bg-neo-accent-green border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-black/70 mb-1">Password</p>
                                    <p className="text-lg font-mono font-black">hostel@2026</p>
                                </div>
                                <div className="bg-neo-accent-yellow border-3 border-black p-4 shadow-neo-sm">
                                    <p className="text-xs font-black uppercase text-black/70 mb-1">Speed</p>
                                    <p className="text-lg font-mono font-black">100 Mbps</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mess Menu */}
                    <div id="mess-menu" className="border-4 border-black shadow-[6px_6px_0px_0px_#000] bg-white">
                        <div className="border-b-4 border-black bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined font-bold text-3xl">restaurant_menu</span>
                                Mess Menu <span className="bg-black text-white px-2 text-lg italic">Today</span>
                            </h2>
                            <div className="flex gap-2 items-center bg-neo-accent-yellow border-2 border-black p-2 shadow-neo-sm">
                                <span className="text-xs font-black uppercase mr-2">Rate today's food:</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRateFood(star)}
                                            className="hover:scale-125 transition-transform"
                                        >
                                            <span
                                                className="material-symbols-outlined font-bold text-black"
                                                style={{ fontVariationSettings: star <= foodRating ? "'FILL' 1" : "'FILL' 0" }}
                                            >
                                                star
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {ratingSubmitted && (
                                    <span className="text-xs font-black text-neo-accent-green ml-2 animate-bounce">✓ Saved!</span>
                                )}
                            </div>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center font-bold text-slate-400">Loading...</div>
                        ) : messMenu.length === 0 ? (
                            <div className="p-8 text-center font-bold text-slate-400">No menu available for today</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                                {messMenu.map((meal, i) => {
                                    const isCurrentMeal = meal.meal === currentMeal;
                                    const bgColor = meal.meal === "Breakfast" ? "bg-neo-accent-green"
                                        : meal.meal === "Lunch" ? "bg-neo-accent-yellow"
                                            : meal.meal === "Snacks" ? "bg-neo-accent-orange"
                                                : "bg-neo-accent-blue";
                                    return (
                                        <div key={i} className={`p-6 relative ${isCurrentMeal ? "bg-neo-accent-blue/10" : "bg-white"} hover:bg-gray-50 transition-colors`}>
                                            {isCurrentMeal && (
                                                <span className="absolute top-2 right-2 text-xs font-black bg-black text-white px-2 py-1 animate-pulse uppercase">Now Serving</span>
                                            )}
                                            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                                                <h3 className={`font-black text-lg uppercase ${bgColor} inline-block px-1 border-2 border-black shadow-neo-sm`}>{meal.meal}</h3>
                                                <span className="text-xs font-bold bg-black text-white px-1">{meal.time_slot}</span>
                                            </div>
                                            <ul className="text-sm space-y-3 font-bold">
                                                {meal.items.map((item, j) => (
                                                    <li key={j} className="flex items-center gap-3">
                                                        <span className="w-3 h-3 bg-black shrink-0"></span> {item}
                                                    </li>
                                                ))}
                                                {meal.items.length === 0 && (
                                                    <li className="text-slate-400 italic">Not set yet</li>
                                                )}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Complaint Form + History */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* New Complaint Form */}
                        <div id="complaint-form" className="lg:col-span-1 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all bg-neo-accent-orange">
                            <div className="border-b-4 border-black bg-white p-4">
                                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined font-bold">build</span>
                                    New Complaint
                                </h2>
                            </div>
                            <div className="p-6">
                                {submitSuccess && (
                                    <div className="bg-neo-accent-green border-3 border-black p-3 mb-4 font-black text-sm uppercase text-center shadow-neo-sm animate-bounce">
                                        ✅ Complaint Submitted Successfully!
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
                                            <option>Pest Control</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Description</label>
                                        <textarea
                                            value={complaintForm.description}
                                            onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })}
                                            className="w-full bg-white border-3 border-black p-3 text-sm font-bold outline-none shadow-neo-sm focus:shadow-neo transition-shadow h-24 resize-none"
                                            placeholder="Describe the issue in detail..."
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
                        <div id="complaint-history" className="lg:col-span-2 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all bg-white">
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
                                    <div className="p-12 text-center">
                                        <span className="material-symbols-outlined text-5xl text-neo-accent-green block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        <p className="font-black text-slate-400 uppercase">No complaints yet</p>
                                        <p className="text-sm text-slate-400 mt-1">Submit one if you have an issue!</p>
                                    </div>
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
                                                    <td className="px-4 py-4 border-r-2 border-black whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 border-r-2 border-black">
                                                        <span className={`px-2 py-1 text-xs font-black border-2 shadow-neo-sm ${STATUS_BADGE[c.status]}`}>
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs max-w-[200px]">
                                                        <p className="truncate">{c.description || "—"}</p>
                                                    </td>
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
