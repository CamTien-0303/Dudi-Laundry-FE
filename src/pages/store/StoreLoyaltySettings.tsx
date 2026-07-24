import { useState } from 'react';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Info,
  CheckCircle,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Modal, ConfirmDialog } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface RedemptionRule {
  id: string;
  name: string;
  points: number;
  value: string;
  active: boolean;
}

export default function StoreLoyaltySettings() {
  const { toast } = useToast();

  // Staff Mode (Chế độ nhân viên)
  const [isStaffMode, setIsStaffMode] = useState(false);

  // General Loyalty Config State
  const [isEnabled, setIsEnabled] = useState(true);
  const [spendForPoint, setSpendForPoint] = useState<number>(20000);
  const [valuePerPoint, setValuePerPoint] = useState<number>(1000);

  // Validation Errors
  const [spendError, setSpendError] = useState('');
  const [valueError, setValueError] = useState('');

  // Redemption Rules State
  const [rules, setRules] = useState<RedemptionRule[]>([
    { id: 'r1', name: 'Giảm 20.000đ đơn tiếp theo', points: 200, value: '20.000đ', active: true },
    { id: 'r2', name: 'Giảm 10% tổng đơn hàng', points: 300, value: '10%', active: true },
    { id: 'r3', name: 'Voucher vệ sinh giày miễn phí', points: 500, value: '60.000đ', active: false }
  ]);

  // Expiry Policy State
  const [expiryPolicy, setExpiryPolicy] = useState<'none' | '6m' | '12m'>('none');

  // Exclusion Rules State
  const [excludeLowPrice, setExcludeLowPrice] = useState(true);
  const [excludeHighPromo, setExcludeHighPromo] = useState(false);

  // Modals & Dialogs
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Rule Modal Form State
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [rulePoints, setRulePoints] = useState<number | ''>('');
  const [ruleValue, setRuleValue] = useState('');
  const [rulePointsError, setRulePointsError] = useState('');
  const [ruleNameError, setRuleNameError] = useState('');
  const [ruleValueError, setRuleValueError] = useState('');

  // Form Validation
  const validateForm = () => {
    let isValid = true;
    setSpendError('');
    setValueError('');

    if (!spendForPoint || spendForPoint <= 0) {
      setSpendError('Mức chi tiêu cho 1 điểm phải lớn hơn 0đ.');
      isValid = false;
    }

    if (valuePerPoint === undefined || valuePerPoint === null || valuePerPoint < 0) {
      setValueError('Giá trị quy đổi điểm không được âm.');
      isValid = false;
    }

    return isValid;
  };

  const handleSaveClick = () => {
    if (isStaffMode) return;
    if (!validateForm()) {
      toast('Vui lòng kiểm tra lại các trường thông tin bị lỗi.', 'error');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmOpen(false);
    setIsSaved(true);
    toast('Chính sách tích điểm đã được cập nhật thành công!', 'success');
  };

  const handleToggleRule = (id: string) => {
    if (isStaffMode) return;
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, active: !r.active } : r))
    );
    toast('Đã cập nhật trạng thái quy tắc đổi thưởng.', 'success');
  };

  const handleDeleteRule = (id: string) => {
    if (isStaffMode) return;
    setRules(prev => prev.filter(r => r.id !== id));
    toast('Đã xóa quy tắc đổi thưởng.', 'success');
  };

  const handleOpenEditRule = (rule: RedemptionRule) => {
    if (isStaffMode) return;
    setEditingRuleId(rule.id);
    setRuleName(rule.name);
    setRulePoints(rule.points);
    setRuleValue(rule.value);
    setRulePointsError('');
    setRuleNameError('');
    setRuleValueError('');
    setIsRuleModalOpen(true);
  };

  const handleOpenAddRule = () => {
    if (isStaffMode) return;
    setEditingRuleId(null);
    setRuleName('');
    setRulePoints('');
    setRuleValue('');
    setRulePointsError('');
    setRuleNameError('');
    setRuleValueError('');
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    setRulePointsError('');
    setRuleNameError('');
    setRuleValueError('');

    if (!ruleName.trim()) {
      setRuleNameError('Tên quà/voucher không được để trống.');
      hasError = true;
    }

    if (!rulePoints || rulePoints <= 0) {
      setRulePointsError('Số điểm cần đổi phải lớn hơn 0 điểm.');
      hasError = true;
    }

    if (!ruleValue.trim()) {
      setRuleValueError('Giá trị nhận được không được để trống.');
      hasError = true;
    }

    if (hasError) return;

    if (editingRuleId) {
      setRules(prev =>
        prev.map(r =>
          r.id === editingRuleId
            ? { ...r, name: ruleName.trim(), points: Number(rulePoints), value: ruleValue.trim() }
            : r
        )
      );
      toast('Đã cập nhật quy tắc đổi thưởng.', 'success');
    } else {
      const newRule: RedemptionRule = {
        id: `r-${Date.now()}`,
        name: ruleName.trim(),
        points: Number(rulePoints),
        value: ruleValue.trim(),
        active: true
      };
      setRules(prev => [...prev, newRule]);
      toast('Đã thêm quy tắc đổi thưởng mới thành công.', 'success');
    }

    setIsRuleModalOpen(false);
  };

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-6 text-left relative pb-24">
      <style>{`
        .reveal-hidden {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          .reveal-hidden {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.35s ease-out, transform 0.35s ease-out;
          }
          .reveal-hidden.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* 1. COMPACT LOYALTY CONTROL CENTER HEADER WITH MINT STATUS BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
              LOYALTY CONTROL CENTER
            </span>
            {isEnabled ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Hệ thống tích điểm đang hoạt động
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Tạm ngưng hệ thống tích điểm
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Thiết lập chính sách tích điểm &amp; đổi thưởng
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isStaffMode}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto ${
            isStaffMode
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer'
          }`}
        >
          <span>Lưu &amp; Áp dụng</span>
        </button>
      </div>

      {/* 2. MAIN CONFIGURATION GRID (8 Cols Configs + 4 Cols Security & Permissions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 8 COLS */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* SECTION 1: CẤU HÌNH TÍCH ĐIỂM CHUNG (BLUE PASTEL ACCENT #EFF6FF / #BFDBFE) */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#BFDBFE]/60 pb-3 bg-[#EFF6FF]/40 -mx-5 -mt-5 p-4 rounded-t-xl">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                <Gift size={16} className="text-[#2563EB]" />
                01 · CẤU HÌNH TÍCH ĐIỂM CHUNG
              </h2>

              {/* Master System Enable/Disable Toggle */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>Kích hoạt hệ thống</span>
                <button
                  type="button"
                  disabled={isStaffMode}
                  onClick={() => {
                    setIsEnabled(!isEnabled);
                    toast(
                      isEnabled
                        ? 'Đã tạm ngưng hệ thống tích điểm toàn tiệm.'
                        : 'Đã kích hoạt hệ thống tích điểm toàn tiệm.',
                      'info'
                    );
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isStaffMode
                      ? 'bg-slate-200 cursor-not-allowed'
                      : isEnabled
                      ? 'bg-[#2563EB]'
                      : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* VISUAL FORMULA HIGHLIGHT BANNER (MUST HAVE) */}
            <div className="bg-[#EEF4FF] border border-[#BFDBFE] rounded-lg p-3.5 flex items-center justify-between gap-2 text-xs text-[#2563EB] font-bold shadow-2xs">
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                CÔNG THỨC QUY ĐỔI:
              </span>
              <div className="flex items-center gap-2 font-mono font-black text-slate-900 text-sm overflow-x-auto">
                <span className="bg-white px-2.5 py-1 rounded border border-[#BFDBFE]">
                  {spendForPoint.toLocaleString('vi-VN')}đ chi tiêu
                </span>
                <ArrowRight size={14} className="text-[#2563EB] shrink-0" />
                <span className="bg-white px-2.5 py-1 rounded border border-[#BFDBFE]">
                  1 điểm
                </span>
                <ArrowRight size={14} className="text-[#2563EB] shrink-0" />
                <span className="bg-white px-2.5 py-1 rounded border border-[#BFDBFE]">
                  trị giá {valuePerPoint.toLocaleString('vi-VN')}đ khi đổi
                </span>
              </div>
            </div>

            {/* Form Inputs Below Formula */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Mức chi tiêu tích 1 điểm (đ)</label>
                <input
                  type="number"
                  value={spendForPoint}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setSpendForPoint(val);
                    if (val > 0) setSpendError('');
                  }}
                  readOnly={isStaffMode}
                  disabled={isStaffMode || !isEnabled}
                  className={`w-full h-[40px] px-3 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-mono font-bold outline-none focus:border-[#2563EB] ${
                    spendError ? 'border-red-500' : 'border-[#DCE5F0]'
                  }`}
                  min="1"
                />
                {spendError && <span className="text-[10px] font-bold text-red-500">{spendError}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Giá trị quy đổi khi dùng 1 điểm (đ)</label>
                <input
                  type="number"
                  value={valuePerPoint}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setValuePerPoint(val);
                    if (val >= 0) setValueError('');
                  }}
                  readOnly={isStaffMode}
                  disabled={isStaffMode || !isEnabled}
                  className={`w-full h-[40px] px-3 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-mono font-bold outline-none focus:border-[#2563EB] ${
                    valueError ? 'border-red-500' : 'border-[#DCE5F0]'
                  }`}
                  min="0"
                />
                {valueError && <span className="text-[10px] font-bold text-red-500">{valueError}</span>}
              </div>
            </div>
          </div>

          {/* SECTION 2: QUY TẮC VOUCHER & QUÀ TẶNG (AMBER PASTEL ACCENT #FFFBEB / #FDE68A) */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#FDE68A]/60 pb-3 bg-[#FFFBEB]/40 -mx-5 -mt-5 p-4 rounded-t-xl">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Award size={16} className="text-amber-600" />
                02 · QUY TẮC QUY ĐỔI VOUCHER &amp; QUÀ TẶNG
              </h2>

              <button
                type="button"
                onClick={handleOpenAddRule}
                disabled={isStaffMode}
                className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 rounded font-bold text-xs transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <Plus size={13} /> Thêm quy tắc
              </button>
            </div>

            {/* Rules List Table */}
            <div className="overflow-x-auto w-full border border-[#DCE5F0] rounded-lg bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Tên Voucher / Quà tặng</th>
                    <th className="py-3 px-4 text-center">Số điểm đổi</th>
                    <th className="py-3 px-4 text-right">Trị giá nhận được</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0]">
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-xs text-slate-400 font-semibold">
                        Chưa thiết lập quy tắc đổi thưởng nào.
                      </td>
                    </tr>
                  ) : (
                    rules.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#2563EB]">{r.points} điểm</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{r.value}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            disabled={isStaffMode}
                            onClick={() => handleToggleRule(r.id)}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer border-0 ${
                              r.active
                                ? 'bg-[#ECFDF5] text-emerald-800 border-[#A7F3D0]'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {r.active ? 'Đang hoạt động' : 'Tạm ngưng'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditRule(r)}
                              disabled={isStaffMode}
                              className="text-slate-500 hover:text-[#2563EB] p-1 rounded cursor-pointer border-0 bg-transparent"
                              title="Sửa"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule(r.id)}
                              disabled={isStaffMode}
                              className="text-slate-500 hover:text-red-600 p-1 rounded cursor-pointer border-0 bg-transparent"
                              title="Xóa"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: HẾT HẠN ĐIỂM THƯỞNG (LAVENDER PASTEL ACCENT #F5F3FF / #DDD6FE) */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
            <div className="border-b border-[#DDD6FE]/60 pb-3 bg-[#F5F3FF]/40 -mx-5 -mt-5 p-4 rounded-t-xl">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Clock size={16} className="text-indigo-600" />
                03 · CHÍNH SÁCH HẾT HẠN ĐIỂM THƯỞNG
              </h2>
            </div>

            {/* Selectable Cards Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'none', label: 'Điểm không hết hạn', desc: 'Tích lũy vô thời hạn' },
                { value: '6m', label: 'Hết hạn sau 6 tháng', desc: 'Tự động reset sau 180 ngày' },
                { value: '12m', label: 'Hết hạn sau 12 tháng', desc: 'Tự động reset sau 365 ngày' }
              ].map(opt => {
                const isSelected = expiryPolicy === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => !isStaffMode && setExpiryPolicy(opt.value as any)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 text-left ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#EEF4FF] shadow-2xs'
                        : 'border-[#DCE5F0] bg-[#F8FAFC] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                        {opt.label}
                      </strong>
                      <input
                        type="radio"
                        name="expiryPolicy"
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => {}}
                        className="accent-[#2563EB]"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: DANH SÁCH DỊCH VỤ LOẠI TRỪ (SOFT GRAY/BLUE ACCENT #F8FAFC / #DCE5F0) */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
            <div className="border-b border-[#DCE5F0] pb-3 bg-[#F8FAFC] -mx-5 -mt-5 p-4 rounded-t-xl">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Info size={16} className="text-slate-500" />
                04 · DỊCH VỤ LOẠI TRỪ KHÔNG TÍCH ĐIỂM
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {/* Checkbox row 1 */}
              <label className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={excludeLowPrice}
                  onChange={(e) => !isStaffMode && setExcludeLowPrice(e.target.checked)}
                  disabled={isStaffMode}
                  className="mt-0.5 accent-[#2563EB]"
                />
                <div className="flex flex-col text-left">
                  <strong className="text-xs font-bold text-slate-900">Dịch vụ giặt hộ giá rẻ</strong>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Các gói giặt tiết kiệm đặc thù không áp dụng tích lũy điểm thưởng.
                  </span>
                </div>
              </label>

              {/* Checkbox row 2 */}
              <label className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={excludeHighPromo}
                  onChange={(e) => !isStaffMode && setExcludeHighPromo(e.target.checked)}
                  disabled={isStaffMode}
                  className="mt-0.5 accent-[#2563EB]"
                />
                <div className="flex flex-col text-left">
                  <strong className="text-xs font-bold text-slate-900">Dịch vụ đang áp dụng khuyến mãi sâu</strong>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Không cho phép tích lũy điểm khi đơn hàng đã sử dụng voucher giảm giá lớn.
                  </span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 4 COLS (PERMISSIONS & SECURITY) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* COMPACT PERMISSIONS CARD */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <UserCheck size={15} className="text-[#2563EB]" />
              QUYỀN HẠN &amp; CHẾ ĐỘ GIÁM SÁT
            </h3>

            {/* Staff Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg">
              <div className="flex flex-col">
                <strong className="text-xs font-bold text-slate-900">Chế độ nhân viên</strong>
                <span className="text-[10px] text-slate-400 font-medium">Chế độ chỉ xem (Readonly)</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsStaffMode(!isStaffMode);
                  toast(
                    isStaffMode
                      ? 'Đã tắt chế độ nhân viên. Chuyển sang quyền Chủ tiệm.'
                      : 'Đã bật chế độ nhân viên. Chế độ chỉ xem.',
                    'info'
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isStaffMode ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    isStaffMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-[#EEF4FF] border border-[#BFDBFE] p-3 rounded-lg text-xs text-slate-800 font-semibold leading-relaxed">
              <span className="font-bold text-[#2563EB]">🔒 Quy định bảo mật:</span>
              <p className="mt-1 text-[11px] text-slate-600 font-medium">
                Chỉ Chủ tiệm có quyền sửa chính sách. Nhân viên chỉ được xem thông tin quy đổi.
              </p>
            </div>
          </div>

          {/* APPLICATION STATUS CARD */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              TRẠNG THÁI ÁP DỤNG
            </h3>

            {isSaved ? (
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 rounded-md">
                  <CheckCircle size={15} className="text-emerald-600" />
                  Đã lưu &amp; áp dụng thành công!
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Công thức mới lập tức có hiệu lực cho tất cả các đơn hàng tiếp theo tại quầy POS.
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium italic">
                Chưa có thay đổi nào. Bấm "Lưu &amp; Áp dụng" để cập nhật chính sách.
              </span>
            )}
          </div>

        </div>

      </div>

      {/* 3. STICKY SAVE BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#DCE5F0] p-3 shadow-lg flex items-center justify-between px-6 md:px-12">
        <span className="text-xs font-bold text-slate-600 hidden sm:inline">
          {isEnabled ? '● Hệ thống tích điểm đang kích hoạt' : '○ Hệ thống tích điểm tạm ngưng'}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isStaffMode}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all border-0 shadow-2xs flex items-center gap-1.5 ${
              isStaffMode
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer'
            }`}
          >
            <span>Lưu &amp; Áp dụng chính sách</span>
          </button>
        </div>
      </div>

      {/* Confirm Save Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Xác nhận lưu chính sách tích điểm"
        message="Thay đổi này sẽ áp dụng cho các đơn hàng kể từ thời điểm này, điểm cũ của khách hàng sẽ giữ nguyên. Bạn có muốn tiếp tục?"
        confirmText="Đồng ý áp dụng"
        cancelText="Quay lại kiểm tra"
      />

      {/* Rule Modal (Add / Edit) */}
      <Modal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        title={editingRuleId ? 'Cập nhật quy tắc đổi thưởng' : 'Thêm quy tắc đổi thưởng mới'}
        size="sm"
      >
        <form onSubmit={handleSaveRule} className="flex flex-col gap-3 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Tên Voucher / Quà tặng *</label>
            <input
              type="text"
              placeholder="Ví dụ: Giảm giá 20.000đ"
              value={ruleName}
              onChange={(e) => {
                setRuleName(e.target.value);
                if (e.target.value.trim()) setRuleNameError('');
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-semibold outline-none"
            />
            {ruleNameError && <span className="text-red-500 font-bold">{ruleNameError}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Số điểm cần đổi *</label>
            <input
              type="number"
              placeholder="Ví dụ: 200"
              value={rulePoints}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                setRulePoints(val);
                if (val !== '' && val > 0) setRulePointsError('');
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-mono font-bold outline-none"
              min="1"
            />
            {rulePointsError && <span className="text-red-500 font-bold">{rulePointsError}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Giá trị nhận được *</label>
            <input
              type="text"
              placeholder="Ví dụ: 20.000đ hoặc 10%"
              value={ruleValue}
              onChange={(e) => {
                setRuleValue(e.target.value);
                if (e.target.value.trim()) setRuleValueError('');
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-semibold outline-none"
            />
            {ruleValueError && <span className="text-red-500 font-bold">{ruleValueError}</span>}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRuleModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2563EB] text-white font-bold rounded cursor-pointer border-0 shadow-2xs"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
