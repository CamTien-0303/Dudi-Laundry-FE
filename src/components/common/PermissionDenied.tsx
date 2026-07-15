import { ShieldAlert } from 'lucide-react';
import Button from './Button';

interface PermissionDeniedProps {
  onBack?: () => void;
  className?: string;
}

export default function PermissionDenied({ onBack, className = '' }: PermissionDeniedProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-border/80 rounded-xl bg-surface max-w-sm mx-auto shadow-sm ${className}`}>
      <span className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
        <ShieldAlert size={24} />
      </span>
      <h3 className="text-base font-semibold text-foreground">Không có quyền truy cập</h3>
      <p className="text-sm text-muted mt-1 mb-5">
        Tài khoản của bạn không có đủ thẩm quyền để xem nội dung trang này.
      </p>
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack}>
          Quay lại trang chính
        </Button>
      )}
    </div>
  );
}
