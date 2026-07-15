import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock, CheckCircle2, User, Phone, MapPin, DollarSign, Calendar } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/common';

interface MockOrder {
  id: string;
  customerName: string;
  phone: string;
  status: 'RECEIVED' | 'WASHING' | 'DRYING_IRONING' | 'READY' | 'RETURNED';
  amount: string;
  service: string;
  createdAt: string;
}

const mockOrders: Record<string, MockOrder> = {
  'DL-001': {
    id: 'DL-001',
    customerName: 'Nguyễn Văn An',
    phone: '0901234567',
    status: 'WASHING',
    amount: '150.000đ',
    service: 'Giặt sấy tiêu chuẩn & Vệ sinh giày',
    createdAt: '2026-07-15T08:00:00Z'
  },
  'DL-002': {
    id: 'DL-002',
    customerName: 'Nguyễn Văn An',
    phone: '0901234567',
    status: 'RETURNED',
    amount: '80.000đ',
    service: 'Giặt hấp áo vest',
    createdAt: '2026-07-14T09:30:00Z'
  }
};

const STAGES: { key: MockOrder['status']; label: string }[] = [
  { key: 'RECEIVED', label: 'Nhận đồ' },
  { key: 'WASHING', label: 'Đang giặt' },
  { key: 'DRYING_IRONING', label: 'Đang sấy/ủi/gấp' },
  { key: 'READY', label: 'Hoàn tất' },
  { key: 'RETURNED', label: 'Đã trả khách' }
];

export default function CustomerOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = orderId ? mockOrders[orderId.toUpperCase()] : null;

  const getStageIndex = (status: MockOrder['status']) => {
    return STAGES.findIndex(s => s.key === status);
  };

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

  if (!order) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-900">
        <PageHeader
          title="Chi tiết đơn hàng"
          description="Xem chi tiết trạng thái và lịch sử xử lý đơn hàng."
        />
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700 max-w-xl">
          <p className="text-sm font-bold">Không tìm thấy đơn hàng</p>
          <p className="text-xs text-red-600 mt-1">Đơn hàng bạn yêu cầu không tồn tại hoặc bạn không có quyền truy cập.</p>
          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-semibold hover:bg-red-100/50 transition-all cursor-pointer"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const statusItem = getStatusItem(order.status);
  const date = new Date(order.createdAt);
  const formattedDate = `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}`;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-900">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/customer/orders')}
          className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <PageHeader
          title={`Chi tiết đơn hàng ${order.id}`}
          description="Kiểm tra thông tin chi tiết và tiến trình xử lý dịch vụ giặt ủi."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-4xl">
        {/* Detail Info Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin đơn hàng</h2>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs gap-3">
              <span className="text-slate-500 font-medium">Mã đơn hàng:</span>
              <span className="font-extrabold text-blue-600">{order.id}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs gap-3">
              <span className="text-slate-500 font-medium">Trạng thái hiện tại:</span>
              <StatusBadge label={statusItem.label} variant={statusItem.variant} />
            </div>

            <div className="flex items-center justify-between text-xs gap-3">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <User size={14} className="text-slate-400" />
                <span>Khách hàng:</span>
              </span>
              <span className="font-bold text-slate-800">{order.customerName}</span>
            </div>

            <div className="flex items-center justify-between text-xs gap-3">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Phone size={14} className="text-slate-400" />
                <span>Số điện thoại:</span>
              </span>
              <span className="font-bold text-slate-800">{order.phone}</span>
            </div>

            <div className="flex items-center justify-between text-xs gap-3">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                <span>Thời gian tạo:</span>
              </span>
              <span className="font-medium text-slate-700">{formattedDate}</span>
            </div>

            <div className="flex items-start justify-between text-xs gap-3 pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin size={14} className="text-slate-400" />
                <span>Dịch vụ:</span>
              </span>
              <span className="font-semibold text-slate-800 text-right max-w-[200px] leading-normal">{order.service}</span>
            </div>

            <div className="flex items-center justify-between text-xs gap-3 pt-2 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <DollarSign size={15} className="text-slate-400" />
                <span>Tổng tiền:</span>
              </span>
              <span className="text-base font-extrabold text-blue-600">{order.amount}</span>
            </div>
          </div>
        </div>

        {/* Timeline Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Tiến độ xử lý</h2>
          
          <div className="flex flex-col gap-6 relative pl-6 border-l-2 border-slate-100">
            {STAGES.map((stage, idx) => {
              const activeIdx = getStageIndex(order.status);
              const isCompleted = idx < activeIdx;
              const isActive = idx === activeIdx;
              
              return (
                <div key={stage.key} className="relative flex items-center gap-4">
                  {/* Timeline bullet */}
                  <div className={`absolute left-[-33px] w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isActive
                      ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                      : 'bg-white border-slate-200'
                  }`}>
                    {isCompleted && <CheckCircle2 size={10} />}
                    {isActive && <Clock size={10} />}
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${
                      isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}>{stage.label}</span>
                    {isActive && (
                      <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Hiện tại</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
