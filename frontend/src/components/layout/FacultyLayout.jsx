import React from "react";
import { Outlet } from "react-router-dom";
import { FacultySidebar } from "./FacultySidebar";
import { Header } from "./Header";

export default function FacultyLayout() {
    return (
        <div className="flex h-screen bg-background-light overflow-hidden font-display text-slate-900">
            <FacultySidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
