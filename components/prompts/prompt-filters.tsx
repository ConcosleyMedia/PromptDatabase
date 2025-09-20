'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import type { PromptFilters, Category } from '@/types'

interface PromptFiltersProps {
  filters: PromptFilters
  categories: Category[]
  onFiltersChange: (filters: PromptFilters) => void
  onSearch: (query: string) => void
  className?: string
}

const platforms = [
  'chatgpt',
  'claude',
  'midjourney',
  'dall-e',
  'stable-diffusion',
  'gpt-4',
  'gemini'
]

const sortOptions = [
  { value: 'created_at', label: 'Newest' },
  { value: 'vote_count', label: 'Most Popular' },
  { value: 'view_count', label: 'Most Viewed' },
  { value: 'save_count', label: 'Most Saved' }
]

export function PromptFilters({
  filters,
  categories,
  onFiltersChange,
  onSearch,
  className
}: PromptFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const updateFilters = (newFilters: Partial<PromptFilters>) => {
    onFiltersChange({ ...filters, ...newFilters })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    onFiltersChange({})
    onSearch('')
  }

  const hasActiveFilters = !!(
    filters.type ||
    filters.category ||
    filters.platform ||
    filters.search ||
    (filters.tags && filters.tags.length > 0)
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search prompts by title, content, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </form>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type Filter */}
        <Select
          value={filters.type || ''}
          onValueChange={(value) => updateFilters({ type: value as any || undefined })}
        >
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

        {/* Category Filter */}
        <Select
          value={filters.category || ''}
          onValueChange={(value) => updateFilters({ category: value || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Platform Filter */}
        <Select
          value={filters.platform || ''}
          onValueChange={(value) => updateFilters({ platform: value || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Platforms</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-3">
              <div className="text-sm font-medium mb-2">Tags</div>
              <div className="space-y-1">
                {/* Add common tags here or fetch from API */}
                {['ui', 'ux', 'coding', 'design', 'marketing', 'writing'].map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      const newTags = checked
                        ? [...selectedTags, tag]
                        : selectedTags.filter(t => t !== tag)
                      setSelectedTags(newTags)
                      updateFilters({ tags: newTags.length > 0 ? newTags : undefined })
                    }}
                  >
                    #{tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary">
              Type: {filters.type}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ type: undefined })}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary">
              Category: {filters.category}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ category: undefined })}
              />
            </Badge>
          )}
          {filters.platform && (
            <Badge variant="secondary">
              Platform: {filters.platform}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ platform: undefined })}
              />
            </Badge>
          )}
          {filters.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary">
              #{tag}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  const newTags = filters.tags?.filter(t => t !== tag)
                  updateFilters({ tags: newTags?.length ? newTags : undefined })
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}