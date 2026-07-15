import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section className={`bg-surface border border-border rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
