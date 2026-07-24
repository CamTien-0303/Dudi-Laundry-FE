import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Star,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Camera,
  Check
} from 'lucide-react';
import { useToast } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string;
  service: string;
  branchName: string;
  branchAddress: string;
  thumbnail: string;
}

const mockOrders: Record<string, MockOrder> = {
  'DUDI-123': {
    id: 'DUDI-123',
    createdAt: '15/07/2026',
    service: '5kg Giặt sấy + 1 đôi giày',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    thumbnail: '/images/customer/wash-fold.jpg'
  },
  'DUDI-098': {
    id: 'DUDI-098',
    createdAt: '05/07/2026',
    service: 'Giặt sấy 3kg',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    thumbnail: '/images/customer/pic1.jpg'
  }
};

const criteriaList = [
  { id: 'cleanliness', label: 'Độ sạch' },
  { id: 'fragrance', label: 'Mùi thơm' },
  { id: 'speed', label: 'Tốc độ' },
  { id: 'staff', label: 'Thái độ nhân viên' }
];

const positiveTags = [
  'Giặt rất sạch',
  'Thơm tho',
  'Giao đúng hẹn',
  'Nhân viên nhiệt tình'
];

const constructiveTags = [
  'Chưa sạch',
  'Mùi chưa ổn',
  'Giao chậm',
  'Phục vụ chưa tốt'
];

