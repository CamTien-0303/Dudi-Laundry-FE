import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  DataTable,
  FilterBar,
  FilterChip,
  SearchInput,
} from '../../components/common';
import { useOrderStore } from '../../mocks/orderStore';
import type { Order } from '../../mocks/orderStore';

export default function StoreOrders() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const columns = [
    { key: 'id', header: 'Mã đơn' },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (row: Order) => (
        <div className="flex flex-col gap-0.5 text-left">
          <span className="font-semibold text-slate-900">{row.customerName}</span>
          <span className="text-[10px] text-slate-500">{row.customerPhone}</span>
        </div>
      ),
    },
    { key: 'serviceName', header: 'Dịch vụ' },
    {
      key: 'amount',
      header: 'Tổng tiền',
      render: (row: Order) => <span className="font-semibold text-slate-900">{row.amount.toLocaleString('vi-VN')}đ</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: Order) => {
        const map = {
          RECEIVED: { label: 'Nhận đồ', variant: 'default' as const },
          WASHING: { label: 'Đang giặt', variant: 'info' as const },
          DRYING_IRONING: { label: 'Đang sấy/ủi/gấp', variant: 'warning' as const },
          READY: { label: 'Hoàn tất', variant: 'success' as const },
          RETURNED: { label: 'Đã trả khách', variant: 'success' as const },
          CANCELLED: { label: 'Đã hủy', variant: 'error' as const },
        };
        const item = map[row.status] || { label: row.status, variant: 'default' };
        return <StatusBadge label={item.label} variant={item.variant} />;
      },
    },
    {
      key: 'paymentStatus',
      header: 'Thanh toán',
      render: (row: Order) => {
        const map = {
          PAID: { label: 'Đã thanh toán', variant: 'success' as const },
          UNPAID: { label: 'Chưa thanh toán', variant: 'error' as const },
          PARTIAL: { label: 'Một phần', variant: 'warning' as const },
        };
        const item = map[row.paymentStatus] || { label: row.paymentStatus, variant: 'default' };
        return <StatusBadge label={item.label} variant={item.variant} />;
      },
    },
    {
      key: 'createdAt',
      header: 'Thời gian tạo',
      render: (row: Order) => {
        const date = new Date(row.createdAt);
        return <span className="text-slate-500">{date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} {date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}</span>;
      },
    },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

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
          <Button variant="primary" size="sm" onClick={() => navigate('/store/orders/new')}>
            <Plus size={16} />
            Tạo đơn hàng
          </Button>
        }
      />

      {/* Filter panel */}
      <FilterBar onClear={() => { setSearch(''); setSelectedStatus('ALL'); }} showClear={!!search || selectedStatus !== 'ALL'}>
        <div className="w-56">
          <SearchInput
            placeholder="Tìm mã đơn, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
        
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:border-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="RECEIVED">Nhận đồ (RECEIVED)</option>
            <option value="WASHING">Đang giặt (WASHING)</option>
            <option value="DRYING_IRONING">Đang sấy/ủi/gấp (DRYING_IRONING)</option>
            <option value="READY">Hoàn tất (READY)</option>
            <option value="RETURNED">Đã trả khách (RETURNED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </select>
        </div>

        {search && <FilterChip label="Tìm kiếm" value={search} onRemove={() => setSearch('')} />}
        {selectedStatus !== 'ALL' && <FilterChip label="Trạng thái" value={selectedStatus} onRemove={() => setSelectedStatus('ALL')} />}
      </FilterBar>

      {/* Main Table */}
      <DataTable
        columns={columns}
        rows={filteredOrders}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          onPageChange: () => {},
        }}
      />
    </div>
  );
}
