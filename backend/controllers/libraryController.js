import supabase from "../config/supabase.js";

// Search for books in 'lib_book' table
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(`[Library] Searching for: "${query}"`);

    if (!query) return res.status(400).json({ message: "Search query is required" });

    // We use ilike for case-insensitive partial match on title
    // (Selecting * because 'id' column might be missing)
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
    if (data && data.length > 0) {
        console.log("[Library] First book sample:", JSON.stringify(data[0], null, 2));
    }
    res.json(data);
  } catch (error) {
    console.error("[Library] Server Search Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Issue a book
export const issueBook = async (req, res) => {
  try {
    const { book_id, user_id, title, author, image, due_date } = req.body; 
    console.log(`[Library] Issuing book: ${title} to user: ${user_id}`);

    // Validation
    if (!book_id || !user_id) {
        return res.status(400).json({ message: "Book ID and User ID are required" });
    }

    // Default due date = 15 days from now if not provided
    const issueDate = new Date();
    const dueDate = due_date ? new Date(due_date) : new Date(issueDate);
    if (!due_date) dueDate.setDate(dueDate.getDate() + 15);

    const { data, error } = await supabase
      .from("issued_books") // Ensure this table exists!
      .insert([
        {
          book_id: String(book_id), // Ensure string format if text
          user_id,
          title,
          author,
          image,
          issue_date: issueDate.toISOString(),
          due_date: dueDate.toISOString(),
          status: "issued"
        }
      ])
      .select();

    if (error) {
      console.error("[Library] Issue Book Error:", error);
      throw error;
    }

    console.log(`[Library] Book issued successfully: ID ${data[0].id}`);
    res.status(201).json({ message: "Book issued successfully", book: data[0] });
  } catch (error) {
    console.error("[Library] Failed to issue book:", error.message);
    res.status(500).json({ message: "Failed to issue book. Ensure 'issued_books' table exists.", error: error.message });
  }
};

// Get Issued Books for a User
export const getIssuedBooks = async (req, res) => {
    try {
        const { user_id } = req.query; // Or req.user.id
        // if (!user_id) return res.status(400).json({ message: "User ID required" });

        // For demo, if no user_id, fetch all (or restricting to logged in user later)
        let query = supabase.from("issued_books").select("*");
        
        if (user_id) {
            query = query.eq("user_id", user_id);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("[Library] Get Issued Books Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}
