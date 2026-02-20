import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f0f0f0] font-display">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-black border-t-transparent animate-spin" />
                    <p className="text-lg font-black uppercase">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to the correct portal
        if (user.role === "student") {
            return <Navigate to="/dashboard/overview" replace />;
        }
        return <Navigate to="/faculty/dashboard" replace />;
    }

    return children;
}
