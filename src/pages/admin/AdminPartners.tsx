import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  DataTable,
  FilterBar,
  SearchInput,
  Select,
  Input,
  ConfirmDialog,
  Modal,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Partner {
  code: string;
  ownerName: string;
  brandName: string;
  tier: string;
  expiryDate: string;
  branchesCount: number;
  status: string;
  phone: string;
  email: string;
  address?: string;
  taxId?: string;
}

const INITIAL_PARTNERS: Partner[] = [
  {
    code: 'MER-001',
    ownerName: 'Nguyễn Văn An',
    brandName: 'DUDI Quận 1',
    tier: 'Pro',
    expiryDate: '31/12/2026',
    branchesCount: 3,
    status: 'Đang hoạt động',
    phone: '0901234567',
    email: 'an.nv@dudi.vn',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  },
  {
    code: 'MER-002',
    ownerName: 'Trần Thị Bình',
    brandName: 'CleanPro Laundry',
    tier: 'Basic',
    expiryDate: '20/08/2026',
    branchesCount: 1,
    status: 'Dùng thử',
    phone: '0918765432',
    email: 'binh.tt@cleanpro.com',
    address: '456 Lý Tự Trọng, Quận 1, TP.HCM'
  },
  {
    code: 'MER-003',
    ownerName: 'Lê Quốc Huy',
    brandName: 'Wash 24h',
    tier: 'Enterprise',
    expiryDate: '15/07/2026',
    branchesCount: 8,
    status: 'Đã hết hạn',
    phone: '0987654321',
    email: 'huy.lq@wash24h.vn',
    address: '789 Trần Hưng Đạo, Quận 5, TP.HCM'
  },
  {
    code: 'MER-004',
    ownerName: 'Phạm Minh Tú',
    brandName: 'Giặt Sấy Nhà Tôi',
    tier: 'Pro',
    expiryDate: '01/10/2026',
    branchesCount: 2,
    status: 'Đang tạm dừng',
    phone: '0933334444',
    email: 'tu.pm@giatsaynhatoi.vn',
    address: '101 Võ Văn Ngân, Thủ Đức, TP.HCM'
  },
  {
    code: 'MER-005',
    ownerName: 'Hoàng Gia Linh',
    brandName: 'FreshCare',
    tier: 'Basic',
    expiryDate: '11/11/2026',
    branchesCount: 1,
    status: 'Đang hoạt động',
    phone: '0944445555',
    email: 'linh.hg@freshcare.vn',
    address: '202 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM'
  }
];

const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'Đang hoạt động': return 'success';
    case 'Dùng thử': return 'info';
    case 'Đã hết hạn': return 'error';
    case 'Đang tạm dừng': return 'warning';
    default: return 'default';
  }
};

const add30Days = (dateStr: string): string => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + 30);
  
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  
  return `${dd}/${mm}/${yyyy}`;
};

