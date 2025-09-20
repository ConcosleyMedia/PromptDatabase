import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export const createSupabaseServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

export const getUser = async () => {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getUserProfile = async (userId: string) => {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}