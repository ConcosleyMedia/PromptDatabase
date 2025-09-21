import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { promptId, voteType } = body

    if (!promptId || !voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    // Check if prompt exists
    const { data: prompt } = await supabase
      .from('prompts')
      .select('id')
      .eq('id', promptId)
      .eq('status', 'published')
      .single()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Upsert vote (update if exists, insert if not)
    const { data, error } = await (supabase as any)
      .from('prompt_votes')
      .upsert({
        user_id: user.id,
        prompt_id: promptId,
        vote_type: voteType,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,prompt_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Vote error:', error)
      return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
    }

    return NextResponse.json({ vote: data })
  } catch (error) {
    console.error('Unexpected vote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const promptId = searchParams.get('promptId')

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 })
    }

    const { error } = await supabase
      .from('prompt_votes')
      .delete()
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)

    if (error) {
      console.error('Delete vote error:', error)
      return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected delete vote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}