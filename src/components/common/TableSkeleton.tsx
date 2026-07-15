interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export default function TableSkeleton({
  rows = 5,
  cols = 4,
  className = '',
}: TableSkeletonProps) {
  return (
    <div className={`w-full border border-border/60 rounded-xl overflow-hidden bg-surface animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex border-b border-border/80 bg-background/50 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-4 bg-border rounded-md mr-4 last:mr-0"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex border-b border-border/40 px-4 py-4.5 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="flex-1 h-3.5 bg-border/60 rounded-md mr-4 last:mr-0"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
