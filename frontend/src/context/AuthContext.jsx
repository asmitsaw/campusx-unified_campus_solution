import React, { createContext, useContext, useState, useEffect } from "react";
import { apiPost, apiGet } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("campusx_token"));
    const [loading, setLoading] = useState(true);

    // Rehydrate user from token on mount
    useEffect(() => {
        const rehydrate = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await apiGet("/auth/me");
                setUser(res.data);
            } catch {
                // Token invalid, clear
                localStorage.removeItem("campusx_token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        rehydrate();
    }, [token]);

    const login = async (email, password) => {
        const res = await apiPost("/auth/login", { email, password });
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem("campusx_token", newToken);
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem("campusx_token");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
