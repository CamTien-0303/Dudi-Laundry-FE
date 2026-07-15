import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Phone,
  MapPin,
  Plus,
  Minus,
  Tag,
  MessageSquare,
  CheckCircle2,
  Users,
  AlertTriangle
} from 'lucide-react';
import { PageHeader, useToast } from '../../components/common';

interface ServiceOption {
  id: string;
  name: string;
  priceVal: number;
  priceLabel: string;
  unit: string;
}

const serviceOptions: ServiceOption[] = [
  { id: 'giat-say', name: 'Giặt sấy', priceVal: 15000, priceLabel: '15.000đ', unit: 'kg' },
  { id: 'giat-hap', name: 'Giặt hấp', priceVal: 80000, priceLabel: '80.000đ', unit: 'cái' },
  { id: 've-sinh-giay', name: 'Vệ sinh giày', priceVal: 60000, priceLabel: '60.000đ', unit: 'đôi' }
];

export default function CustomerQrOrder() {
  const { storeToken } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValidToken = storeToken?.toLowerCase() === 'q1-store';

  // Form states
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [note, setNote] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success flow
  const [isSuccess, setIsSuccess] = useState(false);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleCallStaff = () => {
    toast('Đã gọi nhân viên hỗ trợ! Nhân viên quầy sẽ đến hỗ trợ bạn ngay.', 'success');
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc.';
    } else if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số).';
    }

    if (!selectedServiceId) {
      newErrors.service = 'Vui lòng chọn một loại dịch vụ.';
    }

    if (quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);
  };

  // Calculations for bill preview
  const selectedService = serviceOptions.find(s => s.id === selectedServiceId);
  const unitPrice = selectedService ? selectedService.priceVal : 0;
  const totalPrice = unitPrice * quantity;

  // Invalid Token State
  if (!isValidToken) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <PageHeader
          title="Quét QR tạo đơn"
          description="Đăng ký gửi đồ giặt trực tiếp tại quầy bằng mã QR."
        />
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-700 flex flex-col items-center gap-4 mt-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-650 flex items-center justify-center border border-red-200">
            <AlertTriangle size={26} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-extrabold text-slate-900">Cửa hàng không tồn tại.</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Mã QR cửa hàng không hợp lệ hoặc chi nhánh này đã ngừng hoạt động. Vui lòng quét lại mã tại quầy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/customer')}
            className="mt-2 px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100/50 transition-all cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center flex flex-col items-center gap-5 mt-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-inner">
            <CheckCircle2 size={32} className="stroke-[2]" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Đã gửi thông tin thành công</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed px-4">
              Vui lòng đưa đồ cho nhân viên để xác nhận lại khối lượng.
            </p>
          </div>

          {/* Mã chờ */}
          <div className="w-full bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Mã chờ của bạn</span>
            <span className="text-3xl font-black text-blue-600 tracking-wider font-mono">QR-001</span>
          </div>

          {/* Chi nhánh */}
          <div className="w-full text-left text-xs bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Chi nhánh thực hiện</span>
              <span className="font-bold text-slate-850 text-xs">DUDI Laundry - Chi nhánh Quận 1</span>
            </div>
            {phone && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                <span className="text-slate-450 font-medium">Số điện thoại liên hệ:</span>
                <span className="font-bold text-slate-700">{phone}</span>
              </div>
            )}
            {selectedService && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                <span className="text-slate-450 font-medium">Dịch vụ yêu cầu:</span>
                <span className="font-bold text-slate-700">
                  {selectedService.name} ({quantity} {selectedService.unit})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            <button
              type="button"
              onClick={handleCallStaff}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-amber-500/10 cursor-pointer border-0 flex items-center justify-center gap-2"
            >
              <Users size={16} />
              Gọi nhân viên hỗ trợ
            </button>
            <button
              type="button"
              onClick={() => navigate('/customer')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-sm rounded-xl transition-all cursor-pointer border-0"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-2xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col gap-2">
        <PageHeader
          title="Tạo đơn tại quầy"
          description="Đăng ký gửi đồ giặt cực kỳ nhanh chóng bằng cách nhập thông tin tại quầy."
        />
        
        {/* Box Chi nhánh thực hiện */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 items-start mt-2">
          <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 text-xs">
            <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">Cửa hàng hiện tại</span>
            <strong className="text-slate-850 font-extrabold text-sm">DUDI Laundry - Chi nhánh Quận 1</strong>
            <span className="text-slate-500 font-medium">123 Nguyễn Huệ, Quận 1, TP.HCM</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirm} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
        
        {/* Trường 1: Số điện thoại */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1 text-[13px]">
            <Phone size={13} className="text-slate-400" />
            Số điện thoại của bạn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập số điện thoại để tích điểm & liên hệ..."
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            className={`w-full px-3.5 py-3 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 text-sm font-semibold ${
              errors.phone ? 'border-red-300 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.phone}</span>
          )}
        </div>

        {/* Trường 2: Địa chỉ */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1 text-[13px]">
            <MapPin size={13} className="text-slate-400" />
            Địa chỉ (Không bắt buộc)
          </label>
          <input
            type="text"
            placeholder="Nhập địa chỉ nhà nếu muốn giao đồ tận nơi..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 text-sm font-semibold"
          />
        </div>

        {/* Trường 3: Chọn dịch vụ */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 text-[13px]">
            Chọn dịch vụ sử dụng <span className="text-red-500">*</span>
          </label>
          
          <div className="flex flex-col gap-2">
            {serviceOptions.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    if (errors.service) setErrors((prev) => ({ ...prev, service: '' }));
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(239, 246, 255, 0.5)' : '#f8fafc',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0'
                  }}
                >
                  <span className={`text-sm font-extrabold ${isSelected ? 'text-blue-600' : 'text-slate-750'}`}>
                    {service.name}
                  </span>
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-600' : 'text-slate-600'}`}>
                    {service.priceLabel} / {service.unit}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.service && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.service}</span>
          )}
        </div>

        {/* Trường 4: Nhập số lượng/kg */}
        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-50">
          <label className="text-xs font-bold text-slate-700 text-[13px]">
            Số lượng / Số kg dự kiến <span className="text-red-500">*</span>
          </label>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-11 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 cursor-pointer border-solid shrink-0 select-none"
              style={{ width: '44px', height: '44px' }}
            >
              <Minus size={16} className="stroke-[2.5]" />
            </button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="w-16 h-11 text-center border border-slate-200 rounded-xl text-base font-black text-slate-800 bg-slate-50 outline-none border-solid shrink-0"
              style={{ width: '64px', height: '44px' }}
            />
            <button
              type="button"
              onClick={handleIncrement}
              className="w-11 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 cursor-pointer border-solid shrink-0 select-none"
              style={{ width: '44px', height: '44px' }}
            >
              <Plus size={16} className="stroke-[2.5]" />
            </button>
            {selectedService && (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                {selectedService.unit}
              </span>
            )}
          </div>
          {errors.quantity && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.quantity}</span>
          )}
        </div>

        {/* Trường 5 & 6: Mã giảm giá & Ghi chú */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 border-t border-slate-50">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1 text-[13px]">
              <Tag size={13} className="text-slate-400" />
              Mã giảm giá
            </label>
            <input
              type="text"
              placeholder="Nhập mã ưu đãi..."
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1 text-[13px]">
              <MessageSquare size={13} className="text-slate-400" />
              Ghi chú đơn hàng
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Giặt riêng đồ trắng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-semibold"
            />
          </div>
        </div>

        {/* Bảng xem trước hóa đơn (Bill Preview) */}
        {selectedService && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex flex-col gap-3 animate-fadeIn">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/50 pb-1.5">
              Hóa đơn tạm tính
            </span>
            
            <div className="flex justify-between items-start text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-800">{selectedService.name}</span>
                <span className="text-[10px] text-slate-450 font-semibold">Đơn giá: {selectedService.priceLabel} / {selectedService.unit}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-700">x{quantity} {selectedService.unit}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-800">Thành tiền tạm tính:</span>
              <span className="text-base font-black text-blue-600">
                {totalPrice.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        )}

        {/* Các nút bấm */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleCallStaff}
            className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
          >
            Gọi nhân viên hỗ trợ
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0"
          >
            Xác nhận gửi đồ
          </button>
        </div>

      </form>
    </div>
  );
}
