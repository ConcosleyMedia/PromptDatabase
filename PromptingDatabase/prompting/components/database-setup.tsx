"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Database, CheckCircle, AlertCircle } from "lucide-react"

export function DatabaseSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupStatus, setSetupStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const supabase = createClient()

  const setupDatabase = async () => {
    setIsSettingUp(true)
    setSetupStatus("idle")
    setErrorMessage("")

    try {
      // Create the courses table
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql: `
          -- Create courses table for storing course data
          CREATE TABLE IF NOT EXISTS public.courses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            content TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT '📚',
            tags TEXT[] DEFAULT '{}',
            video_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Enable Row Level Security
          ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

          -- Create policies for public access
          DROP POLICY IF EXISTS "courses_select_all" ON public.courses;
          DROP POLICY IF EXISTS "courses_insert_all" ON public.courses;
          DROP POLICY IF EXISTS "courses_update_all" ON public.courses;
          DROP POLICY IF EXISTS "courses_delete_all" ON public.courses;

          CREATE POLICY "courses_select_all" ON public.courses FOR SELECT USING (true);
          CREATE POLICY "courses_insert_all" ON public.courses FOR INSERT WITH CHECK (true);
          CREATE POLICY "courses_update_all" ON public.courses FOR UPDATE USING (true);
          CREATE POLICY "courses_delete_all" ON public.courses FOR DELETE USING (true);
        `,
      })

      if (createTableError) {
        console.error("Error creating table:", createTableError)
        // Try alternative approach - direct table creation
        const { error: altError } = await supabase.from("courses").select("count").limit(1)

        if (altError && altError.code === "PGRST116") {
          // Table doesn't exist, we need to create it manually
          throw new Error("Database table needs to be created. Please run the SQL scripts manually.")
        }
      }

      // Insert sample data
      const sampleCourses = [
        {
          title: "15 AI SEO Super-prompts",
          description: "Comprehensive collection of AI-powered SEO prompts to boost your search rankings",
          content:
            "# 15 AI SEO Super-prompts\n\n## Overview\nThis collection contains 15 powerful AI prompts specifically designed for SEO optimization.\n\n## Prompts Include:\n- Keyword research automation\n- Content optimization strategies\n- Meta description generation\n- Schema markup creation\n- And much more!\n\n## How to Use\nEach prompt is designed to be used with ChatGPT, Claude, or other AI assistants to streamline your SEO workflow.",
          icon: "📊",
          tags: ["SEO", "AI", "Marketing", "Prompts"],
        },
        {
          title: "The system to charge $500 for 4 hours of work",
          description: "Learn the exact framework to command premium rates for your services",
          content:
            "# The $500/4-Hour System\n\n## Introduction\nDiscover how to position yourself as a premium service provider and charge what you're truly worth.\n\n## Key Components:\n1. **Value-Based Pricing** - Price on outcomes, not time\n2. **Premium Positioning** - How to present yourself as the expert\n3. **Client Psychology** - Understanding what drives high-value clients\n4. **Delivery Framework** - Maximizing efficiency while maintaining quality",
          icon: "💰",
          tags: ["Business", "Pricing", "Freelancing", "Strategy"],
        },
        {
          title: "Building an n8n agency",
          description: "Complete guide to starting and scaling an automation agency using n8n",
          content:
            "# Building an n8n Agency\n\n## What is n8n?\nn8n is a powerful workflow automation tool that allows you to connect different services and automate business processes.\n\n## Agency Model:\n- **Service Offerings**: What automations to offer clients\n- **Pricing Structure**: How to price automation projects\n- **Client Acquisition**: Finding businesses that need automation\n- **Delivery Process**: From consultation to implementation",
          icon: "🔧",
          tags: ["Automation", "n8n", "Agency", "Business"],
        },
      ]

      const { error: insertError } = await supabase.from("courses").insert(sampleCourses)

      if (insertError) {
        console.error("Error inserting sample data:", insertError)
        // Don't fail if we can't insert sample data
      }

      setSetupStatus("success")
      setTimeout(() => {
        onSetupComplete()
      }, 2000)
    } catch (error) {
      console.error("Setup error:", error)
      setSetupStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsSettingUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Database className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Database Setup Required</CardTitle>
          <CardDescription>The courses table needs to be created before you can use the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {setupStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>Database setup completed successfully!</span>
            </div>
          )}

          {setupStatus === "error" && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Setup failed</p>
                <p className="text-sm mt-1">{errorMessage}</p>
                <p className="text-sm mt-2">
                  Please run the SQL scripts manually in your Supabase dashboard or Project Settings.
                </p>
              </div>
            </div>
          )}

          <Button onClick={setupDatabase} disabled={isSettingUp || setupStatus === "success"} className="w-full">
            {isSettingUp ? "Setting up database..." : "Setup Database"}
          </Button>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Manual Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to Project Settings (gear icon)</li>
              <li>Navigate to Supabase integration</li>
              <li>Run the SQL scripts in the scripts folder</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
