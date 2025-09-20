'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bookmark,
  Search,
  Filter,
  FileText,
  Image,
  Video,
  Trash2,
  Copy,
  FolderOpen
} from 'lucide-react'
import { toast } from 'sonner'
import { createSupabaseClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { SavedPromptWithDetails, User } from '@/types'

export default function SavedPromptsPage() {
  const [savedPrompts, setSavedPrompts] = useState<SavedPromptWithDetails[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [folderFilter, setFolderFilter] = useState<string>('')

  const supabase = createSupabaseClient()

  useEffect(() => {
    loadSavedPrompts()
  }, [])

  const loadSavedPrompts = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (!currentUser) {
        setIsLoading(false)
        return
      }

      // Get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      setUser(userProfile)

      // Get saved prompts
      const { data, error } = await supabase.rpc('get_user_saved_prompts', {
        user_uuid: currentUser.id
      })

      if (error) {
        throw error
      }

      setSavedPrompts(data || [])
    } catch (error) {
      console.error('Error loading saved prompts:', error)
      toast.error('Failed to load saved prompts')
    } finally {
      setIsLoading(false)
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

      setSavedPrompts(prev => prev.filter(p => p.prompt_id !== promptId))
      toast.success('Prompt removed from saved')
    } catch (error) {
      console.error('Unsave error:', error)
      toast.error('Failed to unsave prompt')
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Prompt copied to clipboard!')
    } catch (error) {
      console.error('Copy error:', error)
      toast.error('Failed to copy prompt')
    }
  }

  // Filter saved prompts
  const filteredPrompts = savedPrompts.filter(prompt => {
    const matchesSearch = !searchQuery ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = !typeFilter || prompt.type === typeFilter
    const matchesFolder = !folderFilter || prompt.folder_name === folderFilter

    return matchesSearch && matchesType && matchesFolder
  })

  // Get unique folders
  const folders = [...new Set(savedPrompts.map(p => p.folder_name))]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return FileText
      case 'image': return Image
      case 'video': return Video
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'text-blue-600'
      case 'image': return 'text-purple-600'
      case 'video': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sign in to view saved prompts</h3>
        <p className="text-muted-foreground">
          Save your favorite prompts to access them anytime
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Prompts</h1>
          <p className="text-muted-foreground">
            Your collection of saved prompts, organized and ready to use
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Bookmark className="h-3 w-3" />
            <span>{savedPrompts.length} saved</span>
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search saved prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>

        <Select value={folderFilter} onValueChange={setFolderFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Folders</SelectItem>
            {folders.map((folder) => (
              <SelectItem key={folder} value={folder}>
                {folder}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['all', 'text', 'image', 'video'].map((type) => {
          const count = type === 'all'
            ? savedPrompts.length
            : savedPrompts.filter(p => p.type === type).length
          const Icon = type === 'all' ? Bookmark : getTypeIcon(type)

          return (
            <div key={type} className="flex items-center space-x-2 p-4 rounded-lg border">
              <Icon className={cn("h-5 w-5", type === 'all' ? 'text-gray-600' : getTypeColor(type))} />
              <div>
                <p className="text-sm text-muted-foreground capitalize">
                  {type} prompts
                </p>
                <p className="font-medium">{count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Saved Prompts */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          {savedPrompts.length === 0 ? (
            <>
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved prompts yet</h3>
              <p className="text-muted-foreground mb-4">
                Start saving prompts you like to build your collection
              </p>
              <Button asChild>
                <a href="/dashboard/prompts">Browse Prompts</a>
              </Button>
            </>
          ) : (
            <>
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No prompts match your filters</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => {
            const TypeIcon = getTypeIcon(prompt.type)

            return (
              <Card key={prompt.prompt_id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {prompt.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {prompt.type}
                        </Badge>
                        {prompt.category && (
                          <Badge variant="secondary" className="text-xs">
                            {prompt.category}
                          </Badge>
                        )}
                        {prompt.platform && (
                          <Badge variant="outline" className="text-xs">
                            {prompt.platform}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Prompt Content Preview */}
                    <div className="text-sm text-muted-foreground line-clamp-3">
                      {prompt.content}
                    </div>

                    {/* Tags */}
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{prompt.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Folder and Notes */}
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {prompt.folder_name}
                      </div>
                      {prompt.notes && (
                        <div className="text-xs text-muted-foreground italic">
                          "{prompt.notes}"
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-muted-foreground">
                        Saved {new Date(prompt.saved_at).toLocaleDateString()}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(prompt.content)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnsave(prompt.prompt_id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}