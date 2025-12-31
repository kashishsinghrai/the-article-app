import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error("FATAL: Supabase Key missing. Identity services will be unavailable.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);