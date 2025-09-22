"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ImageIcon, VideoIcon, LinkIcon, X, Upload, Loader2 } from "lucide-react"

interface SlashCommand {
  trigger: string
  label: string
  icon: React.ReactNode
  description: string
  action: (editor: HTMLTextAreaElement, position: number) => void
}

interface EnhancedMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export function EnhancedMarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 10,
  className,
}: EnhancedMarkdownEditorProps) {
  const [showCommands, setShowCommands] = useState(false)
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showMediaDialog, setShowMediaDialog] = useState<string | null>(null)
  const [mediaUrl, setMediaUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertAtCursor = (text: string, replacementLength = 0) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = cursorPosition - replacementLength
    const end = cursorPosition
    const newValue = value.substring(0, start) + text + value.substring(end)

    onChange(newValue)
    setShowCommands(false)
    setShowMediaDialog(null)

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + text.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      // Insert the uploaded file into the markdown
      let embedCode = ""
      const searchLength = searchTerm.length + 1 // +1 for the slash

      if (file.type.startsWith("image/")) {
        embedCode = `![${result.filename}](${result.url})\n\n`
      } else if (file.type.startsWith("video/")) {
        embedCode = `<video controls width="560" height="315">\n  <source src="${result.url}" type="${file.type}">\n  Your browser does not support the video tag.\n</video>\n\n`
      } else {
        // For other file types, create a download link
        embedCode = `[📎 ${result.filename}](${result.url})\n\n`
      }

      insertAtCursor(embedCode, searchLength)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const slashCommands: SlashCommand[] = [
    {
      trigger: "/upload",
      label: "Upload File",
      icon: <Upload className="h-4 w-4" />,
      description: "Upload an image, video, or document",
      action: () => {
        fileInputRef.current?.click()
      },
    },
    {
      trigger: "/image",
      label: "Image URL",
      icon: <ImageIcon className="h-4 w-4" />,
      description: "Embed an image from URL",
      action: () => {
        setShowMediaDialog("image")
        setMediaUrl("")
      },
    },
    {
      trigger: "/video",
      label: "Video URL",
      icon: <VideoIcon className="h-4 w-4" />,
      description: "Embed a video (YouTube, Vimeo, etc.)",
      action: () => {
        setShowMediaDialog("video")
        setMediaUrl("")
      },
    },
    {
      trigger: "/link",
      label: "Link",
      icon: <LinkIcon className="h-4 w-4" />,
      description: "Insert a link",
      action: () => {
        const linkText = "[Link text](https://example.com)"
        insertAtCursor(linkText, searchTerm.length + 1) // +1 for the slash
      },
    },
  ]

  const filteredCommands = slashCommands.filter(
    (cmd) =>
      cmd.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommands) {
      if (e.key === "Escape") {
        setShowCommands(false)
        return
      }
      if (e.key === "Enter" && filteredCommands.length > 0) {
        e.preventDefault()
        filteredCommands[0].action(e.currentTarget, cursorPosition)
        return
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart

    onChange(newValue)
    setCursorPosition(cursorPos)

    // Check for slash command
    const textBeforeCursor = newValue.substring(0, cursorPos)
    const lastSlashIndex = textBeforeCursor.lastIndexOf("/")

    if (lastSlashIndex !== -1) {
      const textAfterSlash = textBeforeCursor.substring(lastSlashIndex)
      const hasSpaceAfterSlash = textAfterSlash.includes(" ")

      if (!hasSpaceAfterSlash && textAfterSlash.length <= 10) {
        setSearchTerm(textAfterSlash.substring(1)) // Remove the slash
        setShowCommands(true)

        // Calculate position for command menu
        const textarea = e.target
        const rect = textarea.getBoundingClientRect()
        const lineHeight = 20 // Approximate line height
        const lines = textBeforeCursor.split("\n")
        const currentLine = lines.length - 1
        const currentColumn = lines[lines.length - 1].length

        setCommandPosition({
          top: rect.top + currentLine * lineHeight + 25,
          left: rect.left + currentColumn * 8, // Approximate character width
        })
      } else {
        setShowCommands(false)
      }
    } else {
      setShowCommands(false)
    }
  }

  const handleMediaSubmit = () => {
    if (!mediaUrl.trim()) return

    let embedCode = ""
    const searchLength = searchTerm.length + 1 // +1 for the slash

    if (showMediaDialog === "image") {
      embedCode = `![Image](${mediaUrl})\n\n`
    } else if (showMediaDialog === "video") {
      // Handle different video platforms
      if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
        const videoId = extractYouTubeId(mediaUrl)
        embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n\n`
      } else if (mediaUrl.includes("vimeo.com")) {
        const videoId = extractVimeoId(mediaUrl)
        embedCode = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>\n\n`
      } else {
        // Generic video embed
        embedCode = `<video controls width="560" height="315">\n  <source src="${mediaUrl}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n\n`
      }
    }

    insertAtCursor(embedCode, searchLength)
  }

  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : ""
  }

  const extractVimeoId = (url: string): string => {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : ""
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleFileUpload(file)
          }
        }}
      />

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`font-mono text-sm ${className}`}
      />

      {/* Slash Commands Menu */}
      {showCommands && (
        <Card
          className="absolute z-50 p-2 min-w-64 shadow-lg border"
          style={{
            top: commandPosition.top,
            left: commandPosition.left,
          }}
        >
          <div className="text-xs text-muted-foreground mb-2 px-2">Type to search commands...</div>
          {filteredCommands.map((command) => (
            <Button
              key={command.trigger}
              variant="ghost"
              className="w-full justify-start h-auto p-2 text-left"
              onClick={() => command.action(textareaRef.current!, cursorPosition)}
            >
              <div className="flex items-center gap-3">
                {command.icon}
                <div>
                  <div className="font-medium text-sm">{command.label}</div>
                  <div className="text-xs text-muted-foreground">{command.description}</div>
                </div>
              </div>
            </Button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="text-sm text-muted-foreground p-2">No commands found for "{searchTerm}"</div>
          )}
        </Card>
      )}

      {/* Upload progress indicator */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="flex items-center gap-2 bg-background border rounded-lg p-4 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Uploading file...</span>
          </div>
        </div>
      )}

      {/* Media URL Dialog */}
      {showMediaDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{showMediaDialog === "image" ? "Add Image" : "Add Video"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMediaDialog(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Upload error display */}
              {uploadError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">{uploadError}</div>}

              <div>
                <label className="block text-sm font-medium mb-2">Upload File</label>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose {showMediaDialog === "image" ? "Image" : "Video"} File
                    </>
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {showMediaDialog === "image" ? "Image URL" : "Video URL"}
                </label>
                <Input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={
                    showMediaDialog === "image" ? "https://example.com/image.jpg" : "https://youtube.com/watch?v=..."
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleMediaSubmit()}
                />
              </div>

              {showMediaDialog === "video" && (
                <div className="text-xs text-muted-foreground">Supports YouTube, Vimeo, and direct video file URLs</div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleMediaSubmit} className="flex-1">
                  Insert {showMediaDialog === "image" ? "Image" : "Video"}
                </Button>
                <Button variant="outline" onClick={() => setShowMediaDialog(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
