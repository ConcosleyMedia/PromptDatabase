'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Heart,
  HeartOff,
  Bookmark,
  BookmarkCheck,
  Copy,
  MoreHorizontal,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Prompt, User } from '@/types'

interface PromptCardProps {
  prompt: Prompt
  user?: User | null
  userVote?: 'up' | 'down' | null
  isSaved?: boolean
  onVote?: (promptId: string, voteType: 'up' | 'down') => Promise<void>
  onSave?: (promptId: string) => Promise<void>
  onUnsave?: (promptId: string) => Promise<void>
  className?: string
}

export function PromptCard({
  prompt,
  user,
  userVote,
  isSaved,
  onVote,
  onSave,
  onUnsave,
  className
}: PromptCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user || !onVote) {
      toast.error('Please sign in to vote')
      return
    }

    try {
      setIsVoting(true)
      await onVote(prompt.id, voteType)
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to vote')
    } finally {
      setIsVoting(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save prompts')
      return
    }

    try {
      setIsSaving(true)
      if (isSaved && onUnsave) {
        await onUnsave(prompt.id)
        toast.success('Prompt removed from saved')
      } else if (onSave) {
        await onSave(prompt.id)
        toast.success('Prompt saved!')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save prompt')
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      toast.success('Prompt copied to clipboard!')
    } catch (error) {
      console.error('Copy error:', error)
      toast.error('Failed to copy prompt')
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {prompt.title}
            </CardTitle>
            {prompt.description && (
              <CardDescription className="mt-2 line-clamp-2">
                {prompt.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy prompt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
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
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Prompt Content Preview */}
          <div className="text-sm text-muted-foreground line-clamp-3">
            {prompt.content}
          </div>

          {/* Image Preview for Image Prompts */}
          {prompt.type === 'image' && prompt.image_url && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={prompt.image_url}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

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

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(prompt.view_count)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{formatNumber(prompt.vote_count)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bookmark className="h-4 w-4" />
                <span>{formatNumber(prompt.save_count)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Vote Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                disabled={isVoting || !user}
                className={cn(
                  "h-8 w-8 p-0",
                  userVote === 'up' && "text-green-600 bg-green-50"
                )}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                disabled={isVoting || !user}
                className={cn(
                  "h-8 w-8 p-0",
                  userVote === 'down' && "text-red-600 bg-red-50"
                )}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>

              {/* Save Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !user}
                className={cn(
                  "h-8 w-8 p-0",
                  isSaved && "text-blue-600 bg-blue-50"
                )}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}