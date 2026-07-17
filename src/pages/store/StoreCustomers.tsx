import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Phone,
  MessageSquare,
  Award,
  ShieldAlert,
  UserCheck,
  Gift,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { PageHeader, Modal, Drawer } from '../../components/common';
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
    dob: '1995-07-17', // Match current simulated date 17/07 for birthday cake icon
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

  // Core database state
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [isStaffMode, setIsStaffMode] = useState(false);

  // Detail Drawer state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'points'>('info');

  // Point Adjustment modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<'add' | 'sub'>('add');
  const [adjustValue, setAdjustValue] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustReasonError, setAdjustReasonError] = useState('');

  // Add Customer modal state (simple mock flow)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addDob, setAddDob] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addPreferredContact, setAddPreferredContact] = useState<'Zalo' | 'SĐT' | 'Email'>('Zalo');
  const [addNotes, setAddNotes] = useState('');
  const [addPhoneError, setAddPhoneError] = useState('');
  const [addNameError, setAddNameError] = useState('');

  // Find currently selected customer dynamically
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  // Mask Phone number: e.g., 0912345678 -> *******678
  const formatPhone = (phone: string, mask: boolean) => {
    if (!phone) return '';
    if (mask) {
      const last3 = phone.slice(-3);
      return `*******${last3}`;
    }
    return phone;
  };

  // Check if birthday is today
  const isBirthdayToday = (dobStr: string) => {
    if (!dobStr) return false;
    const today = new Date();
    const dobParts = dobStr.split('-');
    if (dobParts.length !== 3) return false;
    const dobMonth = parseInt(dobParts[1], 10);
    const dobDay = parseInt(dobParts[2], 10);
    return (today.getMonth() + 1) === dobMonth && today.getDate() === dobDay;
  };

  // Handle Search & Filter logic
  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.id.toLowerCase().includes(query);

    if (statusFilter === 'Tất cả') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  // Handle Point Adjustment
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

  // Handle adding new customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Reset errors
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
      // Validate SĐT is unique (primary key)
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

    // Reset form fields
    setAddName('');
    setAddPhone('');
    setAddDob('');
    setAddAddress('');
    setAddNotes('');
    setAddPreferredContact('Zalo');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <PageHeader
          title="Quản lý khách hàng lẻ"
          description="Quản lý danh sách, hồ sơ cá nhân và điểm thưởng khách hàng."
        />
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 font-bold text-xs shadow-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl transition-colors cursor-pointer border-none"
          >
            <Plus size={15} /> Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Search, Filter Bar and Staff Mode Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        
        {/* Left Side: Search & Filter options */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm theo SĐT, Tên hoặc Mã định danh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Filter Status Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0 max-w-xs">
            <Filter size={14} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                toast(`Lọc khách hàng theo: ${e.target.value}`, 'info');
              }}
              className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 cursor-pointer w-full"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Khách mới">Khách mới</option>
              <option value="Khách thường xuyên">Khách thường xuyên</option>
              <option value="Khách đã lâu không quay lại">Khách đã lâu không quay lại</option>
            </select>
          </div>
        </div>

        {/* Right Side: Security Switch Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs shrink-0 self-end lg:self-auto">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none">
            {isStaffMode ? (
              <ShieldAlert size={14} className="text-amber-505 text-amber-600 animate-pulse" />
            ) : (
              <UserCheck size={14} className="text-emerald-500" />
            )}
            Chế độ nhân viên
          </span>
          <button
            onClick={() => {
              setIsStaffMode(!isStaffMode);
              toast(
                isStaffMode
                  ? 'Đã tắt chế độ nhân viên. Hiển thị số điện thoại đầy đủ.'
                  : 'Đã bật chế độ nhân viên. Số điện thoại đã được ẩn bảo mật.',
                'info'
              );
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isStaffMode ? 'bg-amber-500' : 'bg-slate-200'
            }`}
            aria-label="Toggle Staff Mode"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isStaffMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Table: Desktop Table view with horizontal scroll on mobile */}
      <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">Họ tên / SĐT</th>
              <th className="py-3 px-4">Mã khách hàng</th>
              <th className="py-3 px-4 text-center">Tổng số đơn</th>
              <th className="py-3 px-4 text-right">Tổng chi tiêu</th>
              <th className="py-3 px-4 text-right">Điểm thưởng hiện tại</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-xs">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  Không tìm thấy khách hàng nào khớp với bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const birthday = isBirthdayToday(c.dob);
                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomerId(c.id);
                      setActiveTab('info');
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Name / Phone */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          {c.name}
                          {birthday && (
                            <span
                              className="text-sm select-none cursor-help hover:scale-115 transition-transform"
                              title="Hôm nay là sinh nhật khách hàng! 🎂"
                            >
                              🎂
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Phone size={10} className="text-slate-300" />
                          {formatPhone(c.phone, isStaffMode)}
                        </span>
                      </div>
                    </td>

                    {/* Customer Code */}
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {c.id}
                    </td>

                    {/* Total Orders */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {c.totalOrders}
                    </td>

                    {/* Total Spend */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                      {c.totalSpend.toLocaleString('vi-VN')}đ
                    </td>

                    {/* Loyalty Points */}
                    <td className="py-3.5 px-4 text-right font-black text-blue-600">
                      {c.points}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === 'Khách thường xuyên'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : c.status === 'Khách mới'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setActiveTab('info');
                        }}
                        className="inline-flex items-center justify-center gap-1 py-1.5 px-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-2xs bg-white"
                      >
                        Chi tiết <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={selectedCustomerId !== null}
        onClose={() => setSelectedCustomerId(null)}
        title="Chi tiết Hồ sơ Khách hàng"
        className="w-full max-w-md"
      >
        {selectedCustomer && (
          <div className="flex flex-col h-full justify-between">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0 animate-fadeIn">
                  {selectedCustomer.name.split(' ').pop()?.charAt(0) || 'K'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 truncate">
                    {selectedCustomer.name}
                    {isBirthdayToday(selectedCustomer.dob) && (
                      <span className="text-base" title="Sinh nhật hôm nay!">🎂</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 items-center mt-1">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {selectedCustomer.id}
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                      selectedCustomer.status === 'Khách thường xuyên'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : selectedCustomer.status === 'Khách mới'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigations */}
              <div className="flex border-b border-slate-200 gap-4 mb-4">
                {[
                  { key: 'info', label: 'Thông tin' },
                  { key: 'orders', label: `Đơn hàng (${selectedCustomer.orders.length})` },
                  { key: 'points', label: 'Lịch sử điểm' }
                ].map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key as any)}
                    className={`pb-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === t.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="mt-2 min-h-[300px]">
                
                {/* Tab 1: Info */}
                {activeTab === 'info' && (
                  <div className="flex flex-col gap-4 animate-fadeIn text-xs text-slate-900">
                    <div className="grid grid-cols-2 gap-3.5 bg-slate-50/75 p-3.5 rounded-xl border border-slate-150">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Họ và tên</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5">{selectedCustomer.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Số điện thoại</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5">
                          {formatPhone(selectedCustomer.phone, isStaffMode)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Ngày sinh</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5">
                          {selectedCustomer.dob ? new Date(selectedCustomer.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Liên hệ ưu tiên</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5">{selectedCustomer.preferredContact}</span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Địa chỉ</span>
                        <span className="text-xs font-medium text-slate-700 mt-0.5">{selectedCustomer.address}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50/40 border border-blue-100/70 p-3.5 rounded-xl flex flex-col gap-1">
                      <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                        <span>💡</span> Ghi chú sở thích
                      </span>
                      <p className="text-xs text-blue-900/90 leading-relaxed font-semibold italic">
                        "{selectedCustomer.notes}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Orders History */}
                {activeTab === 'orders' && (
                  <div className="flex flex-col gap-3 animate-fadeIn">
                    {selectedCustomer.orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <ClipboardList size={28} className="text-slate-300 mb-2" />
                        <span className="text-xs font-medium">Chưa có đơn hàng nào.</span>
                      </div>
                    ) : (
                      selectedCustomer.orders.map((order) => (
                        <div
                          key={order.id}
                          onClick={() => toast(`Chi tiết đơn hàng ${order.id}: ${order.service} - ${order.amount.toLocaleString()}đ (Giao diện giả lập)`, 'info')}
                          className="bg-white border border-slate-150 hover:border-blue-300 p-3 rounded-xl shadow-2xs cursor-pointer transition-all flex flex-col gap-1.5 text-slate-800"
                        >
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-blue-650">{order.id}</span>
                            <span className="text-slate-400 font-medium">{order.date}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700">{order.service}</span>
                            <span className="font-bold text-slate-900">{order.amount.toLocaleString('vi-VN')}đ</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-50 pt-1.5 mt-1">
                            <span className="text-[10px] text-slate-400">Trạng thái:</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'Đã hoàn thành' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 3: Points History */}
                {activeTab === 'points' && (
                  <div className="flex flex-col gap-3 animate-fadeIn">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                      <span className="text-xs font-bold text-slate-655 text-slate-600">ĐIỂM HIỆN TẠI</span>
                      <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-150 flex items-center gap-1">
                        <Gift size={12} /> {selectedCustomer.points} Điểm
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                      {selectedCustomer.pointsHistory.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs">Chưa ghi nhận biến động điểm.</div>
                      ) : (
                        [...selectedCustomer.pointsHistory].reverse().map((log) => {
                          const isPositive = log.points > 0;
                          return (
                            <div key={log.id} className="flex justify-between items-start gap-4 border-b border-slate-100 pb-2 text-slate-800">
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-xs font-bold text-slate-700 break-words leading-tight">{log.reason}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Clock size={10} /> {log.date}
                                </span>
                              </div>
                              <span className={`text-xs font-extrabold shrink-0 flex items-center gap-0.5 ${
                                isPositive ? 'text-emerald-600' : 'text-rose-600'
                              }`}>
                                {isPositive ? (
                                  <TrendingUp size={11} className="inline animate-bounce" />
                                ) : (
                                  <TrendingDown size={11} className="inline" />
                                )}
                                {isPositive ? `+${log.points}` : log.points}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="mt-8 border-t border-slate-150 pt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  toast(`Giả lập: Đã gửi tin nhắn Zalo chăm sóc đến SĐT ${selectedCustomer.phone}!`, 'success');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer border border-transparent"
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
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer bg-white"
              >
                <Award size={14} className="text-amber-500" /> Điều chỉnh điểm
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Point Adjustment Modal */}
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
          <div className="flex flex-col gap-4 text-slate-800">
            {/* Target customer header */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">Khách hàng:</span>
              <span className="font-bold text-slate-800">{selectedCustomer.name} ({selectedCustomer.id})</span>
            </div>

            {/* Add / Subtract options */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setAdjustType('add')}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  adjustType === 'add' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Cộng điểm (+)
              </button>
              <button
                type="button"
                onClick={() => setAdjustType('sub')}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  adjustType === 'sub' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Trừ điểm (-)
              </button>
            </div>

            {/* Number of Points */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Số điểm cần điều chỉnh</label>
              <input
                type="number"
                value={adjustValue}
                onChange={(e) => setAdjustValue(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                min="1"
              />
            </div>

            {/* Reason - Required */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Lý do điều chỉnh <span className="text-rose-500 font-bold">*</span>
              </label>
              <textarea
                value={adjustReason}
                onChange={(e) => {
                  setAdjustReason(e.target.value);
                  if (e.target.value.trim()) setAdjustReasonError('');
                }}
                placeholder="Nhập lý do điều chỉnh bắt buộc (ví dụ: Cộng điểm từ đơn offline, Đổi quà voucher...)"
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all h-20 resize-none ${
                  adjustReasonError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                }`}
              />
              {adjustReasonError && (
                <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                  ⚠️ {adjustReasonError}
                </span>
              )}
            </div>

            {/* Sync Alert Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1.5">
                <Info size={11} className="shrink-0" /> Ghi chú đồng bộ:
              </span>
              <p className="text-[10px] text-amber-900 leading-relaxed font-semibold">
                Điểm thưởng sẽ được đồng bộ ngay lên App khách hàng.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdjustModalOpen(false);
                  setAdjustReason('');
                  setAdjustReasonError('');
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-slate-650 bg-white"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmPointsAdjustment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Customer Modal (simple mock UI flow) */}
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
        title="Thêm mới khách hàng lẻ"
        size="md"
      >
        <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4 text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và tên <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={addName}
                onChange={(e) => {
                  setAddName(e.target.value);
                  if (e.target.value.trim()) setAddNameError('');
                }}
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all ${
                  addNameError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                }`}
              />
              {addNameError && (
                <span className="text-[10px] font-bold text-rose-500">⚠️ {addNameError}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="09xxxxxxxx"
                value={addPhone}
                onChange={(e) => {
                  setAddPhone(e.target.value.replace(/[^0-9]/g, ''));
                  if (e.target.value.trim()) setAddPhoneError('');
                }}
                className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all ${
                  addPhoneError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                }`}
              />
              {addPhoneError && (
                <span className="text-[10px] font-bold text-rose-500">⚠️ {addPhoneError}</span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Ngày sinh</label>
              <input
                type="date"
                value={addDob}
                onChange={(e) => setAddDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all"
              />
            </div>

            {/* Preferred Contact Channel */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Kênh liên hệ ưu tiên</label>
              <select
                value={addPreferredContact}
                onChange={(e) => setAddPreferredContact(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
              >
                <option value="Zalo">Zalo</option>
                <option value="SĐT">Số điện thoại (SMS)</option>
                <option value="Email">Email</option>
              </select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Địa chỉ cư trú</label>
              <input
                type="text"
                placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP"
                value={addAddress}
                onChange={(e) => setAddAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all"
              />
            </div>

            {/* Hobby / Notes */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Ghi chú sở thích, đặc thù</label>
              <textarea
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                placeholder="Ví dụ: Thích dùng nước xả Comfort, chỉ giao hàng sau giờ hành chính..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all h-20 resize-none"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 justify-end mt-4 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setAddName('');
                setAddPhone('');
                setAddDob('');
                setAddAddress('');
                setAddNotes('');
                setAddNameError('');
                setAddPhoneError('');
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-slate-650 bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
