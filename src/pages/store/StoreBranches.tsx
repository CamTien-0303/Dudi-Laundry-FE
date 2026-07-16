import { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Edit2,
  Trash2,
  Copy,
  Plus,
  Info,
  ExternalLink,
  Cpu
} from 'lucide-react';
import {
  PageHeader,
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
    image: 'https://images.unsplash.com/photo-1545180856-f682855cf525?w=400&auto=format&fit=crop&q=60',
    status: 'Đang hoạt động',
    isAuto: false,
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
    image: 'https://images.unsplash.com/photo-1521568865911-47000e48f703?w=400&auto=format&fit=crop&q=60',
    status: 'Đang hoạt động',
    isAuto: false,
    unfinishedOrders: 3 // Has 3 unfinished orders -> delete restricted!
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
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&auto=format&fit=crop&q=60',
    status: 'Tạm nghỉ',
    isAuto: true,
    unfinishedOrders: 0
  }
];

export default function StoreBranches() {
  const { toast } = useToast();

  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  
  // Quota config simulation
  const [quotaUsed, setQuotaUsed] = useState(2);
  const [quotaMax, setQuotaMax] = useState(3);

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

  // 1. OPEN FORM MODAL
  const handleOpenAddForm = () => {
    if (quotaUsed >= quotaMax) {
      toast('Bạn đã đạt giới hạn tối đa số chi nhánh của gói dịch vụ hiện tại.', 'error');
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
    setBranchImage('https://images.unsplash.com/photo-1521568865911-47000e48f703?w=400&auto=format&fit=crop&q=60');
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
        errors.coords = 'Không thể xác định vị trí. Vui lòng kiểm tra lại hoặc chọn thủ công trên bản đồ.';
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
        image: branchImage || 'https://images.unsplash.com/photo-1521568865911-47000e48f703?w=400&auto=format&fit=crop&q=60',
        status: 'Đang hoạt động',
        isAuto,
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
      // Toggle back directly without confirm
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
    setCopyTargetBranchId(targetBranch.id);
    // Find first other branch as default source
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

  // Days toggle handler
  const handleDayToggle = (day: string) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* Header controls block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <PageHeader
          title="Quản lý chi nhánh"
          description="Quản lý danh sách và thiết lập địa điểm cửa hàng."
        />
        <div className="flex flex-col items-end gap-2 shrink-0">
          
          {/* Quota indicator tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-150 rounded-xl text-xs font-bold text-blue-700">
            <Info size={14} className="text-blue-500" />
            <span>Bạn đã sử dụng {quotaUsed}/{quotaMax} chi nhánh (Gói Pro).</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 text-xs font-bold w-full md:w-auto justify-center"
            disabled={quotaUsed >= quotaMax}
          >
            <Plus size={15} />
            Thêm chi nhánh mới
          </Button>
        </div>
      </div>

      {/* Simulator bar for quota */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs font-bold text-slate-600">
        <span>Trình giả lập cấu hình quota giới hạn chi nhánh của đối tác:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setQuotaMax(3); toast('Đặt hạn mức chi nhánh thành 3.', 'info'); }}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${quotaMax === 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            Gói Pro (Hạn mức 3)
          </button>
          <button
            onClick={() => { setQuotaMax(2); toast('Đặt hạn mức chi nhánh thành 2. Nút thêm chi nhánh sẽ bị khóa.', 'info'); }}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${quotaMax === 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            Gói Basic (Hạn mức 2)
          </button>
        </div>
      </div>

      {/* Branches List Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col gap-4 p-4 relative ${
              branch.status === 'Tạm nghỉ' ? 'border-slate-200 bg-slate-50/40 opacity-90' : 'border-slate-200'
            }`}
          >
            {/* Banner or automatic badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">{branch.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">Mã: {branch.id}</span>
                </div>
              </div>

              {branch.isAuto ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
                  <Cpu size={10} />
                  Tự động
                </span>
              ) : null}
            </div>

            {/* Address & link maps */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex gap-2">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span>{branch.address}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 text-[10px] w-fit"
                  >
                    Mở Google Maps <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">Hotline: {branch.hotline || 'Chưa thiết lập'}</span>
              </div>
            </div>

            {/* Staff, hours list */}
            <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-slate-400" />
                <div>
                  <div className="text-[9px] text-slate-400 font-bold">Nhân sự</div>
                  <span className="font-bold text-slate-700">{branch.staffCount} nhân viên</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <div>
                  <div className="text-[9px] text-slate-400 font-bold">Hoạt động</div>
                  <span className="font-bold text-slate-700">{branch.openTime} - {branch.closeTime}</span>
                </div>
              </div>
            </div>

            {/* Action buttons area */}
            <div className="flex items-center justify-between mt-auto pt-1 gap-2">
              
              {/* Toggle switch state */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500">Trạng thái:</span>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={branch.status === 'Đang hoạt động'}
                    onChange={() => handleToggleStatusClick(branch)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold ml-1.5">
                    <StatusBadge
                      label={branch.status}
                      variant={branch.status === 'Đang hoạt động' ? 'success' : 'warning'}
                    />
                  </span>
                </label>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenCopyModal(branch)}
                  title="Sao chép cấu hình sang chi nhánh khác"
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-550 transition-all cursor-pointer"
                >
                  <Copy size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEditForm(branch)}
                  title="Sửa thông tin chi nhánh"
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-blue-600 transition-all cursor-pointer"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(branch)}
                  title="Xóa chi nhánh"
                  className="p-2 border border-slate-200 rounded-xl hover:bg-red-50 text-red-550 transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Add / Edit Branch Form */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={formType === 'add' ? 'Thêm chi nhánh mới' : 'Sửa thông tin chi nhánh'}
        size="md"
      >
        <div className="flex flex-col gap-4 text-xs text-slate-800">
          
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

          {/* Coordinate grid checker fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="branchLat"
              label="Vĩ độ Lat *"
              value={lat}
              onChange={(e) => {
                setLat(e.target.value);
                if (formErrors.coords) setFormErrors(prev => ({ ...prev, coords: '' }));
              }}
              placeholder="Ví dụ: 10.7289"
            />
            <Input
              id="branchLng"
              label="Kinh độ Lng *"
              value={lng}
              onChange={(e) => {
                setLng(e.target.value);
                if (formErrors.coords) setFormErrors(prev => ({ ...prev, coords: '' }));
              }}
              placeholder="Ví dụ: 106.7201"
            />
          </div>
          {formErrors.coords && (
            <span className="text-[10px] text-red-500 font-bold">{formErrors.coords}</span>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="branchHotline"
              label="Hotline chi nhánh"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              placeholder="Ví dụ: 0901234567"
            />
            <Input
              id="branchStaff"
              label="Số lượng nhân viên"
              type="number"
              value={staffCount}
              onChange={(e) => setStaffCount(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          {/* Workdays checklists */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700">Ngày làm việc trong tuần</span>
            <div className="flex flex-wrap gap-2">
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                    daysOfWeek.includes(day)
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Image URL */}
          <Input
            id="branchImageInput"
            label="Đường dẫn ảnh đại diện chi nhánh (URL)"
            value={branchImage}
            onChange={(e) => setBranchImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />

          <label className="inline-flex items-center gap-2 cursor-pointer mt-1 select-none">
            <input
              type="checkbox"
              checked={isAuto}
              onChange={(e) => setIsAuto(e.target.checked)}
              className="w-4 h-4 rounded text-blue-650 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-bold text-xs text-slate-700">Hệ thống tự động (Không cần nhân sự trực)</span>
          </label>

          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsFormModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveBranch}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Copy Configuration dialog */}
      <Modal
        isOpen={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        title="Sao chép cấu hình chi nhánh"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-xs text-slate-800">
          <p className="text-slate-500 leading-relaxed font-semibold">
            Chọn chi nhánh nguồn để sao chép toàn bộ bảng giá dịch vụ và cài đặt hệ thống sang chi nhánh hiện tại.
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

          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setCopyModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={executeCopyConfig}>
              Xác nhận sao chép
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toggle status confirm dialog */}
      <ConfirmDialog
        isOpen={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={executeToggleStatus}
        title="Xác nhận tạm nghỉ chi nhánh"
        variant="primary"
        message="Chi nhánh này sẽ tạm ẩn khỏi App khách hàng, bạn có chắc chắn?"
      />

      {/* Delete Branch confirm dialog */}
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
