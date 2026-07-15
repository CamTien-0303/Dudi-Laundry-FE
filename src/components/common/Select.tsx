import React, { useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  helperText?: string;
}

export default function Select({
  label,
  options,
  error,
  helperText,
  className = '',
  disabled,
  ...props
}: SelectProps) {
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
      <div className="relative w-full">
        <select
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`w-full px-3.5 py-2 text-sm bg-surface border rounded-md outline-none transition-all appearance-none
            text-foreground pr-10
            ${
              error
                ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger'
                : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
            }
            ${disabled ? 'cursor-not-allowed bg-background' : 'hover:border-muted/50 cursor-pointer'}
            ${className}`}
          {...props}
        >
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={i} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        {/* Custom arrow indicator */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
          <svg
            className="w-4.5 h-4.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
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
