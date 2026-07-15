import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Đang tải dữ liệu...' }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <Loader2 size={36} className="loading-state__spinner" />
      <p className="loading-state__message">{message}</p>
    </div>
  );
}
