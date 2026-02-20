import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";

// Generate a readable random password
function generatePassword(length = 8) {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Create a batch + add students + create user accounts + return credentials
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
        const credentials = []; // { name, email, roll_no, password }

        if (students && students.length > 0) {
            for (const s of students) {
                const email = s.email || `${s.roll_no.toLowerCase().replace(/\s/g, "")}@campusx.edu`;
                const plainPassword = generatePassword(8);

                // Check if user already exists
                const { data: existingUser } = await supabase
                    .from("users")
                    .select("id, name, email")
                    .eq("email", email)
                    .maybeSingle();

                let userId;

                if (existingUser) {
                    // User already exists — link them
                    userId = existingUser.id;
                    credentials.push({
                        roll_no: s.roll_no,
                        name: s.name,
                        email,
                        password: "(existing account — password unchanged)",
                    });
                } else {
                    // Create new user account
                    const hashedPassword = await bcrypt.hash(plainPassword, 10);
                    const { data: newUser, error: userErr } = await supabase
                        .from("users")
                        .insert([{ name: s.name, email, password: hashedPassword, role: "student" }])
                        .select("id")
                        .single();

                    if (userErr) {
                        console.error(`Failed to create user for ${email}:`, userErr.message);
                        credentials.push({
                            roll_no: s.roll_no,
                            name: s.name,
                            email,
                            password: `ERROR: ${userErr.message}`,
                        });
                        continue;
                    }
                    userId = newUser.id;
                    credentials.push({
                        roll_no: s.roll_no,
                        name: s.name,
                        email,
                        password: plainPassword,
                    });
                }

                // Insert batch_student row
                const { data: stuData, error: stuErr } = await supabase
                    .from("batch_students")
                    .insert([{
                        batch_id: batch.id,
                        roll_no: s.roll_no,
                        name: s.name,
                        email,
                        user_id: userId,
                    }])
                    .select()
                    .single();

                if (stuErr) {
                    console.error(`Failed to insert batch_student for ${s.roll_no}:`, stuErr.message);
                } else {
                    insertedStudents.push(stuData);
                }
            }
        }

        res.status(201).json({
            success: true,
            data: { ...batch, students: insertedStudents },
            credentials, // Frontend will use this to generate downloadable CSV
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
