import { createClient } from '@supabase/supabase-js';

// No Vercel, estas variáveis de ambiente devem ser configuradas nas Settings do projeto.
// Localmente, você pode criar um arquivo .env.local com VITE_SUPABASE_URL=... etc.
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
