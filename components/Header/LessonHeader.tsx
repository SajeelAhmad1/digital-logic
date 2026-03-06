'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Course } from '@/lib/courses';

interface LessonHeaderProps {
  course: Course;
}

export default function LessonHeader({ course }: LessonHeaderProps) {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;
  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const lesson = course.lessons[lessonIndex];
  const [sheetOpen, setSheetOpen] = useState(false);

  const goTo = (index: number) => {
    const target = course.lessons[index];
    if (target) router.push(`/course/${course.id}/lesson/${target.id}`);
  };

  return (
    <header className="flex items-center justify-between px-4 h-12 bg-[#16161e] border-b border-[#2e2e3e] shrink-0">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-[#2e2e3e]" onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back to dashboard</TooltipContent>
        </Tooltip>

        {lesson && (
          <Badge variant="secondary" className="hidden sm:inline-flex bg-[#2e2e3e] text-white border-0 font-semibold text-xs">
            {lesson.title}
          </Badge>
        )}

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-[#2e2e3e]">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-[#16161e] border-[#2e2e3e] text-white p-0">
            <SheetHeader className="px-5 pt-5 pb-3">
              <SheetTitle className="text-[#888] text-xs font-mono uppercase tracking-widest">{course.title}</SheetTitle>
            </SheetHeader>
            <Separator className="bg-[#2e2e3e]" />
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="py-2">
                {course.lessons.map((l, i) => (
                  <button key={l.id} onClick={() => { goTo(i); setSheetOpen(false); }}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm transition-colors border-l-2 hover:bg-[#2e2e3e] ${l.id === lessonId ? 'border-[#5b4fcf] bg-[#2e2e3e] text-white' : 'border-transparent text-[#aaa] hover:text-white'}`}>
                    <span>{i + 1}. {l.title}</span>
                    <span className="text-xs text-[#555] ml-2 shrink-0">{l.duration}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-[#aaa] hover:text-white hover:bg-[#2e2e3e] text-xs h-7">Get Unstuck</Button>
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-[#aaa] hover:text-white hover:bg-[#2e2e3e] text-xs h-7">Tools</Button>
        <div className="w-7 h-7 rounded-full bg-[#5b4fcf] flex items-center justify-center text-white font-bold text-xs shrink-0">U</div>
      </div>
    </header>
  );
}