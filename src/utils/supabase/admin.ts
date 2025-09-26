import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 管理者キー
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}