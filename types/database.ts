export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PromptType = 'text' | 'image' | 'video'
export type PromptStatus = 'draft' | 'published' | 'archived'
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type VoteType = 'up' | 'down'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          whop_user_id: string | null
          username: string | null
          email: string | null
          display_name: string | null
          avatar_url: string | null
          is_admin: boolean
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          whop_user_id?: string | null
          username?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string | null
          username?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      import_batches: {
        Row: {
          id: string
          filename: string
          imported_by: string | null
          prompt_count: number
          success_count: number
          error_count: number
          status: ImportStatus
          error_log: Json
          metadata: Json
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          filename: string
          imported_by?: string | null
          prompt_count?: number
          success_count?: number
          error_count?: number
          status?: ImportStatus
          error_log?: Json
          metadata?: Json
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          filename?: string
          imported_by?: string | null
          prompt_count?: number
          success_count?: number
          error_count?: number
          status?: ImportStatus
          error_log?: Json
          metadata?: Json
          created_at?: string
          completed_at?: string | null
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          content: string
          description: string | null
          type: PromptType
          status: PromptStatus
          category: string | null
          tags: string[]
          platform: string | null
          style: string | null
          model_version: string | null
          image_url: string | null
          example_output_url: string | null
          parameters: Json
          metadata: Json
          view_count: number
          vote_count: number
          save_count: number
          created_by: string | null
          import_batch_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          description?: string | null
          type?: PromptType
          status?: PromptStatus
          category?: string | null
          tags?: string[]
          platform?: string | null
          style?: string | null
          model_version?: string | null
          image_url?: string | null
          example_output_url?: string | null
          parameters?: Json
          metadata?: Json
          view_count?: number
          vote_count?: number
          save_count?: number
          created_by?: string | null
          import_batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          description?: string | null
          type?: PromptType
          status?: PromptStatus
          category?: string | null
          tags?: string[]
          platform?: string | null
          style?: string | null
          model_version?: string | null
          image_url?: string | null
          example_output_url?: string | null
          parameters?: Json
          metadata?: Json
          view_count?: number
          vote_count?: number
          save_count?: number
          created_by?: string | null
          import_batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompt_votes: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          vote_type: VoteType
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          vote_type: VoteType
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          vote_type?: VoteType
          created_at?: string
          updated_at?: string
        }
      }
      saved_prompts: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          folder_name: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          folder_name?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          folder_name?: string
          notes?: string | null
          created_at?: string
        }
      }
      prompt_views: {
        Row: {
          id: string
          user_id: string | null
          prompt_id: string
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          prompt_id: string
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          prompt_id?: string
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      prompt_submissions: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          type: PromptType
          category: string | null
          tags: string[]
          platform: string | null
          style: string | null
          metadata: Json
          status: SubmissionStatus
          review_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          type?: PromptType
          category?: string | null
          tags?: string[]
          platform?: string | null
          style?: string | null
          metadata?: Json
          status?: SubmissionStatus
          review_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          type?: PromptType
          category?: string | null
          tags?: string[]
          platform?: string | null
          style?: string | null
          metadata?: Json
          status?: SubmissionStatus
          review_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          prompt_id: string | null
          model_used: string
          input_tokens: number
          output_tokens: number
          credits_used: number
          response_time_ms: number | null
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id?: string | null
          model_used: string
          input_tokens?: number
          output_tokens?: number
          credits_used?: number
          response_time_ms?: number | null
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string | null
          model_used?: string
          input_tokens?: number
          output_tokens?: number
          credits_used?: number
          response_time_ms?: number | null
          error?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      increment_prompt_views: {
        Args: {
          prompt_uuid: string
          user_uuid?: string
          session_uuid?: string
          user_ip?: string
          user_agent_string?: string
        }
        Returns: undefined
      }
      search_prompts: {
        Args: {
          search_query?: string
          prompt_type_filter?: PromptType
          category_filter?: string
          platform_filter?: string
          tags_filter?: string[]
          sort_by?: string
          sort_order?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          content: string
          description: string | null
          type: PromptType
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
        }[]
      }
      get_user_saved_prompts: {
        Args: {
          user_uuid: string
        }
        Returns: {
          prompt_id: string
          title: string
          content: string
          type: PromptType
          category: string | null
          tags: string[]
          platform: string | null
          saved_at: string
          folder_name: string
          notes: string | null
        }[]
      }
    }
    Enums: {
      prompt_type: PromptType
      prompt_status: PromptStatus
      import_status: ImportStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}