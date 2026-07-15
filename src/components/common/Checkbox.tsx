import React, { useId } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
  error?: string;
}

export default function Checkbox({
  label,
  error,
  className = '',
  disabled,
  ...props
}: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`flex flex-col gap-1 ${disabled ? 'opacity-60' : ''}`}>
      <label className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <div className={`w-4.5 h-4.5 rounded border border-border bg-surface flex items-center justify-center transition-all mt-0.5
          peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:bg-primary peer-checked:border-primary
          ${disabled ? 'cursor-not-allowed bg-background peer-checked:bg-muted peer-checked:border-muted' : 'hover:border-primary/60'}
          ${className}`}
        >
          {/* Checkmark Icon */}
          <svg
            className="w-3 h-3 text-white hidden peer-checked:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && (
          <span className="text-sm text-foreground/80 font-medium leading-tight">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p id={errorId} className="text-xs text-danger font-medium pl-7">
          {error}
        </p>
      )}
    </div>
  );
}
