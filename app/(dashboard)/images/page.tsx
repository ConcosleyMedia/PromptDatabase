'use client'

import { useState, useEffect } from 'react'
import { PromptCard } from '@/components/prompts/prompt-card'
import { PromptFilters } from '@/components/prompts/prompt-filters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Image, Palette, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { getCategories } from '@/lib/supabase/queries'
import { createSupabaseClient } from '@/lib/supabase/client'
import type {
  SearchPromptResult,
  PromptFilters as PromptFiltersType,
  Category,
  User
} from '@/types'

export default function ImagePromptsPage() {
  const [prompts, setPrompts] = useState<SearchPromptResult[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<PromptFiltersType>({ type: 'image' })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({})
  const [savedPrompts, setSavedPrompts] = useState<Set<string>>(new Set())

  const supabase = createSupabaseClient()

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load prompts when filters change
  useEffect(() => {
    setPage(0)
    setPrompts([])
    setHasMore(true)
    loadPrompts(0, filters)
  }, [filters])

  const loadInitialData = async () => {
    try {
      const [categoriesData, { data: { user: currentUser } }] = await Promise.all([
        getCategories(),
        supabase.auth.getUser()
      ])

      setCategories(categoriesData)

      if (currentUser) {
        // Get user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        setUser(userProfile)

        // Load user's votes and saved prompts
        if (userProfile) {
          await loadUserData(userProfile.id)
        }
      }

      await loadPrompts(0, { type: 'image' })
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load data')
    }
  }

  const loadUserData = async (userId: string) => {
    try {
      const [votesData, savedData] = await Promise.all([
        supabase
          .from('prompt_votes')
          .select('prompt_id, vote_type')
          .eq('user_id', userId),

        supabase
          .from('saved_prompts')
          .select('prompt_id')
          .eq('user_id', userId)
      ])

      if (votesData.data) {
        const votes: Record<string, 'up' | 'down'> = {}
        votesData.data.forEach(vote => {
          votes[vote.prompt_id] = vote.vote_type as 'up' | 'down'
        })
        setUserVotes(votes)
      }

      if (savedData.data) {
        setSavedPrompts(new Set(savedData.data.map(s => s.prompt_id)))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const loadPrompts = async (pageNum: number, currentFilters: PromptFiltersType) => {
    try {
      if (pageNum === 0) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const response = await fetch(`/api/prompts?${new URLSearchParams({
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.type && { type: currentFilters.type }),
        ...(currentFilters.category && { category: currentFilters.category }),
        ...(currentFilters.platform && { platform: currentFilters.platform }),
        ...(currentFilters.tags && { tags: currentFilters.tags.join(',') }),
        limit: '20',
        offset: (pageNum * 20).toString()
      })}`)

      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }

      const data = await response.json()

      if (pageNum === 0) {
        setPrompts(data.prompts)
      } else {
        setPrompts(prev => [...prev, ...data.prompts])
      }

      setHasMore(data.pagination.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading prompts:', error)
      toast.error('Failed to load prompts')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }))
  }

  const handleVote = async (promptId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote')
      return
    }

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, voteType })
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      // Update local state
      setUserVotes(prev => ({ ...prev, [promptId]: voteType }))

      // Update prompt vote count
      setPrompts(prev => prev.map(prompt => {
        if (prompt.id === promptId) {
          const currentVote = userVotes[promptId]
          let newVoteCount = prompt.vote_count

          // Remove previous vote effect
          if (currentVote === 'up') newVoteCount -= 1
          else if (currentVote === 'down') newVoteCount += 1

          // Add new vote effect
          if (voteType === 'up') newVoteCount += 1
          else if (voteType === 'down') newVoteCount -= 1

          return { ...prompt, vote_count: newVoteCount }
        }
        return prompt
      }))

      toast.success('Vote recorded!')
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to vote')
    }
  }

  const handleSave = async (promptId: string) => {
    if (!user) {
      toast.error('Please sign in to save prompts')
      return
    }

    try {
      const response = await fetch('/api/prompts/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId })
      })

      if (!response.ok) {
        throw new Error('Failed to save prompt')
      }

      setSavedPrompts(prev => new Set([...prev, promptId]))
      toast.success('Prompt saved!')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save prompt')
    }
  }

  const handleUnsave = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompts/saved?promptId=${promptId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to unsave prompt')
      }

      setSavedPrompts(prev => {
        const newSet = new Set(prev)
        newSet.delete(promptId)
        return newSet
      })
      toast.success('Prompt removed from saved')
    } catch (error) {
      console.error('Unsave error:', error)
      toast.error('Failed to unsave prompt')
    }
  }

  const imagePlatforms = ['midjourney', 'dall-e', 'stable-diffusion', 'leonardo', 'firefly']
  const platformStats = imagePlatforms.map(platform => ({
    name: platform,
    count: prompts.filter(p => p.platform === platform).length
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Image Prompts</h1>
          <p className="text-muted-foreground">
            Creative prompts for Midjourney, DALL-E, Stable Diffusion, and more
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Image className="h-3 w-3" />
            <span>{prompts.length} prompts</span>
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <PromptFilters
        filters={filters}
        categories={categories}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
      />

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {imagePlatforms.map((platform) => {
          const count = prompts.filter(p => p.platform === platform).length
          return (
            <div
              key={platform}
              className="flex items-center space-x-2 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setFilters(prev => ({ ...prev, platform }))}
            >
              <Palette className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium capitalize">{platform}</p>
                <p className="text-sm text-muted-foreground">{count} prompts</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Featured Styles */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          Popular Styles
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'photorealistic', 'anime', 'cyberpunk', 'watercolor', 'oil painting',
            'minimalist', 'vintage', 'neon', 'abstract', 'steampunk'
          ].map((style) => (
            <Badge
              key={style}
              variant="secondary"
              className="cursor-pointer hover:bg-purple-100"
              onClick={() => setFilters(prev => ({
                ...prev,
                tags: prev.tags ? [...prev.tags, style] : [style]
              }))}
            >
              {style}
            </Badge>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No image prompts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt as any}
                user={user}
                userVote={userVotes[prompt.id]}
                isSaved={savedPrompts.has(prompt.id)}
                onVote={handleVote}
                onSave={handleSave}
                onUnsave={handleUnsave}
                className="group hover:shadow-xl transition-all duration-300"
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={() => loadPrompts(page + 1, filters)}
                disabled={isLoadingMore}
                variant="outline"
                size="lg"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}