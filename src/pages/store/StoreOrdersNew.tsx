import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart, Plus, Minus, User, Search, FileText } from 'lucide-react';
import { PageHeader } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { mockCustomers, mockServices, useOrderStore } from '../../mocks/orderStore';
import type { Order } from '../../mocks/orderStore';

interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export default function StoreOrdersNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addOrder } = useOrderStore();

  // State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('mock-0'); // Default to first mock customer
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'UNPAID'>('CASH');
  const [notes, setNotes] = useState('');

  // Handle adding service to cart
  const handleAddService = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (!service) return;

    setCart(prev => {
      const existing = prev.find(item => item.serviceId === serviceId);
      if (existing) {
        return prev.map(item =>
          item.serviceId === serviceId
            ? { ...item, quantity: item.quantity + 1 }
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

  // Handle quantity changes
  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.serviceId === serviceId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  // Calculations
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Submit Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let customerName = '';
    let customerPhone = '';
    let customerPoints = 0;

    if (selectedCustomerId.startsWith('mock-')) {
      const idx = parseInt(selectedCustomerId.split('-')[1], 10);
      const mockCust = mockCustomers[idx];
      customerName = mockCust.name;
      customerPhone = mockCust.phone;
      customerPoints = mockCust.points;
    } else {
      // Custom client
      if (!customName.trim()) {
        toast('Vui lòng nhập tên khách hàng mới', 'error');
        return;
      }
      if (!customPhone.trim()) {
        toast('Vui lòng nhập SĐT khách hàng mới', 'error');
        return;
      }
      customerName = customName.trim();
      customerPhone = customPhone.trim();
    }

    if (cart.length === 0) {
      toast('Giỏ hàng trống! Vui lòng chọn dịch vụ.', 'error');
      return;
    }

    // Determine status & payment status
    const paymentStatus: 'PAID' | 'UNPAID' = paymentMethod === 'UNPAID' ? 'UNPAID' : 'PAID';
    
    // Services string representation (e.g. Giặt sấy theo kg (5kg), Vệ sinh giày (1đôi))
    const serviceName = cart.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ');

    const newOrder: Order = {
      id: `DL-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerPhone,
      customerPoints,
      serviceName,
      quantity: cart[0].quantity, // primary service qty
      unit: cart[0].unit,
      amount: totalAmount,
      paymentStatus,
      paymentMethod,
      status: 'RECEIVED',
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined
    };

    addOrder(newOrder);
    toast(`Tạo thành công đơn hàng ${newOrder.id}`, 'success');
    navigate('/store/orders');
  };

  // Get active customer info
  const activeCustomer = selectedCustomerId.startsWith('mock-')
    ? mockCustomers[parseInt(selectedCustomerId.split('-')[1], 10)]
    : null;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16">
      <PageHeader
        title="Tạo đơn hàng mới (POS)"
        description="Lập đơn hàng dịch vụ giặt ủi tại quầy cho khách hàng."
        breadcrumb={[
          { label: 'Cửa hàng', to: '/store/dashboard' },
          { label: 'Đơn hàng', to: '/store/orders' },
          { label: 'Tạo đơn mới' },
        ]}
      />

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-slate-900">
        {/* Left Column: Customer & Catalog */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Customer Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <span>Thông tin khách hàng</span>
            </h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Khách hàng</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  {mockCustomers.map((cust, idx) => (
                    <option key={idx} value={`mock-${idx}`}>
                      {cust.name} - {cust.phone} ({cust.points} điểm)
                    </option>
                  ))}
                  <option value="new">-- Thêm khách hàng mới --</option>
                </select>
              </div>

              {selectedCustomerId === 'new' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tên khách hàng</label>
                    <input
                      type="text"
                      placeholder="Nhập họ tên"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                    <input
                      type="text"
                      placeholder="Nhập SĐT"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : activeCustomer ? (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-xs flex justify-between items-center">
                  <span className="text-slate-600">Điểm tích lũy: <strong className="text-blue-600 font-bold">{activeCustomer.points}</strong> điểm</span>
                  <span className="px-2 py-0.5 bg-blue-100/50 text-blue-700 rounded-full font-semibold">Thành viên DUDI</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Service Catalog */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Search size={18} className="text-blue-500" />
              <span>Dịch vụ giặt ủi</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mockServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleAddService(service.id)}
                  className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-xl p-4 flex flex-col justify-between items-start transition-all cursor-pointer group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{service.name}</h3>
                    <p className="text-xs text-slate-500">{service.price.toLocaleString('vi-VN')}đ / {service.unit}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-slate-200 hover:border-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Chọn</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cart, payment details, total, submit */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Cart list & Total */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-500" />
                <span>Giỏ hàng dịch vụ</span>
              </h2>

              {cart.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 mb-4">
                  <p className="text-xs text-slate-400 font-medium">Chưa chọn dịch vụ nào</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-6 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.serviceId} className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.serviceId, -1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-bold text-slate-700 w-12 text-center text-xs whitespace-nowrap">{item.quantity} {item.unit}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.serviceId, 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Notes */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={14} />
                  <span>Ghi chú đơn hàng</span>
                </label>
                <textarea
                  placeholder="Ghi chú thêm (ví dụ: quần áo trắng cần tẩy sạch, giặt riêng...)"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="CASH">Tiền mặt (Đã thanh toán)</option>
                  <option value="BANK_TRANSFER">Chuyển khoản (Đã thanh toán)</option>
                  <option value="UNPAID">Chưa thanh toán</option>
                </select>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">TỔNG CỘNG</span>
                <span className="text-xl font-extrabold text-blue-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <ShoppingCart size={18} />
                <span>Tạo đơn và in hóa đơn</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
