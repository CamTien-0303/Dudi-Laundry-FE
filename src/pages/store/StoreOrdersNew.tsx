import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  ShoppingCart, Plus, User, Search, FileText, Trash2, 
  Printer, Save, AlertCircle
} from 'lucide-react';
import { PageHeader, Modal } from '../../components/common';
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

    // Auto select newly created customer
    selectCustomerAndClearError(newCust);
    setSearchPhone(newCust.phone);
    setCustomerModalOpen(false);

    // Reset fields
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

    // 1. Validate Customer Selected
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

    // 2. Validate Cart Empty
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
    navigate('/store/orders');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-900">
      <PageHeader
        title="Tạo đơn hàng mới (POS)"
        description="Lập đơn hàng dịch vụ giặt ủi tại quầy cho khách hàng."
        breadcrumb={[
          { label: 'Cửa hàng', to: '/store/dashboard' },
          { label: 'Đơn hàng', to: '/store/orders' },
          { label: 'Tạo đơn mới' },
        ]}
      />

      <form onSubmit={(e) => handleCreateOrder(e, false)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        {/* Left Column: Customer & Catalog */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Customer Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User size={18} className="text-blue-500" />
                <span>Thông tin khách hàng</span>
              </h2>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(true)}
                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border-0 cursor-pointer font-bold"
              >
                <Plus size={14} /> Thêm mới
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                  className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none transition-all font-semibold ${
                    customerSelectError ? 'border-red-500 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
                  }`}
                />
                
                {/* Suggestions List */}
                {!selectedCustomer && searchPhone.trim().length >= 2 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-250 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {customerSuggestions.length > 0 ? (
                      customerSuggestions.map((cust) => (
                        <div
                          key={cust.phone}
                          onClick={() => {
                            selectCustomerAndClearError({ ...cust, debt: 50000 });
                            setSearchPhone(cust.phone);
                          }}
                          className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-left flex justify-between items-center border-b border-slate-50 last:border-0 font-semibold"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{cust.name}</span>
                            <span className="text-xs text-slate-505 ml-2">({cust.phone})</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-655 px-2 py-0.5 rounded font-bold">
                            Tích lũy: {cust.points}đ
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center flex flex-col items-center gap-2">
                        <p className="text-xs text-slate-500 font-semibold">Không tìm thấy kết quả phù hợp</p>
                        <button
                          type="button"
                          onClick={() => {
                            setNewCustPhone(searchPhone);
                            setCustomerModalOpen(true);
                          }}
                          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border-0 cursor-pointer"
                        >
                          Tạo khách hàng mới
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Active Customer Details Mock */}
                {selectedCustomer && (
                  <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-blue-900">{selectedCustomer.name}</p>
                        <p className="text-slate-600 text-xs">{selectedCustomer.phone}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100/50 text-blue-700 rounded-full font-bold text-[10px]">Thành viên DUDI</span>
                    </div>
                    {selectedCustomer.address && (
                      <p className="text-xs text-slate-500 mt-0.5">Địa chỉ: <strong className="text-slate-700">{selectedCustomer.address}</strong></p>
                    )}
                    <div className="flex gap-4 mt-1 pt-2 border-t border-blue-100/50 text-xs font-semibold">
                      <span className="text-slate-600">Điểm tích lũy: <strong className="text-emerald-600 font-extrabold">{selectedCustomer.points}</strong></span>
                      <span className="text-slate-600">Công nợ: <strong className="text-red-500 font-extrabold">{selectedCustomer.debt?.toLocaleString('vi-VN') || 0}đ</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {customerSelectError && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1.5 animate-fadeIn mt-2.5">
                <AlertCircle size={13} className="shrink-0" />
                {customerSelectError}
              </p>
            )}
          </div>

          {/* Service Catalog Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={18} className="text-blue-500 animate-none" />
              <span>Danh mục dịch vụ</span>
            </h2>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-100 pb-2 select-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{
                    backgroundColor: activeCategory === cat ? '#2563eb' : '#f8fafc',
                    borderColor: activeCategory === cat ? '#2563eb' : '#e2e8f0'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 select-none">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleAddService(service)}
                  className="bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl p-3 flex flex-col justify-between items-start transition-all cursor-pointer group shadow-xs hover:shadow-sm"
                >
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 mb-1 leading-tight">{service.name}</h3>
                    <p className="text-xs text-slate-500 font-bold">{service.price.toLocaleString('vi-VN')}đ / {service.unit}</p>
                  </div>
                  <div className="mt-3 flex w-full justify-end">
                    <span className="w-6 h-6 bg-white group-hover:bg-blue-600 group-hover:text-white text-slate-400 border border-slate-200 group-hover:border-blue-600 rounded-md flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cart, Billing, Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-500 animate-none" />
              <span>Giỏ hàng & Thanh toán</span>
            </h2>

            {/* Cart Items */}
            <div className="flex flex-col gap-2 min-h-[150px] max-h-[300px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-6">
                  <ShoppingCart size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-semibold">Chưa có dịch vụ nào</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.serviceId} className="flex flex-col gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.serviceId)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 border-0 bg-transparent cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0.1"
                          step={item.unit === 'kg' ? '0.1' : '1'}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.serviceId, e.target.value)}
                          className="w-16 px-2 py-1 bg-white border border-slate-250 rounded text-center font-bold focus:border-blue-500 outline-none"
                        />
                        <span className="text-slate-500 font-bold">{item.unit}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {(item.price * (Number(item.quantity) || 0)).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Notes */}
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">GHI CHÚ ĐƠN HÀNG</label>
              <textarea
                placeholder="Ví dụ: Giặt riêng đồ trắng..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:border-blue-500 outline-none resize-none font-semibold"
              />
            </div>

            {/* Billing Summary */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3 text-left">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500">Tổng tiền dịch vụ</span>
                <span className="font-bold">{subTotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm items-center font-semibold">
                <span className="text-slate-500">Giảm giá/Khuyến mãi</span>
                <div className="flex items-center gap-1 w-24">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full text-right px-2 py-1 border border-slate-200 rounded bg-slate-50 focus:border-blue-500 outline-none font-bold text-red-500"
                  />
                  <span>đ</span>
                </div>
              </div>
              <div className="flex justify-between text-base mt-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-xs">Thành tiền</span>
                <span className="font-extrabold text-blue-650 text-xl">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-2 text-left">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Thanh toán</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none font-bold cursor-pointer"
              >
                <option value="CASH">Tiền mặt (Đã thu)</option>
                <option value="BANK_TRANSFER">Chuyển khoản (Đã thu)</option>
                <option value="UNPAID">Chưa thanh toán (Thu sau)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 select-none">
              <button
                type="button"
                onClick={(e) => handleCreateOrder(e, true)}
                className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={16} /> Lưu nháp
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <Printer size={16} /> Tạo đơn & in phiếu
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Customer Creation Modal */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="➕ Thêm khách hàng mới"
        size="md"
      >
        <form onSubmit={handleSaveNewCustomer} className="flex flex-col gap-4 text-left p-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Nhập họ và tên khách hàng..."
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-sm focus:border-blue-500 outline-none font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Nhập số điện thoại (10 chữ số)..."
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-sm focus:border-blue-500 outline-none font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Địa chỉ (Không bắt buộc)</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ của khách..."
              value={newCustAddress}
              onChange={(e) => setNewCustAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-sm focus:border-blue-500 outline-none font-semibold"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setCustomerModalOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm border-0 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm border-0 cursor-pointer"
            >
              Lưu & Chọn khách
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
