import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Search,
  Check,
  HelpCircle,
  Truck,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MockOrder {
  id: string;
  createdAt: string;
  amount: string;
  paymentStatus: string;
  eta: string;
  services: string[];
  weight: string;
  stepIndex: number;
  customer: string;
  careNotes: string;
  branch: {
    id: string;
    name: string;
    address: string;
    hotline: string;
  };
  logs: { time: string; text: string }[];
}

const MOCK_ORDERS: Record<string, MockOrder> = {
  'DUDI-125': {
    id: 'DUDI-125',
    createdAt: '20/07/2026 08:30',
    amount: '210.000đ',
    paymentStatus: 'Đã thanh toán (MOMO)',
    eta: '18:00 hôm nay',
    services: ['Giặt sấy tiêu chuẩn', 'Vệ sinh giày sneaker'],
    weight: '5.2 kg + 1 đôi giày',
    stepIndex: 2,
    customer: 'Nguyễn Văn An',
    careNotes: 'Giày không dùng chất tẩy mạnh, giặt riêng tất trắng.',
    branch: {
      id: 'q1',
      name: 'DUDI Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      hotline: '0901 123 456'
    },
    logs: [
      { time: 'Hiện tại', text: 'Đang tiến hành giặt sấy theo tiêu chuẩn.' },
      { time: '10:10', text: 'Bắt đầu chu trình giặt.' },
      { time: '09:35', text: 'Đã phân loại quần áo.' },
      { time: '09:20', text: 'Đã nhận đồ tại DUDI Quận 1.' }
    ]
  },
  'DUDI-123': {
    id: 'DUDI-123',
    createdAt: '15/07/2026 09:00',
    amount: '150.000đ',
    paymentStatus: 'Chưa thanh toán (Tiền mặt)',
    eta: 'Đã hoàn thành',
    services: ['Giặt sấy nhanh'],
    weight: '3 kg',
    stepIndex: 5,
    customer: 'Nguyễn Văn An',
    careNotes: 'Không có ghi chú đặc biệt.',
    branch: {
      id: 'q1',
      name: 'DUDI Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      hotline: '0901 123 456'
    },
    logs: [
      { time: '17:30 15/07', text: 'Đã giao trả đồ cho khách hàng thành công.' },
      { time: '16:00 15/07', text: 'Đơn hàng đã được đóng gói và sẵn sàng giao trả.' },
      { time: '14:30 15/07', text: 'Đang sấy và ủi phẳng.' },
      { time: '10:15 15/07', text: 'Bắt đầu giặt.' },
      { time: '09:30 15/07', text: 'Hoàn tất phân loại.' },
      { time: '09:15 15/07', text: 'Cửa hàng đã nhận đồ.' }
    ]
  }
};

const JOURNEY_STEPS = [
  { num: '01', label: 'Nhận đồ', subText: 'Đã tiếp nhận' },
  { num: '02', label: 'Phân loại', subText: 'Đã kiểm tra' },
  { num: '03', label: 'Giặt', subText: 'Đang xử lý' },
  { num: '04', label: 'Sấy / Ủi', subText: 'Chờ sấy' },
  { num: '05', label: 'Đóng gói', subText: 'Chờ đóng gói' },
  { num: '06', label: 'Giao trả', subText: 'Đã giao' }
];

