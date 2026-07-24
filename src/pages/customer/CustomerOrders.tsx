import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Search,
  AlertCircle,
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string; // Format: dd/mm/yyyy
  service: string;
  amount: string;
  status: 'COMPLETED' | 'CANCELLED';
  statusLabel: 'Đã hoàn thành' | 'Đã hủy';
  points: number;
  thumbnail: string;
}

const mockOrdersData: MockOrder[] = [
  {
    id: 'DUDI-123',
    createdAt: '15/07/2026',
    service: 'Giặt sấy 5kg · Vệ sinh 1 đôi giày',
    amount: '150.000đ',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    points: 15,
    thumbnail: '/images/customer/wash-fold.jpg'
  },
  {
    id: 'DUDI-098',
    createdAt: '05/07/2026',
    service: 'Giặt sấy 3kg',
    amount: '90.000đ',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    points: 9,
    thumbnail: '/images/customer/shoes-bedding.jpg'
  },
  {
    id: 'DUDI-077',
    createdAt: '22/06/2026',
    service: 'Chăn bông 1 cái',
    amount: '120.000đ',
    status: 'CANCELLED',
    statusLabel: 'Đã hủy',
    points: 0,
    thumbnail: '/images/customer/dry-cleaning.jpg'
  }
];

const HISTORY_INTRO_STEPS = [
  { num: '01', label: 'Dịch vụ đã dùng' },
  { num: '02', label: 'Chi phí đã thanh toán' },
  { num: '03', label: 'Điểm đã tích lũy' },
  { num: '04', label: 'Đặt lại nhanh' },
  { num: '05', label: 'Phản hồi dịch vụ' }
];

