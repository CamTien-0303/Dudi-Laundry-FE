import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-surface border border-border/60 rounded-xl mt-4 gap-4 flex-wrap select-none ${className}`}>
      <span className="text-xs text-muted/90 font-medium">
        Trang <strong>{currentPage}</strong> trên <strong>{totalPages}</strong>
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-1.5 min-w-[32px]"
        >
          <ChevronLeft size={16} />
        </Button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          const isCurrent = page === currentPage;
          return (
            <Button
              key={page}
              variant={isCurrent ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-1.5 min-w-[32px]"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
