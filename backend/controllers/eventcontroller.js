import supabase from "../config/supabase.js";

export const registerEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { event_id } = req.body;

    // 🔹 Check if already registered
    const { data: existing } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("student_id", userId)
      .eq("event_id", event_id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event"
      });
    }

    // 🔹 Insert registration
    const { data, error } = await supabase
      .from("event_registrations")
      .insert([
        {
          student_id: userId,
          event_id
        }
      ]);

    if (error) throw error;

    res.json({
      success: true,
      message: "Registered successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};