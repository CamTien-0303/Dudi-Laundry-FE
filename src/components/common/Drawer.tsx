import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
}: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    right: 'right-0 inset-y-0 h-full max-w-sm border-l animate-slideLeft',
    left: 'left-0 inset-y-0 h-full max-w-sm border-r animate-slideRight',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`absolute w-full bg-surface border-border shadow-xl flex flex-col ${positionClasses[position]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground">
            {title || 'Danh mục'}
          </h3>
          <button
            type="button"
            className="text-muted hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary rounded p-0.5"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto text-sm text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  );
}
