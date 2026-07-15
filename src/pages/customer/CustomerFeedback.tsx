import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Star,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Info,
  Shirt
} from 'lucide-react';
import { PageHeader } from '../../components/common';

interface MockOrder {
  id: string;
  createdAt: string;
  service: string;
  branchName: string;
  branchAddress: string;
}

const mockOrders: Record<string, MockOrder> = {
  'DUDI-123': {
    id: 'DUDI-123',
    createdAt: '15/07/2026',
    service: '5kg Giặt sấy + 1 đôi giày',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  },
  'DUDI-098': {
    id: 'DUDI-098',
    createdAt: '05/07/2026',
    service: '3kg Giặt sấy',
    branchName: 'DUDI Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  }
};

const criteriaList = [
  { id: 'cleanliness', label: 'Độ sạch' },
  { id: 'fragrance', label: 'Mùi thơm' },
  { id: 'speed', label: 'Tốc độ' },
  { id: 'staff', label: 'Thái độ nhân viên' }
];

const quickTags = [
  'Giặt rất sạch',
  'Thơm tho',
  'Giao hàng chậm',
  'Nhân viên nhiệt tình'
];

export default function CustomerFeedback() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const formattedOrderId = orderId ? orderId.toUpperCase() : '';
  const isCancelled = formattedOrderId === 'DUDI-077';
  const order = mockOrders[formattedOrderId];

  // Form states
  const [rating, setRating] = useState(0); // 1-5 stars
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

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success flow
  const [isSuccess, setIsSuccess] = useState(false);

  const getSentimentText = (stars: number) => {
    switch (stars) {
      case 1: return 'Rất không hài lòng 😡';
      case 2: return 'Chưa hài lòng 😕';
      case 3: return 'Bình thường 😐';
      case 4: return 'Hài lòng 🙂';
      case 5: return 'Rất hài lòng 😍';
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

  const handleMockUpload = () => {
    // Simulates selecting a photo
    setMockPhotoName('DUDI_feedback_photo_laundry.png');
  };

  const handleClearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMockPhotoName('');
  };

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
        newErrors.comment = 'Vui lòng nhập góp ý chi tiết khi bạn không hài lòng.';
      } else if (trimmedComment.length < 10) {
        newErrors.comment = `Ý kiến góp ý phải tối thiểu 10 ký tự (hiện có ${trimmedComment.length} ký tự).`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);
  };

  // 1. Chặn đơn đã hủy DUDI-077
  if (isCancelled) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <PageHeader
          title="Đánh giá dịch vụ"
          description="Gửi phản hồi và đóng góp ý kiến về chất lượng giặt ủi."
        />
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center text-amber-800 flex flex-col items-center gap-4 mt-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
            <AlertTriangle size={26} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-extrabold text-slate-900">Đơn hàng này không đủ điều kiện đánh giá.</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Bạn không thể đánh giá đơn hàng đã bị hủy. Chỉ những đơn hàng đã hoàn tất sử dụng dịch vụ mới có thể phản hồi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="mt-2 px-5 py-2.5 bg-white border border-amber-250 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100/50 transition-all cursor-pointer"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // 2. Không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <PageHeader
          title="Đánh giá dịch vụ"
          description="Gửi phản hồi và đóng góp ý kiến về chất lượng giặt ủi."
        />
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-700 flex flex-col items-center gap-4 mt-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-650 flex items-center justify-center border border-red-200">
            <AlertTriangle size={26} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-extrabold text-slate-900">Không tìm thấy đơn hàng để đánh giá.</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Mã đơn hàng bạn cung cấp không tồn tại trong hệ thống hoặc không khớp với thông tin tài khoản của bạn.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="mt-2 px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100/50 transition-all cursor-pointer"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // 3. Success State
  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-xl mx-auto px-4 sm:px-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center flex flex-col items-center gap-5 mt-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-inner">
            <CheckCircle2 size={32} className="stroke-[2]" />
          </div>

          <div className="flex flex-col gap-1.5 px-2">
            <h2 className="text-lg font-black text-slate-900 leading-snug">Cảm ơn bạn đã đóng góp ý kiến để DUDI Laundry hoàn thiện hơn!</h2>
            
            {/* Cộng điểm thưởng */}
            <p className="text-xs text-emerald-600 font-extrabold mt-1">
              Bạn vừa nhận được +5 điểm vào Ví vì đã đánh giá dịch vụ
            </p>
          </div>

          {/* Hộp cảnh báo đặc biệt nếu đánh giá 1 sao */}
          {rating === 1 && (
            <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2.5 text-left text-xs text-red-700">
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <span className="font-bold leading-relaxed">
                Cảnh báo đã được gửi đến quản lý cửa hàng để liên hệ khách hàng xử lý ngay lập tức.
              </span>
            </div>
          )}

          <div className="w-full text-left text-xs bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-450 font-semibold">Đơn hàng:</span>
              <strong className="text-slate-800 font-bold">{order.id}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-450 font-semibold">Đánh giá chung:</span>
              <strong className="text-slate-800 font-bold">{rating} / 5 Sao ({getSentimentText(rating)})</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/orders')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-2xl mx-auto px-4 sm:px-0">
      
      {/* Nút quay lại & Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => navigate(`/customer/orders/${orderId}`)}
          className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <PageHeader
          title="Đánh giá chất lượng dịch vụ"
          description={`Đơn hàng ${order.id}`}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-6">
        
        {/* Tóm tắt đơn hàng */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 items-start text-xs">
          <Shirt size={18} className="text-slate-450 shrink-0 mt-0.5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-450 font-bold uppercase">Mã đơn</span>
              <strong className="text-slate-800 font-extrabold text-sm">{order.id}</strong>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-450 font-bold uppercase">Ngày hoàn thành</span>
              <strong className="text-slate-700 font-semibold">{order.createdAt}</strong>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-450 font-bold uppercase">Dịch vụ sử dụng</span>
              <strong className="text-slate-700 font-semibold">{order.service}</strong>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-450 font-bold uppercase">Thực hiện tại</span>
              <strong className="text-slate-700 font-semibold">{order.branchName}</strong>
            </div>
          </div>
        </div>

        {/* Phần 1: Chọn sao lớn */}
        <div className="flex flex-col items-center justify-center gap-2.5 py-4 border-b border-slate-100 text-center">
          <span className="text-xs font-bold text-slate-700 text-[13px] block">
            Bạn đánh giá thế nào về đơn hàng này? <span className="text-red-500">*</span>
          </span>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = starVal <= rating;
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => {
                    setRating(starVal);
                    if (errors.rating) setErrors(prev => ({ ...prev, rating: '' }));
                  }}
                  className="p-1 cursor-pointer transition-all hover:scale-110 active:scale-95 border-0 bg-transparent select-none"
                >
                  <Star
                    size={36}
                    className={`stroke-[1.5] transition-colors ${
                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className={`text-xs font-black px-3 py-1 bg-slate-50 border border-slate-150 rounded-full ${
            rating > 0 ? 'text-blue-600' : 'text-slate-400'
          }`}>
            {getSentimentText(rating)}
          </span>
          {errors.rating && (
            <span className="text-[10px] text-red-500 font-semibold mt-1">{errors.rating}</span>
          )}
        </div>

        {/* Phần 2: Tiêu chí chi tiết */}
        <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-5">
          <span className="text-xs font-bold text-slate-700 text-[13px] block">
            Đánh giá theo từng tiêu chí
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criteriaList.map((criterion) => {
              const currentScore = criteriaRatings[criterion.id] || 5;
              return (
                <div key={criterion.id} className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{criterion.label}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const isFilled = score <= currentScore;
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleCriteriaRating(criterion.id, score)}
                          className="p-0.5 cursor-pointer bg-transparent border-0 select-none"
                        >
                          <Star
                            size={16}
                            className={`stroke-[1.5] ${
                              isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
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

        {/* Phần 3: Nhãn đánh giá nhanh */}
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5">
          <span className="text-xs font-bold text-slate-700 text-[13px] block">
            Chọn nhanh nhận xét
          </span>

          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                    color: isSelected ? '#ffffff' : '#475569'
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phần 4: Ô góp ý chi tiết */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 text-[13px] block">
            Ý kiến đóng góp chi tiết {rating > 0 && rating <= 2 && <span className="text-red-500">*</span>}
          </label>
          <textarea
            rows={4}
            placeholder={
              rating > 0 && rating <= 2
                ? "Vui lòng cho biết lý do bạn chưa hài lòng để chúng tôi xử lý ngay lập tức (tối thiểu 10 ký tự)..."
                : "Nhập ý kiến đóng góp của bạn để DUDI cải thiện dịch vụ tốt hơn..."
            }
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) setErrors(prev => ({ ...prev, comment: '' }));
            }}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 resize-none font-semibold text-sm ${
              errors.comment ? 'border-red-300 bg-red-50/10 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.comment && (
            <span className="text-[10px] text-red-500 font-semibold pl-1">{errors.comment}</span>
          )}
        </div>

        {/* Phần 5: Tải ảnh thực tế */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-700 text-[13px] block">
            Hình ảnh thực tế (Mock)
          </span>

          <div
            onClick={handleMockUpload}
            className={`border border-dashed border-slate-350 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-50/50 hover:border-slate-400 ${
              mockPhotoName ? 'bg-blue-50/20 border-blue-400' : 'bg-slate-50/50'
            }`}
          >
            {mockPhotoName ? (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-white border border-blue-200/50 px-4 py-2.5 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>{mockPhotoName}</span>
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="ml-2 text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer font-bold shrink-0 text-sm select-none"
                >
                  Xóa
                </button>
              </div>
            ) : (
              <>
                <Camera size={26} className="text-slate-400" />
                <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                  <span className="font-bold text-slate-650">Bấm để tải ảnh lên</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Tải ảnh quần áo/giày dép sau khi giặt nếu có</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Checkbox & Cam kết */}
        <div className="flex flex-col gap-3 pt-3.5 border-t border-slate-100">
          <label className="flex items-center gap-2.5 text-xs text-slate-650 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-bold">Gửi đánh giá dưới dạng ẩn danh</span>
          </label>

          <div className="flex items-start gap-2 text-[11px] text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100/50">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">
              Ý kiến của bạn sẽ được bộ phận quản lý xem xét trong 24 giờ.
            </span>
          </div>
        </div>

        {/* Nút gửi đánh giá */}
        <div className="mt-1">
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-0"
          >
            Gửi đánh giá
          </button>
        </div>

      </form>
    </div>
  );
}
