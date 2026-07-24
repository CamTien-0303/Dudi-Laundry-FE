import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  MapPin,
  Home,
  Briefcase,
  CheckCircle2,
  Info,
  User,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../components/common';

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
    if (s === 'giat-giay-tui' || s === 'eco') return 'Giặt hấp cao cấp';
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

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-hidden');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isSuccess]);

  const handleQuickAddress = (type: 'home' | 'work') => {
    if (type === 'home') {
      setAddress('123 Nguyễn Huệ, Quận 1, TP.HCM');
    } else {
      setAddress('456 Võ Văn Tần, Quận 3, TP.HCM');
    }
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
    }, 800);
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

  const getDateDisplay = () => {
    if (dateType === 'today') return 'Hôm nay';
    if (dateType === 'tomorrow') return 'Ngày mai';
    if (customDate) {
      const d = new Date(customDate);
      return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' });
    }
    return 'Chưa chọn';
  };

  // SUCCESS STATE RENDER (Confirmation View)
  if (isSuccess) {
    return (
      <div className="w-full bg-[#F4F7FB] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col py-10 md:py-14">
        <div className="max-w-[800px] mx-auto px-6 w-full text-left">
          <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 md:p-10 shadow-2xs flex flex-col gap-6">
            
            {/* Header Success */}
            <div className="flex items-center gap-4 border-b border-[#DCE5F0] pb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                <CheckCircle2 size={26} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Đặt lịch thành công
                  </h1>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#1F63FF] border border-blue-200 font-extrabold text-xs rounded-md">
                    PU-001
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Yêu cầu thu gom đồ giặt của bạn đã được ghi nhận.
                </p>
              </div>
            </div>

            {/* Shipper info box */}
            <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
              <User size={18} className="text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-emerald-900">Nhân viên Nguyễn Minh dự kiến đến trong 30 phút.</span>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Vui lòng chuẩn bị sẵn quần áo đã phân loại để giao cho shipper.
                </span>
              </div>
            </div>

            {/* Confirmation summary details */}
            <div className="flex flex-col gap-3.5 text-xs text-slate-700 border-b border-[#DCE5F0] pb-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-[#DCE5F0] gap-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Thời gian lấy đồ</span>
                <span className="font-extrabold text-slate-900">{confirmedDetails.dateLabel} · Khung giờ {confirmedDetails.timeSlot}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-[#DCE5F0] gap-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Địa chỉ thu gom</span>
                <span className="font-bold text-slate-900">{confirmedDetails.address}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-[#DCE5F0] gap-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Gói dịch vụ & Số kiện</span>
                <span className="font-bold text-slate-900">{confirmedDetails.servicePackage} · {confirmedDetails.bagCount} kiện</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/customer/orders')}
                className="group flex-1 py-3.5 bg-[#1F63FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-0 shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Theo dõi yêu cầu</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border-0"
              >
                Đặt lịch khác
              </button>

              <button
                type="button"
                onClick={() => navigate('/customer')}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border-0"
              >
                Về trang chủ
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // NORMAL BOOKING FORM RENDER (Full-Width #F4F7FB Background, 2 Columns Desktop)
  return (
    <div className="w-full bg-[#F4F7FB] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col pb-16">
      <style>{`
        .reveal-hidden {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          .reveal-hidden {
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .reveal-hidden.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .stagger-1 { transition-delay: 80ms; }
          .stagger-2 { transition-delay: 160ms; }
          .stagger-3 { transition-delay: 180ms; }
        }
      `}</style>

      {/* HEADER SECTION */}
      <section className="w-full py-6 md:py-8 bg-white border-b border-[#DCE5F0]">
        <div className="max-w-[1380px] mx-auto px-6 md:px-12 flex flex-col text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Đặt lịch lấy đồ tận nơi
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Chọn thời gian và địa chỉ, nhân viên DUDI sẽ đến thu gom tận nhà cho bạn.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT 2 COLUMNS (Desktop: Left ~38% Visual Panel, Right ~62% Booking Form) */}
      <main className="w-full py-8 flex-grow">
        <div className="max-w-[1380px] mx-auto px-6 md:px-12 w-full text-left">
          
          {branchParam && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start text-xs text-blue-900">
              <MapPin size={16} className="text-[#1F63FF] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold uppercase tracking-wider text-[10px] text-blue-500">Chi nhánh tiếp nhận dự kiến</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {branchParam === 'q1' && 'DUDI Quận 1 — 123 Nguyễn Huệ, Quận 1, TP.HCM'}
                  {branchParam === 'q3' && 'DUDI Quận 3 — 456 Võ Văn Tần, Quận 3, TP.HCM'}
                  {branchParam === 'thu_duc' && 'DUDI Thủ Đức — 789 Võ Văn Ngân, Thủ Đức, TP.HCM'}
                  {!['q1', 'q3', 'thu_duc'].includes(branchParam) && 'Chi nhánh gần bạn nhất'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN (~38% / lg:col-span-5): Sticky Visual Panel */}
            <aside className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-6 reveal-hidden">
              <div className="group relative w-full h-[220px] lg:h-[420px] rounded-2xl overflow-hidden border border-[#DCE5F0] bg-slate-900 shadow-2xs">
                <img
                  src="/images/customer/pic2.jpg"
                  alt="DUDI Pickup Service"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-left">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold mb-1">
                    DUDI PICKUP
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    DUDI đến tận nơi.
                  </h2>
                  <p className="text-xs md:text-sm text-slate-200 font-medium mt-2 max-w-xs leading-relaxed">
                    Chọn thời gian, chúng tôi đến lấy và giao lại khi hoàn tất.
                  </p>
                </div>
              </div>

              {/* 3 Bullet points below visual */}
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-700 bg-white p-4 rounded-xl border border-[#DCE5F0] text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#1F63FF] font-bold">✓</span>
                  <span className="text-slate-800 text-[11px]">Lấy tận nơi</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-[#DCE5F0] px-2">
                  <span className="text-[#1F63FF] font-bold">✓</span>
                  <span className="text-slate-800 text-[11px]">Theo dõi trực tuyến</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#1F63FF] font-bold">✓</span>
                  <span className="text-slate-800 text-[11px]">Hỗ trợ qua Zalo</span>
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN (~62% / lg:col-span-7): Booking Form (White Surface, No Huge Card Envelope) */}
            <section className="lg:col-span-7 bg-white p-6 md:p-10 rounded-2xl border border-[#DCE5F0] shadow-2xs text-left reveal-hidden stagger-1">
              
              <form onSubmit={handleConfirm} className="flex flex-col">

                {/* 01 — THÔNG TIN LẤY ĐỒ */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-[#DCE5F0] pb-2 flex items-center gap-2">
                    <span className="text-[#1F63FF]">01</span> — THÔNG TIN LẤY ĐỒ
                  </h3>

                  {/* SĐT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">
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
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 ${
                        errors.phone
                          ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-[#DCE5F0] focus:border-[#1F63FF] focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-500 font-semibold">{errors.phone}</span>
                    )}
                  </div>

                  {/* Địa chỉ */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <label className="text-xs font-bold text-slate-700">
                        Địa chỉ lấy đồ tận nơi <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Quick Address buttons */}
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickAddress('home')}
                          className="px-2.5 py-1 bg-[#F7FAFF] hover:bg-blue-50 text-slate-700 hover:text-[#1F63FF] border border-[#DCE5F0] rounded-md text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Home size={11} />
                          Nhà riêng
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddress('work')}
                          className="px-2.5 py-1 bg-[#F7FAFF] hover:bg-blue-50 text-slate-700 hover:text-[#1F63FF] border border-[#DCE5F0] rounded-md text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Briefcase size={11} />
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
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-none ${
                        errors.address
                          ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-[#DCE5F0] focus:border-[#1F63FF] focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.address && (
                      <span className="text-[11px] text-red-500 font-semibold">{errors.address}</span>
                    )}
                  </div>
                </div>

                {/* 02 — THỜI GIAN */}
                <div className="flex flex-col gap-4 mt-8">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-[#DCE5F0] pb-2 flex items-center gap-2">
                    <span className="text-[#1F63FF]">02</span> — THỜI GIAN
                  </h3>

                  {/* Day Picker */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">
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
                            className={`py-2.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#1F63FF] text-white border-[#1F63FF] shadow-2xs'
                                : 'bg-white hover:bg-[#EEF4FF] text-slate-700 border-[#DCE5F0]'
                            }`}
                          >
                            {labels[type]}
                          </button>
                        );
                      })}
                    </div>

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
                        className={`w-full mt-2 px-4 py-2.5 bg-white border rounded-lg text-slate-900 text-xs font-medium outline-none ${
                          errors.date ? 'border-red-400' : 'border-[#DCE5F0] focus:border-[#1F63FF]'
                        }`}
                      />
                    )}
                    {errors.date && dateType === 'other' && (
                      <span className="text-[11px] text-red-500 font-semibold">{errors.date}</span>
                    )}
                  </div>

                  {/* Time Slot Picker */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      Khung giờ shipper đến lấy <span className="text-red-500">*</span>
                    </label>

                    <div id="timeSlot-input" className="grid grid-cols-2 gap-2.5 select-none">
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
                            className={`py-2.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#1F63FF] text-white border-[#1F63FF] shadow-2xs'
                                : 'bg-white hover:bg-[#EEF4FF] text-slate-700 border-[#DCE5F0]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {errors.timeSlot && (
                      <span className="text-[11px] text-red-500 font-semibold">{errors.timeSlot}</span>
                    )}
                  </div>
                </div>

                {/* 03 — DỊCH VỤ (Service Rows Layout, No 3 Big Cards) */}
                <div className="flex flex-col gap-3 mt-8">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-[#DCE5F0] pb-2 flex items-center gap-2">
                    <span className="text-[#1F63FF]">03</span> — DỊCH VỤ
                  </h3>

                  <div id="servicePackage-input" className="flex flex-col gap-2.5">
                    {[
                      { key: 'fast', title: 'Giặt sấy lấy nhanh', desc: 'Hoàn tất trong 4–6 giờ' },
                      { key: 'eco', title: 'Giặt tiết kiệm', desc: 'Giao trả sau 24 giờ · Tối ưu chi phí' },
                      { key: 'premium', title: 'Giặt hấp cao cấp', desc: 'Vest, đầm và đồ cần chăm sóc đặc biệt' }
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
                          className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'bg-[#EEF4FF] border-[#1F63FF] border-l-4 border-l-[#1F63FF]'
                              : 'bg-white border-[#DCE5F0] hover:bg-[#F7FAFF]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#1F63FF] bg-[#1F63FF]' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-extrabold ${isSelected ? 'text-[#1F63FF]' : 'text-slate-900'}`}>
                                {pkg.title}
                              </span>
                              <span className="text-xs text-slate-500 font-medium mt-0.5">
                                {pkg.desc}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.servicePackage && (
                    <span className="text-[11px] text-red-500 font-semibold">{errors.servicePackage}</span>
                  )}
                </div>

                {/* 04 — GHI CHÚ */}
                <div className="flex flex-col gap-4 mt-8">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-[#DCE5F0] pb-2 flex items-center gap-2">
                    <span className="text-[#1F63FF]">04</span> — GHI CHÚ
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">
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
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm font-medium outline-none ${
                          errors.bagCount ? 'border-red-400' : 'border-[#DCE5F0] focus:border-[#1F63FF]'
                        }`}
                      />
                      {errors.bagCount && (
                        <span className="text-[11px] text-red-500 font-semibold">{errors.bagCount}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Ghi chú cho nhân viên lấy đồ
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Gọi điện trước khi đến..."
                        value={shipperNote}
                        onChange={(e) => setShipperNote(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#DCE5F0] focus:border-[#1F63FF] rounded-xl text-slate-900 text-sm font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. REALTIME BOOKING SUMMARY (#EEF4FF Surface) */}
                <div className="mt-8 bg-[#EEF4FF] p-5 rounded-xl border border-[#DCE5F0] flex flex-col gap-2.5 text-xs text-slate-700">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-[#DCE5F0] pb-2">
                    TÓM TẮT LỊCH LẤY
                  </h4>

                  <div className="flex justify-between py-1 border-b border-[#DCE5F0]/80">
                    <span className="text-slate-500 font-medium">Lấy đồ</span>
                    <span className="font-extrabold text-slate-900">
                      {getDateDisplay()} · {timeSlot || 'Chưa chọn'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#DCE5F0]/80">
                    <span className="text-slate-500 font-medium">Dịch vụ</span>
                    <span className="font-extrabold text-[#1F63FF]">
                      {servicePackage || 'Chưa chọn'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#DCE5F0]/80">
                    <span className="text-slate-500 font-medium">Số kiện</span>
                    <span className="font-extrabold text-slate-900">
                      {bagCount || '1'} kiện
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Địa chỉ</span>
                    <span className="font-bold text-slate-900 text-right max-w-xs truncate">
                      {address || 'Chưa nhập địa chỉ'}
                    </span>
                  </div>
                </div>

                {/* 5. BOTTOM ACTION & SUBMIT BUTTON */}
                <div className="mt-6 flex flex-col gap-3">
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Info size={14} className="text-[#1F63FF] shrink-0" />
                    <span>Nhân viên sẽ cân đồ và xác nhận giá khi tiếp nhận.</span>
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group w-full py-4 text-white font-bold text-sm rounded-xl transition-all shadow-2xs border-0 flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-[#1F63FF] hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <span>XÁC NHẬN ĐẶT LỊCH</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </section>

          </div>
        </div>
      </main>

    </div>
  );
}
