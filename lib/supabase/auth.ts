import { createSupabaseClient } from './client'

export const signInWithWhop = async () => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'whop' as any,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  if (error) {
    throw error
  }

  return data
}

export const signOut = async () => {
  const supabase = createSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}

export const getUserProfile = async (userId: string) => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const updateUserProfile = async (userId: string, updates: {
  username?: string
  display_name?: string
  avatar_url?: string
}) => {
  const supabase = createSupabaseClient()
  const { data, error } = await (supabase as any)
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}