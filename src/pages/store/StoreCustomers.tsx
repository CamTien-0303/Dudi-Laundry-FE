import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  Award,
  ShieldAlert,
  UserCheck,
  Gift,
  ChevronRight,
  Users,
  UserPlus,
  Clock3,
  Sparkles
} from 'lucide-react';
import { Modal, Drawer } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface PointLog {
  id: string;
  date: string;
  points: number;
  reason: string;
}

interface OrderItem {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  points: number;
  status: 'Khách mới' | 'Khách thường xuyên' | 'Khách đã lâu không quay lại';
  dob: string;
  address: string;
  preferredContact: 'Zalo' | 'SĐT' | 'Email';
  notes: string;
  orders: OrderItem[];
  pointsHistory: PointLog[];
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'KH001',
    name: 'Nguyễn Văn An',
    phone: '0912345678',
    totalOrders: 15,
    totalSpend: 3200000,
    points: 120,
    status: 'Khách thường xuyên',
    dob: '1995-07-17',
    address: '120 Đường Tôn Dật Tiên, Tân Phong, Quận 7, TP.HCM',
    preferredContact: 'Zalo',
    notes: 'Thích dùng nước xả Comfort hương ban mai. Thích sấy khô hoàn toàn.',
    orders: [
      { id: 'ORD-101', date: '2026-07-10', service: 'Giặt sấy sấy thơm', amount: 120000, status: 'Đã hoàn thành' },
      { id: 'ORD-102', date: '2026-07-12', service: 'Vệ sinh giày Sneaker', amount: 150000, status: 'Đã hoàn thành' },
      { id: 'ORD-105', date: '2026-07-15', service: 'Giặt hấp áo vest lụa', amount: 350000, status: 'Đang xử lý' },
    ],
    pointsHistory: [
      { id: 'PH001', date: '2026-07-10 10:15', points: 12, reason: 'Tích điểm đơn hàng ORD-101' },
      { id: 'PH002', date: '2026-07-12 16:30', points: 15, reason: 'Tích điểm đơn hàng ORD-102' },
      { id: 'PH003', date: '2026-07-14 09:00', points: -50, reason: 'Đổi voucher giảm giá 50k' },
      { id: 'PH004', date: '2026-07-15 14:00', points: 35, reason: 'Tích điểm đơn hàng ORD-105' },
    ]
  },
  {
    id: 'KH002',
    name: 'Trần Thị Bình',
    phone: '0987654321',
    totalOrders: 12,
    totalSpend: 2500000,
    points: 85,
    status: 'Khách thường xuyên',
    dob: '1998-05-12',
    address: '45 Đường Nguyễn Hữu Thọ, Tân Hưng, Quận 7, TP.HCM',
    preferredContact: 'Zalo',
    notes: 'Không lấy móc treo nhựa, chỉ sử dụng móc treo nhôm. Yêu cầu xếp gọn gàng.',
    orders: [
      { id: 'ORD-098', date: '2026-06-20', service: 'Giặt sấy chăn ga gối', amount: 250000, status: 'Đã hoàn thành' },
      { id: 'ORD-103', date: '2026-07-13', service: 'Giặt sấy sấy thơm', amount: 180000, status: 'Đã hoàn thành' },
    ],
    pointsHistory: [
      { id: 'PH005', date: '2026-06-20 11:00', points: 25, reason: 'Tích điểm đơn hàng ORD-098' },
      { id: 'PH006', date: '2026-07-13 14:22', points: 18, reason: 'Tích điểm đơn hàng ORD-103' },
    ]
  },
  {
    id: 'KH003',
    name: 'Lê Hoàng Nam',
    phone: '0909998887',
    totalOrders: 2,
    totalSpend: 450000,
    points: 45,
    status: 'Khách mới',
    dob: '1992-11-20',
    address: '88 Đường Song Hành, An Phú, Quận 2, TP.HCM',
    preferredContact: 'SĐT',
    notes: 'Cần giao gấp vào buổi tối từ 19:00 - 21:00.',
    orders: [
      { id: 'ORD-104', date: '2026-07-14', service: 'Giặt hấp áo dài', amount: 450000, status: 'Đã hoàn thành' }
    ],
    pointsHistory: [
      { id: 'PH007', date: '2026-07-14 17:45', points: 45, reason: 'Tích điểm đơn hàng ORD-104' }
    ]
  },
  {
    id: 'KH004',
    name: 'Phạm Minh Đức',
    phone: '0933334444',
    totalOrders: 1,
    totalSpend: 150000,
    points: 15,
    status: 'Khách mới',
    dob: '1994-08-05',
    address: '23 Đường Nguyễn Thị Thập, Tân Quy, Quận 7, TP.HCM',
    preferredContact: 'Email',
    notes: 'Giặt sấy quần áo len nhẹ tay, không vắt quá mạnh.',
    orders: [
      { id: 'ORD-106', date: '2026-07-16', service: 'Giặt sấy nhẹ tay', amount: 150000, status: 'Đã hoàn thành' }
    ],
    pointsHistory: [
      { id: 'PH008', date: '2026-07-16 10:30', points: 15, reason: 'Tích điểm đơn hàng ORD-106' }
    ]
  },
  {
    id: 'KH005',
    name: 'Vũ Thị Hương',
    phone: '0944455566',
    totalOrders: 24,
    totalSpend: 6200000,
    points: 350,
    status: 'Khách đã lâu không quay lại',
    dob: '1990-03-15',
    address: '56 Đường Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
    preferredContact: 'Zalo',
    notes: 'Khách VIP, thích sấy thơm mùi Lavender, giặt sấy sấy kỹ.',
    orders: [
      { id: 'ORD-060', date: '2026-04-12', service: 'Giặt sấy sấy thơm', amount: 200000, status: 'Đã hoàn thành' },
      { id: 'ORD-065', date: '2026-04-20', service: 'Giặt sấy sấy thơm', amount: 300000, status: 'Đã hoàn thành' }
    ],
    pointsHistory: [
      { id: 'PH009', date: '2026-04-12 11:30', points: 20, reason: 'Tích điểm đơn hàng ORD-060' },
      { id: 'PH010', date: '2026-04-20 15:45', points: 30, reason: 'Tích điểm đơn hàng ORD-065' }
    ]
  }
];

