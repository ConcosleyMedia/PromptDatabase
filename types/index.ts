import type { Database } from './database'

// Convenience types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PromptInsert = Database['public']['Tables']['prompts']['Insert']
export type PromptUpdate = Database['public']['Tables']['prompts']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export type PromptVote = Database['public']['Tables']['prompt_votes']['Row']
export type PromptVoteInsert = Database['public']['Tables']['prompt_votes']['Insert']

export type SavedPrompt = Database['public']['Tables']['saved_prompts']['Row']
export type SavedPromptInsert = Database['public']['Tables']['saved_prompts']['Insert']

export type PromptView = Database['public']['Tables']['prompt_views']['Row']
export type PromptViewInsert = Database['public']['Tables']['prompt_views']['Insert']

export type ImportBatch = Database['public']['Tables']['import_batches']['Row']
export type ImportBatchInsert = Database['public']['Tables']['import_batches']['Insert']
export type ImportBatchUpdate = Database['public']['Tables']['import_batches']['Update']

export type PromptSubmission = Database['public']['Tables']['prompt_submissions']['Row']
export type PromptSubmissionInsert = Database['public']['Tables']['prompt_submissions']['Insert']

export type ApiUsage = Database['public']['Tables']['api_usage']['Row']
export type ApiUsageInsert = Database['public']['Tables']['api_usage']['Insert']

// Search result type
export type SearchPromptResult = {
  id: string
  title: string
  content: string
  description: string | null
  type: Database['public']['Enums']['prompt_type']
  category: string | null
  tags: string[]
  platform: string | null
  style: string | null
  image_url: string | null
  view_count: number
  vote_count: number
  save_count: number
  created_at: string
  relevance: number
}

// Saved prompt with details
export type SavedPromptWithDetails = {
  prompt_id: string
  title: string
  content: string
  type: Database['public']['Enums']['prompt_type']
  category: string | null
  tags: string[]
  platform: string | null
  saved_at: string
  folder_name: string
  notes: string | null
}

// Filter and search types
export type PromptFilters = {
  type?: Database['public']['Enums']['prompt_type']
  category?: string
  platform?: string
  tags?: string[]
  search?: string
}

export type SortOption = {
  field: 'created_at' | 'vote_count' | 'view_count' | 'relevance'
  order: 'asc' | 'desc'
}

// CSV import types
export type CSVPromptRow = {
  title: string
  prompt_content: string
  category?: string
  tags?: string
  platform?: string
  style?: string
  description?: string
  image_url?: string
}

export type ImportError = {
  row: number
  field?: string
  message: string
  data?: any
}

// UI State types
export type TabValue = 'prompts' | 'images' | 'videos' | 'test' | 'rooms'

export type ViewMode = 'grid' | 'list'

export type ModalState = {
  isOpen: boolean
  promptId?: string
  data?: any
}

// Re-export database types
export * from './database'