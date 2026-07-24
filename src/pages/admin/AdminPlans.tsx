import React, { useState, useEffect } from 'react';
import { Plus, Copy, Ban, Trash2, CheckCircle, AlertTriangle, Check, Zap, TrendingUp, Crown } from 'lucide-react';
import { ConfirmDialog } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Plan {
  id: string;
  name: string;
  code: string;
  price: number;
  duration: number;
  partnersCount: number;
  isActive: boolean;
  isTrialDefault: boolean;
  maxBranches: number; // -1 for unlimited
  maxOrdersPerMonth: number; // -1 for unlimited
  description: string;
  features: string[];
}

interface PlanTheme {
  primaryHex: string;
  primaryClass: string;
  bgSoftClass: string;
  borderSoftClass: string;
  leftRailClass: string;
  sublabel: string;
  icon: React.ReactNode;
}

const getPlanTheme = (planName: string, planCode: string): PlanTheme => {
  const nameUpper = (planName || planCode || '').toUpperCase();

  if (nameUpper.includes('PRO')) {
    return {
      primaryHex: '#0F766E',
      primaryClass: 'text-[#0F766E]',
      bgSoftClass: 'bg-[#ECFDF5]',
      borderSoftClass: 'border-[#A7F3D0]',
      leftRailClass: 'border-l-4 border-l-[#0F766E] bg-[#ECFDF5]/60',
      sublabel: 'Dành cho cửa hàng tăng trưởng',
      icon: <TrendingUp size={14} className="text-[#0F766E]" />
    };
  }

  if (nameUpper.includes('ENTERPRISE')) {
    return {
      primaryHex: '#6D28D9',
      primaryClass: 'text-[#6D28D9]',
      bgSoftClass: 'bg-[#F5F3FF]',
      borderSoftClass: 'border-[#DDD6FE]',
      leftRailClass: 'border-l-4 border-l-[#6D28D9] bg-[#F5F3FF]/60',
      sublabel: 'Cho chuỗi và doanh nghiệp',
      icon: <Crown size={14} className="text-[#6D28D9]" />
    };
  }

  // Default: Basic
  return {
    primaryHex: '#2563EB',
    primaryClass: 'text-[#2563EB]',
    bgSoftClass: 'bg-[#EFF6FF]',
    borderSoftClass: 'border-[#BFDBFE]',
    leftRailClass: 'border-l-4 border-l-[#2563EB] bg-[#EFF6FF]/60',
    sublabel: 'Cho cửa hàng nhỏ',
    icon: <Zap size={14} className="text-[#2563EB]" />
  };
};

const AVAILABLE_FEATURES = [
  'Quản lý kho',
  'Báo cáo nâng cao',
  'Tích hợp Zalo',
  'Quản lý nhân viên',
  'Quản lý B2B',
  'Xuất Excel/PDF'
];

const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    code: 'BASIC',
    price: 499000,
    duration: 30,
    partnersCount: 12,
    isActive: true,
    isTrialDefault: true,
    maxBranches: 1,
    maxOrdersPerMonth: 500,
    description: 'Gói cơ bản dành cho các cửa hàng giặt là nhỏ lẻ đơn lẻ, quản lý tối giản.',
    features: ['Quản lý nhân viên', 'Xuất Excel/PDF']
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    code: 'PRO',
    price: 1499000,
    duration: 30,
    partnersCount: 8,
    isActive: true,
    isTrialDefault: false,
    maxBranches: 5,
    maxOrdersPerMonth: 3000,
    description: 'Gói chuyên nghiệp hỗ trợ chuỗi chi nhánh vừa và nhỏ, cung cấp báo cáo và các tính năng mở rộng.',
    features: ['Quản lý kho', 'Báo cáo nâng cao', 'Quản lý nhân viên', 'Xuất Excel/PDF']
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    code: 'ENTERPRISE',
    price: 4999000,
    duration: 30,
    partnersCount: 2,
    isActive: true,
    isTrialDefault: false,
    maxBranches: -1,
    maxOrdersPerMonth: -1,
    description: 'Giải pháp toàn diện cho doanh nghiệp lớn hoặc chuỗi giặt ủi quy mô rộng, tích hợp nâng cao.',
    features: ['Quản lý kho', 'Báo cáo nâng cao', 'Tích hợp Zalo', 'Quản lý nhân viên', 'Quản lý B2B', 'Xuất Excel/PDF']
  }
];

