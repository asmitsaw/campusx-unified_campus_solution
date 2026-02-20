import supabase from "../config/supabase.js";

// Create a batch + add students
export const createBatch = async (req, res) => {
    try {
        const { name, branch, year, academic_year, students } = req.body;

        if (!name || !branch || !year || !academic_year) {
            return res.status(400).json({ success: false, message: "name, branch, year, academic_year are required" });
        }

        // Create batch
        const { data: batch, error: batchErr } = await supabase
            .from("batches")
            .insert([{ name, branch, year, academic_year, created_by: req.user.id }])
            .select()
            .single();

        if (batchErr) throw batchErr;

        // Add students if provided
        let insertedStudents = [];
        if (students && students.length > 0) {
            const rows = students.map((s) => ({
                batch_id: batch.id,
                roll_no: s.roll_no,
                name: s.name,
                email: s.email || null,
            }));

            const { data: stuData, error: stuErr } = await supabase
                .from("batch_students")
                .insert(rows)
                .select();

            if (stuErr) throw stuErr;
            insertedStudents = stuData;
        }

        res.status(201).json({
            success: true,
            data: { ...batch, students: insertedStudents },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all batches
export const getBatches = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("batches")
            .select("*, batch_students(count)")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Flatten count
        const batches = data.map((b) => ({
            ...b,
            student_count: b.batch_students?.[0]?.count || 0,
        }));

        res.json({ success: true, data: batches });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get students in a batch
export const getBatchStudents = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("batch_students")
            .select("*")
            .eq("batch_id", id)
            .order("roll_no");

        if (error) throw error;

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a batch
export const deleteBatch = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from("batches").delete().eq("id", id);

        if (error) throw error;

        res.json({ success: true, message: "Batch deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
