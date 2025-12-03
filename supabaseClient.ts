import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kdazrscugoninpyrmnsm.supabase.co'
const supabaseKey = 'sb_publishable_DKIGoum1-9c4f2Iqj1h3jA_ve8p2fOe'

export const supabase = createClient(supabaseUrl, supabaseKey)
