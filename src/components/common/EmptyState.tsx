import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'Không có dữ liệu',
  message = 'Chưa có dữ liệu nào để hiển thị.',
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Inbox size={48} className="empty-state__icon" />
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
