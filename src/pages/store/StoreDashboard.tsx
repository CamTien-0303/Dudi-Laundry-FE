import {
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
} from 'lucide-react';
import { PageHeader, StatCard, DataTable, StatusBadge } from '../../components/common';

export default function StoreDashboard() {
  const recentOrders = [
    { id: '#DL-2024-001', customer: 'Nguyễn Văn A', status: 'Đang giặt', variant: 'info' as const },
    { id: '#DL-2024-002', customer: 'Trần Thị B', status: 'Chờ giao', variant: 'warning' as const },
    { id: '#DL-2024-003', customer: 'Lê Văn C', status: 'Hoàn thành', variant: 'success' as const },
  ];

  const columns = [
    { key: 'id', header: 'Mã đơn' },
    { key: 'customer', header: 'Khách hàng', render: (row: typeof recentOrders[0]) => <span className="font-semibold text-foreground/80">{row.customer}</span> },
    { key: 'status', header: 'Trạng thái', className: 'text-right', render: (row: typeof recentOrders[0]) => <StatusBadge label={row.status} variant={row.variant} /> },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <PageHeader
        title="Tổng quan cửa hàng"
        description="Theo dõi hoạt động và hiệu suất cửa hàng của bạn."
      />

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Đơn hôm nay"
          value="24"
          icon={<ShoppingBag size={20} />}
          variant="info"
          trend={{ value: '+12% so với hôm qua', direction: 'up' }}
        />
        <StatCard
          title="Doanh thu"
          value="2.4M"
          icon={<DollarSign size={20} />}
          variant="success"
          trend={{ value: '+8% so với hôm qua', direction: 'up' }}
        />
        <StatCard
          title="Khách hàng"
          value="156"
          icon={<Users size={20} />}
          variant="default"
          trend={{ value: '+5 khách mới', direction: 'up' }}
        />
        <StatCard
          title="Đang xử lý"
          value="8"
          icon={<Clock size={20} />}
          variant="warning"
          trend={{ value: '3 sắp hoàn thành', direction: 'neutral' }}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-foreground">Đơn hàng gần đây</h2>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <DataTable
            columns={columns}
            rows={recentOrders}
          />
        </div>
      </div>
    </div>
  );
}
