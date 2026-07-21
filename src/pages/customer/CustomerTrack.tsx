import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Search,
  MapPin,
  Check,
  Clock,
  Phone,
  Building2,
  Calendar,
  HelpCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string;
  amount: string;
  eta: string;
  services: string[];
  stepIndex: number;
  customer: string;
  branch: {
    name: string;
    address: string;
    hotline: string;
  };
}

const MOCK_ORDERS: Record<string, MockOrder> = {
  'DUDI-125': {
    id: 'DUDI-125',
    createdAt: '20/07/2026',
    amount: '210.000đ',
    eta: '18:00 hôm nay',
    services: ['5kg Giặt sấy', '1 đôi giày'],
    stepIndex: 2, // Đang giặt sấy (index 2 của timeline 5 bước)
    customer: 'Nguyễn Văn An',
    branch: {
      name: 'DUDI Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      hotline: '0901 123 456'
    }
  },
  'DUDI-123': {
    id: 'DUDI-123',
    createdAt: '15/07/2026',
    amount: '150.000đ',
    eta: 'Đã hoàn thành',
    services: ['5kg Giặt sấy', '1 đôi giày thể thao'],
    stepIndex: 4, // Sẵn sàng giao trả / Hoàn thành (index 4)
    customer: 'Nguyễn Văn An',
    branch: {
      name: 'DUDI Quận 1',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      hotline: '0901 123 456'
    }
  }
};

