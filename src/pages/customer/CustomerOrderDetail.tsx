import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  MessageSquare,
  FileText,
  AlertTriangle,
  XCircle,
  Truck
} from 'lucide-react';
import { PageHeader, useToast } from '../../components/common';

interface ServiceItem {
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

interface MockOrder {
  id: string;
  createdAt: string;
  phone: string;
  customerName: string;
  branchName: string;
  branchAddress: string;
  status: 'COMPLETED' | 'CANCELLED';
  statusLabel: string;
  services: ServiceItem[];
  payment: {
    subtotal: string;
    discount: string;
    total: string;
    status: string;
    statusType: 'PAID' | 'UNPAID';
  };
  logs: {
    time: string;
    message: string;
  }[];
  cancelReason?: string;
}

const mockOrders: Record<string, MockOrder> = {
  'DUDI-123': {
    id: 'DUDI-123',
    createdAt: '15/07/2026 08:30',
    phone: '0901234567',
    customerName: 'Nguyễn Văn An',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    services: [
      { name: '5kg Giặt sấy', quantity: '5 kg', unitPrice: '20.000đ', totalPrice: '100.000đ' },
      { name: 'Vệ sinh giày thể thao', quantity: '1 đôi', unitPrice: '50.000đ', totalPrice: '50.000đ' }
    ],
    payment: {
      subtotal: '150.000đ',
      discount: '0đ',
      total: '150.000đ',
      status: 'Đã thanh toán',
      statusType: 'PAID'
    },
    logs: [
      { time: '09:00', message: 'Tiếp nhận đơn' },
      { time: '10:30', message: 'Đang giặt sấy' },
      { time: '11:15', message: 'Hoàn thành' },
      { time: '12:00', message: 'Đã trả khách' }
    ]
  },
  'DUDI-098': {
    id: 'DUDI-098',
    createdAt: '05/07/2026 09:15',
    phone: '0901234567',
    customerName: 'Nguyễn Văn An',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    services: [
      { name: '3kg Giặt sấy', quantity: '3 kg', unitPrice: '30.000đ', totalPrice: '90.000đ' }
    ],
    payment: {
      subtotal: '90.000đ',
      discount: '0đ',
      total: '90.000đ',
      status: 'Đã thanh toán',
      statusType: 'PAID'
    },
    logs: [
      { time: '09:00', message: 'Tiếp nhận đơn' },
      { time: '10:30', message: 'Đang giặt sấy' },
      { time: '11:15', message: 'Hoàn thành' },
      { time: '12:00', message: 'Đã trả khách' }
    ]
  },
  'DUDI-077': {
    id: 'DUDI-077',
    createdAt: '22/06/2026 14:00',
    phone: '0901234567',
    customerName: 'Nguyễn Văn An',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    status: 'CANCELLED',
    statusLabel: 'Đã hủy',
    cancelReason: 'Khách hàng yêu cầu hủy đơn do thay đổi kế hoạch cá nhân.',
    services: [
      { name: 'Giặt hấp chăn bông', quantity: '1 chiếc', unitPrice: '120.000đ', totalPrice: '120.000đ' }
    ],
    payment: {
      subtotal: '120.000đ',
      discount: '120.000đ',
      total: '0đ',
      status: 'Chưa thanh toán (Đơn đã hủy)',
      statusType: 'UNPAID'
    },
    logs: [
      { time: '14:05', message: 'Tiếp nhận đơn' },
      { time: '14:20', message: 'Đã hủy đơn hàng (Khách hàng yêu cầu)' }
    ]
  }
};

export default function CustomerOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const order = orderId ? mockOrders[orderId.toUpperCase()] : null;

  const handleActionMock = (actionName: string) => {
    toast(`Giả lập chức năng: ${actionName} cho đơn hàng ${order?.id}`, 'info');
  };

  if (!order) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-4xl mx-auto px-4 sm:px-0">
        <PageHeader
          title="Chi tiết đơn hàng"
          description="Xem chi tiết thông tin và tiến trình xử lý đơn hàng."
        />
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700 max-w-xl mx-auto flex flex-col items-center gap-3">
          <AlertTriangle size={28} className="text-red-500" />
          <div>
            <p className="text-sm font-bold">Không tìm thấy đơn hàng</p>
            <p className="text-xs text-red-600 mt-1">Đơn hàng bạn yêu cầu không tồn tại hoặc có thể đã bị xóa.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="mt-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-semibold hover:bg-red-100/50 transition-all cursor-pointer"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-4xl mx-auto px-4 sm:px-0">
      
