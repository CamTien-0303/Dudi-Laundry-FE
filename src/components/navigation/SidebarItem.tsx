import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import Tooltip from '../common/Tooltip';

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  collapsed?: boolean;
}

export default function SidebarItem({ to, icon, label, collapsed = false }: SidebarItemProps) {
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all select-none
        ${
          isActive
            ? 'bg-primary/10 text-primary font-bold'
            : 'text-muted hover:text-foreground hover:bg-background/80'
        }
        ${collapsed ? 'justify-center px-1' : ''}`
      }
    >
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} position="right" className="w-full">
        {content}
      </Tooltip>
    );
  }

  return content;
}
