import type { ReactNode } from 'react';
import AppLogo from '../common/AppLogo';
import { Menu } from 'lucide-react';
import Button from '../common/Button';

interface SidebarProps {
  children: ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  children,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`h-screen sticky top-0 bg-surface border-r border-border flex flex-col shrink-0 transition-all duration-300 z-30 select-none
        ${collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'}`}
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40 shrink-0">
        <AppLogo collapsed={collapsed} />
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1 text-muted hover:text-foreground hidden sm:flex"
            aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            <Menu size={18} />
          </Button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2.5 flex flex-col gap-1 overflow-y-auto">
        {children}
      </nav>

      <div className="p-4 border-t border-border/40 shrink-0">
        {collapsed ? (
          <div className="text-center text-[10px] font-bold text-primary">v0.1</div>
        ) : (
          <p className="text-xs text-muted/80 font-medium">Phiên bản v0.1.0</p>
        )}
      </div>
    </aside>
  );
}
