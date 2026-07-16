import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, AlertTriangle, Key, ShieldAlert } from 'lucide-react';
import {
  PageHeader,
  Button,
  Select,
  Input,
  ConfirmDialog,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Partner {
  code: string;
  ownerName: string;
  brandName: string;
  phone: string;
  email: string;
  address?: string;
  taxId?: string;
  adminNote?: string;
  tier: string;
  activationDate: string;
  expiryDate: string;
  paymentStatus: 'Đã thanh toán' | 'Còn nợ';
  maxBranches: number;
  maxOrdersPerMonth: number;
  username: string;
  isLocked: boolean;
}

const INITIAL_PARTNERS: Partner[] = [
  {
    code: 'MER-001',
    ownerName: 'Nguyễn Văn An',
    brandName: 'DUDI Quận 1',
    phone: '0901234567',
    email: 'an.nv@dudi.vn',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    taxId: '0102030405',
    adminNote: 'Khách hàng thân thiết từ 2025',
    tier: 'Pro',
    activationDate: '01/01/2026',
    expiryDate: '31/12/2026',
    paymentStatus: 'Đã thanh toán',
    maxBranches: 5,
    maxOrdersPerMonth: 1000,
    username: 'mer_an_001',
    isLocked: false
  },
  {
    code: 'MER-002',
    ownerName: 'Trần Thị Bình',
    brandName: 'CleanPro Laundry',
    phone: '0918765432',
    email: 'binh.tt@cleanpro.com',
    address: '456 Lý Tự Trọng, Quận 1, TP.HCM',
    taxId: '0203040506',
    adminNote: 'Chạy thử nghiệm gói Basic',
    tier: 'Basic',
    activationDate: '20/07/2026',
    expiryDate: '20/08/2026',
    paymentStatus: 'Đã thanh toán',
    maxBranches: 2,
    maxOrdersPerMonth: 200,
    username: 'mer_binh_002',
    isLocked: false
  },
  {
    code: 'MER-003',
    ownerName: 'Lê Quốc Huy',
    brandName: 'Wash 24h',
    phone: '0987654321',
    email: 'huy.lq@wash24h.vn',
    address: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
    taxId: '0304050607',
    adminNote: 'Hết hạn sử dụng cần liên hệ gia hạn',
    tier: 'Enterprise',
    activationDate: '15/07/2025',
    expiryDate: '15/07/2026',
    paymentStatus: 'Còn nợ',
    maxBranches: 10,
    maxOrdersPerMonth: 5000,
    username: 'mer_huy_003',
    isLocked: false
  },
  {
    code: 'MER-004',
    ownerName: 'Phạm Minh Tú',
    brandName: 'Giặt Sấy Nhà Tôi',
    phone: '0933334444',
    email: 'tu.pm@giatsaynhatoi.vn',
    address: '101 Võ Văn Ngân, Thủ Đức, TP.HCM',
    taxId: '0405060708',
    adminNote: 'Đang tạm dừng theo yêu cầu của đối tác',
    tier: 'Pro',
    activationDate: '01/04/2026',
    expiryDate: '01/10/2026',
    paymentStatus: 'Đã thanh toán',
    maxBranches: 3,
    maxOrdersPerMonth: 1000,
    username: 'mer_tu_004',
    isLocked: false
  },
  {
    code: 'MER-005',
    ownerName: 'Hoàng Gia Linh',
    brandName: 'FreshCare',
    phone: '0944445555',
    email: 'linh.hg@freshcare.vn',
    address: '202 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
    taxId: '0506070809',
    adminNote: 'Hoạt động ổn định',
    tier: 'Basic',
    activationDate: '11/05/2026',
    expiryDate: '11/11/2026',
    paymentStatus: 'Đã thanh toán',
    maxBranches: 2,
    maxOrdersPerMonth: 200,
    username: 'mer_linh_005',
    isLocked: false
  }
];

const MOCK_BRANCHES: Record<string, { name: string; address: string; isActive: boolean }[]> = {
  'MER-001': [
    { name: 'DUDI Quận 1', address: '123 Nguyễn Huệ', isActive: true },
    { name: 'DUDI Quận 7', address: '789 Nguyễn Hữu Thọ', isActive: true },
    { name: 'DUDI Thủ Đức', address: '101 Võ Văn Ngân', isActive: false }
  ],
  'MER-002': [
    { name: 'CleanPro Quận 10', address: '560 Ba Tháng Hai', isActive: true }
  ],
  'MER-003': [
    { name: 'Wash 24h Quận 1', address: '150 Nguyễn Trãi', isActive: true },
    { name: 'Wash 24h Quận 3', address: '240 Cách Mạng Tháng 8', isActive: true },
    { name: 'Wash 24h Thủ Đức', address: '50 Kha Vạn Cân', isActive: false },
    { name: 'Wash 24h Phú Nhuận', address: '12 Phan Xích Long', isActive: true },
    { name: 'Wash 24h Bình Thạnh', address: '88 Điện Biên Phủ', isActive: true }
  ],
  'MER-004': [
    { name: 'Giặt Sấy Nhà Tôi Q9', address: '12 Đỗ Xuân Hợp', isActive: true },
    { name: 'Giặt Sấy Nhà Tôi Q2', address: '88 Song Hành', isActive: false }
  ],
  'MER-005': [
    { name: 'FreshCare Bình Thạnh', address: '202 Xô Viết Nghệ Tĩnh', isActive: true }
  ]
};

export default function AdminPartnerDetail() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('dudi_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const partner = partners.find(p => p.code === partnerId);

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'tier' | 'security'>('info');

  // Form Fields State
  const [ownerName, setOwnerName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const [tier, setTier] = useState('Basic');
  const [activationDate, setActivationDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Đã thanh toán' | 'Còn nợ'>('Đã thanh toán');
  const [maxBranches, setMaxBranches] = useState(2);
  const [maxOrdersPerMonth, setMaxOrdersPerMonth] = useState(200);

  const [isLocked, setIsLocked] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Branches State
  const [branches, setBranches] = useState<{ name: string; address: string; isActive: boolean }[]>([]);
  const [initialBranches, setInitialBranches] = useState<{ name: string; address: string; isActive: boolean }[]>([]);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Confirmations
  const [tierConfirmOpen, setTierConfirmOpen] = useState(false);
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  // Initialize values
  useEffect(() => {
    if (partner) {
      setOwnerName(partner.ownerName);
      setBrandName(partner.brandName);
      setPhone(partner.phone);
      setEmail(partner.email);
      setAddress(partner.address || '');
      setTaxId(partner.taxId || '');
      setAdminNote(partner.adminNote || '');

      setTier(partner.tier);
      setActivationDate(partner.activationDate);
      setExpiryDate(partner.expiryDate);
      setPaymentStatus(partner.paymentStatus);
      setMaxBranches(partner.maxBranches);
      setMaxOrdersPerMonth(partner.maxOrdersPerMonth);

      setIsLocked(partner.isLocked);

      // Load branches
      const savedBranches = localStorage.getItem(`dudi_branches_${partner.code}`);
      const loadedBranches = savedBranches ? JSON.parse(savedBranches) : (MOCK_BRANCHES[partner.code] || []);
      setBranches(loadedBranches);
      setInitialBranches(loadedBranches);
      setResetMessage(null);
    }
  }, [partner]);

  if (!partner) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn text-center max-w-md mx-auto py-16">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100 shadow-inner">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800">Không tìm thấy đối tác.</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Đường dẫn không hợp lệ hoặc đối tác đã bị xóa khỏi hệ thống.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/partners')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Quota analysis
  const activeBranches = branches.filter(b => b.isActive).length;
  const newLimit = tier === 'Basic' ? 2 : tier === 'Pro' ? 5 : 20;
  const hasQuotaConflict = activeBranches > newLimit;

  // Track modification
  const isModified =
    ownerName !== partner.ownerName ||
    brandName !== partner.brandName ||
    phone !== partner.phone ||
    email !== partner.email ||
    address !== partner.address ||
    taxId !== partner.taxId ||
    adminNote !== partner.adminNote ||
    tier !== partner.tier ||
    activationDate !== partner.activationDate ||
    expiryDate !== partner.expiryDate ||
    paymentStatus !== partner.paymentStatus ||
    maxBranches !== partner.maxBranches ||
    maxOrdersPerMonth !== partner.maxOrdersPerMonth ||
    isLocked !== partner.isLocked ||
    JSON.stringify(branches) !== JSON.stringify(initialBranches);

  const handleBranchStatusChange = (index: number, val: boolean) => {
    setBranches(prev =>
      prev.map((b, idx) => (idx === index ? { ...b, isActive: val } : b))
    );
  };

  const handleTierSelect = (newTier: string) => {
    if (newTier !== partner.tier) {
      setPendingTier(newTier);
      setTierConfirmOpen(true);
    } else {
      setTier(newTier);
      // reset defaults
      setMaxBranches(partner.maxBranches);
      setMaxOrdersPerMonth(partner.maxOrdersPerMonth);
    }
  };

  const confirmTierChange = () => {
    if (pendingTier) {
      setTier(pendingTier);
      // Auto-set limits based on tier
      const limit = pendingTier === 'Basic' ? 2 : pendingTier === 'Pro' ? 5 : 20;
      const orders = pendingTier === 'Basic' ? 200 : pendingTier === 'Pro' ? 1000 : 5000;
      setMaxBranches(limit);
      setMaxOrdersPerMonth(orders);
    }
    setTierConfirmOpen(false);
  };

  const handleResetPassword = () => {
    const msg = `Mật khẩu mới đã được gửi đến Email của đối tác ${ownerName}.`;
    setResetMessage(msg);
    toast(msg, 'success');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!phone.trim()) errors.phone = 'Số điện thoại là bắt buộc.';
    if (!email.trim()) errors.email = 'Email là bắt buộc.';

    // Check duplicate phone or email among OTHER partners
    const otherPartners = partners.filter(p => p.code !== partner.code);
    const duplicatePhone = otherPartners.some(p => p.phone === phone.trim());
    const duplicateEmail = otherPartners.some(p => p.email.toLowerCase() === email.trim().toLowerCase());

    if (duplicatePhone || duplicateEmail) {
      errors.duplicate = 'Thông tin này đã tồn tại trên đối tác khác.';
      toast('Thông tin này đã tồn tại trên đối tác khác.', 'error');
      setFormErrors(errors);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Save partner details
    const updatedPartners = partners.map(p => {
      if (p.code === partner.code) {
        return {
          ...p,
          ownerName: ownerName.trim(),
          brandName: brandName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          taxId: taxId.trim(),
          adminNote: adminNote.trim(),
          tier,
          activationDate,
          expiryDate,
          paymentStatus,
          maxBranches,
          maxOrdersPerMonth,
          isLocked
        };
      }
      return p;
    });

    setPartners(updatedPartners);
    localStorage.setItem('dudi_partners', JSON.stringify(updatedPartners));
    localStorage.setItem(`dudi_branches_${partner.code}`, JSON.stringify(branches));
    setInitialBranches(branches);

    toast('Đã lưu thay đổi đối tác.', 'success');
    setFormErrors({});
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <PageHeader
          title="Chi tiết đối tác và tài khoản"
          description={`Mã đối tác: ${partner.code} | Thương hiệu: ${partner.brandName}`}
          breadcrumb={[
            { label: 'Hệ thống', to: '/admin/dashboard' },
            { label: 'Đối tác', to: '/admin/partners' },
            { label: partner.code },
          ]}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/partners')}
          >
            <ArrowLeft size={16} />
            Quay lại danh sách
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!isModified || hasQuotaConflict}
            onClick={handleSave}
            className={(!isModified || hasQuotaConflict) ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Save size={16} />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Lock Warning Banner */}
      {isLocked && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
          <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
          <span className="font-bold">Tài khoản đang bị khóa. Đối tác này sẽ không thể đăng nhập hoặc vận hành hệ thống.</span>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left tabs selector */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1.5 h-fit">
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'info'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            Thông tin cơ bản
          </button>
          <button
            onClick={() => setActiveTab('tier')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'tier'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            Gói dịch vụ & Quota
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            Tài khoản & Bảo mật
          </button>
        </div>

        {/* Right content panel */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {/* Tab 1: Basic Info */}
            {activeTab === 'info' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">Thông tin cơ bản</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="code"
                    label="Mã đối tác"
                    value={partner.code}
                    readOnly
                    className="bg-slate-50 text-slate-500 font-semibold border-slate-200 cursor-not-allowed"
                  />
                  <Input
                    id="brandName"
                    label="Tên thương hiệu"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="ownerName"
                    label="Tên chủ tiệm"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                  <Input
                    id="taxId"
                    label="Mã số thuế"
                    placeholder="Chưa cập nhật"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="phone"
                    label="Số điện thoại *"
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
                  label="Địa chỉ văn phòng"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground/90">Ghi chú riêng cho Admin</label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 text-xs focus:border-primary outline-none transition-all placeholder-slate-400 resize-none font-semibold text-sm"
                    placeholder="Ghi chú nội bộ dành cho platform admin..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>

                {formErrors.duplicate && (
                  <div className="text-xs text-red-655 font-bold p-3 bg-red-50 border border-red-100 rounded-xl">
                    {formErrors.duplicate}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Service Tier & Quota */}
            {activeTab === 'tier' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Gói dịch vụ & Hạn dùng</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      id="tier"
                      label="Gói dịch vụ"
                      options={['Basic', 'Pro', 'Enterprise']}
                      value={tier}
                      onChange={(e) => handleTierSelect(e.target.value)}
                    />
                    <Input
                      id="activationDate"
                      label="Ngày kích hoạt"
                      type="text"
                      value={activationDate}
                      onChange={(e) => setActivationDate(e.target.value)}
                    />
                    <Input
                      id="expiryDate"
                      label="Ngày hết hạn"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 w-48">
                    <Select
                      id="paymentStatus"
                      label="Trạng thái thanh toán"
                      options={['Đã thanh toán', 'Còn nợ']}
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as 'Đã thanh toán' | 'Còn nợ')}
                    />
                  </div>
                </div>

                {/* Quota Container */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Khối giới hạn Quota</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="maxBranches"
                      label={`Số chi nhánh tối đa (Giới hạn gói: ${newLimit} | Đang chọn hoạt động: ${activeBranches})`}
                      type="number"
                      value={maxBranches}
                      onChange={(e) => setMaxBranches(parseInt(e.target.value, 10) || 0)}
                    />
                    <Input
                      id="maxOrders"
                      label="Giới hạn số đơn hàng/tháng"
                      type="number"
                      value={maxOrdersPerMonth}
                      onChange={(e) => setMaxOrdersPerMonth(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>

                  {hasQuotaConflict && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <span className="font-bold">
                        Gói mới thấp hơn số chi nhánh hiện có. Vui lòng chọn chi nhánh sẽ bị tạm dừng trước khi lưu.
                      </span>
                    </div>
                  )}
                </div>

                {/* Branches status control list */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 mb-2">Danh sách chi nhánh hiện có</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2.5">Tên tiệm</th>
                          <th className="px-4 py-2.5">Địa chỉ</th>
                          <th className="px-4 py-2.5 text-center">Trạng thái hoạt động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {branches.map((branch, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-800">{branch.name}</td>
                            <td className="px-4 py-3 text-slate-600">{branch.address}</td>
                            <td className="px-4 py-3 text-center">
                              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={branch.isActive}
                                  onChange={(e) => handleBranchStatusChange(index, e.target.checked)}
                                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className={branch.isActive ? 'text-emerald-600 font-bold' : 'text-slate-400 font-bold'}>
                                  {branch.isActive ? 'Hoạt động' : 'Tạm nghỉ'}
                                </span>
                              </label>
                            </td>
                          </tr>
                        ))}
                        {branches.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-6 text-center text-slate-400 font-semibold">Chưa có chi nhánh nào được đăng ký.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Security & Account */}
            {activeTab === 'security' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">Tài khoản & Bảo mật</h3>

                <div className="max-w-md flex flex-col gap-4">
                  <Input
                    id="username"
                    label="Tên đăng nhập hệ thống"
                    value={partner.username}
                    readOnly
                    className="bg-slate-50 text-slate-500 font-semibold border-slate-200 cursor-not-allowed"
                  />

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Button variant="outline" size="sm" onClick={handleResetPassword} className="flex items-center gap-1.5">
                      <Key size={15} />
                      Cấp lại mật khẩu mới
                    </Button>
                    <label className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isLocked}
                        onChange={(e) => setIsLocked(e.target.checked)}
                        className="w-4 h-4 rounded text-red-650 focus:ring-red-500 cursor-pointer"
                      />
                      <span className={`text-xs font-bold ${isLocked ? 'text-red-600' : 'text-slate-650'}`}>
                        Tạm khóa tài khoản
                      </span>
                    </label>
                  </div>

                  {resetMessage && (
                    <div className="text-xs text-emerald-700 font-bold p-3 bg-emerald-50 border border-emerald-100 rounded-xl mt-2 animate-fadeIn">
                      {resetMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Extension History Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">Lịch sử gia hạn gói</h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-800">Gia hạn gói {tier} 12 tháng</span>
                  <span className="text-[10px] text-slate-400 font-semibold">01/01/2026</span>
                </div>
                <strong className="text-slate-800 font-bold">6.000.000đ</strong>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-800">Đăng ký mới gói {tier} 12 tháng</span>
                  <span className="text-[10px] text-slate-400 font-semibold">01/01/2025</span>
                </div>
                <strong className="text-slate-800 font-bold">5.000.000đ</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation for changing Tier */}
      <ConfirmDialog
        isOpen={tierConfirmOpen}
        onClose={() => setTierConfirmOpen(false)}
        onConfirm={confirmTierChange}
        title="Xác nhận đổi gói dịch vụ"
        variant="primary"
        message="Việc thay đổi gói dịch vụ sẽ ảnh hưởng đến các tính năng đối tác đang sử dụng, bạn có chắc chắn?"
      />
    </div>
  );
}
