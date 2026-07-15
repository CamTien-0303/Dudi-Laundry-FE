import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  DataTable,
  FilterBar,
  SearchInput,
  RowActions,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

export default function AdminPartners() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const partners = [
    { name: 'DUDI Quận 1', address: '123 Nguyễn Huệ, Q.1', phone: '028 1234 5678', status: 'Hoạt động', variant: 'success' as const },
    { name: 'DUDI Quận 3', address: '456 Võ Văn Tần, Q.3', phone: '028 2345 6789', status: 'Hoạt động', variant: 'success' as const },
    { name: 'DUDI Quận 7', address: '789 Nguyễn Hữu Thọ, Q.7', phone: '028 3456 7890', status: 'Hoạt động', variant: 'success' as const },
    { name: 'DUDI Thủ Đức', address: '101 Võ Văn Ngân, Thủ Đức', phone: '028 4567 8901', status: 'Tạm ngưng', variant: 'warning' as const },
    { name: 'DUDI Bình Thạnh', address: '202 Xô Viết Nghệ Tĩnh, Bình Thạnh', phone: '028 5678 9012', status: 'Đang mở', variant: 'info' as const },
  ];

  const columns = [
    { key: 'name', header: 'Tên đối tác', render: (row: typeof partners[0]) => <span className="font-semibold text-foreground/80">{row.name}</span> },
    { key: 'address', header: 'Địa chỉ' },
    { key: 'phone', header: 'Số điện thoại' },
    { key: 'status', header: 'Trạng thái', render: (row: typeof partners[0]) => <StatusBadge label={row.status} variant={row.variant} /> },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (row: typeof partners[0]) => (
        <RowActions
          onView={() => toast(`Xem chi tiết đối tác ${row.name}`)}
          onEdit={() => toast(`Chỉnh sửa đối tác ${row.name}`)}
          onDelete={() => toast(`Xóa đối tác ${row.name}`, 'warning')}
        />
      ),
    },
  ];

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <PageHeader
        title="Quản lý đối tác"
        description="Quản lý danh sách cửa hàng đối tác trong hệ thống."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Đối tác' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={() => toast('Mở hộp thoại thêm đối tác mới')}>
            <Plus size={16} />
            Thêm đối tác
          </Button>
        }
      />

      {/* Filter section */}
      <FilterBar onClear={() => setSearch('')} showClear={!!search}>
        <div className="w-56">
          <SearchInput
            placeholder="Tìm tên, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
      </FilterBar>

      {/* Partners List Table */}
      <DataTable
        columns={columns}
        rows={filteredPartners}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          onPageChange: (p) => toast(`Trang ${p}`),
        }}
      />
    </div>
  );
}
