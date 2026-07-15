import { Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import type { ConfirmDialogProps } from './ConfirmDialog';

export default function DeleteConfirmDialog({
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
  confirmText = 'Xóa',
  ...props
}: Omit<ConfirmDialogProps, 'variant'>) {
  return (
    <ConfirmDialog
      title={title}
      confirmText={confirmText}
      variant="danger"
      message={
        <div className="flex gap-3 items-start">
          <span className="w-9 h-9 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
            <Trash2 size={18} />
          </span>
          <div className="flex-1 mt-1 leading-relaxed">
            {message}
          </div>
        </div>
      }
      {...props}
    />
  );
}
