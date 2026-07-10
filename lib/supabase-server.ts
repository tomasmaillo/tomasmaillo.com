import 'server-only'

import { createClient } from '@supabase/supabase-js'

let serverClient: ReturnType<typeof createClient> | null = null

export function getSupabaseServerClient() {
  if (serverClient) return serverClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Supabase server credentials are not configured')
  }

  serverClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return serverClient
}
