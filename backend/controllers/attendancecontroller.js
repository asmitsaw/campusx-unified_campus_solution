import supabase from "../config/supabase.js";

// ─────────────────────────────────────────────────────────────
// FACULTY: Get schedule for a specific date (or today)
// GET /attendance/schedule?date=2026-02-20
// ─────────────────────────────────────────────────────────────
export const getScheduleByDate = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("faculty_schedule")
      .select("*")
      .eq("date", date)
      .order("time_start", { ascending: true });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FACULTY: Get all dates that have schedule in a given month
// GET /attendance/schedule/month?year=2026&month=2
// ─────────────────────────────────────────────────────────────
export const getScheduleMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || (new Date().getMonth() + 1);

    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = `${year}-${String(month).padStart(2, "0")}-31`;

    const { data, error } = await supabase
      .from("faculty_schedule")
      .select("id, date, subject, type, section, room, time_start, time_end")
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: true })
      .order("time_start", { ascending: true });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FACULTY: Get all students
// GET /attendance/students?section=A
// ─────────────────────────────────────────────────────────────
export const getStudents = async (req, res) => {
  try {
    let query = supabase
      .from("faculty_students")
      .select("*")
      .order("roll_no", { ascending: true });

    if (req.query.section) {
      query = query.eq("section", req.query.section);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FACULTY: Get attendance records for a specific schedule session
// GET /attendance/records/:scheduleId
// ─────────────────────────────────────────────────────────────
export const getAttendanceRecords = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const { data, error } = await supabase
      .from("attendance_records")
      .select("*, faculty_students(id, name, roll_no, section)")
      .eq("schedule_id", scheduleId);

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FACULTY: Get recent attendance records (last 10 sessions marked)
// GET /attendance/recent
// ─────────────────────────────────────────────────────────────
export const getRecentAttendance = async (req, res) => {
  try {
    // Get distinct schedule_ids that have been marked, most recent first
    const { data: sessions, error } = await supabase
      .from("attendance_records")
      .select("schedule_id, marked_at")
      .order("marked_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    if (!sessions || sessions.length === 0) return res.json({ success: true, data: [] });

    // Get unique schedule_ids (dedup)
    const seen = new Set();
    const uniqueSessionIds = [];
    sessions.forEach(r => {
      if (!seen.has(r.schedule_id)) {
        seen.add(r.schedule_id);
        uniqueSessionIds.push(r.schedule_id);
      }
    });
    const recentIds = uniqueSessionIds.slice(0, 10);

    // Fetch schedule details + attendance counts for each
    const results = await Promise.all(
      recentIds.map(async (sid) => {
        const { data: sched } = await supabase
          .from("faculty_schedule")
          .select("*")
          .eq("id", sid)
          .single();

        const { data: records } = await supabase
          .from("attendance_records")
          .select("status")
          .eq("schedule_id", sid);

        const total = records?.length || 0;
        const present = records?.filter(r => r.status === "present").length || 0;
        const markedAt = sessions.find(s => s.schedule_id === sid)?.marked_at;

        return {
          schedule_id: sid,
          subject: sched?.subject || "–",
          type: sched?.type || "Lecture",
          section: sched?.section || "–",
          date: sched?.date || "–",
          present,
          total,
          marked_at: markedAt,
        };
      })
    );

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FACULTY: Mark / update attendance for a session
// POST /attendance/mark
// Body: { schedule_id, records: [{ student_id, status }] }
// ─────────────────────────────────────────────────────────────
export const markAttendance = async (req, res) => {
  try {
    const { schedule_id, records } = req.body;

    if (!schedule_id || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: "schedule_id and records[] are required" });
    }

    const upsertData = records.map(r => ({
      schedule_id,
      student_id: r.student_id,
      status: r.status || "present",
      marked_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(upsertData, { onConflict: "schedule_id,student_id" })
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: `Attendance marked for ${records.length} students`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// STUDENT: View own attendance — full detail (for student portal)
// GET /attendance/my
// Looks up the student in faculty_students by email, then fetches all records
// ─────────────────────────────────────────────────────────────
export const getMyAttendance = async (req, res) => {
  try {
    // Prefer email from JWT; fall back to fetching from users table (old tokens won't have email)
    let userEmail = req.user.email;

    if (!userEmail) {
      console.log(`[attendance/my] email missing from JWT (old token) — fetching from users table for id: ${req.user.id}`);
      const { data: userRow, error: userErr } = await supabase
        .from("users")
        .select("email")
        .eq("id", req.user.id)
        .single();
      if (userErr) throw userErr;
      userEmail = userRow?.email;
    }

    console.log(`[attendance/my] lookup for email: ${userEmail}`);

    // 1. Find this student in the faculty_students roster by email
    const { data: student, error: stuErr } = await supabase
      .from("faculty_students")
      .select("id, name, roll_no, section")
      .eq("email", userEmail)
      .maybeSingle();

    if (stuErr) throw stuErr;

    if (!student) {
      console.log(`[attendance/my] not found in roster for email: ${userEmail}`);
      return res.json({
        success: true,
        data: { subjects: [], totalPresent: 0, totalClasses: 0, overallPct: 0, student: null, email: userEmail },
      });
    }

    console.log(`[attendance/my] found student: ${student.name} (${student.id})`);

    // 2. Fetch all attendance records for this student (no embedded order — causes errors)
    const { data: records, error: recErr } = await supabase
      .from("attendance_records")
      .select("status, schedule_id")
      .eq("student_id", student.id);

    if (recErr) throw recErr;

    if (!records || records.length === 0) {
      return res.json({
        success: true,
        data: {
          student: { name: student.name, roll_no: student.roll_no, section: student.section },
          subjects: [], perDate: [], totalPresent: 0, totalClasses: 0, overallPct: 0,
        },
      });
    }

    // 3. Fetch schedule details for all referenced schedule IDs
    const scheduleIds = [...new Set(records.map(r => r.schedule_id))];
    const { data: schedules, error: schErr } = await supabase
      .from("faculty_schedule")
      .select("id, subject, type, section, date, time_start, room")
      .in("id", scheduleIds)
      .order("date", { ascending: false });

    if (schErr) throw schErr;

    // Build a lookup map
    const scheduleMap = {};
    (schedules || []).forEach(s => { scheduleMap[s.id] = s; });

    // 4. Group by subject
    const subjectMap = {};
    const perDate = [];

    records.forEach(r => {
      const sched = scheduleMap[r.schedule_id];
      if (!sched) return;

      const key = sched.subject;
      if (!subjectMap[key]) {
        subjectMap[key] = { subject: key, type: sched.type, section: sched.section, present: 0, absent: 0, total: 0 };
      }
      if (r.status === "present") subjectMap[key].present++;
      else subjectMap[key].absent++;
      subjectMap[key].total++;

      perDate.push({
        subject: sched.subject,
        type: sched.type,
        date: sched.date,
        time: sched.time_start,
        room: sched.room,
        status: r.status,
      });
    });

    // Sort perDate by date descending
    perDate.sort((a, b) => (a.date < b.date ? 1 : -1));

    const subjects = Object.values(subjectMap).map(s => ({
      ...s,
      percentage: s.total > 0 ? parseFloat(((s.present / s.total) * 100).toFixed(1)) : 0,
    }));

    const totalPresent = subjects.reduce((acc, s) => acc + s.present, 0);
    const totalClasses = subjects.reduce((acc, s) => acc + s.total, 0);
    const overallPct = totalClasses > 0 ? parseFloat(((totalPresent / totalClasses) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      data: {
        student: { name: student.name, roll_no: student.roll_no, section: student.section },
        subjects,
        perDate: perDate.slice(0, 30),
        totalPresent,
        totalClasses,
        overallPct,
      },
    });
  } catch (err) {
    console.error("[attendance/my] ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// STUDENT: Legacy view own attendance (kept for backward compat)
// GET /attendance/student
// ─────────────────────────────────────────────────────────────
export const getStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("attendance_records")
      .select("status, schedule_id, faculty_schedule(subject, type, date)")
      .eq("student_id", userId);

    if (error) throw error;

    const result = {};
    (data || []).forEach(r => {
      const subject = r.faculty_schedule?.subject || "Unknown";
      if (!result[subject]) result[subject] = { present: 0, total: 0 };
      if (r.status === "present") result[subject].present++;
      result[subject].total++;
    });

    const formatted = Object.keys(result).map(subject => ({
      subject,
      present: result[subject].present,
      total: result[subject].total,
      percentage: ((result[subject].present / result[subject].total) * 100).toFixed(1),
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};