      {/* Nút quay lại & Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => navigate('/customer/orders')}
          className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <PageHeader
          title={`Đơn hàng ${order.id}`}
          description={`Ngày gửi: ${order.createdAt}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Cột chính trái: Thông tin đơn, Dịch vụ & Thanh toán */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Box 1: Thông tin chung đơn hàng */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Thông tin chung</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="flex flex-col gap-1">
                <span className="text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Mã đơn</span>
                <span className="text-sm font-extrabold text-blue-600">{order.id}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Trạng thái</span>
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    order.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {order.statusLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Khách hàng</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <User size={13} className="text-slate-400" />
                  {order.customerName}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Số điện thoại</span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  {order.phone}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-slate-50">
                <span className="text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Chi nhánh thực hiện</span>
                <span className="text-xs font-bold text-slate-800 flex items-start gap-1">
                  <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>{order.branchName}</strong> - {order.branchAddress}
                  </span>
                </span>
              </div>

            </div>

            {/* Thông báo lý do hủy (DUDI-077) */}
            {order.status === 'CANCELLED' && order.cancelReason && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-2.5 mt-2">
                <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-red-800">Lý do hủy đơn:</span>
                  <span className="text-red-700 font-semibold leading-relaxed">{order.cancelReason}</span>
                </div>
              </div>
            )}

          </div>

          {/* Box 2: Bảng kê dịch vụ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Bảng kê dịch vụ</h3>
            
            {/* Table Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-450 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Tên dịch vụ</th>
                    <th className="py-2.5 text-center">Khối lượng / SL</th>
                    <th className="py-2.5 text-right">Đơn giá</th>
                    <th className="py-2.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.services.map((item, idx) => (
                    <tr key={idx} className="text-slate-700 font-medium">
                      <td className="py-3 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{item.unitPrice}</td>
                      <td className="py-3 text-right font-bold text-slate-800">{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* List Mobile */}
            <div className="flex sm:hidden flex-col gap-3">
              {order.services.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100/50">
                    <span>Đơn giá: {item.unitPrice}</span>
                    <span>Thành tiền: <strong className="text-slate-800 font-bold">{item.totalPrice}</strong></span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Box 3: Tóm tắt thanh toán */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Tóm tắt thanh toán</h3>
            
            <div className="flex flex-col gap-2.5 text-xs">
              
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Tổng tiền dịch vụ:</span>
                <span className="text-slate-800 font-bold">{order.payment.subtotal}</span>
              </div>

              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Giảm giá / Voucher:</span>
                <span className="text-red-500 font-bold">-{order.payment.discount}</span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-800">Thành tiền cuối cùng:</span>
                <span className="text-lg font-black text-blue-600">{order.payment.total}</span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">Trạng thái thanh toán:</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                  order.payment.statusType === 'PAID'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {order.payment.status}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Cột phụ phải: Nhật ký xử lý & Nút hành động */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Box 4: Nhật ký xử lý */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Nhật ký xử lý</h3>
            
            <div className="flex flex-col gap-4 relative pl-3.5 before:absolute before:left-0.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {order.logs.map((log, idx) => (
                <div key={idx} className="relative flex flex-col gap-0.5">
                  {/* Circle indicator */}
                  <div className="absolute left-[-17px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50 border border-white" />
                  
                  <span className="text-[10px] text-slate-400 font-bold font-mono">{log.time}</span>
                  <span className="text-xs font-bold text-slate-700">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 5: Các nút hành động */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-2">Hành động</h3>
            
            {order.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => navigate(`/customer/delivery/${order.id}`)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 border-0"
              >
                <Truck size={14} />
                Giao đồ cho tôi
              </button>
            )}

            <button
              type="button"
              onClick={() => handleActionMock('Chat với cửa hàng')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 border-0"
            >
              <MessageSquare size={14} />
              Chat với cửa hàng
            </button>

            <button
              type="button"
              onClick={() => navigate(`/customer/feedback/${order.id}`)}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} className="text-slate-400" />
              Gửi phản hồi đơn hàng
            </button>

            <button
              type="button"
              onClick={() => handleActionMock('Tải hóa đơn PDF')}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText size={14} className="text-slate-400" />
              Tải hóa đơn PDF
            </button>

            <div className="border-t border-slate-50 pt-3 mt-1">
              <button
                type="button"
                onClick={() => navigate('/customer/orders')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={13} />
                Quay lại danh sách
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
