
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("campusx_token");

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Check content-type before parsing JSON
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        // Server returned HTML (likely a 404, 500, or unhandled crash)
        const text = await res.text();
        throw new Error(`Server error (${res.status}): Backend returned non-JSON response. Is the server running and are Supabase tables created?`);
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
}

export function apiPost(endpoint, body) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function apiGet(endpoint) {
    return apiRequest(endpoint, { method: "GET" });
}

export function apiPut(endpoint, body) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export function apiDelete(endpoint) {
    return apiRequest(endpoint, { method: "DELETE" });
}
