import { createClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/lib/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type BucketListItem = Pick<
  Tables<'bucket_list_items'>,
  'id' | 'title'
> & {
  completed: boolean
  elo_score: number
  price: number | null
  suggested_by: string | null
  suggested_by_avatar: string | null
}

export type ApprovedDrawing = Pick<Tables<'drawings'>, 'id' | 'image_url'> & {
  author_name: string
  created_at: string
  message: string
}

export async function getBucketListItems(): Promise<BucketListItem[]> {
  const { data, error } = await supabase
    .from('bucket_list_items')
    .select('*')
    .order('elo_score', { ascending: false })

  if (error) throw error

  return (data ?? []).map((item) => ({
    ...item,
    completed: item.completed ?? false,
    elo_score: item.elo_score ?? 1500,
    price: item.price ?? null,
    suggested_by: item.suggested_by ?? null,
    suggested_by_avatar: item.suggested_by_avatar ?? null,
  }))
}

export async function getApprovedDrawings(
  limit = 10,
  offset = 0,
): Promise<ApprovedDrawing[]> {
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

  return (data ?? []).map((drawing) => ({
    id: drawing.id,
    image_url: drawing.image_url,
    author_name: drawing.author_name ?? 'anonymous',
    created_at: drawing.created_at ?? new Date(0).toISOString(),
    message: drawing.message ?? '',
  }))
}
