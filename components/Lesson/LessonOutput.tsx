'use client';

import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

function isErrorOutput(output: string) {
  return ['error', 'exception', 'traceback', 'compile error'].some((kw) =>
    output.toLowerCase().includes(kw)
  );
}

interface LessonOutputProps {
  output: string | null;
  langLabel: string;
  onClear: () => void;
}

export default function LessonOutput({ output, langLabel, onClear }: LessonOutputProps) {
  return (
    <div className="flex flex-col h-full bg-[#0d0d14]">
      {/* Output header */}
      <div className="flex items-center justify-between px-4 h-10 bg-[#1a1a28] border-b border-[#2e2e3e] shrink-0">
        <span className="text-[10px] text-[#888] font-mono uppercase tracking-widest">Output</span>
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
              onClick={onClear}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {output === null ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 text-[#333] select-none">
            <Play className="w-8 h-8 opacity-20" />
            <span className="text-xs font-mono opacity-40">Run your code to see output</span>
          </div>
        ) : (
          <pre
            className={`p-4 text-[13px] leading-relaxed font-mono whitespace-pre-wrap break-words ${
              isErrorOutput(output)
                ? 'text-[#f87171]'
                : output === 'Running...'
                ? 'text-[#888]'
                : 'text-[#86efac]'
            }`}
          >
            {output}
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}
