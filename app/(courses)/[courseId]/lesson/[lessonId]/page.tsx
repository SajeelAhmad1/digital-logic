import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/courses';
import LessonPage from '@/components/Lesson/LessonPage';

interface Props {
  params: { courseId: string; lessonId: string };
}

export default function LessonRoute({ params }: Props) {
  const course = getCourseById(params.courseId);
  const lesson = course?.lessons.find((l) => l.id === params.lessonId);

  if (!lesson) notFound();

  return <LessonPage lesson={lesson} />;
}