import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface InlineAlertProps {
  variant?: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  message: string | React.ReactNode;
  className?: string;
}

export default function InlineAlert({
  variant = 'info',
  title,
  message,
  className = '',
}: InlineAlertProps) {
  const styles = {
    success: {
      bg: 'bg-success/5 border-success/20 text-success',
      icon: <CheckCircle2 size={16} className="shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-danger/5 border-danger/20 text-danger',
      icon: <AlertCircle size={16} className="shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-warning/5 border-warning/20 text-warning',
      icon: <AlertTriangle size={16} className="shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-info/5 border-info/20 text-info',
      icon: <Info size={16} className="shrink-0 mt-0.5" />,
    },
  };

  const current = styles[variant];

  return (
    <div className={`flex gap-2.5 p-3 rounded-lg border text-sm ${current.bg} ${className}`}>
      {current.icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5 leading-tight">{title}</h4>}
        <div className="text-xs text-foreground/80 leading-relaxed">{message}</div>
      </div>
    </div>
  );
}
