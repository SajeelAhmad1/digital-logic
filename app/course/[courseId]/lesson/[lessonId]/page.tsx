'use client';
// app/(user)/course/[courseId]/lesson/[lessonId]/page.tsx

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCourseById } from '@/lib/courses';
import { executeCode } from '@/lib/api/executeCode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Menu,
  Play,
  RotateCcw,
  X,
  FileCode2,
  ChevronRight,
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGE_LABELS: Record<string, string> = {
  java:       'Java',
  python:     'Python 3',
  javascript: 'JavaScript',
  cpp:        'C++',
};

const FILE_EXTENSIONS: Record<string, string> = {
  java:       'java',
  python:     'py',
  javascript: 'js',
  cpp:        'cpp',
};

function isErrorOutput(output: string) {
  return ['error', 'exception', 'traceback', 'compile error'].some((kw) =>
    output.toLowerCase().includes(kw)
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const course = getCourseById(courseId);
  const lessonIndex = course?.lessons.findIndex((l) => l.id === lessonId) ?? 0;
  const lesson = course?.lessons[lessonIndex];

  const [code, setCode] = useState(lesson?.starterCode ?? '');
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setCode(lesson?.starterCode ?? '');
    setOutput(null);
  }, [lesson]);

  const handleRun = async () => {
    if (!lesson) return;
    setRunning(true);
    setOutput('Running...');
    try {
      const result = await executeCode(code, lesson.language);
      setOutput(result);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setCode(lesson?.starterCode ?? '');
    setOutput(null);
  };

  const goTo = (idx: number) => {
    const target = course?.lessons[idx];
    if (target) router.push(`/course/${courseId}/lesson/${target.id}`);
  };

  if (!course || !lesson) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1e1e2e] text-white">
        Lesson not found.
      </div>
    );
  }

  const totalLessons = course.lessons.length;
  const isFirst = lessonIndex === 0;
  const isLast = lessonIndex === totalLessons - 1;
  const ext = FILE_EXTENSIONS[lesson.language] ?? 'txt';
  const fileName = `${lesson.title.replace(/\s+/g, '')}.${ext}`;
  const langLabel = LANGUAGE_LABELS[lesson.language] ?? lesson.language;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#1e1e2e]">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 h-12 bg-[#16161e] border-b border-[#2e2e3e] shrink-0">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-[#2e2e3e]"
                  onClick={() => router.push('/')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to dashboard</TooltipContent>
            </Tooltip>

            <Badge variant="secondary" className="bg-[#2e2e3e] text-white border-0 font-semibold text-xs">
              {lesson.title}
            </Badge>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-[#2e2e3e]"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 bg-[#16161e] border-[#2e2e3e] text-white p-0"
              >
                <SheetHeader className="px-5 pt-5 pb-3">
                  <SheetTitle className="text-[#888] text-xs font-mono uppercase tracking-widest">
                    {course.title}
                  </SheetTitle>
                </SheetHeader>
                <Separator className="bg-[#2e2e3e]" />
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="py-2">
                    {course.lessons.map((l, i) => (
                      <button
                        key={l.id}
                        onClick={() => { goTo(i); setSheetOpen(false); }}
                        className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm transition-colors border-l-2 hover:bg-[#2e2e3e]
                          ${l.id === lessonId
                            ? 'border-[#5b4fcf] bg-[#2e2e3e] text-white'
                            : 'border-transparent text-[#aaa] hover:text-white'
                          }`}
                      >
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
            <Button variant="ghost" size="sm" className="text-[#aaa] hover:text-white hover:bg-[#2e2e3e] text-xs h-7">
              Get Unstuck
            </Button>
            <Button variant="ghost" size="sm" className="text-[#aaa] hover:text-white hover:bg-[#2e2e3e] text-xs h-7">
              Tools
            </Button>
            <div className="w-7 h-7 rounded-full bg-[#5b4fcf] flex items-center justify-center text-white font-bold text-xs shrink-0">
              U
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left panel: lesson content */}
          <div className="w-[38%] min-w-[300px] bg-white flex flex-col overflow-hidden border-r border-[#2e2e3e]">
            <div className="flex items-center px-5 bg-[#fafaf8] border-b border-[#e5e3dc] shrink-0">
              <div className="flex items-center gap-2 py-2.5 border-b-2 border-[#5b4fcf] text-[#5b4fcf] text-sm font-semibold mr-5">
                <Menu className="w-3.5 h-3.5" />
                Learn
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div
                className="lesson-content px-7 py-6 text-sm leading-relaxed text-[#2a2a2a]"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </ScrollArea>
            <style>{`
              .lesson-content h2 { font-size: 20px; font-weight: 700; margin: 0 0 12px; color: #1a1a1a; }
              .lesson-content p { margin: 0 0 14px; }
              .lesson-content .lesson-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #888; font-family: monospace; margin-bottom: 6px; display: block; }
              .lesson-content .lesson-link { color: #5b4fcf; text-decoration: underline; }
              .lesson-content code { background: #f0effe; color: #5b4fcf; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
              .lesson-content .lesson-diagram { background: #f7f6f2; border: 1px solid #e5e3dc; border-radius: 8px; padding: 16px; margin-top: 16px; text-align: center; }
              .lesson-content .diagram-title { font-weight: 700; font-size: 15px; margin-bottom: 10px; }
              .lesson-content .lesson-diagram pre { background: #d4ecd4; border: 1px solid #a8d8a8; border-radius: 6px; padding: 10px; text-align: left; font-size: 12px; margin-bottom: 10px; }
              .lesson-content .diagram-label { font-size: 12px; color: #555; }
            `}</style>
          </div>

          {/* Monaco panel */}
          <div className="flex-1 flex flex-col bg-[#1e1e2e] min-w-0 border-r border-[#2e2e3e]">

            {/* Editor top bar */}
            <div className="flex items-center justify-between px-4 h-10 bg-[#252535] border-b border-[#2e2e3e] shrink-0">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-[#888]" />
                <span className="text-xs text-[#ccc] font-mono">{fileName}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[#555] hover:text-[#aaa] hover:bg-[#2e2e3e]"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset to starter code</TooltipContent>
              </Tooltip>
            </div>

            {/* Monaco editor */}
            <div className="flex-1 overflow-hidden min-h-0">
              <MonacoEditor
                height="100%"
                language={lesson.language}
                value={code}
                onChange={(val) => setCode(val ?? '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  padding: { top: 16 },
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontLigatures: true,
                }}
              />
            </div>

            {/* Run bar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[#252535] border-t border-[#2e2e3e] shrink-0">
              <Button
                onClick={handleRun}
                disabled={running}
                size="sm"
                className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold gap-1.5 disabled:opacity-70"
              >
                {running ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-white" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Output panel — always visible, parallel to editor */}
          <div className="w-[28%] min-w-[220px] flex flex-col bg-[#0d0d14]">
            {/* Output header */}
            <div className="flex items-center justify-between px-4 h-10 bg-[#1a1a28] border-b border-[#2e2e3e] shrink-0">
              <span className="text-[10px] text-[#888] font-mono uppercase tracking-widest">
                Output
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] border-[#2e2e3e] text-[#555] font-mono py-0 h-5"
                >
                  {langLabel}
                </Badge>
                {output !== null && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-[#555] hover:text-[#aaa] hover:bg-[#2e2e3e]"
                    onClick={() => setOutput(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Output content */}
            <ScrollArea className="flex-1">
              {output === null ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 text-[#333] select-none">
                  <Play className="w-8 h-8 opacity-20" />
                  <span className="text-xs font-mono opacity-40">Run your code to see output</span>
                </div>
              ) : (
                <pre
                  className={`p-4 text-[13px] leading-relaxed font-mono whitespace-pre-wrap break-words
                    ${isErrorOutput(output) ? 'text-[#f87171]' : output === 'Running...' ? 'text-[#888]' : 'text-[#86efac]'}`}
                >
                  {output}
                </pre>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Bottom nav */}
        <footer className="flex items-center justify-between px-6 h-12 bg-[#16161e] border-t border-[#2e2e3e] shrink-0">
          <span className="text-[#555] text-sm font-mono">
            {lessonIndex + 1} / {totalLessons}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={isFirst}
              onClick={() => goTo(lessonIndex - 1)}
              className="bg-[#2e2e3e] text-[#ccc] hover:bg-[#3e3e4e] border-0 disabled:opacity-30"
            >
              Back
            </Button>
            <Button
              size="sm"
              disabled={isLast}
              onClick={() => goTo(lessonIndex + 1)}
              className="bg-[#f5c518] text-[#1a1a1a] hover:bg-[#e6b800] font-bold disabled:opacity-30 gap-1"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </footer>

      </div>
    </TooltipProvider>
  );
}