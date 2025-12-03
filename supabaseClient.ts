import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'COLE_SUA_URL_DO_SUPABASE_AQUI'
const supabaseKey = 'COLE_SUA_CHAVE_ANON_PUBLIC_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)
