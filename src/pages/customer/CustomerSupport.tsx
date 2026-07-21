import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Globe,
  X,
  Clock,
  Smartphone,
  Laptop,
  HelpCircle
} from 'lucide-react';
import { PageHeader } from '../../components/common';

const faqList = [
  {
    question: 'Làm sao để tích điểm?',
    answer: 'Điểm tích lũy sẽ tự động cộng vào tài khoản của bạn sau khi đơn hàng hoàn thành (1 điểm cho mỗi 10.000đ). Bạn có thể xem ví điểm tại mục "Ví điểm".'
  },
  {
    question: 'Tôi muốn thay đổi địa chỉ nhận đồ phải làm sao?',
    answer: 'Bạn có thể gọi trực tiếp Hotline hoặc nhắn tin Zalo cho cửa hàng để yêu cầu thay đổi địa chỉ trước khi shipper bắt đầu đi giao hàng.'
  },
  {
    question: 'Chính sách bồi thường khi làm hỏng đồ như thế nào?',
    answer: 'DUDI Laundry cam kết bồi thường lên đến 100% giá trị món đồ nếu xảy ra lỗi trong quá trình giặt ủi do cửa hàng. Vui lòng quay video lúc nhận hàng để được hỗ trợ tốt nhất.'
  },
  {
    question: 'Khi nào tôi nhận được thông báo đơn đã xong?',
    answer: 'Ngay khi đồ giặt của bạn được đóng gói sẵn sàng, hệ thống sẽ tự động cập nhật trạng thái đơn hàng và gửi tin nhắn Zalo thông báo.'
  }
];

const ZALO_OA_URL = "https://zalo.me/123456789";
const ZALO_WEB_URL = "https://chat.zalo.me/?phone=0909123456";

