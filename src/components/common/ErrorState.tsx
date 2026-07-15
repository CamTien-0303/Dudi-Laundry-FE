import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Đã xảy ra lỗi',
  message = 'Hệ thống gặp sự cố khi tải dữ liệu. Vui lòng thử lại.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-danger/20 rounded-xl bg-danger/5 max-w-md mx-auto ${className}`}>
      <span className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
        <AlertCircle size={24} />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted mt-1 mb-5">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw size={14} />
          Tải lại trang
        </Button>
      )}
    </div>
  );
}
