'use client';

import { useEffect, useState } from 'react';
import { executeCode } from '@/lib/api/executeCode';
import type { Lesson } from '@/lib/courses';
import LessonMobileTabs, { MobileTab } from './LessonMobileTabs';
import LessonContent from './LessonContent';
import LessonEditor from './LessonEditor';
import LessonOutput from './LessonOutput';


// ── constants ─────────────────────────────────────────────────────────────────

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

// ── types ─────────────────────────────────────────────────────────────────────

interface LessonPageProps {
  lesson: Lesson;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function LessonPage({ lesson }: LessonPageProps) {
  const [code,      setCode]      = useState(lesson.starterCode ?? '');
  const [output,    setOutput]    = useState<string | null>(null);
  const [running,   setRunning]   = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('learn');

  // Reset editor whenever the lesson changes (user navigates prev/next)
  useEffect(() => {
    setCode(lesson.starterCode ?? '');
    setOutput(null);
  }, [lesson.id]);

  // ── derived ──────────────────────────────────────────────────────────────

  const ext       = FILE_EXTENSIONS[lesson.language] ?? 'txt';
  const fileName  = `${lesson.title.replace(/\s+/g, '')}.${ext}`;
  const langLabel = LANGUAGE_LABELS[lesson.language] ?? lesson.language;

  // ── handlers ─────────────────────────────────────────────────────────────

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    setMobileTab('output'); // auto-switch on mobile
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
    setCode(lesson.starterCode ?? '');
    setOutput(null);
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">

      {/* ── DESKTOP: 3-panel layout ───────────────────────────────────── */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* Left – lesson content */}
        <div className="w-[38%] min-w-[300px] border-r border-[#2e2e3e] overflow-hidden flex flex-col">
          <LessonContent html={lesson.content} />
        </div>

        {/* Center – editor */}
        <div className="flex-1 min-w-0 border-r border-[#2e2e3e] overflow-hidden flex flex-col">
          <LessonEditor
            code={code}
            language={lesson.language}
            fileName={fileName}
            running={running}
            onChange={setCode}
            onRun={handleRun}
            onReset={handleReset}
          />
        </div>

        {/* Right – output */}
        <div className="w-[28%] min-w-[220px] overflow-hidden flex flex-col">
          <LessonOutput
            output={output}
            langLabel={langLabel}
            onClear={() => setOutput(null)}
          />
        </div>
      </div>

      {/* ── MOBILE: tabbed layout ─────────────────────────────────────── */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden">
        <LessonMobileTabs active={mobileTab} onChange={setMobileTab} />

        <div className="flex-1 overflow-hidden">
          {mobileTab === 'learn' && (
            <LessonContent html={lesson.content} />
          )}
          {mobileTab === 'code' && (
            <LessonEditor
              code={code}
              language={lesson.language}
              fileName={fileName}
              running={running}
              onChange={setCode}
              onRun={handleRun}
              onReset={handleReset}
              compact
            />
          )}
          {mobileTab === 'output' && (
            <LessonOutput
              output={output}
              langLabel={langLabel}
              onClear={() => setOutput(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}