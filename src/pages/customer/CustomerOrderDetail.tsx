import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../../components/common';

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
  isDelivered?: boolean;
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
    createdAt: '15/07/2026 · 08:30',
    phone: '0901234567',
    customerName: 'Nguyễn Văn An',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    isDelivered: true,
    services: [
      { name: 'Giặt sấy 5kg', quantity: '5 kg', unitPrice: '20.000đ / kg', totalPrice: '100.000đ' },
      { name: 'Vệ sinh 1 đôi giày thể thao', quantity: '1 đôi', unitPrice: '50.000đ / đôi', totalPrice: '50.000đ' }
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
      { time: '10:30', message: 'Bắt đầu giặt sấy' },
      { time: '11:15', message: 'Hoàn tất xử lý' },
      { time: '12:00', message: 'Đã trả khách' }
    ]
  },
  'DUDI-098': {
    id: 'DUDI-098',
    createdAt: '05/07/2026 · 09:15',
    phone: '0901234567',
    customerName: 'Nguyễn Văn An',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    status: 'COMPLETED',
    statusLabel: 'Đã hoàn thành',
    isDelivered: true,
    services: [
      { name: 'Giặt sấy 3kg', quantity: '3 kg', unitPrice: '30.000đ / kg', totalPrice: '90.000đ' }
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
      { time: '10:30', message: 'Bắt đầu giặt sấy' },
      { time: '11:15', message: 'Hoàn tất xử lý' },
      { time: '12:00', message: 'Đã trả khách' }
    ]
  },
  'DUDI-077': {
    id: 'DUDI-077',
    createdAt: '22/06/2026 · 14:00',
    phone: '0901234567',
    customerName: 'Nguyễn Văn An',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    status: 'CANCELLED',
    statusLabel: 'Đã hủy',
    isDelivered: false,
    cancelReason: 'Khách hàng yêu cầu hủy đơn do thay đổi kế hoạch cá nhân.',
    services: [
      { name: 'Giặt hấp chăn bông', quantity: '1 chiếc', unitPrice: '120.000đ / chiếc', totalPrice: '120.000đ' }
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

const getServiceThumbnail = (serviceName: string) => {
  const lower = serviceName.toLowerCase();
  if (lower.includes('giày')) return '/images/customer/shoes-bedding.jpg';
  if (lower.includes('chăn') || lower.includes('mền')) return '/images/customer/shoes-bedding.jpg';
  if (lower.includes('hấp') || lower.includes('vest')) return '/images/customer/dry-cleaning.jpg';
  return '/images/customer/pic1.jpg';
};

export default function CustomerOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const order = orderId ? mockOrders[orderId.toUpperCase()] : null;

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-hidden');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [order]);

  const handleBack = () => {
    if (location.state) {
      navigate('/customer/orders', { state: location.state });
    } else {
      navigate('/customer/orders');
    }
  };

  const handleReorder = () => {
    toast(`Đã yêu cầu đặt lại đơn hàng ${order?.id} thành công!`, 'success');
  };

  const handleActionMock = (actionName: string) => {
    toast(`Giả lập chức năng: ${actionName} cho đơn hàng ${order?.id}`, 'info');
  };

  if (!order) {
    return (
      <div className="w-full bg-[#F4F7FB] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col py-12">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 w-full text-center flex flex-col items-center gap-3">
          <AlertTriangle size={32} className="text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">Không tìm thấy đơn hàng</h2>
          <p className="text-xs text-slate-500">Đơn hàng bạn yêu cầu không tồn tại hoặc có thể đã bị xóa.</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-2 px-4 py-2 bg-[#1F63FF] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer border-0"
          >
            Quay lại lịch sử
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = order.status === 'COMPLETED';

  return (
    <div className="w-full bg-[#F4F7FB] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col pb-16">
      <style>{`
        .reveal-hidden {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          .reveal-hidden {
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .reveal-hidden.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .stagger-1 { transition-delay: 80ms; }
          .stagger-2 { transition-delay: 160ms; }
          .stagger-3 { transition-delay: 180ms; }
        }
      `}</style>

      {/* BACK BUTTON BAR */}
      <div className="w-full border-b border-[#DCE5F0] py-3 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1F63FF] bg-transparent border-0 cursor-pointer p-0 transition-colors"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            <span>Quay lại lịch sử đơn hàng</span>
          </button>
        </div>
      </div>

      {/* 2. ORDER HEADER (With DUDI Blue left accent line) */}
      <header className="w-full py-6 md:py-8 bg-white border-b border-[#DCE5F0]">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left border-l-4 border-l-[#1F63FF] pl-4 md:pl-6">
          
          {/* Left Header info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-[40px] font-black text-slate-900 tracking-tight leading-none">
                {order.id}
              </h1>
              {/* Dot Status */}
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  {order.statusLabel}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  {order.statusLabel}
                </span>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-2">
              <span>Đơn đã hoàn tất · {order.createdAt}</span>
              <span>•</span>
              <span className="text-slate-800">{order.branchName}</span>
            </div>
          </div>

          {/* Right Header total info */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TỔNG THANH TOÁN
            </span>
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
              {order.payment.total}
            </span>
            <span className={`text-xs font-bold mt-1 ${order.payment.statusType === 'PAID' ? 'text-emerald-600' : 'text-slate-400'}`}>
              ● {order.payment.status}
            </span>
          </div>

        </div>
      </header>

      {/* 3. MAIN LAYOUT DESKTOP (Left ~68% Services pure white, Right ~32% #EEF4FF surface) */}
      <main className="w-full py-8 flex-grow">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 w-full text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* LEFT COLUMN (~68% / lg:col-span-8): Services, Payment Receipt, Customer Info */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* 1. PHẦN DỊCH VỤ (White Background Surface) */}
              <section className="bg-white p-6 md:p-8 rounded-2xl border border-[#DCE5F0] flex flex-col reveal-hidden shadow-2xs">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 border-b border-[#DCE5F0] pb-2">
                  Dịch vụ trong đơn
                </h3>

                <div className="flex flex-col divide-y divide-[#DCE5F0]">
                  {order.services.map((item, idx) => (
                    <div
                      key={idx}
                      className="group py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-grow">
                        {/* Service Image 260x170px desktop */}
                        <div className="relative w-full sm:w-[260px] h-[170px] shrink-0 overflow-hidden rounded-lg border border-[#DCE5F0] bg-slate-100">
                          <img
                            src={getServiceThumbnail(item.name)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono tracking-widest uppercase rounded">
                            DUDI CARE
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="flex flex-col text-left">
                          <h4 className="text-base md:text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                            {item.name}
                          </h4>
                          <span className="text-xs text-slate-500 font-medium mt-1">
                            Khối lượng / SL: <strong className="text-slate-800">{item.quantity}</strong>
                          </span>
                          <span className="text-xs text-slate-400 font-medium mt-1">
                            Đơn giá: {item.unitPrice}
                          </span>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0">
                        <span className="text-lg md:text-xl font-black text-[#1F63FF]">
                          {item.totalPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. THANH TOÁN (#F7FAFF Secondary Surface Layout) */}
              <section className="bg-[#F7FAFF] p-6 rounded-2xl border border-[#DCE5F0] flex flex-col reveal-hidden stagger-1 shadow-2xs">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 border-b border-[#DCE5F0] pb-2">
                  Thanh toán
                </h3>

                <div className="flex flex-col gap-3 text-xs max-w-md">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Tiền dịch vụ</span>
                    <span className="font-bold text-slate-900">{order.payment.subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Giảm giá / Voucher</span>
                    <span className="font-bold text-slate-900">{order.payment.discount}</span>
                  </div>

                  <div className="w-full border-b border-[#DCE5F0] my-1"></div>

                  <div className="flex justify-between items-center text-base font-extrabold text-slate-900">
                    <span>Tổng thanh toán</span>
                    <span className="text-xl md:text-2xl font-black text-slate-900">{order.payment.total}</span>
                  </div>

                  <div className="flex justify-start">
                    <span className={`text-xs font-bold ${order.payment.statusType === 'PAID' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      ● {order.payment.status}
                    </span>
                  </div>
                </div>
              </section>

              {/* 6. THÔNG TIN NGƯỜI NHẬN & CHI NHÁNH */}
              <section className="bg-white p-6 rounded-2xl border border-[#DCE5F0] flex flex-col reveal-hidden stagger-2 shadow-2xs">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 border-b border-[#DCE5F0] pb-2">
                  Thông tin người nhận & Chi nhánh
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
                  {/* Customer info */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Người nhận
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {order.phone}
                    </span>
                  </div>

                  {/* Branch info */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Chi nhánh xử lý
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {order.branchName}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {order.branchAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/customer/support')}
                      className="mt-1 text-xs font-bold text-[#1F63FF] hover:underline bg-transparent border-0 cursor-pointer p-0 text-left"
                    >
                      Xem chi nhánh →
                    </button>
                  </div>
                </div>

                {/* Cancellation notice if cancelled (DUDI-077) */}
                {order.status === 'CANCELLED' && order.cancelReason && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-1 text-xs text-left">
                    <span className="font-bold text-red-800">Lý do hủy đơn:</span>
                    <span className="text-red-700 font-medium">{order.cancelReason}</span>
                  </div>
                )}
              </section>

            </div>

            {/* RIGHT COLUMN (~32% / lg:col-span-4): #EEF4FF Timeline & Action Surface */}
            <aside className="lg:col-span-4 bg-[#EEF4FF] p-6 md:p-8 rounded-2xl border border-[#DCE5F0] flex flex-col gap-8 shadow-2xs">

              {/* 4. HÀNH TRÌNH ĐƠN HÀNG (Vertical Timeline with Glowing Active Node) */}
              <section className="flex flex-col reveal-hidden">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4 border-b border-[#DCE5F0] pb-2">
                  Hành trình đơn hàng
                </h3>

                <div className="flex flex-col relative pl-4 border-l-2 border-[#DCE5F0] gap-6">
                  {order.logs.map((log, idx) => {
                    const isLast = idx === order.logs.length - 1;
                    return (
                      <div key={idx} className="relative flex flex-col gap-0.5">
                        {/* Circle dot on vertical line */}
                        <div
                          className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                            isLast && isCompleted
                              ? 'bg-[#1F63FF] ring-4 ring-blue-100 shadow-2xs'
                              : isLast && !isCompleted
                              ? 'bg-red-500 ring-4 ring-red-100 shadow-2xs'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-mono font-semibold text-slate-400">
                          {log.time}
                        </span>
                        <span className={`text-xs font-bold ${isLast ? 'text-slate-900' : 'text-slate-600'}`}>
                          {log.message}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 7. ACTIONS (1 Primary Button + Text Actions with Hover Arrow) */}
              <section className="flex flex-col gap-3 reveal-hidden stagger-1 border-t border-[#DCE5F0] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Hành động
                </h3>

                {/* Primary Button */}
                <button
                  type="button"
                  onClick={handleReorder}
                  className="w-full py-3.5 bg-[#1F63FF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-0 shadow-2xs flex items-center justify-center gap-2"
                >
                  <RotateCcw size={15} />
                  <span>Đặt lại dịch vụ</span>
                </button>

                {/* Text Actions */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/customer/support?orderId=${order.id}`)}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1F63FF] bg-transparent border-0 cursor-pointer p-0 text-left transition-colors"
                  >
                    <span>Chat với cửa hàng</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Feedback link (Hidden for CANCELLED order DUDI-077) */}
                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => navigate(`/customer/feedback/${order.id}`)}
                      className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1F63FF] bg-transparent border-0 cursor-pointer p-0 text-left transition-colors"
                    >
                      <span>Gửi phản hồi</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleActionMock('Tải hóa đơn PDF')}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1F63FF] bg-transparent border-0 cursor-pointer p-0 text-left transition-colors"
                  >
                    <span>Tải hóa đơn PDF</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </section>

            </aside>

          </div>
        </div>
      </main>

    </div>
  );
}
