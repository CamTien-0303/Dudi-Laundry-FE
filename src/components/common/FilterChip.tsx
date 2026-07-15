import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove?: () => void;
  className?: string;
}

export default function FilterChip({
  label,
  value,
  onRemove,
  className = '',
}: FilterChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 select-none ${className}`}
    >
      <span>{label}:</span>
      <span className="font-semibold text-foreground/80">{value}</span>
      {onRemove && (
        <button
          type="button"
          className="text-primary/70 hover:text-primary cursor-pointer focus:outline-none ml-0.5 rounded-full"
          onClick={onRemove}
          aria-label="Xóa bộ lọc"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
