import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createSupabaseServerClient()

  // Extract query parameters
  const search = searchParams.get('search')
  const type = searchParams.get('type') as 'text' | 'image' | 'video' | null
  const category = searchParams.get('category')
  const platform = searchParams.get('platform')
  const tags = searchParams.get('tags')?.split(',').filter(Boolean)
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    // Use the search function from database
    const { data, error } = await (supabase as any).rpc('search_prompts', {
      search_query: search,
      prompt_type_filter: type,
      category_filter: category,
      platform_filter: platform,
      tags_filter: tags,
      sort_by: sortBy,
      sort_order: sortOrder,
      limit_count: limit,
      offset_count: offset
    })

    if (error) {
      console.error('Prompts search error:', error)
      return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
    }

    return NextResponse.json({
      prompts: data,
      pagination: {
        limit,
        offset,
        hasMore: data.length === limit
      }
    })
  } catch (error) {
    console.error('Unexpected prompts error:', error)
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

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!(userProfile as any)?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, description, type, category, tags, platform, style, image_url } = body

    const { data, error } = await (supabase as any)
      .from('prompts')
      .insert({
        title,
        content,
        description,
        type: type || 'text',
        category,
        tags: tags || [],
        platform,
        style,
        image_url,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Create prompt error:', error)
      return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 })
    }

    return NextResponse.json({ prompt: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected create prompt error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}