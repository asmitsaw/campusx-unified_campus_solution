import supabase from "../config/supabase.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Attendance WITH course name
    const { data: attendance } = await supabase
      .from("attendance")
      .select(`
        present,
        total,
        courses (name)
      `)
      .eq("student_id", userId);

    const formattedAttendance = (attendance || []).map(a => ({
  course: a.courses?.name,
  present: a.present,
  total: a.total,
  percentage: ((a.present / a.total) * 100).toFixed(1)
}));

    // 🔹 Events
    const { data: events } = await supabase
      .from("events")
      .select("title, description, date")
      .order("date", { ascending: true })
      .limit(3);

    // 🔹 Placements
    const { data: placements } = await supabase
      .from("placements")
      .select("company, role, deadline")
      .order("deadline", { ascending: true })
      .limit(3);

    // 🔹 Library WITH book name
    const { data: library } = await supabase
      .from("borrow")
      .select(`
        due_date,
        returned,
        books (title)
      `)
      .eq("student_id", userId)
      .eq("returned", false);

    const formattedLibrary = (library || []).map(b => ({
  book: b.books?.title,
  due_date: b.due_date
}));
    // 🔹 Notifications
    const { data: notifications } = await supabase
      .from("notifications")
      .select("message, priority, read, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    res.json({
      success: true,
      data: {
        attendance: formattedAttendance,
        events,
        placements,
        library: formattedLibrary,
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