export default function AdminPartners() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Form fields
  const [ownerName, setOwnerName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [tier, setTier] = useState('Basic');
  const [taxId, setTaxId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirm dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  const handleAddClick = () => {
    setEditingPartner(null);
    setOwnerName('');
    setBrandName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setTier('Basic');
    setTaxId('');
    setFormErrors({});
    setModalOpen(true);
  };

  const handleEditClick = (partner: Partner) => {
    setEditingPartner(partner);
    setOwnerName(partner.ownerName);
    setBrandName(partner.brandName);
    setPhone(partner.phone);
    setEmail(partner.email);
    setAddress(partner.address || '');
    setTier(partner.tier);
    setTaxId(partner.taxId || '');
    setFormErrors({});
    setModalOpen(true);
  };

  const handleTogglePause = (partner: Partner) => {
    setPartners(prev =>
      prev.map(p => {
        if (p.code === partner.code) {
          toast(`Đã tạm dừng hoạt động đối tác ${p.brandName}.`, 'warning');
          return { ...p, status: 'Đang tạm dừng' };
        }
        return p;
      })
    );
  };

  const handleExtendPartner = (partner: Partner) => {
    setPartners(prev =>
      prev.map(p => {
        if (p.code === partner.code) {
          const newDate = add30Days(p.expiryDate);
          toast(`Đã gia hạn nhanh 30 ngày cho đối tác ${p.brandName} (Hạn mới: ${newDate}).`, 'success');
          return { ...p, expiryDate: newDate };
        }
        return p;
      })
    );
  };

  const handleDeleteClick = (partner: Partner) => {
    setPartnerToDelete(partner);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partnerToDelete) {
      setPartners(prev => prev.filter(p => p.code !== partnerToDelete.code));
      toast(`Đã xóa đối tác ${partnerToDelete.brandName}.`, 'success');
    }
    setDeleteConfirmOpen(false);
    setPartnerToDelete(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!ownerName.trim()) errors.ownerName = 'Tên chủ tiệm là bắt buộc.';
    if (!brandName.trim()) errors.brandName = 'Tên thương hiệu là bắt buộc.';
    if (!phone.trim()) errors.phone = 'Số điện thoại là bắt buộc.';
    if (!email.trim()) errors.email = 'Email là bắt buộc.';

    const otherPartners = partners.filter(p => !editingPartner || p.code !== editingPartner.code);
    const duplicatePhone = otherPartners.some(p => p.phone === phone.trim());
    const duplicateEmail = otherPartners.some(p => p.email.toLowerCase() === email.trim().toLowerCase());

    if (duplicatePhone || duplicateEmail) {
      errors.duplicate = 'Số điện thoại hoặc Email này đã được đăng ký bởi một đối tác khác.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingPartner) {
      setPartners(prev =>
        prev.map(p => {
          if (p.code === editingPartner.code) {
            return {
              ...p,
              ownerName: ownerName.trim(),
              brandName: brandName.trim(),
              phone: phone.trim(),
              email: email.trim(),
              address: address.trim(),
              tier,
              taxId: taxId.trim()
            };
          }
          return p;
        })
      );
      toast(`Đã cập nhật đối tác ${brandName}.`, 'success');
    } else {
      const nextId = partners.length > 0
        ? Math.max(...partners.map(p => {
            const num = parseInt(p.code.replace('MER-', ''), 10);
            return isNaN(num) ? 0 : num;
          })) + 1
        : 1;
      const nextCode = `MER-${String(nextId).padStart(3, '0')}`;
      
      const newPartner: Partner = {
        code: nextCode,
        ownerName: ownerName.trim(),
        brandName: brandName.trim(),
        tier,
        expiryDate: '16/08/2026',
        branchesCount: 0,
        status: 'Dùng thử',
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        taxId: taxId.trim()
      };
      setPartners(prev => [...prev, newPartner]);
      toast(`Đã thêm đối tác mới ${brandName}.`, 'success');
    }

    setModalOpen(false);
  };

  const columns = [
    {
      key: 'code',
      header: 'Mã đối tác',
      render: (row: Partner) => (
        <button
          onClick={() => {
            navigator.clipboard.writeText(row.code);
            toast('Đã sao chép mã đối tác.', 'success');
          }}
          className="font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer select-all"
          title="Bấm để sao chép"
        >
          {row.code}
        </button>
      )
    },
    {
      key: 'ownerName',
      header: 'Tên chủ tiệm',
      render: (row: Partner) => <span className="font-semibold text-foreground/90">{row.ownerName}</span>
    },
    {
      key: 'brandName',
      header: 'Tên thương hiệu',
      render: (row: Partner) => <span className="text-foreground/80">{row.brandName}</span>
    },
    {
      key: 'tier',
      header: 'Gói dịch vụ',
      render: (row: Partner) => <span className="font-medium">{row.tier}</span>
    },
    {
      key: 'expiryDate',
      header: 'Ngày hết hạn',
      render: (row: Partner) => <span className="text-muted-foreground">{row.expiryDate}</span>
    },
    {
      key: 'branchesCount',
      header: 'Số chi nhánh',
      className: 'text-center',
      render: (row: Partner) => <span className="font-semibold">{row.branchesCount}</span>
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: Partner) => <StatusBadge label={row.status} variant={getStatusVariant(row.status)} />
    },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (row: Partner) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => handleEditClick(row)}
            className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
          >
            Sửa
          </button>
          <button
            onClick={() => handleTogglePause(row)}
            className="px-2 py-1 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded transition-colors cursor-pointer"
          >
            Khóa/Tạm dừng
          </button>
          <button
            onClick={() => handleExtendPartner(row)}
            className="px-2 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
          >
            Gia hạn nhanh
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="px-2 py-1 text-xs font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded transition-colors cursor-pointer"
          >
            Xóa
          </button>
        </div>
      )
    }
  ];

  const filteredPartners = partners.filter(p => {
    const matchesSearch =
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.code.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Tất cả' || p.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const startIdx = filteredPartners.length > 0 ? 1 : 0;
  const endIdx = filteredPartners.length;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <PageHeader
        title="Quản lý đối tác"
        description="Quản lý danh sách đối tác/chủ tiệm trong hệ thống."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Đối tác' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleAddClick}>
            <Plus size={16} />
            Thêm đối tác
          </Button>
        }
      />

      {/* Filter section */}
      <FilterBar onClear={() => { setSearch(''); setSelectedStatus('Tất cả'); }} showClear={!!search || selectedStatus !== 'Tất cả'}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <SearchInput
              placeholder="Tìm tên chủ tiệm, SĐT, mã đối tác..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
          <div className="w-48">
            <Select
              options={['Tất cả', 'Đang hoạt động', 'Đang tạm dừng', 'Đã hết hạn', 'Dùng thử']}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
          </div>
        </div>
      </FilterBar>

      {/* Partners List Table */}
      <DataTable
        columns={columns}
        rows={filteredPartners}
        emptyState={
          <div className="text-sm font-semibold text-muted py-4">
            Không tìm thấy đối tác nào khớp với từ khóa
          </div>
        }
      />

      {/* Custom Mock Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border border-border/60 rounded-xl mt-2 gap-4 flex-wrap select-none">
        <span className="text-xs text-muted/90 font-medium">
          {startIdx}-{endIdx} của {filteredPartners.length} đối tác
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast('Tính năng phân trang đang tải.', 'info')}
            disabled={true}
            className="p-1.5 min-w-[32px] cursor-not-allowed text-xs"
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast('Tính năng phân trang đang tải.', 'info')}
            disabled={true}
            className="p-1.5 min-w-[32px] cursor-not-allowed text-xs"
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Add / Edit Partner Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPartner ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}
        size="md"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            id="ownerName"
            label="Tên chủ tiệm *"
            placeholder="Nhập tên chủ tiệm"
            value={ownerName}
            onChange={(e) => {
              setOwnerName(e.target.value);
              if (formErrors.ownerName) setFormErrors(prev => ({ ...prev, ownerName: '' }));
            }}
            error={formErrors.ownerName}
          />

          <Input
            id="brandName"
            label="Tên thương hiệu *"
            placeholder="Nhập tên thương hiệu"
            value={brandName}
            onChange={(e) => {
              setBrandName(e.target.value);
              if (formErrors.brandName) setFormErrors(prev => ({ ...prev, brandName: '' }));
            }}
            error={formErrors.brandName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="phone"
              label="Số điện thoại *"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                if (formErrors.duplicate) setFormErrors(prev => ({ ...prev, duplicate: '' }));
              }}
              error={formErrors.phone}
            />

            <Input
              id="email"
              label="Email *"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                if (formErrors.duplicate) setFormErrors(prev => ({ ...prev, duplicate: '' }));
              }}
              error={formErrors.email}
            />
          </div>

          <Input
            id="address"
            label="Địa chỉ trụ sở"
            placeholder="Nhập địa chỉ trụ sở"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="tier"
              label="Gói dịch vụ"
              options={['Basic', 'Pro', 'Enterprise']}
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            />

            <Input
              id="taxId"
              label="Mã số thuế (tùy chọn)"
              placeholder="Nhập mã số thuế"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />
          </div>

          {formErrors.duplicate && (
            <div className="text-xs text-red-650 font-bold p-3 bg-red-50 border border-red-100 rounded-xl">
              {formErrors.duplicate}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 mt-2 pt-4 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
            >
              Lưu
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa đối tác"
        variant="danger"
        message="Bạn có chắc chắn muốn xóa đối tác này? Toàn bộ dữ liệu chi nhánh và đơn hàng sẽ bị lưu trữ hoặc mất vĩnh viễn"
      />
    </div>
  );
}
