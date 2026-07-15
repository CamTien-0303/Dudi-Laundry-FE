import React from 'react';

interface TableToolbarProps {
  title?: string;
  description?: string;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function TableToolbar({
  title,
  description,
  selectedCount = 0,
  bulkActions,
  actions,
  className = '',
}: TableToolbarProps) {
  const hasSelected = selectedCount > 0;

  return (
    <div className={`flex items-center justify-between gap-4 py-3 flex-wrap ${className}`}>
      <div className="flex-1 min-w-[200px]">
        {hasSelected ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary px-2.5 py-1 rounded bg-primary/10 select-none">
              Đã chọn {selectedCount} dòng
            </span>
            {bulkActions && <div className="flex items-center gap-2">{bulkActions}</div>}
          </div>
        ) : (
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
          </div>
        )}
      </div>
      {!hasSelected && actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