export default function CustomerOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Retrieve state from location.state if it exists
  const historyState = location.state as {
    phone?: string;
    searched?: boolean;
    statusFilter?: 'ALL' | 'COMPLETED' | 'CANCELLED';
    timeFilter?: 'ALL' | 'THIS_MONTH' | 'LAST_MONTH';
    scrollY?: number;
  } | null;

  const [query, setQuery] = useState(historyState?.phone || '');
  const [searched, setSearched] = useState(historyState?.searched || false);
  const [hasData, setHasData] = useState(historyState?.phone === '0901234567');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>(historyState?.statusFilter || 'ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_MONTH'>(historyState?.timeFilter || 'ALL');

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
  }, [searched, hasData, statusFilter, timeFilter]);

  useEffect(() => {
    if (historyState && historyState.searched) {
      setTimeout(() => {
        window.scrollTo(0, historyState.scrollY || 0);
      }, 50);
    }
  }, []);

  const triggerSearch = (searchPhone: string) => {
    const cleanedQuery = searchPhone.trim();

    if (!cleanedQuery) {
      setValidationError('Vui lòng nhập số điện thoại để tra cứu!');
      setSearched(false);
      setHasData(false);
      return;
    }

    if (!/^\d+$/.test(cleanedQuery)) {
      setValidationError('Số điện thoại chỉ được chứa các chữ số!');
      setSearched(false);
      setHasData(false);
      return;
    }

    if (cleanedQuery.length < 9 || cleanedQuery.length > 11) {
      setValidationError('Số điện thoại phải từ 9 đến 11 chữ số!');
      setSearched(false);
      setHasData(false);
      return;
    }

    setValidationError(null);
    setSearched(true);

    const isMatch = cleanedQuery === '0901234567';
    setHasData(isMatch);

    // Save to history state immediately
    navigate(location.pathname, {
      replace: true,
      state: {
        phone: cleanedQuery,
        searched: true,
        statusFilter,
        timeFilter,
        scrollY: window.scrollY
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setHasData(false);
    setStatusFilter('ALL');
    setTimeFilter('ALL');
    setValidationError(null);
    navigate(location.pathname, { replace: true, state: null });
  };

  const handleReorder = (orderId: string) => {
    toast(`Đã yêu cầu đặt lại đơn hàng ${orderId} thành công!`, 'success');
  };

  const handleViewDetail = (orderId: string) => {
    const currentState = {
      phone: query,
      searched,
      statusFilter,
      timeFilter,
      scrollY: window.scrollY
    };
    navigate(`/customer/orders/${orderId}`, {
      state: currentState
    });
  };

  const updateStatusFilter = (newStatus: 'ALL' | 'COMPLETED' | 'CANCELLED') => {
    setStatusFilter(newStatus);
    navigate(location.pathname, {
      replace: true,
      state: {
        phone: query,
        searched,
        statusFilter: newStatus,
        timeFilter,
        scrollY: window.scrollY
      }
    });
  };

  const updateTimeFilter = (newTime: 'ALL' | 'THIS_MONTH' | 'LAST_MONTH') => {
    setTimeFilter(newTime);
    navigate(location.pathname, {
      replace: true,
      state: {
        phone: query,
        searched,
        statusFilter,
        timeFilter: newTime,
        scrollY: window.scrollY
      }
    });
  };

  // Filter Logic
  const filteredOrders = mockOrdersData.filter((order) => {
    if (statusFilter === 'COMPLETED' && order.status !== 'COMPLETED') return false;
    if (statusFilter === 'CANCELLED' && order.status !== 'CANCELLED') return false;

    if (timeFilter === 'THIS_MONTH' && !order.createdAt.includes('/07/2026')) return false;
    if (timeFilter === 'LAST_MONTH' && !order.createdAt.includes('/06/2026')) return false;

    return true;
  });

  // Group filtered orders chronologically by Month/Year
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const parts = order.createdAt.split('/'); // ['15', '07', '2026']
    const monthYearKey = `THÁNG ${parts[1]} ${parts[2]}`;
    if (!acc[monthYearKey]) {
      acc[monthYearKey] = [];
    }
    acc[monthYearKey].push(order);
    return acc;
  }, {} as Record<string, MockOrder[]>);

  return (
    <div className="w-full bg-[#F4F7FB] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col">
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

      {/* 1. KHU TRA CỨU ĐỒNG BỘ 100% VỚI VÍ ĐIỂM (Seamless surface on #F4F7FB) */}
      <section className="w-full py-6 md:py-8 bg-white border-b border-[#DCE5F0]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col text-left">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Lịch sử giặt ủi
            </h1>
            {/* Laundry Care Instruction Symbols */}
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
          <p className="text-slate-600 text-sm md:text-base font-normal mt-1.5 max-w-xl">
            Xem lại dịch vụ, chi phí và trạng thái những lần giặt trước.
          </p>

          {/* Search bar: Full width form floating below heading */}
          <div className="w-full max-w-2xl mt-5">
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
                      : 'border-[#DCE5F0] focus:border-[#1F63FF] focus:ring-2 focus:ring-blue-100'
                  } text-slate-900 text-sm font-medium rounded-xl px-4 py-3.5 shadow-2xs outline-none transition-all placeholder:text-slate-400`}
                />
                {searched && query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer border-0 bg-transparent text-xs"
                    title="Xóa"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1F63FF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-2xs cursor-pointer transition-all hover:-translate-y-0.5 whitespace-nowrap border-0 flex items-center justify-center gap-2"
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

            {/* DEMO items */}
            {isDemoEnabled && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-400">Dữ liệu demo:</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('0901234567');
                    triggerSearch('0901234567');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-semibold border border-[#DCE5F0] hover:border-blue-300 rounded-lg shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  0901234567 · Nguyễn Văn An
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. KHI CHƯA TRA CỨU (Unsearched State with Informative Process Rail) */}
      {!searched && (
        <section className="w-full py-6 flex-grow flex flex-col justify-start">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full text-left">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Lịch sử DUDI giúp bạn xem lại
            </h2>

            {/* Slim 1-line process/info rail */}
            <div className="w-full flex items-center justify-between overflow-x-auto pb-3 gap-2 hide-scrollbar select-none text-xs font-semibold text-slate-600 border-b border-dashed border-[#DCE5F0]">
              {HISTORY_INTRO_STEPS.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="flex items-center gap-1.5 shrink-0 bg-white px-3 py-2 rounded-lg border border-[#DCE5F0] shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold">{step.num}</span>
                    <span className="text-slate-800 font-medium uppercase">{step.label}</span>
                  </div>
                  {idx < HISTORY_INTRO_STEPS.length - 1 && (
                    <span className="text-slate-300 font-normal shrink-0">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs text-slate-500 font-normal mt-3">
              Tra cứu số điện thoại để xem toàn bộ những lần bạn đã sử dụng DUDI.
            </p>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  setQuery('0901234567');
                  triggerSearch('0901234567');
                }}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F63FF] hover:text-blue-800 bg-transparent border-0 cursor-pointer p-0"
              >
                <span>Xem thử dữ liệu demo</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. KHI TRA CỨU THÀNH CÔNG (Order History Interface) */}
      {searched && hasData && (
        <main className="w-full py-8 flex-grow">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

              {/* LEFT COLUMN: STICKY CUSTOMER SUMMARY & FILTER SIDEBAR (#EEF4FF Surface) */}
              <aside className="lg:col-span-3 bg-[#EEF4FF] p-5 rounded-2xl border border-[#DCE5F0] flex flex-col gap-6 lg:sticky lg:top-6 shadow-2xs">
                
                {/* Customer Summary */}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Khách hàng
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
                    Nguyễn Văn An
                  </h2>
                  <span className="text-xs font-mono text-slate-500 font-medium mt-0.5">
                    0901234567
                  </span>

                  {/* Stats List */}
                  <div className="flex flex-col gap-1 mt-3 text-xs text-slate-700 font-semibold">
                    <div><strong className="text-slate-900 font-extrabold">3</strong> đơn hàng</div>
                    <div><strong className="text-slate-900 font-extrabold">360.000đ</strong> tổng chi tiêu</div>
                    <div>
                      <span className="inline-flex items-center gap-1 bg-[#FFF9E8] text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200/60 shadow-2xs">
                        +24 điểm tích lũy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full border-b border-[#DCE5F0]"></div>

                {/* Filter Sidebar (Text list with left blue vertical line when active) */}
                <div className="flex flex-col gap-5 text-left">
                  {/* Status Filter */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      TRẠNG THÁI
                    </span>
                    <div className="flex flex-row lg:flex-col gap-1.5 flex-wrap">
                      {(['ALL', 'COMPLETED', 'CANCELLED'] as const).map((status) => {
                        const labels = { ALL: 'Tất cả', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy' };
                        const isActive = statusFilter === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateStatusFilter(status)}
                            className={`text-xs transition-colors cursor-pointer text-left py-1 ${
                              isActive
                                ? 'text-[#1F63FF] font-bold border-l-2 border-l-[#1F63FF] pl-2.5'
                                : 'text-slate-600 hover:text-slate-900 font-medium pl-3 border-l-2 border-l-transparent'
                            }`}
                          >
                            {labels[status]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Filter */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      THỜI GIAN
                    </span>
                    <div className="flex flex-row lg:flex-col gap-1.5 flex-wrap">
                      {(['ALL', 'THIS_MONTH', 'LAST_MONTH'] as const).map((time) => {
                        const labels = { ALL: 'Tất cả', THIS_MONTH: 'Tháng này', LAST_MONTH: 'Tháng trước' };
                        const isActive = timeFilter === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => updateTimeFilter(time)}
                            className={`text-xs transition-colors cursor-pointer text-left py-1 ${
                              isActive
                                ? 'text-[#1F63FF] font-bold border-l-2 border-l-[#1F63FF] pl-2.5'
                                : 'text-slate-600 hover:text-slate-900 font-medium pl-3 border-l-2 border-l-transparent'
                            }`}
                          >
                            {labels[time]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </aside>

              {/* RIGHT COLUMN: ORDER HISTORY LIST (#FFFFFF Main Content Surface) */}
              <section className="lg:col-span-9 bg-white p-6 md:p-8 rounded-2xl border border-[#DCE5F0] flex flex-col gap-8 shadow-2xs">

                {/* Summary Header Typography */}
                <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
                  <span className="text-sm font-extrabold text-slate-900">Lịch sử dịch vụ</span>
                  <span className="text-xs font-semibold text-slate-500">3 đơn · Tổng chi tiêu 360.000đ</span>
                </div>

                {Object.keys(groupedOrders).length > 0 ? (
                  Object.entries(groupedOrders).map(([monthGroup, orders]) => (
                    <div key={monthGroup} className="flex flex-col gap-3 reveal-hidden">
                      {/* Month Heading with Order Count */}
                      <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {monthGroup}
                        </h3>
                        <span className="text-xs font-medium text-slate-400">
                          {orders.length} đơn
                        </span>
                      </div>

                      {/* Order Rows */}
                      <div className="flex flex-col divide-y divide-[#DCE5F0]">
                        {orders.map((order) => {
                          const isCompleted = order.status === 'COMPLETED';

                          return (
                            <div
                              key={order.id}
                              className="group relative border-l-2 border-l-transparent hover:border-l-[#1F63FF] hover:bg-[#F7FAFF] py-3.5 px-3 transition-colors duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left rounded-lg"
                            >
                              {/* Thumbnail & Order Info */}
                              <div className="flex items-center gap-4 flex-grow">
                                {/* Service Thumbnail (110x84px, rounded 6px, scale 1.03) */}
                                <div className="w-[110px] h-[84px] shrink-0 overflow-hidden rounded-[6px] border border-[#DCE5F0] bg-slate-100">
                                  <img
                                    src={order.thumbnail}
                                    alt={order.service}
                                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                                  />
                                </div>

                                {/* Order Info */}
                                <div className="flex flex-col text-left">
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-base font-extrabold text-slate-900 tracking-tight">
                                      {order.id}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-400 font-medium mt-0.5">
                                    {order.createdAt}
                                  </span>
                                  <span className="text-xs text-slate-700 font-semibold mt-1">
                                    {order.service}
                                  </span>

                                  {/* Dot Status */}
                                  <div className="mt-1.5">
                                    {isCompleted ? (
                                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                        Đã hoàn thành
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        Đã hủy
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Amount & Actions */}
                              <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center sm:justify-center gap-2.5 shrink-0">
                                {/* Cost & Points */}
                                <div className="flex flex-col text-left sm:text-right">
                                  <span className="text-base font-extrabold text-slate-900">
                                    {order.amount}
                                  </span>
                                  {isCompleted ? (
                                    <span className="inline-flex items-center gap-1 bg-[#FFF9E8] text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200/60 mt-0.5">
                                      +{order.points} điểm
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-400 mt-0.5">0 điểm</span>
                                  )}
                                </div>

                                {/* Action Links */}
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleViewDetail(order.id)}
                                    className="group/btn inline-flex items-center gap-1 text-xs font-bold text-[#1F63FF] hover:underline bg-transparent border-0 cursor-pointer p-0"
                                  >
                                    <span>Xem chi tiết</span>
                                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReorder(order.id)}
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline bg-transparent border-0 cursor-pointer p-0"
                                  >
                                    Đặt lại
                                  </button>
                                  {isCompleted && (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/customer/feedback/${order.id}`)}
                                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline bg-transparent border-0 cursor-pointer p-0"
                                    >
                                      Gửi phản hồi
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  /* Empty Filter State */
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-3 w-full">
                    <Clock size={26} className="text-slate-300" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold text-slate-900">Không có đơn hàng phù hợp</h3>
                      <p className="text-xs text-slate-500 font-medium">Thử thay đổi trạng thái hoặc khoảng thời gian.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter('ALL');
                        setTimeFilter('ALL');
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#DCE5F0] hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>Xóa bộ lọc</span>
                    </button>
                  </div>
                )}

              </section>

            </div>
          </div>
        </main>
      )}

      {/* 4. KHI KHÔNG TÌM THẤY SỐ ĐIỆN THOẠI */}
      {searched && !hasData && (
        <main className="w-full py-16 flex-grow flex flex-col justify-center border-t border-[#DCE5F0]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-4 w-full">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <Search size={24} />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h2 className="text-lg font-bold text-slate-900">Không tìm thấy lịch sử giặt ủi</h2>
              <p className="text-slate-600 text-sm">
                Vui lòng kiểm tra lại số điện thoại.
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
        </main>
      )}

    </div>
  );
}
