import supabase from "../config/supabase.js";

export const applyPlacement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placement_id } = req.body;

    // 🔹 Check if placement exists
    const { data: placement } = await supabase
      .from("placements")
      .select("*")
      .eq("id", placement_id)
      .maybeSingle();

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found"
      });
    }

    // 🔹 Check duplicate application
    const { data: existing } = await supabase
      .from("applications")
      .select("*")
      .eq("student_id", userId)
      .eq("placement_id", placement_id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this placement"
      });
    }

    // 🔹 Insert application
    const { error } = await supabase
      .from("applications")
      .insert([
        {
          student_id: userId,
          placement_id
        }
      ]);

    if (error) throw error;

    res.json({
      success: true,
      message: "Applied successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};