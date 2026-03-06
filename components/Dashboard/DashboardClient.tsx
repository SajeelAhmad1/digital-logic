'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Course } from '@/lib/courses';
import CourseCard     from './CourseCard';
import InProgressCard from './InProgressCard';
import { Progress } from '@/types/dashboard';

interface DashboardClientProps {
  courses: Course[];
}

export default function DashboardClient({ courses }: DashboardClientProps) {
  const router = useRouter();
  const [inProgress, setInProgress] = useState<Record<string, Progress>>({});

  const startedCourses = courses.filter((c) => inProgress[c.id]);
  const hasStarted     = startedCourses.length > 0;

  const handleStartCourse = (courseId: string) => {
    setInProgress((prev) => ({
      ...prev,
      [courseId]: { lessonIndex: 0, progress: 0, practiceToday: 0, practiceTotal: 1 },
    }));
  };

  return (
    <>
      {/* ── No courses started ───────────────────────────────────── */}
      {!hasStarted && (
        <>
          <h1 className="dash-page-title" style={{ fontSize: 28, fontWeight: 700, marginBottom: 28, color: '#1a1a1a', fontStyle: 'italic' }}>
            Start learning
          </h1>
          <div className="dash-course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onStart={() => handleStartCourse(course.id)} />
            ))}
          </div>
        </>
      )}

      {/* ── Courses in progress ──────────────────────────────────── */}
      {hasStarted && (
        <>
          <h1 className="dash-page-title" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#1a1a1a', fontStyle: 'italic' }}>
            Keep learning
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {startedCourses.map((course) => {
              const prog          = inProgress[course.id];
              const currentLesson = course.lessons[prog.lessonIndex];
              return (
                <InProgressCard
                  key={course.id}
                  course={course}
                  currentLesson={currentLesson?.title ?? '—'}
                  progress={prog.progress}
                  practiceToday={prog.practiceToday}
                  practiceTotal={prog.practiceTotal}
                  onResume={() => router.push(`/${course.id}/lesson/${currentLesson?.id}`)}
                />
              );
            })}
          </div>

          {/* More courses */}
          {courses.filter((c) => !inProgress[c.id]).length > 0 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '40px 0 20px', color: '#1a1a1a' }}>
                More courses
              </h2>
              <div className="dash-course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {courses
                  .filter((c) => !inProgress[c.id])
                  .map((course) => (
                    <CourseCard key={course.id} course={course} onStart={() => handleStartCourse(course.id)} />
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}