export default function StoreCustomers() {
  const { toast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [isStaffMode, setIsStaffMode] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'points'>('info');

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<'add' | 'sub'>('add');
  const [adjustValue, setAdjustValue] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustReasonError, setAdjustReasonError] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addDob, setAddDob] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addPreferredContact, setAddPreferredContact] = useState<'Zalo' | 'SĐT' | 'Email'>('Zalo');
  const [addNotes, setAddNotes] = useState('');
  const [addPhoneError, setAddPhoneError] = useState('');
  const [addNameError, setAddNameError] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  const formatPhone = (phone: string, mask: boolean) => {
    if (!phone) return '';
    if (mask) {
      const last3 = phone.slice(-3);
      return `*******${last3}`;
    }
    return phone;
  };

  const getInitials = (name: string) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isBirthdayToday = (dobStr: string) => {
    if (!dobStr) return false;
    const today = new Date();
    const dobParts = dobStr.split('-');
    if (dobParts.length !== 3) return false;
    const dobMonth = parseInt(dobParts[1], 10);
    const dobDay = parseInt(dobParts[2], 10);
    return (today.getMonth() + 1) === dobMonth && today.getDate() === dobDay;
  };

  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.id.toLowerCase().includes(query);

    if (statusFilter === 'Tất cả') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  // Calculate Customer Insight Counts
  const totalCount = customers.length;
  const regularCount = customers.filter(c => c.status === 'Khách thường xuyên').length;
  const newCount = customers.filter(c => c.status === 'Khách mới').length;
  const inactiveCount = customers.filter(c => c.status === 'Khách đã lâu không quay lại').length;

  const handleConfirmPointsAdjustment = () => {
    if (!adjustReason.trim()) {
      setAdjustReasonError('Lý do điều chỉnh điểm thưởng không được để trống.');
      return;
    }

    if (!selectedCustomer) return;

    const delta = adjustType === 'add' ? adjustValue : -adjustValue;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog: PointLog = {
      id: `PH-${Date.now()}`,
      date: formattedDate,
      points: delta,
      reason: adjustReason.trim()
    };

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            points: Math.max(0, c.points + delta),
            pointsHistory: [...c.pointsHistory, newLog]
          };
        }
        return c;
      })
    );

    setIsAdjustModalOpen(false);
    setAdjustReason('');
    setAdjustReasonError('');
    toast('Điểm thưởng của khách hàng đã được cập nhật.', 'success');
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    setAddNameError('');
    setAddPhoneError('');

    if (!addName.trim()) {
      setAddNameError('Họ tên không được để trống.');
      hasError = true;
    }

    if (!addPhone.trim()) {
      setAddPhoneError('Số điện thoại không được để trống.');
      hasError = true;
    } else {
      const phoneExists = customers.some(c => c.phone.trim() === addPhone.trim());
      if (phoneExists) {
        setAddPhoneError('Số điện thoại này đã tồn tại trên hệ thống!');
        hasError = true;
      }
    }

    if (hasError) return;

    const newCustomer: Customer = {
      id: `KH${String(customers.length + 1).padStart(3, '0')}`,
      name: addName.trim(),
      phone: addPhone.trim(),
      totalOrders: 0,
      totalSpend: 0,
      points: 0,
      status: 'Khách mới',
      dob: addDob || '1998-01-01',
      address: addAddress.trim() || 'Chưa cập nhật',
      preferredContact: addPreferredContact,
      notes: addNotes.trim() || 'Thích giặt xả Comfort.',
      orders: [],
      pointsHistory: []
    };

    setCustomers(prev => [...prev, newCustomer]);
    setIsAddModalOpen(false);
    toast('Đã thêm khách hàng lẻ mới thành công.', 'success');

    setAddName('');
    setAddPhone('');
    setAddDob('');
    setAddAddress('');
    setAddNotes('');
    setAddPreferredContact('Zalo');
  };

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-5 text-left">
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

      {/* 1. COMPACT CRM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            STORE CUSTOMER CRM WORKSPACE
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý hồ sơ &amp; chăm sóc khách hàng
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Thêm khách hàng mới</span>
        </button>
      </div>

      {/* 2. CUSTOMER INSIGHT STRIP (Pastel Accents: Blue / Mint / Lavender / Soft Orange-Red) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Total Customers */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 shadow-2xs flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#2563EB] uppercase">
            <span>TỔNG KHÁCH HÀNG</span>
            <Users size={14} />
          </div>
          <strong className="text-2xl font-black text-slate-900">{totalCount}</strong>
          <span className="text-[10px] font-bold text-blue-700">Hồ sơ lưu trữ</span>
        </div>

        {/* Regular Customers (Mint Pastel Accent) */}
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3.5 shadow-2xs flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-emerald-800 uppercase">
            <span>THƯỜNG XUYÊN</span>
            <Sparkles size={14} className="text-emerald-600" />
          </div>
          <strong className="text-2xl font-black text-emerald-900">{regularCount}</strong>
          <span className="text-[10px] font-bold text-emerald-700">Khách hàng thân thiết</span>
        </div>

        {/* New Customers (Lavender Pastel Accent) */}
        <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl p-3.5 shadow-2xs flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-800 uppercase">
            <span>KHÁCH MỚI</span>
            <UserPlus size={14} className="text-indigo-600" />
          </div>
          <strong className="text-2xl font-black text-indigo-900">{newCount}</strong>
          <span className="text-[10px] font-bold text-indigo-700">Gia nhập gần đây</span>
        </div>

        {/* Inactive / Lâu chưa quay lại (Soft Orange-Red Accent) */}
        <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-3.5 shadow-2xs flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-amber-900 uppercase">
            <span>CẦN CHĂM SÓC</span>
            <Clock3 size={14} className="text-amber-600" />
          </div>
          <strong className="text-2xl font-black text-amber-900">{inactiveCount}</strong>
          <span className="text-[10px] font-bold text-amber-800">Lâu chưa quay lại</span>
        </div>

      </div>

      {/* 3. COMPACT SEARCH, FILTER & STAFF SECURITY TOOLBAR */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto flex-1">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Tìm tên, SĐT, mã khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md pl-8 pr-3 py-1.5 outline-none transition-all"
            />
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md px-3 py-1.5 w-full sm:w-auto">
            <Filter size={13} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                toast(`Lọc khách hàng theo: ${e.target.value}`, 'info');
              }}
              className="bg-transparent border-none outline-none text-xs font-bold text-slate-800 cursor-pointer w-full"
            >
              <option value="Tất cả">Tất cả phân loại</option>
              <option value="Khách thường xuyên">Khách thường xuyên</option>
              <option value="Khách mới">Khách mới</option>
              <option value="Khách đã lâu không quay lại">Khách lâu chưa quay lại</option>
            </select>
          </div>
        </div>

        {/* Staff Security Mode Switch */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md px-3 py-1.5 shrink-0 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            {isStaffMode ? (
              <ShieldAlert size={14} className="text-amber-600" />
            ) : (
              <UserCheck size={14} className="text-emerald-600" />
            )}
            Chế độ nhân viên
          </span>
          <button
            type="button"
            onClick={() => {
              setIsStaffMode(!isStaffMode);
              toast(
                isStaffMode
                  ? 'Đã tắt chế độ nhân viên. Hiển thị SĐT đầy đủ.'
                  : 'Đã bật chế độ nhân viên. SĐT đã được ẩn bảo mật.',
                'info'
              );
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isStaffMode ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                isStaffMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

      {/* 4. CRM CUSTOMER TABLE (Professional Table with Initials Avatar) */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Mã KH</th>
                <th className="py-3 px-4 text-center">Tổng số đơn</th>
                <th className="py-3 px-4 text-right">Tổng chi tiêu</th>
                <th className="py-3 px-4 text-right">Điểm tích lũy</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400 font-semibold">
                    Không tìm thấy hồ sơ khách hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const birthday = isBirthdayToday(c.dob);
                  const initials = getInitials(c.name);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setActiveTab('info');
                      }}
                      className="bg-white hover:bg-[#EEF4FF]/40 transition-colors cursor-pointer group"
                    >
                      {/* Name with Avatar Initials & Phone */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#EEF4FF] border border-[#BFDBFE] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <strong className="font-bold text-slate-900 text-xs flex items-center gap-1">
                              {c.name}
                              {birthday && (
                                <span className="text-xs" title="Sinh nhật hôm nay!">🎂</span>
                              )}
                            </strong>
                            <span className="text-[10px] text-slate-400 font-mono font-semibold">
                              {formatPhone(c.phone, isStaffMode)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                        {c.id}
                      </td>

                      {/* Total Orders */}
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {c.totalOrders} đơn
                      </td>

                      {/* Total Spend */}
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                        {c.totalSpend.toLocaleString('vi-VN')}đ
                      </td>

                      {/* Loyalty Points */}
                      <td className="py-3 px-4 text-right font-mono font-black text-[#2563EB]">
                        <span className="inline-flex items-center justify-end gap-1">
                          <Gift size={12} className="text-[#2563EB]" />
                          {c.points} điểm
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {c.status === 'Khách thường xuyên' && (
                          <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded text-[10px] font-bold">
                            Khách thường xuyên
                          </span>
                        )}
                        {c.status === 'Khách mới' && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                            Khách mới
                          </span>
                        )}
                        {c.status === 'Khách đã lâu không quay lại' && (
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                            Lâu chưa quay lại
                          </span>
                        )}
                      </td>

                      {/* Action Link */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomerId(c.id);
                            setActiveTab('info');
                          }}
                          className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-0.5 bg-transparent border-0 cursor-pointer"
                        >
                          <span>Chi tiết</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CUSTOMER DETAIL DRAWER */}
      <Drawer
        isOpen={selectedCustomerId !== null}
        onClose={() => setSelectedCustomerId(null)}
        title="Hồ sơ chi tiết khách hàng"
        className="w-full sm:w-[420px]"
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-4 text-left text-xs p-1">
            
            {/* Header info */}
            <div className="flex items-center gap-3 border-b border-[#DCE5F0] pb-3">
              <div className="w-11 h-11 bg-[#2563EB] text-white font-bold rounded-xl flex items-center justify-center text-sm shrink-0">
                {getInitials(selectedCustomer.name)}
              </div>
              <div className="min-w-0 flex flex-col">
                <strong className="text-base font-black text-slate-900 truncate">
                  {selectedCustomer.name}
                  {isBirthdayToday(selectedCustomer.dob) && ' 🎂'}
                </strong>
                <span className="text-slate-500 font-mono text-[11px]">
                  {selectedCustomer.id} · {formatPhone(selectedCustomer.phone, isStaffMode)}
                </span>
              </div>
            </div>

            {/* Tab Navigations */}
            <div className="flex border-b border-[#DCE5F0] gap-4">
              {[
                { key: 'info', label: 'Thông tin' },
                { key: 'orders', label: `Lịch sử đơn (${selectedCustomer.orders.length})` },
                { key: 'points', label: 'Tích điểm' }
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key as any)}
                  className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer bg-transparent ${
                    activeTab === t.key
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[260px]">
              {activeTab === 'info' && (
                <div className="flex flex-col gap-3">
                  <div className="bg-[#F8FAFC] border border-[#DCE5F0] p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Ngày sinh:</span>
                      <strong className="text-slate-900">{selectedCustomer.dob || 'Chưa cập nhật'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Kênh liên hệ:</span>
                      <strong className="text-slate-900">{selectedCustomer.preferredContact}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Địa chỉ:</span>
                      <strong className="text-slate-900 text-right truncate max-w-[200px]">{selectedCustomer.address}</strong>
                    </div>
                  </div>

                  <div className="bg-[#EEF4FF] border border-[#BFDBFE] p-3 rounded-lg text-xs">
                    <span className="font-bold text-[#2563EB]">💡 Ghi chú sở thích:</span>
                    <p className="text-slate-800 mt-1 italic">"{selectedCustomer.notes}"</p>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="flex flex-col gap-2">
                  {selectedCustomer.orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-semibold">Chưa có đơn hàng nào</div>
                  ) : (
                    selectedCustomer.orders.map(o => (
                      <div key={o.id} className="p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg flex justify-between items-center">
                        <div className="flex flex-col">
                          <strong className="font-mono text-[#2563EB]">{o.id}</strong>
                          <span className="text-slate-600 text-[11px]">{o.service}</span>
                        </div>
                        <strong className="font-mono font-bold text-slate-900">{o.amount.toLocaleString('vi-VN')}đ</strong>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'points' && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-[#EEF4FF] p-3 rounded-lg border border-[#BFDBFE]">
                    <span className="font-bold text-slate-700">Điểm hiện tại:</span>
                    <strong className="text-[#2563EB] font-mono text-base">{selectedCustomer.points} điểm</strong>
                  </div>

                  <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto">
                    {selectedCustomer.pointsHistory.map(log => (
                      <div key={log.id} className="p-2 border-b border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-700 font-medium">{log.reason}</span>
                        <strong className={log.points > 0 ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}>
                          {log.points > 0 ? `+${log.points}` : log.points}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 border-t border-[#DCE5F0] pt-3">
              <button
                type="button"
                onClick={() => toast(`Đã gửi tin nhắn Zalo chăm sóc đến SĐT ${selectedCustomer.phone}!`, 'success')}
                className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-md text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5"
              >
                <MessageSquare size={14} /> Gửi tin nhắn Zalo
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdjustReason('');
                  setAdjustReasonError('');
                  setAdjustValue(10);
                  setIsAdjustModalOpen(true);
                }}
                className="w-full py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] text-slate-700 font-bold rounded-md text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award size={14} className="text-amber-600" /> Điều chỉnh điểm thưởng
              </button>
            </div>

          </div>
        )}
      </Drawer>

      {/* 6. POINT ADJUSTMENT MODAL */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => {
          setIsAdjustModalOpen(false);
          setAdjustReason('');
          setAdjustReasonError('');
        }}
        title="Điều chỉnh điểm thưởng"
        size="sm"
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-3 text-left text-xs">
            <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#DCE5F0] flex justify-between">
              <span className="text-slate-500 font-bold">Khách hàng:</span>
              <strong className="text-slate-900">{selectedCustomer.name} ({selectedCustomer.id})</strong>
            </div>

            <div className="flex bg-[#F8FAFC] p-1 rounded border border-[#DCE5F0] gap-1">
              <button
                type="button"
                onClick={() => setAdjustType('add')}
                className={`flex-1 py-1 text-center font-bold rounded cursor-pointer border-0 ${
                  adjustType === 'add' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                }`}
              >
                Cộng điểm (+)
              </button>
              <button
                type="button"
                onClick={() => setAdjustType('sub')}
                className={`flex-1 py-1 text-center font-bold rounded cursor-pointer border-0 ${
                  adjustType === 'sub' ? 'bg-rose-600 text-white' : 'text-slate-600'
                }`}
              >
                Trừ điểm (-)
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">Số điểm cần điều chỉnh</label>
              <input
                type="number"
                value={adjustValue}
                onChange={(e) => setAdjustValue(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-bold outline-none"
                min="1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">
                Lý do điều chỉnh *
              </label>
              <textarea
                value={adjustReason}
                onChange={(e) => {
                  setAdjustReason(e.target.value);
                  if (e.target.value.trim()) setAdjustReasonError('');
                }}
                placeholder="Nhập lý do bắt buộc (Ví dụ: Đổi quà voucher, Cộng điểm bù...)"
                className="w-full h-16 p-2 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none resize-none"
              />
              {adjustReasonError && <span className="text-red-500 font-bold">{adjustReasonError}</span>}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded cursor-pointer border-0"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmPointsAdjustment}
                className="px-3 py-1.5 bg-[#2563EB] text-white font-bold rounded cursor-pointer border-0"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 7. ADD CUSTOMER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddName('');
          setAddPhone('');
          setAddDob('');
          setAddAddress('');
          setAddNotes('');
          setAddNameError('');
          setAddPhoneError('');
        }}
        title="Thêm khách hàng mới"
        size="sm"
      >
        <form onSubmit={handleCreateCustomer} className="flex flex-col gap-3 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Họ và tên *</label>
            <input
              type="text"
              placeholder="Nhập họ và tên..."
              value={addName}
              onChange={(e) => {
                setAddName(e.target.value);
                if (e.target.value.trim()) setAddNameError('');
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-semibold outline-none"
            />
            {addNameError && <span className="text-red-500 font-bold">{addNameError}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Số điện thoại *</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại 10 số..."
              value={addPhone}
              onChange={(e) => {
                setAddPhone(e.target.value.replace(/[^0-9]/g, ''));
                if (e.target.value.trim()) setAddPhoneError('');
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-semibold outline-none"
            />
            {addPhoneError && <span className="text-red-500 font-bold">{addPhoneError}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Ngày sinh</label>
            <input
              type="date"
              value={addDob}
              onChange={(e) => setAddDob(e.target.value)}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-semibold outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2563EB] text-white font-bold rounded cursor-pointer border-0 shadow-2xs"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
