import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, Zap, Filter, List } from 'lucide-react';
import { PageHeader, Drawer } from '../../components/common';
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
  
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  // Filter orders by status and service
  const getFilteredOrdersByStatus = (status: Order['status']) => {
    return orders.filter(o => {
      const matchStatus = o.status === status;
      const matchService = serviceFilter === 'ALL' || o.serviceName.toLowerCase().includes(serviceFilter.toLowerCase());
      return matchStatus && matchService;
    });
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

      {/* Service Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-sm font-semibold text-slate-700 mr-2 flex items-center gap-1.5"><Filter size={16}/> Lọc dịch vụ:</span>
        {['ALL', 'Giặt sấy', 'Giặt hấp', 'Vệ sinh giày'].map(f => (
          <button
            key={f}
            onClick={() => setServiceFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              serviceFilter === f 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'ALL' ? 'Tất cả' : f}
          </button>
        ))}
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start w-full overflow-x-auto min-h-[500px]">
        {KANBAN_STAGES.map((stage) => {
          const stageOrders = getFilteredOrdersByStatus(stage.key);
          const isOverload = stageOrders.length > 20;

          return (
            <div key={stage.key} className="flex flex-col bg-slate-100/50 border border-slate-200/60 rounded-2xl p-3 min-w-[220px] h-full">
              {/* Column Header */}
              <div className={`flex flex-col p-2.5 rounded-xl border mb-3 shadow-xs transition-colors ${
                isOverload ? 'bg-red-50 border-red-200' : `${stage.bgHeader} ${stage.borderCol}`
              }`}>
                <div className={`flex items-center justify-between ${isOverload ? 'text-red-700' : stage.textCol}`}>
                  <span className="font-bold text-xs uppercase tracking-wider">{stage.label}</span>
                  <span className={`font-extrabold text-xs px-2 py-0.5 rounded-full border ${isOverload ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white/70 border-black/5 text-slate-800'}`}>
                    {stageOrders.length}
                  </span>
                </div>
                {isOverload && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-red-600 font-bold bg-white/50 px-2 py-1 rounded-md w-fit">
                    <AlertTriangle size={10} />
                    <span>Quá tải đơn hàng!</span>
                  </div>
                )}
              </div>

              {/* Order Cards container */}
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-0.5 pb-2">
                {stageOrders.length === 0 ? (
                  <div className="py-8 text-center text-[10px] text-slate-400 font-medium bg-white/30 border border-dashed border-slate-200 rounded-xl">
                    Không có đơn hàng
                  </div>
                ) : (
                  stageOrders.map((order) => {
                    const isUnpaidWarning = order.status === 'READY' && order.paymentStatus !== 'PAID';
                    // Đánh dấu Ưu tiên nếu là đơn đầu tiên hoặc dịch vụ là lấy ngay
                    const isUrgent = order.id === orders[0]?.id || order.serviceName.toLowerCase().includes('lấy ngay');

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white border border-slate-200 hover:border-blue-400 cursor-pointer rounded-xl p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all gap-3 group relative"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-xs text-blue-600">{order.id}</span>
                            <div className="flex items-center gap-1.5">
                              {isUrgent && (
                                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-bold border border-rose-100 flex items-center gap-0.5" title="Ưu tiên lấy ngay">
                                  <Zap size={9} fill="currentColor" />
                                  Ưu tiên
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Clock size={10} />
                                <span>{getWaitTime(order.createdAt)}</span>
                              </span>
                            </div>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTransition(order);
                              }}
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

      {/* Order Details Drawer Mock */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn - ${selectedOrder?.id || ''}`}
        position="right"
        className="w-full sm:w-[400px]"
      >
        {selectedOrder && (
          <div className="p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-slate-900">{selectedOrder.customerName}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Clock size={14} /> Tiếp nhận lúc: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-1">
              <h4 className="font-bold text-sm text-slate-800 mb-1">Dịch vụ yêu cầu</h4>
              <p className="text-sm text-blue-700 font-semibold">{selectedOrder.serviceName}</p>
              <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                <span className="text-sm text-slate-600">Tổng tiền:</span>
                <span className="font-bold text-slate-900">{selectedOrder.amount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2"><List size={16}/> Danh sách đồ giặt</h4>
              <div className="flex flex-col gap-0 rounded-lg border border-slate-200 overflow-hidden">
                {/* Mock data items */}
                <div className="flex justify-between items-center text-sm p-3 bg-white border-b border-slate-100">
                  <span className="text-slate-700 font-medium">1x Áo sơ mi trắng</span>
                  <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-100 rounded">Áo</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-slate-700 font-medium">2x Quần tây đen</span>
                  <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-100 rounded">Quần</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-white">
                  <span className="text-slate-700 font-medium">1x Vớ cặp</span>
                  <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-100 rounded">Phụ kiện</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Ghi chú đặc biệt</h4>
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm border border-amber-200 shadow-inner">
                {/* Mock note condition */}
                {selectedOrder.id === orders[0]?.id 
                  ? 'Khách cần lấy gấp đi công tác. Nhớ dùng túi thơm đặc biệt và ủi ly thật kỹ.' 
                  : 'Không có ghi chú gì thêm.'}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
