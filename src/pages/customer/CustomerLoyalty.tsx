import React, { useState } from 'react';
import {
  Search,
  Award,
  Gift,
  History,
  QrCode,
  Shield,
  Zap,
  Bell,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';
import { PageHeader, useToast } from '../../components/common';

interface MockMember {
  phone: string;
  name: string;
  code: string;
  points: number;
  tier: string;
  nextTier: string;
  pointsNeededForNext: number;
  pointsLimitForNext: number;
  privileges: string[];
  vouchers: {
    id: string;
    title: string;
    description: string;
    points: number;
    code: string;
  }[];
  history: {
    id: string;
    description: string;
    points: number;
    date: string;
    type: 'add' | 'subtract';
  }[];
}

const mockMemberData: MockMember = {
  phone: '0901234567',
  name: 'Nguyễn Văn An',
  code: 'DUDI-MB-001',
  points: 320,
  tier: 'Bạc',
  nextTier: 'Vàng',
  pointsNeededForNext: 180,
  pointsLimitForNext: 500,
  privileges: [
    'Giảm 3% cho đơn từ 100.000đ',
    'Ưu tiên xử lý đơn giặt gấp',
    'Nhận thông báo Zalo khi đơn hoàn tất'
  ],
  vouchers: [
    {
      id: 'v1',
      title: 'Voucher giảm 20k',
      description: 'Áp dụng cho đơn từ 100k',
      points: 200,
      code: 'DUDI20K'
    },
    {
      id: 'v2',
      title: 'Miễn phí vệ sinh giày',
      description: 'Chăm sóc và khử mùi chuyên sâu',
      points: 500,
      code: 'DUDISHOES'
    },
    {
      id: 'v3',
      title: 'Voucher giảm 10%',
      description: 'Áp dụng cho đơn hàng tiếp theo',
      points: 300,
      code: 'DUDI10PCT'
    }
  ],
  history: [
    {
      id: 'h1',
      description: 'Nhận điểm tích lũy từ đơn hàng DUDI-123',
      points: 15,
      date: '15/07/2026',
      type: 'add'
    },
    {
      id: 'h2',
      description: 'Đổi điểm nhận voucher giảm 20k',
      points: -200,
      date: '14/07/2026',
      type: 'subtract'
    },
    {
      id: 'h3',
      description: 'Nhận điểm tích lũy từ đơn hàng DUDI-098',
      points: 30,
      date: '12/07/2026',
      type: 'add'
    }
  ]
};

export default function CustomerLoyalty() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [member, setMember] = useState<MockMember | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedQuery = query.trim();

    if (!cleanedQuery) {
      setValidationError('Vui lòng nhập số điện thoại để tra cứu!');
      setSearched(false);
      setMember(null);
      return;
    }

    if (!/^\d+$/.test(cleanedQuery)) {
      setValidationError('Số điện thoại chỉ được chứa các chữ số!');
      setSearched(false);
      setMember(null);
      return;
    }

    if (cleanedQuery.length < 9 || cleanedQuery.length > 11) {
      setValidationError('Số điện thoại phải từ 9 đến 11 chữ số!');
      setSearched(false);
      setMember(null);
      return;
    }

    setValidationError(null);
    setSearched(true);

    if (cleanedQuery === '0901234567') {
      setMember(mockMemberData);
    } else {
      setMember(null);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setMember(null);
    setValidationError(null);
  };

  const handleRedeem = (voucherTitle: string, pointsNeeded: number, promoCode: string) => {
    toast(`Đổi thành công: ${voucherTitle} (dùng ${pointsNeeded} điểm). Mã: ${promoCode}`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 max-w-4xl mx-auto px-4 sm:px-0">
      <PageHeader
        title="Ví tích điểm thành viên"
        description="Tra cứu điểm tích lũy, đặc quyền hạng thành viên và đổi quà nhận ưu đãi."
      />

      {/* Form tìm kiếm số điện thoại */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm text-left">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Nhập số điện thoại đăng ký (ví dụ: 0901234567)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-700 text-sm focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-slate-400 font-semibold ${
                validationError ? 'border-red-300 bg-red-50/10' : 'border-slate-200'
              }`}
            />
            <Search className="absolute left-4 top-3.5 text-slate-450" size={18} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer border-0"
            >
              Tra cứu
            </button>
            {searched && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all cursor-pointer border-0"
              >
                Xóa
              </button>
            )}
          </div>
        </form>

        {validationError && (
          <p className="text-red-650 text-xs font-bold flex items-center gap-1.5 animate-fadeIn mt-2.5">
            <AlertCircle size={13} className="shrink-0" />
            {validationError}
          </p>
        )}
      </div>

      {/* Hiển thị kết quả */}
      {searched && (
        <div className="animate-fadeIn">
          {member ? (
            <div className="flex flex-col gap-6">
              
              {/* Thẻ thành viên & Tiến độ hạng */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Cột 1: Thẻ thành viên */}
                <div 
                  className="md:col-span-2 relative overflow-hidden bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between h-[210px] z-10"
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#ffffff',
                    zIndex: 10
                  }}
                >
                  {/* Top card */}
                  <div className="flex justify-between items-start relative z-10" style={{ zIndex: 10 }}>
                    <div className="flex flex-col">
                      <span 
                        className="text-[10px] tracking-widest font-extrabold uppercase mb-0.5"
                        style={{ color: '#dbeafe' }}
                      >
                        DUDI LAUNDRY MEMBER
                      </span>
                      <span 
                        className="text-xl font-black tracking-wide"
                        style={{ color: '#ffffff' }}
                      >
                        {member.name}
                      </span>
                      <span 
                        className="text-xs font-mono mt-0.5"
                        style={{ color: '#e2e8f0' }}
                      >
                        {member.code}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span 
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                        style={{ 
                          color: '#ffffff', 
                          backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                          borderColor: 'rgba(255, 255, 255, 0.25)' 
                        }}
                      >
                        Hạng {member.tier}
                      </span>
                    </div>
                  </div>

                  {/* Bottom card - Points */}
                  <div 
                    className="flex justify-between items-end border-t border-slate-800 pt-4 relative z-10" 
                    style={{ borderTopColor: '#1e293b', zIndex: 10 }}
                  >
                    <div className="flex flex-col">
                      <span 
                        className="text-[10px] uppercase font-bold tracking-wider"
                        style={{ color: '#dbeafe' }}
                      >
                        Điểm tích lũy
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span 
                          className="text-4xl font-black tracking-tight"
                          style={{ color: '#fcd34d' }}
                        >
                          {member.points}
                        </span>
                        <span 
                          className="text-xs font-bold"
                          style={{ color: '#e2e8f0' }}
                        >
                          điểm
                        </span>
                      </div>
                    </div>
                    <QrCode size={42} className="text-white shrink-0 relative z-10" style={{ color: '#ffffff', zIndex: 10 }} />
                  </div>
                </div>

                {/* Cột 2: Tiến trình lên hạng */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <Award size={18} className="text-amber-500" />
                      Tiến trình thăng hạng
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                      Tích lũy thêm điểm để nhận được các ưu đãi và đặc quyền cao hơn tại các hạng thành viên tiếp theo.
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-2.5 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-750">Hạng {member.tier}</span>
                      <span className="font-bold text-blue-600">Hạng {member.nextTier}</span>
                    </div>
                    
                    {/* Bar container */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(member.points / member.pointsLimitForNext) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{member.points} điểm</span>
                      <span>{member.pointsLimitForNext} điểm</span>
                    </div>
                  </div>

                  {/* Remaining notification */}
                  <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-2.5 text-center mt-3">
                    <p className="text-xs font-bold text-blue-700">
                      Còn {member.pointsNeededForNext} điểm để lên hạng {member.nextTier}
                    </p>
                  </div>

                </div>
              </div>

              {/* Grid 2 cột: Đặc quyền & Lịch sử */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Đặc quyền của bạn */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Shield size={20} className="text-blue-600" />
                    <h3 className="text-base font-bold text-slate-800">Đặc quyền của bạn</h3>
                  </div>
                  
                  <div className="flex flex-col gap-4 py-1">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Giảm giá 3%</span>
                        <span className="text-xs text-slate-500 font-semibold">Tự động áp dụng cho tất cả đơn hàng từ 100.000đ trở lên.</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Award size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Ưu tiên xử lý đơn giặt gấp</span>
                        <span className="text-xs text-slate-500 font-semibold">Đơn hàng của bạn sẽ được xử lý trước trong giờ cao điểm.</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Bell size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Thông báo tự động Zalo</span>
                        <span className="text-xs text-slate-500 font-semibold">Nhận thông báo cập nhật tiến độ ngay khi đơn hàng hoàn tất.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lịch sử điểm */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <History size={20} className="text-blue-600" />
                    <h3 className="text-base font-bold text-slate-800">Lịch sử điểm</h3>
                  </div>

                  <div className="flex flex-col gap-3 py-1 overflow-y-auto max-h-[220px] pr-1">
                    {member.history.map((log) => {
                      const isAdd = log.type === 'add';
                      return (
                        <div key={log.id} className="flex justify-between items-center gap-3 bg-slate-50 border border-slate-100/50 p-3 rounded-2xl hover:bg-slate-100/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isAdd ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {isAdd ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 leading-snug">{log.description}</span>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5">{log.date}</span>
                            </div>
                          </div>
                          <span className={`text-sm font-extrabold shrink-0 ${
                            isAdd ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            {isAdd ? `+${log.points}` : `${log.points}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Danh sách quà tặng đổi voucher */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <Gift size={20} className="text-blue-600" />
                  <h3 className="text-base font-bold text-slate-800">Đổi ưu đãi</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {member.vouchers.map((voucher) => {
                    const hasEnoughPoints = member.points >= voucher.points;
                    return (
                      <div 
                        key={voucher.id} 
                        className={`border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all ${
                          hasEnoughPoints 
                            ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md' 
                            : 'bg-slate-50/50 border-slate-200/50 opacity-75'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              hasEnoughPoints ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {voucher.points} điểm
                            </span>
                            {!hasEnoughPoints && (
                              <span className="text-[9px] text-slate-500 font-bold">Chưa đủ điểm</span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mt-1">{voucher.title}</h4>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">{voucher.description}</p>
                        </div>

                        <button
                          type="button"
                          disabled={!hasEnoughPoints}
                          onClick={() => handleRedeem(voucher.title, voucher.points, voucher.code)}
                          className={`w-full py-2 px-4 rounded-xl font-bold text-xs transition-all border-0 ${
                            hasEnoughPoints 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
                          }`}
                          style={{
                            backgroundColor: hasEnoughPoints ? '#2563eb' : '#cbd5e1',
                            color: hasEnoughPoints ? '#ffffff' : '#94a3b8'
                          }}
                        >
                          Đổi ngay
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 shadow-inner">
                <Coins size={28} className="stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1.5 max-w-sm">
                <p className="text-slate-800 font-bold text-base leading-snug">
                  Không tìm thấy ví điểm
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  Không tìm thấy ví điểm cho số điện thoại này.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg transition-all cursor-pointer border-0"
              >
                Nhập lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
