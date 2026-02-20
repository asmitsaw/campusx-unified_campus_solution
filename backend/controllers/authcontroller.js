import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 🔹 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check existing user
    const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle(); // ✅ FIX

    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword, role }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "User registered successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🔹 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      data: {
        token,
        role: user.role,
        name: user.name
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🔹 GET PROFILE
export const getMe = async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", req.user.id)
      .single();

    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};