import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Calendar, FileText, 
  Clock, Download, 
  Plus, ShieldAlert, ArrowRight, User
} from 'lucide-react';
import { PageHeader, Modal, StatusBadge, Button } from '../../components/common';
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
    unreconciled: number; // nợ chưa chốt
    old: number; // nợ cũ tồn đọng
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
  { id: 'ORD-B2B-102', date: '2026-07-12', service: 'Giặt xấy ra trải giường', weight: '250 kg', amount: 2500000, status: 'Chưa thanh toán' },
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
    toast('Đã tạo biên bản đối soát và yêu cầu thanh toán thành công.', 'success');
    toast('Giả lập: Thông báo đối soát đã được gửi qua Zalo/Email cho người đại diện B2B.', 'info');
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
    toast(`Đã xác nhận thanh toán thành công cho ${selectedPartner.name}. Công nợ đã được xoá.`, 'success');
  };

  const handleExportPdf = () => {
    toast('Biên bản đối soát đang được tạo...', 'info');
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

  const getPartnerTypeBadge = (type: string) => {
    const map: Record<string, React.ReactNode> = {
      'Khách sạn': <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100 text-[10px]">🏨 Khách sạn</span>,
      'Gym/Fitness': <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full font-bold border border-orange-100 text-[10px]">🏋️ Gym/Fitness</span>,
      'Gym': <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full font-bold border border-orange-100 text-[10px]">🏋️ Gym</span>,
      'Spa/Salon': <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold border border-emerald-100 text-[10px]">🌿 Spa/Salon</span>,
      'Spa': <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold border border-emerald-100 text-[10px]">🌿 Spa</span>,
      'Nhà hàng/Café': <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold border border-amber-100 text-[10px]">☕ Nhà hàng/Café</span>,
      'Phòng khám/Bệnh viện': <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full font-bold border border-rose-100 text-[10px]">🏥 Phòng khám/Bệnh viện</span>,
      'Trường học': <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold border border-indigo-100 text-[10px]">🏫 Trường học</span>,
      'Văn phòng/Doanh nghiệp': <span className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-full font-bold border border-slate-100 text-[10px]">🏢 Văn phòng/Doanh nghiệp</span>,
      'Căn hộ dịch vụ': <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full font-bold border border-sky-100 text-[10px]">🏢 Căn hộ dịch vụ</span>,
      'Nhà máy/Xưởng sản xuất': <span className="px-2 py-0.5 bg-neutral-50 text-neutral-700 rounded-full font-bold border border-neutral-100 text-[10px]">🏭 Nhà máy/Xưởng sản xuất</span>,
      'Câu lạc bộ thể thao': <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-bold border border-teal-100 text-[10px]">⚽ CLB thể thao</span>
    };
    return map[type] || <span className="px-2 py-0.5 bg-violet-50 text-violet-755 rounded-full font-bold border border-violet-100 text-[10px]">💼 {type}</span>;
  };

  const getTierBadge = (tier: B2BPartner['tier']) => {
    const map = {
      'Bạc': 'bg-slate-100 text-slate-700 border-slate-200',
      'Vàng': 'bg-amber-50 text-amber-700 border-amber-200',
      'Kim cương': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full border font-bold text-[10px] ${map[tier]}`}>
        Hạng {tier}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12 text-slate-900">
      <PageHeader
        title="Quản lý đối tác B2B"
        description="Quản lý tổ chức, bảng giá riêng và công nợ định kỳ."
        breadcrumb={[
          { label: 'Cửa hàng', to: '/store/dashboard' },
          { label: 'Đối tác B2B' },
        ]}
      />

      {/* Main Grid: Left side partners list, Right side partner detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Partners List */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <span className="font-bold text-sm text-slate-800">Danh sách ({partners.length})</span>
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="flex items-center gap-1 font-bold text-xs"
            >
              <Plus size={14} /> Thêm đối tác
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {partners.map((p) => {
              const totalDebt = p.debt.unreconciled + p.debt.old;
              const isSelected = p.id === selectedPartnerId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPartnerId(p.id)}
                  className={`bg-white border hover:border-blue-400 p-4 rounded-2xl shadow-xs cursor-pointer transition-all flex flex-col gap-3 ${
                    isSelected ? 'border-blue-600 ring-2 ring-blue-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {p.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-900 truncate">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <User size={12}/> {p.contactPerson}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {getPartnerTypeBadge(p.type)}
                    {getTierBadge(p.tier)}
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-semibold">TỔNG NỢ HIỆN TẠI</span>
                      <span className={`font-bold text-sm ${totalDebt > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                        {totalDebt.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-600 flex items-center gap-0.5 group">
                      Xem chi tiết <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  {p.notes && (
                    <div className="bg-slate-50 text-[10px] text-slate-500 p-2 rounded-lg truncate border border-slate-100">
                      <strong>Giao nhận:</strong> {p.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-8 flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[500px]">
          {/* Partner Details Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-3xl">
                {selectedPartner.logo}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-950">{selectedPartner.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1 items-center">
                  {getPartnerTypeBadge(selectedPartner.type)}
                  {getTierBadge(selectedPartner.tier)}
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> Đối soát: <strong>{selectedPartner.period}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs Navigation */}
          <div className="flex border-b border-slate-100 overflow-x-auto gap-2">
            {[
              { key: 'info', label: 'Thông tin' },
              { key: 'pricing', label: 'Bảng giá riêng' },
              { key: 'orders', label: 'Đơn hàng' },
              { key: 'debt', label: 'Công nợ & Đối soát' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.key 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 mt-4">
            
            {/* Tab: Info */}
            {activeTab === 'info' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Tên doanh nghiệp</span>
                    <span className="text-sm font-bold text-slate-950">{selectedPartner.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Loại hình kinh doanh</span>
                    <span className="text-sm font-bold text-slate-950">{selectedPartner.type}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Người đại diện liên hệ</span>
                    <span className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                      <User size={14} className="text-slate-400"/> {selectedPartner.contactPerson}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Số điện thoại</span>
                    <span className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-400"/> {selectedPartner.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Địa chỉ Email</span>
                    <span className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-400"/> {selectedPartner.email || 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Chu kỳ đối soát công nợ</span>
                    <span className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400"/> Đối soát theo {selectedPartner.period}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Địa chỉ doanh nghiệp</span>
                    <span className="text-sm font-bold text-slate-950 flex items-start gap-1.5">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0"/> {selectedPartner.address}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Quy trình Giao - Nhận đặc thù</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedPartner.notes || 'Không có ghi chú đặc thù nào.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Pricing */}
            {activeTab === 'pricing' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3">
                  <ShieldAlert size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    <strong>Ghi chú dịch vụ:</strong> Khi tạo đơn cho đối tác này, hệ thống ưu tiên giá B2B thay cho giá khách lẻ.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="p-3">Dịch vụ</th>
                        <th className="p-3 text-center">Đơn vị</th>
                        <th className="p-3 text-right">Giá khách lẻ</th>
                        <th className="p-3 text-right w-36">Giá riêng đối tác B2B</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {MOCK_SERVICES.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 text-center text-slate-500 font-semibold">{s.unit}</td>
                          <td className="p-3 text-right text-slate-400 line-through font-semibold">
                            {s.retailPrice.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <input
                                type="number"
                                value={partnerPrices[s.id] !== undefined ? partnerPrices[s.id] : s.partnerPrice}
                                onChange={(e) => handlePriceChange(s.id, e.target.value)}
                                className="w-24 px-2 py-1 border border-slate-200 focus:border-blue-500 outline-none text-right rounded font-bold text-slate-800 bg-slate-50/50 focus:bg-white transition-colors"
                              />
                              <span className="font-semibold text-slate-600">đ</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="primary" onClick={handleSavePrices} className="font-bold">
                    Lưu bảng giá
                  </Button>
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                {!selectedPartner.hasOrdersInPeriod ? (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 gap-2">
                    <FileText size={32} className="opacity-30"/>
                    <p className="text-xs font-semibold">Không có đơn hàng phát sinh trong kỳ đối soát này.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500">Đơn hàng trong kỳ ({MOCK_ORDERS.length} đơn)</span>
                      <span className="px-2.5 py-1 bg-yellow-50 text-yellow-800 rounded-full font-bold border border-yellow-100 text-[10px]">
                        Kỳ đối soát hiện tại
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                            <th className="p-3">Mã đơn</th>
                            <th className="p-3">Ngày giặt</th>
                            <th className="p-3">Dịch vụ</th>
                            <th className="p-3 text-center">Khối lượng</th>
                            <th className="p-3 text-right">Thành tiền</th>
                            <th className="p-3 text-center">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {MOCK_ORDERS.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-blue-600">{o.id}</td>
                              <td className="p-3 text-slate-500 font-medium">{o.date}</td>
                              <td className="p-3 font-bold text-slate-800">{o.service}</td>
                              <td className="p-3 text-center text-slate-600 font-semibold">{o.weight}</td>
                              <td className="p-3 text-right font-bold text-slate-900">{o.amount.toLocaleString('vi-VN')}đ</td>
                              <td className="p-3 text-center">
                                <StatusBadge variant="warning" label={o.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab: Debt */}
            {activeTab === 'debt' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {/* Debt overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Tổng nợ chưa chốt</span>
                    <span className="text-base font-extrabold text-slate-800">
                      {selectedPartner.debt.unreconciled.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Nợ cũ tồn đọng</span>
                    <span className="text-base font-extrabold text-red-500">
                      {selectedPartner.debt.old.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-500 font-bold uppercase">Tổng cần thanh toán</span>
                    <span className="text-lg font-black text-blue-700">
                      {(selectedPartner.debt.unreconciled + selectedPartner.debt.old).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Operations Buttons */}
                <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={!selectedPartner.hasOrdersInPeriod}
                      onClick={handleChotCongNo}
                      className="font-bold flex items-center gap-1 bg-white"
                    >
                      Chốt công nợ & Yêu cầu thanh toán
                    </Button>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={handleConfirmPayment}
                      disabled={(selectedPartner.debt.unreconciled + selectedPartner.debt.old) === 0}
                      className="font-bold flex items-center gap-1"
                    >
                      Xác nhận đã thu tiền B2B
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleExportPdf}
                    className="font-bold flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 bg-white"
                  >
                    <Download size={14} /> Xuất biên bản đối soát PDF
                  </Button>
                </div>

                {/* History of reconciliation */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lịch sử đối soát các kỳ trước</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-3">Mã biên bản</th>
                          <th className="p-3">Kỳ đối soát</th>
                          <th className="p-3">Thời gian chốt</th>
                          <th className="p-3 text-right">Tổng tiền</th>
                          <th className="p-3 text-center">Trạng thái</th>
                          <th className="p-3 text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {MOCK_HISTORY.map((h) => (
                          <tr key={h.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-600">{h.id}</td>
                            <td className="p-3 font-bold text-slate-900">{h.period}</td>
                            <td className="p-3 text-slate-500 font-medium">{h.date}</td>
                            <td className="p-3 text-right font-bold text-slate-800">{h.total.toLocaleString('vi-VN')}đ</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold border border-emerald-100 text-[10px]">
                                {h.status}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={handleExportPdf}
                                type="button" 
                                className="text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-0.5"
                              >
                                <Download size={12}/> Tải PDF
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

      </div>

      {/* Modal: Add Partner */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Thêm đối tác B2B mới" size="md">
        <form onSubmit={handleCreatePartner} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600">Tên doanh nghiệp <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Nhập tên doanh nghiệp B2B"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600">Loại hình doanh nghiệp <span className="text-red-500">*</span></label>
              <select
                value={newPartnerType}
                onChange={(e) => setNewPartnerType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-slate-800 cursor-pointer"
              >
                <option value="Khách sạn">🏨 Khách sạn</option>
                <option value="Gym/Fitness">🏋️ Gym/Fitness</option>
                <option value="Spa/Salon">🌿 Spa/Salon</option>
                <option value="Nhà hàng/Café">☕ Nhà hàng/Café</option>
                <option value="Phòng khám/Bệnh viện">🏥 Phòng khám/Bệnh viện</option>
                <option value="Trường học">🏫 Trường học</option>
                <option value="Văn phòng/Doanh nghiệp">🏢 Văn phòng/Doanh nghiệp</option>
                <option value="Căn hộ dịch vụ">🏢 Căn hộ dịch vụ</option>
                <option value="Nhà máy/Xưởng sản xuất">🏭 Nhà máy/Xưởng sản xuất</option>
                <option value="Câu lạc bộ thể thao">⚽ Câu lạc bộ thể thao</option>
                <option value="Khác">💼 Khác</option>
              </select>
            </div>
            {newPartnerType === 'Khác' && (
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-semibold text-slate-600">Nhập loại hình doanh nghiệp <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập loại hình doanh nghiệp"
                  value={customPartnerType}
                  onChange={(e) => setCustomPartnerType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600">Người liên hệ <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Nhập tên người liên hệ đại diện"
                value={newPartnerContact}
                onChange={(e) => setNewPartnerContact(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: 0912345678"
                value={newPartnerPhone}
                onChange={(e) => setNewPartnerPhone(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600">Email liên hệ</label>
              <input
                type="email"
                placeholder="partner@gmail.com"
                value={newPartnerEmail}
                onChange={(e) => setNewPartnerEmail(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600">Chu kỳ đối soát</label>
              <select
                value={newPartnerPeriod}
                onChange={(e) => setNewPartnerPeriod(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-slate-800 cursor-pointer"
              >
                <option value="Tuần">Tuần</option>
                <option value="Tháng">Tháng</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-semibold text-slate-600">Địa chỉ doanh nghiệp</label>
              <input
                type="text"
                placeholder="Nhập số nhà, tên đường, quận/huyện..."
                value={newPartnerAddress}
                onChange={(e) => setNewPartnerAddress(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-semibold text-slate-600">Ghi chú giao nhận đặc thù</label>
              <textarea
                placeholder="Ví dụ: Giao sau giờ hành chính, cần xịt tinh dầu thơm..."
                rows={2}
                value={newPartnerNotes}
                onChange={(e) => setNewPartnerNotes(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all resize-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
            <Button size="sm" variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button size="sm" variant="primary" type="submit" className="font-bold">
              Xác nhận thêm
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Reconciliation PDF Preview Mock */}
      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="Xem trước Biên bản đối soát công nợ" size="lg">
        <div className="flex flex-col gap-6 text-xs bg-slate-50 p-6 rounded-2xl border border-slate-200/80 font-mono shadow-inner max-h-[80vh] overflow-y-auto">
          {/* Shop Header */}
          <div className="flex justify-between items-start border-b border-dashed border-slate-350 pb-4">
            <div>
              <h3 className="font-black text-sm text-blue-600">💧 DUDI LAUNDRY PLATFORM</h3>
              <p className="text-slate-500 text-[10px] mt-0.5">Địa chỉ: 12 Nguyễn Văn Linh, Tân Phong, Quận 7, TP.HCM</p>
              <p className="text-slate-500 text-[10px]">Hotline hỗ trợ: 1900 8888</p>
            </div>
            <div className="text-right">
              <h4 className="font-black text-sm text-slate-800">BIÊN BẢN ĐỐI SOÁT</h4>
              <p className="text-slate-500 text-[10px] mt-0.5">Mã biên bản: REC-{selectedPartner.id.toUpperCase()}</p>
              <p className="text-slate-500 text-[10px]">Kỳ thanh toán: {selectedPartner.period === 'Tháng' ? 'Tháng 07/2026' : 'Tuần 02/07/2026'}</p>
            </div>
          </div>

          {/* Client Details */}
          <div className="flex flex-col gap-1 text-[11px]">
            <p><strong>Khách hàng đối tác B2B:</strong> {selectedPartner.name}</p>
            <p><strong>Đại diện liên hệ:</strong> {selectedPartner.contactPerson} ({selectedPartner.phone})</p>
            <p><strong>Địa chỉ:</strong> {selectedPartner.address}</p>
            <p><strong>Chu kỳ đối soát:</strong> {selectedPartner.period}</p>
          </div>

          {/* Orders Table */}
          <div className="flex flex-col gap-1.5">
            <p className="font-bold text-slate-700">Chi tiết đơn hàng phát sinh trong kỳ:</p>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300 text-[10px]">
                    <th className="p-2 text-left">Mã đơn</th>
                    <th className="p-2 text-left">Ngày</th>
                    <th className="p-2 text-left">Nội dung dịch vụ</th>
                    <th className="p-2 text-center">Khối lượng</th>
                    <th className="p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {MOCK_ORDERS.map(o => (
                    <tr key={o.id} className="text-[10px]">
                      <td className="p-2 font-bold text-blue-700">{o.id}</td>
                      <td className="p-2 text-slate-600">{o.date}</td>
                      <td className="p-2 text-slate-800 font-bold">{o.service}</td>
                      <td className="p-2 text-center font-bold">{o.weight}</td>
                      <td className="p-2 text-right font-bold">{o.amount.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Debt & Billing */}
          <div className="flex flex-col gap-1 items-end pt-2 border-t border-dashed border-slate-350">
            <div className="flex justify-between w-64 text-slate-600">
              <span>Nợ phát sinh trong kỳ:</span>
              <span className="font-bold">{selectedPartner.debt.unreconciled.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between w-64 text-slate-600">
              <span>Nợ cũ tồn đọng:</span>
              <span className="font-bold">{selectedPartner.debt.old.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between w-64 text-sm font-black border-t border-slate-300 pt-1 text-slate-900">
              <span>TỔNG CẦN THANH TOÁN:</span>
              <span className="text-blue-600">{(selectedPartner.debt.unreconciled + selectedPartner.debt.old).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Bank Transfer details & Signature area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mt-4 pt-4 border-t border-slate-300">
            <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col gap-1">
              <p className="font-bold text-[10px] text-blue-800 uppercase tracking-wider">Thông tin chuyển khoản</p>
              <p className="text-[10px]">Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></p>
              <p className="text-[10px]">Số tài khoản: <strong>9999 8888 7777</strong></p>
              <p className="text-[10px]">Chủ tài khoản: <strong>CONG TY CỔ PHẦN DUDI LAUNDRY</strong></p>
              <p className="text-[10px]">Nội dung: <strong>Doi soat B2B {selectedPartner.id}</strong></p>
            </div>

            <div className="flex justify-around items-start text-center h-28">
              <div className="flex flex-col gap-1 text-[10px]">
                <p className="font-bold text-slate-700">Người lập biểu</p>
                <p className="text-slate-400 text-[9px] italic mt-4">(Ký, ghi rõ họ tên)</p>
                <p className="font-black text-slate-800 mt-6">Admin DUDI</p>
              </div>
              <div className="flex flex-col gap-1 text-[10px]">
                <p className="font-bold text-slate-700">Đại diện B2B khách hàng</p>
                <p className="text-slate-400 text-[9px] italic mt-4">(Ký và xác nhận)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
          <Button size="sm" variant="outline" onClick={() => setIsPdfModalOpen(false)}>
            Đóng
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => {
              setIsPdfModalOpen(false);
              toast('Đang tải xuống biên bản đối soát PDF (Giả lập)...', 'success');
            }}
            className="font-bold flex items-center gap-1"
          >
            <Download size={14} /> Tải PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
}
