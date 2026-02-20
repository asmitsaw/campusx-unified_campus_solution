import supabase from "../config/supabase.js";

// ==================== ROOMS ====================

export const getRooms = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("hostel_rooms")
            .select("*")
            .order("block")
            .order("room_no");
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createRoom = async (req, res) => {
    try {
        const { block, room_no, capacity } = req.body;
        if (!block || !room_no) return res.status(400).json({ success: false, message: "block and room_no required" });

        const { data, error } = await supabase
            .from("hostel_rooms")
            .insert([{ block, room_no, capacity: capacity || 1, status: "Vacant" }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // { student_name, student_id, status }

        const { data, error } = await supabase
            .from("hostel_rooms")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("hostel_rooms").delete().eq("id", id);
        if (error) throw error;
        res.json({ success: true, message: "Room deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==================== COMPLAINTS ====================

export const getComplaints = async (req, res) => {
    try {
        let query = supabase
            .from("hostel_complaints")
            .select("*")
            .order("created_at", { ascending: false });

        // Students only see their own complaints
        if (req.user.role === "student") {
            query = query.eq("student_id", req.user.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createComplaint = async (req, res) => {
    try {
        const { room_no, category, description } = req.body;
        if (!room_no || !category) return res.status(400).json({ success: false, message: "room_no and category required" });

        // Get student name from users table
        const { data: userData } = await supabase
            .from("users")
            .select("name")
            .eq("id", req.user.id)
            .single();

        const { data, error } = await supabase
            .from("hostel_complaints")
            .insert([{
                student_id: req.user.id,
                student_name: userData?.name || "Unknown",
                room_no,
                category,
                description: description || "",
                status: "Pending",
            }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["Pending", "In Progress", "Resolved"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const { data, error } = await supabase
            .from("hostel_complaints")
            .update({ status })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==================== MESS MENU ====================

export const getMessMenu = async (req, res) => {
    try {
        const { day } = req.query;
        let query = supabase.from("mess_menu").select("*").order("meal");
        if (day) query = query.eq("day_of_week", day);

        const { data, error } = await query;
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateMessMenu = async (req, res) => {
    try {
        const { meals } = req.body; // array of { meal, time_slot, items, day_of_week }
        if (!meals || !meals.length) return res.status(400).json({ success: false, message: "meals array required" });

        // Upsert each meal
        const results = [];
        for (const m of meals) {
            const { data, error } = await supabase
                .from("mess_menu")
                .upsert(
                    { meal: m.meal, time_slot: m.time_slot, items: m.items, day_of_week: m.day_of_week, updated_at: new Date().toISOString() },
                    { onConflict: "meal,day_of_week" }
                )
                .select()
                .single();
            if (error) throw error;
            results.push(data);
        }

        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
