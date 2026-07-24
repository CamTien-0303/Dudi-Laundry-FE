import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  MessageCircle,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Globe,
  X,
  Clock,
  Smartphone,
  Laptop,
  Search,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Truck,
  CreditCard
} from 'lucide-react';

const faqList = [
  {
    category: 'Tích điểm & Ưu đãi',
    question: 'Làm sao để tích điểm?',
    answer: 'Điểm tích lũy sẽ tự động cộng vào tài khoản của bạn sau khi đơn hàng hoàn thành (1 điểm cho mỗi 10.000đ). Bạn có thể xem ví điểm tại mục "Ví điểm".'
  },
  {
    category: 'Giao nhận đồ',
    question: 'Tôi muốn thay đổi địa chỉ nhận đồ phải làm sao?',
    answer: 'Bạn có thể gọi trực tiếp Hotline hoặc nhắn tin Zalo cho cửa hàng để yêu cầu thay đổi địa chỉ trước khi shipper bắt đầu đi giao hàng.'
  },
  {
    category: 'Bảo hiểm & Bồi thường',
    question: 'Chính sách bồi thường khi làm hỏng đồ như thế nào?',
    answer: 'DUDI Laundry cam kết bồi thường lên đến 100% giá trị món đồ nếu xảy ra lỗi trong quá trình giặt ủi do cửa hàng. Vui lòng quay video lúc nhận hàng để được hỗ trợ tốt nhất.'
  },
  {
    category: 'Cập nhật tiến độ',
    question: 'Khi nào tôi nhận được thông báo đơn đã xong?',
    answer: 'Ngay khi đồ giặt của bạn được đóng gói sẵn sàng, hệ thống sẽ tự động cập nhật trạng thái đơn hàng và gửi tin nhắn Zalo thông báo.'
  }
];

const quickCategoryItems = [
  {
    icon: Truck,
    title: 'Lấy & giao đồ',
    desc: 'Lịch lấy đồ, thay đổi địa chỉ',
    query: 'Giao nhận đồ'
  },
  {
    icon: CreditCard,
    title: 'Đơn hàng',
    desc: 'Tiến độ và trạng thái',
    query: 'tiến độ'
  },
  {
    icon: ShieldCheck,
    title: 'Thanh toán & điểm',
    desc: 'Hóa đơn, voucher, tích điểm',
    query: 'Tích điểm'
  },
  {
    icon: HelpCircle,
    title: 'Chất lượng dịch vụ',
    desc: 'Phản hồi và bồi thường',
    query: 'Bồi thường'
  }
];

const ZALO_OA_URL = "https://zalo.me/123456789";
const ZALO_WEB_URL = "https://chat.zalo.me/?phone=0909123456";

