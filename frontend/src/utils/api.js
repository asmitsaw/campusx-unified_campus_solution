const API_BASE = "http://localhost:5000/api";

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
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
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

export function apiDelete(endpoint) {
    return apiRequest(endpoint, { method: "DELETE" });
}
