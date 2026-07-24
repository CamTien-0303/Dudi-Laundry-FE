import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin,
  Star,
  Clock,
  Sparkles,
  Shirt,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  User,
  X
} from 'lucide-react';

const SERVICE_EXTRA_DETAILS: Record<string, {
  suitableFor: string;
  careNotes: string;
  tags: string[];
  tipNote: string;
}> = {
  'giat-say': {
    suitableFor: 'Quần áo mặc hàng ngày, đồ cotton, đồ lanh, khăn tắm, đồng phục, đồ thể thao.',
    careNotes: 'Sử dụng nước giặt sinh học dịu nhẹ, sấy khô 100% ở nhiệt độ an toàn chống ẩm mốc.',
    tags: ['Dịu nhẹ cho vải', 'Không phai màu', 'Sấy khô tiệt trùng 100%', 'Xử lý vết bẩn kỹ', 'Tự động phân loại đồ màu'],
    tipNote: 'Mẹo nhỏ: DUDI hỗ trợ phân loại riêng đồ trắng và đồ màu miễn phí cho tất cả các đơn giặt sấy.'
  },
  'giat-hap': {
    suitableFor: 'Đồ vest, áo khoác dạ, đầm lụa, áo dài, trang phục thiết kế cao cấp, cà vạt, khăn quàng lụa.',
    careNotes: 'Dùng dung môi khô sinh học nhập khẩu hoàn toàn từ Châu Âu, là hơi phom thủ công tỉ mỉ.',
    tags: ['Giữ phom chuẩn 100%', 'Bảo vệ sợi vải nhạy cảm', 'Dung môi sinh học an toàn', 'Là hơi thủ công tỉ mỉ', 'Bảo hiểm đồ may mặc'],
    tipNote: 'Cam kết: Đồ hấp cao cấp được gắn mã vạch theo dõi quy trình giặt khô riêng biệt và kiểm soát nghiêm ngặt.'
  },
  'giat-giay-tui': {
    suitableFor: 'Giày thể thao, giày da, túi vải, túi hàng hiệu, chăn drap, rèm cửa khổ lớn.',
    careNotes: 'Chăm sóc thủ công chuyên sâu bằng bàn chải lông mềm kết hợp hấp tiệt trùng khử mùi Ozon 99.9%.',
    tags: ['Tẩy ố đế & làm sạch dây', 'Hấp Ozon khử mùi 99.9%', 'Phục hồi phom & màu sắc', 'Sấy nhiệt thấp an toàn', 'Bảo vệ phụ kiện kim loại'],
    tipNote: 'Lưu ý: Giày da hoặc túi hàng hiệu cao cấp được chụp ảnh tình trạng trước và sau khi làm sạch.'
  }
};

const SERVICES = [
  {
    id: 'giat-say',
    title: 'Giặt sấy',
    badge: 'Phổ biến',
    desc: 'Giặt sấy tiêu chuẩn, nhanh chóng và sạch sẽ cho quần áo hàng ngày của bạn.',
    detailDesc: 'Giặt sấy tiêu chuẩn sử dụng máy giặt sấy công nghệ cao, quần áo được phân loại kỹ, giặt bằng nước sạch và sấy khô hoàn toàn ở nhiệt độ thích hợp. Phù hợp cho quần áo mặc hàng ngày, đồ cotton, đồ lanh, khăn tắm.',
    price: '20.000đ / kg',
    time: '4 - 6 giờ (Lấy nhanh) hoặc 24 giờ (Tiết kiệm)',
    icon: <Sparkles size={24} />,
    bgIcon: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'giat-hap',
    title: 'Giặt hấp',
    badge: 'Premium',
    desc: 'Dịch vụ giặt hấp cao cấp dành riêng cho đồ vest, đầm dạ hội và quần áo đặc biệt.',
    detailDesc: 'Giặt hấp (giặt khô) bảo vệ tối ưu sợi vải cao cấp nhạy cảm, sử dụng dung môi sinh học thân thiện môi trường để loại bỏ vết bẩn cứng đầu mà không gây co rút hay bạc màu. Dành riêng cho đồ vest, áo khoác dạ, đầm lụa, áo dài.',
    price: '80.000đ - 150.000đ / món',
    time: '2 - 3 ngày',
    icon: <Star size={24} />,
    bgIcon: 'bg-amber-50 text-amber-600'
  },
  {
    id: 'giat-giay-tui',
    title: 'Giặt giày & túi',
    badge: 'Mới',
    desc: 'Chăm sóc, khử mùi và phục hồi chuyên sâu cho các dòng giày sneaker và túi xách.',
    detailDesc: 'Chăm sóc thủ công chuyên sâu cho các dòng giày thể thao, giày da, túi vải, túi hiệu. Quy trình làm sạch tỉ mỉ kết hợp hấp khử mùi Ozon và sấy khô chuyên dụng giúp hồi sinh phom dáng và màu sắc ban đầu.',
    price: '50.000đ - 120.000đ / đôi/món',
    time: '1 - 2 ngày',
    icon: <Shirt size={24} />,
    bgIcon: 'bg-emerald-50 text-emerald-600'
  }
];

