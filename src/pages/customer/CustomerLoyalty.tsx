import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  AlertCircle,
  ArrowRight,
  Gift,
  History,
  Shield
} from 'lucide-react';
import { useToast } from '../../components/common';

interface MockMember {
  phone: string;
  name: string;
  code: string;
  points: number;
  tier: string;
  nextTier: string;
  pointsNeededForNext: number;
  pointsLimitForNext: number;
  privileges: string[];
  vouchers: {
    id: string;
    title: string;
    description: string;
    points: number;
    code: string;
  }[];
  history: {
    id: string;
    description: string;
    points: number;
    date: string;
    type: 'add' | 'subtract';
  }[];
}

const mockMemberData: MockMember = {
  phone: '0901234567',
  name: 'Nguyễn Văn An',
  code: 'DUDI-MB-001',
  points: 320,
  tier: 'Bạc',
  nextTier: 'Vàng',
  pointsNeededForNext: 180,
  pointsLimitForNext: 500,
  privileges: [
    'Giảm 3% cho đơn từ 100.000đ',
    'Ưu tiên xử lý đơn giặt gấp',
    'Nhận thông báo Zalo khi đơn hoàn tất'
  ],
  vouchers: [
    {
      id: 'v1',
      title: 'Voucher giảm 20k',
      description: 'Áp dụng cho đơn từ 100k',
      points: 200,
      code: 'DUDI20K'
    },
    {
      id: 'v2',
      title: 'Miễn phí vệ sinh giày',
      description: 'Chăm sóc và khử mùi chuyên sâu',
      points: 500,
      code: 'DUDISHOES'
    },
    {
      id: 'v3',
      title: 'Voucher giảm 10%',
      description: 'Áp dụng cho đơn hàng tiếp theo',
      points: 300,
      code: 'DUDI10PCT'
    }
  ],
  history: [
    {
      id: 'h1',
      description: 'Nhận điểm tích lũy từ đơn hàng DUDI-123',
      points: 15,
      date: '15/07/2026',
      type: 'add'
    },
    {
      id: 'h2',
      description: 'Đổi điểm nhận voucher giảm 20k',
      points: -200,
      date: '14/07/2026',
      type: 'subtract'
    },
    {
      id: 'h3',
      description: 'Nhận điểm tích lũy từ đơn hàng DUDI-098',
      points: 30,
      date: '12/07/2026',
      type: 'add'
    }
  ]
};

const LOYALTY_STEPS = [
  { num: '01', label: 'Giặt đồ' },
  { num: '02', label: 'Hoàn thành đơn' },
  { num: '03', label: 'Nhận điểm' },
  { num: '04', label: 'Lên hạng' },
  { num: '05', label: 'Nhận ưu đãi' }
];

