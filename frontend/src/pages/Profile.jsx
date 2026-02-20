import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
    student: "Student",
    faculty: "Faculty",
    event_manager: "Event Manager",
    librarian: "Librarian",
    hostel_warden: "Hostel Warden",
    tpo: "T&P Officer",
    admin: "Administrator",
};

const ROLE_COLORS = {
    student: "bg-neo-blue",
    faculty: "bg-neo-green",
    event_manager: "bg-neo-purple text-white",
    librarian: "bg-neo-cyan",
    hostel_warden: "bg-neo-yellow",
    tpo: "bg-neo-pink",
    admin: "bg-neo-red text-white",
};

const ROLE_ID_LABEL = {
    student: "Student ID",
    faculty: "Faculty ID",
    event_manager: "Staff ID",
    librarian: "Staff ID",
    hostel_warden: "Staff ID",
    tpo: "Staff ID",
    admin: "Admin ID",
};

const ROLE_DEPT_OPTIONS = {
    student: ["Computer Science", "Mechanical Engineering", "Electronics", "Information Technology", "Business Administration"],
    faculty: ["Computer Science", "Mechanical Engineering", "Electronics", "Information Technology", "Physics", "Mathematics"],
    event_manager: ["Student Affairs", "Cultural Committee", "Sports Committee"],
    librarian: ["Central Library", "Digital Library", "Archives"],
    hostel_warden: ["Boys Hostel - Cauvery", "Boys Hostel - Godavari", "Girls Hostel - Narmada"],
    tpo: ["Training & Placement Cell"],
    admin: ["Administration", "IT Infrastructure", "Academic Affairs"],
};