const BRANCHES = [
  {
    id: 'q1',
    name: 'DUDI Quận 1',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    hours: '7:00 - 21:00',
    hotline: '0901 123 456',
    status: 'open',
    statusLabel: 'Đang mở',
    services: ['Giặt sấy', 'Giặt hấp', 'Giày & túi'],
    processingTime: '6–24 giờ',
    coverage: 'Quận 1, Quận 3, Quận 4',
    amenities: ['Thanh toán QR', 'Giữ đồ 3 ngày', 'Hỗ trợ Zalo'],
    note: 'Có dịch vụ giặt nhanh trong ngày'
  },
  {
    id: 'q3',
    name: 'DUDI Quận 3',
    address: '456 Võ Văn Tần, Quận 3, TP.HCM',
    hours: '7:00 - 21:00',
    hotline: '0901 456 789',
    status: 'open',
    statusLabel: 'Đang mở',
    services: ['Giặt sấy', 'Giặt hấp', 'Chăn drap & rèm'],
    processingTime: '8–24 giờ',
    coverage: 'Quận 3, Quận 10, Phú Nhuận',
    amenities: ['Bãi giữ xe', 'Thanh toán QR', 'Hỗ trợ Zalo'],
    note: 'Nhận đồ số lượng lớn và khách hàng B2B'
  },
  {
    id: 'thu_duc',
    name: 'DUDI Thủ Đức',
    address: '789 Võ Văn Ngân, Thủ Đức, TP.HCM',
    hours: '7:00 - 21:00',
    hotline: '0901 789 123',
    status: 'closed',
    statusLabel: 'Đã đóng',
    services: ['Giặt sấy', 'Giày & túi', 'Chăn drap'],
    processingTime: '12–24 giờ',
    coverage: 'TP. Thủ Đức',
    amenities: ['Bãi giữ xe', 'Giữ đồ 3 ngày'],
    note: 'Hiện đang đóng, chưa nhận đơn mới'
  }
];

