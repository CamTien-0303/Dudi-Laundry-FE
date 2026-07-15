import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Calendar,
  ClipboardList,
  Clock,
  Coins
} from 'lucide-react';
import { PageHeader, useToast } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string; // Format: dd/mm/yyyy
  service: string;
  amount: string;
  status: 'COMPLETED' | 'CANCELLED';
  statusLabel: 'Đã hoàn thành' | 'Đã hủy';
  points: number;
}

const mockOrdersData: MockOrder[] = [
  {
    id: 'DUDI-123',
    createdAt: '15/07/2026',
    service: '5kg Giặt sấy + 1 đôi giày',
    amount: '150.000đ',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    points: 15
  },
  {
    id: 'DUDI-098',
    createdAt: '05/07/2026',
    service: '3kg Giặt sấy',
    amount: '90.000đ',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    points: 9
  },
  {
    id: 'DUDI-077',
    createdAt: '22/06/2026',
    service: '1 Chăn bông',
    amount: '120.000đ',
    status: 'CANCELLED',
    statusLabel: 'Đã hủy',
    points: 0
  }
];

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_MONTH'>('ALL');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanedQuery = query.trim();

    if (cleanedQuery === '0901234567') {
      setHasData(true);
    } else {
      setHasData(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setHasData(false);
    setStatusFilter('ALL');
    setTimeFilter('ALL');
  };

  const handleReorder = (orderId: string) => {
    toast(`Đã yêu cầu đặt lại đơn hàng ${orderId} thành công!`, 'success');
  };

  const handleFeedback = (orderId: string) => {
    toast(`Gửi phản hồi đơn hàng ${orderId} thành công! Cảm ơn ý kiến của bạn.`, 'success');
  };

  // Filter Logic
  const filteredOrders = mockOrdersData.filter((order) => {
    // Status Filter
    if (statusFilter === 'COMPLETED' && order.status !== 'COMPLETED') return false;
    if (statusFilter === 'CANCELLED' && order.status !== 'CANCELLED') return false;

    // Time Filter (mock dates: /07/2026 is this month, /06/2026 is last month)
    if (timeFilter === 'THIS_MONTH' && !order.createdAt.includes('/07/2026')) return false;
    if (timeFilter === 'LAST_MONTH' && !order.createdAt.includes('/06/2026')) return false;

    return true;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-4xl mx-auto px-4 sm:px-0">
      <PageHeader
        title="Lịch sử giặt ủi"
        description="Tra cứu lịch sử đơn hàng và theo dõi thông tin chi tiết các giao dịch của bạn."
      />

      {/* Form tìm kiếm số điện thoại */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Nhập số điện thoại tra cứu (ví dụ: 0901234567)..."
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
        <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
          <span>Gợi ý test nhanh:</span>
          <button 
            type="button"
            onClick={() => setQuery('0901234567')}
            className="text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded cursor-pointer border-0 font-medium text-[11px]"
          >
            SĐT: 0901234567
          </button>
        </div>
      </div>

      {/* Hiển thị kết quả */}
      {searched && (
        <div className="animate-fadeIn">
          {hasData ? (
            <div className="flex flex-col gap-6">
              
              {/* Thanh bộ lọc đơn hàng */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                
                {/* Lọc Trạng thái */}
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trạng thái</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['ALL', 'COMPLETED', 'CANCELLED'] as const).map((status) => {
                      const labels = { ALL: 'Tất cả', COMPLETED: 'Đã hoàn thành', CANCELLED: 'Đã hủy' };
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            statusFilter === status
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {labels[status]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lọc Thời gian */}
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thời gian</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['ALL', 'THIS_MONTH', 'LAST_MONTH'] as const).map((time) => {
                      const labels = { ALL: 'Tất cả', THIS_MONTH: 'Tháng này', LAST_MONTH: 'Tháng trước' };
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setTimeFilter(time)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            timeFilter === time
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {labels[time]}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Danh sách thẻ đơn hàng */}
              <div className="flex flex-col gap-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const isCompleted = order.status === 'COMPLETED';
                    return (
                      <div 
                        key={order.id} 
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 hover:border-slate-300 hover:shadow-md transition-all"
                      >
                        {/* Header của Card */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base font-extrabold text-blue-600 tracking-wide">{order.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isCompleted 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              {order.statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                            <Calendar size={13} />
                            <span>{order.createdAt}</span>
                          </div>
                        </div>

                        {/* Chi tiết đơn */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dịch vụ sử dụng</span>
                            <span className="text-sm font-bold text-slate-800">{order.service}</span>
                          </div>
                          
                          <div className="flex flex-col items-start sm:items-end gap-1">
                            <span className="text-xs text-slate-450 font-semibold">Tổng chi phí</span>
                            <span className="text-lg font-black text-slate-900">{order.amount}</span>
                          </div>
                        </div>

                        {/* Điểm tích lũy và nút bấm */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-50 pt-4 mt-1">
                          
                          {/* Điểm tích lũy */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                            <Coins size={15} className={isCompleted ? 'text-amber-500' : 'text-slate-350'} />
                            <span>Điểm tích lũy:</span>
                            <strong className={`font-extrabold ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {isCompleted ? `+${order.points}` : `${order.points}`} điểm
                            </strong>
                          </div>

                          {/* Nhóm button */}
                          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => navigate(`/customer/orders/${order.id}`)}
                              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-0"
                            >
                              Xem chi tiết
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorder(order.id)}
                              className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-all border border-blue-200 cursor-pointer"
                            >
                              Đặt lại
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(order.id)}
                              className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                            >
                              Gửi phản hồi
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })
                ) : (
                  /* Empty state bộ lọc */
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                    <Clock size={32} className="text-slate-300" />
                    <p className="text-slate-650 font-bold text-sm">
                      Không tìm thấy đơn hàng nào trong khoảng thời gian này
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Empty State SĐT */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 shadow-inner">
                <ClipboardList size={28} className="stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1.5 max-w-sm">
                <p className="text-slate-800 font-bold text-base leading-snug">
                  Chưa có giao dịch
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  Bạn chưa có giao dịch nào. Hãy gửi đồ ngay để trải nghiệm dịch vụ!
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
