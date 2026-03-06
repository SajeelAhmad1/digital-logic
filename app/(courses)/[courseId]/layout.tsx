import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/courses';
import { TooltipProvider } from '@/components/ui/tooltip';
import LessonHeader from '@/components/Header/LessonHeader';
import LessonFooter from '@/components/Footer/LessonFooter';

interface Props {
  children: ReactNode;
  params: { courseId: string };
}

export default function CourseLayout({ children, params }: Props) {
  const course = getCourseById(params.courseId);
  if (!course) notFound();

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-[#1e1e2e]">
        <LessonHeader course={course} />
        <main className="flex flex-1 overflow-hidden">
          {children}
        </main>
        <LessonFooter course={course} />
      </div>
    </TooltipProvider>
  );
}