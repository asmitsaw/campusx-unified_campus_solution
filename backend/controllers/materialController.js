import supabase from "../config/supabase.js";


// 👨‍🏫 FACULTY: Upload Material
export const uploadMaterial = async (req, res) => {
  try {
    const { course_id, title, file_url } = req.body;

    const { error } = await supabase
      .from("materials")
      .insert([
        {
          course_id,
          title,
          file_url
        }
      ]);

    if (error) throw error;

    // --- Bulk Insert Notifications for Students ---
    try {
      const { data: students, error: studentError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "student");

      if (!studentError && students && students.length > 0) {
        const notifications = students.map(student => ({
          user_id: student.id,
          title: "New Study Material Posted",
          message: `A new material "${title}" has been uploaded by the faculty.`,
          type: "library",
          link: "/dashboard/lms",
        }));
        await supabase.from("notifications").insert(notifications);
      }
    } catch (notifErr) {
      console.error("Failed to insert material notifications:", notifErr.message);
    }

    res.json({
      success: true,
      message: "Material uploaded successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 👨‍🎓 STUDENT: Get Materials
export const getMaterials = async (req, res) => {
  try {
    const { course_id } = req.query;

    const { data } = await supabase
      .from("materials")
      .select(`
        title,
        file_url,
        courses (name)
      `)
      .eq("course_id", course_id)
      .order("created_at", { ascending: false });

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};