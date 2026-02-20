import supabase from "../config/supabase.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Attendance
    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", userId);

    // 🔹 Events (latest 3)
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .limit(3);

    // 🔹 Placements (latest 3)
    const { data: placements } = await supabase
      .from("placements")
      .select("*")
      .order("deadline", { ascending: true })
      .limit(3);

    // 🔹 Library (borrowed books)
    const { data: library } = await supabase
      .from("borrow")
      .select("*")
      .eq("student_id", userId)
      .eq("returned", false);

    // 🔹 Notifications
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    res.json({
      success: true,
      data: {
        attendance,
        events,
        placements,
        library,
        notifications
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};