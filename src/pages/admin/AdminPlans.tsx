import React, { useState, useEffect } from 'react';
import { Plus, Copy, Ban, Trash2, CheckCircle, AlertTriangle, Layers, Check } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  Input,
  ConfirmDialog,
} from '../../components/common';
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
    setSelectedPlanId('new-plan-' + Date.now());
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

    setSelectedPlanId('clone-plan-' + Date.now());
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
    setIsActive(false);
    setPlans(prev =>
      prev.map(p => (p.id === selectedPlanId ? { ...p, isActive: false } : p))
    );
    toast('Đã chuyển gói sang trạng thái Ngừng kinh doanh.', 'warning');
  };
  const handleDelete = () => {
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
    setSelectedPlanId('');
    toast(`Đã xóa gói dịch vụ ${activePlan.name}.`, 'success');
  };

  const executeSave = () => {
    const finalMaxBranches = unlimitedBranches ? -1 : maxBranches;
    const finalMaxOrders = unlimitedOrders ? -1 : maxOrdersPerMonth;

    const newPlanData: Plan = {
      id: selectedPlanId,
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
    } else {
      setPlans(prev => prev.map(p => (p.id === selectedPlanId ? newPlanData : p)));
    }

    setIsNew(false);
    setOriginalPrice(price);
    setSaveSuccess(true);
    setFormErrors({});
    toast('Đã lưu và áp dụng thông tin gói dịch vụ.', 'success');
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
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      <PageHeader
        title="Thiết lập gói dịch vụ"
        description="Cấu hình bảng giá, hạn dùng và giới hạn tính năng cho đối tác."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Gói dịch vụ' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Packages Cards List */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Danh sách gói</h3>
            <Button variant="primary" size="sm" onClick={handleCreateNew} className="flex items-center gap-1">
              <Plus size={14} />
              Tạo gói mới
            </Button>
          </div>

          <div className="flex flex-col gap-3.5">
            {plans.map((p) => {
              const isSelected = p.id === selectedPlanId;
              return (
                <div
                  key={p.id}
                  onClick={() => selectPlan(p)}
                  className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden select-none ${
                    isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'
                  }`}
                >
                  {/* Badge Defaults */}
                  {p.isTrialDefault && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                      Gói mặc định Trial
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border font-extrabold text-sm ${
                      p.isActive ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-slate-800">{p.name}</span>
                      <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">{p.code}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-50 pt-2 text-xs">
                    <div>
                      <strong className="text-slate-800 text-sm">{p.price.toLocaleString('vi-VN')}đ</strong>
                      <span className="text-slate-400 font-semibold text-[10px]"> / {p.duration} ngày</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge
                        label={p.isActive ? 'Đang bán' : 'Bị ẩn'}
                        variant={p.isActive ? 'success' : 'default'}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-semibold flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span>Số đối tác đang dùng:</span>
                    <strong className="text-slate-700 font-bold">{p.partnersCount}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Package Detail & Editing Form */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-blue-500" />
              {isNew ? 'Chi tiết gói dịch vụ mới' : 'Chi tiết gói dịch vụ cấu hình'}
            </h3>

            {/* Save Success Notice */}
            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col gap-1 text-emerald-800 mb-5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500 shrink-0" size={16} />
                  <span className="font-extrabold text-xs">Đã lưu và áp dụng thông tin gói dịch vụ.</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold pl-6">
                  Thông tin gói mới sẽ hiển thị trong dropdown chọn gói ở màn hình chi tiết đối tác.
                </span>
              </div>
            )}

            {/* Delete Error Warning */}
            {formErrors.delete && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 mb-5 animate-fadeIn">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span className="font-bold">{formErrors.delete}</span>
              </div>
            )}

            <form onSubmit={handleSaveClick} className="flex flex-col gap-5">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="planName"
                  label="Tên gói *"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                  }}
                  error={formErrors.name}
                  placeholder="Ví dụ: Premium Plan"
                />

                <Input
                  id="planCode"
                  label="Mã gói dịch vụ *"
                  value={code}
                  readOnly={!isNew}
                  className={!isNew ? 'bg-slate-50 text-slate-500 font-semibold border-slate-200 cursor-not-allowed' : ''}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''));
                    if (formErrors.code) setFormErrors(prev => ({ ...prev, code: '' }));
                  }}
                  error={formErrors.code}
                  placeholder="Ví dụ: PREMIUM"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="planPrice"
                  label="Giá niêm yết (VNĐ) *"
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(parseInt(e.target.value, 10) || 0);
                    if (formErrors.price) setFormErrors(prev => ({ ...prev, price: '' }));
                  }}
                  error={formErrors.price}
                />

                <Input
                  id="planDuration"
                  label="Thời hạn hiệu lực (ngày) *"
                  type="number"
                  value={duration}
                  onChange={(e) => {
                    setDuration(parseInt(e.target.value, 10) || 0);
                    if (formErrors.duration) setFormErrors(prev => ({ ...prev, duration: '' }));
                  }}
                  error={formErrors.duration}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Mô tả gói dịch vụ *</label>
                <textarea
                  rows={3}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-md text-slate-700 text-xs focus:border-primary focus:bg-white outline-none transition-all placeholder-slate-400 resize-none font-semibold text-sm ${
                    formErrors.description ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="Mô tả tóm tắt tính năng chính của gói dịch vụ..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors(prev => ({ ...prev, description: '' }));
                  }}
                />
                {formErrors.description && (
                  <span className="text-[10px] text-red-500 font-semibold pl-1">{formErrors.description}</span>
                )}
              </div>

              {/* Resource Quota Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-slate-750 uppercase tracking-wider">Khối giới hạn tài nguyên</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">Số chi nhánh tối đa</label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-500 select-none">
                        <input
                          type="checkbox"
                          checked={unlimitedBranches}
                          onChange={(e) => setUnlimitedBranches(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Không giới hạn</span>
                      </label>
                    </div>
                    <Input
                      id="branchesLimit"
                      type="number"
                      value={maxBranches}
                      disabled={unlimitedBranches}
                      className={unlimitedBranches ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : ''}
                      onChange={(e) => setMaxBranches(parseInt(e.target.value, 10) || 1)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">Số đơn hàng tối đa/tháng</label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-500 select-none">
                        <input
                          type="checkbox"
                          checked={unlimitedOrders}
                          onChange={(e) => setUnlimitedOrders(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Không giới hạn</span>
                      </label>
                    </div>
                    <Input
                      id="ordersLimit"
                      type="number"
                      value={maxOrdersPerMonth}
                      disabled={unlimitedOrders}
                      className={unlimitedOrders ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : ''}
                      onChange={(e) => setMaxOrdersPerMonth(parseInt(e.target.value, 10) || 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Feature Selection Permissions */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-750 uppercase tracking-wider mb-2.5">Bảng phân quyền tính năng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const isChecked = selectedFeatures.includes(feature);
                    return (
                      <label
                        key={feature}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition-all ${
                          isChecked ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFeatureToggle(feature)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                        />
                        <span className="text-xs font-bold truncate">{feature}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status and default trial configuration */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-750">Trạng thái gói</label>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-xs font-extrabold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isActive ? 'Đang hoạt động (Active)' : 'Tạm khóa (Inactive)'}
                      </span>
                    </label>
                  </div>
                  {!isActive && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-100 rounded w-fit">
                      Gói này sẽ bị ẩn khỏi trang đăng ký/gia hạn.
                    </span>
                  )}
                </div>

                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isTrialDefault}
                    onChange={(e) => setIsTrialDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700">Thiết lập làm gói Trial mặc định</span>
                    <span className="text-[9px] text-slate-400 font-semibold">Tự động kích hoạt khi có đối tác mới đăng ký thử nghiệm.</span>
                  </div>
                </label>
              </div>

              {/* Action Buttons Block */}
              <div className="flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-4 mt-2">
                <div className="flex flex-wrap gap-2 mr-auto">
                  {!isNew && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleClone} className="flex items-center gap-1 text-xs">
                        <Copy size={13} />
                        Nhân bản gói
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleStopBusiness} className="flex items-center gap-1 text-xs text-amber-600 hover:bg-amber-50 border-amber-250">
                        <Ban size={13} />
                        Ngừng kinh doanh
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDelete} className="flex items-center gap-1 text-xs text-red-650 hover:bg-red-50 border-red-200">
                        <Trash2 size={13} />
                        Xóa gói
                      </Button>
                    </>
                  )}
                </div>

                <Button variant="primary" size="sm" type="submit" className="flex items-center gap-1 text-xs px-4">
                  <Check size={14} />
                  Lưu & Áp dụng
                </Button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* Confirmation modal for updating prices */}
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
