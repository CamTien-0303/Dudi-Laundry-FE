import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'default';
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  variant = 'default',
  className = '',
}: StatCardProps) {
  const getColors = () => {
    switch (variant) {
      case 'info':
        return {
          bg: 'bg-info/10 text-info',
          border: 'border-info/20',
          dot: 'bg-info',
        };
      case 'success':
        return {
          bg: 'bg-success/10 text-success',
          border: 'border-success/20',
          dot: 'bg-success',
        };
      case 'warning':
        return {
          bg: 'bg-warning/10 text-warning',
          border: 'border-warning/20',
          dot: 'bg-warning',
        };
      case 'danger':
        return {
          bg: 'bg-danger/10 text-danger',
          border: 'border-danger/20',
          dot: 'bg-danger',
        };
      default:
        return {
          bg: 'bg-foreground/5 text-foreground/70',
          border: 'border-border',
          dot: 'bg-muted',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`bg-surface border border-border rounded-xl shadow-sm relative flex flex-col justify-between ${className}`}
      style={{ minHeight: '140px', padding: '24px' }}
    >
      {/* Visual top accent indicator */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl ${colors.dot}`} />
      
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted tracking-wide uppercase block">{title}</p>
          <h3 className="text-2xl font-bold text-foreground block" style={{ marginTop: '8px' }}>{value}</h3>
        </div>
        {icon && (
          <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
            {icon}
          </span>
        )}
      </div>

      {(trend || description) && (
        <div className="flex items-center gap-2 text-xs flex-wrap" style={{ marginTop: '24px' }}>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 font-semibold shrink-0
              ${trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-danger' : 'text-muted'}`}
            >
              {trend.direction === 'up' && <TrendingUp size={14} />}
              {trend.direction === 'down' && <TrendingDown size={14} />}
              {trend.direction === 'neutral' && <Minus size={14} />}
              <span>{trend.value}</span>
            </span>
          )}
          {description && <span className="text-muted/80">{description}</span>}
        </div>
      )}
    </div>
  );
}
