"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

import type { Course } from "@/types/course"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, FileText, Trash2, Edit } from "lucide-react"

interface CourseCardProps {
  course: Course
  onClick: () => void
  onDelete: () => void
  onEdit?: () => void
  isAdmin?: boolean
}

export function CourseCard({ course, onClick, onDelete, onEdit, isAdmin = false }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [popupPosition, setPopupPosition] = useState<"left" | "center" | "right">("center")

  useEffect(() => {
    if (isHovered && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const popupWidth = 320 // w-80 = 320px

      const leftSpace = cardRect.left + cardRect.width / 2 - popupWidth / 2
      const rightSpace = viewportWidth - (cardRect.left + cardRect.width / 2 + popupWidth / 2)

      if (leftSpace < 20) {
        setPopupPosition("left")
      } else if (rightSpace < 20) {
        setPopupPosition("right")
      } else {
        setPopupPosition("center")
      }
    }
  }, [isHovered])

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      onDelete()
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit()
    }
  }

  const getPopupPositionClasses = () => {
    switch (popupPosition) {
      case "left":
        return "left-0"
      case "right":
        return "right-0"
      default:
        return "left-1/2 transform -translate-x-1/2"
    }
  }

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="course-card cursor-pointer hover:shadow-lg hover:shadow-primary/10 border-border/50 bg-card/80 backdrop-blur-sm group relative"
        onClick={onClick}
      >
        {isAdmin && (
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
              title="Edit course"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
              title="Delete course"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-muted">
            <img
              src={
                course.thumbnailUrl ||
                `/placeholder.svg?height=128&width=256&query=${encodeURIComponent(course.title + " " + course.category) || "/placeholder.svg"}`
              }
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground text-balance leading-tight mb-1">{course.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {course.category}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{course.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {course.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {course.videoUrl ? <Play className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              <span className="text-xs">View</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isHovered && !isAdmin && (
        <div className={`absolute top-0 -translate-y-2 z-50 pointer-events-none ${getPopupPositionClasses()}`}>
          <Card className="w-80 bg-background/95 backdrop-blur-md border shadow-2xl shadow-black/20 animate-in fade-in-0 zoom-in-95 duration-200">
            <CardHeader className="pb-3">
              <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
                <img
                  src={
                    course.thumbnailUrl ||
                    `/placeholder.svg?height=192&width=320&query=${encodeURIComponent(course.title + " " + course.category) || "/placeholder.svg"}`
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <h3 className="font-semibold text-foreground text-balance leading-tight text-lg">{course.title}</h3>
                  <Badge variant="secondary" className="text-sm">
                    {course.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{course.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                {course.videoUrl ? <Play className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                <span className="text-sm">Click to view course</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
