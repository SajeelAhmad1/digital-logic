'use client';

import dynamic from 'next/dynamic';
import { FileCode2, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface LessonEditorProps {
  code: string;
  language: string;
  fileName: string;
  running: boolean;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  /** Smaller font size for mobile */
  compact?: boolean;
}

export default function LessonEditor({
  code,
  language,
  fileName,
  running,
  onChange,
  onRun,
  onReset,
  compact = false,
}: LessonEditorProps) {
  return (
    <div className="flex flex-col h-full bg-[#1e1e2e]">
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
              onClick={onReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset to starter code</TooltipContent>
        </Tooltip>
      </div>

      {/* Monaco */}
      <div className="flex-1 overflow-hidden min-h-0">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(val) => onChange(val ?? '')}
          theme="vs-dark"
          options={{
            fontSize: compact ? 13 : 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            padding: { top: compact ? 12 : 16 },
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
          }}
        />
      </div>

      {/* Run toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#252535] border-t border-[#2e2e3e] shrink-0">
        <Button
          onClick={onRun}
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
  );
}
