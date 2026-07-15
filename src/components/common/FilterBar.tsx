import React from 'react';
import { Filter, X } from 'lucide-react';
import Button from './Button';

interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  showClear?: boolean;
  className?: string;
}

export default function FilterBar({
  children,
  onClear,
  showClear = false,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3.5 px-4 py-3 bg-surface border border-border/80 rounded-xl ${className}`}>
      <div className="flex items-center gap-2 text-xs font-bold text-foreground/80 mr-1.5 shrink-0 select-none">
        <Filter size={14} className="text-primary" />
        <span>BỘ LỌC</span>
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {children}
      </div>
      {showClear && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs font-semibold hover:bg-danger/5 hover:text-danger select-none shrink-0">
          <X size={14} />
          Xóa lọc
        </Button>
      )}
    </div>
  );
}