export default function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Profile');

    const role = user?.role || 'student';
    const fullName = user?.name || 'Unknown User';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const email = user?.email || '';
    const userId = user?.id?.toString()?.slice(0, 8)?.toUpperCase() || 'N/A';
    const roleLabel = ROLE_LABELS[role] || role;
    const roleColor = ROLE_COLORS[role] || 'bg-neo-blue';
    const idLabel = ROLE_ID_LABEL[role] || 'ID';
    const deptOptions = ROLE_DEPT_OPTIONS[role] || ["General"];

    // Role-specific alert content
    const getAlerts = () => {
        if (role === 'student') {
            return [
                { category: "Academic", color: "neo-strong-blue", time: "2 HRS AGO", title: "Mid-term Schedule Released", desc: "The schedule for the upcoming mid-term examinations for Computer Science Dept has been published.", hasAction: false },
                { category: "Placement", color: "neo-strong-purple", time: "5 HRS AGO", title: "Google Campus Drive", desc: "Registration for Google's campus recruitment drive is now open for final year students.", hasAction: true, actionLabel: "REGISTER NOW" },
                { category: "Library", color: "neo-yellow-accent", time: "2 DAYS AGO", title: "Book Due Reminder", desc: "\"Introduction to Algorithms\" is due tomorrow. Please renew or return to avoid fines.", hasAction: false, isOld: true },
            ];
        }
        if (role === 'faculty') {
            return [
                { category: "Academic", color: "neo-strong-blue", time: "1 HR AGO", title: "Grade Submission Due", desc: "Mid-term grades for CS-301 and CS-405 are due by end of this week.", hasAction: false },
                { category: "System", color: "gray-800", time: "3 HRS AGO", title: "Faculty Meeting Scheduled", desc: "Department HOD has called a meeting for curriculum review on Friday at 3 PM.", hasAction: false },
            ];
        }
        if (role === 'admin') {
            return [
                { category: "System", color: "gray-800", time: "30 MIN AGO", title: "Server Health Warning", desc: "CPU usage on primary database server exceeded 85% threshold.", hasAction: true, actionLabel: "VIEW LOGS" },
                { category: "Security", color: "neo-strong-purple", time: "2 HRS AGO", title: "Failed Login Attempts", desc: "12 failed login attempts detected from unrecognized IP addresses.", hasAction: true, actionLabel: "REVIEW" },
            ];
        }
        if (role === 'event_manager') {
            return [
                { category: "Events", color: "neo-strong-purple", time: "1 HR AGO", title: "Cultural Fest Approvals", desc: "3 new event proposals are pending approval for the upcoming cultural fest.", hasAction: true, actionLabel: "REVIEW" },
            ];
        }
        if (role === 'librarian') {
            return [
                { category: "Library", color: "neo-yellow-accent", time: "TODAY", title: "Overdue Books Alert", desc: "14 books are overdue. 3 students have exceeded the grace period.", hasAction: true, actionLabel: "VIEW LIST" },
            ];
        }
        if (role === 'hostel_warden') {
            return [
                { category: "Hostel", color: "neo-strong-blue", time: "2 HRS AGO", title: "Maintenance Requests", desc: "5 new maintenance requests pending review for Block B.", hasAction: true, actionLabel: "REVIEW" },
            ];
        }
        if (role === 'tpo') {
            return [
                { category: "Placement", color: "neo-strong-purple", time: "1 HR AGO", title: "Drive Update", desc: "Microsoft has confirmed campus visit for next month. 3 roles open.", hasAction: false },
            ];
        }
        return [];
    };

    const alerts = getAlerts();

    return (
        <div className="bg-neo-lavender font-display text-black min-h-screen flex flex-col overflow-hidden selection:bg-neo-yellow-accent selection:text-black">
            <main className="flex-1 flex overflow-hidden relative">
                <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row h-full z-10 p-4 lg:p-6 gap-6">

                    {/* Alerts Section (Left Sidebar) */}
                    <section className="flex flex-col w-full lg:w-[450px] bg-white border-3 border-black shadow-neo shrink-0 h-full relative">
                        <div className="absolute top-0 right-0 w-full h-2 bg-pattern-stripes opacity-10"></div>
                        <div className="p-5 border-b-3 border-black bg-white flex justify-between items-end sticky top-0 z-10">
                            <div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Alerts</h2>
                                <p className="font-bold text-sm mt-1 bg-black text-white inline-block px-2 py-0.5">{alerts.length} NOTIFICATIONS</p>
                            </div>
                            <button className="text-black text-xs font-bold border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all shadow-neo-sm active:shadow-none active:translate-y-[2px]">
                                MARK ALL READ
                            </button>
                        </div>
                        <div className="px-5 py-4 border-b-3 border-black flex gap-3 overflow-x-auto no-scrollbar bg-neo-lavender">
                            <button className="px-4 py-1.5 border-2 border-black bg-black text-white text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5 transition-transform">All</button>
                            {role === 'student' && (
                                <>
                                    <button className="px-4 py-1.5 border-2 border-black bg-white hover:bg-neo-strong-blue hover:text-white transition-colors text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5">Academic</button>
                                    <button className="px-4 py-1.5 border-2 border-black bg-white hover:bg-neo-strong-purple hover:text-white transition-colors text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5">Placement</button>
                                </>
                            )}
                            <button className="px-4 py-1.5 border-2 border-black bg-white hover:bg-gray-200 transition-colors text-xs font-bold uppercase shadow-neo-sm hover:-translate-y-0.5">System</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f8f8]">
                            {alerts.map((alert, i) => (
                                <div key={i} className={`group relative bg-white border-3 border-black p-0 shadow-neo hover:shadow-neo-hover transition-all cursor-pointer ${alert.isOld ? 'opacity-90 hover:opacity-100 !bg-gray-100 !shadow-sm' : ''}`}>
                                    {!alert.isOld && <div className={`h-full w-3 absolute left-0 top-0 bottom-0 bg-${alert.color} border-r-3 border-black`}></div>}
                                    <div className={alert.isOld ? "p-4" : "pl-6 p-4"}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`inline-block px-2 py-0.5 text-[10px] font-black bg-${alert.color} ${alert.color.includes('gray') || alert.color.includes('purple') ? 'text-white' : alert.color.includes('yellow') ? 'text-black' : 'text-white'} uppercase border border-black`}>{alert.category}</span>
                                            <span className="text-xs font-bold">{alert.time}</span>
                                        </div>
                                        <h3 className={`font-black text-lg mb-1 leading-tight ${alert.isOld ? 'text-gray-700' : 'text-black group-hover:underline decoration-4'}`}>{alert.title}</h3>
                                        <p className={`font-medium text-sm leading-snug line-clamp-2 ${alert.isOld ? 'text-gray-600' : 'text-gray-800'}`}>{alert.desc}</p>
                                        {alert.hasAction && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button className={`text-xs bg-${alert.color} text-white font-bold border-2 border-black px-4 py-1 hover:opacity-80 transition-colors shadow-neo-sm active:translate-y-[2px] active:shadow-none`}>{alert.actionLabel}</button>
                                            </div>
                                        )}
                                        {!alert.hasAction && !alert.isOld && (
                                            <div className="mt-3 flex items-center justify-end">
                                                <span className={`w-3 h-3 bg-${alert.color} border-2 border-black`}></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Account Settings Section (Right/Main) */}
                    <section className="flex flex-col flex-1 bg-white border-3 border-black shadow-neo-lg h-full overflow-hidden">
                        <div className="p-6 md:p-8 pb-0 bg-neo-yellow-accent border-b-3 border-black">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="font-bold text-xs uppercase bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">{role === 'student' ? 'Dashboard' : 'Faculty'}</span>
                                <span className="font-black">/</span>
                                <span className="font-bold text-xs uppercase bg-black text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#fff]">Settings</span>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic">Account Settings</h1>
                                <span className={`${roleColor} border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-neo-sm`}>{roleLabel}</span>
                            </div>
                            <p className="font-medium text-black max-w-2xl border-l-4 border-black pl-4 mb-6">Manage your personal details, security preferences, and notification settings.</p>
                            <div className="flex items-end gap-1 mt-6 overflow-x-auto">
                                {['Profile', 'Security', 'Preferences'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 border-t-3 border-x-3 border-black font-black text-sm uppercase transition-all ${activeTab === tab
                                                ? 'bg-white translate-y-[3px] z-10'
                                                : 'bg-black text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
                            <form className="max-w-5xl space-y-12">
                                {/* Personal Info */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                                    <div className="md:col-span-4 bg-neo-lavender p-4 border-3 border-black shadow-neo h-fit">
                                        <h3 className="text-black text-xl font-black uppercase mb-2">Personal Info</h3>
                                        <p className="text-black font-medium text-sm">Update your photo and personal details here.</p>
                                    </div>
                                    <div className="md:col-span-8 space-y-6">
                                        <div className="flex items-center gap-6 p-4 border-3 border-dashed border-gray-300">
                                            <div className={`w-24 h-24 ${roleColor} border-3 border-black shadow-neo-sm flex items-center justify-center`}>
                                                <span className="text-3xl font-black">{fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3">
                                                    <button className="px-4 py-2 bg-neo-teal text-black font-bold border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all uppercase text-xs" type="button">Change Photo</button>
                                                    <button className="px-4 py-2 bg-white text-black font-bold border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all uppercase text-xs hover:bg-red-100" type="button">Remove</button>
                                                </div>
                                                <p className="text-gray-500 text-xs font-bold uppercase">JPG, GIF or PNG. Max 800K</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-black uppercase tracking-wide">First Name</label>
                                                <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="text" defaultValue={firstName} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-black uppercase tracking-wide">Last Name</label>
                                                <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="text" defaultValue={lastName} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-black uppercase tracking-wide">Email Address</label>
                                            <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all placeholder:text-gray-400 shadow-neo-sm focus:shadow-neo-hover" type="email" defaultValue={email} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-black uppercase tracking-wide">{idLabel}</label>
                                                <input className="w-full bg-gray-100 border-3 border-black px-4 py-3 text-gray-500 font-bold cursor-not-allowed border-dashed" disabled type="text" value={userId} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-black uppercase tracking-wide">Department</label>
                                                <div className="relative">
                                                    <select className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm focus:shadow-neo-hover appearance-none">
                                                        {deptOptions.map(d => <option key={d}>{d}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-1 bg-black"></div>

                                {/* Security */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                                    <div className="md:col-span-4 bg-neo-lavender p-4 border-3 border-black shadow-neo h-fit">
                                        <h3 className="text-black text-xl font-black uppercase mb-2">Security</h3>
                                        <p className="text-black font-medium text-sm">Ensure your account is using a long, random password to stay secure.</p>
                                    </div>
                                    <div className="md:col-span-8 space-y-6">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-black uppercase tracking-wide">Current Password</label>
                                            <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm focus:shadow-neo-hover" type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-black uppercase tracking-wide">New Password</label>
                                            <input className="w-full bg-white border-3 border-black px-4 py-3 text-black font-bold focus:ring-0 focus:bg-neo-lavender outline-none transition-all shadow-neo-sm focus:shadow-neo-hover" placeholder="Min 8 characters" type="password" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-1 bg-black"></div>

                                {/* Preferences */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                                    <div className="md:col-span-4 bg-neo-lavender p-4 border-3 border-black shadow-neo h-fit">
                                        <h3 className="text-black text-xl font-black uppercase mb-2">Preferences</h3>
                                        <p className="text-black font-medium text-sm">Choose how you want to be notified about campus updates.</p>
                                    </div>
                                    <div className="md:col-span-8 space-y-4">
                                        <label className="flex items-center justify-between p-4 border-3 border-black bg-white shadow-neo-sm hover:shadow-neo-hover hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer group">
                                            <div className="flex flex-col">
                                                <span className="text-black font-black uppercase">Email Alerts</span>
                                                <span className="text-gray-600 text-xs font-bold mt-1">
                                                    {role === 'student' ? 'Receive daily digests of academic updates' : 'Receive notifications about important updates'}
                                                </span>
                                            </div>
                                            <div className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in">
                                                <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 bg-black border-2 border-black appearance-none cursor-pointer transition-all duration-300 ease-in-out top-1 left-1 checked:left-[26px]" name="toggle-email" type="checkbox" />
                                                <label className="toggle-label block overflow-hidden h-8 bg-gray-200 border-3 border-black cursor-pointer transition-colors duration-300"></label>
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between p-4 border-3 border-black bg-white shadow-neo-sm hover:shadow-neo-hover hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer group">
                                            <div className="flex flex-col">
                                                <span className="text-black font-black uppercase">SMS Alerts</span>
                                                <span className="text-gray-600 text-xs font-bold mt-1">
                                                    {role === 'student' ? 'Urgent notifications for exam rescheduling' : 'Critical system and emergency alerts'}
                                                </span>
                                            </div>
                                            <div className="relative inline-block w-14 h-8 align-middle select-none transition duration-200 ease-in">
                                                <input className="toggle-checkbox absolute block w-6 h-6 bg-black border-2 border-black appearance-none cursor-pointer transition-all duration-300 ease-in-out top-1 left-1 checked:left-[26px]" name="toggle-sms" type="checkbox" />
                                                <label className="toggle-label block overflow-hidden h-8 bg-gray-200 border-3 border-black cursor-pointer transition-colors duration-300"></label>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-6">
                                    <button type="submit" className="bg-neo-primary text-white border-3 border-black px-8 py-3 font-black text-lg uppercase shadow-neo hover:shadow-neo-hover hover:-translate-y-1 transition-all active:translate-y-[2px] active:shadow-none">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </main>

            <style>{`
        .toggle-checkbox:checked {
            right: 0;
            border-color: #000;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #4ECDC4;
        }
      `}</style>
        </div>
    );
}
