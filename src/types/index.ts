// DUDI Laundry - Type Definitions

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface CardData {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
