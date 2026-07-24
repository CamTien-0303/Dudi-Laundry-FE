import { useState, useEffect } from 'react';
import { Filter, Download, Mail, CheckCircle, RefreshCw, Bookmark, X, SlidersHorizontal } from 'lucide-react';
import { ConfirmDialog, Modal } from '../../components/common';
import { useToast } from '../../components/common/Toast';

// Mock Data for the 3 reports
const SYSTEM_GROWTH_DATA = [
  { month: '07/2026', newStores: 12, city: 'Hồ Chí Minh', topPlan: 'Pro', activationRate: '95%' },
  { month: '06/2026', newStores: 15, city: 'Hà Nội', topPlan: 'Pro', activationRate: '92%' },
  { month: '05/2026', newStores: 8, city: 'Đà Nẵng', topPlan: 'Basic', activationRate: '100%' },
  { month: '04/2026', newStores: 10, city: 'Hồ Chí Minh', topPlan: 'Enterprise', activationRate: '90%' },
  { month: '03/2026', newStores: 14, city: 'Hồ Chí Minh', topPlan: 'Pro', activationRate: '96%' },
  { month: '02/2026', newStores: 7, city: 'Hà Nội', topPlan: 'Basic', activationRate: '88%' },
  { month: '01/2026', newStores: 9, city: 'Cần Thơ', topPlan: 'Basic', activationRate: '100%' },
];

const OPERATION_DATA = [
  { storeId: 'STR-001', storeName: 'DUDI Quận 1', totalOrders: 320, totalWeight: 820, revenue: 16400000, plan: 'Pro', status: 'Đang hoạt động' },
  { storeId: 'STR-002', storeName: 'CleanPro Laundry', totalOrders: 280, totalWeight: 750, revenue: 15000000, plan: 'Basic', status: 'Đang hoạt động' },
  { storeId: 'STR-003', storeName: 'DUDI Bình Thạnh', totalOrders: 190, totalWeight: 490, revenue: 9800000, plan: 'Pro', status: 'Đang hoạt động' },
  { storeId: 'STR-004', storeName: 'Wash & Fold Express', totalOrders: 140, totalWeight: 310, revenue: 6200000, plan: 'Basic', status: 'Đang tạm dừng' },
  { storeId: 'STR-005', storeName: 'Eco-Wash Studio', totalOrders: 420, totalWeight: 1100, revenue: 22000000, plan: 'Enterprise', status: 'Đang hoạt động' },
];

const FINANCIAL_DATA = [
  { partnerId: 'MER-001', name: 'Nguyễn Văn An', plan: 'Pro', price: 999000, txDate: '15/07/2026', status: 'Thành công' },
  { partnerId: 'MER-002', name: 'Trần Thị Bình', plan: 'Basic', price: 499000, txDate: '12/07/2026', status: 'Thành công' },
  { partnerId: 'MER-003', name: 'Lê Hoàng Nam', plan: 'Enterprise', price: 2499000, txDate: '10/07/2026', status: 'Thành công' },
  { partnerId: 'MER-004', name: 'Phạm Minh Đức', plan: 'Pro', price: 999000, txDate: '08/07/2026', status: 'Chờ xử lý' },
  { partnerId: 'MER-005', name: 'Vũ Thị Hương', plan: 'Basic', price: 499000, txDate: '02/07/2026', status: 'Thành công' },
];

const AVAILABLE_COLUMNS: Record<string, string[]> = {
  growth: ['Tháng', 'Số lượng tiệm mới', 'Tỉnh/Thành', 'Gói đăng ký nhiều nhất', 'Tỷ lệ kích hoạt'],
  operation: ['Mã tiệm', 'Tên tiệm', 'Tổng đơn hàng', 'Khối lượng giặt (kg)', 'Doanh thu tiệm', 'Gói sử dụng', 'Trạng thái'],
  financial: ['Mã đối tác', 'Tên đối tác', 'Gói dịch vụ', 'Đơn giá thanh toán', 'Ngày giao dịch', 'Trạng thái']
};