export default function CustomerSupport() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showZaloModal, setShowZaloModal] = useState(false);
  const [zaloMockMessage, setZaloMockMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const currentHour = new Date().getHours();
  const isWorking = currentHour >= 7 && currentHour < 21;
  
  const [message, setMessage] = useState(
    orderId ? `Tôi cần hỗ trợ đơn hàng #${orderId}` : ''
  );

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleOpenZalo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Vui lòng nhập nội dung cần hỗ trợ.');
      return;
    }
    setError(null);
    setShowZaloModal(true);
  };

  const closeModal = () => {
    setShowZaloModal(false);
    setTimeout(() => setZaloMockMessage(null), 300);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-2xl mx-auto px-4 sm:px-0">
      <PageHeader
        title="Trung tâm hỗ trợ"
        description="Giải đáp thắc mắc và liên hệ trực tiếp bộ phận chăm sóc khách hàng."
      />

      {/* 1. FAQ Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 mb-1">
          <HelpCircle size={16} className="text-blue-600" />
          Câu hỏi thường gặp (FAQ)
        </h3>
        
        <div className="flex flex-col gap-2">
          {faqList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all cursor-pointer overflow-hidden ${
                  isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div 
                  className="p-3.5 flex justify-between items-center select-none"
                  onClick={() => toggleFaq(idx)}
                >
                  <span className={`text-xs font-bold ${isOpen ? 'text-blue-700' : 'text-slate-700'}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-blue-500 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400 shrink-0" />
                  )}
                </div>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-[11px] text-slate-600 font-medium leading-relaxed border-t border-blue-100/50 pt-2.5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Zalo OA Contact Form */}
      <form onSubmit={handleOpenZalo} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden">
        
        {/* Toggle & Badge - Mock Only */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <MessageCircle size={16} className="text-blue-500" />
            Liên hệ Zalo OA
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isWorking 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              {isWorking ? 'Đang hoạt động' : 'Tạm nghỉ'}
            </span>
          </div>
        </div>

        {/* Cảnh báo hết giờ làm */}
        {!isWorking && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3.5 rounded-xl font-semibold leading-relaxed">
            Hiện chúng tôi đã hết giờ làm việc, vui lòng để lại lời nhắn, chúng tôi sẽ phản hồi sớm nhất vào sáng mai.
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Nội dung cần hỗ trợ</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Nhập nội dung bạn cần hỗ trợ..."
            className={`w-full p-3 bg-slate-50 border rounded-xl text-slate-700 text-xs outline-none placeholder-slate-400 resize-none font-medium transition-all ${
              error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {error && <span className="text-red-500 text-[10px] font-semibold mt-0.5">{error}</span>}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer border-0 flex items-center justify-center gap-2"
        >
          <span className="mt-0.5">Chat ngay qua Zalo</span>
        </button>

      </form>

      {/* 3. Direct Contact Info */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Thông tin liên hệ</h3>
        
        <div className="flex flex-col gap-3">
          <a href="tel:0909123456" className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer no-underline">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Phone size={14} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Hotline khẩn cấp</span>
              <span className="text-sm font-extrabold text-slate-800">0909 123 456</span>
            </div>
          </a>

          <a href="mailto:support@dudilaundry.vn" className="flex items-center gap-3 px-1 cursor-pointer hover:opacity-80 no-underline">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">support@dudilaundry.vn</span>
          </a>

          <a href="https://maps.google.com/?q=123+Nguyễn+Huệ,+Quận+1,+TP.HCM" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-1 cursor-pointer hover:opacity-80 no-underline">
            <MapPin size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">123 Nguyễn Huệ, Quận 1, TP.HCM</span>
          </a>
          
          <div className="flex items-center gap-3 px-1">
            <Clock size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">07:00 - 21:00 mỗi ngày</span>
          </div>
        </div>

        {/* Link Widgets Mock */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-100">
          <a href="https://facebook.com/dudilaundry" target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl p-2.5 flex flex-col items-center gap-1.5 cursor-pointer transition-colors no-underline">
            <span className="font-black text-[22px] leading-none tracking-tight">f</span>
            <span className="text-[10px] font-bold mt-[-2px]">Facebook</span>
          </a>
          <a href="https://dudilaundry.vn" target="_blank" rel="noopener noreferrer" className="bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl p-2.5 flex flex-col items-center gap-1.5 cursor-pointer transition-colors no-underline">
            <Globe size={18} />
            <span className="text-[10px] font-bold">Website</span>
          </a>
          <a href={ZALO_OA_URL} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl p-2.5 flex flex-col items-center gap-1.5 cursor-pointer transition-colors no-underline">
            <span className="font-black text-[22px] leading-none tracking-tight">Z</span>
            <span className="text-[10px] font-bold mt-[-2px]">Zalo OA</span>
          </a>
        </div>
      </div>

      {/* Zalo Redirect Modal Mock */}
      {showZaloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden animate-slideUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-sm">Chuyển hướng Zalo</h3>
              <button 
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl shadow-inner">
                Z
              </div>
              
              {zaloMockMessage ? (
                <div className="flex flex-col items-center gap-3 w-full animate-fadeIn">
                  <div className="bg-emerald-50 text-emerald-700 text-sm p-4 rounded-xl font-medium leading-relaxed border border-emerald-100">
                    {zaloMockMessage}
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full py-3 mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer border-0"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-700 font-bold leading-relaxed px-2">
                    Đang chuyển bạn đến ứng dụng Zalo để gặp nhân viên hỗ trợ.
                  </p>

                  <div className="flex flex-col w-full gap-2.5 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (ZALO_OA_URL) {
                          window.open(ZALO_OA_URL, "_blank");
                        } else {
                          setZaloMockMessage("Kênh Zalo OA đang được cấu hình. Vui lòng liên hệ hotline 0909 123 456 để được hỗ trợ ngay.");
                        }
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer border-0 flex justify-center items-center gap-2"
                    >
                      <Smartphone size={16} />
                      Mở Zalo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (ZALO_WEB_URL) {
                          window.open(ZALO_WEB_URL, "_blank");
                        } else {
                          setZaloMockMessage("Zalo Web đang được cấu hình. Vui lòng liên hệ hotline 0909 123 456 để được hỗ trợ ngay.");
                        }
                      }}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer border-0 flex justify-center items-center gap-2"
                    >
                      <Laptop size={16} />
                      Dùng Zalo Web
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-450 font-semibold px-4 mt-2">
                    Nếu chưa cài Zalo, bạn có thể dùng Zalo Web hoặc tải ứng dụng.
                  </span>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
