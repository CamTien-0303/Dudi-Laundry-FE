import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Truck,
  MapPin,
  Clock,
  CreditCard,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Info,
  Package,
  Home
} from 'lucide-react';
import { PageHeader } from '../../components/common';

interface MockOrder {
  id: string;
  status: 'COMPLETED' | 'CANCELLED';
  statusLabel: string;
  amount: string;
  amountVal: number;
  branchName: string;
  branchAddress: string;
  oldAddress: string;
}

const mockOrderData: MockOrder = {
  id: 'DUDI-123',
  status: 'COMPLETED',
  statusLabel: 'Hoàn thành/Đóng gói',
  amount: '150.000đ',
  amountVal: 150000,
  branchName: 'DUDI Quận 1',
  branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  oldAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM'
};

export default function CustomerDelivery() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const isValidOrder = orderId?.toUpperCase() === 'DUDI-123';

  // Form states
  const [addressType, setAddressType] = useState<'old' | 'new'>('old');
  const [newAddress, setNewAddress] = useState('');
  const [timeSlot, setTimeSlot] = useState('Giao ngay khi có thể');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QR'>('COD');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success flow
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidOrder) return;

    const newErrors: Record<string, string> = {};

    // Validate new address if selected
    if (addressType === 'new') {
      if (!newAddress.trim()) {
        newErrors.address = 'Vui lòng nhập địa chỉ giao đồ mới.';
      } else if (newAddress.toLowerCase().includes('ngoài vùng')) {
        newErrors.address = 'Địa chỉ nằm ngoài vùng phục vụ của cửa hàng.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);
  };

  // Invalid state
  if (!isValidOrder) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <PageHeader
          title="Đặt lịch giao đồ"
          description="Đăng ký lịch nhận đồ giặt sạch về tận nhà."
        />
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-700 flex flex-col items-center gap-4 mt-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-650 flex items-center justify-center border border-red-200">
            <AlertTriangle size={26} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-extrabold text-slate-900">Không tìm thấy đơn hàng sẵn sàng giao.</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Mã đơn hàng không hợp lệ, đã được giao hoặc chưa hoàn thành xử lý để giao trả. Vui lòng kiểm tra lại.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="mt-2 px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100/50 transition-all cursor-pointer"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const shippingFee = 20000;
  const totalAmount = mockOrderData.amountVal + shippingFee;

  // Success state
  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center flex flex-col items-center gap-5 mt-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-inner">
            <CheckCircle2 size={32} className="stroke-[2]" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Shipper đang chuẩn bị đơn hàng của bạn</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed px-4">
              Chúng tôi đang sắp xếp shipper giao trả quần áo sạch về cho bạn.
            </p>
          </div>

          {/* Chi tiết giao hàng */}
          <div className="w-full text-left text-xs bg-slate-50 border border-slate-100 rounded-2xl p-4.5 flex flex-col gap-3.5 my-1">
            
            <div className="flex items-center gap-3 bg-white border border-slate-100/50 p-3 rounded-xl">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Truck size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shipper đảm nhận</span>
                <span className="font-bold text-slate-850 text-sm">Trần Quốc Huy</span>
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" />
                  Hotline: 0909 888 777
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-200/50">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                Địa chỉ nhận hàng
              </span>
              <span className="font-bold text-slate-800 pl-4">
                {addressType === 'old' ? mockOrderData.oldAddress : newAddress}
              </span>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t border-slate-200/50">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                Thời gian giao hàng
              </span>
              <span className="font-bold text-slate-800 pl-4">
                {timeSlot}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-700">Tổng thanh toán shipper thu:</span>
              <span className="text-base font-black text-blue-600">
                {totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>

          </div>

          {/* Dòng ghi chú bổ sung */}
          <div className="flex items-start gap-2 text-[11px] text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100/50 w-full text-left">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">
              Thông tin giao hàng đã được cập nhật vào màn hình tra cứu đơn hàng.
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-2xl mx-auto px-4 sm:px-0">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-2">
        <PageHeader
          title="Đặt lịch giao đồ tận nhà"
          description="Xác nhận địa chỉ và thời gian nhận quần áo sạch đã hoàn tất."
        />
      </div>

      <form onSubmit={handleConfirm} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-6">
        
        {/* Tóm tắt đơn hàng sẵn sàng giao */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-xs">
          {/* Ảnh minh họa túi đồ đóng gói */}
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-500 shrink-0 shadow-inner">
            <Package size={36} className="stroke-[1.5]" />
          </div>
          <div className="flex flex-col gap-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 w-full">
              <strong className="text-slate-900 text-sm font-extrabold tracking-wide">{mockOrderData.id}</strong>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-block">
                  {mockOrderData.statusLabel}
                </span>
              </div>
            </div>
            <p className="text-slate-500 font-medium mt-1">
              Chi nhánh: <strong>{mockOrderData.branchName}</strong> - {mockOrderData.branchAddress}
            </p>
            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-200/50">
              <span className="text-slate-450 font-semibold">Số tiền còn lại của đơn hàng:</span>
              <span className="font-extrabold text-sm text-slate-800">{mockOrderData.amount}</span>
            </div>
          </div>
        </div>

        {/* Địa chỉ giao */}
        <div className="flex flex-col gap-3 pt-1 border-t border-slate-50">
          <label className="text-xs font-bold text-slate-700 text-[13px] flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-450" />
            Chọn địa chỉ giao đồ <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-col gap-2.5">
            
            {/* Địa chỉ cũ */}
            <button
              type="button"
              onClick={() => {
                setAddressType('old');
                if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                addressType === 'old'
                  ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
              style={{
                backgroundColor: addressType === 'old' ? 'rgba(239, 246, 255, 0.5)' : '#f8fafc',
                borderColor: addressType === 'old' ? '#2563eb' : '#e2e8f0'
              }}
            >
              <Home size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-bold text-slate-800">Giao đến địa chỉ cũ</span>
                <span className="text-slate-500 font-semibold">{mockOrderData.oldAddress}</span>
              </div>
            </button>

            {/* Địa chỉ mới */}
            <button
              type="button"
              onClick={() => setAddressType('new')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                addressType === 'new'
                  ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
              style={{
                backgroundColor: addressType === 'new' ? 'rgba(239, 246, 255, 0.5)' : '#f8fafc',
                borderColor: addressType === 'new' ? '#2563eb' : '#e2e8f0'
              }}
            >
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 w-full text-xs">
                <span className="font-bold text-slate-800">Nhập địa chỉ mới</span>
                {addressType === 'new' && (
                  <textarea
                    rows={2}
                    placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện mới..."
                    value={newAddress}
                    onChange={(e) => {
                      setNewAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full mt-1.5 p-2.5 bg-white border rounded-lg text-slate-700 text-xs focus:border-blue-500 outline-none placeholder-slate-400 resize-none ${
                      errors.address ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                )}
              </div>
            </button>
            {errors.address && addressType === 'new' && (
              <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.address}</span>
            )}

          </div>
        </div>

        {/* Khung giờ nhận đồ */}
        <div className="flex flex-col gap-3 pt-1 border-t border-slate-50">
          <label className="text-xs font-bold text-slate-700 text-[13px] flex items-center gap-1.5">
            <Clock size={14} className="text-slate-450" />
            Chọn khung giờ nhận đồ <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { slot: 'Giao ngay khi có thể', disabled: false },
              { slot: '14:00 - 16:00', disabled: false },
              { slot: '16:00 - 18:00', disabled: true, note: 'Hết lịch shipper' },
              { slot: '18:00 - 20:00', disabled: false }
            ].map((item) => {
              const isSelected = timeSlot === item.slot;
              return (
                <button
                  key={item.slot}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => setTimeSlot(item.slot)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    item.disabled
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75'
                      : isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm cursor-pointer'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-250 cursor-pointer'
                  }`}
                  style={{
                    backgroundColor: item.disabled ? '#f1f5f9' : isSelected ? '#2563eb' : '#f8fafc',
                    borderColor: item.disabled ? '#e2e8f0' : isSelected ? '#2563eb' : '#cbd5e1',
                    color: item.disabled ? '#94a3b8' : isSelected ? '#ffffff' : '#334155'
                  }}
                >
                  <span>{item.slot}</span>
                  {item.disabled && (
                    <span className="text-[9px] bg-slate-200 text-slate-550 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                      {item.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="flex flex-col gap-3 pt-1 border-t border-slate-50">
          <label className="text-xs font-bold text-slate-700 text-[13px] flex items-center gap-1.5">
            <CreditCard size={14} className="text-slate-450" />
            Phương thức thanh toán khi nhận hàng <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { type: 'COD', title: 'Thanh toán COD', desc: 'Thanh toán tiền mặt cho shipper' },
              { type: 'QR', title: 'Chuyển khoản QR', desc: 'Quét QR thanh toán khi shipper giao' }
            ].map((pm) => {
              const isSelected = (pm.type === paymentMethod);
              return (
                <button
                  key={pm.type}
                  type="button"
                  onClick={() => setPaymentMethod(pm.type as 'COD' | 'QR')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(239, 246, 255, 0.5)' : '#f8fafc',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0'
                  }}
                >
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
                    {pm.title}
                  </span>
                  <span className="text-[9px] text-slate-450 font-semibold leading-normal">{pm.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tóm tắt chi phí & Hotline shipper */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex flex-col gap-3 pt-1 border-t border-slate-50 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/50 pb-1.5">
            Tóm tắt chi phí giao đồ
          </span>
          
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Tiền đơn hàng còn lại:</span>
            <span className="text-slate-800 font-bold">{mockOrderData.amount}</span>
          </div>

          <div className="flex justify-between text-slate-500 font-medium">
            <span>Phí giao hàng tận nhà:</span>
            <span className="text-slate-800 font-bold">{shippingFee.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60">
            <span className="font-extrabold text-slate-850">Tổng thanh toán:</span>
            <span className="text-base font-black text-blue-600">
              {totalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 mt-1">
            <span className="text-slate-450 font-semibold flex items-center gap-1">
              <Phone size={13} className="text-slate-450" />
              Hotline shipper hỗ trợ:
            </span>
            <strong className="text-slate-700 font-extrabold text-sm">0909 888 777</strong>
          </div>
        </div>

        {/* Nút xác nhận */}
        <div className="border-t border-slate-100 pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0"
          >
            Xác nhận giao đồ
          </button>
        </div>

      </form>
    </div>
  );
}
