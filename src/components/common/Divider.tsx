import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string | React.ReactNode;
}

export default function Divider({
  orientation = 'horizontal',
  className = '',
  label,
}: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] self-stretch bg-border/60 ${className}`} />;
  }

  if (label) {
    return (
      <div className={`flex items-center gap-3 w-full my-4 text-xs font-semibold text-muted/80 ${className}`}>
        <div className="flex-1 h-[1px] bg-border/60" />
        <span>{label}</span>
        <div className="flex-1 h-[1px] bg-border/60" />
      </div>
    );
  }

  return <div className={`h-[1px] w-full bg-border/60 my-4 ${className}`} />;
}
