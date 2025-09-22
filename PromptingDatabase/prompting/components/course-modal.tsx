"use client"

import type React from "react"

import { useState } from "react"
import type { Course } from "@/types/course"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownRenderer } from "./markdown-renderer"
import { VideoEmbed } from "./video-embed"
import { Edit, Save, X, Plus, Upload, Trash2 } from "lucide-react"
import { EnhancedMarkdownEditor } from "./enhanced-markdown-editor"
import { put } from "@vercel/blob"

interface CourseModalProps {
  course: Course
  onClose: () => void
  onUpdate: (course: Course) => void
}

export function CourseModal({ course, onClose, onUpdate }: CourseModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCourse, setEditedCourse] = useState<Course>(course)
  const [newTag, setNewTag] = useState("")
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)

  const handleSave = () => {
    onUpdate(editedCourse)
    setIsEditing(false)
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingThumbnail(true)
    try {
      const blob = await put(`thumbnails/${Date.now()}-${file.name}`, file, {
        access: "public",
      })

      setEditedCourse((prev) => ({
        ...prev,
        thumbnailUrl: blob.url,
      }))
    } catch (error) {
      console.error("Error uploading thumbnail:", error)
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleRemoveThumbnail = () => {
    setEditedCourse((prev) => ({
      ...prev,
      thumbnailUrl: undefined,
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editedCourse.tags.includes(newTag.trim())) {
      setEditedCourse((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedCourse((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{editedCourse.icon}</span>
              <div>
                {isEditing ? (
                  <Input
                    value={editedCourse.title}
                    onChange={(e) => setEditedCourse((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-semibold mb-2"
                  />
                ) : (
                  <DialogTitle className="text-xl text-balance">{editedCourse.title}</DialogTitle>
                )}
                <div className="flex gap-2 flex-wrap">
                  {editedCourse.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      {isEditing && (
                        <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <div className="flex gap-1">
                      <Input
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        className="h-6 text-xs w-20"
                      />
                      <Button size="sm" variant="ghost" onClick={handleAddTag}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-hidden">
              {isEditing ? (
                <div className="space-y-4 h-full flex flex-col">
                  <Textarea
                    placeholder="Course description"
                    value={editedCourse.description}
                    onChange={(e) => setEditedCourse((prev) => ({ ...prev, description: e.target.value }))}
                    className="resize-none"
                    rows={2}
                  />
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Content (Markdown) - Type "/" for media commands
                    </label>
                    <EnhancedMarkdownEditor
                      value={editedCourse.content}
                      onChange={(content) => setEditedCourse((prev) => ({ ...prev, content }))}
                      placeholder="Course content (Markdown supported)&#10;&#10;Try typing / to insert images and videos!"
                      className="flex-1 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2">
                  <p className="text-muted-foreground mb-6 leading-relaxed text-pretty">{editedCourse.description}</p>
                  <MarkdownRenderer content={editedCourse.content} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="video" className="flex-1 overflow-hidden">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                    value={editedCourse.videoUrl}
                    onChange={(e) => setEditedCourse((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  />
                  {editedCourse.videoUrl && <VideoEmbed url={editedCourse.videoUrl} />}
                </div>
              ) : (
                <div className="h-full">
                  {editedCourse.videoUrl ? (
                    <VideoEmbed url={editedCourse.videoUrl} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <p>No video content available</p>
                        <p className="text-sm mt-2">Click Edit to add a video URL</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="thumbnail" className="flex-1 overflow-hidden">
              <div className="space-y-4 h-full">
                {editedCourse.thumbnailUrl ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={editedCourse.thumbnailUrl || "/placeholder.svg"}
                        alt="Course thumbnail"
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                      />
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveThumbnail}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Replace Thumbnail</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          disabled={isUploadingThumbnail}
                        />
                        {isUploadingThumbnail && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p>No thumbnail uploaded</p>
                      {isEditing && (
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            disabled={isUploadingThumbnail}
                            className="max-w-xs mx-auto"
                          />
                          {isUploadingThumbnail && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
