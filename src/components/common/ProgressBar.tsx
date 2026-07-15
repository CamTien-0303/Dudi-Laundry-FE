interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: 'info' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  variant = 'info',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, value));

  const colors = {
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold text-foreground/80">
          <span>Tiến độ</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-border/60 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
