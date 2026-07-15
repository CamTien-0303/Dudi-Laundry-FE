import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  DataTable,
  FilterBar,
  FilterChip,
  SearchInput,
  RowActions,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

export default function StoreOrders() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const orders = [
    { id: '#DL-001', customer: 'Nguyễn Văn A', service: 'Giặt sấy 5kg', status: 'Đang giặt', variant: 'info' as const, amount: '120.000đ' },
    { id: '#DL-002', customer: 'Trần Thị B', service: 'Giặt hấp 3kg', status: 'Chờ giao', variant: 'warning' as const, amount: '250.000đ' },
    { id: '#DL-003', customer: 'Lê Văn C', service: 'Giặt sấy 8kg', status: 'Hoàn thành', variant: 'success' as const, amount: '180.000đ' },
    { id: '#DL-004', customer: 'Phạm Thị D', service: 'Giặt khô 2kg', status: 'Tiếp nhận', variant: 'default' as const, amount: '300.000đ' },
    { id: '#DL-005', customer: 'Hoàng Văn E', service: 'Giặt sấy 4kg', status: 'Đang giặt', variant: 'info' as const, amount: '95.000đ' },
  ];

  const columns = [
    { key: 'id', header: 'Mã đơn' },
    { key: 'customer', header: 'Khách hàng', render: (row: typeof orders[0]) => <span className="font-semibold text-foreground/80">{row.customer}</span> },
    { key: 'service', header: 'Dịch vụ' },
    { key: 'amount', header: 'Số tiền', className: 'font-semibold text-foreground/90' },
    { key: 'status', header: 'Trạng thái', render: (row: typeof orders[0]) => <StatusBadge label={row.status} variant={row.variant} /> },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (row: typeof orders[0]) => (
        <RowActions
          onView={() => toast(`Xem chi tiết đơn hàng ${row.id}`)}
          onEdit={() => toast(`Sửa đơn hàng ${row.id}`)}
          onDelete={() => toast(`Xóa đơn hàng ${row.id}`, 'warning')}
        />
      ),
    },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <PageHeader
        title="Quản lý đơn hàng"
        description="Xem và quản lý tất cả đơn hàng của cửa hàng."
        breadcrumb={[
          { label: 'Cửa hàng', to: '/store/dashboard' },
          { label: 'Đơn hàng' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={() => toast('Mở form tạo đơn mới')}>
            <Plus size={16} />
            Tạo đơn hàng
          </Button>
        }
      />

      {/* Filter panel */}
      <FilterBar onClear={() => setSearch('')} showClear={!!search}>
        <div className="w-56">
          <SearchInput
            placeholder="Tìm mã đơn, tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
        {search && <FilterChip label="Tìm kiếm" value={search} onRemove={() => setSearch('')} />}
      </FilterBar>

      {/* Main Table */}
      <DataTable
        columns={columns}
        rows={filteredOrders}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          onPageChange: (p) => toast(`Trang ${p}`),
        }}
      />
    </div>
  );
}
