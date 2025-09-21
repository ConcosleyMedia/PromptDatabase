import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
}