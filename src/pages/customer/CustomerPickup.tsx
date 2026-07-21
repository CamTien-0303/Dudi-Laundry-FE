import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
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
import { PageHeader, useToast } from '../../components/common';

export default function CustomerPickup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Parse query params
  const query = new URLSearchParams(location.search);
  const branchParam = query.get('branch');

  // Form states
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [customDate, setCustomDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [servicePackage, setServicePackage] = useState(() => {
    const s = query.get('service');
    if (s === 'giat-say' || s === 'fast') return 'Giặt sấy lấy nhanh';
    if (s === 'giat-hap' || s === 'premium') return 'Giặt hấp cao cấp';
    if (s === 'giat-giay-tui' || s === 'eco') return 'Giặt hấp cao cấp'; // giặt giày túi chọn hấp cao cấp (delicate care)
    return '';
  });
  const [bagCount, setBagCount] = useState('1');
  const [shipperNote, setShipperNote] = useState('');

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState({
    address: '',
    timeSlot: '',
    dateLabel: '',
    servicePackage: '',
    bagCount: ''
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
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};

    // 1. Validate Phone
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
    } else if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số).';
    }

    // 2. Validate Address
    if (!address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ lấy đồ.';
    }

    // 3. Validate Date
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

    // 4. Validate Time slot
    if (!timeSlot) {
      newErrors.timeSlot = 'Vui lòng chọn khung giờ lấy đồ.';
    }

    // 5. Validate Service package
    if (!servicePackage) {
      newErrors.servicePackage = 'Vui lòng chọn gói dịch vụ giặt.';
    }

    // 6. Validate Bag count (must be >= 1)
    const bags = parseInt(bagCount);
    if (!bagCount || isNaN(bags) || bags < 1) {
      newErrors.bagCount = 'Số lượng túi/kiện dự kiến phải lớn hơn hoặc bằng 1.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast('Vui lòng kiểm tra lại thông tin đặt lịch.', 'error');
      
      // Auto scroll and focus the first error element
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        let targetId = `${firstErrorKey}-input`;
        
        if (firstErrorKey === 'date' && dateType === 'other') {
          targetId = 'customDate-input';
        }

        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 50);
      return;
    }

    // Double submit protection
    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setConfirmedDetails({
        address: address.trim(),
        timeSlot,
        dateLabel,
        servicePackage,
        bagCount
      });
      setIsSuccess(true);
      setIsSubmitting(false);
      toast('Đặt lịch thu gom đồ thành công!', 'success');
    }, 800); // 800ms submission animation
  };

  const handleResetForm = () => {
    setPhone('');
    setAddress('');
    setDateType('today');
    setCustomDate('');
    setTimeSlot('');
    setServicePackage('');
    setBagCount('1');
    setShipperNote('');
    setErrors({});
    setIsSuccess(false);
  };

  // SUCCESS STATE RENDER
  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center flex flex-col items-center gap-5 mt-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-inner">
            <CheckCircle2 size={32} className="stroke-[2]" />
          </div>
          
          <div className="flex flex-col gap-1.5 text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Đã đặt lịch!</h2>
            <p className="text-xs text-slate-500 font-semibold">Yêu cầu thu gom đồ giặt của bạn đã được tiếp nhận thành công.</p>
          </div>

          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-left flex flex-col gap-3.5 my-1 text-xs">
            
            <div className="flex items-center gap-3 bg-white border border-slate-100/50 p-3 rounded-xl shadow-3xs">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shipper đảm nhận</span>
                <span className="font-bold text-slate-850 text-sm">Nguyễn Minh</span>
                <span className="text-[10px] text-blue-600 font-bold">Dự kiến đến trong 30 phút</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-100/60 pb-3">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Mã yêu cầu</span>
                <span className="font-extrabold text-blue-600">PU-001</span>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Kênh thông báo</span>
                <span className="font-bold text-slate-800">Zalo & SMS</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                Địa chỉ lấy đồ
              </span>
              <span className="font-bold text-slate-800 pl-4 leading-relaxed">{confirmedDetails.address}</span>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t border-slate-100/60 text-left">
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <Clock size={12} className="text-slate-400 animate-none" />
                Thời gian lấy đồ
              </span>
              <span className="font-bold text-slate-800 pl-4">
                Khung giờ {confirmedDetails.timeSlot} ({confirmedDetails.dateLabel})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100/60 text-left">
              <div className="flex flex-col gap-1">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Gói dịch vụ</span>
                <span className="font-bold text-slate-800">{confirmedDetails.servicePackage}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Số lượng túi/kiện</span>
                <span className="font-bold text-slate-800">{confirmedDetails.bagCount} kiện</span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100/50 text-[10px] font-bold text-center mt-1">
              Thông báo xác nhận sẽ được gửi qua Zalo
            </div>

          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer border-0"
            >
              Đặt lịch khác
            </button>
            <button
              type="button"
              onClick={() => navigate('/customer')}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0 flex items-center justify-center gap-1.5"
            >
              Về trang chủ
              <ArrowRight size={16} className="animate-none" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL FORM RENDER
  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-2xl mx-auto px-4 sm:px-0">
      <PageHeader
        title="Đặt lịch lấy đồ tận nơi"
        description="Điền thông tin địa chỉ và thời gian, nhân viên DUDI sẽ đến tận nhà thu gom đồ giặt cho bạn."
      />

      {branchParam && (
        <div className="bg-blue-50/50 border border-blue-150 rounded-2xl p-4 flex gap-3 items-start text-xs text-blue-800 shadow-3xs animate-fadeIn">
          <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-left">
            <span className="font-bold uppercase tracking-wider text-[9px] text-blue-400">Chi nhánh tiếp nhận dự kiến</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {branchParam === 'q1' && 'DUDI Quận 1 — 123 Nguyễn Huệ, Quận 1, TP.HCM'}
              {branchParam === 'q3' && 'DUDI Quận 3 — 456 Võ Văn Tần, Quận 3, TP.HCM'}
              {branchParam === 'thu_duc' && 'DUDI Thủ Đức — 789 Võ Văn Ngân, Thủ Đức, TP.HCM'}
              {!['q1', 'q3', 'thu_duc'].includes(branchParam) && 'Chi nhánh gần bạn nhất'}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
              Đơn hàng của bạn sẽ được thu gom và điều phối về chi nhánh này để giặt ủi nhằm tiết kiệm quãng đường và thời gian xử lý.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleConfirm} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
        
        {/* Trường: Số điện thoại */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Phone size={13} className="text-slate-400" />
            Số điện thoại liên hệ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone-input"
            placeholder="Nhập số điện thoại của bạn..."
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-semibold ${
              errors.phone ? 'border-red-500 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.phone}</span>
          )}
        </div>

        {/* Trường: Địa chỉ */}
        <div className="flex flex-col gap-2 text-left">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin size={13} className="text-slate-400 animate-none" />
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
            id="address-input"
            rows={3}
            placeholder="Nhập địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã, Quận/Huyện)..."
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
            }}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 resize-none font-semibold ${
              errors.address ? 'border-red-500 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.address && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.address}</span>
          )}
        </div>

        {/* Trường: Ngày lấy đồ */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={13} className="text-slate-400" />
            Chọn ngày lấy đồ <span className="text-red-500">*</span>
          </label>
          
          <div id="date-input" className="grid grid-cols-3 gap-2.5 select-none">
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
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-250'
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
              id="customDate-input"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full mt-1.5 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold ${
                errors.date ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
            />
          )}
          {errors.date && dateType === 'other' && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.date}</span>
          )}
        </div>

        {/* Trường: Khung giờ */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Clock size={13} className="text-slate-400" />
            Chọn khung giờ shipper đến lấy <span className="text-red-500">*</span>
          </label>
          
          <div id="timeSlot-input" className={`grid grid-cols-2 gap-2.5 p-1 rounded-2xl border transition-all ${
            errors.timeSlot ? 'border-red-500 bg-red-50/10' : 'border-transparent'
          }`}>
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
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-655 border-slate-250'
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
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Sparkles size={13} className="text-slate-400" />
            Chọn gói dịch vụ dự kiến <span className="text-red-500">*</span>
          </label>
          
          <div id="servicePackage-input" className={`flex flex-col gap-2 p-1 rounded-2xl border transition-all ${
            errors.servicePackage ? 'border-red-500 bg-red-50/10' : 'border-transparent'
          }`}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Package size={13} className="text-slate-400" />
              Số túi/kiện dự kiến <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="bagCount-input"
              min="1"
              max="20"
              value={bagCount}
              onChange={(e) => {
                setBagCount(e.target.value);
                if (errors.bagCount) setErrors((prev) => ({ ...prev, bagCount: '' }));
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-semibold ${
                errors.bagCount ? 'border-red-500 bg-red-50/10 focus:border-red-500' : 'border-slate-250'
              }`}
            />
            {errors.bagCount && (
              <span className="text-[10px] text-red-500 font-semibold pl-1 mt-1 block">{errors.bagCount}</span>
            )}
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-semibold"
            />
          </div>
        </div>

        {/* Dòng nhắc nhở & Nút xác nhận */}
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-3 text-left">
          
          <div className="flex items-start gap-2 text-[11px] text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100/50">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">
              Nhân viên sẽ cân đồ và báo giá chính xác khi tiếp nhận.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 border-0 mt-1 flex items-center justify-center gap-2 ${
              isSubmitting 
                ? 'bg-slate-400 shadow-none cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận đặt lịch'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
