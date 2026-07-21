import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin,
  Star,
  Clock,
  Sparkles,
  Shirt,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Wallet,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Truck
} from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: 'Đồng giá giặt sấy 15k/kg',
    desc: 'Áp dụng cho hóa đơn giặt tiêu chuẩn trên 5kg suốt cả tuần này. Tiết kiệm hơn, giặt nhiều hơn!',
    badge: 'Ưu đãi cực hot',
    badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100',
    bgGradient: 'from-rose-50 to-orange-50/20 border-rose-100/50'
  },
  {
    id: 2,
    title: 'Tặng 50 điểm thành viên mới',
    desc: 'Nhận ngay 50 điểm thưởng vào Ví tích điểm khi đăng ký và hoàn thành đơn hàng đầu tiên trên ứng dụng.',
    badge: 'Dành cho bạn mới',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    bgGradient: 'from-blue-50 to-indigo-50/20 border-blue-100/50'
  },
  {
    id: 3,
    title: 'Giảm 20% giặt hấp cao cấp',
    desc: 'Ưu đãi đặc biệt giảm 20% khi giặt từ 3 sản phẩm cao cấp (vest, đầm dạ hội, áo lụa). Bảo dưỡng sợi vải tối ưu.',
    badge: 'Dành cho đồ hiệu',
    badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    bgGradient: 'from-amber-50 to-yellow-50/20 border-amber-100/50'
  }
];

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
    statusLabel: 'Đang mở'
  },
  {
    id: 'q3',
    name: 'DUDI Quận 3',
    address: '456 Võ Văn Tần, Quận 3, TP.HCM',
    hours: '7:00 - 21:00',
    hotline: '0901 456 789',
    status: 'open',
    statusLabel: 'Đang mở'
  },
  {
    id: 'thu_duc',
    name: 'DUDI Thủ Đức',
    address: '789 Võ Văn Ngân, Thủ Đức, TP.HCM',
    hours: '7:00 - 21:00',
    hotline: '0901 789 123',
    status: 'closed',
    statusLabel: 'Đã đóng'
  }
];

