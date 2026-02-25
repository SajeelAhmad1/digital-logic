'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Course } from '@/lib/courses';
import { useAuth } from '@/auth/auth-config/useAuth';

type Props = {
  user: { id: string; name: string; username: string };
  courses: Course[];
};

type Progress = {
  lessonIndex: number;
  progress: number;
  practiceToday: number;
  practiceTotal: number;
};

export default function DashboardClient({ user, courses }: Props) {
  const router = useRouter();
  const { logout } = useAuth();

  // Simulating no courses started initially — flip to test "Keep learning" state
  const [inProgress, setInProgress] = useState<Record<string, Progress>>({});

  const startedCourses = courses.filter((c) => inProgress[c.id]);
  const hasStarted = startedCourses.length > 0;

  // Demo: clicking a course card "starts" it
  const handleStartCourse = (courseId: string) => {
    setInProgress((prev) => ({
      ...prev,
      [courseId]: { lessonIndex: 0, progress: 0, practiceToday: 0, practiceTotal: 1 },
    }));
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f2', fontFamily: "'Georgia', serif" }}>

      {/* ── Top nav ─────────────────────────────────────────────────── */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e5e3dc',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px', color: '#1a1a1a' }}>
          Digital Logic
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>{user.name}</span>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#5b4fcf', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
            title="Logout"
            onClick={() => logout()}
          >
            {initials}
          </div>
        </div>
      </nav>

      {/* ── Layout ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* Sidebar */}
        <aside style={{
          width: 220, background: '#fff',
          borderRight: '1px solid #e5e3dc',
          padding: '24px 0',
          flexShrink: 0,
        }}>
          <SidebarItem icon="⊞" label="Dashboard" active />
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '40px 48px', maxWidth: 900 }}>

          {/* ── STATE 1: No courses started ── */}
          {!hasStarted && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28, color: '#1a1a1a', fontStyle: 'italic' }}>
                Start learning
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onStart={() => handleStartCourse(course.id)}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── STATE 2: Courses in progress ── */}
          {hasStarted && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#1a1a1a', fontStyle: 'italic' }}>
                Keep learning
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {startedCourses.map((course) => {
                  const prog = inProgress[course.id];
                  const currentLesson = course.lessons[prog.lessonIndex];
                  return (
                    <InProgressCard
                      key={course.id}
                      course={course}
                      currentLesson={currentLesson?.title ?? '—'}
                      progress={prog.progress}
                      practiceToday={prog.practiceToday}
                      practiceTotal={prog.practiceTotal}
                      onResume={() =>
                        router.push(`/course/${course.id}/lesson/${currentLesson?.id}`)
                      }
                    />
                  );
                })}
              </div>

              {/* Also show other available courses below */}
              {courses.filter((c) => !inProgress[c.id]).length > 0 && (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: '40px 0 20px', color: '#1a1a1a' }}>
                    More courses
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                    {courses
                      .filter((c) => !inProgress[c.id])
                      .map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onStart={() => handleStartCourse(course.id)}
                        />
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SidebarItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 20px',
      borderLeft: active ? '3px solid #5b4fcf' : '3px solid transparent',
      background: active ? '#f0effe' : 'transparent',
      color: active ? '#5b4fcf' : '#555',
      fontWeight: active ? 600 : 400,
      fontSize: 14,
      cursor: 'pointer',
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </div>
  );
}

function CourseCard({ course, onStart }: { course: Course; onStart: () => void }) {
  return (
    <div
      onClick={onStart}
      style={{
        background: '#fff',
        border: '1px solid #e5e3dc',
        borderRadius: 8,
        padding: 20,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'box-shadow 0.15s',
        minHeight: 200,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Badge */}
      <span style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: course.isFree ? '#eaf5e4' : '#f0effe',
        color: course.isFree ? '#3a7d2c' : '#5b4fcf',
        border: `1px solid ${course.isFree ? '#b8e0ab' : '#c5b8f8'}`,
        alignSelf: 'flex-start',
        fontFamily: 'monospace',
      }}>
        {course.isFree ? 'Free course' : 'Course'}
      </span>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '4px 0 8px' }}>
          {course.title}
        </h3>
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, margin: 0 }}>
          {course.description}
        </p>
      </div>

      {/* Certificate badge */}
      {course.hasCertificate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px dashed #e5e3dc', paddingTop: 10 }}>
          <span style={{ fontSize: 14 }}>🎓</span>
          <span style={{ fontSize: 12, color: '#555' }}>
            With <strong>Certificate</strong>
          </span>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid #e5e3dc', paddingTop: 10,
        fontSize: 12, color: '#555',
      }}>
        <span>
          <span style={{ fontSize: 14 }}>📊</span>{' '}
          <span style={{ color: '#e6a817', fontWeight: 700 }}>{course.difficulty}</span>{' '}
          Friendly
        </span>
        <span style={{ fontWeight: 600 }}>{course.hours} hours</span>
      </div>
    </div>
  );
}

function InProgressCard({
  course, currentLesson, progress, practiceToday, practiceTotal, onResume,
}: {
  course: Course;
  currentLesson: string;
  progress: number;
  practiceToday: number;
  practiceTotal: number;
  onResume: () => void;
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e3dc',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Progress bar row */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fdf8f0', padding: '8px 16px', gap: 12 }}>
        <span style={{
          background: '#f5c518', color: '#1a1a1a',
          fontWeight: 800, fontSize: 12, padding: '2px 8px', borderRadius: 4,
          fontFamily: 'monospace',
        }}>
          {progress}%
        </span>
        <div style={{ flex: 1, height: 12, background: '#e8e4d4', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.max(progress, 2)}%`,
            background: 'repeating-linear-gradient(45deg, #c8b87a, #c8b87a 4px, #d4c68a 4px, #d4c68a 8px)',
            borderRadius: 6,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Course info */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #f0ede6',
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#888', textTransform: 'uppercase', margin: '0 0 4px', fontFamily: 'monospace' }}>
            Course
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px', fontStyle: 'italic' }}>
            {course.title}
          </h3>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            Current Module: {currentLesson}
          </p>
        </div>
        <span style={{ fontSize: 20, color: '#aaa', cursor: 'pointer' }}>›</span>
      </div>

      {/* Footer actions */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, padding: '14px 20px', fontSize: 13, color: '#555' }}>
          Start practice session{' '}
          <span style={{ color: '#888', fontSize: 12 }}>
            {practiceToday}/{practiceTotal} today
          </span>
        </div>
        <button
          onClick={onResume}
          style={{
            background: '#5b4fcf',
            color: '#fff',
            border: 'none',
            padding: '14px 32px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: '-0.2px',
          }}
        >
          Resume <span style={{ fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  );
}