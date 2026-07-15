import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import type { ButtonVariant, ButtonSize } from '../../types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export default function Button({
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  ...restProps
}: ButtonProps) {
  const mergedClassName = `btn btn--${variant} btn--${size} ${loading ? 'opacity-80 cursor-wait' : ''} ${className}`;

  return (
    <button
      {...restProps}
      type={type}
      disabled={disabled || loading}
      className={mergedClassName}
    >
      {loading ? (
        <span className="flex items-center gap-1.5 justify-center">
          <Loader2 size={16} className="animate-spin" />
          <span>Đang tải...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
