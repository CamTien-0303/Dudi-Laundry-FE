import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  ShoppingCart, Plus, User, Search, FileText, Trash2, 
  Printer, Save, AlertCircle, Shirt, Sparkles, Footprints, Shield
} from 'lucide-react';
import { Modal } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { mockCustomers, useOrderStore } from '../../mocks/orderStore';
import type { Order } from '../../mocks/orderStore';

const LOCAL_SERVICES = [
  { id: 'srv-1', name: 'Giặt sấy tiêu chuẩn', price: 15000, unit: 'kg', category: 'Giặt sấy theo kg' },
  { id: 'srv-2', name: 'Giặt sấy thơm lâu', price: 25000, unit: 'kg', category: 'Giặt sấy theo kg' },
  { id: 'srv-3', name: 'Áo sơ mi/Áo thun', price: 40000, unit: 'cái', category: 'Giặt hấp theo món' },
  { id: 'srv-4', name: 'Quần tây/Jean', price: 45000, unit: 'cái', category: 'Giặt hấp theo món' },
  { id: 'srv-5', name: 'Áo Vest/Dạ', price: 80000, unit: 'cái', category: 'Giặt hấp theo món' },
  { id: 'srv-6', name: 'Áo da/Áo lông', price: 150000, unit: 'cái', category: 'Đồ da' },
  { id: 'srv-7', name: 'Túi xách da', price: 200000, unit: 'cái', category: 'Đồ da' },
  { id: 'srv-8', name: 'Sneaker vải/lưới', price: 60000, unit: 'đôi', category: 'Vệ sinh giày' },
  { id: 'srv-9', name: 'Giày da/Boot', price: 90000, unit: 'đôi', category: 'Vệ sinh giày' }
];

const CATEGORY_CONFIG: Record<string, { label: string; bgSoft: string; borderSoft: string; textCol: string; icon: any }> = {
  'Giặt sấy theo kg': { label: 'Giặt sấy', bgSoft: 'bg-blue-50/60', borderSoft: 'border-blue-200', textCol: 'text-[#2563EB]', icon: Shirt },
  'Giặt hấp theo món': { label: 'Giặt hấp', bgSoft: 'bg-emerald-50/60', borderSoft: 'border-emerald-200', textCol: 'text-emerald-800', icon: Sparkles },
  'Đồ da': { label: 'Đồ da', bgSoft: 'bg-amber-50/60', borderSoft: 'border-amber-200', textCol: 'text-amber-800', icon: Shield },
  'Vệ sinh giày': { label: 'Vệ sinh giày', bgSoft: 'bg-indigo-50/60', borderSoft: 'border-indigo-200', textCol: 'text-indigo-800', icon: Footprints },
};

const CATEGORIES = ['Giặt sấy theo kg', 'Giặt hấp theo món', 'Đồ da', 'Vệ sinh giày'];

interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number | string;
}

