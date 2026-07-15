import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 28,
  message,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <Loader2
        size={size}
        className="animate-spin text-primary"
      />
      {message && <p className="text-xs text-muted/90 font-medium">{message}</p>}
    </div>
  );
}
