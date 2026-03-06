'use client';

import { BookOpen, Code2, Terminal } from 'lucide-react';

export type MobileTab = 'learn' | 'code' | 'output';

const TABS: { id: MobileTab; label: string; Icon: React.ElementType }[] = [
  { id: 'learn',  label: 'Learn',  Icon: BookOpen  },
  { id: 'code',   label: 'Code',   Icon: Code2     },
  { id: 'output', label: 'Output', Icon: Terminal  },
];

interface LessonMobileTabsProps {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}

export default function LessonMobileTabs({ active, onChange }: LessonMobileTabsProps) {
  return (
    <div className="flex items-center bg-[#16161e] border-b border-[#2e2e3e] shrink-0">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] transition-colors
            ${active === id
              ? 'font-bold text-white border-b-2 border-[#5b4fcf]'
              : 'font-normal text-[#666] border-b-2 border-transparent hover:text-[#aaa]'
            }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
