"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Save, X, Upload, Trash2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { VideoEmbed } from "@/components/video-embed"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Course } from "@/types/course"
import { EnhancedMarkdownEditor } from "@/components/enhanced-markdown-editor"
import { AdminLogin } from "@/components/admin-login"
import { useAdmin } from "@/contexts/admin-context"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { isAdmin, login } = useAdmin()
  const [course, setCourse] = useState<Course | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadCourse() {
      try {
        const courseId = params.id as string
        console.log("[v0] Loading course with ID:", courseId)

        const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single()

        if (error) {
          console.log("[v0] Supabase error:", error)
          setLoading(false)
          return
        }

        console.log("[v0] Successfully loaded course from Supabase")
        const transformedCourse: Course = {
          id: data.id, // Keep UUID as string
          title: data.title,
          description: data.description || "",
          icon: data.icon || "📚",
          content: data.content || "",
          videoUrl: data.video_url || "",
          category: data.tags?.[0] || "General",
          tags: data.tags || ["General"],
          thumbnailUrl: data.thumbnail_url || undefined,
        }

        setCourse(transformedCourse)
        setEditData(transformedCourse)
      } catch (error) {
        console.log("[v0] Catch block error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [params.id, supabase])

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editData) return

    setIsUploadingThumbnail(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-thumbnail", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()

      setEditData((prev) =>
        prev
          ? {
              ...prev,
              thumbnailUrl: url,
            }
          : null,
      )
    } catch (error) {
      console.error("Error uploading thumbnail:", error)
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleRemoveThumbnail = () => {
    setEditData((prev) =>
      prev
        ? {
            ...prev,
            thumbnailUrl: undefined,
          }
        : null,
    )
  }

  const handleSave = async () => {
    if (!editData) return

    try {
      const { error } = await supabase
        .from("courses")
        .update({
          title: editData.title,
          description: editData.description,
          content: editData.content,
          icon: editData.icon,
          tags: editData.tags,
          video_url: editData.videoUrl,
          thumbnail_url: editData.thumbnailUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editData.id)

      if (error) {
        console.error("Error updating course:", error)
        return
      }

      setCourse(editData)
      setIsEditing(false)

      console.log("[v0] Course updated successfully")

      router.push("/")
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  const handleCancel = () => {
    setEditData(course)
    setIsEditing(false)
  }

  const handleAdminLogin = (adminStatus: boolean) => {
    if (adminStatus) {
      login()
      setIsEditing(true)
    }
    setShowAdminLogin(false)
  }

  const handleEditClick = () => {
    if (!isAdmin) {
      setShowAdminLogin(true)
    } else {
      setIsEditing(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{course.icon}</span>
                <h1 className="text-xl font-semibold text-foreground">{course.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {isEditing && editData ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <Input
                value={editData.title}
                onChange={(e) => setEditData((prev) => (prev ? { ...prev, title: e.target.value } : null))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Thumbnail</label>
              {editData.thumbnailUrl ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={editData.thumbnailUrl || "/placeholder.svg"}
                      alt="Course thumbnail"
                      className="w-48 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveThumbnail}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isUploadingThumbnail}
                      className="max-w-xs"
                    />
                    {isUploadingThumbnail && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isUploadingThumbnail}
                      className="max-w-xs"
                    />
                    {isUploadingThumbnail && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Video URL</label>
              <Input
                value={editData.videoUrl}
                onChange={(e) => setEditData((prev) => (prev ? { ...prev, videoUrl: e.target.value } : null))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content (Markdown) - Type "/" for media commands
              </label>
              <EnhancedMarkdownEditor
                value={editData.content}
                onChange={(content) => setEditData((prev) => (prev ? { ...prev, content } : null))}
                rows={20}
                placeholder="Course content (Markdown supported)&#10;&#10;Try typing / to insert images and videos!"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {course.thumbnailUrl && (
              <div className="mb-6">
                <img
                  src={course.thumbnailUrl || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full max-w-2xl h-64 object-cover rounded-lg border"
                />
              </div>
            )}

            <div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map((tag) => (
                  <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {course.videoUrl && (
              <div className="mb-8">
                <VideoEmbed url={course.videoUrl} />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={course.content} />
            </div>
          </div>
        )}
      </main>

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />
    </div>
  )
}
