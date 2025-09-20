import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', params.id)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
      }
      console.error('Fetch prompt error:', error)
      return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 })
    }

    // Increment view count
    const { data: { user } } = await supabase.auth.getUser()
    const userAgent = request.headers.get('user-agent')
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')

    await supabase.rpc('increment_prompt_views', {
      prompt_uuid: params.id,
      user_uuid: user?.id,
      session_uuid: request.headers.get('x-session-id'),
      user_ip: ip,
      user_agent_string: userAgent
    })

    return NextResponse.json({ prompt: data })
  } catch (error) {
    console.error('Unexpected fetch prompt error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}