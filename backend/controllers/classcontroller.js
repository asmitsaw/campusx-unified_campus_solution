import supabase from "../config/supabase.js";

// Create a class linked to a batch
export const createClass = async (req, res) => {
    try {
        const { name, subject_code, batch_id } = req.body;

        if (!name || !batch_id) {
            return res.status(400).json({ success: false, message: "name and batch_id are required" });
        }

        const { data, error } = await supabase
            .from("classes")
            .insert([{ name, subject_code: subject_code || null, batch_id, faculty_id: req.user.id }])
            .select("*, batches(name, branch, year)")
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all classes (faculty sees own, admin sees all)
export const getClasses = async (req, res) => {
    try {
        let query = supabase
            .from("classes")
            .select("*, batches(name, branch, year, academic_year)")
            .order("created_at", { ascending: false });

        // Faculty sees only their own classes, admin sees all
        if (req.user.role !== "admin") {
            query = query.eq("faculty_id", req.user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a class
export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        let query = supabase.from("classes").delete().eq("id", id);

        // Faculty can only delete their own
        if (req.user.role !== "admin") {
            query = query.eq("faculty_id", req.user.id);
        }

        const { error } = await query;

        if (error) throw error;

        res.json({ success: true, message: "Class deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