export default function CustomerFeedback() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formattedOrderId = orderId ? orderId.toUpperCase() : '';
  const isCancelled = formattedOrderId === 'DUDI-077';
  const order = mockOrders[formattedOrderId];

  // Form states
  const [rating, setRating] = useState(0); // 1-5 stars
  const [hoverRating, setHoverRating] = useState(0);
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, number>>({
    cleanliness: 5,
    fragrance: 5,
    speed: 5,
    staff: 5
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [mockPhotoName, setMockPhotoName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success flow
  const [isSuccess, setIsSuccess] = useState(false);

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
  }, [isSuccess]);

  const getSentimentText = (stars: number) => {
    switch (stars) {
      case 1: return 'Tệ';
      case 2: return 'Chưa tốt';
      case 3: return 'Bình thường';
      case 4: return 'Hài lòng';
      case 5: return 'Rất hài lòng';
      default: return 'Chọn số sao đánh giá';
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCriteriaRating = (criterionId: string, value: number) => {
    setCriteriaRatings(prev => ({
      ...prev,
      [criterionId]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPhotoPreview(newPreviewUrl);
      setMockPhotoName(file.name);
    }
  };

  const handleClearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setMockPhotoName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate Stars
    if (rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá.';
    }

    // Validate Comment length (required min 10 chars if 1 or 2 stars)
    if (rating > 0 && rating <= 2) {
      const trimmedComment = comment.trim();
      if (!trimmedComment) {
        newErrors.comment = 'Vui lòng nhập góp ý chi tiết khi bạn chưa hài lòng.';
      } else if (trimmedComment.length < 10) {
        newErrors.comment = `Ý kiến góp ý phải tối thiểu 10 ký tự (hiện có ${trimmedComment.length} ký tự).`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast('Vui lòng kiểm tra lại thông tin đánh giá.', 'error');
      
      const ratingElement = document.getElementById('overall-rating-section');
      if (ratingElement) {
        ratingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    setIsSuccess(true);
    toast('Gửi đánh giá dịch vụ thành công!', 'success');
  };

  // 1. Chặn đơn đã hủy DUDI-077
  if (isCancelled) {
    return (
      <div className="w-full bg-[#F8FAFC] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col py-10 md:py-14">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 w-full text-left">
          <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-8 md:p-12 text-center flex flex-col items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertTriangle size={24} />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-lg font-bold text-slate-900">Đơn hàng không đủ điều kiện đánh giá</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Bạn không thể đánh giá đơn hàng đã bị hủy (DUDI-077). Chỉ những đơn hàng đã hoàn tất sử dụng dịch vụ mới có thể gửi phản hồi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/customer/orders')}
              className="mt-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-[8px] text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer border-0 shadow-2xs"
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className="w-full bg-[#F8FAFC] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col py-10 md:py-14">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 w-full text-left">
          <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-8 md:p-12 text-center flex flex-col items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <AlertTriangle size={24} />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-lg font-bold text-slate-900">Không tìm thấy đơn hàng để đánh giá</h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Mã đơn hàng bạn yêu cầu không tồn tại trong hệ thống hoặc không trùng khớp với tài khoản của bạn.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/customer/orders')}
              className="mt-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-[8px] text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer border-0 shadow-2xs"
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE (Confirmation View)
  if (isSuccess) {
    return (
      <div className="w-full bg-[#F8FAFC] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col py-10 md:py-14">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 w-full text-left">
          <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-w-xl mx-auto">
            
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <CheckCircle2 size={32} />
            </div>

            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Đã gửi đánh giá thành công!
              </h1>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Phản hồi của bạn giúp DUDI cải thiện chất lượng dịch vụ tốt hơn.
              </p>
              <span className="text-xs text-emerald-600 font-bold mt-1">
                +5 điểm thưởng đã được cộng vào Ví tích điểm của bạn.
              </span>
            </div>

            {rating === 1 && (
              <div className="w-full bg-red-50 border border-red-200 p-4 rounded-[8px] flex items-start gap-2.5 text-xs text-red-800 text-left">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">
                  Đánh giá 1 sao đã được chuyển trực tiếp đến quản lý chi nhánh {order.branchName} để liên hệ xử lý với bạn.
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-[#E5E7EB] w-full justify-center">
              <button
                type="button"
                onClick={() => navigate('/customer/orders')}
                className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-[8px] transition-colors cursor-pointer border-0 shadow-2xs"
              >
                Xem lịch sử đơn hàng
              </button>

              <button
                type="button"
                onClick={() => navigate('/customer')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[8px] transition-colors cursor-pointer border-0"
              >
                Về trang chủ
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Dynamic tags list based on rating
  const activeTagsList = (rating > 0 && rating <= 3) ? constructiveTags : positiveTags;
  const tagSectionTitle = (rating > 0 && rating <= 3) ? 'DUDI cần cải thiện điều gì?' : 'Điều gì nổi bật?';

  // MAIN RENDER (Professional 2-Column Desktop ~55/45 Layout, Gap 24px)
  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 min-h-[calc(100vh-80px)] flex flex-col py-8 md:py-10">
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

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 w-full text-left">
        
        {/* PAGE TITLE */}
        <div className="mb-6 flex flex-col">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Đánh giá dịch vụ
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ý kiến phản hồi của bạn giúp DUDI hoàn thiện trải nghiệm dịch vụ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* CỘT TRÁI (~55% / lg:col-span-7): Order Info, Overall Rating & Criteria Ratings */}
          <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#E5E7EB] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-6 reveal-hidden">
            
            {/* 1. ORDER SUMMARY */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-[72px] h-[54px] shrink-0 overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-slate-100">
                  <img
                    src={order.thumbnail}
                    alt={order.service}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-900 tracking-tight">
                    {order.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5">
                    {order.service}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    {order.branchName} · Hoàn thành {order.createdAt}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md shrink-0">
                ✓ Đã hoàn thành
              </span>
            </div>

            {/* 2. OVERALL RATING SECTION */}
            <div id="overall-rating-section" className="flex flex-col border-b border-[#E5E7EB] pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                ĐÁNH GIÁ TRẢI NGHIỆM CHUNG <span className="text-red-500">*</span>
              </span>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeScore = hoverRating || rating;
                    const isFilled = starVal <= activeScore;

                    return (
                      <button
                        key={starVal}
                        type="button"
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => {
                          setRating(starVal);
                          if (errors.rating) setErrors(prev => ({ ...prev, rating: '' }));
                        }}
                        className="p-0.5 cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95 border-0 bg-transparent select-none drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                      >
                        <Star
                          size={38}
                          className={`stroke-[1.5] transition-colors duration-150 ${
                            isFilled
                              ? 'fill-[#F59E0B] text-[#F59E0B]'
                              : 'text-[#E5E7EB]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Sentiment Label */}
                <div className="h-6 flex items-center">
                  <span className={`text-sm font-bold ${rating > 0 || hoverRating > 0 ? 'text-[#2563EB]' : 'text-slate-400'}`}>
                    {getSentimentText(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {errors.rating && (
                <span className="text-xs text-red-500 font-semibold mt-2">{errors.rating}</span>
              )}
            </div>

            {/* 3. CRITERIA RATINGS ("Đánh giá chi tiết") */}
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                ĐÁNH GIÁ CHI TIẾT
              </span>

              <div className="flex flex-col divide-y divide-[#E5E7EB]">
                {criteriaList.map((criterion) => {
                  const currentScore = criteriaRatings[criterion.id] || 5;
                  return (
                    <div key={criterion.id} className="py-3 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{criterion.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const isFilled = score <= currentScore;
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleCriteriaRating(criterion.id, score)}
                              className="p-0.5 cursor-pointer bg-transparent border-0 select-none hover:scale-110 transition-transform"
                            >
                              <Star
                                size={18}
                                className={`stroke-[1.5] transition-colors ${
                                  isFilled ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5E7EB]'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (~45% / lg:col-span-5): Quick Chips, Comment Textarea, Compact Photo Upload & Submit */}
          <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#E5E7EB] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-6 reveal-hidden stagger-1">
            
            {/* 1. QUICK CHIPS */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {tagSectionTitle}
              </span>

              <div className="flex flex-wrap gap-2">
                {activeTagsList.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all duration-150 cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#E0F2FE] text-[#0284C7] border-[#0284C7] font-bold'
                          : 'bg-white text-slate-700 border-[#E5E7EB] hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check size={13} className="text-[#0284C7]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-[#E5E7EB]"></div>

            {/* 2. TEXTAREA COMMENT */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-800">
                Chia sẻ thêm về trải nghiệm {rating > 0 && rating <= 2 && <span className="text-red-500">*</span>}
              </label>
              <textarea
                rows={4}
                placeholder={
                  rating > 0 && rating <= 2
                    ? "Vui lòng chia sẻ lý do bạn chưa hài lòng để DUDI hỗ trợ xử lý ngay (tối thiểu 10 ký tự)..."
                    : "Nhập ý kiến đóng góp của bạn..."
                }
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errors.comment) setErrors(prev => ({ ...prev, comment: '' }));
                }}
                className={`w-full px-3.5 py-3 bg-white border rounded-[8px] text-slate-900 text-xs md:text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-none ${
                  errors.comment
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-[#E5E7EB] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100/60'
                }`}
              />
              {errors.comment && (
                <span className="text-[11px] text-red-500 font-semibold">{errors.comment}</span>
              )}
            </div>

            {/* 3. COMPACT DASHED UPLOAD AREA */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />

              {photoPreview ? (
                <div className="flex items-center gap-3">
                  <div className="relative group w-[72px] h-[72px] rounded-[6px] overflow-hidden border border-[#E5E7EB] bg-slate-100 shrink-0">
                    <img
                      src={photoPreview}
                      alt="Attachment preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-black border-0 cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex flex-col text-xs text-slate-600 gap-0.5">
                    <span className="font-semibold truncate max-w-[180px]">{mockPhotoName}</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#2563EB] font-bold text-left hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                      Thay đổi ảnh
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-[#E5E7EB] rounded-[8px] p-3.5 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors text-center flex flex-col items-center justify-center gap-1 select-none"
                >
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                    <Camera size={16} className="text-slate-400" />
                    <span>Thêm hình ảnh</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Tối đa 4 ảnh · JPG/PNG
                  </span>
                </div>
              )}
            </div>

            <div className="border-b border-[#E5E7EB]"></div>

            {/* 4. ANONYMOUS CHECKBOX & SUBMIT BUTTON */}
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-semibold select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 cursor-pointer"
                />
                <span>Gửi đánh giá ẩn danh</span>
              </label>

              <button
                type="submit"
                className="group w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-[8px] transition-all cursor-pointer border-0 shadow-2xs flex items-center justify-center gap-2"
              >
                <span>GỬI ĐÁNH GIÁ</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}
