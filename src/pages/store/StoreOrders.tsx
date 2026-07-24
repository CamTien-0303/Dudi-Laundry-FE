import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../../mocks/orderStore';


const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'RECEIVED', label: 'Nhận đồ' },
  { key: 'PROCESSING', label: 'Đang xử lý' }, // WASHING + DRYING_IRONING
  { key: 'READY', label: 'Hoàn tất' },
  { key: 'RETURNED', label: 'Đã trả' },
];

export default function StoreOrders() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('ALL');

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (activeTab === 'PROCESSING') {
      matchesStatus = o.status === 'WASHING' || o.status === 'DRYING_IRONING';
    } else if (activeTab !== 'ALL') {
      matchesStatus = o.status === activeTab;
    }
    
    return matchesSearch && matchesStatus;
  });

  const isFilterActive = !!search || activeTab !== 'ALL';

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-6 text-left">
      <style>{`
        .reveal-hidden {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          .reveal-hidden {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.35s ease-out, transform 0.35s ease-out;
          }
          .reveal-hidden.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* 1. STORE COUNTER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            STORE COUNTER MANAGEMENT
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý đơn hàng tại quầy
          </h1>
        </div>

        <button
          onClick={() => navigate('/store/orders/new')}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tạo đơn hàng mới</span>
        </button>
      </div>

      {/* 2. FILTER TOOLBAR WITH STATUS PILLS & SEARCH */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Status Pills Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F8FAFC] p-1 rounded-lg border border-[#DCE5F0]">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border-0 ${
                activeTab === tab.key
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Clear Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm mã đơn, SĐT, tên khách..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md pl-8 pr-2 py-1.5 outline-none transition-all"
            />
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {isFilterActive && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveTab('ALL');
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-red-600 border-0 bg-transparent cursor-pointer shrink-0"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

      </div>

      {/* 3. STORE ORDERS TABLE (Enterprise Sharp Table with Sticky Header & Pastel Badges) */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[650px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr className="border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Dịch vụ</th>
                <th className="py-3 px-4 text-right">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái đơn</th>
                <th className="py-3 px-4">Thanh toán</th>
                <th className="py-3 px-4">Thời gian tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0] text-slate-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((row) => {
                  const isUnpaid = row.paymentStatus !== 'PAID';
                  const date = new Date(row.createdAt);

                  // Row background warning for unpaid items
                  let rowBgClass = 'bg-white hover:bg-slate-50/80';
                  if (isUnpaid && row.status === 'READY') {
                    rowBgClass = 'bg-red-50/30 hover:bg-red-50/60';
                  }

                  return (
                    <tr
                      key={row.id}
                      className={`${rowBgClass} transition-colors duration-150 font-medium`}
                    >
                      {/* 1. Mã đơn */}
                      <td className="py-3.5 px-4 font-mono font-black text-[#2563EB]">
                        {row.id}
                      </td>

                      {/* 2. Khách hàng */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <strong className="font-bold text-slate-900 text-xs">{row.customerName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">{row.customerPhone}</span>
                        </div>
                      </td>

                      {/* 3. Dịch vụ */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {row.serviceName}
                      </td>

                      {/* 4. Tổng tiền */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                        {row.amount.toLocaleString('vi-VN')}đ
                      </td>

                      {/* 5. Trạng thái đơn (Pastel volgens step) */}
                      <td className="py-3.5 px-4">
                        {row.status === 'RECEIVED' && (
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-bold">
                            Nhận đồ
                          </span>
                        )}
                        {row.status === 'WASHING' && (
                          <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded text-[10px] font-bold">
                            Đang giặt
                          </span>
                        )}
                        {row.status === 'DRYING_IRONING' && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                            Đang sấy/ủi/gấp
                          </span>
                        )}
                        {row.status === 'READY' && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                            Hoàn tất
                          </span>
                        )}
                        {row.status === 'RETURNED' && (
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-[10px] font-bold">
                            Đã trả khách
                          </span>
                        )}
                        {row.status === 'CANCELLED' && (
                          <span className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                            Đã hủy
                          </span>
                        )}
                      </td>

                      {/* 6. Thanh toán */}
                      <td className="py-3.5 px-4">
                        {row.paymentStatus === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 size={10} />
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            <AlertTriangle size={10} />
                            Chưa thanh toán
                          </span>
                        )}
                      </td>

                      {/* 7. Thời gian tạo */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs font-semibold">
                        {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </td>

                      {/* 8. Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate('/store/operations')}
                          className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-[#EEF4FF] rounded transition-colors border border-transparent hover:border-[#BFDBFE] cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Xử lý đơn</span>
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400 font-semibold">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
