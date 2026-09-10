import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ommlmutvszvpxbdzhyot.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbWxtdXR2c3p2cHhiZHpoeW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjA1OTIsImV4cCI6MjEwNDYzNjU5Mn0.GiGjfD49AFF0x4q0KE4iH6jPnUBJYT4n9zdHsPK1n7s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});