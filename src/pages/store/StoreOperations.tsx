import { Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { useOrderStore } from '../../mocks/orderStore';
import type { Order } from '../../mocks/orderStore';

const KANBAN_STAGES: { key: Order['status']; label: string; bgHeader: string; borderCol: string; textCol: string }[] = [
  { key: 'RECEIVED', label: 'Nhận đồ', bgHeader: 'bg-slate-100/80', borderCol: 'border-slate-250', textCol: 'text-slate-700' },
  { key: 'WASHING', label: 'Đang giặt', bgHeader: 'bg-blue-50/80', borderCol: 'border-blue-100', textCol: 'text-blue-700' },
  { key: 'DRYING_IRONING', label: 'Đang sấy/ủi/gấp', bgHeader: 'bg-amber-50/80', borderCol: 'border-amber-100', textCol: 'text-amber-700' },
  { key: 'READY', label: 'Hoàn tất', bgHeader: 'bg-emerald-50/80', borderCol: 'border-emerald-100', textCol: 'text-emerald-700' },
  { key: 'RETURNED', label: 'Đã trả khách', bgHeader: 'bg-indigo-50/80', borderCol: 'border-indigo-100', textCol: 'text-indigo-700' }
];

export default function StoreOperations() {
  const { toast } = useToast();
  const { orders, updateOrderStatus } = useOrderStore();

  // Helper to calculate waiting time
  const getWaitTime = (createdAtStr: string) => {
    const created = new Date(createdAtStr);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 0) return 'Vừa tạo';
    if (diffMins < 60) {
      return `Chờ ${diffMins} phút`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `Chờ ${diffHours} giờ`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `Chờ ${diffDays} ngày`;
  };

  // Helper for status names
  const getStatusLabel = (status: Order['status']) => {
    const map = {
      RECEIVED: 'Nhận đồ',
      WASHING: 'Đang giặt',
      DRYING_IRONING: 'Đang sấy/ủi/gấp',
      READY: 'Hoàn tất',
      RETURNED: 'Đã trả khách',
      CANCELLED: 'Đã hủy',
    };
    return map[status];
  };

  // Step transition
  const handleTransition = (order: Order) => {
    const statusFlow: Order['status'][] = ['RECEIVED', 'WASHING', 'DRYING_IRONING', 'READY', 'RETURNED'];
    const currIdx = statusFlow.indexOf(order.status);
    if (currIdx === -1 || currIdx === statusFlow.length - 1) return;

    const nextStatus = statusFlow[currIdx + 1];

    // Safety check: Cannot return client order unless fully paid
    if (nextStatus === 'RETURNED' && order.paymentStatus !== 'PAID') {
      toast('Không thể trả khách! Đơn hàng chưa được thanh toán đầy đủ.', 'error');
      return;
    }

    updateOrderStatus(order.id, nextStatus);
    toast(`Đã chuyển đơn ${order.id} sang bước "${getStatusLabel(nextStatus)}"`, 'success');
  };

  // Filter orders by status
  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(o => o.status === status);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12 text-slate-900">
      <PageHeader
        title="Vận hành & Quy trình"
        description="Quản lý và cập nhật tiến trình giặt sấy 5 bước tại quầy."
        breadcrumb={[
          { label: 'Cửa hàng', to: '/store/dashboard' },
          { label: 'Vận hành' },
        ]}
      />

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start w-full overflow-x-auto min-h-[500px]">
        {KANBAN_STAGES.map((stage) => {
          const stageOrders = getOrdersByStatus(stage.key);

          return (
            <div key={stage.key} className="flex flex-col bg-slate-100/50 border border-slate-200/60 rounded-2xl p-3 min-w-[220px] h-full">
              {/* Column Header */}
              <div className={`flex items-center justify-between p-2.5 rounded-xl border mb-3 shadow-xs ${stage.bgHeader} ${stage.textCol}`}>
                <span className="font-bold text-xs uppercase tracking-wider">{stage.label}</span>
                <span className="font-extrabold text-xs px-2 py-0.5 bg-white/70 rounded-full border border-black/5">{stageOrders.length}</span>
              </div>

              {/* Order Cards container */}
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-0.5">
                {stageOrders.length === 0 ? (
                  <div className="py-8 text-center text-[10px] text-slate-400 font-medium bg-white/30 border border-dashed border-slate-200 rounded-xl">
                    Không có đơn hàng
                  </div>
                ) : (
                  stageOrders.map((order) => {
                    const isUnpaidWarning = order.status === 'READY' && order.paymentStatus !== 'PAID';

                    return (
                      <div
                        key={order.id}
                        className="bg-white border border-slate-200 hover:border-slate-350 rounded-xl p-3 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all gap-3 group relative"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-xs text-blue-600">{order.id}</span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Clock size={10} />
                              <span>{getWaitTime(order.createdAt)}</span>
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-xs truncate">{order.customerName}</h3>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{order.serviceName}</p>
                          <p className="font-bold text-slate-800 text-xs mt-1">{order.amount.toLocaleString('vi-VN')}đ</p>
                        </div>

                        {/* Badges and Actions */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className="text-[10px] font-semibold text-slate-500">Thanh toán:</span>
                            {order.paymentStatus === 'PAID' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-bold border border-emerald-100 flex items-center gap-0.5">
                                <CheckCircle2 size={9} />
                                <span>Đã trả</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[9px] font-bold border border-red-100 flex items-center gap-0.5">
                                <AlertTriangle size={9} />
                                <span>Chưa trả</span>
                              </span>
                            )}
                          </div>

                          {/* Action Button */}
                          {stage.key !== 'RETURNED' && (
                            <button
                              type="button"
                              onClick={() => handleTransition(order)}
                              className={`w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                                isUnpaidWarning
                                  ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                                  : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600'
                              }`}
                            >
                              <span>Tiếp theo</span>
                              <ArrowRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
