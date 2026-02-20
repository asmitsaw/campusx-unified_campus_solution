import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Briefcase,
    Calendar,
    Settings,
    LogOut,
    Verified,
    School,
    Home,
    ShieldCheck,
    ClipboardList,
} from "lucide-react";

const ROLE_LABELS = {
    faculty: "Faculty",
    event_manager: "Event Manager",
    librarian: "Librarian",
    hostel_warden: "Hostel Warden",
    tpo: "T&P Officer",
    admin: "Administrator",
};

const ROLE_COLORS = {
    faculty: "bg-neo-blue",
    event_manager: "bg-neo-purple",
    librarian: "bg-neo-green",
    hostel_warden: "bg-neo-yellow",
    tpo: "bg-neo-cyan",
    admin: "bg-neo-red",
};

// All possible nav items — visibility controlled by role
const ALL_NAV_ITEMS = [
    {
        name: "Dashboard",
        href: "/faculty/dashboard",
        icon: LayoutDashboard,
        roles: ["faculty", "event_manager", "librarian", "hostel_warden", "tpo", "admin"],
    },
    {
        name: "Manage Attendance",
        href: "/faculty/attendance",
        icon: ClipboardList,
        roles: ["faculty", "admin"],
    },
    {
        name: "Manage Students",
        href: "/faculty/students",
        icon: Users,
        roles: ["faculty", "admin"],
    },
    {
        name: "Classes",
        href: "/faculty/classes",
        icon: BookOpen,
        roles: ["faculty", "admin"],
    },
    {
        name: "Manage Events",
        href: "/faculty/events",
        icon: Verified,
        roles: ["event_manager", "admin"],
    },
    {
        name: "Manage Library",
        href: "/faculty/library",
        icon: BookOpen,
        roles: ["librarian", "admin"],
    },
    {
        name: "Manage Hostel",
        href: "/faculty/hostel",
        icon: Home,
        roles: ["hostel_warden", "admin"],
    },
    {
        name: "Manage Placements",
        href: "/faculty/placements",
        icon: Briefcase,
        roles: ["tpo", "admin"],
    },
    {
        name: "Admin Panel",
        href: "/faculty/admin",
        icon: ShieldCheck,
        roles: ["admin"],
    },
    {
        name: "Profile",
        href: "/faculty/profile",
        icon: Users,
        roles: ["faculty", "event_manager", "librarian", "hostel_warden", "tpo", "admin"],
    },
];

export function FacultySidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const userRole = user?.role || "faculty";
    const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(userRole));

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex h-full w-64 flex-col bg-white border-r-3 border-black text-slate-900">
            {/* Brand */}
            <div className="flex h-16 items-center px-6 border-b-3 border-black bg-accent-yellow">
                <School className="h-6 w-6 text-black mr-2" strokeWidth={2.5} />
                <span className="text-xl font-black uppercase tracking-tighter italic">
                    CampusX
                </span>
            </div>

            {/* Role Badge */}
            <div className="px-4 pt-4 pb-2">
                <div
                    className={`${ROLE_COLORS[userRole] || "bg-neo-blue"} border-2 border-black px-3 py-2 shadow-neo-sm`}
                >
                    <p className="text-[10px] font-black uppercase tracking-wider text-black/60">
                        Logged in as
                    </p>
                    <p className="text-sm font-black uppercase text-black">
                        {ROLE_LABELS[userRole] || userRole}
                    </p>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `group flex items-center px-3 py-3 text-sm font-bold border-2 border-black rounded transition-all duration-150 ${isActive
                                ? "bg-primary text-white shadow-neo-sm translate-x-[2px] translate-y-[2px]"
                                : "bg-white text-slate-700 hover:bg-slate-50 hover:shadow-neo-sm hover:-translate-y-[2px] hover:-translate-x-[1px]"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-900"}`}
                                    strokeWidth={2.5}
                                />
                                {item.name}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t-3 border-black p-4 bg-slate-50">
                <button className="group flex w-full items-center px-3 py-2 text-sm font-bold border-2 border-transparent hover:border-black hover:bg-white hover:shadow-neo-sm rounded transition-all">
                    <Settings className="mr-3 h-5 w-5" strokeWidth={2.5} />
                    Settings
                </button>
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center px-3 py-2 text-sm font-bold text-red-600 border-2 border-transparent hover:border-black hover:bg-red-50 hover:shadow-neo-sm rounded mt-1 transition-all"
                >
                    <LogOut className="mr-3 h-5 w-5" strokeWidth={2.5} />
                    Logout
                </button>
            </div>
        </div>
    );
}