export default function CustomerHome() {
  const navigate = useNavigate();
  
  const [pageState, setPageState] = useState<'normal' | 'loading' | 'error'>('normal');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  // Animation states
  const [memberPoints, setMemberPoints] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;

    if (!isReduced && typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const target = entry.target as HTMLElement & { _intervalId?: any };
          if (entry.isIntersecting) {
            target.classList.add('is-visible');
            
            if (target.id === 'member-strip') {
              setMemberPoints(0);
              setProgressWidth(0);
              let current = 0;
              const maxTarget = 320;
              const step = maxTarget / 30; 
              const interval = setInterval(() => {
                current += step;
                if (current >= maxTarget) {
                  setMemberPoints(maxTarget);
                  clearInterval(interval);
                } else {
                  setMemberPoints(Math.floor(current));
                }
              }, 30);
              setTimeout(() => setProgressWidth(64), 50);
              target._intervalId = interval;
            }
          } else {
            target.classList.remove('is-visible');
            if (target.id === 'member-strip') {
              setMemberPoints(0);
              setProgressWidth(0);
              if (target._intervalId) {
                clearInterval(target._intervalId);
              }
            }
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

      const elements = document.querySelectorAll('.reveal-hidden');
      elements.forEach(el => observerRef.current?.observe(el));
    } else {
      document.querySelectorAll('.reveal-hidden').forEach(el => {
        el.classList.add('is-visible');
      });
      setMemberPoints(320);
      setProgressWidth(64);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col animate-fadeIn">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .reveal-hidden {
            opacity: 0;
            transform: translateY(28px);
            transition: all 750ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .reveal-from-left { transform: translateX(-40px); }
          .reveal-from-right { transform: translateX(40px); }
          .reveal-from-bottom { transform: translateY(28px); }
          
          .is-visible {
            opacity: 1 !important;
            transform: translate(0, 0) !important;
          }
          
          .stagger-1 { transition-delay: 100ms; }
          .stagger-2 { transition-delay: 200ms; }
          .stagger-3 { transition-delay: 300ms; }

          .img-zoom-container { overflow: hidden; }
          .img-zoom {
            transform: scale(1.03);
            transition: transform 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .img-zoom.is-visible { transform: scale(1); }
          .img-zoom-container:hover .img-zoom { transform: scale(1.05); }

          .marquee-content {
            display: inline-flex;
            animation: marquee 25s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .link-underline {
            position: relative;
          }
          .link-underline::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: currentColor;
            transform-origin: bottom right;
            transition: transform 0.3s ease-out;
          }
          .group:hover .link-underline::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
          
          .store-card {
            transition: all 0.3s ease;
          }
          .store-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            border-color: #cbd5e1;
          }
          .btn-primary-hover {
            transition: all 0.3s ease;
          }
          .btn-primary-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
          }
          .progress-bar {
            transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
          }
        }
      `}</style>

      {pageState === 'loading' && (
        <div className="flex flex-col gap-6 items-center justify-center py-24 text-center bg-white border border-slate-200 rounded-3xl shadow-3xs m-6">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-extrabold text-slate-800">Đang cập nhật dữ liệu...</p>
            <p className="text-xs text-slate-400 font-semibold">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}

      {pageState === 'error' && (
        <div className="flex flex-col gap-5 items-center justify-center py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-3xs max-w-md mx-auto w-full m-6">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shadow-inner">
            <AlertCircle size={28} className="animate-none" />
          </div>
          <div className="flex flex-col gap-1 px-6">
            <p className="text-base font-extrabold text-slate-900">Không thể tải thông tin trang chủ</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Kết nối mạng không ổn định hoặc hệ thống đang gặp sự cố tải dữ liệu. Vui lòng thử lại.
            </p>
          </div>
          <button
            onClick={() => setPageState('normal')}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer border-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {pageState === 'normal' && (
        <>
          {/* Hero Section */}
          <section className="relative w-full h-[100svh] min-h-[600px] bg-slate-900 overflow-hidden flex items-center justify-start">
            <video 
              src="/videos/dudi-laundry-hero.mp4" 
              autoPlay muted loop playsInline preload="metadata"
              poster="/images/dudi-laundry-hero-poster.jpg"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            
            <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col items-start pt-[68px]">
              <div className="max-w-[560px] flex flex-col gap-4 text-left">
                <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-white leading-[1.1] uppercase tracking-tight">
                  GIẶT ỦI, GIAO TẬN NƠI.
                </h1>
                <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed max-w-[480px]">
                  DUDI nhận đồ tận nhà, chăm sóc đúng yêu cầu và giao lại đúng hẹn.<br />
                  Đặt lịch trong vài phút và theo dõi toàn bộ quá trình xử lý.
                </p>

                {/* Action Wrapper */}
                <div className="w-full max-w-[490px] flex flex-col items-stretch gap-3 mt-4">
                  {/* Booking Bar */}
                  <div 
                    className="bg-white rounded-xl flex items-center w-full p-1 shadow-lg cursor-pointer hover:shadow-xl transition-all" 
                    onClick={() => navigate('/customer/pickup')}
                  >
                    <div className="flex-1 px-4 py-2 flex flex-col border-r border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Dịch vụ</span>
                      <span className="text-sm font-extrabold text-slate-800">Giặt sấy</span>
                    </div>
                    <div className="flex-1 px-4 py-2 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Lấy đồ</span>
                      <span className="text-sm font-extrabold text-slate-800">Chọn thời gian</span>
                    </div>
                    <div className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center mx-1 transition-colors">
                      <ArrowRight size={20} />
                    </div>
                  </div>

                  {/* Small links */}
                  <div className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 px-1">
                    <button onClick={() => navigate('/customer/track')} className="text-xs font-bold text-white hover:text-white/70 transition-colors border-0 bg-transparent cursor-pointer p-0">Tra cứu đơn</button>
                    <button onClick={() => navigate('/customer/loyalty')} className="text-xs font-bold text-white hover:text-white/70 transition-colors border-0 bg-transparent cursor-pointer p-0">Ví tích điểm</button>
                    <button onClick={() => navigate('/customer/orders')} className="text-xs font-bold text-white hover:text-white/70 transition-colors border-0 bg-transparent cursor-pointer p-0">Lịch sử giặt ủi</button>
                    <button onClick={() => navigate('/customer/support')} className="text-xs font-bold text-white hover:text-white/70 transition-colors border-0 bg-transparent cursor-pointer p-0">Hỗ trợ / Zalo</button>
                  </div>

                  {/* Floating order status */}
                  <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 text-white shadow-lg mt-2">
                    <div className="flex flex-col gap-0.5 text-left shrink-0">
                      <span className="text-xs font-extrabold tracking-wider">Đơn DUDI-125</span>
                      <span className="text-[10px] text-white/70">Dự kiến hoàn tất 18:00</span>
                    </div>
                    <div className="flex-1 flex justify-start md:justify-center min-w-[80px]">
                      <span className="px-2.5 py-1 bg-white/20 rounded-md text-[10px] font-bold whitespace-nowrap">Đang giặt sấy</span>
                    </div>
                    <button onClick={() => navigate('/customer/track?orderId=DUDI-125')} className="text-xs font-bold hover:text-blue-200 transition-colors flex items-center justify-end gap-1 cursor-pointer border-0 bg-transparent text-white p-0 shrink-0">
                      Xem tiến độ <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm border-t border-white/10">
              <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-16 py-3 flex flex-wrap items-center justify-start md:justify-between gap-x-6 gap-y-2 text-[10px] sm:text-[11px] font-bold text-white/80 uppercase tracking-wider">
                <span>Nhận đồ tận nơi</span>
                <span className="hidden md:inline">·</span>
                <span>Theo dõi đơn trực tuyến</span>
                <span className="hidden md:inline">·</span>
                <span>Hỗ trợ qua Zalo</span>
                <span className="hidden md:inline">·</span>
                <span>Hoạt động 07:00–21:00</span>
              </div>
            </div>
          </section>

          {/* Section 1 */}
          <section className="flex flex-col md:flex-row w-full bg-white overflow-hidden reveal-hidden reveal-from-bottom">
            <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[400px] bg-slate-100 img-zoom-container relative">
              <div 
                className="absolute inset-0 bg-cover bg-center img-zoom reveal-hidden reveal-from-left" 
                style={{ backgroundImage: "url('/images/customer/wash-fold.jpg')" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 z-10">
                <Sparkles size={80} opacity={0.2} strokeWidth={1} />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center p-8 md:p-16 lg:p-24 bg-white z-10 reveal-hidden reveal-from-right stagger-1">
              <div className="max-w-[480px] flex flex-col gap-4 text-left relative">
                <span className="absolute -top-10 -left-6 text-[100px] font-black text-blue-50 opacity-50 z-0 pointer-events-none select-none">01</span>
                <h2 className="relative text-3xl lg:text-4xl font-black text-slate-900 tracking-tight z-10">Giặt sấy hằng ngày</h2>
                <p className="relative text-slate-600 text-sm leading-relaxed z-10">
                  Giặt sấy tiêu chuẩn sử dụng máy giặt sấy công nghệ cao, quần áo được phân loại kỹ, giặt bằng nước sạch và sấy khô hoàn toàn ở nhiệt độ thích hợp. Phù hợp cho quần áo mặc hàng ngày, đồ cotton, đồ lanh, khăn tắm.
                </p>
                <div className="relative flex flex-wrap items-center gap-4 mt-2 z-10">
                  <button onClick={() => navigate('/customer/pickup?service=giat-say')} className="group btn-primary-hover flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer border-0">
                    Đặt dịch vụ
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => setSelectedService(SERVICES.find(s => s.id === 'giat-say'))} className="group px-4 py-3 text-slate-700 font-bold hover:text-blue-600 transition-colors cursor-pointer border-0 bg-transparent">
                    <span className="link-underline">Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col-reverse md:flex-row w-full bg-slate-50 overflow-hidden reveal-hidden reveal-from-bottom stagger-1">
            <div className="w-full md:w-1/2 flex items-center justify-end p-8 md:p-16 lg:p-24 bg-slate-50 z-10 reveal-hidden reveal-from-left stagger-1">
              <div className="max-w-[480px] flex flex-col gap-4 text-left relative">
                <span className="absolute -top-10 -left-6 text-[100px] font-black text-blue-500 opacity-5 z-0 pointer-events-none select-none">02</span>
                <h2 className="relative text-3xl lg:text-4xl font-black text-slate-900 tracking-tight z-10">Giặt hấp & chăm sóc cao cấp</h2>
                <p className="relative text-slate-600 text-sm leading-relaxed z-10">
                  Bảo vệ tối ưu sợi vải cao cấp nhạy cảm, sử dụng dung môi sinh học thân thiện môi trường để loại bỏ vết bẩn cứng đầu mà không gây co rút hay bạc màu. Dành riêng cho đồ vest, áo khoác dạ, đầm lụa, áo dài.
                </p>
                <div className="relative flex flex-wrap items-center gap-4 mt-2 z-10">
                  <button onClick={() => navigate('/customer/pickup?service=giat-hap')} className="group btn-primary-hover flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer border-0">
                    Đặt dịch vụ
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => setSelectedService(SERVICES.find(s => s.id === 'giat-hap'))} className="group px-4 py-3 text-slate-700 font-bold hover:text-blue-600 transition-colors cursor-pointer border-0 bg-transparent">
                    <span className="link-underline">Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[400px] bg-slate-200 img-zoom-container relative">
              <div 
                className="absolute inset-0 bg-cover bg-center img-zoom reveal-hidden reveal-from-right" 
                style={{ backgroundImage: "url('/images/customer/dry-cleaning.jpg')" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 z-10">
                <Star size={80} opacity={0.2} strokeWidth={1} />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col md:flex-row w-full bg-white relative overflow-hidden reveal-hidden reveal-from-bottom stagger-1">
            <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[400px] md:absolute md:inset-0 bg-slate-100 img-zoom-container">
              <div 
                className="absolute inset-0 bg-cover bg-center img-zoom reveal-hidden reveal-from-left" 
                style={{ backgroundImage: "url('/images/customer/shoes-bedding.jpg')" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 z-10">
                <Shirt size={80} opacity={0.2} strokeWidth={1} />
              </div>
            </div>
            <div className="max-w-[1440px] mx-auto w-full flex justify-end z-10 relative">
              <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col gap-4 text-left bg-white/95 md:bg-white/80 md:backdrop-blur-md reveal-hidden reveal-from-right stagger-1">
                <div className="relative">
                  <span className="absolute -top-10 -left-6 text-[100px] font-black text-blue-50 opacity-50 z-0 pointer-events-none select-none">03</span>
                  <h2 className="relative text-3xl lg:text-4xl font-black text-slate-900 tracking-tight z-10">Giày, túi, chăn drap & đồ gia dụng</h2>
                  <p className="relative text-slate-600 text-sm leading-relaxed z-10 mt-4">
                    Chăm sóc thủ công chuyên sâu cho giày thể thao, giày da, túi hiệu. Quy trình làm sạch tỉ mỉ kết hợp sấy Ozon. Giặt sạch, sấy khô hoàn toàn chăn drap, rèm cửa khổ lớn.
                  </p>
                  <div className="relative flex flex-wrap items-center gap-4 mt-6 z-10">
                    <button onClick={() => navigate('/customer/pickup?service=giat-giay-tui')} className="group btn-primary-hover flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer border-0">
                      Đặt dịch vụ
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <button onClick={() => setSelectedService(SERVICES.find(s => s.id === 'giat-giay-tui'))} className="group px-4 py-3 text-slate-700 font-bold hover:text-blue-600 transition-colors cursor-pointer border-0 bg-transparent">
                      <span className="link-underline">Xem chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Marquee Branding Strip */}
          <section className="w-full bg-blue-900 py-4 overflow-hidden border-y border-blue-800 reveal-hidden reveal-from-bottom">
            <div className="marquee-content whitespace-nowrap flex items-center gap-8 text-[11px] sm:text-xs font-black text-white/90 uppercase tracking-[0.25em]">
              <span>Nhận đồ tận nơi</span><span className="text-blue-500">•</span>
              <span>Phân loại kỹ</span><span className="text-blue-500">•</span>
              <span>Giặt đúng yêu cầu</span><span className="text-blue-500">•</span>
              <span>Giao đúng hẹn</span><span className="text-blue-500">•</span>
              <span>Nhận đồ tận nơi</span><span className="text-blue-500">•</span>
              <span>Phân loại kỹ</span><span className="text-blue-500">•</span>
              <span>Giặt đúng yêu cầu</span><span className="text-blue-500">•</span>
              <span>Giao đúng hẹn</span><span className="text-blue-500">•</span>
              <span>Nhận đồ tận nơi</span><span className="text-blue-500">•</span>
              <span>Phân loại kỹ</span><span className="text-blue-500">•</span>
              <span>Giặt đúng yêu cầu</span><span className="text-blue-500">•</span>
              <span>Giao đúng hẹn</span><span className="text-blue-500">•</span>
            </div>
          </section>

          {/* Member Strip */}
          <section id="member-strip" className="w-full bg-blue-600 text-white py-10 reveal-hidden reveal-from-bottom">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <User size={28} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] text-blue-200 font-bold uppercase tracking-widest mb-0.5">Thành viên</span>
                  <span className="text-xl font-black tracking-wide">Nguyễn Văn An</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 md:gap-10 w-full lg:w-auto">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mb-0.5">Hạng hiện tại</span>
                  <span className="text-base font-extrabold text-yellow-300">Bạc (Silver)</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mb-0.5">Ví tích điểm</span>
                  <span className="text-base font-extrabold">{memberPoints} điểm</span>
                </div>
                <div className="flex flex-col flex-1 min-w-[200px] text-left">
                  <div className="flex justify-between text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1.5">
                    <span>Lên hạng Vàng</span>
                    <span>320/500</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 progress-bar" style={{ width: `${progressWidth}%` }}></div>
                  </div>
                </div>
                
                <button onClick={() => navigate('/customer/loyalty')} className="shrink-0 px-5 py-2.5 bg-white text-blue-600 font-bold text-xs rounded-xl shadow-sm hover:bg-blue-50 transition cursor-pointer border-0 w-full sm:w-auto mt-2 sm:mt-0">
                  Xem ví điểm
                </button>
              </div>
            </div>
          </section>

          {/* Stores Section */}
          <section className="w-full bg-[#F3F6FA] text-slate-900">
            <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[600px]">
              
              {/* Left Column - Map & Search */}
              <div className="w-full md:w-[45%] relative border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden flex flex-col justify-center p-8 md:p-12 xl:p-16 bg-[#E5EEF5] reveal-hidden reveal-from-left">
                {/* CSS Map Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #94a3b8 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                
                {/* Simulated Pins */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Q1 */}
                  <div className={`absolute top-[45%] left-[25%] transition-all duration-300 ease-out flex flex-col items-center ${hoveredBranch === 'q1' ? 'scale-125 z-10 -translate-y-1' : 'scale-100 opacity-70'}`}>
                    <div className="relative">
                      <MapPin size={32} strokeWidth={1.5} className={hoveredBranch === 'q1' ? 'text-blue-600 drop-shadow-[0_4px_8px_rgba(37,99,235,0.4)]' : 'text-slate-400'} fill={hoveredBranch === 'q1' ? '#eff6ff' : 'white'} />
                      {BRANCHES.find(b => b.id === 'q1')?.status === 'open' && <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ${hoveredBranch === 'q1' ? 'animate-pulse' : ''}`} />}
                    </div>
                  </div>
                  {/* Q3 */}
                  <div className={`absolute top-[35%] left-[55%] transition-all duration-300 ease-out flex flex-col items-center ${hoveredBranch === 'q3' ? 'scale-125 z-10 -translate-y-1' : 'scale-100 opacity-70'}`}>
                    <div className="relative">
                      <MapPin size={32} strokeWidth={1.5} className={hoveredBranch === 'q3' ? 'text-blue-600 drop-shadow-[0_4px_8px_rgba(37,99,235,0.4)]' : 'text-slate-400'} fill={hoveredBranch === 'q3' ? '#eff6ff' : 'white'} />
                      {BRANCHES.find(b => b.id === 'q3')?.status === 'open' && <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ${hoveredBranch === 'q3' ? 'animate-pulse' : ''}`} />}
                    </div>
                  </div>
                  {/* Thu Duc */}
                  <div className={`absolute top-[65%] left-[65%] transition-all duration-300 ease-out flex flex-col items-center ${hoveredBranch === 'thu_duc' ? 'scale-125 z-10 -translate-y-1' : 'scale-100 opacity-70'}`}>
                    <div className="relative">
                      <MapPin size={32} strokeWidth={1.5} className={hoveredBranch === 'thu_duc' ? 'text-blue-600 drop-shadow-[0_4px_8px_rgba(37,99,235,0.4)]' : 'text-slate-400'} fill={hoveredBranch === 'thu_duc' ? '#eff6ff' : 'white'} />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 text-left">
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">DUDI gần bạn</h2>
                  <p className="text-slate-600 mt-4 font-medium text-sm leading-relaxed max-w-sm">
                    Tìm kiếm chi nhánh gần nhất để gửi đồ hoặc trải nghiệm dịch vụ chăm sóc cao cấp tại cửa hàng.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pointer-events-auto">
                    <input 
                      type="text" 
                      placeholder="Nhập quận hoặc địa chỉ..." 
                      className="w-full px-5 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium shadow-sm"
                    />
                    <button className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer border-0">
                      Tìm cửa hàng
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Branch List */}
              <div className="w-full md:w-[55%] p-8 md:p-12 xl:p-16 flex flex-col justify-center">
                <div className="flex flex-col gap-4 w-full">
                  {BRANCHES.map((b, i) => (
                    <div 
                      key={b.id} 
                      className={`reveal-hidden reveal-from-bottom stagger-${i + 1}`}
                    >
                      <div
                        onMouseEnter={() => setHoveredBranch(b.id)}
                        onMouseLeave={() => setHoveredBranch(null)}
                        className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                          hoveredBranch === b.id 
                            ? 'bg-[#EAF2FF] border-blue-500 shadow-md transform -translate-y-0.5' 
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm transform translate-y-0'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5 z-10 text-left">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-base font-bold transition-colors ${hoveredBranch === b.id ? 'text-blue-700' : 'text-slate-900'}`}>{b.name}</h3>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1.5 border ${
                              b.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              {b.status === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                              {b.statusLabel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{b.address}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                            <Clock size={12} className="animate-none" />
                            <span>{b.hours}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedBranch(b)}
                          className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-0 z-10 ${
                            hoveredBranch === b.id 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 cursor-pointer' 
                              : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 cursor-pointer'
                          }`}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- DETAILS MODALS --- */}
      {/* 1. Service Detail Modal (Redesigned Wide Modal ~880px) */}
      {selectedService && (() => {
        const extra = SERVICE_EXTRA_DETAILS[selectedService.id] || {
          suitableFor: 'Tất cả các loại trang phục và vật dụng giặt ủi thông dụng.',
          careNotes: 'Quy trình làm sạch đạt chuẩn vệ sinh an toàn cao nhất.',
          tags: ['Dịu nhẹ cho vải', 'Không phai màu', 'Phù hợp đồ cao cấp', 'Xử lý kỹ'],
          tipNote: 'Mẹo nhỏ: Vui lòng kiểm tra kỹ tư trang cá nhân trong túi áo/quần trước khi gửi đồ.'
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedService(null)} />
            
            <div className="relative bg-white border border-slate-200 rounded-[24px] p-6 md:p-8 shadow-xl max-w-[880px] w-full z-10 flex flex-col gap-6 animate-scaleUp max-h-[90vh]">
              
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4 text-left shrink-0 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${selectedService.bgIcon}`}>
                    {selectedService.icon}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        {selectedService.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                        selectedService.badge === 'Phổ biến' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        selectedService.badge === 'Premium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {selectedService.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Thông tin dịch vụ
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center border-0 cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* SCROLLABLE BODY */}
              <div className="overflow-y-auto pr-1 flex flex-col gap-5 flex-1 min-h-0 text-left">
                
                {/* Block 1: Mô tả dịch vụ */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mô tả dịch vụ
                  </span>
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                    {selectedService.detailDesc}
                  </p>
                </div>

                {/* Block 2: Grid 2 cột thông tin nhanh */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0 text-xs">
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Đơn giá tham khảo
                      </span>
                      <span className="text-base font-extrabold text-blue-600">
                        {selectedService.price}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Phù hợp cho loại đồ
                      </span>
                      <span className="font-bold text-slate-800 leading-relaxed">
                        {extra.suitableFor}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Thời gian xử lý
                      </span>
                      <span className="font-bold text-slate-800">
                        {selectedService.time}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Ghi chú chăm sóc / lưu ý
                      </span>
                      <span className="font-bold text-slate-800 leading-relaxed">
                        {extra.careNotes}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Block 3: Tag/Chip tiện ích */}
                <div className="flex flex-col gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Đặc điểm & Tiện ích chăm sóc
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {extra.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Block 4: Highlight Note Box */}
                <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-4 text-xs text-amber-800 font-semibold flex items-start gap-2.5 shrink-0">
                  <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{extra.tipNote}</span>
                </div>

              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 shrink-0 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-0"
                >
                  Đóng
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(null);
                      navigate('/customer/support');
                    }}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-blue-600 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200"
                  >
                    Xem bảng giá
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(null);
                      navigate(`/customer/pickup?service=${selectedService.id}`);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer border-0 flex items-center gap-2"
                  >
                    <span>Đặt dịch vụ</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 2. Branch Detail Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedBranch(null)} />
          
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-2xl w-full z-10 flex flex-col gap-4 animate-scaleUp max-h-[90vh]">
            <div className="flex items-start gap-4 text-left shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <MapPin size={24} className="animate-none" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-black text-slate-955">{selectedBranch.name}</h3>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    selectedBranch.status === 'open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {selectedBranch.statusLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Thông tin chi nhánh</p>
              </div>
            </div>

            <div className="overflow-y-auto pr-1 flex flex-col gap-5 flex-1 min-h-0" style={{ margin: '0 -4px', padding: '0 4px' }}>
              <div className="flex flex-col gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-700 shrink-0">
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Địa chỉ cửa hàng</span>
                  <span className="text-slate-800 font-bold leading-normal">{selectedBranch.address}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-3 mt-1 text-left">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Giờ hoạt động</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock size={12} className="text-slate-400 animate-none" />
                      {selectedBranch.hours}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Hotline liên hệ</span>
                    <a href={`tel:${selectedBranch.hotline.replace(/\s+/g, '')}`} className="font-extrabold text-blue-600 hover:underline">
                      {selectedBranch.hotline}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left shrink-0">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Dịch vụ tại chi nhánh</span>
                <div className="flex flex-wrap gap-2">
                  {selectedBranch.services.map((svc: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold">{svc}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left shrink-0">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Thời gian xử lý</span>
                  <span className="text-xs font-bold text-slate-800">{selectedBranch.processingTime}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Nhận/giao tận nơi</span>
                  <span className="text-xs font-bold text-slate-800">{selectedBranch.coverage}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left border-t border-slate-100 pt-4 shrink-0">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Tiện ích</span>
                <div className="flex flex-wrap gap-2">
                  {selectedBranch.amenities.map((item: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">{item}</span>
                  ))}
                </div>
              </div>

              {selectedBranch.note && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-700 font-semibold flex items-center gap-1.5 text-left shrink-0">
                  <Sparkles size={14} className="text-amber-500 shrink-0 animate-none" />
                  <span>{selectedBranch.note}</span>
                </div>
              )}

              {selectedBranch.status === 'closed' && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] text-red-700 font-semibold flex items-center gap-1.5 text-left shrink-0">
                  <AlertTriangle size={14} className="text-red-500 shrink-0 animate-none" />
                  <span>Chi nhánh hiện chưa nhận đơn mới.</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-3 border-t border-slate-100 shrink-0 mt-auto">
              <button
                type="button"
                onClick={() => setSelectedBranch(null)}
                className="px-4 py-2 hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl transition-all cursor-pointer bg-white mr-auto border-0"
              >
                Đóng
              </button>
              
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-0 no-underline flex items-center"
              >
                Chỉ đường
              </a>
              
              <a
                href={`tel:${selectedBranch.hotline.replace(/\s+/g, '')}`}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-0 no-underline flex items-center"
              >
                Gọi cửa hàng
              </a>
              
              <button
                type="button"
                disabled={selectedBranch.status === 'closed'}
                onClick={() => {
                  setSelectedBranch(null);
                  navigate(`/customer/pickup?branch=${selectedBranch.id}`);
                }}
                className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all border-0 shadow-sm flex items-center ${
                  selectedBranch.status === 'closed'
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/10'
                }`}
              >
                Đặt lấy đồ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
