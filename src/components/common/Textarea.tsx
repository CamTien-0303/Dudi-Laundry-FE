import React, { useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({
  label,
  error,
  helperText,
  className = '',
  disabled,
  ...props
}: TextareaProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${disabled ? 'opacity-60' : ''}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-foreground/90">
          {label}
        </label>
      )}
      <textarea
        id={id}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`w-full px-3.5 py-2 text-sm bg-surface border rounded-md outline-none transition-all resize-y min-h-[80px]
          placeholder:text-muted/70 text-foreground
          ${
            error
              ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger'
              : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
          }
          ${disabled ? 'cursor-not-allowed bg-background' : 'hover:border-muted/50'}
          ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs text-danger font-medium mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-muted/80 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