export default function AdminReports() {
  const { toast } = useToast();

  // Role default: Super Admin
  const userRole = 'Super Admin';

  // ACTIVE REPORT TAB
  const [activeTab, setActiveTab] = useState<'growth' | 'operation' | 'financial'>('growth');

  // FILTER STATES
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-16');
  const [city, setCity] = useState('Tất cả');
  const [branch, setBranch] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['Basic', 'Pro', 'Enterprise']);
  
  // Saved presets state & popover
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: any }>>([
    {
      name: 'Báo cáo cuối tháng',
      filters: {
        fromDate: '2026-06-01',
        toDate: '2026-06-30',
        city: 'Hồ Chí Minh',
        branch: 'Tất cả',
        status: 'Tất cả',
        plans: ['Basic', 'Pro', 'Enterprise']
      }
    }
  ]);
  const [showSavedPresets, setShowSavedPresets] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  // Data Preview lists
  const [growthList, setGrowthList] = useState(SYSTEM_GROWTH_DATA);
  const [operationList, setOperationList] = useState(OPERATION_DATA);
  const [financialList, setFinancialList] = useState(FINANCIAL_DATA);

  // EXPORT DRAWER/MODAL STATE
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // PROCESS/CONFIRM DIALOG STATE
  const [confirmBackgroundOpen, setConfirmBackgroundOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedFileLink, setExportedFileLink] = useState('');
  const [exportedFileName, setExportedFileName] = useState('');

  // Init/Update columns selection default on tab change
  useEffect(() => {
    setSelectedColumns(AVAILABLE_COLUMNS[activeTab]);
  }, [activeTab]);

  // Handlers for plans checkboxes
  const handlePlanToggle = (plan: string) => {
    setSelectedPlans(prev =>
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  // Filter actions
  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      toast('Vui lòng chọn khoảng thời gian hợp lệ.', 'error');
      return;
    }

    if (activeTab === 'growth') {
      let filtered = [...SYSTEM_GROWTH_DATA];
      if (city !== 'Tất cả') {
        filtered = filtered.filter(item => item.city === city);
      }
      setGrowthList(filtered);
    } else if (activeTab === 'operation') {
      let filtered = [...OPERATION_DATA];
      if (branch !== 'Tất cả') {
        filtered = filtered.filter(item => item.storeName === branch);
      }
      if (status !== 'Tất cả') {
        filtered = filtered.filter(item => item.status === status);
      }
      filtered = filtered.filter(item => selectedPlans.includes(item.plan));
      setOperationList(filtered);
    } else if (activeTab === 'financial') {
      let filtered = [...FINANCIAL_DATA];
      if (status !== 'Tất cả') {
        const queryStatus = status === 'Hoàn thành' || status === 'Thành công' ? 'Thành công' : 'Chờ xử lý';
        filtered = filtered.filter(item => item.status === queryStatus);
      }
      filtered = filtered.filter(item => selectedPlans.includes(item.plan));
      setFinancialList(filtered);
    }

    toast('Đã áp dụng bộ lọc dữ liệu thành công.', 'success');
  };

  const handleClearFilter = () => {
    setFromDate('2026-07-01');
    setToDate('2026-07-16');
    setCity('Tất cả');
    setBranch('Tất cả');
    setStatus('Tất cả');
    setSelectedPlans(['Basic', 'Pro', 'Enterprise']);
    
    setGrowthList(SYSTEM_GROWTH_DATA);
    setOperationList(OPERATION_DATA);
    setFinancialList(FINANCIAL_DATA);
    toast('Đã đặt lại bộ lọc mặc định.', 'info');
  };

  const handleSaveFilterPreset = () => {
    if (!newFilterName.trim()) {
      toast('Vui lòng nhập tên cấu hình bộ lọc.', 'error');
      return;
    }
    const newPreset = {
      name: newFilterName.trim(),
      filters: { fromDate, toDate, city, branch, status, plans: [...selectedPlans] }
    };
    setSavedFilters(prev => [...prev, newPreset]);
    setNewFilterName('');
    toast(`Đã lưu cấu hình bộ lọc "${newPreset.name}"`, 'success');
  };

  const handleApplySavedPreset = (preset: any) => {
    setFromDate(preset.filters.fromDate);
    setToDate(preset.filters.toDate);
    setCity(preset.filters.city);
    setBranch(preset.filters.branch);
    setStatus(preset.filters.status);
    setSelectedPlans(preset.filters.plans);
    setShowSavedPresets(false);
    toast(`Đã áp dụng bộ lọc: ${preset.name}`, 'info');
  };

  // EXPORT FLOW
  const handleStartExportFlow = (type: 'download' | 'email') => {
    if (activeTab === 'financial' && userRole !== 'Super Admin') {
      toast('Từ chối truy cập: Chỉ Super Admin cấp cao nhất mới được phép xuất dữ liệu tài chính hệ thống.', 'error');
      return;
    }

    if (selectedColumns.length === 0) {
      toast('Vui lòng chọn ít nhất một cột muốn xuất dữ liệu.', 'error');
      return;
    }

    const dateStart = new Date(fromDate);
    const dateEnd = new Date(toDate);
    const yearsDiff = (dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    if (yearsDiff > 2) {
      setConfirmBackgroundOpen(true);
    } else {
      triggerExportAnimation(type);
    }
  };

  const triggerExportAnimation = (type: 'download' | 'email') => {
    setIsExporting(true);
    setExportProgress(0);
    setExportedFileLink('');
    
    const fileLabel = activeTab === 'growth' ? 'PHAT_TRIEN' : activeTab === 'operation' ? 'HOAT_DONG' : 'TAI_CHINH';
    const today = new Date();
    const formattedToday = `${String(today.getDate()).padStart(2, '0')}_${String(today.getMonth() + 1).padStart(2, '0')}_${today.getFullYear()}`;
    const filename = `BAO_CAO_${fileLabel}_${formattedToday}.${exportFormat}`;

    const timer = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsExporting(false);
          if (type === 'download') {
            setExportedFileLink('#');
            setExportedFileName(filename);
            toast(`Đã khởi tạo file ${filename} thành công!`, 'success');
          } else {
            toast(`Báo cáo ${filename} đã được gửi thành công đến Email quản trị.`, 'success');
          }
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Summarize computations
  const getSummaryRow = () => {
    if (activeTab === 'growth') {
      const totalStores = growthList.reduce((acc, curr) => acc + curr.newStores, 0);
      return { label: 'Tổng cộng', count: growthList.length, value: `${totalStores} cửa hàng mới` };
    }
    if (activeTab === 'operation') {
      const totalOrders = operationList.reduce((acc, curr) => acc + curr.totalOrders, 0);
      const totalWeight = operationList.reduce((acc, curr) => acc + curr.totalWeight, 0);
      return { label: 'Tổng hệ thống', count: operationList.length, value: `${totalOrders} đơn | ${totalWeight} kg` };
    }
    const totalRev = financialList.reduce((acc, curr) => acc + curr.price, 0);
    return { label: 'Tổng doanh thu', count: financialList.length, value: `${totalRev.toLocaleString('vi-VN')} đ` };
  };

  const summary = getSummaryRow();

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

      {/* HEADER BAR (With top right 'Xuất dữ liệu' drawer button) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            DATA WORKSPACE & ANALYTICS
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Báo cáo chi tiết và xuất dữ liệu
          </h1>
        </div>

        <button
          onClick={() => setExportModalOpen(true)}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Download size={16} />
          <span>Xuất dữ liệu</span>
        </button>
      </div>

      {/* REPORT TYPE TABS (3 MAIN TABS) */}
      <div className="flex border-b border-[#DCE5F0] gap-2 bg-white p-1.5 rounded-xl border shadow-2xs">
        <button
          type="button"
          onClick={() => { setActiveTab('growth'); setExportedFileLink(''); }}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
            activeTab === 'growth'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Phát triển hệ thống
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('operation'); setExportedFileLink(''); }}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
            activeTab === 'operation'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hoạt động tiệm
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('financial'); setExportedFileLink(''); }}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
            activeTab === 'financial'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tài chính
        </button>
      </div>

      {/* COMPACT FILTER TOOLBAR (With compact 'Bộ lọc đã lưu' action) */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl p-3.5 shadow-2xs flex flex-col gap-3 text-xs">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Filter size={14} className="text-[#2563EB]" />
            BỘ LỌC TRUY VẤN DỮ LIỆU
          </span>

          {/* Compact Saved Filters Action Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSavedPresets(prev => !prev)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition-colors cursor-pointer border-0 flex items-center gap-1.5"
            >
              <Bookmark size={12} className="text-[#2563EB]" />
              <span>Bộ lọc đã lưu ({savedFilters.length})</span>
            </button>

            {/* Saved Presets Popover */}
            {showSavedPresets && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#DCE5F0] rounded-lg shadow-lg p-3 z-30 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cấu hình đã lưu</span>
                  <button
                    onClick={() => setShowSavedPresets(false)}
                    className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                  {savedFilters.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplySavedPreset(preset)}
                      className="text-left px-2.5 py-1.5 hover:bg-[#EEF4FF] rounded text-xs font-semibold text-slate-800 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-between"
                    >
                      <span className="truncate">{preset.name}</span>
                      <span className="text-[10px] text-[#2563EB] font-bold">Áp dụng</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Tên bộ lọc..."
                    value={newFilterName}
                    onChange={(e) => setNewFilterName(e.target.value)}
                    className="w-full px-2 py-1 text-[11px] bg-[#F8FAFC] border border-[#DCE5F0] rounded outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSaveFilterPreset}
                    className="px-2 py-1 bg-[#2563EB] text-white text-[10px] font-bold rounded cursor-pointer border-0 shrink-0"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inputs Toolbar Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
          
          {/* From Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Từ ngày</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đến ngày</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tỉnh/Thành</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chi nhánh</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'DUDI Quận 1', 'CleanPro Laundry', 'DUDI Bình Thạnh', 'Wash & Fold Express'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'Đang hoạt động', 'Đang tạm dừng', 'Thành công', 'Chờ xử lý'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Plans selection checkboxes */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gói sử dụng</label>
            <div className="flex items-center gap-2 pt-1.5">
              {['Basic', 'Pro', 'Enterprise'].map((tier) => (
                <label key={tier} className="inline-flex items-center gap-1 cursor-pointer select-none text-[11px] font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedPlans.includes(tier)}
                    onChange={() => handlePlanToggle(tier)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{tier.slice(0, 1)}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Filter Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClearFilter}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition-colors cursor-pointer border-0"
          >
            Đặt lại
          </button>
          <button
            type="button"
            onClick={handleApplyFilter}
            className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors cursor-pointer border-0 shadow-2xs"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      {/* DATA PREVIEW TABLE (MAIN CONTENT WORKSPACE, FULL WIDTH, MAX 50 ROWS) */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl shadow-2xs overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-[#DCE5F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#2563EB]" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              XEM TRƯỚC DỮ LIỆU BÁO CÁO (MAX 50 DÒNG NGẪU NHIÊN)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            TAB: {activeTab.toUpperCase()}
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {activeTab === 'growth' && (
                  <>
                    <th className="py-3 px-4">Tháng</th>
                    <th className="py-3 px-4">Số lượng tiệm mới</th>
                    <th className="py-3 px-4">Tỉnh/Thành phát triển</th>
                    <th className="py-3 px-4">Gói sử dụng nhiều nhất</th>
                    <th className="py-3 px-4 text-right">Tỷ lệ kích hoạt</th>
                  </>
                )}
                {activeTab === 'operation' && (
                  <>
                    <th className="py-3 px-4">Mã tiệm</th>
                    <th className="py-3 px-4">Tên tiệm</th>
                    <th className="py-3 px-4">Tổng đơn hàng</th>
                    <th className="py-3 px-4">Khối lượng giặt (kg)</th>
                    <th className="py-3 px-4 text-right">Doanh thu tiệm</th>
                    <th className="py-3 px-4">Gói sử dụng</th>
                    <th className="py-3 px-4 text-right">Trạng thái</th>
                  </>
                )}
                {activeTab === 'financial' && (
                  <>
                    <th className="py-3 px-4">Mã đối tác</th>
                    <th className="py-3 px-4">Tên chủ tiệm</th>
                    <th className="py-3 px-4">Gói dịch vụ</th>
                    <th className="py-3 px-4 text-right">Giá trị thanh toán</th>
                    <th className="py-3 px-4">Ngày giao dịch</th>
                    <th className="py-3 px-4 text-right">Trạng thái</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0] text-slate-800">
              {activeTab === 'growth' && (
                growthList.length > 0 ? (
                  growthList.map((row, idx) => (
                    <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.month}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{row.newStores} tiệm</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{row.city}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {row.topPlan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">{row.activationRate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-semibold">
                      Không có dữ liệu phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                )
              )}

              {activeTab === 'operation' && (
                operationList.length > 0 ? (
                  operationList.map((row, idx) => (
                    <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.storeId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.storeName}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{row.totalOrders} đơn</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{row.totalWeight} kg</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {row.revenue.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{row.plan}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                          row.status === 'Đang hoạt động' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            row.status === 'Đang hoạt động' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-400 font-semibold">
                      Không có dữ liệu phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                )
              )}

              {activeTab === 'financial' && (
                financialList.length > 0 ? (
                  financialList.map((row, idx) => (
                    <tr key={idx} className="bg-white hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.partnerId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{row.plan}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {row.price.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{row.txDate}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                          row.status === 'Thành công' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            row.status === 'Thành công' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400 font-semibold">
                      Không có dữ liệu phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* SUMMARY FOOTER */}
        {((activeTab === 'growth' && growthList.length > 0) ||
          (activeTab === 'operation' && operationList.length > 0) ||
          (activeTab === 'financial' && financialList.length > 0)) && (
          <div className="flex items-center justify-between bg-[#F8FAFC] border-t border-[#DCE5F0] px-4 py-3 text-xs font-bold text-slate-700">
            <span>Đang hiển thị {summary.count} dòng dữ liệu gần nhất</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">{summary.label}:</span>
              <span className="text-sm font-black text-[#2563EB]">{summary.value}</span>
            </div>
          </div>
        )}
      </div>

      {/* EXPORT CONFIG SIDE DRAWER / MODAL */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Xuất dữ liệu báo cáo"
        size="md"
      >
        <div className="flex flex-col gap-5 text-xs text-slate-800 text-left">
          
          {/* Format Choice */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-800">Định dạng file xuất *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'xlsx', label: 'Excel (.xlsx)' },
                { value: 'csv', label: 'CSV (.csv)' },
                { value: 'pdf', label: 'PDF (.pdf)' }
              ].map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => setExportFormat(fmt.value as any)}
                  className={`py-2.5 px-3 border rounded-md text-center font-bold text-xs cursor-pointer transition-colors ${
                    exportFormat === fmt.value
                      ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                      : 'bg-[#F8FAFC] border-[#DCE5F0] hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Select Columns */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-800">Chọn các cột dữ liệu muốn xuất</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_COLUMNS[activeTab].map((col) => {
                const isChecked = selectedColumns.includes(col);
                return (
                  <label
                    key={col}
                    className={`flex items-center gap-2.5 px-3 py-2 border rounded-md cursor-pointer select-none transition-colors ${
                      isChecked
                        ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB] font-bold'
                        : 'bg-[#F8FAFC] border-[#DCE5F0] hover:bg-slate-100 text-slate-700 font-semibold'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedColumns(prev =>
                          prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
                        );
                      }}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs truncate">{col}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Progress / Status Bar */}
          {isExporting && (
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-md p-3.5 flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-[#2563EB]">
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={14} className="animate-spin text-[#2563EB]" />
                  Đang xử lý và khởi tạo dữ liệu ({exportProgress}%)...
                </span>
              </div>
              <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-full rounded-full transition-all duration-200" style={{ width: `${exportProgress}%` }} />
              </div>
            </div>
          )}

          {/* Export Result Download Link */}
          {exportedFileLink && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3.5 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span className="font-bold truncate">Đã tạo báo cáo: <code className="font-mono text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{exportedFileName}</code></span>
              </div>
              <a
                href={exportedFileLink}
                onClick={(e) => {
                  e.preventDefault();
                  toast(`Đã tải xuống file ${exportedFileName}`, 'success');
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors cursor-pointer shrink-0"
              >
                <Download size={13} />
                Tải về
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => handleStartExportFlow('email')}
              disabled={isExporting}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition-colors cursor-pointer border-0 flex items-center gap-1.5"
            >
              <Mail size={14} />
              <span>Gửi qua Email</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartExportFlow('download')}
              disabled={isExporting}
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Tải báo cáo</span>
            </button>
          </div>

        </div>
      </Modal>

      {/* High Volume Warning Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmBackgroundOpen}
        onClose={() => setConfirmBackgroundOpen(false)}
        onConfirm={() => {
          setConfirmBackgroundOpen(false);
          triggerExportAnimation('download');
          toast('Đã đăng ký xử lý tác vụ trong nền thành công.', 'info');
        }}
        title="Dữ liệu truy vấn có dung lượng lớn"
        variant="primary"
        message="Dữ liệu truy vấn có dung lượng lớn. Bạn có muốn xử lý trong nền không?"
      />
    </div>
  );
}
