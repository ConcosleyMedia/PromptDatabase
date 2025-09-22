"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { CourseGrid } from "@/components/course-grid"
import { Header } from "@/components/header"
import { AdminLogin } from "@/components/admin-login"
import { EditCourseForm } from "@/components/edit-course-form"
import { ConnectionStatus } from "@/components/connection-status"
import { createClient } from "@/lib/supabase/client"
import type { Course } from "@/types/course"
import { useAdmin } from "@/contexts/admin-context"

interface CoursePageClientProps {
  initialCourses: Course[]
  usingMockData: boolean
}

export function CoursePageClient({ initialCourses, usingMockData }: CoursePageClientProps) {
  const { isAdmin, login } = useAdmin()
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const categories = Array.from(new Set(courses.map((course) => course.category))).sort()

  useEffect(() => {
    const handleFocus = async () => {
      if (!usingMockData) {
        try {
          const { data, error } = await supabase
            .from("courses")
            .select("*")
            .order("updated_at", { ascending: false })
            .order("created_at", { ascending: false })

          if (!error && data) {
            const transformedCourses = data.map((course: any) => ({
              id: course.id,
              title: course.title,
              description: course.description || "",
              icon: course.icon || "📚",
              content: course.content || "",
              videoUrl: course.video_url || "",
              category: course.tags?.[0] || "General",
              tags: course.tags || ["General"],
              thumbnailUrl: course.thumbnail_url || "",
            }))
            setCourses(transformedCourses)
            console.log("[v0] Refreshed courses from database")
          }
        } catch (error) {
          console.log("[v0] Error refreshing courses:", error)
        }
      }
    }

    handleFocus()

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [supabase, usingMockData])

  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, selectedCategory])

  useEffect(() => {
    if (filteredCourses.length > 0) {
      const initialCourses = [...filteredCourses, ...filteredCourses, ...filteredCourses]
      setDisplayedCourses(initialCourses)
    } else {
      setDisplayedCourses([])
    }
  }, [filteredCourses])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight)

      console.log("[v0] Scroll - scrollTop:", scrollTop, "scrollHeight:", scrollHeight, "clientHeight:", clientHeight)
      console.log("[v0] Scroll percentage:", scrollPercentage)

      if (scrollPercentage > 0.8) {
        console.log("[v0] Adding more courses - current count:", displayedCourses.length)
        setDisplayedCourses((prev) => [...prev, ...filteredCourses])
      }

      if (scrollPercentage > 0.95) {
        console.log("[v0] Scrolling back to top")
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
        }, 500)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [filteredCourses, displayedCourses.length])

  const handleCourseClick = (course: Course) => {
    router.push(`/course/${course.id}`)
  }

  const handleAddCourse = async (newCourse: Omit<Course, "id">) => {
    console.log("[v0] CoursePageClient handleAddCourse called with:", newCourse)

    if (usingMockData) {
      const mockCourse: Course = {
        ...newCourse,
        id: Date.now().toString(),
      }
      setCourses((prev) => [mockCourse, ...prev])
      console.log("[v0] Added mock course:", mockCourse)
      return
    }

    try {
      console.log("[v0] Attempting to add course to Supabase...")
      const { data, error } = await supabase
        .from("courses")
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          content: newCourse.content,
          icon: newCourse.icon || "📚",
          tags: newCourse.tags,
          video_url: newCourse.videoUrl,
          thumbnail_url: newCourse.thumbnailUrl,
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error adding course:", error)
        return
      }

      console.log("[v0] Successfully added course to database:", data)

      const transformedCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        icon: data.icon || "📚",
        content: data.content || "",
        videoUrl: data.video_url || "",
        category: data.tags?.[0] || "General",
        tags: data.tags || ["General"],
        thumbnailUrl: data.thumbnail_url || "",
      }

      setCourses((prev) => [transformedCourse, ...prev])
      console.log("[v0] Updated courses state with new course")
    } catch (error) {
      console.error("[v0] Error adding course:", error)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (usingMockData) {
      setCourses((prev) => prev.filter((course) => course.id !== courseId))
      return
    }

    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId)

      if (error) {
        console.error("Error deleting course:", error)
        return
      }

      setCourses((prev) => prev.filter((course) => course.id !== courseId))
      console.log("[v0] Successfully deleted course:", courseId)
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilter = (category: string) => {
    setSelectedCategory(category)
  }

  const handleAdminLogin = (adminStatus: boolean) => {
    if (adminStatus) {
      login()
    }
    setShowAdminLogin(false)
  }

  const handleAdminLogout = () => {
    // This would use logout from context if needed
    setShowAdminLogin(false)
  }

  const handleShowAdminLogin = () => {
    setShowAdminLogin(true)
  }

  const handleEditCourse = async (courseId: string, updatedCourse: Omit<Course, "id">) => {
    console.log("[v0] handleEditCourse called with courseId:", courseId, "updatedCourse:", updatedCourse)

    if (usingMockData) {
      setCourses((prev) => prev.map((course) => (course.id === courseId ? { ...updatedCourse, id: courseId } : course)))
      return
    }

    try {
      console.log("[v0] Attempting to update course in Supabase...")

      const { data, error } = await supabase
        .from("courses")
        .update({
          title: updatedCourse.title,
          description: updatedCourse.description,
          content: updatedCourse.content,
          icon: updatedCourse.icon || "📚",
          tags: updatedCourse.tags,
          video_url: updatedCourse.videoUrl,
          thumbnail_url: updatedCourse.thumbnailUrl,
        })
        .eq("id", courseId)
        .select()
        .single()

      if (error) {
        console.error("[v0] Supabase error updating course:", error)
        console.error("[v0] Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return
      }

      console.log("[v0] Successfully updated course in database:", data)

      const transformedCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        icon: data.icon || "📚",
        content: data.content || "",
        videoUrl: data.video_url || "",
        category: data.tags?.[0] || "General",
        tags: data.tags || ["General"],
        thumbnailUrl: data.thumbnail_url || "",
      }

      setCourses((prev) => prev.map((course) => (course.id === courseId ? transformedCourse : course)))
      console.log("[v0] Successfully updated course in state:", courseId)
    } catch (error) {
      console.error("[v0] Unexpected error updating course:", error)
      console.error("[v0] Error type:", typeof error)
      console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    }
  }

  const handleOpenEditForm = (course: Course) => {
    setEditingCourse(course)
    setShowEditForm(true)
  }

  const handleCloseEditForm = () => {
    setEditingCourse(null)
    setShowEditForm(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-yellow-400/20"></div>

      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-32 h-24 bg-yellow-400 rounded-lg transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-28 h-20 bg-yellow-300 rounded-lg transform -rotate-6"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-32 bg-yellow-500 rounded-lg transform rotate-45"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-16 bg-yellow-400 rounded-lg transform -rotate-12"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header
          onAddCourse={handleAddCourse}
          onSearch={handleSearch}
          onFilter={handleFilter}
          categories={categories}
          isAdmin={isAdmin}
          onAdminLogin={handleShowAdminLogin}
          onAdminLogout={handleAdminLogout}
        />

        {usingMockData && (
          <div className="bg-yellow-100/90 backdrop-blur-sm border-l-4 border-yellow-500 p-4 mx-6 mt-4 rounded-lg shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 font-medium">
                  <strong>Using sample data:</strong> The database table hasn't been created yet. To enable full
                  functionality, please run the SQL scripts in Project Settings (gear icon → Database Scripts).
                </p>
              </div>
            </div>
          </div>
        )}

        <main className="container mx-auto px-6 py-4 flex-1 ml-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 h-full">
            <div ref={scrollContainerRef} className="h-full overflow-y-auto pr-2">
              <CourseGrid
                courses={displayedCourses}
                onCourseClick={handleCourseClick}
                onDeleteCourse={handleDeleteCourse}
                onEditCourse={handleOpenEditForm}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </main>
      </div>

      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} onLogin={handleAdminLogin} />

      <EditCourseForm
        course={editingCourse}
        isOpen={showEditForm}
        onClose={handleCloseEditForm}
        onSave={handleEditCourse}
      />

      <ConnectionStatus />
    </div>
  )
}
