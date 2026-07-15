import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles,
  Plus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Button,
  StatusBadge,
  PageHeader,
  Input,
  PasswordInput,
  Textarea,
  Select,
  Checkbox,
  Switch,
  SearchInput,
  SectionCard,
  StatCard,
  Divider,
  ProgressBar,
  LoadingSpinner,
  TableSkeleton,
  InlineAlert,
  Modal,
  Drawer,
  ConfirmDialog,
  DeleteConfirmDialog,
  FilterBar,
  FilterChip,
  TableToolbar,
  RowActions,
  DataTable,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

export default function DevUiPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Component States
  const [inputText, setInputText] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  // Modal / Overlay States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Toast handlers
  const triggerToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    toast(`Đây là thông báo ${type} thử nghiệm!`, type);
  };

  // Mock Table Data
  const columns = [
    { key: 'id', header: 'Mã đơn' },
    { key: 'customer', header: 'Khách hàng', render: (row: any) => <span className="font-semibold">{row.customer}</span> },
    { key: 'service', header: 'Dịch vụ' },
    { key: 'status', header: 'Trạng thái', render: (row: any) => <StatusBadge label={row.status} variant={row.variant} /> },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (row: any) => (
        <RowActions
          onView={() => toast(`Xem chi tiết đơn ${row.id}`)}
          onEdit={() => toast(`Chỉnh sửa đơn ${row.id}`)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      ),
    },
  ];

  const rows = [
    { id: 'DL-001', customer: 'Nguyễn Văn A', service: 'Giặt sấy 5kg', status: 'Đang giặt', variant: 'info' as const },
    { id: 'DL-002', customer: 'Trần Thị B', service: 'Giặt hấp cao cấp', status: 'Chờ giao', variant: 'warning' as const },
    { id: 'DL-003', customer: 'Lê Văn C', service: 'Ủi hơi nước', status: 'Hoàn thành', variant: 'success' as const },
  ];

  return (
    <div className="min-h-dvh bg-background p-4 sm:p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-8 animate-fadeIn">
      {/* Gallery Header */}
      <PageHeader
        title="DUDI Laundry UI Gallery"
        description="Development showcase page to test all system elements, layouts, forms, and states."
        breadcrumb={[
          { label: 'Trang chủ', to: '/store/dashboard' },
          { label: 'UI Gallery' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/store/dashboard')}>
            Vào Trang Cửa Hàng
          </Button>
        }
      />

      {/* Grid of Sections */}
      <div className="flex flex-col gap-6">
        
        {/* Buttons Showcase */}
        <SectionCard title="1. Button Variants & Sizes">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
          <Divider label="Trạng thái đặc biệt" />
          <div className="flex flex-wrap gap-3 items-center mt-3">
            <Button variant="primary" disabled>
              Disabled State
            </Button>
            <Button variant="primary" className="btn--loading" disabled>
              Loading State
            </Button>
          </div>
        </SectionCard>

        {/* Inputs & Form Elements Showcase */}
        <SectionCard title="2. Form Inputs & Controls">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên khách hàng"
              placeholder="Nhập tên..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              helperText="Nhập đầy đủ họ tên như trên thẻ căn cước"
            />
            <PasswordInput
              label="Mật khẩu tài khoản"
              placeholder="Nhập mật khẩu..."
            />
            <Select
              label="Chi nhánh cửa hàng"
              options={['Chi nhánh Quận 1', 'Chi nhánh Quận 3', 'Kho trung tâm']}
            />
            <SearchInput
              label="Tìm kiếm nhanh"
              placeholder="Tìm đơn hàng, khách hàng..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onClear={() => setSearchVal('')}
            />
            <Textarea
              label="Ghi chú đơn hàng"
              placeholder="Nhập yêu cầu đặc biệt..."
              className="md:col-span-2"
            />
          </div>
          <Divider label="Lựa chọn & Toggles" />
          <div className="flex flex-wrap gap-6 items-center mt-3">
            <Checkbox
              label="Tôi đồng ý với điều khoản dịch vụ giặt ủi"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <Switch
              label="Tự động gửi tin nhắn SMS khi giặt xong"
              checked={switchOn}
              onChange={(e) => setSwitchOn(e.target.checked)}
            />
          </div>
        </SectionCard>

        {/* Badges & Stats Showcase */}
        <SectionCard title="3. Status Badges & Stat Cards">
          <div className="flex flex-wrap gap-3 items-center">
            <StatusBadge label="Tiếp nhận" variant="default" />
            <StatusBadge label="Đang xử lý" variant="info" />
            <StatusBadge label="Hoàn thành" variant="success" />
            <StatusBadge label="Chờ thanh toán" variant="warning" />
            <StatusBadge label="Hủy đơn" variant="error" />
          </div>
          <Divider label="Thẻ chỉ số (Stat Cards)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
            <StatCard
              title="Tổng Đơn Hàng"
              value="156"
              icon={<Sparkles size={18} />}
              variant="info"
              trend={{ value: '+12% tuần này', direction: 'up' }}
            />
            <StatCard
              title="Doanh Thu Ngày"
              value="4,500,000đ"
              icon={<CheckCircle size={18} />}
              variant="success"
              trend={{ value: 'Ổn định', direction: 'neutral' }}
            />
            <StatCard
              title="Thiết Bị Lỗi"
              value="2 Máy"
              icon={<AlertCircle size={18} />}
              variant="danger"
              trend={{ value: 'Tăng 1 máy', direction: 'down' }}
            />
          </div>
        </SectionCard>

        {/* Alerts & Toasts Showcase */}
        <SectionCard title="4. Alert Banners & Toast Trigger">
          <div className="flex flex-col gap-3">
            <InlineAlert
              variant="info"
              title="Tin tức hệ thống"
              message="Đang tiến hành nâng cấp máy sấy tự động Quận 1 trong tối nay."
            />
            <InlineAlert
              variant="warning"
              title="Khuyến nghị"
              message="Kho nước xả đang ở mức 30%, cần bổ sung sớm để tránh ngắt quãng quy trình."
            />
            <InlineAlert
              variant="success"
              message="Đã lưu cấu hình cửa hàng thành công!"
            />
          </div>
          <Divider label="Trình diễn Toast Notification" />
          <div className="flex flex-wrap gap-3.5 mt-3">
            <Button variant="outline" size="sm" onClick={() => triggerToast('success')}>
              Toast Thành công
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerToast('error')}>
              Toast Thất bại
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerToast('warning')}>
              Toast Cảnh báo
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerToast('info')}>
              Toast Thông tin
            </Button>
          </div>
        </SectionCard>

        {/* Modal & Drawer Showcase */}
        <SectionCard title="5. Overlay Controls (Modal / Drawer / Confirm)">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Mở Hộp thoại (Modal)
            </Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
              Mở Ngăn kéo (Drawer)
            </Button>
            <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
              Xác nhận Thao tác
            </Button>
            <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
              Xác nhận Xóa
            </Button>
          </div>
        </SectionCard>

        {/* Feedback states */}
        <SectionCard title="6. Progress & Feedback States">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-foreground/80 uppercase">Thanh tiến độ</h4>
              <ProgressBar value={45} variant="info" showLabel />
              <ProgressBar value={90} variant="success" showLabel />
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-foreground/80 uppercase">Loading Indicators</h4>
              <LoadingSpinner message="Đang tải dữ liệu UI..." />
            </div>
          </div>
          <Divider label="Skeletons (Khung xương tải trang)" />
          <div className="grid grid-cols-1 gap-6 mt-3">
            <TableSkeleton rows={2} cols={3} />
          </div>
        </SectionCard>

        {/* Table & Pagination Showcase */}
        <SectionCard title="7. DataTable & Pagination">
          <TableToolbar
            title="Đơn hàng DUDI"
            description="Bảng thông tin các đơn hàng mẫu trong ngày."
            actions={
              <Button variant="primary" size="sm">
                <Plus size={14} />
                Thêm đơn mới
              </Button>
            }
          />
          <FilterBar className="my-2">
            <FilterChip label="Trạng thái" value="Đang hoạt động" onRemove={() => toast('Xóa lọc')} />
            <FilterChip label="Khu vực" value="Quận 1" onRemove={() => toast('Xóa lọc')} />
          </FilterBar>
          <DataTable
            columns={columns}
            rows={rows}
            pagination={{
              currentPage: 1,
              totalPages: 3,
              onPageChange: (p) => toast(`Chuyển sang trang ${p}`),
            }}
          />
        </SectionCard>
      </div>

      {/* Modals & Overlays Render Targets */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Hộp thoại thử nghiệm">
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          Đây là nội dung hiển thị trong Modal. Nó khóa thanh cuộn màn hình và hỗ trợ bấm Esc hoặc click ra ngoài để đóng.
        </p>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
          Đóng hộp thoại
        </Button>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Ngăn kéo thông tin">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Ngăn kéo (Drawer) trượt từ góc phải màn hình, hỗ trợ đầy đủ các tính năng khóa scroll và phím Esc giống Modal.
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
            Đóng ngăn kéo
          </Button>
        </div>
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setConfirmLoading(true);
          setTimeout(() => {
            setConfirmLoading(false);
            setIsConfirmOpen(false);
            toast('Thao tác được xác nhận!', 'success');
          }, 1500);
        }}
        isLoading={confirmLoading}
        message="Bạn có chắc chắn muốn áp dụng những thay đổi cấu hình này?"
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          toast('Đã xóa mục thành công!', 'success');
        }}
      />
    </div>
  );
}
