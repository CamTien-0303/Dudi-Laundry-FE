import type { BadgeVariant } from '../../types';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export default function StatusBadge({ label, variant = 'default' }: StatusBadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {label}
    </span>
  );
}