export default function CustomerTrack() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State Management
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<MockOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastSearchedKey, setLastSearchedKey] = useState('');

  const isDemoEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_ACCESS === 'true';

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
  }, [isLoading, searched, result]);

  // Sync query from URL param
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      const cleanParam = orderIdParam.trim();
      setQuery(cleanParam);
      triggerMockSearch(cleanParam);
    } else {
      setQuery('');
      setSearched(false);
      setResult(null);
    }
  }, [searchParams]);

  const triggerMockSearch = (searchKey: string) => {
    setValidationError(null);
    setSearchError(null);
    setIsLoading(true);
    setSearched(true);
    setLastSearchedKey(searchKey);

    setTimeout(() => {
      const normalized = searchKey.trim().toLowerCase().replace(/\s+/g, '');

      if (!normalized) {
        setIsLoading(false);
        setResult(null);
        setValidationError('Vui lòng nhập số điện thoại hoặc mã đơn hàng!');
        return;
      }

      if (normalized === 'err' || normalized === 'error') {
        setIsLoading(false);
        setResult(null);
        setSearchError('Hệ thống mất kết nối tạm thời với máy chủ tra cứu. Vui lòng kiểm tra internet và thử lại.');
        return;
      }

      if (
        normalized === 'dudi-125' ||
        normalized === 'dudi125' ||
        normalized === '125' ||
        normalized === '0901234567'
      ) {
        setResult(MOCK_ORDERS['DUDI-125']);
      } else if (normalized === 'dudi-123' || normalized === 'dudi123' || normalized === '123') {
        setResult(MOCK_ORDERS['DUDI-123']);
      } else {
        setResult(null);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = query.trim();

    if (!val) {
      setValidationError('Vui lòng nhập số điện thoại hoặc mã đơn hàng!');
      return;
    }

    let processedVal = val;
    if (/[a-zA-Z]/.test(val)) {
      processedVal = val.toUpperCase();
      setQuery(processedVal);
    }

    triggerMockSearch(processedVal);
  };

  const applyDemo = (demoKey: string) => {
    setQuery(demoKey);
    triggerMockSearch(demoKey);
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setResult(null);
    setValidationError(null);
    setSearchError(null);
    navigate('/customer/track', { replace: true });
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
      `}</style>

      {/* 1. KHU TRA CỨU MỚI (Seamless on #F5F7FA background) */}
      <section className="w-full py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col text-left">
          <h1 className="text-3xl md:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Theo dõi đơn giặt
          </h1>
          <p className="text-slate-600 text-sm md:text-base font-normal mt-1.5 max-w-xl">
            Xem trạng thái xử lý và thời gian hoàn tất đơn hàng của bạn.
          </p>

          {/* Search bar: white surface floating on light background */}
          <div className="w-full max-w-2xl mt-5">
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Nhập số điện thoại hoặc mã đơn..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`w-full bg-white border ${
                    validationError
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  } text-slate-900 text-base font-medium rounded-xl px-4 py-3.5 shadow-2xs outline-none transition-all placeholder:text-slate-400`}
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 whitespace-nowrap border-0 flex items-center justify-center gap-2"
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

            {/* DEMO items: clean, visible in DEV or VITE_ENABLE_DEMO_ACCESS=true */}
            {isDemoEnabled && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-400">Dùng dữ liệu mẫu:</span>
                <button
                  type="button"
                  onClick={() => applyDemo('0901234567')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  0901234567
                </button>
                <button
                  type="button"
                  onClick={() => applyDemo('DUDI-125')}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-semibold border border-slate-200 hover:border-blue-300 rounded-lg shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  DUDI-125 · Đang xử lý
                </button>
                <button
                  type="button"
                  onClick={() => applyDemo('DUDI-123')}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold border border-slate-200 hover:border-emerald-300 rounded-lg shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  DUDI-123 · Hoàn thành
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <section className="w-full py-10 flex-grow">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 animate-pulse flex flex-col gap-6">
            <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="h-44 bg-slate-200 rounded-xl"></div>
              <div className="h-44 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </section>
      )}

      {/* 2. KHI CHƯA TRA CỨU (Thin process rail preview under 150px) */}
      {!isLoading && !searched && !searchError && (
        <section className="w-full py-4 flex-grow flex flex-col justify-start">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full text-left">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Quy trình DUDI
            </h2>

            {/* Slim process rail */}
            <div className="w-full flex items-center justify-between overflow-x-auto pb-3 gap-2 hide-scrollbar select-none text-xs font-semibold text-slate-600">
              {JOURNEY_STEPS.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="flex items-center gap-1.5 shrink-0 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold">{step.num}</span>
                    <span className="text-slate-800 font-medium">{step.label}</span>
                  </div>
                  {idx < JOURNEY_STEPS.length - 1 && (
                    <span className="text-slate-300 font-normal shrink-0">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Direct CTA link to view sample order */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => applyDemo('DUDI-125')}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer p-0"
              >
                <span>Xem thử đơn DUDI-125</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. KHI TRA THÀNH CÔNG (Order details & process) */}
      {!isLoading && searched && result && (
        <div className="w-full flex flex-col">
          
          {/* SECTION 1: White background for Header & Progress Rail */}
          <section className="w-full bg-white border-y border-slate-200/80 shadow-2xs py-8">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-8">

              {/* Order Header (DUDI Accent, Order code focus, status & completion time) */}
              <div className="reveal-hidden relative pl-4 md:pl-6 border-l-4 border-blue-600 flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl md:text-[38px] font-black text-slate-900 tracking-tight leading-none">
                      {result.id}
                    </h2>
                    {/* Status dot + text */}
                    {result.stepIndex === 5 ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 ml-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 ml-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        Đang giặt
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {result.stepIndex === 5
                      ? 'Đơn hàng đã được giao trả thành công'
                      : 'Cập nhật vài giây trước'}
                  </p>
                </div>

                <div className="flex flex-col md:items-end">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {result.stepIndex === 5 ? 'Hoàn tất lúc' : 'Dự kiến hoàn tất'}
                  </span>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    {result.stepIndex === 5 ? (
                      <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                        17:30 · 15/07
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                          18:00
                        </span>
                        <span className="text-sm font-semibold text-slate-600">
                          hôm nay
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Rail (Thicker line, active glow & step subtext) */}
              <div className="reveal-hidden stagger-1 w-full pt-2 pb-1 text-left">
                <div className="relative w-full">
                  {/* Desktop connector line */}
                  <div className="hidden md:block absolute top-[13px] left-[3%] right-[3%] h-[4px] bg-slate-300 rounded-full z-0"></div>
                  <div
                    className="hidden md:block absolute top-[13px] left-[3%] h-[4px] bg-blue-600 rounded-full z-10 transition-all duration-1000 ease-out"
                    style={{ width: `${(result.stepIndex / 5) * 94}%` }}
                  ></div>

                  {/* Steps flex row */}
                  <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 relative z-20">
                    {JOURNEY_STEPS.map((step, idx) => {
                      const isCompleted = idx < result.stepIndex;
                      const isActive = idx === result.stepIndex;

                      return (
                        <div key={step.num} className="flex md:flex-col items-center md:items-center gap-3 md:gap-2 flex-1">
                          {/* Marker */}
                          <div className="relative flex items-center justify-center shrink-0">
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                                <Check size={14} className="stroke-[3]" />
                              </div>
                            ) : isActive ? (
                              <div className="relative flex items-center justify-center">
                                <div className="absolute w-8 h-8 rounded-full bg-blue-100/80 animate-pulse"></div>
                                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-100/80 shadow-2xs z-10"></div>
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                            )}
                          </div>

                          {/* Label & subtext */}
                          <div className="flex flex-col md:items-center text-left md:text-center">
                            <span
                              className={`text-xs uppercase tracking-wide transition-colors ${
                                isActive
                                  ? 'font-bold text-blue-600'
                                  : isCompleted
                                  ? 'font-semibold text-slate-900'
                                  : 'font-semibold text-slate-500'
                              }`}
                            >
                              {step.label}
                            </span>
                            {isActive && (
                              <span className="text-[11px] font-semibold text-blue-600 block mt-0.5">
                                {result.stepIndex === 5 ? 'Đã giao' : step.subText}
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

          {/* SECTION 2: Dải thông tin mỏng (Info Strip) giữa Progress và Activity */}
          <section className="w-full bg-blue-50/70 border-b border-blue-100/80 py-3.5">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-950">
                <Sparkles size={16} className="text-blue-600 shrink-0" />
                <span>
                  {result.stepIndex === 5
                    ? `Đơn hàng đã hoàn tất tại ${result.branch.name}`
                    : `Quần áo của bạn đang được xử lý tại ${result.branch.name}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/customer/support?orderId=${result.id}`)}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-transparent border-0 cursor-pointer p-0"
              >
                <span>Hỗ trợ nhanh qua Zalo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </section>

          {/* SECTION 3: Nền #F4F7FB cho Activity Feed & Thông tin đơn */}
          <section className="w-full bg-[#F4F7FB] py-8 flex-grow">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 text-left">

              {/* Trái 65%: Activity Feed */}
              <div className="lg:col-span-7 flex flex-col reveal-hidden stagger-2">
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-5">
                  Cập nhật đơn hàng
                </h3>

                <div className="relative pl-7 border-l-2 border-slate-300 flex flex-col gap-6">
                  {result.logs.map((log, i) => {
                    const isLatest = i === 0;
                    return (
                      <div key={i} className="relative flex flex-col gap-0.5">
                        {/* Node dot on vertical line */}
                        <div
                          className={`absolute ${
                            isLatest
                              ? '-left-[35px] top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100 border-2 border-white'
                              : '-left-[33px] top-1 w-3 h-3 rounded-full bg-slate-400 border-2 border-white'
                          }`}
                        ></div>

                        <span
                          className={`text-xs uppercase tracking-wider font-bold ${
                            isLatest ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        >
                          {log.time}
                        </span>

                        <span
                          className={`text-sm ${
                            isLatest ? 'font-bold text-slate-900 text-base' : 'font-medium text-slate-700'
                          }`}
                        >
                          {log.text}
                        </span>

                        {isLatest && result.stepIndex < 5 && (
                          <span className="text-xs text-slate-500 font-medium italic mt-0.5 block">
                            Máy giặt số 03 · Chu trình tiêu chuẩn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phải 35%: Thông tin đơn (Categorized list with dividers, CTAs at bottom) */}
              <div className="lg:col-span-5 flex flex-col justify-between reveal-hidden stagger-3">
                <div className="flex flex-col gap-6">
                  {/* Category 1: THÔNG TIN ĐƠN */}
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Thông tin đơn
                    </h3>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/80">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Khách hàng</span>
                      <span className="text-sm font-bold text-slate-900">{result.customer}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/80">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dịch vụ</span>
                      <span className="text-sm font-bold text-slate-900 text-right max-w-[200px]">
                        {result.services.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/80">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Khối lượng</span>
                      <span className="text-sm font-bold text-slate-900">{result.weight}</span>
                    </div>
                  </div>

                  {/* Category 2: THANH TOÁN */}
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Thanh toán
                    </h3>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/80">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng tiền</span>
                      <span className="text-base font-extrabold text-slate-900">{result.amount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/80">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Trạng thái</span>
                      <span className={`text-xs font-bold ${result.paymentStatus.includes('Đã thanh') ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {result.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Category 3: CHI NHÁNH XỬ LÝ */}
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Chi nhánh xử lý
                    </h3>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200/80">
                      <span className="text-sm font-bold text-slate-900">{result.branch.name}</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/customer/support?orderId=${result.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer p-0"
                      >
                        <span>Xem chi nhánh</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTA buttons at bottom of order info column */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => navigate(`/customer/support?orderId=${result.id}`)}
                    className="w-full sm:flex-1 px-4 py-3 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 group hover:-translate-y-0.5 shadow-2xs"
                  >
                    <HelpCircle size={16} className="text-slate-500 group-hover:scale-110 transition-transform" />
                    <span>Hỗ trợ / Zalo</span>
                  </button>
                  <button
                    onClick={() => navigate('/customer/pickup')}
                    className="w-full sm:flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer text-center border-0 shadow-2xs flex items-center justify-center gap-2 group hover:-translate-y-0.5"
                  >
                    <Truck size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Đặt lịch mới</span>
                  </button>
                </div>
              </div>

            </div>
          </section>
        </div>
      )}

      {/* Error state */}
      {!isLoading && searchError && (
        <section className="w-full py-16 flex-grow flex flex-col justify-center">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-4 w-full">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h2 className="text-lg font-bold text-slate-900">Lỗi kết nối tra cứu</h2>
              <p className="text-slate-600 text-sm">{searchError}</p>
            </div>
            <button
              onClick={() => triggerMockSearch(lastSearchedKey)}
              className="mt-2 px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors cursor-pointer border-0"
            >
              Thử lại ngay
            </button>
          </div>
        </section>
      )}

      {/* Not found state */}
      {!isLoading && searched && !result && !searchError && (
        <section className="w-full py-16 flex-grow flex flex-col justify-center">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-4 w-full">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <Search size={24} />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h2 className="text-lg font-bold text-slate-900">Không tìm thấy đơn hàng</h2>
              <p className="text-slate-600 text-sm">
                Rất tiếc, không tìm thấy đơn hàng nào khớp với{' '}
                <strong className="text-slate-900">"{lastSearchedKey}"</strong>. Vui lòng kiểm tra lại.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleClear}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors cursor-pointer border-0"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate('/customer/support')}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
