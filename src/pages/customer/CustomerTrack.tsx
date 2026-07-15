import React, { useState } from 'react';
import { useNavigate } from 'react-router';
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
  QrCode
} from 'lucide-react';
import { PageHeader } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string;
  amount: string;
  eta: string;
  services: string[];
  branch: {
    name: string;
    address: string;
    hotline: string;
  };
}

const mockOrderData: MockOrder = {
  id: 'DUDI-123',
  createdAt: '15/07/2026',
  amount: '150.000đ',
  eta: '18:00 - 16/07/2026',
  services: [
    '5kg Giặt sấy',
    '1 đôi giày thể thao'
  ],
  branch: {
    name: 'DUDI Quận 1',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    hotline: '0909 123 456'
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
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<MockOrder | null>(null);
  
  // Simulated status index (0 to 4). Default is 2 (Đang giặt sấy).
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanedQuery = query.trim().toLowerCase();
    
    // Valid mocks: Phone "0901234567" or Order Code "dudi-123"
    if (cleanedQuery === '0901234567' || cleanedQuery === 'dudi-123') {
      setResult(mockOrderData);
    } else {
      setResult(null);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setResult(null);
  };
  
  const isFinished = currentStepIndex === 4; // Step 5: Sẵn sàng giao trả
  
  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-4xl mx-auto px-4 sm:px-0">
      <PageHeader
        title="Tra cứu đơn hàng"
        description="Theo dõi tiến độ quần áo của bạn theo thời gian thực."
      />

      {/* Form tìm kiếm */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Nhập số điện thoại hoặc mã đơn..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer border-0"
            >
              Tra cứu
            </button>
            {searched && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition-all cursor-pointer border-0"
              >
                Xóa
              </button>
            )}
          </div>
        </form>
        <div className="mt-3 text-xs text-slate-500 flex flex-wrap gap-2 items-center">
          <span>Gợi ý test nhanh:</span>
          <button 
            type="button"
            onClick={() => setQuery('0901234567')}
            className="text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded cursor-pointer border-0 font-medium text-[11px]"
          >
            SĐT: 0901234567
          </button>
          <span>hoặc</span>
          <button 
            type="button"
            onClick={() => setQuery('DUDI-123')}
            className="text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded cursor-pointer border-0 font-medium text-[11px]"
          >
            Mã đơn: DUDI-123
          </button>
        </div>
      </div>

      {/* Hiển thị kết quả */}
      {searched && (
        <div className="animate-fadeIn">
          {result ? (
            <div className="flex flex-col gap-6">
              
              {/* Card thông tin chi tiết đơn hàng */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-6">
                
                {/* Header đơn hàng */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-blue-600 tracking-wide">{result.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isFinished 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {TIMELINE_STEPS[currentStepIndex].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        Ngày gửi: <strong className="text-slate-700 font-semibold">{result.createdAt}</strong>
                      </span>
                      <span className="hidden sm:inline text-slate-300">|</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        ETA dự kiến: <strong className="text-slate-700 font-semibold">{result.eta}</strong>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="text-xs text-slate-550 font-semibold">Tổng tiền thanh toán</span>
                    <span className="text-2xl font-black text-slate-900">{result.amount}</span>
                  </div>
                </div>

                {/* Timeline tiến trình */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-800">Tiến độ đơn hàng</h3>
                  
                  {/* Timeline Desktop */}
                  <div className="hidden md:flex items-start justify-between relative mt-4 px-2">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === currentStepIndex;

                      return (
                        <div key={step.id} className="flex-1 flex flex-col items-center text-center relative px-2">
                          {/* Horizontal connector line (only for all except last) */}
                          {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`absolute top-[18px] left-[50%] right-[-50%] h-[3px] -z-10 transition-all duration-300 ${
                              idx < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                            style={{
                              backgroundColor: idx < currentStepIndex ? '#10b981' : '#e2e8f0'
                            }} />
                          )}

                          {/* Dot timeline */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                              : isActive
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50 animate-pulse'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                          style={{
                            backgroundColor: isCompleted ? '#10b981' : isActive ? '#2563eb' : '#ffffff',
                            borderColor: isCompleted ? '#10b981' : isActive ? '#2563eb' : '#e2e8f0'
                          }}>
                            {isCompleted ? (
                              <Check size={18} className="stroke-[3]" />
                            ) : isActive ? (
                              <Clock size={16} className="stroke-[2.5]" />
                            ) : (
                              <span className="text-xs font-bold">{step.id}</span>
                            )}
                          </div>

                          {/* Nhãn trạng thái */}
                          <div className="mt-3">
                            <p className={`text-xs font-bold transition-colors duration-300 ${
                              isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}
                            style={{
                              color: isCompleted ? '#059669' : isActive ? '#2563eb' : '#94a3b8'
                            }}>
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
                  <div className="flex md:hidden flex-col gap-6 relative pl-2 mt-2">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === currentStepIndex;

                      return (
                        <div key={step.id} className="relative flex items-start gap-4">
                          {/* Connector line (for all except last) */}
                          {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`absolute left-3.5 top-7 w-[2px] h-[34px] -ml-[1px] transition-all duration-300 ${
                              idx < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                            style={{
                              backgroundColor: idx < currentStepIndex ? '#10b981' : '#e2e8f0'
                            }} />
                          )}

                          {/* Dot timeline */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 z-10 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : isActive
                              ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-50'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                          style={{
                            backgroundColor: isCompleted ? '#10b981' : isActive ? '#2563eb' : '#ffffff',
                            borderColor: isCompleted ? '#10b981' : isActive ? '#2563eb' : '#e2e8f0'
                          }}>
                            {isCompleted ? (
                              <Check size={14} className="stroke-[3]" />
                            ) : isActive ? (
                              <Clock size={12} className="stroke-[2.5]" />
                            ) : (
                              <span className="text-[10px] font-bold">{step.id}</span>
                            )}
                          </div>

                          <div className="flex flex-col pt-0.5">
                            <span className={`text-sm font-bold ${
                              isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}
                            style={{
                              color: isCompleted ? '#059669' : isActive ? '#2563eb' : '#94a3b8'
                            }}>
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
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
                      Dịch vụ sử dụng
                    </div>
                    <ul className="flex flex-col gap-2 pl-1">
                      {result.services.map((service, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Box chi nhánh */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
                      Chi nhánh xử lý
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Building2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-800">{result.branch.name}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-500 font-semibold">
                        <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>{result.branch.address}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-500 font-semibold">
                        <Phone size={15} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>Hotline: <strong className="text-slate-700 font-semibold">{result.branch.hotline}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút hành động chính (CTA) */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  {!isFinished ? (
                    <button
                      type="button"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2 border-0"
                    >
                      <HelpCircle size={18} />
                      Gửi yêu cầu hỗ trợ
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => result && navigate(`/customer/delivery/${result.id}`)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2 border-0"
                    >
                      <Truck size={18} />
                      Giao đồ cho tôi
                    </button>
                  )}
                </div>

                {/* Mock status toggle: small and unobtrusive at the bottom corner */}
                <div className="border-t border-slate-100/50 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400">
                  <span className="font-medium">Giả lập trạng thái kiểm thử (Demo):</span>
                  <div className="flex gap-1.5">
                    {TIMELINE_STEPS.map((step, idx) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all border ${
                          currentStepIndex === idx
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        Bước {step.id}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 shadow-inner">
                <QrCode size={28} className="stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1.5 max-w-sm">
                <p className="text-slate-800 font-bold text-base leading-snug">
                  Không tìm thấy đơn hàng
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  Bạn hiện không có đơn hàng nào đang xử lý. Hãy quét mã QR để bắt đầu!
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg transition-all cursor-pointer border-0"
              >
                Nhập lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
