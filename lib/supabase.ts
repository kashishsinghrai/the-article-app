import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const val = (import.meta as any).env[key];
    if (val) return val;
  }
  if (typeof process !== 'undefined' && process.env) {
    const val = process.env[key];
    if (val) return val;
  }
  return '';
};

// These are placeholders. In production, ensure these are set in your environment variables.
const DEFAULT_URL = 'https://cqkgnklumxnlvnrnbttg.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'; // Standardized prefix to avoid warnings

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || DEFAULT_KEY;

// Exporting a safe client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce'
  },
  global: {
    // Add a small timeout for global requests to prevent infinite "ghoomna" (spinning)
    fetch: (url, options) => {
      return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('Network Timeout')), 8000)
        )
      ]);
    }
  }
});

export const isAuthReady = () => {
  const isDefault = supabaseAnonKey === DEFAULT_KEY || !supabaseAnonKey.startsWith('eyJ');
  return !isDefault;
};
