import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, Zap, Filter, List, Shirt } from 'lucide-react';
import { Drawer } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { useOrderStore } from '../../mocks/orderStore';
import type { Order } from '../../mocks/orderStore';

interface StageConfig {
  key: Order['status'];
  label: string;
  actionText: string;
  bgHeader: string;
  borderCol: string;
  textCol: string;
  badgeBg: string;
}

const KANBAN_STAGES: StageConfig[] = [
  {
    key: 'RECEIVED',
    label: 'Nhận đồ',
    actionText: 'Bắt đầu giặt',
    bgHeader: 'bg-slate-100/90',
    borderCol: 'border-slate-200',
    textCol: 'text-slate-800',
    badgeBg: 'bg-slate-200/80 text-slate-800'
  },
  {
    key: 'WASHING',
    label: 'Đang giặt',
    actionText: 'Chuyển sấy/ủi',
    bgHeader: 'bg-blue-50/90',
    borderCol: 'border-blue-200',
    textCol: 'text-[#2563EB]',
    badgeBg: 'bg-blue-100 text-[#2563EB]'
  },
  {
    key: 'DRYING_IRONING',
    label: 'Đang sấy/ủi/gấp',
    actionText: 'Bàn giao Hoàn tất',
    bgHeader: 'bg-amber-50/90',
    borderCol: 'border-amber-200',
    textCol: 'text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-800'
  },
  {
    key: 'READY',
    label: 'Hoàn tất',
    actionText: 'Trả khách hàng',
    bgHeader: 'bg-emerald-50/90',
    borderCol: 'border-emerald-200',
    textCol: 'text-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  {
    key: 'RETURNED',
    label: 'Đã trả khách',
    actionText: 'Hoàn tất',
    bgHeader: 'bg-indigo-50/90',
    borderCol: 'border-indigo-200',
    textCol: 'text-indigo-800',
    badgeBg: 'bg-indigo-100 text-indigo-800'
  }
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
    if (diffMins < 60) return `Chờ ${diffMins} phút`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Chờ ${diffHours}h`;
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
      toast('Chưa thể trả khách! Đơn hàng chưa được thanh toán đầy đủ.', 'error');
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
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-6 flex flex-col gap-5 text-left">
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

      {/* 1. OPERATIONS FLOOR HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            LAUNDRY OPERATIONS FLOOR
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Quy trình giặt sấy 5 bước tại quầy
          </h1>
        </div>

        {/* Service Filter Toolbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 self-start sm:self-auto bg-white p-1 rounded-lg border border-[#DCE5F0] shadow-2xs">
          <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
            <Filter size={13} className="text-[#2563EB]" />
            Dịch vụ:
          </span>
          {['ALL', 'Giặt sấy', 'Giặt hấp', 'Vệ sinh giày'].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setServiceFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap ${
                serviceFilter === f
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KANBAN BOARD CONTAINER (Compact 5 Columns Viewport Fitted) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start w-full min-w-0 min-h-[560px]">
        {KANBAN_STAGES.map((stage) => {
          const stageOrders = getFilteredOrdersByStatus(stage.key);
          const isOverload = stageOrders.length > 20;

          return (
            <div
              key={stage.key}
              className="flex flex-col bg-white border border-[#DCE5F0] rounded-xl p-3 shadow-2xs h-full min-w-0"
            >
              {/* Column Header with Pastel Accent */}
              <div
                className={`flex flex-col p-2.5 rounded-lg border mb-3 transition-colors ${
                  isOverload
                    ? 'bg-amber-100 border-amber-300'
                    : `${stage.bgHeader} ${stage.borderCol}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-black text-xs uppercase tracking-wider ${isOverload ? 'text-amber-900' : stage.textCol}`}>
                    {stage.label}
                  </span>
                  <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-full border ${stage.badgeBg}`}>
                    {stageOrders.length}
                  </span>
                </div>
                {isOverload && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-800 font-black bg-amber-200/60 px-2 py-0.5 rounded">
                    <AlertTriangle size={11} className="shrink-0" />
                    <span>CẢNH BÁO QUÁ TẢI (&gt;20 đơn)</span>
                  </div>
                )}
              </div>

              {/* Order Cards Container */}
              <div className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto pr-0.5">
                {stageOrders.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 font-semibold bg-[#F8FAFC] border border-dashed border-slate-200 rounded-lg">
                    Chưa có đơn hàng
                  </div>
                ) : (
                  stageOrders.map((order) => {
                    const isUnpaid = order.paymentStatus !== 'PAID';
                    const isReadyStage = order.status === 'READY';
                    const isUrgent = order.id === orders[0]?.id || order.serviceName.toLowerCase().includes('lấy ngay');

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white border border-[#DCE5F0] hover:border-[#2563EB] cursor-pointer rounded-lg p-3 flex flex-col gap-2.5 shadow-2xs hover:shadow-md transition-all group relative text-left"
                      >
                        {/* Order Header: Code + Priority + Wait Time */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-black text-xs text-[#2563EB]">
                            {order.id}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isUrgent && (
                              <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 rounded text-[9px] font-black border border-rose-200 flex items-center gap-0.5">
                                <Zap size={10} fill="currentColor" />
                                Gấp
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Clock size={10} />
                              {getWaitTime(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Customer Name */}
                        <h4 className="font-bold text-sm text-slate-900 truncate leading-tight">
                          {order.customerName}
                        </h4>

                        {/* Service + Weight */}
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 truncate">
                          <Shirt size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{order.serviceName}</span>
                        </div>

                        {/* Amount & Payment Status */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                          <strong className="font-mono font-black text-slate-900">
                            {order.amount.toLocaleString('vi-VN')}đ
                          </strong>

                          {order.paymentStatus === 'PAID' ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                              <CheckCircle2 size={10} />
                              Đã trả
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-bold border border-red-200 flex items-center gap-0.5">
                              <AlertTriangle size={10} />
                              Chưa trả
                            </span>
                          )}
                        </div>

                        {/* STEP ACTION BUTTON (TOUCH-FRIENDLY) */}
                        {stage.key !== 'RETURNED' && (
                          <div className="pt-1">
                            {isReadyStage && isUnpaid ? (
                              <button
                                type="button"
                                disabled
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast('Không thể trả khách! Đơn hàng chưa được thanh toán đầy đủ.', 'error');
                                }}
                                className="w-full py-2 bg-red-50 text-red-500 border border-red-200 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-not-allowed opacity-80"
                              >
                                <AlertTriangle size={12} />
                                <span>Chưa thu tiền (Cần thu đủ)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTransition(order);
                                }}
                                className="w-full py-2 bg-slate-50 hover:bg-[#2563EB] hover:text-white border border-[#DCE5F0] hover:border-[#2563EB] rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-800 shadow-2xs"
                              >
                                <span>{stage.actionText}</span>
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ORDER DETAILS DRAWER */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng - ${selectedOrder?.id || ''}`}
        position="right"
        className="w-full sm:w-[420px]"
      >
        {selectedOrder && (
          <div className="p-5 flex flex-col gap-5 text-left text-slate-800 text-xs">
            
            {/* Header info */}
            <div className="flex flex-col gap-1 border-b border-[#DCE5F0] pb-3">
              <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">
                KHÁCH HÀNG
              </span>
              <h3 className="text-lg font-black text-slate-900">{selectedOrder.customerName}</h3>
              <span className="text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                <Clock size={13} /> Tiếp nhận: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Service & Payment Box */}
            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#DCE5F0] flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">DỊCH VỤ YÊU CẦU</span>
              <p className="text-sm font-black text-[#2563EB]">{selectedOrder.serviceName}</p>
              
              <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2 text-xs font-bold">
                <span className="text-slate-600">Tổng tiền thanh toán:</span>
                <strong className="text-base font-black text-slate-900">{selectedOrder.amount.toLocaleString('vi-VN')}đ</strong>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-bold">Trạng thái thanh toán:</span>
                <span className={`font-extrabold ${selectedOrder.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {selectedOrder.paymentStatus === 'PAID' ? 'Đã thanh toán đủ' : 'Chưa thanh toán'}
                </span>
              </div>
            </div>

            {/* Item list */}
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                <List size={14} className="text-[#2563EB]" />
                Danh sách chi tiết đồ giặt
              </h4>
              <div className="flex flex-col rounded-lg border border-[#DCE5F0] overflow-hidden">
                <div className="flex justify-between items-center p-2.5 bg-white border-b border-slate-100">
                  <span className="font-semibold text-slate-800">1x Áo sơ mi trắng</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Áo</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#F8FAFC] border-b border-slate-100">
                  <span className="font-semibold text-slate-800">2x Quần tây đen</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Quần</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white">
                  <span className="font-semibold text-slate-800">1x Vớ cặp</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Phụ kiện</span>
                </div>
              </div>
            </div>

            {/* Special Notes */}
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600" />
                Ghi chú xử lý đặc biệt
              </h4>
              <div className="bg-amber-50 text-amber-900 p-3 rounded-lg text-xs font-semibold border border-amber-200 leading-relaxed">
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
