'use client';

import { useRouter, useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/lib/courses';

interface LessonFooterProps {
  course: Course;
}

export default function LessonFooter({ course }: LessonFooterProps) {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;
  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const total = course.lessons.length;
  const isFirst = lessonIndex <= 0;
  const isLast = lessonIndex >= total - 1;

  const goTo = (index: number) => {
    const target = course.lessons[index];
    if (target) router.push(`/${course.id}/lesson/${target.id}`);
  };

  return (
    <footer className="flex items-center justify-between px-6 h-12 bg-[#16161e] border-t border-[#2e2e3e] shrink-0">
      <span className="text-[#555] text-sm font-mono">{lessonIndex + 1} / {total}</span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={isFirst} onClick={() => goTo(lessonIndex - 1)}
          className="bg-[#2e2e3e] text-[#ccc] hover:bg-[#3e3e4e] border-0 disabled:opacity-30">
          Back
        </Button>
        <Button size="sm" disabled={isLast} onClick={() => goTo(lessonIndex + 1)}
          className="bg-[#f5c518] text-[#1a1a1a] hover:bg-[#e6b800] font-bold disabled:opacity-30 gap-1">
          Next <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </footer>
  );
}