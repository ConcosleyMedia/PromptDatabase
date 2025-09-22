"use client"

import type { Course } from "@/types/course"
import { CourseCard } from "./course-card"

interface CourseGridProps {
  courses: Course[]
  onCourseClick: (course: Course) => void
  onDeleteCourse: (courseId: string) => void
  onEditCourse?: (course: Course) => void
  isAdmin?: boolean
}

export function CourseGrid({ courses, onCourseClick, onDeleteCourse, onEditCourse, isAdmin = false }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CourseCard
          key={`${course.id}-${index}`}
          course={course}
          onClick={() => onCourseClick(course)}
          onDelete={() => onDeleteCourse(course.id)}
          onEdit={onEditCourse ? () => onEditCourse(course) : undefined}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )
}
