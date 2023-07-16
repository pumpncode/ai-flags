import "std/dotenv/load";

import { createClient } from "npm:@supabase/supabase-js";

const {
	env
} = Deno;

const supabaseOptions = {
	auth: {
		autoRefreshToken: true,
		persistSession: false,
		detectSessionInUrl: true
	},
	db: {
		schema: "public"
	},
	global: {

	},
	realtime: {

	}
};

const supabase = createClient(
	env.get("SUPABASE_API_URL"),
	env.get("SUPABASE_API_SECRET"),
	supabaseOptions
);

export default supabase;
