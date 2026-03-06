'use client';
// components/dashboard/CourseCard.tsx

import type { Course } from '@/lib/courses';

interface CourseCardProps {
  course: Course;
  onStart: () => void;
}

export default function CourseCard({ course, onStart }: CourseCardProps) {
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
      {/* Free / Course badge */}
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