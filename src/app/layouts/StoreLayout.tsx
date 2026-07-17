import { useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import {
  LayoutDashboard,
  ClipboardList,
  WashingMachine,
  Users,
  Package,
  UserCheck,
  BarChart3,
  Settings,
  Handshake,
  Gift,
} from 'lucide-react';
import { Sidebar, SidebarItem, Topbar } from '../../components/navigation';
import Drawer from '../../components/common/Drawer';
import Tooltip from '../../components/common/Tooltip';

interface ExactSidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}

function ExactSidebarItem({ to, icon, label, collapsed = false }: ExactSidebarItemProps) {
  const content = (
    <NavLink
      to={to}
      end
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

export default function StoreLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = (
    <>
      <SidebarItem to="/store/dashboard" icon={<LayoutDashboard size={18} />} label="Tổng quan" collapsed={collapsed} />
      <SidebarItem to="/store/operations" icon={<WashingMachine size={18} />} label="Vận hành" collapsed={collapsed} />
      <SidebarItem to="/store/orders" icon={<ClipboardList size={18} />} label="Đơn hàng" collapsed={collapsed} />
      <ExactSidebarItem to="/store/customers" icon={<Users size={18} />} label="Khách hàng" collapsed={collapsed} />
      <SidebarItem to="/store/customers/loyalty" icon={<Gift size={18} />} label="Cấu hình tích điểm" collapsed={collapsed} />
      <SidebarItem to="/store/inventory" icon={<Package size={18} />} label="Kho vật tư" collapsed={collapsed} />
      <SidebarItem to="/store/staff" icon={<UserCheck size={18} />} label="Nhân sự" collapsed={collapsed} />
      <SidebarItem to="/store/reports" icon={<BarChart3 size={18} />} label="Báo cáo" collapsed={collapsed} />
      <SidebarItem to="/store/b2b" icon={<Handshake size={18} />} label="Đối tác B2B" collapsed={collapsed} />
      <SidebarItem to="/store/settings/branches" icon={<Settings size={18} />} label="Quản lý chi nhánh" collapsed={collapsed} />
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)}>
          {menuItems}
        </Sidebar>
      </div>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        position="left"
        title="DUDI Laundry"
        className="w-[280px]"
      >
        <div className="flex flex-col gap-1.5 py-2" onClick={() => setMobileOpen(false)}>
          <SidebarItem to="/store/dashboard" icon={<LayoutDashboard size={18} />} label="Tổng quan" />
          <SidebarItem to="/store/operations" icon={<WashingMachine size={18} />} label="Vận hành" />
          <SidebarItem to="/store/orders" icon={<ClipboardList size={18} />} label="Đơn hàng" />
          <ExactSidebarItem to="/store/customers" icon={<Users size={18} />} label="Khách hàng" />
          <SidebarItem to="/store/customers/loyalty" icon={<Gift size={18} />} label="Cấu hình tích điểm" />
          <SidebarItem to="/store/inventory" icon={<Package size={18} />} label="Kho vật tư" />
          <SidebarItem to="/store/staff" icon={<UserCheck size={18} />} label="Nhân sự" />
          <SidebarItem to="/store/reports" icon={<BarChart3 size={18} />} label="Báo cáo" />
          <SidebarItem to="/store/b2b" icon={<Handshake size={18} />} label="Đối tác B2B" />
          <SidebarItem to="/store/settings/branches" icon={<Settings size={18} />} label="Quản lý chi nhánh" />
        </div>
      </Drawer>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Topbar
          showBranchSelector
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
