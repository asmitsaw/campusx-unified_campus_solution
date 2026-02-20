import React, { useState } from "react";
import { Calendar, Plus, MapPin, Clock, Users, Edit, Trash2 } from "lucide-react";

const EVENTS = [
    {
        id: 1,
        title: "TechNova Hackathon",
        date: "Oct 28, 2026",
        time: "09:00 AM",
        location: "Main Auditorium",
        category: "Technical",
        registrations: 145,
        maxCapacity: 200,
        status: "Active",
    },
    {
        id: 2,
        title: "Annual Cultural Fest",
        date: "Nov 02, 2026",
        time: "06:00 PM",
        location: "University Grounds",
        category: "Cultural",
        registrations: 312,
        maxCapacity: 500,
        status: "Active",
    },
    {
        id: 3,
        title: "Google Recruitment Drive",
        date: "Nov 10, 2026",
        time: "09:00 AM",
        location: "Placement Cell",
        category: "Placement",
        registrations: 89,
        maxCapacity: 100,
        status: "Active",
    },
    {
        id: 4,
        title: "UI/UX Design Sprint",
        date: "Nov 12, 2026",
        time: "02:00 PM",
        location: "Design Studio",
        category: "Workshop",
        registrations: 45,
        maxCapacity: 60,
        status: "Draft",
    },
];

const CATEGORY_COLORS = {
    Technical: "bg-neo-blue",
    Cultural: "bg-neo-pink",
    Placement: "bg-neo-yellow",
    Workshop: "bg-neo-green",
};

export default function ManageEvents() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="font-display bg-neo-bg text-neo-black min-h-screen p-6 -m-6">
            <div className="flex flex-col gap-8 mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1
                        className="text-4xl font-black uppercase italic tracking-tighter"
                        style={{ textShadow: "2px 2px 0px #A259FF" }}
                    >
                        Manage Events
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-neo-purple text-white border-3 border-black px-6 py-3 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> New Event
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-neo-purple border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-white/80 mb-1">Total Events</p>
                        <p className="text-3xl font-black text-white" style={{ textShadow: "2px 2px 0px #000" }}>{EVENTS.length}</p>
                    </div>
                    <div className="bg-neo-green border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Active</p>
                        <p className="text-3xl font-black">{EVENTS.filter((e) => e.status === "Active").length}</p>
                    </div>
                    <div className="bg-neo-blue border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Total Registrations</p>
                        <p className="text-3xl font-black">{EVENTS.reduce((a, e) => a + e.registrations, 0)}</p>
                    </div>
                    <div className="bg-neo-yellow border-3 border-black p-5 shadow-neo hover:-translate-y-1 transition-transform">
                        <p className="text-xs font-black uppercase text-black/70 mb-1">Drafts</p>
                        <p className="text-3xl font-black">{EVENTS.filter((e) => e.status === "Draft").length}</p>
                    </div>
                </div>

                {/* Create Form (toggle) */}
                {showForm && (
                    <div className="bg-white border-3 border-black shadow-neo p-6">
                        <h3 className="text-xl font-black uppercase mb-6 border-b-3 border-black pb-3">Create New Event</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Event Title</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm focus:shadow-neo" placeholder="Enter event title" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Category</label>
                                <select className="w-full border-2 border-black p-3 font-bold shadow-neo-sm bg-white">
                                    <option>Technical</option>
                                    <option>Cultural</option>
                                    <option>Placement</option>
                                    <option>Workshop</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Date</label>
                                <input type="date" className="w-full border-2 border-black p-3 font-bold shadow-neo-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Location</label>
                                <input className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="Enter location" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Max Capacity</label>
                                <input type="number" className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm" placeholder="200" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2">Description</label>
                                <textarea className="w-full border-2 border-black p-3 font-bold outline-none shadow-neo-sm resize-none" rows={3} placeholder="Event description..." />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button className="bg-black text-white border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-purple transition-colors active:shadow-none active:translate-y-[2px]">
                                Create Event
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-white text-black border-3 border-black px-8 py-3 font-black uppercase shadow-neo-sm hover:bg-neo-bg transition-colors active:shadow-none active:translate-y-[2px]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Events List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {EVENTS.map((event) => (
                        <div key={event.id} className="bg-white border-3 border-black shadow-neo hover:-translate-y-1 transition-transform">
                            <div className={`flex items-center justify-between px-6 py-3 border-b-3 border-black ${CATEGORY_COLORS[event.category]}`}>
                                <span className="text-sm font-black uppercase text-black">{event.category}</span>
                                <span className={`border-2 border-black px-2 py-0.5 text-xs font-black uppercase ${event.status === "Active" ? "bg-neo-green" : "bg-white"}`}>
                                    {event.status}
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black uppercase mb-4">{event.title}</h3>
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <Calendar className="w-4 h-4" /> {event.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <Clock className="w-4 h-4" /> {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <MapPin className="w-4 h-4" /> {event.location}
                                    </div>
                                </div>
                                {/* Registration Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs font-black uppercase mb-1">
                                        <span>Registrations</span>
                                        <span>{event.registrations}/{event.maxCapacity}</span>
                                    </div>
                                    <div className="h-4 bg-neo-bg border-2 border-black">
                                        <div
                                            className="h-full bg-neo-purple"
                                            style={{ width: `${(event.registrations / event.maxCapacity) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-1 border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-blue transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                        <Edit className="w-4 h-4" /> Edit
                                    </button>
                                    <button className="flex items-center justify-center gap-1 border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-neo-red hover:text-white transition-colors shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
