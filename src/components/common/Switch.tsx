import React, { useId } from 'react';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
}

export default function Switch({
  label,
  className = '',
  disabled,
  ...props
}: SwitchProps) {
  const id = useId();

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />
      <div className={`relative w-9 h-5 bg-border rounded-full transition-all peer-checked:bg-primary
        peer-focus:ring-2 peer-focus:ring-primary/20
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4
        ${disabled ? '' : 'hover:border-muted/30'}
        ${className}`}
      />
      {label && (
        <span className="text-sm font-medium text-foreground/80 leading-none">
          {label}
        </span>
      )}
    </label>
  );
}
