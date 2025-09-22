import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting thumbnail upload")

    const formData = await request.formData()
    console.log("[v0] FormData parsed successfully")

    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] No file provided in FormData")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      console.log("[v0] BLOB_READ_WRITE_TOKEN not found")
      return NextResponse.json({ error: "Blob token not configured" }, { status: 500 })
    }

    console.log("[v0] Uploading to Blob storage...")

    const blob = await put(`thumbnails/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: token,
    })

    console.log("[v0] Upload successful:", blob.url)
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Error uploading to Blob:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
