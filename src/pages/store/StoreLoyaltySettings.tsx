import { useState } from 'react';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  UserCheck,
  Info,
  CheckCircle,
  Award,
  Clock
} from 'lucide-react';
import { PageHeader, Modal, ConfirmDialog } from '../../components/common';
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

  // Mock Chế độ nhân viên (Staff Mode)
  const [isStaffMode, setIsStaffMode] = useState(false);

  // Form State: Cấu hình chung
  const [isEnabled, setIsEnabled] = useState(true);
  const [spendForPoint, setSpendForPoint] = useState<number>(20000);
  const [valuePerPoint, setValuePerPoint] = useState<number>(1000);

  // Validation Errors
  const [spendError, setSpendError] = useState('');
  const [valueError, setValueError] = useState('');

  // Form State: Quy tắc đổi thưởng (Redemption Rules)
  const [rules, setRules] = useState<RedemptionRule[]>([
    { id: 'r1', name: 'Giảm 20.000đ', points: 200, value: '20.000đ', active: true },
    { id: 'r2', name: 'Giảm 10% đơn tiếp theo', points: 300, value: '10%', active: true },
    { id: 'r3', name: 'Miễn phí vệ sinh giày', points: 500, value: '60.000đ', active: false }
  ]);

  // Form State: Chính sách hết hạn điểm
  const [expiryPolicy, setExpiryPolicy] = useState<'none' | '6m' | '12m'>('none');

  // Form State: Danh sách loại trừ (Chỉ 2 dịch vụ này, không thêm cái khác)
  const [excludeLowPrice, setExcludeLowPrice] = useState(true);
  const [excludeHighPromo, setExcludeHighPromo] = useState(false);

  // Modals / Dialogs visibility states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Rule Modal state (Add / Edit)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [rulePoints, setRulePoints] = useState<number | ''>('');
  const [ruleValue, setRuleValue] = useState('');
  const [rulePointsError, setRulePointsError] = useState('');
  const [ruleNameError, setRuleNameError] = useState('');
  const [ruleValueError, setRuleValueError] = useState('');

  // Validate form fields for main configurations
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

  // Handle click on "Lưu & Áp dụng"
  const handleSaveClick = () => {
    if (isStaffMode) return;

    if (!validateForm()) {
      toast('Vui lòng kiểm tra lại các trường thông tin bị lỗi.', 'error');
      return;
    }

    setIsConfirmOpen(true);
  };

  // Confirm Save action
  const handleConfirmSave = () => {
    setIsConfirmOpen(false);
    setIsSaved(true);
    toast('Chính sách tích điểm đã được cập nhật.', 'success');
  };

  // Handle status toggle of a single redemption rule
  const handleToggleRule = (id: string) => {
    if (isStaffMode) return;
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, active: !r.active } : r))
    );
    toast('Đã cập nhật trạng thái quy tắc đổi thưởng.', 'success');
  };

  // Handle delete rule
  const handleDeleteRule = (id: string) => {
    if (isStaffMode) return;
    setRules(prev => prev.filter(r => r.id !== id));
    toast('Đã xóa quy tắc đổi thưởng.', 'success');
  };

  // Open modal for editing a rule
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

  // Open modal for creating a rule
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

  // Save Rule (both Add and Edit)
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Reset errors
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
      // Edit
      setRules(prev =>
        prev.map(r =>
          r.id === editingRuleId
            ? { ...r, name: ruleName.trim(), points: Number(rulePoints), value: ruleValue.trim() }
            : r
        )
      );
      toast('Đã cập nhật quy tắc đổi thưởng.', 'success');
    } else {
      // Add
      const newRule: RedemptionRule = {
        id: `r-${Date.now()}`,
        name: ruleName.trim(),
        points: Number(rulePoints),
        value: ruleValue.trim(),
        active: true
      };
      setRules(prev => [...prev, newRule]);
      toast('Đã thêm quy tắc đổi thưởng mới.', 'success');
    }

    setIsRuleModalOpen(false);
  };

  // Dynamic Live Example Calculation
  const examplePoints = spendForPoint > 0 ? Math.floor(100000 / spendForPoint) : 0;
  const exampleDiscount = examplePoints * valuePerPoint;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* Title Header with Save Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <PageHeader
          title="Thiết lập tích điểm"
          description="Cấu hình chính sách tích điểm và đổi thưởng cho khách hàng."
        />
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isStaffMode}
            className={`flex items-center gap-1.5 font-bold text-xs shadow-sm py-2.5 px-4 rounded-xl transition-all border-none ${
              isStaffMode
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            }`}
          >
            Lưu & Áp dụng
          </button>
        </div>
      </div>

      {/* Grid containing Left Config Columns & Right Sidebar control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Policy configs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Card 1: Cấu hình chung */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Gift size={16} className="text-blue-600" /> Cấu hình tích điểm chung
              </h3>
              
              {/* Toggle switch system-wide loyalty */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-250/30 py-1 px-3 rounded-lg text-xs font-semibold">
                <span className="select-none text-slate-500">Hệ thống tích điểm</span>
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
                      ? 'bg-blue-600'
                      : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Config details form */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Spend for point */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mức chi tiêu cho 1 điểm (đ)</label>
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
                  placeholder="20,000"
                  className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all ${
                    spendError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                  }`}
                  min="1"
                />
                {spendError && (
                  <span className="text-[10px] font-bold text-rose-500">⚠️ {spendError}</span>
                )}
              </div>

              {/* Value per point */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Giá trị quy đổi khi tiêu điểm (đ)</label>
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
                  placeholder="1,000"
                  className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all ${
                    valueError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
                  }`}
                  min="0"
                />
                {valueError && (
                  <span className="text-[10px] font-bold text-rose-500">⚠️ {valueError}</span>
                )}
              </div>
            </div>

            {/* Live simulation calculation box */}
            {isEnabled && spendForPoint > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3 mt-1 animate-fadeIn">
                <span className="text-base mt-0.5">ℹ️</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-blue-900">Ví dụ minh họa trực quan:</span>
                  <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                    Khách giặt đơn <strong className="text-blue-950">100.000đ</strong> sẽ nhận được{' '}
                    <strong className="text-blue-950 font-black">{examplePoints} điểm</strong>.
                    Khi tiêu điểm này để giảm trừ thanh toán, trị giá tương đương{' '}
                    <strong className="text-blue-950 font-black">{exampleDiscount.toLocaleString('vi-VN')}đ</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Quy tắc đổi thưởng */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award size={16} className="text-amber-500" /> Quy tắc đổi điểm nhận Voucher/Quà tặng
                </h3>
              </div>
              <button
                type="button"
                onClick={handleOpenAddRule}
                disabled={isStaffMode}
                className={`flex items-center gap-1 py-1.5 px-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-655 hover:text-blue-600 rounded-xl font-bold text-[11px] transition-all bg-white cursor-pointer ${
                  isStaffMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Plus size={12} /> Thêm quy tắc
              </button>
            </div>

            {/* Rules list */}
            <div className="overflow-x-auto w-full border border-slate-150 rounded-xl bg-white">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                    <th className="py-2.5 px-4">Tên quà / Voucher</th>
                    <th className="py-2.5 px-4 text-center">Số điểm đổi</th>
                    <th className="py-2.5 px-4 text-right">Trị giá nhận được</th>
                    <th className="py-2.5 px-4 text-center">Bật/Tắt</th>
                    <th className="py-2.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs">
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                        Chưa có quy tắc đổi thưởng nào được tạo.
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{rule.name}</td>
                        <td className="py-3 px-4 text-center font-bold text-blue-600">{rule.points} điểm</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-700">{rule.value}</td>
                        
                        {/* Toggle switch for single rule */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            disabled={isStaffMode}
                            onClick={() => handleToggleRule(rule.id)}
                            className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 focus:outline-none ${
                              rule.active ? 'bg-emerald-500' : 'bg-slate-200'
                            } ${isStaffMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ${
                                rule.active ? 'translate-x-3.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditRule(rule)}
                              disabled={isStaffMode}
                              className="p-1 hover:text-blue-600 rounded transition-colors text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                              title="Sửa"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule(rule.id)}
                              disabled={isStaffMode}
                              className="p-1 hover:text-rose-600 rounded transition-colors text-slate-400 hover:bg-slate-100 disabled:opacity-50"
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

          {/* Card 3: Chính sách hết hạn điểm */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-slate-500" /> Chính sách hết hạn điểm thưởng
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { value: 'none', label: 'Điểm không hết hạn' },
                { value: '6m', label: 'Hết hạn sau 6 tháng' },
                { value: '12m', label: 'Hết hạn sau 12 tháng' }
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex-1 flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                    expiryPolicy === opt.value
                      ? 'border-blue-500 bg-blue-50/20 font-bold text-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-655'
                  } ${isStaffMode ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <span className="text-xs">{opt.label}</span>
                  <input
                    type="radio"
                    name="expiryPolicy"
                    value={opt.value}
                    checked={expiryPolicy === opt.value}
                    onChange={() => !isStaffMode && setExpiryPolicy(opt.value as any)}
                    className="accent-blue-600"
                    disabled={isStaffMode}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Card 4: Danh sách loại trừ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Info size={16} className="text-slate-500" /> Danh sách dịch vụ loại trừ (Không tích điểm)
            </h3>

            <div className="flex flex-col gap-3">
              {/* Exclude option 1 */}
              <label
                className={`flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 transition-all cursor-pointer ${
                  excludeLowPrice ? 'border-blue-400 bg-white shadow-2xs' : 'hover:bg-slate-100'
                } ${isStaffMode ? 'pointer-events-none opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={excludeLowPrice}
                  onChange={(e) => !isStaffMode && setExcludeLowPrice(e.target.checked)}
                  disabled={isStaffMode}
                  className="accent-blue-600 rounded"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Dịch vụ giặt hộ giá rẻ</span>
                  <span className="text-[10px] text-slate-400">Các gói giặt tiết kiệm đặc thù không áp dụng tích điểm.</span>
                </div>
              </label>

              {/* Exclude option 2 */}
              <label
                className={`flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 transition-all cursor-pointer ${
                  excludeHighPromo ? 'border-blue-400 bg-white shadow-2xs' : 'hover:bg-slate-100'
                } ${isStaffMode ? 'pointer-events-none opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={excludeHighPromo}
                  onChange={(e) => !isStaffMode && setExcludeHighPromo(e.target.checked)}
                  disabled={isStaffMode}
                  className="accent-blue-600 rounded"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Dịch vụ đang khuyến mãi sâu</span>
                  <span className="text-[10px] text-slate-400">Không cho phép tích lũy điểm khi đã sử dụng mã giảm giá lớn.</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Side: Role control and warnings */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card 5: Phân quyền & Chế độ nhân viên */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-indigo-600" /> Quyền hạn & Chế độ
            </h3>

            {/* Toggle Switch Staff Mode */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 select-none">
                  {isStaffMode ? (
                    <ShieldAlert size={13} className="text-amber-500 animate-pulse animate-duration-1000" />
                  ) : (
                    <CheckCircle size={13} className="text-emerald-500" />
                  )}
                  Chế độ nhân viên
                </span>
                <span className="text-[9px] text-slate-400">Xem thử giới hạn quyền</span>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setIsStaffMode(!isStaffMode);
                  toast(
                    isStaffMode
                      ? 'Đã tắt chế độ nhân viên. Chuyển sang quyền Chủ tiệm (Xem & Sửa).'
                      : 'Đã bật chế độ nhân viên. Trạng thái chỉ xem (Readonly).',
                    'info'
                  );
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  isStaffMode ? 'bg-amber-500' : 'bg-slate-200'
                }`}
                aria-label="Toggle Staff Mode"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isStaffMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Role Notice Alert */}
            <div className="bg-indigo-50/70 border border-indigo-100/70 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-indigo-900/90 leading-relaxed font-semibold">
              <span className="text-base select-none">👮</span>
              <div>
                <strong>Quy định bảo mật hệ thống:</strong>
                <p className="text-[10px] text-indigo-900/80 mt-1 font-medium leading-relaxed">
                  Chỉ Chủ tiệm mới có quyền thay đổi cấu hình. Nhân viên chỉ được xem.
                </p>
              </div>
            </div>
          </div>

          {/* Card 6: Trạng thái áp dụng */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Trạng thái áp dụng
            </h3>

            {isSaved ? (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCircle size={16} />
                  <span>Đã lưu & áp dụng thành công!</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2">
                  <span className="text-base">📢</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-amber-800">Lưu ý đồng bộ:</span>
                    <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                      Màn hình tạo đơn sẽ lập tức tính điểm theo công thức mới.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 font-medium italic text-center py-4">
                Chưa có thay đổi nào được ghi nhận. Bấm "Lưu & Áp dụng" để cập nhật chính sách.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Confirm Save Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Xác nhận lưu chính sách"
        message="Thay đổi này sẽ áp dụng cho các đơn hàng kể từ thời điểm này, điểm cũ của khách hàng sẽ giữ nguyên. Bạn có muốn tiếp tục?"
        confirmText="Đồng ý áp dụng"
        cancelText="Quay lại kiểm tra"
      />

      {/* Redemption Rule Modal (Add / Edit) */}
      <Modal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        title={editingRuleId ? 'Cập nhật quy tắc đổi thưởng' : 'Thêm quy tắc đổi thưởng mới'}
        size="sm"
      >
        <form onSubmit={handleSaveRule} className="flex flex-col gap-4 text-slate-800">
          
          {/* Rule Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Tên quà hoặc voucher <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Ví dụ: Giảm giá 20.000đ"
              value={ruleName}
              onChange={(e) => {
                setRuleName(e.target.value);
                if (e.target.value.trim()) setRuleNameError('');
              }}
              className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all ${
                ruleNameError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
              }`}
            />
            {ruleNameError && (
              <span className="text-[10px] font-bold text-rose-500">⚠️ {ruleNameError}</span>
            )}
          </div>

          {/* Points required */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Số điểm cần đổi <span className="text-rose-500">*</span></label>
            <input
              type="number"
              placeholder="Ví dụ: 200"
              value={rulePoints}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                setRulePoints(val);
                if (val !== '' && val > 0) setRulePointsError('');
              }}
              className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all ${
                rulePointsError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
              }`}
              min="1"
            />
            {rulePointsError && (
              <span className="text-[10px] font-bold text-rose-500">⚠️ {rulePointsError}</span>
            )}
          </div>

          {/* Value received */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Giá trị nhận được <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Ví dụ: 20.000đ hoặc 10%"
              value={ruleValue}
              onChange={(e) => {
                setRuleValue(e.target.value);
                if (e.target.value.trim()) setRuleValueError('');
              }}
              className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all ${
                ruleValueError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
              }`}
            />
            {ruleValueError && (
              <span className="text-[10px] font-bold text-rose-500">⚠️ {ruleValueError}</span>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end mt-3 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsRuleModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-slate-650 bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
