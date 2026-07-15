import type { ReactNode } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Button from './Button';

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  extraActions?: ReactNode;
  className?: string;
}

export default function RowActions({
  onView,
  onEdit,
  onDelete,
  extraActions,
  className = '',
}: RowActionsProps) {
  return (
    <div className={`flex items-center gap-1.5 justify-end ${className}`}>
      {onView && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="p-1 text-muted hover:text-primary hover:bg-primary/5 rounded"
          title="Xem chi tiết"
        >
          <Eye size={15} />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="p-1 text-muted hover:text-warning hover:bg-warning/5 rounded"
          title="Chỉnh sửa"
        >
          <Edit2 size={15} />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="p-1 text-muted hover:text-danger hover:bg-danger/5 rounded"
          title="Xóa"
        >
          <Trash2 size={15} />
        </Button>
      )}
      {extraActions}
    </div>
  );
}
