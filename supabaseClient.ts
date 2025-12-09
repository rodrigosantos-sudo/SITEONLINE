import { createClient } from '@supabase/supabase-js';

// Helper to retrieve environment variables safely in different environments (Vite, Node, etc.)
const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  return '';
};

const envUrl = getEnvVar('VITE_SUPABASE_URL');
const envKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// To prevent the "supabaseUrl is required" error during build/preview if env vars aren't set,
// we use valid-looking placeholder values. 
// The API calls will simply fail internally, and the App.tsx logic is designed to catch this
// and fall back to MOCK_PRODUCTS automatically.
const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);