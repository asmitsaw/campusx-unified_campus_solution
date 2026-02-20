import supabase from "../config/supabase.js";

// ─────────────────────────────────────────────
// TPO: Create a new placement drive
// ─────────────────────────────────────────────
export const createDrive = async (req, res) => {
  try {
    const { company, role, package_lpa, deadline, description, eligibility, type, location, drive_date, training_sessions } = req.body;
    const tpo_id = req.user.id;

    if (!company || !role || !package_lpa || !deadline) {
      return res.status(400).json({ success: false, message: "company, role, package_lpa and deadline are required" });
    }

    const { data, error } = await supabase
      .from("placements")
      .insert([{ company, role, package_lpa, deadline, description, eligibility, type: type || "On-Campus", location, drive_date, tpo_id, status: "Active" }])
      .select()
      .single();

    if (error) throw error;

    // If training sessions provided, insert them
    if (training_sessions && Array.isArray(training_sessions) && training_sessions.length > 0) {
      const sessions = training_sessions.map(s => ({ ...s, placement_id: data.id }));
      await supabase.from("training_sessions").insert(sessions);
    }

    res.json({ success: true, data, message: "Placement drive created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// TPO: Update placement drive (status, details)
// ─────────────────────────────────────────────
export const updateDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("placements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: "Drive updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// TPO: Delete a placement drive
// ─────────────────────────────────────────────
export const deleteDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("placements").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true, message: "Drive deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// ALL: Get all placement drives
// ─────────────────────────────────────────────
export const getAllDrives = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("placements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// ALL: Get single placement drive 
// ─────────────────────────────────────────────
export const getDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("placements")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!data) return res.status(404).json({ success: false, message: "Drive not found" });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// STUDENT: Apply for a placement
// ─────────────────────────────────────────────
export const applyPlacement = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placement_id } = req.body;

    const { data: placement } = await supabase
      .from("placements")
      .select("*")
      .eq("id", placement_id)
      .maybeSingle();

    if (!placement) return res.status(404).json({ success: false, message: "Placement not found" });

    const { data: existing } = await supabase
      .from("applications")
      .select("*")
      .eq("student_id", userId)
      .eq("placement_id", placement_id)
      .maybeSingle();

    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const { data, error } = await supabase
      .from("applications")
      .insert([{ student_id: userId, placement_id, status: "Applied" }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data, message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// STUDENT: Get my applications + progress
// ─────────────────────────────────────────────
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: get applications
    const { data: apps, error: appsError } = await supabase
      .from("applications")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false });

    if (appsError) throw appsError;
    if (!apps || apps.length === 0) return res.json({ success: true, data: [] });

    // Step 2: fetch placement details for each application
    const placementIds = [...new Set(apps.map(a => a.placement_id).filter(Boolean))];
    const { data: placements } = await supabase
      .from("placements")
      .select("*")
      .in("id", placementIds);

    const placementsMap = {};
    (placements || []).forEach(p => { placementsMap[p.id] = p; });

    const enriched = apps.map(a => ({
      ...a,
      placements: placementsMap[a.placement_id] || null,
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// TPO: Get applicants for a drive
// ─────────────────────────────────────────────
export const getDriveApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: get all applications for this drive
    const { data: apps, error: appsError } = await supabase
      .from("applications")
      .select("*")
      .eq("placement_id", id)
      .order("created_at", { ascending: false });

    if (appsError) throw appsError;
    if (!apps || apps.length === 0) return res.json({ success: true, data: [] });

    // Step 2: fetch user details for each applicant
    const studentIds = [...new Set(apps.map(a => a.student_id).filter(Boolean))];
    const { data: users } = await supabase
      .from("users")
      .select("id, name, email, role")
      .in("id", studentIds);

    const usersMap = {};
    (users || []).forEach(u => { usersMap[u.id] = u; });

    const enriched = apps.map(a => ({
      ...a,
      users: usersMap[a.student_id] || null,
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// TPO: Update applicant status (Shortlisted, Selected, Rejected, etc.)
// ─────────────────────────────────────────────
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const VALID_STATUSES = ["Applied", "Shortlisted", "Coding Round", "Interview", "Selected", "Rejected"];

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// TPO: Create a training session
// ─────────────────────────────────────────────
export const createTrainingSession = async (req, res) => {
  try {
    const { title, description, date, time, venue, placement_id, type } = req.body;
    const tpo_id = req.user.id;

    const { data, error } = await supabase
      .from("training_sessions")
      .insert([{ title, description, date, time, venue, placement_id: placement_id || null, tpo_id, type: type || "General" }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: "Training session created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// ALL: Get all training sessions
// ─────────────────────────────────────────────
export const getTrainingSessions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*, placements(company, role)")
      .order("date", { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// TPO: Get placement stats summary
// ─────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const { data: drives } = await supabase.from("placements").select("id, status, package_lpa");
    const { data: applications } = await supabase.from("applications").select("status");

    const total_drives = drives?.length || 0;
    const active_drives = drives?.filter(d => d.status === "Active").length || 0;
    const students_placed = applications?.filter(a => a.status === "Selected").length || 0;
    const packages = drives?.map(d => parseFloat(d.package_lpa)).filter(Boolean) || [];
    const avg_package = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;
    const highest_package = packages.length ? Math.max(...packages) : 0;
    const total_applications = applications?.length || 0;

    res.json({
      success: true,
      data: { total_drives, active_drives, students_placed, avg_package, highest_package, total_applications }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};