"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface ConnectionStatus {
  supabase: boolean
  blob: boolean
  envVars: {
    supabaseUrl: boolean
    supabaseAnonKey: boolean
    blobToken: boolean
  }
  error?: string
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const checkConnections = async () => {
    console.log("[v0] Testing all connections...")

    const envVars = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      blobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    }

    console.log("[v0] Environment variables:", envVars)

    let supabaseConnected = false
    let blobConnected = false
    let error = ""

    // Test Supabase connection
    try {
      const supabase = createClient()
      const { count, error: supabaseError } = await supabase.from("courses").select("*", { count: "exact", head: true })

      if (supabaseError) {
        error += `Supabase: ${supabaseError.message}. `
        console.log("[v0] Supabase connection failed:", supabaseError.message)
      } else {
        supabaseConnected = true
        console.log("[v0] Supabase connected successfully, found", count, "courses")
      }
    } catch (err) {
      error += `Supabase connection error. `
      console.log("[v0] Supabase connection error:", err)
    }

    // Test Blob connection
    try {
      const response = await fetch("/api/upload-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })

      if (response.ok) {
        blobConnected = true
        console.log("[v0] Blob storage accessible")
      } else {
        error += `Blob storage not accessible. `
        console.log("[v0] Blob storage test failed")
      }
    } catch (err) {
      error += `Blob storage error. `
      console.log("[v0] Blob storage error:", err)
    }

    setStatus({
      supabase: supabaseConnected,
      blob: blobConnected,
      envVars,
      error: error || undefined,
    })
  }

  useEffect(() => {
    // Auto-check on mount
    checkConnections()
  }, [])

  if (!isVisible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsVisible(true)} className="fixed bottom-4 right-4 z-50">
        Check Connection
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Connection Status</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {status ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm">Supabase Database</span>
              <Badge variant={status.supabase ? "default" : "destructive"}>
                {status.supabase ? "Connected" : "Failed"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Blob Storage</span>
              <Badge variant={status.blob ? "default" : "destructive"}>{status.blob ? "Connected" : "Failed"}</Badge>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium">Environment Variables:</div>
              <div className="flex items-center justify-between text-xs">
                <span>SUPABASE_URL</span>
                <Badge variant={status.envVars.supabaseUrl ? "default" : "destructive"} className="text-xs">
                  {status.envVars.supabaseUrl ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>SUPABASE_ANON_KEY</span>
                <Badge variant={status.envVars.supabaseAnonKey ? "default" : "destructive"} className="text-xs">
                  {status.envVars.supabaseAnonKey ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>BLOB_TOKEN</span>
                <Badge variant={status.envVars.blobToken ? "default" : "destructive"} className="text-xs">
                  {status.envVars.blobToken ? "Set" : "Missing"}
                </Badge>
              </div>
            </div>

            {status.error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{status.error}</div>}
          </>
        ) : (
          <div className="text-sm text-gray-500">Testing connections...</div>
        )}

        <Button onClick={checkConnections} size="sm" className="w-full" disabled={!status}>
          Recheck
        </Button>
      </CardContent>
    </Card>
  )
}
