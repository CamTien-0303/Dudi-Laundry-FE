import { useState } from 'react';
import { 
  Phone, Mail, MapPin, 
  Clock, Download, 
  Plus, ShieldAlert, User, Building2
} from 'lucide-react';
import { Modal, StatusBadge, Button } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface B2BPartner {
  id: string;
  name: string;
  type: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  period: 'Tuần' | 'Tháng';
  debt: {
    unreconciled: number;
    old: number;
  };
  tier: 'Bạc' | 'Vàng' | 'Kim cương';
  logo: string;
  notes: string;
  hasOrdersInPeriod: boolean;
}

const INITIAL_PARTNERS: B2BPartner[] = [
  {
    id: 'b2b-1',
    name: 'Khách sạn Sunrise',
    type: 'Khách sạn',
    contactPerson: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    email: 'contact@sunrisehotel.com',
    address: '120 Đường Tôn Dật Tiên, Tân Phong, Quận 7, TP.HCM',
    period: 'Tháng',
    debt: {
      unreconciled: 4500000,
      old: 1500000,
    },
    tier: 'Kim cương',
    logo: '🏨',
    notes: 'Giao nhận tại sảnh sau khách sạn từ 8:00 - 10:00 sáng. Yêu cầu giặt xả xịt tinh dầu nhẹ.',
    hasOrdersInPeriod: true
  },
  {
    id: 'b2b-2',
    name: 'Lotus Gym & Fitness',
    type: 'Gym',
    contactPerson: 'Trần Thị Mai',
    phone: '0987654321',
    email: 'info@lotusgym.vn',
    address: '45 Đường Nguyễn Hữu Thọ, Tân Hưng, Quận 7, TP.HCM',
    period: 'Tuần',
    debt: {
      unreconciled: 1200000,
      old: 0,
    },
    tier: 'Vàng',
    logo: '🏋️',
    notes: 'Chỉ gom khăn và đồ tập thể thao. Giao nhận thứ 2 và thứ 5 hàng tuần.',
    hasOrdersInPeriod: true
  },
  {
    id: 'b2b-3',
    name: 'An Nhiên Spa & Massage',
    type: 'Spa',
    contactPerson: 'Lê Hoài An',
    phone: '0909998887',
    email: 'annhienspa@gmail.com',
    address: '88 Đường song hành, An Phú, Quận 2, TP.HCM',
    period: 'Tuần',
    debt: {
      unreconciled: 0,
      old: 0,
    },
    tier: 'Bạc',
    logo: '🌿',
    notes: 'Yêu cầu tẩy sạch tinh dầu mát-xa trên khăn. Không dùng xả hương quá nồng.',
    hasOrdersInPeriod: false
  }
];

const MOCK_SERVICES = [
  { id: 's1', name: 'Giặt sấy theo kg', retailPrice: 15000, partnerPrice: 10000, unit: 'kg' },
  { id: 's2', name: 'Giặt hấp áo vest', retailPrice: 80000, partnerPrice: 65000, unit: 'cái' },
  { id: 's3', name: 'Vệ sinh giày', retailPrice: 60000, partnerPrice: 50000, unit: 'đôi' }
];

const MOCK_ORDERS = [
  { id: 'ORD-B2B-101', date: '2026-07-10', service: 'Giặt sấy khăn tắm', weight: '120 kg', amount: 1200000, status: 'Chưa thanh toán' },
  { id: 'ORD-B2B-102', date: '2026-07-12', service: 'Giặt sấy ra trải giường', weight: '250 kg', amount: 2500000, status: 'Chưa thanh toán' },
  { id: 'ORD-B2B-103', date: '2026-07-14', service: 'Giặt hấp đồng phục', weight: '20 cái', amount: 800000, status: 'Chưa thanh toán' }
];

const MOCK_HISTORY = [
  { id: 'REC-2026-06', period: 'Tháng 06/2026', total: 6800000, status: 'Đã thanh toán', date: '2026-06-30' },
  { id: 'REC-2026-05', period: 'Tháng 05/2026', total: 5400000, status: 'Đã thanh toán', date: '2026-05-31' }
];

