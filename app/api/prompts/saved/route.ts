import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase.rpc('get_user_saved_prompts', {
      user_uuid: user.id
    })

    if (error) {
      console.error('Fetch saved prompts error:', error)
      return NextResponse.json({ error: 'Failed to fetch saved prompts' }, { status: 500 })
    }

    return NextResponse.json({ savedPrompts: data })
  } catch (error) {
    console.error('Unexpected saved prompts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { promptId, folder_name = 'general', notes } = body

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 })
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

    const { data, error } = await supabase
      .from('saved_prompts')
      .insert({
        user_id: user.id,
        prompt_id: promptId,
        folder_name,
        notes
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Prompt already saved' }, { status: 409 })
      }
      console.error('Save prompt error:', error)
      return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 })
    }

    return NextResponse.json({ savedPrompt: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected save prompt error:', error)
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
      .from('saved_prompts')
      .delete()
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)

    if (error) {
      console.error('Unsave prompt error:', error)
      return NextResponse.json({ error: 'Failed to unsave prompt' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected unsave prompt error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}