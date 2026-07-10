import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getApprovedDrawings(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('drawings')
    .select('*')
    .eq('is_flagged', false)
    .eq('reviewed', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
    .throwOnError()

  if (error) {
    console.error('Error fetching drawings:', error)
    return []
  }

  return data || []
}