export default function CustomerSupport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [showZaloModal, setShowZaloModal] = useState(false);
  const [zaloMockMessage, setZaloMockMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const currentHour = new Date().getHours();
  const isWorking = currentHour >= 7 && currentHour < 21;
  
  const [message, setMessage] = useState(
    orderId ? `Tôi cần hỗ trợ đơn hàng #${orderId}` : ''
  );

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
  }, []);

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

  const filteredFaqs = faqList.filter((faq) => {
    if (!faqSearchQuery.trim()) return true;
    const q = faqSearchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col">
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

      {/* 1. TOP SUPPORT AREA (#EEF4FF Pastel Background) */}
      <section className="w-full py-10 md:py-14 bg-[#EEF4FF] border-b border-[#DCE5F0] reveal-hidden">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col text-left">
          
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#2563EB] mb-1.5">
            DUDI CUSTOMER CARE
          </span>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              DUDI có thể giúp gì cho bạn?
            </h1>

            {/* Right side live status block */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#DCE5F0] shrink-0 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-slate-900">07:00 — 21:00</span>
                <span className="text-[10px] text-slate-500 font-semibold">Hỗ trợ mỗi ngày</span>
              </div>
            </div>
          </div>

          {/* 2. SEARCH BAR (Height 56px, White Background, Shadow 2xs) */}
          <div className="w-full max-w-2xl mt-6 relative">
            <input
              type="text"
              placeholder="Tìm câu hỏi hoặc nội dung cần hỗ trợ..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              className="w-full h-[56px] bg-white border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-slate-900 text-sm font-medium rounded-xl pl-12 pr-14 shadow-2xs outline-none transition-all placeholder:text-slate-400"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            
            {faqSearchQuery ? (
              <button
                type="button"
                onClick={() => setFaqSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer border-0 bg-transparent text-xs"
              >
                ✕
              </button>
            ) : (
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#2563EB] text-white p-2 rounded-lg hover:bg-blue-700 transition-colors border-0 cursor-pointer flex items-center justify-center"
              >
                <Search size={16} />
              </button>
            )}
          </div>

          {/* 3. QUICK CATEGORY (4 Items with Vertical Dividers, Hover translateY -2px) */}
          <div className="mt-8 bg-white/70 backdrop-blur-xs rounded-xl border border-[#DCE5F0] overflow-hidden shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#DCE5F0]">
              {quickCategoryItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setFaqSearchQuery(item.query)}
                    className="p-4 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left gap-2 group select-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center">
                        <IconComp size={16} />
                      </div>
                      <span className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all text-xs">
                        →
                      </span>
                    </div>

                    <div className="flex flex-col mt-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. MAIN CONTENT (2 Columns ~65/35 Layout) */}
      <main className="w-full py-10 flex-grow">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 w-full text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* CỘT TRÁI (~65% / lg:col-span-8): FAQ Accordion */}
            <section className="lg:col-span-8 flex flex-col reveal-hidden stagger-1">
              
              <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3 mb-6">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Câu hỏi thường gặp
                </h2>
                {faqSearchQuery && (
                  <span className="text-xs text-slate-500 font-medium">
                    Tìm thấy {filteredFaqs.length} kết quả
                  </span>
                )}
              </div>

              {filteredFaqs.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`bg-white border rounded-lg transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? 'border-[#2563EB] border-l-[3px] border-l-[#2563EB] bg-[#F0F6FF]'
                            : 'border-[#DCE5F0] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div
                          className="p-4 flex justify-between items-center cursor-pointer select-none gap-4"
                          onClick={() => toggleFaq(idx)}
                        >
                          <div className="flex items-center gap-2.5 text-left">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {faq.category}
                            </span>
                            <h3 className={`text-xs md:text-sm font-bold ${isOpen ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                              {faq.question}
                            </h3>
                          </div>
                          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2563EB]' : 'text-slate-400'}`}>
                            <ChevronDown size={16} />
                          </div>
                        </div>

                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-slate-600 font-medium leading-relaxed border-t border-[#DCE5F0]/60 pt-3 text-left animate-fadeIn">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-8 text-center flex flex-col items-center gap-3">
                  <HelpCircle size={28} className="text-slate-300" />
                  <p className="text-xs font-bold text-slate-800">Không tìm thấy câu hỏi phù hợp</p>
                  <p className="text-xs text-slate-500 font-medium">Thử từ khóa khác hoặc nhắn tin Zalo hỗ trợ bên phải.</p>
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    className="mt-1 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 border-0 cursor-pointer"
                  >
                    Xem tất cả câu hỏi
                  </button>
                </div>
              )}

            </section>

            {/* CỘT PHẢI STICKY (~35% / lg:col-span-4): Zalo Panel & Flat Contact List */}
            <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6 reveal-hidden stagger-2 text-left">
              
              {/* 5. ZALO PANEL (DUDI Blue Header #2563EB + Pastel #EEF4FF Body) */}
              <form onSubmit={handleOpenZalo} className="flex flex-col shadow-2xs select-none">
                
                {/* Blue Header Bar */}
                <div className="bg-[#2563EB] text-white p-4 rounded-t-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">
                      CHAT VỚI DUDI
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isWorking 
                      ? 'bg-emerald-500 text-white border-emerald-400' 
                      : 'bg-amber-400 text-slate-900 border-amber-300'
                  }`}>
                    {isWorking ? 'Đang trực tuyến' : 'Tạm nghỉ'}
                  </span>
                </div>

                {/* Pastel Body #EEF4FF */}
                <div className="bg-[#EEF4FF] p-5 rounded-b-[14px] border-x border-b border-[#DCE5F0] flex flex-col gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Thường phản hồi trong vài phút</span>
                  </div>

                  {!isWorking && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg font-semibold leading-relaxed">
                      Hiện cửa hàng đã hết giờ làm việc. Bạn có thể gửi lời nhắn, DUDI sẽ phản hồi vào sáng mai.
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Mô tả ngắn vấn đề của bạn..."
                      className={`w-full p-3 bg-white border rounded-lg text-slate-900 text-xs outline-none placeholder:text-slate-400 resize-none font-medium transition-all ${
                        error ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {error && <span className="text-red-500 text-[10px] font-semibold mt-0.5">{error}</span>}
                  </div>

                  <button
                    type="submit"
                    className="group w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-all border-0 shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Chat với DUDI qua Zalo</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </form>

              {/* 6. CONTACT LIST (DUDI Blue Icons, Hotline Larger) */}
              <div className="flex flex-col border-y border-[#DCE5F0] divide-y divide-[#DCE5F0] text-xs">
                
                {/* HOTLINE */}
                <a href="tel:0909123456" className="py-3.5 flex items-center gap-3 text-slate-700 hover:text-[#2563EB] transition-colors no-underline">
                  <Phone size={18} className="text-[#2563EB] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HOTLINE KHẨN CẤP</span>
                    <span className="text-base font-black text-slate-900">0909 123 456</span>
                  </div>
                </a>

                {/* EMAIL */}
                <a href="mailto:support@dudilaundry.vn" className="py-3.5 flex items-center gap-3 text-slate-700 hover:text-[#2563EB] transition-colors no-underline">
                  <Mail size={16} className="text-[#2563EB] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EMAIL</span>
                    <span className="text-xs font-extrabold text-slate-900">support@dudilaundry.vn</span>
                  </div>
                </a>

                {/* WORKING HOURS */}
                <div className="py-3.5 flex items-center gap-3 text-slate-700">
                  <Clock size={16} className="text-[#2563EB] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">THỜI GIAN HỖ TRỢ</span>
                    <span className="text-xs font-extrabold text-slate-900">07:00 – 21:00 mỗi ngày</span>
                  </div>
                </div>

                {/* ADDRESS */}
                <a href="https://maps.google.com/?q=123+Nguyễn+Huệ,+Quận+1,+TP.HCM" target="_blank" rel="noopener noreferrer" className="py-3.5 flex items-center gap-3 text-slate-700 hover:text-[#2563EB] transition-colors no-underline">
                  <MapPin size={16} className="text-[#2563EB] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ĐỊA CHỈ</span>
                    <span className="text-xs font-extrabold text-slate-900">123 Nguyễn Huệ, Quận 1, TP.HCM</span>
                  </div>
                </a>

              </div>

              {/* SOCIAL LINKS (Horizontal Inline Links) */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <a href="https://facebook.com/dudilaundry" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors no-underline flex items-center gap-1">
                  <span className="font-mono font-black text-sm text-[#2563EB]">f</span> Facebook
                </a>
                <span>·</span>
                <a href="https://dudilaundry.vn" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors no-underline flex items-center gap-1">
                  <Globe size={13} className="text-[#2563EB]" /> Website
                </a>
                <span>·</span>
                <a href={ZALO_OA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors no-underline flex items-center gap-1">
                  <span className="font-mono font-black text-sm text-[#2563EB]">Z</span> Zalo OA
                </a>
              </div>

            </aside>

          </div>
        </div>
      </main>

      {/* 7. BOTTOM STRIP (Soft Pastel Blue #EEF4FF, Border 1px #DCE7F7, Radius 20px) */}
      <section className="w-full pb-12 mt-6 reveal-hidden">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 w-full">
          <div className="bg-[#EEF4FF] border border-[#DCE7F7] rounded-[20px] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left shadow-2xs">
            
            <div className="flex flex-col">
              <h3 className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">
                Đang có đơn cần hỗ trợ?
              </h3>
              <p className="text-xs md:text-sm text-[#475569] font-medium mt-1">
                Tra cứu ngay trạng thái đơn hoặc xem lại lịch sử dịch vụ.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/customer/orders')}
                className="group px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all border-0 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Tra cứu đơn</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/customer/orders')}
                className="group px-5 py-2.5 bg-white hover:bg-slate-50 border border-[#DCE7F7] text-[#0F172A] hover:text-[#2563EB] font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Lịch sử giặt ủi</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ZALO MODAL DIALOG */}
      {showZaloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden animate-slideUp border border-[#DCE5F0]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#DCE5F0] bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm">Chuyển hướng Zalo OA</h3>
              <button 
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 transition-colors border-0 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center font-black text-2xl border border-blue-100">
                Z
              </div>
              
              {zaloMockMessage ? (
                <div className="flex flex-col items-center gap-3 w-full animate-fadeIn">
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-xl font-medium leading-relaxed border border-emerald-200">
                    {zaloMockMessage}
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full py-3 mt-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer border-0"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed px-2">
                    Đang chuyển bạn đến ứng dụng Zalo để gặp nhân viên hỗ trợ.
                  </p>

                  <div className="flex flex-col w-full gap-2.5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (ZALO_OA_URL) {
                          window.open(ZALO_OA_URL, "_blank");
                        } else {
                          setZaloMockMessage("Kênh Zalo OA đang được cấu hình. Vui lòng liên hệ hotline 0909 123 456 để được hỗ trợ ngay.");
                        }
                      }}
                      className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer border-0 flex justify-center items-center gap-2"
                    >
                      <Smartphone size={15} />
                      Mở Zalo App
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
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer border-0 flex justify-center items-center gap-2"
                    >
                      <Laptop size={15} />
                      Dùng Zalo Web
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold px-4">
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
