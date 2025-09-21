import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  if (code) {
    const supabase = await createSupabaseServerClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_error`)
      }

      if (data.user) {
        // Update or create user profile
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username,
            display_name: data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
            whop_user_id: data.user.user_metadata?.whop_user_id,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Profile update error:', profileError)
        }
      }

      return NextResponse.redirect(`${origin}${redirectTo}`)
    } catch (error) {
      console.error('Unexpected auth error:', error)
      return NextResponse.redirect(`${origin}/login?error=server_error`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`)
}