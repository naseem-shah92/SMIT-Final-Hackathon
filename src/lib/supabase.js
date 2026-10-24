import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate whether real Supabase credentials are configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    })
  : null;

/**
 * Authentication Helpers
 */
export async function signInWithSupabase(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase is not configured. Falling back to local secure auth.') };
  }
  return await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });
}

export async function signOutWithSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }
  return await supabase.auth.signOut();
}

export async function getSupabaseSession() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { session: null }, error: null };
  }
  return await supabase.auth.getSession();
}

export async function fetchProfileByUserId(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}
