'use client';
// components/dashboard/InProgressCard.tsx

import type { Course } from '@/lib/courses';

interface InProgressCardProps {
  course: Course;
  currentLesson: string;
  progress: number;
  practiceToday: number;
  practiceTotal: number;
  onResume: () => void;
}

export default function InProgressCard({
  course,
  currentLesson,
  progress,
  practiceToday,
  practiceTotal,
  onResume,
}: InProgressCardProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e3dc',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Progress bar */}
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
      <div
        className="dash-ip-info"
        style={{
          padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #f0ede6',
        }}
      >
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            color: '#888', textTransform: 'uppercase', margin: '0 0 4px', fontFamily: 'monospace',
          }}>
            Course
          </p>
          <h3 className="dash-ip-title" style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px', fontStyle: 'italic' }}>
            {course.title}
          </h3>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            Current Module: {currentLesson}
          </p>
        </div>
        <span style={{ fontSize: 20, color: '#aaa', cursor: 'pointer' }}>›</span>
      </div>

      {/* Footer actions */}
      <div className="dash-ip-footer" style={{ display: 'flex', alignItems: 'center' }}>
        <div
          className="dash-practice-label"
          style={{ flex: 1, padding: '14px 20px', fontSize: 13, color: '#555' }}
        >
          Start practice session{' '}
          <span style={{ color: '#888', fontSize: 12 }}>
            {practiceToday}/{practiceTotal} today
          </span>
        </div>
        <button
          className="dash-resume-btn"
          onClick={onResume}
          style={{
            background: '#5b4fcf', color: '#fff',
            border: 'none', padding: '14px 32px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            letterSpacing: '-0.2px',
          }}
        >
          Resume <span style={{ fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  );
}