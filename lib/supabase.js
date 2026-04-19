import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — used for reading listings (respects Row Level Security)
export function createPublicClient() {
  return createSupabaseClient(url, anonKey);
}

// Admin client — bypasses RLS, used only in Server Actions
export function createAdminClient() {
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
