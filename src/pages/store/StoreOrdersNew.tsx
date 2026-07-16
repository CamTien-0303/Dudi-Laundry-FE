import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  ShoppingCart, Plus, User, Search, FileText, Trash2, 
  MessageSquare, Printer, Save, Check
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
  const [isAddingNewCust, setIsAddingNewCust] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  
  // Catalog State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'UNPAID'>('CASH');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState<number | string>('');

  // Success Modal
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Search logic
  const handleSearchCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchPhone(val);
    if (val.length >= 3) {
      const found = mockCustomers.find(c => c.phone.includes(val) || c.name.toLowerCase().includes(val.toLowerCase()));
      if (found) {
        setSelectedCustomer({ ...found, debt: 50000 }); // mock debt
        setIsAddingNewCust(false);
      } else {
        setSelectedCustomer(null);
      }
    } else {
      setSelectedCustomer(null);
    }
  };

  const handleAddNewCustomer = () => {
    setIsAddingNewCust(true);
    setSelectedCustomer(null);
    setCustomPhone(searchPhone); // prepopulate
    setCustomName('');
  };

  const cancelAddNewCustomer = () => {
    setIsAddingNewCust(false);
    setSearchPhone('');
    setCustomPhone('');
    setCustomName('');
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
    const numVal = Number(val);
    if (numVal > 100) {
      toast('Cảnh báo: Khối lượng vượt quá 100kg!', 'warning');
    }

    setCart(prev => {
      return prev.map(item => {
        if (item.serviceId === serviceId) {
          return { ...item, quantity: val === '' ? '' : numVal };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (serviceId: string) => {
    setCart(prev => prev.filter(i => i.serviceId !== serviceId));
  };

  // Calculations
  const subTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * (Number(item.quantity) || 0), 0), [cart]);
  const discountVal = Number(discount) || 0;
  const totalAmount = Math.max(0, subTotal - discountVal);

  const filteredServices = LOCAL_SERVICES.filter(s => s.category === activeCategory);

  // Validate & Submit
  const handleCreateOrder = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    let customerName = '';
    let customerPhone = '';
    let customerPoints = 0;

    if (selectedCustomer) {
      customerName = selectedCustomer.name;
      customerPhone = selectedCustomer.phone;
      customerPoints = selectedCustomer.points;
    } else if (isAddingNewCust) {
      if (!customName.trim()) {
        toast('Vui lòng nhập tên khách hàng mới', 'error');
        return;
      }
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(customPhone.trim())) {
        toast('Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số, bắt đầu bằng 0.', 'error');
        return;
      }
      customerName = customName.trim();
      customerPhone = customPhone.trim();
    } else {
      toast('Vui lòng tìm kiếm hoặc thêm khách hàng mới', 'error');
      return;
    }

    if (cart.length === 0) {
      toast('Giỏ hàng trống! Vui lòng chọn ít nhất một dịch vụ.', 'error');
      return;
    }

    if (cart.some(item => Number(item.quantity) <= 0)) {
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
      customerName,
      customerPhone,
      customerPoints,
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
    setSuccessOrder(newOrder); // Opens popup
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

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer & Catalog */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Customer Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User size={18} className="text-blue-500" />
                <span>Thông tin khách hàng</span>
              </h2>
              {!isAddingNewCust && (
                <button
                  type="button"
                  onClick={handleAddNewCustomer}
                  className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Thêm mới
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              {!isAddingNewCust ? (
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo Tên hoặc Số điện thoại (Ví dụ: 090...)"
                    value={searchPhone}
                    onChange={handleSearchCustomer}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none transition-all"
                  />
                  
                  {/* Active Customer Details Mock */}
                  {selectedCustomer && (
                    <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-blue-900">{selectedCustomer.name}</p>
                          <p className="text-slate-600 text-xs">{selectedCustomer.phone}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-100/50 text-blue-700 rounded-full font-semibold text-[10px]">Thành viên DUDI</span>
                      </div>
                      <div className="flex gap-4 mt-1 pt-2 border-t border-blue-100/50 text-xs">
                        <span className="text-slate-600">Điểm tích lũy: <strong className="text-emerald-600">{selectedCustomer.points}</strong></span>
                        <span className="text-slate-600">Công nợ: <strong className="text-red-500">{selectedCustomer.debt.toLocaleString('vi-VN')}đ</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tên khách hàng</label>
                      <input
                        type="text"
                        placeholder="Nhập họ tên"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                      <input
                        type="text"
                        placeholder="Nhập SĐT (10 số)"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={cancelAddNewCustomer}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Catalog Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={18} className="text-blue-500" />
              <span>Danh mục dịch vụ</span>
            </h2>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-100 pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleAddService(service)}
                  className="bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl p-3 flex flex-col justify-between items-start transition-all cursor-pointer group shadow-xs hover:shadow-sm"
                >
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 mb-1 leading-tight">{service.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{service.price.toLocaleString('vi-VN')}đ / {service.unit}</p>
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
              <FileText size={18} className="text-blue-500" />
              <span>Giỏ hàng & Thanh toán</span>
            </h2>

            {/* Cart Items */}
            <div className="flex flex-col gap-2 min-h-[150px] max-h-[300px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-6">
                  <ShoppingCart size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-medium">Chưa có dịch vụ nào</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.serviceId} className="flex flex-col gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.serviceId)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step={item.unit === 'kg' ? '0.1' : '1'}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.serviceId, e.target.value)}
                          className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold focus:border-blue-500 outline-none"
                        />
                        <span className="text-slate-500">{item.unit}</span>
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
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">GHI CHÚ ĐƠN HÀNG</label>
              <textarea
                placeholder="Ví dụ: Giặt riêng đồ trắng..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* Billing Summary */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tổng tiền dịch vụ</span>
                <span className="font-semibold">{subTotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-500">Giảm giá/Khuyến mãi</span>
                <div className="flex items-center gap-1 w-24">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full text-right px-2 py-1 border border-slate-200 rounded bg-slate-50 focus:border-blue-500 outline-none font-semibold text-red-500"
                  />
                  <span>đ</span>
                </div>
              </div>
              <div className="flex justify-between text-base mt-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-sm">Thành tiền</span>
                <span className="font-extrabold text-blue-600 text-xl">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Thanh toán</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none font-bold"
              >
                <option value="CASH">Tiền mặt (Đã thu)</option>
                <option value="BANK_TRANSFER">Chuyển khoản (Đã thu)</option>
                <option value="UNPAID">Chưa thanh toán (Thu sau)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={(e) => handleCreateOrder(e, true)}
                className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
              >
                <Save size={16} /> Lưu nháp
              </button>
              <button
                type="button"
                onClick={(e) => handleCreateOrder(e, false)}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Printer size={16} /> Xác nhận & In
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal Mock */}
      <Modal 
        isOpen={!!successOrder} 
        onClose={() => { setSuccessOrder(null); navigate('/store/orders'); }} 
        title="🎉 Tạo đơn thành công"
        size="md"
      >
        {successOrder && (
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check size={32} className="text-emerald-600" strokeWidth={3} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Mã đơn: {successOrder.id}</h3>
              <p className="text-slate-500">Khách hàng: <strong>{successOrder.customerName}</strong> ({successOrder.customerPhone})</p>
              <p className="text-slate-500 mt-1">Tổng tiền: <strong className="text-blue-600">{successOrder.amount.toLocaleString('vi-VN')}đ</strong></p>
            </div>
            
            <div className="w-full bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-sm mt-2">
              <MessageSquare size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900 mb-1">Zalo Notification (Mock)</p>
                <p className="text-blue-800 leading-relaxed italic">
                  "DUDI Laundry xin chào! Đơn hàng {successOrder.id} của quý khách đã được tiếp nhận. 
                  Tổng tiền: {successOrder.amount.toLocaleString('vi-VN')}đ. Cảm ơn quý khách!"
                </p>
                <span className="inline-block mt-2 text-[10px] bg-blue-200/50 text-blue-700 px-2 py-0.5 rounded font-bold">
                  ✓ Đã gửi tin nhắn tự động
                </span>
              </div>
            </div>

            <div className="w-full flex gap-3 mt-4">
              <button 
                onClick={() => { setSuccessOrder(null); navigate('/store/orders'); }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm"
              >
                Về danh sách
              </button>
              <button 
                onClick={() => { setSuccessOrder(null); window.location.reload(); }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Tạo đơn tiếp
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