export default function StoreOrdersNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addOrder } = useOrderStore();

  // Customer State
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSelectError, setCustomerSelectError] = useState<string | null>(null);

  // Modal State
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  
  // Catalog State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'UNPAID'>('CASH');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState<number | string>('');

  // Suggestions search list
  const customerSuggestions = useMemo(() => {
    const val = searchPhone.trim();
    if (val.length < 2) return [];
    return mockCustomers.filter(
      c => c.phone.includes(val) || c.name.toLowerCase().includes(val.toLowerCase())
    );
  }, [searchPhone]);

  const selectCustomerAndClearError = (cust: any) => {
    setSelectedCustomer(cust);
    setCustomerSelectError(null);
  };

  const handleSaveNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      toast('Vui lòng nhập họ tên khách hàng mới', 'error');
      return;
    }
    if (!newCustPhone.trim()) {
      toast('Vui lòng nhập số điện thoại khách hàng mới', 'error');
      return;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(newCustPhone.trim())) {
      toast('Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số, bắt đầu bằng 0.', 'error');
      return;
    }

    const newCust = {
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      points: 0,
      debt: 0,
      address: newCustAddress.trim() || undefined
    };

    selectCustomerAndClearError(newCust);
    setSearchPhone(newCust.phone);
    setCustomerModalOpen(false);

    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    toast('Đã thêm và chọn khách hàng mới thành công!', 'success');
  };

  // Cart logic
  const handleAddService = (service: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.serviceId === service.id);
      if (existing) {
        return prev.map(item =>
          item.serviceId === service.id
            ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
            : item
        );
      }
      return [...prev, {
        serviceId: service.id,
        name: service.name,
        price: service.price,
        unit: service.unit,
        quantity: 1
      }];
    });
    toast(`Đã thêm ${service.name} vào giỏ`, 'info');
  };

  const handleUpdateQuantity = (serviceId: string, val: string) => {
    if (val === '') {
      setCart(prev => prev.map(item => item.serviceId === serviceId ? { ...item, quantity: '' } : item));
      return;
    }
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return;

    if (numVal > 100) {
      toast('Cảnh báo: Khối lượng vượt quá 100kg!', 'warning');
    }

    setCart(prev => prev.map(item => item.serviceId === serviceId ? { ...item, quantity: numVal } : item));
  };

  const handleRemoveItem = (serviceId: string) => {
    setCart(prev => prev.filter(i => i.serviceId !== serviceId));
  };

  // Calculations
  const subTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * (Number(item.quantity) || 0), 0);
  }, [cart]);

  const discountVal = Number(discount) || 0;
  const totalAmount = Math.max(0, subTotal - discountVal);

  const filteredServices = LOCAL_SERVICES.filter(s => s.category === activeCategory);

  // Validate & Submit
  const handleCreateOrder = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    if (!selectedCustomer) {
      setCustomerSelectError('Vui lòng chọn khách hàng từ kết quả tìm kiếm hoặc thêm mới.');
      setTimeout(() => {
        const searchInput = document.getElementById('customer-search-input');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchInput.focus();
        }
      }, 50);
      return;
    }

    if (cart.length === 0) {
      toast('Giỏ hàng trống! Vui lòng chọn ít nhất một dịch vụ.', 'error');
      return;
    }

    if (cart.some(item => Number(item.quantity) <= 0 || isNaN(Number(item.quantity)))) {
      toast('Vui lòng nhập số lượng/khối lượng hợp lệ (lớn hơn 0) cho các dịch vụ.', 'error');
      return;
    }

    if (isDraft) {
      toast('Đã lưu nháp đơn hàng thành công.', 'success');
      navigate('/store/orders');
      return;
    }

    const paymentStatus: 'PAID' | 'UNPAID' = paymentMethod === 'UNPAID' ? 'UNPAID' : 'PAID';
    const serviceName = cart.map(item => `${item.name} (${item.quantity}${item.unit})`).join(', ');

    const newOrder: Order = {
      id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerPoints: selectedCustomer.points,
      serviceName,
      quantity: Number(cart[0].quantity),
      unit: cart[0].unit,
      amount: totalAmount,
      paymentStatus,
      paymentMethod,
      status: 'RECEIVED',
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined
    };

    addOrder(newOrder);
    toast(`Tạo đơn hàng ${newOrder.id} và in phiếu thành công!`, 'success');
    navigate('/store/operations');
  };

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-6 flex flex-col gap-5 text-left">
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

      {/* 1. POS COUNTER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            STORE COUNTER POS TERMINAL
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Lập đơn hàng giặt ủi tại quầy
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigate('/store/orders')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            Quay lại danh sách đơn
          </button>
        </div>
      </div>

      {/* 2. POS 62/38 SPLIT LAYOUT */}
      <form onSubmit={(e) => handleCreateOrder(e, false)} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: 62% (lg:col-span-7) - CUSTOMER & POS SERVICE TILES */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* CUSTOMER SEARCH & DETAILS CARD */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 md:p-5 shadow-2xs relative">
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <User size={15} className="text-[#2563EB]" />
                THÔNG TIN KHÁCH HÀNG
              </h2>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(true)}
                className="text-xs font-bold text-[#2563EB] bg-[#EEF4FF] hover:bg-blue-100 border border-[#BFDBFE] px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Thêm khách mới
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  id="customer-search-input"
                  placeholder="Tìm theo Tên hoặc Số điện thoại (Ví dụ: 090...)"
                  value={searchPhone}
                  onChange={(e) => {
                    setSearchPhone(e.target.value);
                    if (selectedCustomer) setSelectedCustomer(null);
                    if (customerSelectError) setCustomerSelectError(null);
                  }}
                  className={`w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all ${
                    customerSelectError ? 'border-red-400 bg-red-50/10' : 'border-[#DCE5F0]'
                  }`}
                />
                
                {/* Suggestions List */}
                {!selectedCustomer && searchPhone.trim().length >= 2 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-[#DCE5F0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {customerSuggestions.length > 0 ? (
                      customerSuggestions.map((cust) => (
                        <div
                          key={cust.phone}
                          onClick={() => {
                            selectCustomerAndClearError({ ...cust, debt: 50000 });
                            setSearchPhone(cust.phone);
                          }}
                          className="px-3.5 py-2.5 hover:bg-[#EEF4FF] cursor-pointer text-xs flex justify-between items-center border-b border-slate-100 last:border-0 font-medium"
                        >
                          <div>
                            <strong className="font-bold text-slate-900">{cust.name}</strong>
                            <span className="text-slate-400 font-mono ml-2">({cust.phone})</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                            Tích lũy: {cust.points}đ
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center flex flex-col items-center gap-2">
                        <p className="text-xs text-slate-400 font-semibold">Không tìm thấy khách hàng nào phù hợp</p>
                        <button
                          type="button"
                          onClick={() => {
                            setNewCustPhone(searchPhone);
                            setCustomerModalOpen(true);
                          }}
                          className="text-xs font-bold text-[#2563EB] bg-[#EEF4FF] border border-[#BFDBFE] px-3 py-1 rounded cursor-pointer"
                        >
                          Tạo khách hàng mới ngay
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Customer Details */}
                {selectedCustomer && (
                  <div className="mt-3 bg-[#EEF4FF] border border-[#BFDBFE] rounded-lg p-3.5 text-xs flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="font-black text-slate-900 text-sm">{selectedCustomer.name}</strong>
                        <p className="text-slate-600 font-mono font-semibold">{selectedCustomer.phone}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-[#2563EB] border border-blue-200 rounded text-[10px] font-bold">
                        Hội viên DUDI
                      </span>
                    </div>

                    {selectedCustomer.address && (
                      <p className="text-slate-600">Địa chỉ: <strong className="text-slate-800">{selectedCustomer.address}</strong></p>
                    )}

                    <div className="flex gap-4 pt-2 border-t border-blue-200/60 text-xs font-bold">
                      <span className="text-slate-700">Điểm tích lũy: <strong className="text-emerald-700 font-black">{selectedCustomer.points}</strong></span>
                      <span className="text-slate-700">Công nợ hiện tại: <strong className="text-red-600 font-black">{selectedCustomer.debt?.toLocaleString('vi-VN') || 0}đ</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {customerSelectError && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-2">
                <AlertCircle size={13} className="shrink-0" />
                {customerSelectError}
              </p>
            )}
          </div>

          {/* POS SERVICE MENU TILES */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 md:p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShoppingCart size={15} className="text-[#2563EB]" />
                DANH MỤC DỊCH VỤ POS
              </h2>
              <span className="text-[10px] font-bold text-slate-400">CHỌN NHANH TẠI QUẦY</span>
            </div>

            {/* Category Tabs with Soft Pastel Accents */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
              {CATEGORIES.map(cat => {
                const conf = CATEGORY_CONFIG[cat];
                const IconComponent = conf?.icon || Shirt;
                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isActive
                        ? `${conf.bgSoft} ${conf.borderSoft} ${conf.textCol} border-2`
                        : 'bg-[#F8FAFC] border-[#DCE5F0] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent size={13} />
                    <span>{conf?.label || cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Service Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleAddService(service)}
                  className="bg-[#F8FAFC] border border-[#DCE5F0] hover:border-[#2563EB] hover:bg-[#EEF4FF]/50 rounded-lg p-3 flex flex-col justify-between items-start transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-full">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#2563EB] mb-1 leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-xs font-mono font-bold text-slate-600">
                      {service.price.toLocaleString('vi-VN')}đ / {service.unit}
                    </p>
                  </div>
                  <div className="mt-3 flex w-full justify-end">
                    <span className="w-6 h-6 bg-white group-hover:bg-[#2563EB] group-hover:text-white text-slate-500 border border-[#DCE5F0] group-hover:border-[#2563EB] rounded flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 38% (lg:col-span-5) - STICKY CART & BILLING PANEL */}
        <div className="lg:col-span-5 lg:sticky lg:top-4 flex flex-col gap-5">
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 md:p-5 shadow-2xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileText size={15} className="text-[#2563EB]" />
                GIỎ HÀNG &amp; HÓA ĐƠN
              </h2>
              <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {cart.length} món
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex flex-col gap-2 min-h-[140px] max-h-[280px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-[#F8FAFC] border border-dashed border-[#DCE5F0] rounded-lg p-6 my-auto">
                  <ShoppingCart size={28} className="mb-2 opacity-30" />
                  <p className="text-xs font-semibold">Chưa chọn dịch vụ nào</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.serviceId} className="flex flex-col gap-1.5 text-xs bg-[#F8FAFC] p-3 rounded-lg border border-[#DCE5F0]">
                    <div className="flex justify-between items-start">
                      <strong className="font-bold text-slate-900">{item.name}</strong>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.serviceId)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-0.5 border-0 bg-transparent cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0.1"
                          step={item.unit === 'kg' ? '0.1' : '1'}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.serviceId, e.target.value)}
                          className="w-16 px-2 py-1 bg-white border border-[#DCE5F0] rounded font-mono font-bold text-center outline-none focus:border-[#2563EB]"
                        />
                        <span className="text-slate-500 font-bold">{item.unit}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {(item.price * (Number(item.quantity) || 0)).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ghi chú xử lý đơn hàng</label>
              <textarea
                placeholder="Ví dụ: Giặt riêng đồ trắng, ủi ly phẳng..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-semibold outline-none resize-none"
              />
            </div>

            {/* Billing Summary */}
            <div className="border-t border-[#DCE5F0] pt-3 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-600">Tổng tiền dịch vụ:</span>
                <span className="font-mono font-bold text-slate-900">{subTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-600">Giảm giá / Khuyến mãi:</span>
                <div className="flex items-center gap-1 w-28">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full text-right px-2 py-1 border border-[#DCE5F0] rounded bg-[#F8FAFC] focus:border-[#2563EB] outline-none font-mono font-bold text-red-600"
                  />
                  <span className="font-bold">đ</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t border-[#DCE5F0]">
                <span className="font-black text-slate-900 uppercase tracking-wide text-xs">THÀNH TIỀN:</span>
                <strong className="font-mono font-black text-[#2563EB] text-xl">{totalAmount.toLocaleString('vi-VN')}đ</strong>
              </div>
            </div>

            {/* Payment Section */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hình thức thanh toán</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="CASH">Tiền mặt (Thu đủ tại quầy)</option>
                <option value="BANK_TRANSFER">Chuyển khoản (Đã thu đủ)</option>
                <option value="UNPAID">Chưa thanh toán (Thu tiền khi trả đồ)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => handleCreateOrder(e, true)}
                className="col-span-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer border-0 flex items-center justify-center gap-1"
              >
                <Save size={14} />
                <span>Lưu nháp</span>
              </button>

              <button
                type="submit"
                className="col-span-2 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Printer size={15} />
                <span>Tạo đơn &amp; In phiếu</span>
              </button>
            </div>

          </div>
        </div>

      </form>

      {/* CUSTOMER CREATION MODAL */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Thêm khách hàng mới"
        size="sm"
      >
        <form onSubmit={handleSaveNewCustomer} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-800">Họ và tên *</label>
            <input
              type="text"
              placeholder="Nhập họ và tên..."
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md text-slate-900 text-xs font-semibold outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-800">Số điện thoại *</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại 10 số..."
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md text-slate-900 text-xs font-semibold outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-800">Địa chỉ (Không bắt buộc)</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ nhà..."
              value={newCustAddress}
              onChange={(e) => setNewCustAddress(e.target.value)}
              className="w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md text-slate-900 text-xs font-semibold outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setCustomerModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs"
            >
              Lưu &amp; Chọn khách
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
