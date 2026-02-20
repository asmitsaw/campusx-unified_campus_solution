import supabase from "../config/supabase.js";

// Search for books in 'books' table
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`[Library] Searching for: "${query}"`);

    if (!query) return res.status(400).json({ message: "Search query is required" });

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .ilike('title', `%${query}%`)
      .limit(20);

    if (error) {
      console.error("[Library] Database Search Error:", error);
      throw error;
    }

    console.log(`[Library] Found ${data?.length || 0} books`);
    res.json(data);
  } catch (error) {
    console.error("[Library] Server Search Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Student requests a book (does NOT issue directly)
export const requestBook = async (req, res) => {
  try {
    let { user_id, user_name, user_email, title, author, image } = req.body;
    console.log(`[Library] Book request: "${title}" by user: ${user_id} (${user_name})`);

    if (!user_id || !title) {
      return res.status(400).json({ message: "Book title and User ID are required" });
    }

    // Check for duplicate pending request
    const { data: existing } = await supabase
      .from("book_requests")
      .select("id")
      .eq("user_id", user_id)
      .eq("title", title)
      .eq("status", "pending")
      .single();

    if (existing) {
      return res.status(409).json({ message: "You already have a pending request for this book" });
    }

    const { data, error } = await supabase
      .from("book_requests")
      .insert([{
        user_id,
        user_name:  user_name  || null,
        user_email: user_email || null,
        title,
        author,
        image,
        status: "pending",
        requested_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Book request submitted successfully", request: data[0] });
  } catch (error) {
    console.error("[Library] Request Book Error:", error.message);
    res.status(500).json({ message: "Failed to submit book request.", error: error.message });
  }
};

// Get all requests (for librarian) — enriched with student name + email
export const getPendingRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("book_requests")
      .select("*")
      .order("requested_at", { ascending: false });

    if (error) throw error;

    // Build a userMap for rows that are missing stored user_name (old records)
    const missingNameIds = [...new Set(
      (data || []).filter((r) => !r.user_name).map((r) => r.user_id)
    )];

    let userMap = {};
    if (missingNameIds.length > 0) {
      // user_id is a UUID string — query users table directly with those UUIDs
      const { data: users } = await supabase
        .from("users")
        .select("id, name, email")
        .in("id", missingNameIds);
      (users || []).forEach((u) => { userMap[u.id] = u; });
    }

    const enriched = (data || []).map((r) => ({
      ...r,
      student_name:  r.user_name  || userMap[r.user_id]?.name  || r.user_id,
      student_email: r.user_email || userMap[r.user_id]?.email || null,
    }));

    res.json(enriched);
  } catch (error) {
    console.error("[Library] Get Requests Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Librarian approves or rejects a request
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, librarian_note } = req.body; // status: 'approved' | 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    // Update the request
    const { data: requestData, error: reqError } = await supabase
      .from("book_requests")
      .update({ status, librarian_note, resolved_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (reqError) throw reqError;

    // If approved, create an issued_books record
    if (status === "approved") {
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 15);

      const { error: issueError } = await supabase
        .from("issued_books")
        .insert([{
          book_id: requestData.title,
          user_id: requestData.user_id,
          title: requestData.title,
          author: requestData.author,
          image: requestData.image,
          issue_date: issueDate.toISOString(),
          due_date: dueDate.toISOString(),
          status: "issued"
        }]);

      if (issueError) throw issueError;
    }

    res.json({ message: `Request ${status} successfully`, request: requestData });
  } catch (error) {
    console.error("[Library] Update Request Error:", error.message);
    res.status(500).json({ message: "Failed to update request", error: error.message });
  }
};

// Librarian issues a book directly (without a request)
export const issueBook = async (req, res) => {
  try {
    let { book_id, user_id, title, author, image, due_date } = req.body;
    console.log(`[Library] Issuing book: ${title} to user: ${user_id}`);

    if (!user_id || !title) {
      return res.status(400).json({ message: "Book Title and User ID are required" });
    }

    if (!book_id) {
      book_id = title;
    }

    const issueDate = new Date();
    const dueDate = due_date ? new Date(due_date) : new Date(issueDate);
    if (!due_date) dueDate.setDate(dueDate.getDate() + 15);

    const { data, error } = await supabase
      .from("issued_books")
      .insert([{
        book_id: String(book_id),
        user_id,
        title,
        author,
        image,
        issue_date: issueDate.toISOString(),
        due_date: dueDate.toISOString(),
        status: "issued"
      }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Book issued successfully", book: data[0] });
  } catch (error) {
    console.error("[Library] Failed to issue book:", error.message);
    res.status(500).json({ message: "Failed to issue book.", error: error.message });
  }
};

// Get Issued Books (all for librarian, filtered by user_id for student) — enriched with student info
export const getIssuedBooks = async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = supabase.from("issued_books").select("*").order("issue_date", { ascending: false });
    if (user_id) query = query.eq("user_id", user_id);

    const { data, error } = await query;
    if (error) throw error;

    // Enrich with student name + email for librarian view (no user_id filter)
    if (!user_id && data && data.length > 0) {
      const uuidIds = [...new Set(data.map((b) => b.user_id))];

      const { data: users } = await supabase
        .from("users")
        .select("id, name, email")
        .in("id", uuidIds);

      const userMap = {};
      (users || []).forEach((u) => { userMap[u.id] = u; });

      const enriched = data.map((b) => ({
        ...b,
        student_name:  userMap[b.user_id]?.name  || b.user_id,
        student_email: userMap[b.user_id]?.email || null,
      }));
      return res.json(enriched);
    }

    res.json(data);
  } catch (error) {
    console.error("[Library] Get Issued Books Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get student's own book requests
export const getMyRequests = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "User ID required" });

    const { data, error } = await supabase
      .from("book_requests")
      .select("*")
      .eq("user_id", user_id)
      .order("requested_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("[Library] Get My Requests Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
