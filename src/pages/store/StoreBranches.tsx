import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Edit2,
  Trash2,
  Copy,
  Plus,
  ExternalLink,
  Cpu,
  MoreVertical,
  Building2,
  CheckCircle2
} from 'lucide-react';
import {
  Button,
  StatusBadge,
  Select,
  Input,
  ConfirmDialog,
  Modal
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Branch {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  hotline: string;
  staffCount: number;
  openTime: string;
  closeTime: string;
  daysOfWeek: string[];
  image: string;
  status: 'Đang hoạt động' | 'Tạm nghỉ';
  isAuto: boolean;
  isMain?: boolean;
  unfinishedOrders: number;
}

const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'BR-001',
    name: 'DUDI Quận 1 — Chi nhánh chính',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. HCM',
    lat: '10.7769',
    lng: '106.7009',
    hotline: '0901112223',
    staffCount: 8,
    openTime: '07:00',
    closeTime: '22:00',
    daysOfWeek: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&auto=format&fit=crop&q=80',
    status: 'Đang hoạt động',
    isAuto: false,
    isMain: true,
    unfinishedOrders: 0
  },
  {
    id: 'BR-002',
    name: 'DUDI Quận 7',
    address: '456 Nguyễn Thị Thập, Phường Tân Quy, Quận 7, TP. HCM',
    lat: '10.7289',
    lng: '106.7201',
    hotline: '0902223334',
    staffCount: 5,
    openTime: '08:00',
    closeTime: '21:00',
    daysOfWeek: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
    status: 'Đang hoạt động',
    isAuto: false,
    isMain: false,
    unfinishedOrders: 3
  },
  {
    id: 'BR-003',
    name: 'DUDI Tự Động Bình Thạnh',
    address: '789 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. HCM',
    lat: '10.7901',
    lng: '106.6802',
    hotline: '0903334445',
    staffCount: 0,
    openTime: '00:00',
    closeTime: '23:59',
    daysOfWeek: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    image: 'https://images.unsplash.com/photo-1521568865911-47000e48f703?w=600&auto=format&fit=crop&q=80',
    status: 'Tạm nghỉ',
    isAuto: true,
    isMain: false,
    unfinishedOrders: 0
  }
];

