import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "../config";
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

/**
 * Supabase tables
 */
const SP = {
	redditposts: supabase.from("redditposts"),
} as const;

export { SP };
