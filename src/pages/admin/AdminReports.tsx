import { useState, useEffect } from 'react';
import { Filter, Download, Mail, ShieldAlert, CheckCircle, RefreshCw, Bookmark } from 'lucide-react';
import {
  PageHeader,
  Button,
  Select,
  Input,
  ConfirmDialog,
  StatusBadge
} from '../../components/common';
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
  operation: ['Mã tiệm', 'Tên tiệm', 'Tổng đơn hàng', 'Khối lượng giặt (kg)', 'Doanh thu tiệm'],
  financial: ['Mã đối tác', 'Tên đối tác', 'Gói dịch vụ', 'Đơn giá thanh toán', 'Ngày giao dịch', 'Trạng thái']
};

export default function AdminReports() {
  const { toast } = useToast();

  // 1. ADMIN ROLE SIMULATION
  const [userRole, setUserRole] = useState<'Super Admin' | 'Kế toán'>('Super Admin');

  // 2. ACTIVE REPORT TAB
  const [activeTab, setActiveTab] = useState<'growth' | 'operation' | 'financial'>('growth');

  // 3. FILTER STATES
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-16');
  const [city, setCity] = useState('Tất cả');
  const [branch, setBranch] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['Basic', 'Pro', 'Enterprise']);
  
  // Saved filters mock
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
  const [newFilterName, setNewFilterName] = useState('');

  // Data Preview lists (Stateful to allow filter action simulating)
  const [growthList, setGrowthList] = useState(SYSTEM_GROWTH_DATA);
  const [operationList, setOperationList] = useState(OPERATION_DATA);
  const [financialList, setFinancialList] = useState(FINANCIAL_DATA);

  // 4. EXPORT CONFIG STATE
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Init/Update columns selection default on tab change
  useEffect(() => {
    setSelectedColumns(AVAILABLE_COLUMNS[activeTab]);
  }, [activeTab]);

  // 5. PROCESS/CONFIRM DIALOG STATE
  const [confirmBackgroundOpen, setConfirmBackgroundOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedFileLink, setExportedFileLink] = useState('');
  const [exportedFileName, setExportedFileName] = useState('');

  // Handlers for plans checkboxes
  const handlePlanToggle = (plan: string) => {
    setSelectedPlans(prev =>
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  // Filter actions simulation
  const handleApplyFilter = () => {
    // Check if both dates are entered
    if (!fromDate || !toDate) {
      toast('Vui lòng chọn khoảng thời gian hợp lệ.', 'error');
      return;
    }

    // Simulate filtering behavior
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

    toast('Đã áp dụng bộ lọc dữ liệu thành công', 'success');
  };

  const handleClearFilter = () => {
    setFromDate('2026-07-01');
    setToDate('2026-07-16');
    setCity('Tất cả');
    setBranch('Tất cả');
    setStatus('Tất cả');
    setSelectedPlans(['Basic', 'Pro', 'Enterprise']);
    
    // Reset lists
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
    toast(`Đã áp dụng bộ lọc: ${preset.name}`, 'info');
  };

  // EXPORT SIMULATION
  const handleStartExportFlow = (type: 'download' | 'email') => {
    // 1. Permission checks
    if (activeTab === 'financial' && userRole !== 'Super Admin') {
      toast('Từ chối truy cập: Chỉ Super Admin cấp cao nhất mới được phép xuất dữ liệu tài chính hệ thống.', 'error');
      return;
    }

    if (selectedColumns.length === 0) {
      toast('Vui lòng chọn ít nhất một cột muốn xuất dữ liệu.', 'error');
      return;
    }

    // 2. Year validation (Difference > 2 years is large file simulation)
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
            toast(`Đã khởi tạo file ${filename} thành công! Click vào link để tải về.`, 'success');
          } else {
            toast(`Báo cáo ${filename} đã được gửi thành công đến Email quản trị của bạn.`, 'success');
          }
          return 100;
        }
        return prev + 15;
      });
    }, 250);
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
    // Financial total revenue
    const totalRev = financialList.reduce((acc, curr) => acc + curr.price, 0);
    return { label: 'Tổng doanh thu', count: financialList.length, value: `${totalRev.toLocaleString('vi-VN')} đ` };
  };

  const summary = getSummaryRow();

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 w-full min-w-0">
      <PageHeader
        title="Báo cáo chi tiết và xuất dữ liệu"
        description="Truy vấn, xem trước và xuất dữ liệu hoạt động toàn hệ thống."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Báo cáo' },
        ]}
      />

      {/* Role Switch Simulator Block */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-amber-500 shrink-0" size={18} />
          <span className="text-xs font-bold text-slate-700">Trình giả lập vai trò tài khoản:</span>
          <div className="flex gap-1.5 ml-2">
            {['Super Admin', 'Kế toán'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setUserRole(r as any);
                  toast(`Đã chuyển vai trò tài khoản sang: ${r}`, 'info');
                }}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  userRole === r ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-550'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold italic">Lưu ý: Chỉ Super Admin mới xuất được dữ liệu Tài chính.</span>
      </div>

      {/* Advanced Filter and Saved Queries */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <Filter size={14} className="text-blue-500" />
            Bộ lọc nâng cao
          </span>
          
          {/* Quick Saved Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold">Bộ lọc đã lưu:</span>
            {savedFilters.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplySavedPreset(preset)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Bookmark size={10} className="text-blue-500" />
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input fields filter grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            id="fromDate"
            label="Từ ngày"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            id="toDate"
            label="Đến ngày"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          
          <Select
            id="cityFilter"
            label="Tỉnh/Thành phố"
            options={['Tất cả', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Select
            id="branchFilter"
            label="Chi nhánh tiệm"
            options={['Tất cả', 'DUDI Quận 1', 'CleanPro Laundry', 'DUDI Bình Thạnh', 'Wash & Fold Express']}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-1">
          <Select
            id="statusFilter"
            label="Trạng thái hoạt động"
            options={['Tất cả', 'Đang hoạt động', 'Đang tạm dừng', 'Thành công', 'Chờ xử lý']}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          {/* Partner plans checkboxes selection */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-xs font-bold text-slate-700">Hạng mức đối tác</span>
            <div className="flex gap-4">
              {['Basic', 'Pro', 'Enterprise'].map((tier) => (
                <label key={tier} className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedPlans.includes(tier)}
                    onChange={() => handlePlanToggle(tier)}
                    className="w-3.5 h-3.5 rounded text-blue-650 focus:ring-blue-500 cursor-pointer"
                  />
                  {tier}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Filter buttons & save filter trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-2">
          
          {/* Mock save filter form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tên bộ lọc muốn lưu..."
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-350 font-semibold w-40"
            />
            <Button variant="outline" size="sm" onClick={handleSaveFilterPreset} className="text-xs py-1.5">
              Lưu bộ lọc
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClearFilter} className="text-xs">
              Xóa bộ lọc
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyFilter} className="text-xs px-5">
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Main Report Tabs Content Preview block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
        
        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 pb-1 gap-6">
          <button
            onClick={() => { setActiveTab('growth'); setExportedFileLink(''); }}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'growth' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Báo cáo phát triển hệ thống
          </button>
          <button
            onClick={() => { setActiveTab('operation'); setExportedFileLink(''); }}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'operation' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Báo cáo hoạt động tiệm
          </button>
          <button
            onClick={() => { setActiveTab('financial'); setExportedFileLink(''); }}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'financial' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Báo cáo tài chính
          </button>
        </div>

        {/* Financial reports restricted warning info card */}
        {activeTab === 'financial' && userRole !== 'Super Admin' && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-2.5 text-xs text-red-800 animate-fadeIn">
            <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-xs">Cảnh báo phân quyền truy cập</span>
              <span className="text-[10px] text-slate-550 font-bold leading-normal">
                Vai trò của bạn là <strong>{userRole}</strong>. Chỉ tài khoản <strong>Super Admin</strong> cấp cao nhất mới được cấp quyền xuất báo cáo "Doanh thu hệ thống".
              </span>
            </div>
          </div>
        )}

        {/* Live Data Preview Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Xem trước dữ liệu (Xem trước 50 dòng gần nhất)</span>
          </div>

          <div className="overflow-x-auto w-full border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  {activeTab === 'growth' && (
                    <>
                      <th className="p-3">Tháng</th>
                      <th className="p-3">Số lượng tiệm mới đăng ký</th>
                      <th className="p-3">Tỉnh/Thành phát triển nhất</th>
                      <th className="p-3">Gói sử dụng nhiều nhất</th>
                      <th className="p-3">Tỷ lệ kích hoạt</th>
                    </>
                  )}
                  {activeTab === 'operation' && (
                    <>
                      <th className="p-3">Mã tiệm</th>
                      <th className="p-3">Tên tiệm</th>
                      <th className="p-3">Tổng đơn hàng</th>
                      <th className="p-3">Khối lượng giặt (kg)</th>
                      <th className="p-3">Doanh thu tiệm</th>
                      <th className="p-3">Gói sử dụng</th>
                      <th className="p-3">Trạng thái</th>
                    </>
                  )}
                  {activeTab === 'financial' && (
                    <>
                      <th className="p-3">Mã đối tác</th>
                      <th className="p-3">Tên chủ tiệm</th>
                      <th className="p-3">Gói dịch vụ</th>
                      <th className="p-3">Giá trị thanh toán (VND)</th>
                      <th className="p-3">Ngày giao dịch</th>
                      <th className="p-3">Trạng thái</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {activeTab === 'growth' && (
                  growthList.length > 0 ? (
                    growthList.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-3 font-semibold text-slate-700">{row.month}</td>
                        <td className="p-3 font-bold text-slate-800">{row.newStores} tiệm</td>
                        <td className="p-3 text-slate-600">{row.city}</td>
                        <td className="p-3"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{row.topPlan}</span></td>
                        <td className="p-3 font-semibold text-emerald-600">{row.activationRate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-bold bg-slate-50/50">Không có dữ liệu phù hợp với bộ lọc hiện tại.</td>
                    </tr>
                  )
                )}

                {activeTab === 'operation' && (
                  operationList.length > 0 ? (
                    operationList.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-3 font-mono font-bold text-slate-500">{row.storeId}</td>
                        <td className="p-3 font-semibold text-slate-700">{row.storeName}</td>
                        <td className="p-3 text-slate-700">{row.totalOrders} đơn</td>
                        <td className="p-3 text-slate-700">{row.totalWeight} kg</td>
                        <td className="p-3 font-bold text-slate-800">{row.revenue.toLocaleString('vi-VN')} đ</td>
                        <td className="p-3 font-semibold text-slate-600">{row.plan}</td>
                        <td className="p-3">
                          <StatusBadge label={row.status} variant={row.status === 'Đang hoạt động' ? 'success' : 'warning'} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-bold bg-slate-50/50">Không có dữ liệu phù hợp với bộ lọc hiện tại.</td>
                    </tr>
                  )
                )}

                {activeTab === 'financial' && (
                  financialList.length > 0 ? (
                    financialList.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-3 font-mono font-bold text-slate-500">{row.partnerId}</td>
                        <td className="p-3 font-semibold text-slate-700">{row.name}</td>
                        <td className="p-3 font-semibold text-slate-650">{row.plan}</td>
                        <td className="p-3 font-extrabold text-slate-800">{row.price.toLocaleString('vi-VN')} đ</td>
                        <td className="p-3 text-slate-600">{row.txDate}</td>
                        <td className="p-3">
                          <StatusBadge label={row.status} variant={row.status === 'Thành công' ? 'success' : 'warning'} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-bold bg-slate-50/50">Không có dữ liệu phù hợp với bộ lọc hiện tại.</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Summarize totals block */}
          {((activeTab === 'growth' && growthList.length > 0) ||
            (activeTab === 'operation' && operationList.length > 0) ||
            (activeTab === 'financial' && financialList.length > 0)) && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 px-4 text-xs font-bold text-slate-700">
              <span>Đang hiển thị {summary.count} dòng dữ liệu gần nhất</span>
              <div className="flex items-center gap-1">
                <span>{summary.label}:</span>
                <span className="text-sm font-extrabold text-blue-650">{summary.value}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Export file configurations */}
        <div className="border-t border-slate-100 pt-5 mt-2 flex flex-col gap-4">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Cấu hình xuất dữ liệu báo cáo</span>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            
            {/* Format choice (xlsx, csv, pdf) */}
            <div className="md:col-span-3 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-700">Định dạng file xuất</span>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'xlsx', label: 'Microsoft Excel (.xlsx)' },
                  { value: 'csv', label: 'Comma Separated Values (.csv)' },
                  { value: 'pdf', label: 'Portable Document Format (.pdf)' }
                ].map((fmt) => (
                  <label
                    key={fmt.value}
                    className={`flex items-center gap-2.5 px-3 py-2 border rounded-xl cursor-pointer select-none transition-all ${
                      exportFormat === fmt.value ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="export_format"
                      checked={exportFormat === fmt.value}
                      onChange={() => setExportFormat(fmt.value as any)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold">{fmt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkbox fields selector to export */}
            <div className="md:col-span-9 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-700">Chọn các cột trường thông tin muốn xuất</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVAILABLE_COLUMNS[activeTab].map((col) => (
                  <label
                    key={col}
                    className={`flex items-center gap-2.5 px-3 py-2 border rounded-xl cursor-pointer select-none transition-all ${
                      selectedColumns.includes(col) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col)}
                      onChange={() => {
                        setSelectedColumns(prev =>
                          prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
                        );
                      }}
                      className="w-3.5 h-3.5 rounded text-blue-650 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold">{col}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Export process status/link */}
          {isExporting && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-2 animate-fadeIn mt-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-800">
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={14} className="animate-spin text-blue-500" />
                  Hệ thống đang tổng hợp dữ liệu ({exportProgress}%)...
                </span>
              </div>
              <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${exportProgress}%` }} />
              </div>
            </div>
          )}

          {exportedFileLink && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between animate-fadeIn mt-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="font-bold">Đã tạo báo cáo: <code className="font-mono text-[11px] bg-emerald-100/60 px-1.5 py-0.5 rounded font-extrabold">{exportedFileName}</code></span>
              </div>
              <a
                href={exportedFileLink}
                onClick={(e) => {
                  e.preventDefault();
                  toast(`Đã tải xuống file ${exportedFileName}`, 'success');
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download size={13} />
                Tải file về máy
              </a>
            </div>
          )}

          {/* Trigger buttons */}
          <div className="flex items-center justify-end gap-3 mt-2 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartExportFlow('email')}
              className="flex items-center gap-1 text-xs"
              disabled={isExporting}
            >
              <Mail size={13} />
              Gửi báo cáo qua Email
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStartExportFlow('download')}
              className="flex items-center gap-1.5 text-xs font-bold px-6"
              disabled={isExporting}
            >
              <Download size={14} />
              Tải báo cáo
            </Button>
          </div>
        </div>

      </div>

      {/* High quantity date filter validation warning background confirm dialog */}
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
