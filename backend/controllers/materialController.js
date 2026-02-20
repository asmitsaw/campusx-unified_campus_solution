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