export default function StoreBranches() {
  const { toast } = useToast();

  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  
  // Quota config simulation
  const [quotaUsed, setQuotaUsed] = useState(2);
  const [quotaMax] = useState(3);

  // Dropdown menu state
  const [openMenuBranchId, setOpenMenuBranchId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formType, setFormType] = useState<'add' | 'edit'>('add');
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hotline, setHotline] = useState('');
  const [staffCount, setStaffCount] = useState(0);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']);
  const [isAuto, setIsAuto] = useState(false);
  const [branchImage, setBranchImage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Confirm dialogs
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [targetStatusBranch, setTargetStatusBranch] = useState<Branch | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteBranch, setTargetDeleteBranch] = useState<Branch | null>(null);

  // Copy Config Modal
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceBranchId, setCopySourceBranchId] = useState('');
  const [copyTargetBranchId, setCopyTargetBranchId] = useState('');

  // Close 3-dots popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuBranchId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. OPEN FORM MODAL
  const handleOpenAddForm = () => {
    if (quotaUsed >= quotaMax) {
      toast('Bạn đã đạt giới hạn tối đa số chi nhánh của gói Pro hiện tại.', 'error');
      return;
    }
    setFormType('add');
    setName('');
    setAddress('');
    setLat('10.7731');
    setLng('106.6984');
    setHotline('');
    setStaffCount(0);
    setOpenTime('08:00');
    setCloseTime('22:00');
    setDaysOfWeek(['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']);
    setIsAuto(false);
    setBranchImage('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&auto=format&fit=crop&q=80');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (branch: Branch) => {
    setFormType('edit');
    setEditingBranchId(branch.id);
    setName(branch.name);
    setAddress(branch.address);
    setLat(branch.lat);
    setLng(branch.lng);
    setHotline(branch.hotline);
    setStaffCount(branch.staffCount);
    setOpenTime(branch.openTime);
    setCloseTime(branch.closeTime);
    setDaysOfWeek(branch.daysOfWeek);
    setIsAuto(branch.isAuto);
    setBranchImage(branch.image);
    setFormErrors({});
    setIsFormModalOpen(true);
    setOpenMenuBranchId(null);
  };

  // 2. FORM SUBMIT AND VALIDATION
  const handleSaveBranch = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Tên chi nhánh là bắt buộc.';
    if (!lat.trim() || !lng.trim()) {
      errors.coords = 'Vĩ độ và Kinh độ là bắt buộc.';
    } else {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        errors.coords = 'Không thể xác định vị trí. Vui lòng kiểm tra lại.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast('Vui lòng hoàn thành chính xác thông tin bắt buộc.', 'error');
      return;
    }

    if (formType === 'add') {
      const newBranch: Branch = {
        id: `BR-00${branches.length + 1}`,
        name: name.trim(),
        address: address.trim(),
        lat: lat.trim(),
        lng: lng.trim(),
        hotline: hotline.trim(),
        staffCount: staffCount,
        openTime,
        closeTime,
        daysOfWeek,
        image: branchImage || 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&auto=format&fit=crop&q=80',
        status: 'Đang hoạt động',
        isAuto,
        isMain: false,
        unfinishedOrders: 0
      };
      setBranches(prev => [...prev, newBranch]);
      setQuotaUsed(prev => prev + 1);
      toast('Thông tin chi nhánh đã được cập nhật.', 'success');
    } else {
      setBranches(prev =>
        prev.map(b =>
          b.id === editingBranchId
            ? {
                ...b,
                name: name.trim(),
                address: address.trim(),
                lat: lat.trim(),
                lng: lng.trim(),
                hotline: hotline.trim(),
                staffCount: staffCount,
                openTime,
                closeTime,
                daysOfWeek,
                isAuto,
                image: branchImage
              }
            : b
        )
      );
      toast('Thông tin chi nhánh đã được cập nhật.', 'success');
    }
    setIsFormModalOpen(false);
  };

  // 3. TOGGLE STATE STATUS
  const handleToggleStatusClick = (branch: Branch) => {
    if (branch.status === 'Đang hoạt động') {
      setTargetStatusBranch(branch);
      setStatusConfirmOpen(true);
    } else {
      setBranches(prev =>
        prev.map(b => (b.id === branch.id ? { ...b, status: 'Đang hoạt động' } : b))
      );
      toast('Thông tin chi nhánh đã được cập nhật.', 'success');
    }
  };

  const executeToggleStatus = () => {
    if (!targetStatusBranch) return;
    setBranches(prev =>
      prev.map(b => (b.id === targetStatusBranch.id ? { ...b, status: 'Tạm nghỉ' } : b))
    );
    setStatusConfirmOpen(false);
    toast('Thông tin chi nhánh đã được cập nhật.', 'success');
  };

  // 4. DELETE BRANCH
  const handleDeleteClick = (branch: Branch) => {
    setOpenMenuBranchId(null);
    if (branch.unfinishedOrders > 0) {
      toast(`Không thể xóa chi nhánh này vì vẫn còn ${branch.unfinishedOrders} đơn hàng chưa hoàn thành.`, 'error');
      return;
    }
    setTargetDeleteBranch(branch);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteBranch = () => {
    if (!targetDeleteBranch) return;
    setBranches(prev => prev.filter(b => b.id !== targetDeleteBranch.id));
    setQuotaUsed(prev => Math.max(0, prev - 1));
    setDeleteConfirmOpen(false);
    toast('Đã xóa chi nhánh thành công.', 'success');
  };

  // 5. COPY CONFIG MOCK
  const handleOpenCopyModal = (targetBranch: Branch) => {
    setOpenMenuBranchId(null);
    setCopyTargetBranchId(targetBranch.id);
    const other = branches.find(b => b.id !== targetBranch.id);
    setCopySourceBranchId(other ? other.id : '');
    setCopyModalOpen(true);
  };

  const executeCopyConfig = () => {
    const source = branches.find(b => b.id === copySourceBranchId);
    const target = branches.find(b => b.id === copyTargetBranchId);
    if (!source || !target) {
      toast('Vui lòng chọn chi nhánh hợp lệ.', 'error');
      return;
    }
    setCopyModalOpen(false);
    toast(`Đã sao chép cấu hình bảng giá và cài đặt từ "${source.name}" sang "${target.name}".`, 'success');
  };

  const handleDayToggle = (day: string) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Helper for card styling
  const getCardStyle = (branch: Branch) => {
    if (branch.isMain) {
      return 'border-l-4 border-l-[#2563EB] bg-[#EFF6FF]/30 border-t border-r border-b border-[#DCE5F0]';
    }
    if (branch.isAuto) {
      return 'border-l-4 border-l-amber-500 bg-[#FFFBEB]/30 border-t border-r border-b border-[#DCE5F0]';
    }
    if (branch.status === 'Tạm nghỉ') {
      return 'border-l-4 border-l-slate-400 bg-slate-50/70 border-t border-r border-b border-[#DCE5F0]';
    }
    return 'border-l-4 border-l-slate-300 bg-white border-t border-r border-b border-[#DCE5F0]';
  };

  const quotaPercent = Math.min(100, Math.round((quotaUsed / quotaMax) * 100));

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-3 sm:p-5 md:p-8 flex flex-col gap-5 text-left overflow-x-hidden">
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

      {/* 1. RESPONSIVE HEADER & QUOTA INDICATOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            BRANCH MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý chi nhánh
          </h1>
        </div>

        {/* Action Controls: Quota & Add button wrap cleanly on small screens */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          {/* COMPACT QUOTA INDICATOR */}
          <div className="flex flex-col gap-1 bg-white border border-[#DCE5F0] px-3.5 py-1.5 rounded-lg shadow-2xs">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-700 gap-2">
              <span>QUOTA CHI NHÁNH</span>
              <span className="text-[#2563EB]">{quotaUsed} / {quotaMax} · Gói Pro</span>
            </div>
            <div className="w-full sm:w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddForm}
            className="flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-2xs border-0 transition-colors cursor-pointer w-full sm:w-auto"
            disabled={quotaUsed >= quotaMax}
          >
            <Plus size={16} />
            <span>Thêm chi nhánh mới</span>
          </Button>
        </div>
      </div>

      {/* 2. RESPONSIVE BRANCH CARDS GRID: 1 col (<768px), 2 cols (768-1279px), 3 cols (>=1280px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
        {branches.map((branch) => {
          const isMenuOpen = openMenuBranchId === branch.id;
          return (
            <div
              key={branch.id}
              className={`rounded-xl shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between gap-3.5 p-4 sm:p-4.5 relative text-xs ${getCardStyle(branch)}`}
            >
              {/* Card Header: Title & Badges */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&auto=format&fit=crop&q=80';
                      }}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover border border-[#DCE5F0]"
                    />
                    {branch.isMain && (
                      <span className="absolute -bottom-1 -right-1 bg-[#2563EB] text-white p-0.5 rounded-full" title="Chi nhánh chính">
                        <CheckCircle2 size={11} />
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words tracking-tight">{branch.name}</h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400">ID: {branch.id}</span>
                  </div>
                </div>

                {/* Status & Type Badges */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {branch.isAuto ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FFFBEB] text-amber-800 border border-[#FDE68A] flex items-center gap-0.5">
                      <Cpu size={10} /> Tự động
                    </span>
                  ) : branch.isMain ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center gap-0.5">
                      <Building2 size={10} /> Chi nhánh chính
                    </span>
                  ) : null}

                  <StatusBadge
                    label={branch.status}
                    variant={branch.status === 'Đang hoạt động' ? 'success' : 'warning'}
                  />
                </div>
              </div>

              {/* Address & Hotline */}
              <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-slate-800 leading-snug break-words">{branch.address}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2563EB] hover:underline font-bold flex items-center gap-0.5 text-[10px] w-fit"
                    >
                      <span>Mở Google Maps</span> <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span className="font-semibold text-[11px] sm:text-xs">Hotline: <strong className="text-slate-900">{branch.hotline || 'Chưa cài đặt'}</strong></span>
                </div>
              </div>

              {/* Staff & Hours: 1 column on mobile (<640px), 2 columns on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">NHÂN SỰ</span>
                    <span className="font-bold text-slate-800">{branch.staffCount} nhân viên</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">GIỜ MỞ CỬA</span>
                    <span className="font-bold text-slate-800">{branch.openTime} - {branch.closeTime}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row: Status Toggle + Primary Edit + 3-dots Menu */}
              <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                
                {/* Toggle Status Switch */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hoạt động:</span>
                  <input
                    type="checkbox"
                    checked={branch.status === 'Đang hoạt động'}
                    onChange={() => handleToggleStatusClick(branch)}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </div>

                {/* Primary Edit & 3-dots popover dropdown */}
                <div className="flex items-center gap-1.5 relative">
                  
                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(branch)}
                    className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] border border-[#BFDBFE] rounded-md font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 size={13} />
                    <span>Chỉnh sửa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenMenuBranchId(isMenuOpen ? null : branch.id)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-[#DCE5F0] rounded-md transition-colors cursor-pointer"
                    title="Thao tác khác"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-[#DCE5F0] rounded-lg shadow-lg py-1 z-20 animate-fadeIn"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenCopyModal(branch)}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-0"
                      >
                        <Copy size={13} className="text-[#2563EB]" />
                        <span>Sao chép cấu hình</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(branch)}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-0"
                      >
                        <Trash2 size={13} className="text-red-500" />
                        <span>Xóa chi nhánh</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* 3. MODAL: ADD / EDIT BRANCH */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={formType === 'add' ? 'Thêm chi nhánh mới' : 'Sửa thông tin chi nhánh'}
        size="md"
      >
        <div className="flex flex-col gap-3 text-xs text-slate-800 text-left">
          
          <Input
            id="branchName"
            label="Tên chi nhánh *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
            }}
            error={formErrors.name}
            placeholder="Ví dụ: DUDI Quận 7"
          />

          <Input
            id="branchAddress"
            label="Địa chỉ chi tiết"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ví dụ: 456 Nguyễn Thị Thập, Quận 7, TP. HCM"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="branchLat"
              label="Vĩ độ Lat *"
              value={lat}
              onChange={(e) => {
                setLat(e.target.value);
                if (formErrors.coords) setFormErrors(prev => ({ ...prev, coords: '' }));
              }}
              placeholder="10.7289"
            />
            <Input
              id="branchLng"
              label="Kinh độ Lng *"
              value={lng}
              onChange={(e) => {
                setLng(e.target.value);
                if (formErrors.coords) setFormErrors(prev => ({ ...prev, coords: '' }));
              }}
              placeholder="106.7201"
            />
          </div>
          {formErrors.coords && (
            <span className="text-[10px] text-red-500 font-bold">⚠️ {formErrors.coords}</span>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="branchHotline"
              label="Hotline chi nhánh"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              placeholder="0901234567"
            />
            <Input
              id="branchStaff"
              label="Số lượng nhân viên"
              type="number"
              value={staffCount}
              onChange={(e) => setStaffCount(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="branchOpen"
              label="Giờ mở cửa"
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
            />
            <Input
              id="branchClose"
              label="Giờ đóng cửa"
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-800">Ngày làm việc trong tuần</span>
            <div className="flex flex-wrap gap-1.5">
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-2.5 py-1 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                    daysOfWeek.includes(day)
                      ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                      : 'bg-white border-[#DCE5F0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="branchImageInput"
            label="Đường dẫn ảnh đại diện (URL)"
            value={branchImage}
            onChange={(e) => setBranchImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />

          <label className="inline-flex items-center gap-2 cursor-pointer mt-1 select-none">
            <input
              type="checkbox"
              checked={isAuto}
              onChange={(e) => setIsAuto(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
            />
            <span className="font-bold text-xs text-slate-800">Mô hình tự động (Không cần nhân sự trực)</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsFormModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveBranch}>
              Lưu chi nhánh
            </Button>
          </div>
        </div>
      </Modal>

      {/* 4. MODAL: COPY CONFIG */}
      <Modal
        isOpen={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        title="Sao chép cấu hình chi nhánh"
        size="sm"
      >
        <div className="flex flex-col gap-3 text-xs text-slate-800 text-left">
          <p className="text-slate-600 font-semibold leading-relaxed">
            Chọn chi nhánh nguồn để sao chép toàn bộ bảng giá và thiết lập hệ thống sang chi nhánh hiện tại.
          </p>

          <Select
            id="copySource"
            label="Chi nhánh nguồn"
            options={branches
              .filter(b => b.id !== copyTargetBranchId)
              .map(b => `${b.id} — ${b.name}`)}
            value={copySourceBranchId}
            onChange={(e) => setCopySourceBranchId(e.target.value.split(' — ')[0])}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setCopyModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={executeCopyConfig}>
              Xác nhận sao chép
            </Button>
          </div>
        </div>
      </Modal>

      {/* 5. CONFIRM DIALOGS */}
      <ConfirmDialog
        isOpen={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={executeToggleStatus}
        title="Xác nhận tạm nghỉ chi nhánh"
        variant="primary"
        message="Chi nhánh này sẽ tạm ẩn khỏi App khách hàng, bạn có chắc chắn?"
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executeDeleteBranch}
        title="Xác nhận xóa chi nhánh"
        variant="danger"
        message="Bạn có chắc chắn muốn xóa chi nhánh này? Thao tác này không thể hoàn tác."
      />

    </div>
  );
}