export default function AdminPlans() {
  const { toast } = useToast();

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('dudi_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Form Fields State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isTrialDefault, setIsTrialDefault] = useState(false);

  // Quota limits
  const [maxBranches, setMaxBranches] = useState(5);
  const [unlimitedBranches, setUnlimitedBranches] = useState(false);
  const [maxOrdersPerMonth, setMaxOrdersPerMonth] = useState(3000);
  const [unlimitedOrders, setUnlimitedOrders] = useState(false);

  // Features list
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Page states
  const [isNew, setIsNew] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Confirmations
  const [priceConfirmOpen, setPriceConfirmOpen] = useState(false);

  // Active Theme based on currently selected/edited plan name/code
  const activeTheme = getPlanTheme(name, code);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('dudi_plans', JSON.stringify(plans));
  }, [plans]);

  // Handle plan select
  const selectPlan = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setName(plan.name);
    setCode(plan.code);
    setPrice(plan.price);
    setOriginalPrice(plan.price);
    setDuration(plan.duration);
    setDescription(plan.description);
    setIsActive(plan.isActive);
    setIsTrialDefault(plan.isTrialDefault);

    setUnlimitedBranches(plan.maxBranches === -1);
    setMaxBranches(plan.maxBranches === -1 ? 5 : plan.maxBranches);
    setUnlimitedOrders(plan.maxOrdersPerMonth === -1);
    setMaxOrdersPerMonth(plan.maxOrdersPerMonth === -1 ? 3000 : plan.maxOrdersPerMonth);

    setSelectedFeatures(plan.features);
    setIsNew(false);
    setFormErrors({});
    setSaveSuccess(false);
  };

  // Initial selection
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      selectPlan(plans[0]);
    }
  }, [plans]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleCreateNew = () => {
    setSelectedPlanId('');
    setName('');
    setCode('');
    setPrice(0);
    setOriginalPrice(0);
    setDuration(30);
    setDescription('');
    setIsActive(true);
    setIsTrialDefault(false);
    setUnlimitedBranches(false);
    setMaxBranches(1);
    setUnlimitedOrders(false);
    setMaxOrdersPerMonth(500);
    setSelectedFeatures([]);
    setIsNew(true);
    setFormErrors({});
    setSaveSuccess(false);
  };

  const handleClone = () => {
    const activePlan = plans.find(p => p.id === selectedPlanId);
    if (!activePlan) return;

    setSelectedPlanId('');
    setName(`Bản sao của ${activePlan.name}`);
    setCode(`COPY-${activePlan.code}`);
    setPrice(activePlan.price);
    setOriginalPrice(activePlan.price);
    setDuration(activePlan.duration);
    setDescription(activePlan.description);
    setIsActive(activePlan.isActive);
    setIsTrialDefault(false);

    setUnlimitedBranches(activePlan.maxBranches === -1);
    setMaxBranches(activePlan.maxBranches === -1 ? 5 : activePlan.maxBranches);
    setUnlimitedOrders(activePlan.maxOrdersPerMonth === -1);
    setMaxOrdersPerMonth(activePlan.maxOrdersPerMonth === -1 ? 3000 : activePlan.maxOrdersPerMonth);

    setSelectedFeatures(activePlan.features);
    setIsNew(true);
    setFormErrors({});
    setSaveSuccess(false);
    toast(`Đã nhân bản gói ${activePlan.name}. Vui lòng chỉnh sửa và lưu.`, 'info');
  };

  const handleStopBusiness = () => {
    if (!selectedPlanId) return;
    setIsActive(false);
    setPlans(prev =>
      prev.map(p => (p.id === selectedPlanId ? { ...p, isActive: false } : p))
    );
    toast('Đã chuyển gói sang trạng thái Ngừng kinh doanh.', 'warning');
  };

  const handleDelete = () => {
    if (!selectedPlanId) return;
    const activePlan = plans.find(p => p.id === selectedPlanId);
    if (!activePlan) return;

    if (activePlan.partnersCount > 0) {
      toast('Không thể xóa gói đang có đối tác sử dụng. Hãy chuyển sang trạng thái Ngừng kinh doanh.', 'error');
      setFormErrors({
        delete: 'Không thể xóa gói đang có đối tác sử dụng. Hãy chuyển sang trạng thái Ngừng kinh doanh.'
      });
      return;
    }

    const updatedPlans = plans.filter(p => p.id !== selectedPlanId);
    setPlans(updatedPlans);
    if (updatedPlans.length > 0) {
      selectPlan(updatedPlans[0]);
    } else {
      handleCreateNew();
    }
    toast(`Đã xóa gói dịch vụ ${activePlan.name}.`, 'success');
  };

  const executeSave = () => {
    const finalMaxBranches = unlimitedBranches ? -1 : maxBranches;
    const finalMaxOrders = unlimitedOrders ? -1 : maxOrdersPerMonth;
    const newId = isNew ? `plan-${code.trim().toLowerCase()}-${Date.now()}` : selectedPlanId;

    const newPlanData: Plan = {
      id: newId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      price,
      duration,
      partnersCount: isNew ? 0 : (plans.find(p => p.id === selectedPlanId)?.partnersCount || 0),
      isActive,
      isTrialDefault,
      maxBranches: finalMaxBranches,
      maxOrdersPerMonth: finalMaxOrders,
      description: description.trim(),
      features: selectedFeatures
    };

    if (isNew) {
      setPlans(prev => [...prev, newPlanData]);
      setSelectedPlanId(newId);
      setIsNew(false);
      toast('Đã tạo gói dịch vụ mới thành công.', 'success');
    } else {
      setPlans(prev => prev.map(p => (p.id === selectedPlanId ? newPlanData : p)));
      setIsNew(false);
      toast('Đã lưu và áp dụng thông tin gói dịch vụ.', 'success');
    }

    setOriginalPrice(price);
    setSaveSuccess(true);
    setFormErrors({});
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'Tên gói dịch vụ là bắt buộc.';
    if (!code.trim()) errors.code = 'Mã gói dịch vụ là bắt buộc.';
    if (!description.trim()) errors.description = 'Mô tả gói dịch vụ là bắt buộc.';
    if (price < 0) errors.price = 'Giá niêm yết phải lớn hơn hoặc bằng 0.';
    if (duration < 1) errors.duration = 'Thời hạn hiệu lực phải tối thiểu 1 ngày.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Check duplicate code when creating a new plan
    if (isNew) {
      const duplicateCode = plans.some(p => p.code.toLowerCase() === code.trim().toLowerCase());
      if (duplicateCode) {
        errors.code = 'Mã gói này đã tồn tại trên hệ thống.';
        setFormErrors(errors);
        return;
      }
    }

    const priceChanged = !isNew && price !== originalPrice;
    if (priceChanged) {
      setPriceConfirmOpen(true);
    } else {
      executeSave();
    }
  };

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-6 text-left">
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

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            CẤU HÌNH BẢNG GIÁ & HẠN DÙNG
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Thiết lập gói dịch vụ
          </h1>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tạo gói mới</span>
        </button>
      </div>

      {/* SPLIT LAYOUT (Cột Trái 4 Cols / Cột Phải 8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI (35% / lg:col-span-4): DANH SÁCH GÓI DỊCH VỤ */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              DANH SÁCH GÓI DỊCH VỤ
            </span>
            <span className="text-[10px] font-bold text-slate-400">{plans.length} GÓI</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {plans.map((p) => {
              const isSelected = p.id === selectedPlanId;
              const pTheme = getPlanTheme(p.name, p.code);

              return (
                <div
                  key={p.id}
                  onClick={() => selectPlan(p)}
                  className={`bg-white border rounded-lg p-3.5 shadow-2xs transition-all cursor-pointer flex flex-col gap-2.5 relative overflow-hidden select-none ${
                    isSelected
                      ? pTheme.leftRailClass
                      : 'border-[#DCE5F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {/* Top line: Icon Circle + Name + Sublabel + Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pTheme.bgSoftClass} ${pTheme.borderSoftClass} border shrink-0`}>
                        {pTheme.icon}
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-black text-sm ${isSelected ? pTheme.primaryClass : 'text-slate-900'}`}>
                            {p.name}
                          </span>
                          <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border ${pTheme.bgSoftClass} ${pTheme.primaryClass} ${pTheme.borderSoftClass}`}>
                            {p.code}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">{pTheme.sublabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {p.isTrialDefault && (
                        <span className="text-[9px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                          Trial
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                        p.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {p.isActive ? 'Bán' : 'Ẩn'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Partner stats */}
                  <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <strong className="text-slate-900 font-black text-sm">
                        {p.price.toLocaleString('vi-VN')}đ
                      </strong>
                      <span className="text-slate-400 font-semibold text-[10px]">/ {p.duration} ngày</span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-semibold">
                      Đối tác dùng: <strong className="text-slate-800 font-bold">{p.partnersCount}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI (65% / lg:col-span-8): EDITOR PANEL (Accent color according to selected plan) */}
        <div className="lg:col-span-8 bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-6 text-left">
          
          {/* Header with active plan icon and accent title */}
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTheme.bgSoftClass} ${activeTheme.borderSoftClass} border`}>
                {activeTheme.icon}
              </div>
              <h2 className={`text-base font-black tracking-wider uppercase ${activeTheme.primaryClass}`}>
                {isNew ? 'THÊM GÓI DỊCH VỤ MỚI' : `CẤU HÌNH GÓI: ${name || code}`}
              </h2>
            </div>
            {!isNew && (
              <span className="text-xs font-mono font-bold text-slate-400">ID: {selectedPlanId}</span>
            )}
          </div>

          {/* Save Success Notice */}
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2.5 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle className="text-emerald-600 shrink-0" size={16} />
              <span className="font-extrabold">Đã lưu và áp dụng thành công thông tin gói dịch vụ.</span>
            </div>
          )}

          {/* Delete Error Warning */}
          {formErrors.delete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span className="font-bold">{formErrors.delete}</span>
            </div>
          )}

          <form onSubmit={handleSaveClick} className="flex flex-col gap-6">
            
            {/* SECTION 01 · THÔNG TIN GÓI */}
            <div className="flex flex-col gap-3">
              <div className={`text-[11px] font-mono font-bold tracking-wider uppercase border-b border-slate-100 pb-1 ${activeTheme.primaryClass}`}>
                01 · THÔNG TIN GÓI
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-800">Tên gói *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Premium Plan"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                      formErrors.name ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.name && <span className="text-red-500 text-[10px] font-semibold">{formErrors.name}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-800">Mã gói dịch vụ *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: PREMIUM"
                    value={code}
                    readOnly={!isNew}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''));
                      if (formErrors.code) setFormErrors(prev => ({ ...prev, code: '' }));
                    }}
                    className={`w-full h-[42px] px-3.5 border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                      !isNew ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-[#DCE5F0]' : 'bg-[#F8FAFC] border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.code && <span className="text-red-500 text-[10px] font-semibold">{formErrors.code}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-800">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(parseInt(e.target.value, 10) || 0);
                      if (formErrors.price) setFormErrors(prev => ({ ...prev, price: '' }));
                    }}
                    className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                      formErrors.price ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.price && <span className="text-red-500 text-[10px] font-semibold">{formErrors.price}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-800">Thời hạn hiệu lực (ngày) *</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      setDuration(parseInt(e.target.value, 10) || 0);
                      if (formErrors.duration) setFormErrors(prev => ({ ...prev, duration: '' }));
                    }}
                    className={`w-full h-[42px] px-3.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                      formErrors.duration ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {formErrors.duration && <span className="text-red-500 text-[10px] font-semibold">{formErrors.duration}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Mô tả gói dịch vụ *</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt tính năng chính của gói dịch vụ..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors(prev => ({ ...prev, description: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all resize-none ${
                    formErrors.description ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {formErrors.description && <span className="text-red-500 text-[10px] font-semibold">{formErrors.description}</span>}
              </div>
            </div>

            {/* SECTION 02 · GIỚI HẠN SỬ DỤNG */}
            <div className="flex flex-col gap-3 pt-2">
              <div className={`text-[11px] font-mono font-bold tracking-wider uppercase border-b border-slate-100 pb-1 ${activeTheme.primaryClass}`}>
                02 · GIỚI HẠN SỬ DỤNG
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Số chi nhánh tối đa</label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={unlimitedBranches}
                        onChange={(e) => setUnlimitedBranches(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Không giới hạn</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={maxBranches}
                    disabled={unlimitedBranches}
                    onChange={(e) => setMaxBranches(parseInt(e.target.value, 10) || 1)}
                    className={`w-full h-[42px] px-3.5 border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                      unlimitedBranches ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-[#DCE5F0]' : 'bg-[#F8FAFC] border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Số đơn hàng tối đa/tháng</label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={unlimitedOrders}
                        onChange={(e) => setUnlimitedOrders(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Không giới hạn</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={maxOrdersPerMonth}
                    disabled={unlimitedOrders}
                    onChange={(e) => setMaxOrdersPerMonth(parseInt(e.target.value, 10) || 1)}
                    className={`w-full h-[42px] px-3.5 border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all ${
                      unlimitedOrders ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-[#DCE5F0]' : 'bg-[#F8FAFC] border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 03 · QUYỀN TÍNH NĂNG (Theme-tinted when checked) */}
            <div className="flex flex-col gap-3 pt-2">
              <div className={`text-[11px] font-mono font-bold tracking-wider uppercase border-b border-slate-100 pb-1 ${activeTheme.primaryClass}`}>
                03 · QUYỀN TÍNH NĂNG
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {AVAILABLE_FEATURES.map((feature) => {
                  const isChecked = selectedFeatures.includes(feature);
                  return (
                    <label
                      key={feature}
                      className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-md cursor-pointer select-none transition-colors ${
                        isChecked
                          ? `${activeTheme.bgSoftClass} ${activeTheme.borderSoftClass} ${activeTheme.primaryClass} font-bold`
                          : 'bg-[#F8FAFC] border-[#DCE5F0] hover:bg-slate-100 text-slate-700 font-semibold'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                      />
                      <span className="text-xs truncate">{feature}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SECTION 04 · PHÁT HÀNH GÓI */}
            <div className="flex flex-col gap-3 pt-2">
              <div className={`text-[11px] font-mono font-bold tracking-wider uppercase border-b border-slate-100 pb-1 ${activeTheme.primaryClass}`}>
                04 · PHÁT HÀNH GÓI
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md p-3.5">
                {/* Active Toggle */}
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Trạng thái phát hành</span>
                    <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isActive ? 'Đang mở bán (Active)' : 'Ngừng kinh doanh (Inactive)'}
                    </span>
                  </div>
                </label>

                {/* Trial Default Toggle */}
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isTrialDefault}
                    onChange={(e) => setIsTrialDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Gói Trial mặc định</span>
                    <span className="text-[10px] text-slate-400 font-medium">Gán tự động khi đăng ký thử</span>
                  </div>
                </label>
              </div>
            </div>

            {/* FIXED FOOTER ACTION HIERARCHY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#DCE5F0] mt-2">
              
              {/* Left actions: Clone / Stop / Delete */}
              <div className="flex flex-wrap items-center gap-2">
                {!isNew && (
                  <>
                    <button
                      type="button"
                      onClick={handleClone}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition-colors cursor-pointer border-0 flex items-center gap-1"
                    >
                      <Copy size={13} />
                      <span>Nhân bản gói</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStopBusiness}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Ban size={13} />
                      <span>Ngừng kinh doanh</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Xóa gói</span>
                    </button>
                  </>
                )}
              </div>

              {/* Right primary action: Save & Apply using Plan Accent Color */}
              <button
                type="submit"
                style={{ backgroundColor: activeTheme.primaryHex }}
                className="px-5 py-2.5 hover:opacity-90 text-white font-bold text-xs rounded-md transition-all cursor-pointer border-0 shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <Check size={15} />
                <span>{isNew ? 'Tạo gói dịch vụ' : 'Lưu & Áp dụng'}</span>
              </button>

            </div>

          </form>
        </div>

      </div>

      {/* CONFIRMATION DIALOG FOR UPDATING PRICES */}
      <ConfirmDialog
        isOpen={priceConfirmOpen}
        onClose={() => setPriceConfirmOpen(false)}
        onConfirm={() => {
          setPriceConfirmOpen(false);
          executeSave();
        }}
        title="Xác nhận thay đổi giá gói"
        variant="primary"
        message="Thay đổi giá sẽ chỉ áp dụng cho các lượt gia hạn hoặc đăng ký mới từ bây giờ."
      />
    </div>
  );
}
