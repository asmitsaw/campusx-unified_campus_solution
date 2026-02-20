import supabase from "../config/supabase.js";
import fs from "fs";
import path from "path";

// ── GET all events ────────────────────────────────────────────────────────────
export const getAllEvents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("event1")
      .select("*")
      .order("date", { ascending: true });

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET single event by ID ────────────────────────────────────────────────────
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("event1")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ message: "Event not found" });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── CREATE event ──────────────────────────────────────────────────────────────
export const createEvent = async (req, res) => {
  try {
    const {
      title, description, category, date,
      time_start, time_end, venue, total_seats, status,
    } = req.body;

    const banner_path = req.file ? req.file.filename : null;

    const { data, error } = await supabase
      .from("event1")
      .insert([{
        title, description, category, date,
        time_start, time_end, venue,
        total_seats: parseInt(total_seats),
        registered: 0,
        banner_path,
        status: status || "Active",
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    // --- Bulk Insert Notifications for Students ---
    try {
      if (status !== "Completed" && status !== "Cancelled") {
        const { data: students, error: studentError } = await supabase
          .from("users")
          .select("id")
          .eq("role", "student");

        if (!studentError && students && students.length > 0) {
          const notifications = students.map(student => ({
            user_id: student.id,
            title: "New Event Posted",
            message: `A new ${category || 'event'} "${title}" has been scheduled for ${date}. Venue: ${venue}.`,
            type: "event",
            link: "/dashboard/events",
          }));
          await supabase.from("notifications").insert(notifications);
        }
      }
    } catch (notifErr) {
      console.error("Failed to insert event notifications:", notifErr.message);
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── UPDATE event ──────────────────────────────────────────────────────────────
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, category, date,
      time_start, time_end, venue, total_seats, status,
    } = req.body;

    const updates = {
      title, description, category, date,
      time_start, time_end, venue,
      total_seats: parseInt(total_seats),
      status,
    };

    // If a new banner was uploaded replace the old file
    if (req.file) {
      // fetch old banner to delete it
      const { data: old } = await supabase
        .from("event1")
        .select("banner_path")
        .eq("id", id)
        .single();

      if (old?.banner_path) {
        const oldPath = path.join("uploads", "events", old.banner_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.banner_path = req.file.filename;
    }

    const { data, error } = await supabase
      .from("event1")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── DELETE event ──────────────────────────────────────────────────────────────
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // delete banner file first
    const { data: ev } = await supabase
      .from("event1")
      .select("banner_path")
      .eq("id", id)
      .single();

    if (ev?.banner_path) {
      const filePath = path.join("uploads", "events", ev.banner_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const { error } = await supabase.from("event1").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "Event deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET today's schedule for Event Manager Dashboard ─────────────────────────
export const getEventManagerSchedule = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("event1")
      .select("*")
      .eq("date", today)
      .eq("status", "Active")
      .order("time_start", { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET recent activity (registrations) for Event Manager Dashboard ─────────
export const getEventManagerActivity = async (req, res) => {
  try {
    const { data: regs, error } = await supabase
      .from("register1")
      .select("*, event1(title)")
      .order("registered_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    
    const activity = regs.map(r => ({
      text: `${r.student_name} registered for ${r.event1?.title}`,
      time: r.registered_at,
      status: "Registration"
    }));

    return res.json(activity);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET stats for Event Manager Dashboard ────────────────────────────────────
export const getEventManagerStats = async (req, res) => {
  try {
    const { data: all } = await supabase.from("event1").select("status, registered");
    
    const active = all.filter(e => e.status === "Active").length;
    const completed = all.filter(e => e.status === "Completed").length;
    const upcoming = all.filter(e => e.status === "Active" && new Date(e.date) > new Date()).length;
    const registrations = all.reduce((acc, e) => acc + (e.registered || 0), 0);

    return res.json({
      active,
      completed,
      upcoming,
      registrations
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET list of students who registered for an event ─────────────────────────
export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("register1")
      .select("*")
      .eq("event_id", id)
      .order("registered_at", { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── REGISTER student for event ────────────────────────────────────────────────
export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const eventId = parseInt(id);

    console.log(`[Reg] Student ${userId} attempting to join event ${eventId}`);

    // 1. Get user details from users table
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .single();

    if (userErr || !user) {
      console.error("[Reg] User fetch error:", userErr);
      return res.status(404).json({ message: "Student profile not found" });
    }

    // 2. Check if already registered
    const { data: existing } = await supabase
      .from("register1")
      .select("*")
      .eq("event_id", eventId)
      .eq("student_id", userId)
      .maybeSingle();

    if (existing) return res.status(400).json({ message: "You are already registered for this event!" });

    // 3. Check event capacity
    const { data: ev } = await supabase
      .from("event1")
      .select("registered, total_seats")
      .eq("id", eventId)
      .single();

    if (!ev) return res.status(404).json({ message: "Event not found" });
    if (ev.registered >= ev.total_seats)
      return res.status(409).json({ message: "Sorry, this event is already full!" });

    // 4. Insert registration record
    const { error: regErr } = await supabase
      .from("register1")
      .insert([{
        event_id: eventId,
        student_id: userId,
        student_name: user.name,
        student_email: user.email
      }]);

    if (regErr) {
      console.error("[Reg] Insert error:", regErr);
      throw regErr;
    }

    // 5. Atomic increment
    const { data, error: updateErr } = await supabase
      .from("event1")
      .update({ registered: (ev.registered || 0) + 1 })
      .eq("id", eventId)
      .select()
      .single();

    if (updateErr) throw updateErr;
    
    console.log(`[Reg] Success for student ${user.name}`);
    return res.json({ message: "Successfully registered", event: data });
  } catch (err) {
    console.error("[Reg] Global error:", err);
    return res.status(500).json({ message: err.message });
  }
};