export default function CustomerHome() {
  const navigate = useNavigate();
  
  // Page Mock States
  const [pageState, setPageState] = useState<'normal' | 'loading' | 'error'>('normal');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Detail Modal States
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  // Carousel actions
  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };
  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-8">
      
      {/* --- RENDER LOADING STATE --- */}
      {pageState === 'loading' && (
        <div className="flex flex-col gap-6 items-center justify-center py-24 text-center bg-white border border-slate-200 rounded-3xl shadow-3xs">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-extrabold text-slate-800">Đang cập nhật dữ liệu...</p>
            <p className="text-xs text-slate-400 font-semibold">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}

      {/* --- RENDER ERROR STATE --- */}
      {pageState === 'error' && (
        <div className="flex flex-col gap-5 items-center justify-center py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-3xs max-w-md mx-auto w-full">
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
            onClick={() => {
              setPageState('normal');
            }}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer border-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* --- RENDER NORMAL DASHBOARD --- */}
      {pageState === 'normal' && (
        <>
          {/* Main Top Grid (Hero + Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column Left (Hero + Carousel) */}
            <div className="lg:col-span-8 flex flex-col gap-6 w-full">
              
              {/* Hero Section */}
              <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-3xl p-6 md:p-8 flex flex-col gap-6 items-start border border-blue-100/50 shadow-3xs">
                <div className="flex flex-col gap-1.5 max-w-[800px] text-left">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    Xin chào! 👋
                  </h1>
                  <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
                    Chào mừng bạn đến với DUDI Laundry — dịch vụ giặt ủi tiện lợi, chất lượng vượt trội.
                  </p>
                </div>
                <div className="flex flex-row flex-wrap gap-2.5 items-center justify-start w-full">
                  <button 
                    onClick={() => navigate('/customer/pickup')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap inline-flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-xs animate-none"
                  >
                    <Truck size={14} className="animate-none" />
                    Đặt lịch lấy đồ tận nơi
                  </button>
                  <button
                    onClick={() => navigate('/customer/track')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors inline-flex items-center justify-center cursor-pointer"
                  >
                    Tra cứu đơn
                  </button>
                  <button
                    onClick={() => navigate('/customer/loyalty')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors inline-flex items-center justify-center cursor-pointer"
                  >
                    Ví tích điểm
                  </button>
                  <button
                    onClick={() => navigate('/customer/orders')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors inline-flex items-center justify-center cursor-pointer"
                  >
                    Lịch sử giặt ủi
                  </button>
                  <button
                    onClick={() => navigate('/customer/support')}
                    className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black border border-blue-200 shadow-xs transition-colors inline-flex items-center justify-center cursor-pointer"
                  >
                    Hỗ trợ / Zalo
                  </button>
                </div>
              </div>

              {/* Promo Carousel Banner */}
              <div className={`w-full bg-gradient-to-r ${BANNERS[currentBannerIndex].bgGradient} border border-slate-200/60 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group`}>
                <div className="flex-1 flex flex-col gap-1.5 text-left">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${BANNERS[currentBannerIndex].badgeColor}`}>
                      {BANNERS[currentBannerIndex].badge}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{BANNERS[currentBannerIndex].title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[480px]">
                    {BANNERS[currentBannerIndex].desc}
                  </p>
                </div>

                {/* Slider Dots & Buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {/* Dots */}
                  <div className="flex gap-1.5">
                    {BANNERS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIndex(idx)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                          currentBannerIndex === idx ? 'bg-slate-700 w-4' : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Nav buttons */}
                  <div className="flex bg-white/80 border border-slate-200/80 rounded-xl p-0.5 gap-0.5">
                    <button
                      onClick={prevBanner}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border-0 animate-none"
                    >
                      <ChevronLeft size={14} className="animate-none" />
                    </button>
                    <button
                      onClick={nextBanner}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border-0 animate-none"
                    >
                      <ChevronRight size={14} className="animate-none" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Column Right (Cards) */}
            <div className="lg:col-span-4 flex flex-col gap-5 w-full">
              
              {/* Thẻ ví tích điểm */}
              <div 
                onClick={() => navigate('/customer/loyalty')}
                className="w-full bg-gradient-to-br from-slate-850 to-slate-950 text-white rounded-3xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all border border-slate-800"
              >
                {/* Background glow decorator */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl transition-all group-hover:scale-125"></div>
                
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-800/80 text-yellow-400 rounded-xl border border-slate-700/50">
                      <Wallet size={16} className="animate-none" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Thẻ thành viên</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                    Bạc (Silver)
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 text-left z-10">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Tài khoản</span>
                  <span className="text-base font-extrabold tracking-wide">Nguyễn Văn An</span>
                  <span className="text-2xl font-black text-yellow-400 mt-1">320 <span className="text-xs font-bold text-slate-300">điểm</span></span>
                </div>

                {/* Progress bar to next tier */}
                <div className="flex flex-col gap-1.5 border-t border-slate-800/80 pt-3 z-10">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>Lên hạng Vàng (Gold)</span>
                    <span>320 / 500 điểm</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
              </div>

              {/* Widget Đơn đang xử lý */}
              <div className="w-full bg-blue-50/40 border border-blue-100 rounded-3xl p-5 shadow-2xs flex flex-col gap-3 relative overflow-hidden text-left animate-slideDown">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    <strong className="text-xs font-black text-slate-900 tracking-wide">Đơn hàng: DUDI-125</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-100 text-blue-700">
                    Đang giặt sấy
                  </span>
                </div>

                <div className="flex items-center gap-3.5 my-0.5">
                  <div className="w-10 h-10 bg-white border border-blue-100 rounded-xl flex items-center justify-center shrink-0 text-blue-600 shadow-3xs">
                    <ShoppingBag size={18} className="stroke-[1.8] animate-none" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock size={11} className="text-slate-400 animate-none" />
                      Giao trả dự kiến
                    </span>
                    <span className="font-extrabold text-slate-850 text-xs">18:00 hôm nay</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/customer/track?orderId=DUDI-125')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs shadow-blue-500/10 cursor-pointer border-0 flex items-center justify-center gap-1"
                >
                  <span>Theo dõi đơn</span>
                  <ArrowRight size={13} className="animate-none" />
                </button>
              </div>

            </div>

          </div>

          {/* Services Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight text-left">
              Dịch vụ nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map((s) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${s.bgIcon}`}>
                      {s.icon}
                    </div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        s.badge === 'Phổ biến' ? 'bg-blue-50 text-blue-600' :
                        s.badge === 'Premium' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 text-left">
                      {s.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedService(s)}
                    className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-650 hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-sm font-bold text-center block rounded-b-xl cursor-pointer border-0"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stores Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight text-left">
              Cửa hàng gần bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BRANCHES.map((b) => (
                <div key={b.id} className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="animate-none" />
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                        b.status === 'open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {b.statusLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors text-left">{b.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-normal text-left">{b.address}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-650 font-medium">
                      <Clock size={14} className="text-slate-400 animate-none" />
                      <span>{b.hours}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedBranch(b)}
                    className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-650 hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-sm font-bold text-center block rounded-b-xl cursor-pointer border-0"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --- DETAILS MODALS --- */}
      {/* 1. Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedService(null)} />
          
          {/* Modal Card */}
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-md w-full z-10 flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-start gap-4 text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedService.bgIcon}`}>
                {selectedService.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-black text-slate-955">{selectedService.title}</h3>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    selectedService.badge === 'Phổ biến' ? 'bg-blue-50 text-blue-600' :
                    selectedService.badge === 'Premium' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {selectedService.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Thông tin dịch vụ</p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Mô tả chi tiết</span>
                <span className="text-slate-700 leading-relaxed font-medium">{selectedService.detailDesc}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-3 mt-1 text-left">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Đơn giá tham khảo</span>
                  <span className="font-extrabold text-slate-900">{selectedService.price}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Thời gian xử lý</span>
                  <span className="font-bold text-slate-800">{selectedService.time}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-xl transition-all cursor-pointer bg-white"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedService(null);
                  navigate(`/customer/pickup?service=${selectedService.id}`);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/10 border-0"
              >
                Đặt dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Branch Detail Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedBranch(null)} />
          
          {/* Modal Card */}
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-md w-full z-10 flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-start gap-4 text-left">
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

            <div className="flex flex-col gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-700">
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

            {selectedBranch.status === 'closed' && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] text-red-700 font-semibold flex items-center gap-1.5 text-left">
                <AlertTriangle size={14} className="text-red-500 shrink-0 animate-none" />
                <span>Chi nhánh hiện tại đã đóng cửa. Bạn không thể đặt lấy đồ từ chi nhánh này lúc này.</span>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBranch(null)}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-xl transition-all cursor-pointer bg-white"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={selectedBranch.status === 'closed'}
                onClick={() => {
                  setSelectedBranch(null);
                  navigate(`/customer/pickup?branch=${selectedBranch.id}`);
                }}
                className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all border-0 shadow-sm ${
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