export default function StoreB2B() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<B2BPartner[]>(INITIAL_PARTNERS);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('b2b-1');
  const [activeTab, setActiveTab] = useState<'info' | 'pricing' | 'orders' | 'debt'>('info');
  
  // Custom prices state
  const [partnerPrices, setPartnerPrices] = useState<Record<string, number>>({
    s1: 10000,
    s2: 65000,
    s3: 50000
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Form states for new partner
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState<string>('Khách sạn');
  const [customPartnerType, setCustomPartnerType] = useState('');
  const [newPartnerContact, setNewPartnerContact] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerAddress, setNewPartnerAddress] = useState('');
  const [newPartnerPeriod, setNewPartnerPeriod] = useState<'Tuần' | 'Tháng'>('Tháng');
  const [newPartnerNotes, setNewPartnerNotes] = useState('');

  const selectedPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  // Actions
  const resetForm = () => {
    setNewPartnerName('');
    setNewPartnerType('Khách sạn');
    setCustomPartnerType('');
    setNewPartnerContact('');
    setNewPartnerPhone('');
    setNewPartnerEmail('');
    setNewPartnerAddress('');
    setNewPartnerPeriod('Tháng');
    setNewPartnerNotes('');
  };

  const handleSavePrices = () => {
    toast('Đã lưu cấu hình bảng giá riêng cho đối tác.', 'success');
  };

  const handlePriceChange = (serviceId: string, value: string) => {
    const numericVal = parseInt(value, 10) || 0;
    setPartnerPrices(prev => ({ ...prev, [serviceId]: numericVal }));
  };

  const handleChotCongNo = () => {
    if (!selectedPartner.hasOrdersInPeriod) {
      toast('Không thể chốt công nợ vì kỳ này không phát sinh đơn hàng!', 'error');
      return;
    }
    toast('Đã chốt công nợ & tạo yêu cầu thanh toán thành công.', 'success');
    toast('Giả lập: Thông báo đối soát đã được gửi qua Zalo/Email cho đối tác.', 'info');
  };

  const handleConfirmPayment = () => {
    setPartners(prev => prev.map(p => {
      if (p.id === selectedPartner.id) {
        return {
          ...p,
          debt: { unreconciled: 0, old: 0 }
        };
      }
      return p;
    }));
    toast(`Đã xác nhận thu tiền B2B cho ${selectedPartner.name}. Công nợ đã được xóa.`, 'success');
  };

  const handleExportPdf = () => {
    toast('Đang khởi tạo tệp biên bản đối soát PDF...', 'info');
    setIsPdfModalOpen(true);
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerContact.trim() || !newPartnerPhone.trim()) {
      toast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'error');
      return;
    }

    let typeToSave = newPartnerType;
    if (newPartnerType === 'Khác') {
      const trimmedCustom = customPartnerType.trim();
      if (!trimmedCustom) {
        toast('Vui lòng nhập loại hình doanh nghiệp cụ thể!', 'error');
        return;
      }
      if (trimmedCustom.toLowerCase() === 'khác') {
        toast('Không được sử dụng chữ "Khác" làm loại hình doanh nghiệp!', 'error');
        return;
      }
      typeToSave = trimmedCustom;
    }

    const logoMap: Record<string, string> = {
      'Khách sạn': '🏨',
      'Gym/Fitness': '🏋️',
      'Gym': '🏋️',
      'Spa/Salon': '🌿',
      'Spa': '🌿',
      'Nhà hàng/Café': '☕',
      'Phòng khám/Bệnh viện': '🏥',
      'Trường học': '🏫',
      'Văn phòng/Doanh nghiệp': '🏢',
      'Căn hộ dịch vụ': '🏢',
      'Nhà máy/Xưởng sản xuất': '🏭',
      'Câu lạc bộ thể thao': '⚽'
    };
    const logo = logoMap[newPartnerType] || logoMap[typeToSave] || '💼';

    const newP: B2BPartner = {
      id: `b2b-${Date.now()}`,
      name: newPartnerName.trim(),
      type: typeToSave,
      contactPerson: newPartnerContact.trim(),
      phone: newPartnerPhone.trim(),
      email: newPartnerEmail.trim(),
      address: newPartnerAddress.trim(),
      period: newPartnerPeriod,
      debt: { unreconciled: 0, old: 0 },
      tier: 'Bạc',
      logo,
      notes: newPartnerNotes.trim(),
      hasOrdersInPeriod: false
    };

    setPartners(prev => [...prev, newP]);
    setSelectedPartnerId(newP.id);
    setIsAddModalOpen(false);
    toast('Thêm mới đối tác B2B thành công.', 'success');
    resetForm();
  };

  // Pastel accent styles for partner cards
  const getPartnerCardAccent = (type: string, isSelected: boolean) => {
    if (isSelected) {
      return 'border-[#2563EB] bg-white ring-2 ring-blue-100 shadow-sm';
    }
    if (type.includes('Khách sạn') || type.includes('Hotel')) {
      return 'border-[#DCE5F0] bg-white hover:border-[#2563EB]/40 hover:bg-[#EFF6FF]/40';
    }
    if (type.includes('Gym')) {
      return 'border-[#DCE5F0] bg-white hover:border-amber-400/40 hover:bg-[#FFFBEB]/40';
    }
    if (type.includes('Spa')) {
      return 'border-[#DCE5F0] bg-white hover:border-emerald-400/40 hover:bg-[#ECFDF5]/40';
    }
    return 'border-[#DCE5F0] bg-white hover:border-slate-300';
  };

  const getPartnerTypeBadge = (type: string) => {
    if (type.includes('Khách sạn')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-800 bg-[#EFF6FF] border border-[#BFDBFE]">🏨 Khách sạn</span>;
    }
    if (type.includes('Gym')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-[#FFFBEB] border border-[#FDE68A]">🏋️ Gym / Fitness</span>;
    }
    if (type.includes('Spa')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 bg-[#ECFDF5] border border-[#A7F3D0]">🌿 Spa / Massage</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200">💼 {type}</span>;
  };

  const getTierBadge = (tier: B2BPartner['tier']) => {
    const map = {
      'Bạc': 'bg-slate-100 text-slate-700 border-slate-200',
      'Vàng': 'bg-[#FFFBEB] text-amber-800 border-[#FDE68A]',
      'Kim cương': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
    };
    return (
      <span className={`px-2 py-0.5 rounded border font-bold text-[10px] ${map[tier]}`}>
        Hạng {tier}
      </span>
    );
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

      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            B2B PARTNER MANAGEMENT
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý đối tác B2B
          </h1>
        </div>

        <button 
          type="button"
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} /> Thêm đối tác mới
        </button>
      </div>

      {/* 2. MAIN MASTER-DETAIL WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: 4 COLS - CLICKABLE PARTNER CARDS LIST */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-white border border-[#DCE5F0] px-4 py-3 rounded-xl shadow-2xs flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Danh sách đối tác</span>
            <span className="font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
              {partners.length} doanh nghiệp
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {partners.map((p) => {
              const totalDebt = p.debt.unreconciled + p.debt.old;
              const isSelected = p.id === selectedPartnerId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPartnerId(p.id)}
                  className={`rounded-xl p-4 cursor-pointer transition-all flex flex-col gap-2.5 ${getPartnerCardAccent(p.type, isSelected)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0] flex items-center justify-center text-lg shrink-0">
                        {p.logo}
                      </span>
                      <div className="min-w-0 flex flex-col">
                        <strong className="text-xs font-black text-slate-900 truncate">{p.name}</strong>
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <User size={11} className="text-slate-400" /> {p.contactPerson}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getPartnerTypeBadge(p.type)}
                    {getTierBadge(p.tier)}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Công nợ:</span>
                    <strong className={`font-mono text-xs ${totalDebt > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                      {totalDebt.toLocaleString('vi-VN')}đ
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: 8 COLS - PARTNER WORKSPACE DETAIL */}
        <div className="lg:col-span-8 bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4 text-xs">
          
          {/* HEADER SUMMARY METRICS ROW */}
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-2xl shrink-0">
                  {selectedPartner.logo}
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">{selectedPartner.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getPartnerTypeBadge(selectedPartner.type)}
                    {getTierBadge(selectedPartner.tier)}
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY ROW METRICS USING EXISTING PARTNER DATA */}
            <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-3 rounded-lg border border-[#DCE5F0]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TỔNG CÔNG NỢ</span>
                <strong className={`font-mono text-sm ${(selectedPartner.debt.unreconciled + selectedPartner.debt.old) > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {(selectedPartner.debt.unreconciled + selectedPartner.debt.old).toLocaleString('vi-VN')}đ
                </strong>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">CHU KỲ ĐỐI SOÁT</span>
                <strong className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Clock size={12} className="text-[#2563EB]" /> Theo {selectedPartner.period}
                </strong>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">LOẠI HÌNH DOANH NGHIỆP</span>
                <strong className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Building2 size={12} className="text-[#2563EB]" /> {selectedPartner.type}
                </strong>
              </div>
            </div>
          </div>

          {/* 4 ISOLATED TABS */}
          <div className="flex border-b border-slate-100 gap-2">
            {[
              { key: 'info', label: 'Thông tin' },
              { key: 'pricing', label: 'Bảng giá riêng' },
              { key: 'orders', label: 'Đơn hàng' },
              { key: 'debt', label: 'Công nợ & Đối soát' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer bg-transparent ${
                  activeTab === tab.key 
                    ? 'border-[#2563EB] text-[#2563EB]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: THÔNG TIN */}
          {activeTab === 'info' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-lg border border-[#DCE5F0]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Người đại diện liên hệ</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User size={13} className="text-[#2563EB]" /> {selectedPartner.contactPerson}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Số điện thoại</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone size={13} className="text-[#2563EB]" /> {selectedPartner.phone}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Địa chỉ Email</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Mail size={13} className="text-[#2563EB]" /> {selectedPartner.email || 'Chưa cập nhật'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Địa chỉ doanh nghiệp</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#2563EB]" /> {selectedPartner.address}
                  </span>
                </div>
              </div>

              {/* OPERATIONAL DELIVERY NOTE */}
              <div className="bg-[#EEF4FF] border border-[#BFDBFE] p-3.5 rounded-lg flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase flex items-center gap-1">
                  💡 GHI CHÚ GIAO / NHẬN ĐẶC THÙ (OPERATIONAL NOTE)
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {selectedPartner.notes || 'Không có ghi chú đặc thù nào.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BẢNG GIÁ RIÊNG (HIGH-CONTRAST COMPARISON TABLE) */}
          {activeTab === 'pricing' && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              <div className="bg-[#EEF4FF] border border-[#BFDBFE] p-3 rounded-lg flex items-center gap-2 text-xs font-semibold text-slate-800">
                <ShieldAlert size={15} className="text-[#2563EB] shrink-0" />
                <span>Bảng giá B2B riêng ưu tiên tự động áp dụng khi tiếp nhận đơn của đối tác này.</span>
              </div>

              <div className="border border-[#DCE5F0] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Tên dịch vụ</th>
                      <th className="py-3 px-4 text-center">ĐVT</th>
                      <th className="py-3 px-4 text-right">Giá khách lẻ</th>
                      <th className="py-3 px-4 text-right w-44">Giá B2B riêng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5F0]">
                    {MOCK_SERVICES.map((s) => (
                      <tr key={s.id} className="bg-white hover:bg-slate-50 transition-colors font-medium">
                        <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-600">{s.unit}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400 line-through">
                          {s.retailPrice.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={partnerPrices[s.id] !== undefined ? partnerPrices[s.id] : s.partnerPrice}
                              onChange={(e) => handlePriceChange(s.id, e.target.value)}
                              className="w-24 px-2 py-1 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded text-right font-mono font-bold text-slate-900 outline-none"
                            />
                            <span className="font-semibold text-slate-500">đ</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePrices}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md cursor-pointer transition-colors border-0"
                >
                  Lưu bảng giá B2B
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-3 animate-fadeIn">
              {!selectedPartner.hasOrdersInPeriod ? (
                <div className="p-8 border border-dashed border-[#DCE5F0] rounded-lg text-center text-slate-400 font-semibold">
                  Không có đơn hàng phát sinh trong kỳ đối soát này.
                </div>
              ) : (
                <div className="border border-[#DCE5F0] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Mã đơn</th>
                        <th className="py-3 px-4">Ngày</th>
                        <th className="py-3 px-4">Dịch vụ</th>
                        <th className="py-3 px-4 text-center">Khối lượng</th>
                        <th className="py-3 px-4 text-right">Thành tiền</th>
                        <th className="py-3 px-4 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE5F0]">
                      {MOCK_ORDERS.map((o) => (
                        <tr key={o.id} className="bg-white hover:bg-slate-50 transition-colors font-medium">
                          <td className="py-3 px-4 font-mono font-bold text-[#2563EB]">{o.id}</td>
                          <td className="py-3 px-4 text-slate-600 font-semibold">{o.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{o.service}</td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-700">{o.weight}</td>
                          <td className="py-3 px-4 text-right font-mono font-black text-slate-900">{o.amount.toLocaleString('vi-VN')}đ</td>
                          <td className="py-3 px-4 text-center">
                            <StatusBadge variant="warning" label={o.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CÔNG NỢ & ĐỐI SOÁT (PROMINENT AMOUNTS & CTAS) */}
          {activeTab === 'debt' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* DEBT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#F8FAFC] border border-[#DCE5F0] p-3.5 rounded-lg flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TỔNG NỢ CHƯA CHỐT</span>
                  <strong className="font-mono text-base font-black text-slate-900">
                    {selectedPartner.debt.unreconciled.toLocaleString('vi-VN')}đ
                  </strong>
                </div>

                <div className="bg-[#FFF1F2] border border-[#FECDD3] p-3.5 rounded-lg flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-red-700 uppercase">NỢ CỦ TỒN ĐỌNG</span>
                  <strong className="font-mono text-base font-black text-red-600">
                    {selectedPartner.debt.old.toLocaleString('vi-VN')}đ
                  </strong>
                </div>

                <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3.5 rounded-lg flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">TỔNG CẦN THANH TOÁN</span>
                  <strong className="font-mono text-base font-black text-[#2563EB]">
                    {(selectedPartner.debt.unreconciled + selectedPartner.debt.old).toLocaleString('vi-VN')}đ
                  </strong>
                </div>
              </div>

              {/* PRIMARY CTAS BAR */}
              <div className="flex flex-wrap gap-2.5 p-3.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button" 
                    disabled={!selectedPartner.hasOrdersInPeriod}
                    onClick={handleChotCongNo}
                    className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors cursor-pointer border-0 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Chốt công nợ &amp; tạo yêu cầu thanh toán
                  </button>

                  <button 
                    type="button" 
                    onClick={handleConfirmPayment}
                    disabled={(selectedPartner.debt.unreconciled + selectedPartner.debt.old) === 0}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors cursor-pointer border-0 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận đã thu tiền B2B
                  </button>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleExportPdf}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-[#2563EB] border border-[#BFDBFE] font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Xuất PDF
                </button>
              </div>

              {/* RECONCILIATION HISTORY TABLE UNDERNEATH */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  LỊCH SỬ ĐỐI SOÁT CÁC KỲ TRƯỚC
                </span>
                
                <div className="border border-[#DCE5F0] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Mã biên bản</th>
                        <th className="py-2.5 px-3">Kỳ đối soát</th>
                        <th className="py-2.5 px-3">Ngày chốt</th>
                        <th className="py-2.5 px-3 text-right">Tổng tiền</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                        <th className="py-2.5 px-3 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE5F0]">
                      {MOCK_HISTORY.map((h) => (
                        <tr key={h.id} className="bg-white hover:bg-slate-50 transition-colors font-medium">
                          <td className="py-2.5 px-3 font-mono text-slate-600">{h.id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{h.period}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-semibold">{h.date}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{h.total.toLocaleString('vi-VN')}đ</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                              {h.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button 
                              type="button" 
                              onClick={handleExportPdf}
                              className="text-[#2563EB] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                            >
                              Tải PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL: ADD B2B PARTNER */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Thêm đối tác B2B mới" size="md">
        <form onSubmit={handleCreatePartner} className="flex flex-col gap-3 text-left text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">Tên doanh nghiệp *</label>
              <input
                type="text"
                placeholder="Nhập tên doanh nghiệp..."
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">Loại hình *</label>
              <select
                value={newPartnerType}
                onChange={(e) => setNewPartnerType(e.target.value)}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value="Khách sạn">🏨 Khách sạn</option>
                <option value="Gym/Fitness">🏋️ Gym/Fitness</option>
                <option value="Spa/Salon">🌿 Spa/Salon</option>
                <option value="Nhà hàng/Café">☕ Nhà hàng/Café</option>
                <option value="Phòng khám/Bệnh viện">🏥 Phòng khám/Bệnh viện</option>
                <option value="Khác">💼 Khác</option>
              </select>
            </div>

            {newPartnerType === 'Khác' && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="font-bold text-slate-800">Nhập loại hình cụ thể *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Căn hộ dịch vụ..."
                  value={customPartnerType}
                  onChange={(e) => setCustomPartnerType(e.target.value)}
                  className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none font-semibold"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">Người liên hệ *</label>
              <input
                type="text"
                placeholder="Tên đại diện..."
                value={newPartnerContact}
                onChange={(e) => setNewPartnerContact(e.target.value)}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">Số điện thoại *</label>
              <input
                type="text"
                placeholder="Ví dụ: 0912345678"
                value={newPartnerPhone}
                onChange={(e) => setNewPartnerPhone(e.target.value)}
                className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none font-semibold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button size="sm" variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button size="sm" variant="primary" type="submit" className="font-bold">
              Xác nhận thêm
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: PDF RECONCILIATION PREVIEW */}
      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="Biên bản đối soát PDF" size="lg">
        <div className="flex flex-col gap-4 text-xs font-mono bg-[#F8FAFC] p-4 rounded border border-[#DCE5F0]">
          <div className="flex justify-between items-start border-b border-dashed border-slate-300 pb-2">
            <div>
              <strong className="text-sm text-[#2563EB]">💧 DUDI LAUNDRY B2B</strong>
              <p className="text-slate-500 text-[10px]">Hotline: 1900 8888</p>
            </div>
            <div className="text-right">
              <strong className="text-sm text-slate-900">BIÊN BẢN ĐỐI SOÁT</strong>
              <p className="text-slate-500 text-[10px]">Mã: REC-{selectedPartner.id.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p><strong>Khách hàng:</strong> {selectedPartner.name}</p>
            <p><strong>Đại diện:</strong> {selectedPartner.contactPerson} ({selectedPartner.phone})</p>
            <p><strong>Tổng công nợ:</strong> {(selectedPartner.debt.unreconciled + selectedPartner.debt.old).toLocaleString('vi-VN')}đ</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" onClick={() => setIsPdfModalOpen(false)}>Đóng</Button>
            <Button size="sm" variant="primary" onClick={() => { setIsPdfModalOpen(false); toast('Tải tệp PDF thành công.', 'success'); }}>
              Tải tệp PDF
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
