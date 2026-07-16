import { useState } from 'react';
import { Outlet } from 'react-router';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  Package,
  DollarSign,
  History,
  Printer,
} from 'lucide-react';
import { Sidebar, SidebarItem, Topbar } from '../../components/navigation';
import Drawer from '../../components/common/Drawer';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = (
    <>
      <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Tổng quan" collapsed={collapsed} />
      <SidebarItem to="/admin/partners" icon={<Building2 size={18} />} label="Đối tác" collapsed={collapsed} />
      <SidebarItem to="/admin/plans" icon={<Package size={18} />} label="Gói dịch vụ" collapsed={collapsed} />
      <SidebarItem to="/admin/transactions" icon={<DollarSign size={18} />} label="Tài chính" collapsed={collapsed} />
      <SidebarItem to="/admin/renewals" icon={<History size={18} />} label="Gia hạn" collapsed={collapsed} />
      <SidebarItem to="/admin/zalo-invoice" icon={<Printer size={18} />} label="Cấu hình Zalo & In ấn" collapsed={collapsed} />
      <SidebarItem to="/admin/users" icon={<Users size={18} />} label="Người dùng" collapsed={collapsed} />
      <SidebarItem to="/admin/reports" icon={<BarChart3 size={18} />} label="Báo cáo" collapsed={collapsed} />
      <SidebarItem to="/admin/settings" icon={<Settings size={18} />} label="Cài đặt" collapsed={collapsed} />
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
        title="DUDI Admin"
        className="w-[280px]"
      >
        <div className="flex flex-col gap-1.5 py-2" onClick={() => setMobileOpen(false)}>
          <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Tổng quan" />
          <SidebarItem to="/admin/partners" icon={<Building2 size={18} />} label="Đối tác" />
          <SidebarItem to="/admin/plans" icon={<Package size={18} />} label="Gói dịch vụ" />
          <SidebarItem to="/admin/transactions" icon={<DollarSign size={18} />} label="Tài chính" />
          <SidebarItem to="/admin/renewals" icon={<History size={18} />} label="Gia hạn" />
          <SidebarItem to="/admin/zalo-invoice" icon={<Printer size={18} />} label="Cấu hình Zalo & In ấn" />
          <SidebarItem to="/admin/users" icon={<Users size={18} />} label="Người dùng" />
          <SidebarItem to="/admin/reports" icon={<BarChart3 size={18} />} label="Báo cáo" />
          <SidebarItem to="/admin/settings" icon={<Settings size={18} />} label="Cài đặt" />
        </div>
      </Drawer>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Topbar
          showSearch
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 min-w-0">
          <div className="w-full px-6 py-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
