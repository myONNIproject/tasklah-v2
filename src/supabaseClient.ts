
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnqrxtexlwupwenhmwjez.supabase.co'
const supabaseKey = 'sb_publishable_zv2N1KUV_jQLBqUfu1MvWw_QXf5p'

export const supabase = createClient(supabaseUrl, supabaseKey)