const TIMELINE_STEPS = [
  { id: 1, label: 'Tiếp nhận' },
  { id: 2, label: 'Phân loại/Xử lý' },
  { id: 3, label: 'Đang giặt sấy' },
  { id: 4, label: 'Hoàn thành/Đóng gói' },
  { id: 5, label: 'Sẵn sàng giao trả' }
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

  // Auto-search effect on mount / orderId param change
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      const cleanParam = orderIdParam.trim();
      setQuery(cleanParam);
      triggerMockSearch(cleanParam);
    } else {
      // Direct access: input must be empty, no results
      setQuery('');
      setSearched(false);
      setResult(null);
    }
  }, [searchParams]);

  // Clean and trigger search with loading skeleton
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

      // Simulation of a connection error for 'err' keyword
      if (normalized === 'err' || normalized === 'error') {
        setIsLoading(false);
        setResult(null);
        setSearchError('Hệ thống mất kết nối tạm thời với máy chủ tra cứu. Vui lòng kiểm tra internet và thử lại.');
        return;
      }

      if (normalized === 'dudi-125' || normalized === 'dudi125' || normalized === '125' || normalized === '0901234567') {
        setResult(MOCK_ORDERS['DUDI-125']);
      } else if (normalized === 'dudi-123' || normalized === 'dudi123' || normalized === '123') {
        setResult(MOCK_ORDERS['DUDI-123']);
      } else {
        // Not found / Empty state
        setResult(null);
      }
      setIsLoading(false);
    }, 600); // 600ms premium mock loading delay
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = query.trim();

    // Input Validation
    if (!val) {
      setValidationError('Vui lòng nhập số điện thoại hoặc mã đơn hàng!');
      return;
    }
    
    // Auto-uppercase if input looks like an order code (contains alphabet/dudi style)
    let processedVal = val;
    if (/[a-zA-Z]/.test(val)) {
      processedVal = val.toUpperCase();
      setQuery(processedVal);
    }

    triggerMockSearch(processedVal);
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setResult(null);
    setValidationError(null);
    setSearchError(null);
    // Remove query param from URL
    navigate('/customer/track', { replace: true });
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-4xl mx-auto px-4 sm:px-0">
      
      <PageHeader
        title="Tra cứu tiến độ đơn hàng"
        description="Theo dõi trạng thái giặt sấy, giao nhận quần áo của bạn theo thời gian thực."
      />

      {/* Form tìm kiếm */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-3xs flex flex-col gap-4 text-left">
        <h2 className="text-sm font-extrabold text-slate-850">
          {searched ? 'Tra cứu đơn hàng khác' : 'Nhập thông tin tra cứu'}
        </h2>
        
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Nhập Số điện thoại (ví dụ: 0901234567) hoặc Mã đơn (ví dụ: DUDI-125)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-700 text-sm focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-semibold ${
                validationError ? 'border-red-300 bg-red-50/10' : 'border-slate-250'
              }`}
            />
            <Search className="absolute left-4 top-3.5 text-slate-450" size={18} />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 cursor-pointer border-0"
            >
              Tra cứu
            </button>
            {searched && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all cursor-pointer border-0"
              >
                Xóa
              </button>
            )}
          </div>
        </form>

        {validationError && (
          <p className="text-red-550 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <AlertCircle size={13} />
            {validationError}
          </p>
        )}
      </div>

      {/* --- RENDER STATES --- */}

      {/* 1. Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-6 animate-pulse mt-2 text-left">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-6 shadow-3xs">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-40 bg-slate-200 rounded"></div>
              <div className="h-4 w-60 bg-slate-150 rounded"></div>
            </div>
            <div className="h-0.5 w-full bg-slate-100"></div>
            <div className="h-[120px] w-full bg-slate-100/80 rounded-2xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[90px] bg-slate-100/80 rounded-2xl"></div>
              <div className="h-[90px] bg-slate-100/80 rounded-2xl"></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Connection Error State */}
      {!isLoading && searchError && (
        <div className="flex flex-col gap-4 items-center justify-center py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-3xs mt-2 max-w-lg mx-auto w-full">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center">
            <AlertCircle size={26} className="animate-none" />
          </div>
          <div className="flex flex-col gap-1.5 px-6">
            <p className="text-base font-extrabold text-slate-900">Lỗi kết nối tra cứu</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm">
              {searchError}
            </p>
          </div>
          <button
            onClick={() => triggerMockSearch(lastSearchedKey)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-blue-500/10 cursor-pointer border-0 mt-2"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 3. Search Executed & Results Rendered */}
      {!isLoading && !searchError && searched && (
        <div className="animate-fadeIn mt-2">
          {result ? (
            <div className="flex flex-col gap-6">
              
              {/* Card thông tin chi tiết đơn hàng */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-3xs flex flex-col gap-6 text-left">
                
                {/* Header đơn hàng */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-blue-600 tracking-wide">{result.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                        result.stepIndex === 4
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {TIMELINE_STEPS[result.stepIndex].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        Ngày gửi: <strong className="text-slate-700 font-extrabold">{result.createdAt}</strong>
                      </span>
                      <span className="hidden sm:inline text-slate-200">|</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400 animate-none" />
                        ETA dự kiến: <strong className="text-slate-700 font-extrabold">{result.eta}</strong>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-0.5">
                    <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">Tổng thanh toán</span>
                    <span className="text-2xl font-black text-slate-900">{result.amount}</span>
                  </div>
                </div>

                {/* Timeline tiến trình */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-slate-850">Tiến độ đơn hàng</h3>
                  
                  {/* Timeline Desktop */}
                  <div className="hidden md:flex items-start justify-between relative mt-4 px-2 select-none">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx < result.stepIndex;
                      const isActive = idx === result.stepIndex;

                      return (
                        <div key={step.id} className="flex-1 flex flex-col items-center text-center relative px-2">
                          {/* Horizontal connector line (only for all except last) */}
                          {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`absolute top-[18px] left-[50%] right-[-50%] h-[3px] -z-10 transition-all duration-300 ${
                              idx < result.stepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                            }`} />
                          )}

                          {/* Dot timeline */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                              : isActive
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50 animate-pulse'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {isCompleted ? (
                              <Check size={18} className="stroke-[3]" />
                            ) : isActive ? (
                              <Clock size={16} className="stroke-[2.5] animate-none" />
                            ) : (
                              <span className="text-xs font-black">{step.id}</span>
                            )}
                          </div>

                          {/* Nhãn trạng thái */}
                          <div className="mt-3">
                            <p className={`text-xs font-bold transition-colors duration-300 ${
                              isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </p>
                            {isActive && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold tracking-wide uppercase">
                                Hiện tại
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Timeline Mobile (Vertical) */}
                  <div className="flex md:hidden flex-col gap-6 relative pl-2 mt-2 select-none">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx < result.stepIndex;
                      const isActive = idx === result.stepIndex;

                      return (
                        <div key={step.id} className="relative flex items-start gap-4">
                          {/* Connector line (for all except last) */}
                          {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`absolute left-3.5 top-7 w-[2px] h-[34px] -ml-[1px] transition-all duration-300 ${
                              idx < result.stepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                            }`} />
                          )}

                          {/* Dot timeline */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 z-10 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : isActive
                              ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-50'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {isCompleted ? (
                              <Check size={14} className="stroke-[3]" />
                            ) : isActive ? (
                              <Clock size={12} className="stroke-[2.5] animate-none" />
                            ) : (
                              <span className="text-[10px] font-black">{step.id}</span>
                            )}
                          </div>

                          <div className="flex flex-col pt-0.5">
                            <span className={`text-sm font-bold ${
                              isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                            {isActive && (
                              <span className="self-start mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">
                                Trạng thái hiện tại
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Danh sách dịch vụ và Chi nhánh */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  
                  {/* Box dịch vụ */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
                      Dịch vụ sử dụng
                    </div>
                    <ul className="flex flex-col gap-2.5 pl-1">
                      {result.services.map((service, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-650 font-bold">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Box chi nhánh */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
                      Chi nhánh tiếp nhận
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Building2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="font-extrabold text-slate-800">{result.branch.name}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-500 font-semibold">
                        <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>{result.branch.address}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-500 font-semibold">
                        <Phone size={15} className="text-slate-400 shrink-0 mt-0.5 animate-none" />
                        <span>
                          Hotline liên hệ:{' '}
                          <a href={`tel:${result.branch.hotline.replace(/\s+/g, '')}`} className="text-blue-600 font-extrabold hover:underline">
                            {result.branch.hotline}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút hành động chính (CTA) */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  {result.stepIndex < 4 ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/customer/support?orderId=${result.id}`)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xs shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 border-0"
                    >
                      <HelpCircle size={18} />
                      Gửi yêu cầu hỗ trợ
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/customer/delivery')}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 border-0"
                    >
                      <Truck size={18} />
                      Đặt nhận đồ tận nơi
                    </button>
                  )}
                </div>

              </div>
            </div>
          ) : (
            
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-3xs max-w-xl mx-auto flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-150 shadow-inner">
                <Search size={26} />
              </div>
              <div className="flex flex-col gap-1.5 max-w-sm">
                <p className="text-slate-800 font-extrabold text-base leading-snug">
                  Không tìm thấy thông tin đơn hàng
                </p>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-1">
                  Không tìm thấy dữ liệu tra cứu cho từ khóa <strong className="text-slate-800">"{lastSearchedKey}"</strong>. Vui lòng kiểm tra lại Số điện thoại hoặc Mã đơn hàng của bạn.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-0"
              >
                Nhập từ khóa khác
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
