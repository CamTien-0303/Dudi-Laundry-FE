import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Copy, AlertCircle } from 'lucide-react';
import {
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

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Đang hoạt động':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Dùng thử':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Đã hết hạn':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Đang tạm dừng':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const isNearExpiry = (expiryDate: string, status: string): boolean => {
  if (status === 'Đã hết hạn') return true;
  if (expiryDate === '15/07/2026' || expiryDate === '20/08/2026') return true;
  return false;
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
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('dudi_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  useEffect(() => {
    localStorage.setItem('dudi_partners', JSON.stringify(partners));
  }, [partners]);

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
          return { ...p, expiryDate: newDate, status: 'Đang hoạt động' };
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
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-6 text-left">
      <style>{`
        .reveal-hidden {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          .reveal-hidden {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.35s ease-out, transform 0.35s ease-out;
          }
          .reveal-hidden.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            DANH MỤC HỆ THỐNG
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý đối tác
          </h1>
        </div>

        <button
          onClick={handleAddClick}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Thêm đối tác</span>
        </button>
      </div>

      {/* ENTERPRISE COMPACT TOOLBAR */}
      <div className="bg-white border border-[#DCE5F0] rounded-lg p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              placeholder="Tìm tên chủ tiệm, SĐT, mã đối tác..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-semibold rounded-md pl-9 pr-8 py-2 outline-none transition-all placeholder:text-slate-400"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Status Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-3 py-2 outline-none cursor-pointer"
            >
              {['Tất cả', 'Đang hoạt động', 'Đang tạm dừng', 'Đã hết hạn', 'Dùng thử'].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {(search || selectedStatus !== 'Tất cả') && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSelectedStatus('Tất cả'); }}
            className="text-[11px] font-bold text-slate-500 hover:text-red-600 bg-transparent border-0 cursor-pointer p-0 self-end sm:self-auto"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* SHARP DENSE DATA TABLE */}
      <div className="bg-white border border-[#DCE5F0] rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Mã đối tác</th>
                <th className="py-3 px-4">Tên chủ tiệm</th>
                <th className="py-3 px-4">Tên thương hiệu</th>
                <th className="py-3 px-4">Gói dịch vụ</th>
                <th className="py-3 px-4">Ngày hết hạn</th>
                <th className="py-3 px-4 text-center">Số chi nhánh</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((row) => {
                  const nearExpiry = isNearExpiry(row.expiryDate, row.status);

                  return (
                    <tr
                      key={row.code}
                      className="hover:bg-[#F8FAFC] transition-colors font-medium text-slate-800"
                    >
                      {/* 1. Mã đối tác */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(row.code);
                            toast('Đã sao chép mã đối tác.', 'success');
                          }}
                          className="group font-mono font-bold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer border-0 bg-transparent p-0 inline-flex items-center gap-1"
                          title="Bấm để sao chép mã đối tác"
                        >
                          <span>{row.code}</span>
                          <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        </button>
                      </td>

                      {/* 2. Tên chủ tiệm */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/partners/${row.code}`)}
                          className="font-bold text-[#2563EB] hover:underline transition-colors text-left cursor-pointer border-0 bg-transparent p-0"
                        >
                          {row.ownerName}
                        </button>
                      </td>

                      {/* 3. Tên thương hiệu */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/partners/${row.code}`)}
                          className="font-semibold text-slate-900 hover:text-[#2563EB] hover:underline transition-colors text-left cursor-pointer border-0 bg-transparent p-0"
                        >
                          {row.brandName}
                        </button>
                      </td>

                      {/* 4. Gói dịch vụ */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {row.tier}
                        </span>
                      </td>

                      {/* 5. Ngày hết hạn */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs ${nearExpiry ? 'font-bold text-red-600' : 'text-slate-600'}`}>
                            {row.expiryDate}
                          </span>
                          {nearExpiry && (
                            <span className="px-1.5 py-0.2 bg-red-50 text-red-600 border border-red-200 rounded text-[9px] font-extrabold shrink-0 inline-flex items-center gap-0.5">
                              <AlertCircle size={10} />
                              Hạn sắp tới
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Số chi nhánh */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-extrabold text-slate-900">{row.branchesCount}</span>
                      </td>

                      {/* 7. Trạng thái */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold border inline-block ${getStatusBadgeStyle(row.status)}`}>
                          {row.status}
                        </span>
                      </td>

                      {/* 8. Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditClick(row)}
                            className="px-2 py-1 text-[11px] font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors cursor-pointer"
                            title="Sửa thông tin đối tác"
                          >
                            Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTogglePause(row)}
                            className="px-2 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors cursor-pointer"
                            title="Tạm dừng / Khóa hoạt động"
                          >
                            Khóa/Tạm dừng
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExtendPartner(row)}
                            className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
                            title="Gia hạn 30 ngày"
                          >
                            Gia hạn nhanh
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(row)}
                            className="px-2 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors cursor-pointer"
                            title="Xóa đối tác"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400 font-semibold">
                    Không tìm thấy đối tác nào khớp với điều kiện tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION STRIP */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#DCE5F0] rounded-lg text-xs select-none">
        <span className="text-slate-500 font-semibold">
          Hiển thị <strong>{startIdx}-{endIdx}</strong> trong số <strong>{filteredPartners.length}</strong> đối tác
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={true}
            onClick={() => toast('Tính năng phân trang đang tải.', 'info')}
            className="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded font-bold text-xs cursor-not-allowed"
          >
            Trang trước
          </button>
          <button
            type="button"
            disabled={true}
            onClick={() => toast('Tính năng phân trang đang tải.', 'info')}
            className="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded font-bold text-xs cursor-not-allowed"
          >
            Trang sau
          </button>
        </div>
      </div>

      {/* ADD / EDIT PARTNER MODAL (Redesigned Enterprise Visual) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPartner ? `Chỉnh sửa đối tác: ${editingPartner.code}` : 'Thêm đối tác mới'}
        className="max-w-[660px]"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-left">
          
          {/* Subtitle */}
          <div className="-mt-1 mb-2 pb-3 border-b border-[#DCE5F0]">
            <p className="text-xs text-slate-500 font-medium">
              {editingPartner 
                ? 'Cập nhật thông tin tài khoản chủ tiệm trên hệ thống DUDI' 
                : 'Khởi tạo tài khoản chủ tiệm trên hệ thống DUDI'}
            </p>
          </div>

          {/* 01 · THÔNG TIN ĐỐI TÁC */}
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-mono font-bold tracking-wider text-[#2563EB] uppercase">
              01 · THÔNG TIN ĐỐI TÁC
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-800">Tên chủ tiệm *</label>
              <input
                type="text"
                placeholder="Nhập tên chủ tiệm"
                value={ownerName}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  if (formErrors.ownerName) setFormErrors(prev => ({ ...prev, ownerName: '' }));
                }}
                className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                  formErrors.ownerName ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {formErrors.ownerName && <span className="text-red-500 text-[10px] font-semibold">{formErrors.ownerName}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-800">Tên thương hiệu *</label>
              <input
                type="text"
                placeholder="Nhập tên thương hiệu"
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                  if (formErrors.brandName) setFormErrors(prev => ({ ...prev, brandName: '' }));
                }}
                className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                  formErrors.brandName ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {formErrors.brandName && <span className="text-red-500 text-[10px] font-semibold">{formErrors.brandName}</span>}
            </div>
          </div>

          {/* 02 · THÔNG TIN LIÊN HỆ */}
          <div className="flex flex-col gap-3 mt-1">
            <div className="text-[11px] font-mono font-bold tracking-wider text-[#2563EB] uppercase">
              02 · THÔNG TIN LIÊN HỆ
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Số điện thoại *</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                    if (formErrors.duplicate) setFormErrors(prev => ({ ...prev, duplicate: '' }));
                  }}
                  className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                    formErrors.phone ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {formErrors.phone && <span className="text-red-500 text-[10px] font-semibold">{formErrors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Email *</label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                    if (formErrors.duplicate) setFormErrors(prev => ({ ...prev, duplicate: '' }));
                  }}
                  className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                    formErrors.email ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {formErrors.email && <span className="text-red-500 text-[10px] font-semibold">{formErrors.email}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-800">Địa chỉ trụ sở</label>
              <input
                type="text"
                placeholder="Nhập địa chỉ trụ sở"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md text-slate-900 text-xs font-semibold outline-none transition-all"
              />
            </div>
          </div>

          {/* 03 · GÓI DỊCH VỤ */}
          <div className="flex flex-col gap-3 mt-1">
            <div className="text-[11px] font-mono font-bold tracking-wider text-[#2563EB] uppercase">
              03 · GÓI DỊCH VỤ
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Gói dịch vụ</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Mã số thuế (tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Nhập mã số thuế"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md text-slate-900 text-xs font-semibold outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {formErrors.duplicate && (
            <div className="text-xs text-red-700 font-bold p-3 bg-red-50 border border-red-200 rounded-md">
              {formErrors.duplicate}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#DCE5F0]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs"
            >
              {editingPartner ? 'Lưu đối tác' : 'Tạo đối tác'}
            </button>
          </div>

        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa đối tác"
        variant="danger"
        message="Bạn có chắc chắn muốn xóa đối tác này? Toàn bộ dữ liệu chi nhánh và đơn hàng sẽ bị lưu trữ hoặc mất vĩnh viễn."
      />
    </div>
  );
}
