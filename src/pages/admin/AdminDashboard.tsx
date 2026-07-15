import {
  Building2,
  Users,
  DollarSign,
  Activity,
} from 'lucide-react';
import { PageHeader, StatCard, DataTable, StatusBadge } from '../../components/common';

export default function AdminDashboard() {
  const topStores = [
    { name: 'DUDI Quận 1', count: '245 đơn / tháng', status: 'Xuất sắc', variant: 'success' as const },
    { name: 'DUDI Quận 7', count: '198 đơn / tháng', status: 'Tốt', variant: 'info' as const },
    { name: 'DUDI Thủ Đức', count: '156 đơn / tháng', status: 'Tốt', variant: 'info' as const },
  ];

  const columns = [
    { key: 'name', header: 'Tên cửa hàng', render: (row: typeof topStores[0]) => <span className="font-semibold text-foreground/80">{row.name}</span> },
    { key: 'count', header: 'Hiệu suất' },
    { key: 'status', header: 'Đánh giá', className: 'text-right', render: (row: typeof topStores[0]) => <StatusBadge label={row.status} variant={row.variant} /> },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <PageHeader
        title="Tổng quan hệ thống"
        description="Giám sát toàn bộ hoạt động của hệ thống DUDI Laundry."
      />

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Cửa hàng"
          value="12"
          icon={<Building2 size={20} />}
          variant="info"
          trend={{ value: '+2 tháng này', direction: 'up' }}
        />
        <StatCard
          title="Tổng doanh thu"
          value="128M"
          icon={<DollarSign size={20} />}
          variant="success"
          trend={{ value: '+15% so với tháng trước', direction: 'up' }}
        />
        <StatCard
          title="Người dùng"
          value="3.2K"
          icon={<Users size={20} />}
          variant="default"
          trend={{ value: '+320 tháng này', direction: 'up' }}
        />
        <StatCard
          title="Tỉ lệ hoạt động"
          value="98.5%"
          icon={<Activity size={20} />}
          variant="warning"
          trend={{ value: 'Ổn định', direction: 'neutral' }}
        />
      </div>

      {/* Top Stores Table */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-foreground">Cửa hàng hoạt động tốt nhất</h2>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <DataTable
            columns={columns}
            rows={topStores}
          />
        </div>
      </div>
    </div>
  );
}
