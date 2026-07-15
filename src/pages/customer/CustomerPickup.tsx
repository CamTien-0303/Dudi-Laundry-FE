import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Home,
  Briefcase,
  Package,
  MessageSquare,
  CheckCircle2,
  Info,
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '../../components/common';

export default function CustomerPickup() {
  const navigate = useNavigate();

  // Form states
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [customDate, setCustomDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [servicePackage, setServicePackage] = useState('');
  const [bagCount, setBagCount] = useState('1');
  const [shipperNote, setShipperNote] = useState('');

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState({
    address: '',
    timeSlot: '',
    dateLabel: ''
  });

  const handleQuickAddress = (type: 'home' | 'work') => {
    if (type === 'home') {
      setAddress('123 Nguyễn Huệ, Quận 1, TP.HCM');
    } else {
      setAddress('456 Võ Văn Tần, Quận 3, TP.HCM');
    }
    // Clear error inline for address if selected
    setErrors((prev) => ({ ...prev, address: '' }));
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validate Phone
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
    } else if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số).';
    }

    // Validate Address
    if (!address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ lấy đồ.';
    }

    // Validate Date
    let dateLabel = '';
    if (dateType === 'today') {
      dateLabel = 'Hôm nay';
    } else if (dateType === 'tomorrow') {
      dateLabel = 'Ngày mai';
    } else {
      if (!customDate) {
        newErrors.date = 'Vui lòng chọn ngày lấy đồ.';
      } else {
        const d = new Date(customDate);
        dateLabel = d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' });
      }
    }

    // Validate Time slot
    if (!timeSlot) {
      newErrors.timeSlot = 'Vui lòng chọn khung giờ lấy đồ.';
    }

    // Validate Service package
    if (!servicePackage) {
      newErrors.servicePackage = 'Vui lòng chọn gói dịch vụ giặt.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of card or focus first error
      return;
    }

    // Success flow
    setErrors({});
    setConfirmedDetails({
      address: address.trim(),
      timeSlot,
      dateLabel
    });
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center flex flex-col items-center gap-5 mt-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-inner">
            <CheckCircle2 size={32} className="stroke-[2]" />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Đã đặt lịch!</h2>
            <p className="text-xs text-slate-500 font-semibold">Yêu cầu thu gom đồ giặt của bạn đã được tiếp nhận.</p>
          </div>

          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-left flex flex-col gap-3.5 my-1 text-xs">
            
            <div className="flex items-center gap-3 bg-white border border-slate-100/50 p-3 rounded-xl">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shipper đảm nhận</span>
                <span className="font-bold text-slate-850 text-sm">Nguyễn Minh</span>
                <span className="text-[10px] text-blue-600 font-bold">Dự kiến đến trong 30 phút</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-100/60">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                Địa chỉ lấy đồ
              </span>
              <span className="font-bold text-slate-800 pl-4">{confirmedDetails.address}</span>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t border-slate-100/60">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                Thời gian lấy đồ
              </span>
              <span className="font-bold text-slate-800 pl-4">
                Khung giờ {confirmedDetails.timeSlot} ({confirmedDetails.dateLabel})
              </span>
            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate('/customer')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0 flex items-center justify-center gap-2"
          >
            Quay lại trang chủ
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-2xl mx-auto px-4 sm:px-0">
      <PageHeader
        title="Đặt lịch lấy đồ tận nơi"
        description="Điền thông tin địa chỉ và thời gian, nhân viên DUDI sẽ đến tận nhà thu gom đồ giặt cho bạn."
      />

      <form onSubmit={handleConfirm} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
        
        {/* Trường: Số điện thoại */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Phone size={13} className="text-slate-400" />
            Số điện thoại liên hệ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập số điện thoại của bạn..."
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 ${
              errors.phone ? 'border-red-300 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.phone}</span>
          )}
        </div>

        {/* Trường: Địa chỉ */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin size={13} className="text-slate-400" />
              Địa chỉ lấy đồ tận nơi <span className="text-red-500">*</span>
            </label>
            
            {/* Chọn nhanh địa chỉ */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAddress('home')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1"
              >
                <Home size={10} />
                Nhà riêng
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddress('work')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1"
              >
                <Briefcase size={10} />
                Cơ quan
              </button>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Nhập địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã, Quận/Huyện)..."
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
            }}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 resize-none ${
              errors.address ? 'border-red-300 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.address && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.address}</span>
          )}
        </div>

        {/* Trường: Ngày lấy đồ */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={13} className="text-slate-400" />
            Chọn ngày lấy đồ <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-3 gap-2.5">
            {(['today', 'tomorrow', 'other'] as const).map((type) => {
              const labels = { today: 'Hôm nay', tomorrow: 'Ngày mai', other: 'Chọn ngày khác' };
              const isSelected = dateType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setDateType(type);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-250'
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                    borderColor: isSelected ? '#2563eb' : '#cbd5e1'
                  }}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

          {/* Date Picker cho chọn ngày khác */}
          {dateType === 'other' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all ${
                errors.date ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
              }`}
            />
          )}
          {errors.date && dateType === 'other' && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.date}</span>
          )}
        </div>

        {/* Trường: Khung giờ */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Clock size={13} className="text-slate-400" />
            Chọn khung giờ shipper đến lấy <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 gap-2.5">
            {['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00'].map((slot) => {
              const isSelected = timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTimeSlot(slot);
                    if (errors.timeSlot) setErrors((prev) => ({ ...prev, timeSlot: '' }));
                  }}
                  className={`py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-250'
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                    borderColor: isSelected ? '#2563eb' : '#cbd5e1'
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {errors.timeSlot && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.timeSlot}</span>
          )}
        </div>

        {/* Trường: Gói dịch vụ */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Sparkles size={13} className="text-slate-400" />
            Chọn gói dịch vụ dự kiến <span className="text-red-500">*</span>
          </label>
          
          <div className="flex flex-col gap-2">
            {[
              { key: 'fast', title: 'Giặt sấy lấy nhanh', desc: 'Nhận đồ sạch sẽ chỉ trong 4 - 6 giờ' },
              { key: 'eco', title: 'Giặt tiết kiệm', desc: 'Giao trả sau 24 giờ, tối ưu chi phí' },
              { key: 'premium', title: 'Giặt hấp cao cấp', desc: 'Dành riêng cho vest, đầm và đồ đặc biệt' }
            ].map((pkg) => {
              const isSelected = servicePackage === pkg.title;
              return (
                <button
                  key={pkg.key}
                  type="button"
                  onClick={() => {
                    setServicePackage(pkg.title);
                    if (errors.servicePackage) setErrors((prev) => ({ ...prev, servicePackage: '' }));
                  }}
                  className={`w-full p-4.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-center h-auto min-h-[76px] whitespace-normal break-words border-solid ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-600/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                  }}
                >
                  <span className={`text-sm font-extrabold block ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
                    {pkg.title}
                  </span>
                  <span className={`text-xs block mt-1 leading-relaxed ${isSelected ? 'text-blue-500' : 'text-slate-500'}`}>
                    {pkg.desc}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.servicePackage && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.servicePackage}</span>
          )}
        </div>

        {/* Nhập số kiện & Ghi chú */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Package size={13} className="text-slate-400" />
              Số túi/kiện dự kiến
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={bagCount}
              onChange={(e) => setBagCount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MessageSquare size={13} className="text-slate-400" />
              Ghi chú cho shipper
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Gọi điện trước khi đến..."
              value={shipperNote}
              onChange={(e) => setShipperNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400"
            />
          </div>
        </div>

        {/* Dòng nhắc nhở & Nút xác nhận */}
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
          
          <div className="flex items-start gap-2 text-[11px] text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100/50">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">
              Nhân viên sẽ cân đồ và báo giá chính xác khi tiếp nhận.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 cursor-pointer border-0 mt-1"
          >
            Xác nhận đặt lịch
          </button>
        </div>

      </form>
    </div>
  );
}
