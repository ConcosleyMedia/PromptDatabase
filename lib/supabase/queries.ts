import { createSupabaseClient } from './client'
import type {
  Prompt,
  PromptInsert,
  Category,
  SearchPromptResult,
  SavedPromptWithDetails,
  PromptFilters
} from '@/types'

// Prompt queries
export const getPrompts = async (filters: PromptFilters = {}, page = 0, limit = 20) => {
  const supabase = createSupabaseClient()

  const offset = page * limit

  const { data, error } = await (supabase as any).rpc('search_prompts', {
    search_query: filters.search || null,
    prompt_type_filter: filters.type || null,
    category_filter: filters.category || null,
    platform_filter: filters.platform || null,
    tags_filter: filters.tags || null,
    sort_by: 'created_at',
    sort_order: 'desc',
    limit_count: limit,
    offset_count: offset
  })

  if (error) throw error

  return data as SearchPromptResult[]
}

export const getPromptById = async (id: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error) throw error

  return data as Prompt
}

export const getUserVote = async (promptId: string, userId: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('prompt_votes')
    .select('vote_type')
    .eq('prompt_id', promptId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error

  return (data as any)?.vote_type || null
}

export const isPromptSaved = async (promptId: string, userId: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('saved_prompts')
    .select('id')
    .eq('prompt_id', promptId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error

  return !!data
}

export const getSavedPrompts = async (userId: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await (supabase as any).rpc('get_user_saved_prompts', {
    user_uuid: userId
  })

  if (error) throw error

  return data as SavedPromptWithDetails[]
}

// Category queries
export const getCategories = async () => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) throw error

  return data as Category[]
}

// Analytics queries
export const getPopularPrompts = async (limit = 10) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('prompts')
    .select('id, title, vote_count, view_count, save_count, category, type')
    .eq('status', 'published')
    .order('vote_count', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data
}

export const getTrendingPrompts = async (limit = 10) => {
  const supabase = createSupabaseClient()

  // Get prompts created in the last 7 days, sorted by engagement
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('prompts')
    .select('id, title, vote_count, view_count, save_count, category, type, created_at')
    .eq('status', 'published')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data
}

// Search suggestions
export const getSearchSuggestions = async (query: string, limit = 5) => {
  const supabase = createSupabaseClient()

  if (query.length < 2) return []

  const { data, error } = await supabase
    .from('prompts')
    .select('title')
    .eq('status', 'published')
    .textSearch('title', query, { type: 'websearch' })
    .limit(limit)

  if (error) throw error

  return (data as any).map((p: any) => p.title)
}

// User statistics
export const getUserStats = async (userId: string) => {
  const supabase = createSupabaseClient()

  const [savedPrompts, votes, views] = await Promise.all([
    supabase
      .from('saved_prompts')
      .select('id')
      .eq('user_id', userId),

    supabase
      .from('prompt_votes')
      .select('id')
      .eq('user_id', userId),

    supabase
      .from('prompt_views')
      .select('id')
      .eq('user_id', userId)
  ])

  return {
    savedCount: savedPrompts.data?.length || 0,
    votesCount: votes.data?.length || 0,
    viewsCount: views.data?.length || 0
  }
}