import supabase from "../config/supabase.js";


// 🔹 FACULTY: MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { course_id, date, records } = req.body;

    // records = [{ student_id, status }]
    const insertData = records.map(r => ({
      student_id: r.student_id,
      course_id,
      date,
      status: r.status
    }));

    const { error } = await supabase
      .from("attendance_records")
      .insert(insertData);

    if (error) throw error;

    res.json({
      success: true,
      message: "Attendance marked successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🔹 STUDENT: VIEW ATTENDANCE
export const getStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data } = await supabase
      .from("attendance_records")
      .select(`
        status,
        course_id,
        courses (name)
      `)
      .eq("student_id", userId);

    const result = {};

    data.forEach(r => {
      const course = r.courses?.name;

      if (!result[course]) {
        result[course] = { present: 0, total: 0 };
      }

      if (r.status === "present") {
        result[course].present++;
      }

      result[course].total++;
    });

    const formatted = Object.keys(result).map(course => ({
      course,
      present: result[course].present,
      total: result[course].total,
      percentage: (
        (result[course].present / result[course].total) * 100
      ).toFixed(1)
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};