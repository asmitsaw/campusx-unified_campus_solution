import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("SUPABASE_URL:", supabaseUrl); // debug

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;