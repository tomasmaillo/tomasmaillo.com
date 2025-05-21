import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadDrawing(imageData: string) {
  try {
    // Convert base64 to blob
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const blob = Buffer.from(base64Data, 'base64')

    // Generate a unique filename
    const filename = `drawing-${Date.now()}.png`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('drawings')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: false,
      })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('drawings').getPublicUrl(filename)

    return { publicUrl, filename }
  } catch (error) {
    console.error('Error uploading drawing:', error)
    throw error
  }
}

export async function saveDrawingToDatabase(
  imageUrl: string,
  isFlagged: boolean = false
) {
  try {
    const { data, error } = await supabase
      .from('drawings')
      .insert([
        {
          image_url: imageUrl,
          is_flagged: isFlagged,
          reviewed: false,
          moderation_result: null,
        },
      ])
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error('Error saving drawing to database:', error)
    throw error
  }
}

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
