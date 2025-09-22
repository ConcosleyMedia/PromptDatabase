import { loadCoursesFromDatabase } from "@/lib/database-setup"
import { CoursePageClient } from "@/components/course-page-client"

export default async function HomePage() {
  const { courses, fromDatabase } = await loadCoursesFromDatabase()

  return <CoursePageClient initialCourses={courses} usingMockData={!fromDatabase} />
}
