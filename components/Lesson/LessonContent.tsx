'use client';
// components/lesson/LessonContent.tsx
// Left panel: renders the HTML lesson content with scoped styles.

import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu } from 'lucide-react';

const CONTENT_STYLES = `
  .lesson-content h2 { font-size: 20px; font-weight: 700; margin: 0 0 12px; color: #1a1a1a; }
  .lesson-content p  { margin: 0 0 14px; }
  .lesson-content .lesson-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #888; font-family: monospace;
    margin-bottom: 6px; display: block;
  }
  .lesson-content .lesson-link { color: #5b4fcf; text-decoration: underline; }
  .lesson-content code {
    background: #f0effe; color: #5b4fcf; padding: 1px 6px;
    border-radius: 3px; font-size: 13px;
  }
  .lesson-content .lesson-diagram {
    background: #f7f6f2; border: 1px solid #e5e3dc;
    border-radius: 8px; padding: 16px; margin-top: 16px; text-align: center;
  }
  .lesson-content .diagram-title { font-weight: 700; font-size: 15px; margin-bottom: 10px; }
  .lesson-content .lesson-diagram pre {
    background: #d4ecd4; border: 1px solid #a8d8a8;
    border-radius: 6px; padding: 10px; text-align: left;
    font-size: 12px; margin-bottom: 10px;
  }
  .lesson-content .diagram-label { font-size: 12px; color: #555; }
`;

interface LessonContentProps {
  html: string;
}

export default function LessonContent({ html }: LessonContentProps) {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <style>{CONTENT_STYLES}</style>

      {/* Panel tab bar */}
      <div className="flex items-center px-5 bg-[#fafaf8] border-b border-[#e5e3dc] shrink-0">
        <div className="flex items-center gap-2 py-2.5 border-b-2 border-[#5b4fcf] text-[#5b4fcf] text-sm font-semibold mr-5">
          <Menu className="w-3.5 h-3.5" />
          Learn
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div
          className="lesson-content px-7 py-6 text-sm leading-relaxed text-[#2a2a2a]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ScrollArea>
    </div>
  );
}