export default function CustomerLoyalty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [member, setMember] = useState<MockMember | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [displayNeeded, setDisplayNeeded] = useState(0);

  const isDemoEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_ACCESS === 'true';

  // IntersectionObserver for scroll animations (re-triggers on scroll in/out without unobserving)
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
  }, [searched, member]);

  // Count-up animation for points & needed points when member is active
  useEffect(() => {
    if (!member) {
      setDisplayPoints(0);
      setDisplayNeeded(0);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisplayPoints(member.points);
      setDisplayNeeded(member.pointsNeededForNext);
      return;
    }

    const endPoints = member.points;
    const endNeeded = member.pointsNeededForNext;
    const duration = 800; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const easedProgress = 1 - Math.pow(1 - progress, 2);

      setDisplayPoints(Math.floor(easedProgress * endPoints));
      setDisplayNeeded(Math.floor(easedProgress * endNeeded));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayPoints(endPoints);
        setDisplayNeeded(endNeeded);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [member, searched]);

  const triggerSearch = (searchPhone: string) => {
    const cleanedQuery = searchPhone.trim();

    if (!cleanedQuery) {
      setValidationError('Vui lòng nhập số điện thoại để tra cứu!');
      setSearched(false);
      setMember(null);
      return;
    }

    if (!/^\d+$/.test(cleanedQuery)) {
      setValidationError('Số điện thoại chỉ được chứa các chữ số!');
      setSearched(false);
      setMember(null);
      return;
    }

    if (cleanedQuery.length < 9 || cleanedQuery.length > 11) {
      setValidationError('Số điện thoại phải từ 9 đến 11 chữ số!');
      setSearched(false);
      setMember(null);
      return;
    }

    setValidationError(null);
    setSearched(true);

    if (cleanedQuery === '0901234567') {
      setMember(mockMemberData);
    } else {
      setMember(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setMember(null);
    setValidationError(null);
  };

  const handleRedeem = (voucherTitle: string, pointsNeeded: number, promoCode: string) => {
    toast(`Đổi thành công: ${voucherTitle} (dùng ${pointsNeeded} điểm). Mã: ${promoCode}`, 'success');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] text-slate-800 bg-[#F5F7FA]">
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
          .stagger-1 { transition-delay: 60ms; }
          .stagger-2 { transition-delay: 120ms; }
          .stagger-3 { transition-delay: 180ms; }
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 22s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            transform: none;
          }
        }
      `}</style>

      {/* 1. KHU TRA CỨU (Thu gọn 20-25% chiều cao, seamless background) */}
      <section className="w-full py-6 md:py-8">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col text-left">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ví điểm DUDI
            </h1>
            {/* Laundry Care Instruction Symbols (Subtle Brand Texture Accent) */}
            <div className="hidden sm:flex items-center gap-3 text-slate-300 select-none">
              <svg className="w-5 h-5 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                <path d="M4 6h16l-1.5 12a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L4 6z" />
                <path d="M4 6c3 0 4 2 8 2s5-2 8-2" />
                <circle cx="9" cy="13" r="1" fill="currentColor" />
                <circle cx="12" cy="15" r="1" fill="currentColor" />
                <circle cx="15" cy="13" r="1" fill="currentColor" />
              </svg>
              <svg className="w-5 h-5 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                <path d="M3 12h18" />
                <path d="M12 3v18" />
                <path d="m4.93 4.93 14.14 14.14" />
                <path d="m4.93 19.07 14.14-14.14" />
              </svg>
              <span className="text-[10px] font-mono tracking-widest text-slate-400">CARE-CERTIFIED</span>
            </div>
          </div>

          {/* Search bar + Demo shortcut */}
          <div className="w-full max-w-2xl mt-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Nhập số điện thoại..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full bg-white border ${
                    validationError
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-300 focus:border-[#1F63FF] focus:ring-2 focus:ring-blue-100'
                  } text-slate-900 text-sm font-medium rounded-xl px-4 py-3 shadow-2xs outline-none transition-all placeholder:text-slate-400`}
                />
                {searched && query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer border-0 bg-transparent"
                    title="Xóa"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1F63FF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 whitespace-nowrap border-0 flex items-center justify-center gap-2"
              >
                <Search size={16} />
                <span>Tra cứu</span>
              </button>
            </form>

            {validationError && (
              <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5 mt-2">
                <AlertCircle size={14} />
                {validationError}
              </p>
            )}

            {/* DEMO items: visible in DEV or VITE_ENABLE_DEMO_ACCESS=true */}
            {isDemoEnabled && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-400">Dữ liệu demo:</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('0901234567');
                    triggerSearch('0901234567');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-semibold border border-slate-200 hover:border-blue-300 rounded-lg shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  0901234567 · Nguyễn Văn An
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. KHI CHƯA TRA CỨU (Unsearched State with 1-Line Journey Rail) */}
      {!searched && (
        <section className="w-full py-4 flex-grow flex flex-col justify-start">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full text-left">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Cách tích điểm tại DUDI
            </h2>

            {/* Slim 1-line process rail */}
            <div className="w-full flex items-center justify-between overflow-x-auto pb-3 gap-2 hide-scrollbar select-none text-xs font-semibold text-slate-600 border-b border-dashed border-slate-300">
              {LOYALTY_STEPS.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="flex items-center gap-1.5 shrink-0 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold">{step.num}</span>
                    <span className="text-slate-800 font-medium">{step.label}</span>
                  </div>
                  {idx < LOYALTY_STEPS.length - 1 && (
                    <span className="text-slate-300 font-normal shrink-0">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs text-slate-500 font-normal mt-3">
              Tra cứu số điện thoại để xem điểm, hạng thành viên và ưu đãi hiện có.
            </p>
          </div>
        </section>
      )}

      {/* 3. KHI TRA THÀNH CÔNG (MEMBER MASTHEAD & EDITORIAL SECTIONS) */}
      {searched && member && (
        <div className="w-full flex flex-col">

          {/* 2. MEMBER MASTHEAD (Full-Width Asymmetric Desktop Layout with subtle laundry image accent) */}
          <section className="relative w-full bg-white border-y border-slate-200/80 overflow-hidden">
            {/* Subtle Laundry Image Accent on far right (25-30% width) */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[28%] pointer-events-none overflow-hidden z-0">
              <img
                src="/images/customer/wash-fold.jpg"
                alt="DUDI Laundry"
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-white"></div>
            </div>

            <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left reveal-hidden">

              {/* Left Column (~45% / lg:col-span-5): Name, Tier & Massive 320 Points */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
                    {member.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#1F63FF] uppercase tracking-wider">
                    Thành viên {member.tier}
                  </span>
                  <span className="text-slate-300 font-bold">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    Mã: {member.code}
                  </span>
                </div>

                {/* Massive 320 Points typography */}
                <div className="mt-4 flex flex-col">
                  <span className="text-6xl md:text-[88px] font-black text-slate-900 leading-none tracking-tight">
                    {displayPoints}
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-1">
                    ĐIỂM HIỆN CÓ
                  </span>
                </div>
              </div>

              {/* Right Column (~55% / lg:col-span-7): 180 Points to Gold + Long Progress Bar */}
              <div className="lg:col-span-7 flex flex-col justify-center lg:border-l lg:border-slate-200/80 lg:pl-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-slate-900">
                      {displayNeeded}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
                      ĐIỂM NỮA ĐỂ LÊN VÀNG
                    </span>
                  </div>

                  {/* Progress info */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mt-2">
                    <span>Tiến độ: {displayPoints} / {member.pointsLimitForNext}</span>
                    <span className="text-amber-600 font-bold">Target Hạng Vàng ({member.pointsLimitForNext}đ)</span>
                  </div>
                </div>

                {/* Long progress bar in DUDI Blue with Gold target accent */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mt-3 relative">
                  <div
                    className="bg-[#1F63FF] h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(displayPoints / member.pointsLimitForNext) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </section>

          {/* 4. HÀNH TRÌNH HẠNG (Tier Rail with 01 / 02 / 03 faded numbers) */}
          <section className="w-full bg-white border-b border-slate-200/80 py-8">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col text-left reveal-hidden stagger-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Hành trình hạng thành viên
              </h3>

              <div className="relative w-full py-2">
                {/* Continuous connector line */}
                <div className="absolute top-[38px] left-[5%] right-[5%] h-[3px] bg-slate-300 rounded-full z-0"></div>
                <div
                  className="absolute top-[38px] left-[5%] h-[3px] bg-[#1F63FF] rounded-full z-10 transition-all duration-1000 ease-out"
                  style={{ width: `${(displayPoints / member.pointsLimitForNext) * 45}%` }}
                ></div>

                <div className="flex justify-between items-start relative z-20">
                  {/* Tier 01: Thành viên */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg md:text-2xl font-black text-slate-300 select-none">01</span>
                    <div className="w-4 h-4 rounded-full bg-[#1F63FF] border-2 border-white my-1"></div>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">THÀNH VIÊN</span>
                  </div>

                  {/* Tier 02: Bạc (Active - Highlighted DUDI Blue) */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg md:text-2xl font-black text-[#1F63FF] select-none">02</span>
                    <div className="w-5 h-5 rounded-full bg-[#1F63FF] border-2 border-white ring-4 ring-blue-100 shadow-2xs my-0.5"></div>
                    <span className="text-xs font-bold text-[#1F63FF] uppercase tracking-wide">BẠC</span>
                    <span className="text-[10px] font-bold text-[#1F63FF] uppercase tracking-wider">HIỆN TẠI</span>
                  </div>

                  {/* Tier 03: Vàng (Target - Gold Accent) */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg md:text-2xl font-black text-amber-400 select-none">03</span>
                    <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white my-1"></div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">VÀNG</span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">500 ĐIỂM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. DẢI THƯƠNG HIỆU NHỎ (Continuous Brand Marquee Strip) */}
          <section className="w-full bg-[#1F63FF] text-white h-12 overflow-hidden flex items-center justify-center select-none">
            <div className="animate-marquee font-bold text-xs uppercase tracking-widest flex items-center gap-8">
              <span>TÍCH ĐIỂM MỖI LẦN GIẶT</span>
              <span>•</span>
              <span>LÊN HẠNG</span>
              <span>•</span>
              <span>NHẬN QUYỀN LỢI</span>
              <span>•</span>
              <span>TÍCH ĐIỂM MỖI LẦN GIẶT</span>
              <span>•</span>
              <span>LÊN HẠNG</span>
              <span>•</span>
              <span>NHẬN QUYỀN LỢI</span>
              <span>•</span>
              <span>TÍCH ĐIỂM MỖI LẦN GIẶT</span>
              <span>•</span>
              <span>LÊN HẠNG</span>
              <span>•</span>
              <span>NHẬN QUYỀN LỢI</span>
            </div>
          </section>

          {/* 5 & 6. CHIA PHẦN DƯỚI THÀNH 2 KHỐI CÓ NHỊP RÕ */}
          <section className="w-full border-b border-slate-200">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 text-left">

              {/* BÊN TRÁI ~60% (lg:col-span-7): LỊCH SỬ ĐIỂM (Nền trắng, Ledger/Receipt Style) */}
              <div className="lg:col-span-7 bg-white p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200/80 reveal-hidden stagger-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <History size={18} className="text-[#1F63FF]" />
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                      Lịch sử điểm
                    </h3>
                  </div>

                  {/* Ledger Activity list */}
                  <div className="flex flex-col border-t border-slate-200">
                    {member.history.map((log) => {
                      const isAdd = log.type === 'add';
                      return (
                        <div
                          key={log.id}
                          className="flex justify-between items-center py-4 border-b border-slate-200 border-l-2 border-l-[#1F63FF] pl-4 gap-4"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-mono text-slate-400 font-semibold">
                              {log.date}
                            </span>
                            <span className="text-base font-bold text-slate-900">
                              {log.description}
                            </span>
                          </div>
                          <span
                            className={`text-lg font-black shrink-0 ${
                              isAdd ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {isAdd ? `+${log.points}` : `${log.points}`} điểm
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Footer Info Link */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-200">
                  <span className="text-xs font-medium text-slate-500">
                    Điểm được cập nhật sau khi đơn hàng hoàn tất.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/customer/orders')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F63FF] hover:text-blue-800 bg-transparent border-0 cursor-pointer p-0"
                  >
                    <span>Xem lịch sử giặt ủi</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* BÊN PHẢI ~40% (lg:col-span-5): QUYỀN LỢI & ƯU ĐÃI (Nền #F4F7FB) */}
              <div className="lg:col-span-5 bg-[#F4F7FB] p-6 md:p-10 reveal-hidden stagger-3 flex flex-col gap-10">

                {/* 6. QUYỀN LỢI HẠNG BẠC (Editorial list format with 01, 02, 03) */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={18} className="text-[#1F63FF]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Quyền lợi Hạng {member.tier}
                    </h3>
                  </div>

                  <div className="flex flex-col border-t border-slate-300">
                    <div className="py-3.5 border-b border-slate-200/80 flex items-start">
                      <span className="text-xl font-black text-slate-300 mr-3 select-none">01</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 uppercase">GIẢM 3%</span>
                        <span className="text-xs text-slate-500 font-medium">cho đơn từ 100.000đ</span>
                      </div>
                    </div>

                    <div className="py-3.5 border-b border-slate-200/80 flex items-start">
                      <span className="text-xl font-black text-slate-300 mr-3 select-none">02</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 uppercase">ƯU TIÊN</span>
                        <span className="text-xs text-slate-500 font-medium">xử lý đơn giặt gấp</span>
                      </div>
                    </div>

                    <div className="py-3.5 border-b border-slate-200/80 flex items-start">
                      <span className="text-xl font-black text-slate-300 mr-3 select-none">03</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 uppercase">ZALO</span>
                        <span className="text-xs text-slate-500 font-medium">nhận thông báo khi đơn hoàn tất</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. ƯU ĐÃI (Horizontal Reward Strips with Text Action CTA) */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift size={18} className="text-[#1F63FF]" />
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                      Ưu đãi dành cho bạn
                    </h3>
                  </div>

                  <div className="flex flex-col border-t border-slate-300">
                    {member.vouchers.map((voucher) => {
                      const hasEnoughPoints = member.points >= voucher.points;
                      return (
                        <div
                          key={voucher.id}
                          className="group py-4 border-b border-slate-300 flex flex-col gap-2 text-left"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-bold uppercase text-slate-900">
                              {voucher.title}
                            </span>
                            <span className="text-xs font-bold text-[#1F63FF]">
                              {voucher.points} điểm
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-medium">
                            {voucher.description}
                          </p>

                          <div className="pt-1 flex justify-end">
                            {hasEnoughPoints ? (
                              <button
                                type="button"
                                onClick={() => handleRedeem(voucher.title, voucher.points, voucher.code)}
                                className="group inline-flex items-center gap-1 font-bold text-xs text-[#1F63FF] hover:text-blue-800 bg-transparent border-0 cursor-pointer p-0"
                              >
                                <span>Đổi ngay</span>
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 select-none">
                                Chưa đủ điểm
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </section>

        </div>
      )}

      {/* KHÔNG TÌM THẤY SỐ ĐIỆN THOẠI */}
      {searched && !member && (
        <section className="w-full py-16 flex-grow flex flex-col justify-center">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-4 w-full">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <Search size={24} />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h2 className="text-lg font-bold text-slate-900">Không tìm thấy ví điểm</h2>
              <p className="text-slate-600 text-sm">
                Rất tiếc, không tìm thấy ví điểm thành viên nào tương ứng với số điện thoại này. Vui lòng kiểm tra lại.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 px-5 py-2.5 bg-[#1F63FF] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors cursor-pointer border-0"
            >
              Nhập lại
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
