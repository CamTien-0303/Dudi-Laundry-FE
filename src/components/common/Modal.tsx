import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Block body scroll
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Escape key press handler
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full bg-surface border border-border rounded-xl shadow-xl flex flex-col max-h-[90vh] ${sizeClasses[size]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground">
            {title || 'Thông tin'}
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
