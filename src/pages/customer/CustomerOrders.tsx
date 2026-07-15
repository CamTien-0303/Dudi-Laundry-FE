import { useNavigate } from 'react-router';
import { ClipboardList, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string;
  status: 'RECEIVED' | 'WASHING' | 'DRYING_IRONING' | 'READY' | 'RETURNED';
  amount: string;
  service: string;
}

const mockOrders: MockOrder[] = [
  {
    id: 'DL-001',
    createdAt: '2026-07-15T08:00:00Z',
    status: 'WASHING',
    amount: '150.000đ',
    service: 'Giặt sấy tiêu chuẩn & Vệ sinh giày'
  },
  {
    id: 'DL-002',
    createdAt: '2026-07-14T09:30:00Z',
    status: 'RETURNED',
    amount: '80.000đ',
    service: 'Giặt hấp áo vest'
  }
];

export default function CustomerOrders() {
  const navigate = useNavigate();

  const getStatusItem = (status: MockOrder['status']) => {
    const map = {
      RECEIVED: { label: 'Nhận đồ', variant: 'default' as const },
      WASHING: { label: 'Đang giặt', variant: 'info' as const },
      DRYING_IRONING: { label: 'Đang sấy/ủi/gấp', variant: 'warning' as const },
      READY: { label: 'Hoàn tất', variant: 'success' as const },
      RETURNED: { label: 'Đã trả khách', variant: 'success' as const }
    };
    return map[status] || { label: status, variant: 'default' };
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-900">
      <PageHeader
        title="Đơn hàng của tôi"
        description="Xem danh sách lịch sử đơn hàng giặt ủi của bạn."
      />

      <div className="flex flex-col gap-4 max-w-xl">
        {mockOrders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <ClipboardList className="mx-auto text-slate-350 mb-3" size={32} />
            <p className="text-sm font-semibold text-slate-600">Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          mockOrders.map((order) => {
            const statusItem = getStatusItem(order.status);
            const date = new Date(order.createdAt);
            const formattedDate = `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}`;

            return (
              <div
                key={order.id}
                onClick={() => navigate(`/customer/orders/${order.id}`)}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-blue-600 text-sm">{order.id}</span>
                    <StatusBadge label={statusItem.label} variant={statusItem.variant} />
                  </div>
                  <p className="text-xs text-slate-600 font-medium truncate">{order.service}</p>
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{formattedDate}</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <DollarSign size={12} className="text-slate-400" />
                      <span>{order.amount}</span>
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
