const CONFIG = {
	PORT: process.env.PORT || 3002,
	BRIGHT_DATA_URL: process.env.BRIGHT_DATA_URL!,
	SUPABASE_KEY:
		process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY!,
	SUPABASE_URL: process.env.SUPABASE_URL!,
	PLAYWRIGHT_USER_AGENT:
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
} as const;

export { CONFIG };
