import { createClient } from '@supabase/supabase-js';

// Substitua estas strings pelas suas credenciais reais do painel do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'SUA_URL_DO_SUPABASE_AQUI';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_AQUI';

export const supabase = createClient(supabaseUrl, supabaseKey);
