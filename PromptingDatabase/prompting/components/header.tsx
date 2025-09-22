"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, X, Shield, ShieldOff } from "lucide-react"
import { AddCourseModal } from "@/components/add-course-modal"
import type { Course } from "@/types/course"

interface HeaderProps {
  onAddCourse?: (course: Omit<Course, "id">) => void
  onSearch?: (searchTerm: string) => void
  onFilter?: (category: string) => void
  categories?: string[]
  isAdmin?: boolean
  onAdminLogin?: () => void
  onAdminLogout?: () => void
}

export function Header({
  onAddCourse,
  onSearch,
  onFilter,
  categories = [],
  isAdmin = false,
  onAdminLogin,
  onAdminLogout,
}: HeaderProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleAddCourse = (course: Omit<Course, "id">) => {
    console.log("[v0] Header received course to add:", course)
    onAddCourse?.(course)
    setShowAddModal(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleFilterChange = (value: string) => {
    setSelectedCategory(value)
    onFilter?.(value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearch?.("")
    setShowSearch(false)
  }

  const clearFilter = () => {
    setSelectedCategory("all")
    onFilter?.("all")
    setShowFilter(false)
  }

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AF</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">AutomationFlowDB</h1>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>•</span>
                <span>Comprehensive AI Database</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">
                    <Shield className="h-3 w-3" />
                    Admin
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAdminLogout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ShieldOff className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAdminLogin}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}

              {showSearch ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-64"
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={clearSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              )}

              {showFilter ? (
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={clearFilter}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => setShowFilter(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              )}

              {isAdmin && (
                <Button size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAddModal && isAdmin && <AddCourseModal onClose={() => setShowAddModal(false)} onAdd={handleAddCourse} />}
    </>
  )
}
