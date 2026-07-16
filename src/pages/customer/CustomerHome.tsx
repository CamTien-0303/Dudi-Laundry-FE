import { useNavigate } from 'react-router';
import { MapPin, Star, Clock, Sparkles, Shirt } from 'lucide-react';

export default function CustomerHome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[36px] animate-fadeIn pb-8">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-2xl p-6 md:p-8 flex flex-col gap-6 items-start shadow-sm border border-blue-100/50 mb-8">
        <div className="flex flex-col gap-2 max-w-[800px]">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Xin chào! 👋
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Chào mừng bạn đến với DUDI Laundry — dịch vụ giặt ủi tiện lợi, chất lượng vượt trội.
          </p>
        </div>
        <div className="flex flex-row flex-wrap gap-4 items-center justify-start w-full">
          <button 
            onClick={() => navigate('/customer/pickup')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium whitespace-nowrap inline-flex items-center justify-center cursor-pointer border-0"
          >
            Đặt lấy đồ
          </button>
          <button
            onClick={() => navigate('/customer/track')}
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 shadow-sm transition-colors inline-flex items-center justify-center cursor-pointer"
          >
            Tra cứu đơn
          </button>
          <button
            onClick={() => navigate('/customer/loyalty')}
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 shadow-sm transition-colors inline-flex items-center justify-center cursor-pointer"
          >
            Ví tích điểm
          </button>
          <button
            onClick={() => navigate('/customer/orders')}
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 shadow-sm transition-colors inline-flex items-center justify-center cursor-pointer"
          >
            Lịch sử giặt ủi
          </button>
          <button
            onClick={() => navigate('/customer/support')}
            className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-bold border border-blue-200 shadow-sm transition-colors inline-flex items-center justify-center cursor-pointer"
          >
            Hỗ trợ / Zalo
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col gap-5">
        <h2 className="text-[22px] font-semibold text-slate-900 tracking-tight">
          Dịch vụ nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Sparkles size={24} />
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">Giặt sấy</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">Phổ biến</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Giặt sấy tiêu chuẩn, nhanh chóng và sạch sẽ cho quần áo hàng ngày của bạn.
              </p>
            </div>
            <button 
              onClick={() => navigate('/customer/pickup')}
              className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-center block rounded-b-xl cursor-pointer border-0"
            >
              Xem chi tiết
            </button>
          </div>

          {/* Service 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Star size={24} />
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">Giặt hấp</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-full">Premium</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Dịch vụ giặt hấp cao cấp dành riêng cho đồ vest, đầm dạ hội và quần áo đặc biệt.
              </p>
            </div>
            <button 
              onClick={() => navigate('/customer/pickup')}
              className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-center block rounded-b-xl cursor-pointer border-0"
            >
              Xem chi tiết
            </button>
          </div>

          {/* Service 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Shirt size={24} />
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">Giặt giày & túi</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full">Mới</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Chăm sóc, khử mùi và phục hồi chuyên sâu cho các dòng giày sneaker và túi xách.
              </p>
            </div>
            <button 
              onClick={() => navigate('/customer/pickup')}
              className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-center block rounded-b-xl cursor-pointer border-0"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div className="flex flex-col gap-5">
        <h2 className="text-[22px] font-semibold text-slate-900 tracking-tight">
          Cửa hàng gần bạn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Store 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full shrink-0">Đang mở</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">DUDI Quận 1</h3>
              <p className="text-xs text-slate-500 mb-4 leading-normal">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock size={14} className="text-slate-400" />
                <span>7:00 - 21:00</span>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-center block rounded-b-xl cursor-pointer border-0">
              Xem chi tiết
            </button>
          </div>

          {/* Store 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full shrink-0">Đang mở</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">DUDI Quận 3</h3>
              <p className="text-xs text-slate-500 mb-4 leading-normal">456 Võ Văn Tần, Quận 3, TP.HCM</p>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock size={14} className="text-slate-400" />
                <span>7:00 - 21:00</span>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-center block rounded-b-xl cursor-pointer border-0">
              Xem chi tiết
            </button>
          </div>

          {/* Store 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group h-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-50 text-red-600 rounded-full shrink-0">Đã đóng</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">DUDI Thủ Đức</h3>
              <p className="text-xs text-slate-500 mb-4 leading-normal">789 Võ Văn Ngân, Thủ Đức, TP.HCM</p>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock size={14} className="text-slate-400" />
                <span>7:00 - 21:00</span>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-slate-100/80 transition-colors text-center block rounded-b-xl cursor-pointer border-0">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
