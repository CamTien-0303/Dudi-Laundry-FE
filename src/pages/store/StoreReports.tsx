import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  WashingMachine,
  Users,
  Package,
  FileSpreadsheet,
  FileText,
  Heart,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Percent
} from 'lucide-react';
import { PageHeader, Drawer, InlineAlert } from '../../components/common';
import { useToast } from '../../components/common/Toast';

// Mock drill-down order list for the drawer
const MOCK_DRILL_DOWN_ORDERS = [
  { id: 'DH-901', customer: 'Nguyễn Văn An', branch: 'Quận 1', service: 'Giặt sấy nhanh', amount: 120000, time: '21/07 08:30', status: 'Hoàn thành' },
  { id: 'DH-902', customer: 'Trần Thị Bình', branch: 'Quận 7', service: 'Giặt khô vest', amount: 350000, time: '21/07 09:15', status: 'Đang giặt' },
  { id: 'DH-903', customer: 'Spa An Nhiên', branch: 'Thủ Đức', service: 'Giặt rèm thảm', amount: 1200000, time: '21/07 10:00', status: 'Hoàn thành' },
  { id: 'DH-904', customer: 'Khách sạn Rex', branch: 'Quận 1', service: 'Giặt sấy tiêu chuẩn', amount: 3500000, time: '21/07 11:30', status: 'Đang xử lý' },
  { id: 'DH-905', customer: 'Lê Hoàng Nam', branch: 'Quận 7', service: 'Vệ sinh giày', amount: 150000, time: '21/07 14:20', status: 'Chờ nhận' },
  { id: 'DH-906', customer: 'Phạm Minh Đức', branch: 'Thủ Đức', service: 'Giặt khô sấy mềm', amount: 280000, time: '21/07 15:45', status: 'Hoàn thành' }
];

export default function StoreReports() {
  const { toast } = useToast();
  
  // Page configuration and filters
  const [role, setRole] = useState<'owner' | 'manager'>('owner');
  const [quickDate, setQuickDate] = useState<'yesterday' | 'week' | 'month'>('week');
  const [fromDate, setFromDate] = useState('2026-07-15');
  const [toDate, setToDate] = useState('2026-07-21');
  const [branch, setBranch] = useState('all');
  const [channel, setChannel] = useState('all');
  
  // Tabs config
  const [activeTab, setActiveTab] = useState<'revenue' | 'operations' | 'customers' | 'inventory'>('revenue');

  // Drilldown Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drillDownTitle, setDrillDownTitle] = useState('Chi tiết đơn hàng');

  // Handle actions
  const handleExport = (type: 'Excel' | 'PDF') => {
    toast(`Đang khởi tạo tệp xuất ${type}... Báo cáo sẽ tự động tải về sau vài giây.`, 'success');
  };

  const handleSaveFavorite = () => {
    toast('Đã lưu cấu hình báo cáo hiện tại vào danh sách yêu thích!', 'success');
  };

  const handleApplyFilter = () => {
    toast('Đã cập nhật số liệu báo cáo theo bộ lọc!', 'success');
  };

  const handleSendReminder = (partnerName: string) => {
    toast(`Đã gửi nhắc nợ tự động qua Zalo/Email thành công đến: ${partnerName}`, 'success');
  };

  const openDrillDown = (title: string) => {
    setDrillDownTitle(title);
    setIsDrawerOpen(true);
  };

  // If role is manager, branch selector must be locked to 'Quận 7'
  const currentBranch = role === 'manager' ? 'q7' : branch;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Trung tâm báo cáo chi tiết"
          description="Phân tích doanh thu, dịch vụ, khách hàng và hiệu quả vận hành."
        />
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all text-slate-700 cursor-pointer shadow-xs animate-none"
          >
            <FileSpreadsheet size={15} className="text-emerald-600 animate-none" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all text-slate-700 cursor-pointer shadow-xs animate-none"
          >
            <FileText size={15} className="text-red-500 animate-none" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Role Switching Control (For Mock Testing) */}
      <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Chế độ xem vai trò (Mô phỏng):</span>
          <div className="flex bg-white rounded-lg p-0.5 border border-blue-200 gap-0.5">
            <button
              onClick={() => {
                setRole('owner');
                toast('Đã đổi vai trò sang Chủ tiệm - Toàn quyền chi nhánh', 'info');
              }}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                role === 'owner' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Chủ tiệm
            </button>
            <button
              onClick={() => {
                setRole('manager');
                toast('Đã đổi vai trò sang Quản lý chi nhánh Quận 7', 'info');
              }}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                role === 'manager' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Quản lý chi nhánh
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Bấm chuyển đổi để xem phân quyền giao diện</span>
      </div>

      {/* 2. Master Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Timeframe quick selection tabs */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Mốc thời gian nhanh</label>
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1 h-10 items-center">
              {[
                { id: 'yesterday', label: 'Hôm qua' },
                { id: 'week', label: 'Tuần này' },
                { id: 'month', label: 'Tháng trước' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setQuickDate(t.id as any);
                    if (t.id === 'yesterday') {
                      setFromDate('2026-07-20');
                      setToDate('2026-07-20');
                    } else if (t.id === 'week') {
                      setFromDate('2026-07-15');
                      setToDate('2026-07-21');
                    } else {
                      setFromDate('2026-06-01');
                      setToDate('2026-06-30');
                    }
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    quickDate === t.id ? 'bg-white text-primary shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Khoảng ngày tùy chỉnh</label>
            <div className="flex gap-2 items-center h-10">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setQuickDate('' as any);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <span className="text-slate-400 text-xs">đến</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setQuickDate('' as any);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Branch Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Building2 size={13} className="text-slate-400 animate-none" />
              <span>Chi nhánh</span>
            </label>
            <select
              value={currentBranch}
              disabled={role === 'manager'}
              onChange={(e) => setBranch(e.target.value)}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer focus:ring-1 focus:ring-primary h-10 ${
                role === 'manager' ? 'opacity-80 cursor-not-allowed bg-slate-100 text-slate-500' : 'text-slate-700'
              }`}
            >
              <option value="all">Tất cả chi nhánh</option>
              <option value="q1">Quận 1</option>
              <option value="q7">Quận 7</option>
              <option value="thu_duc">Thủ Đức</option>
            </select>
          </div>

          {/* Sales Channel Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Kênh bán hàng</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-primary h-10"
            >
              <option value="all">Tất cả kênh</option>
              <option value="retail">Khách lẻ</option>
              <option value="b2b">Khách B2B</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Thời kỳ báo cáo: {fromDate.split('-').reverse().join('/')} - {toDate.split('-').reverse().join('/')}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveFavorite}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer animate-none"
            >
              <Heart size={14} className="text-rose-500 fill-rose-500 animate-none" />
              <span>Lưu báo cáo yêu thích</span>
            </button>
            <button
              onClick={handleApplyFilter}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm animate-none"
            >
              <WashingMachine size={14} className="animate-none" />
              <span>Xem báo cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warning Box for Manager role constraint */}
      {role === 'manager' && (
        <InlineAlert
          variant="warning"
          title="Hạn chế quyền hạn hiển thị"
          message="Bạn đang xem dữ liệu giới hạn của Chi nhánh Quận 7. Dữ liệu tổng hợp toàn chuỗi chỉ dành cho Chủ tiệm. Nếu cần truy cập báo cáo chi nhánh khác, vui lòng liên hệ Admin để điều chỉnh phân quyền của tài khoản."
          className="animate-slideDown"
        />
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 gap-1 shadow-2xs">
        {[
          { id: 'revenue', label: 'Doanh thu', icon: <DollarSign size={15} /> },
          { id: 'operations', label: 'Dịch vụ & Vận hành', icon: <WashingMachine size={15} /> },
          { id: 'customers', label: 'Khách hàng', icon: <Users size={15} /> },
          { id: 'inventory', label: 'Kho vật tư', icon: <Package size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex-1 justify-center md:flex-none animate-none ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/80'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Tab Contents */}
      
      {/* --- TAB DOANH THU --- */}
      {activeTab === 'revenue' && (
        <div className="flex flex-col gap-6">
          {/* KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tổng doanh thu</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">124.500.000đ</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+18.5% so với kỳ trước</span>
                </span>
              </div>
            </div>
            {/* KPI 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Doanh thu Khách lẻ</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">78.200.000đ</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+12.4% so với kỳ trước</span>
                </span>
              </div>
            </div>
            {/* KPI 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Doanh thu B2B</span>
                <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><ArrowUpRight size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">46.300.000đ</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+30.1% so với kỳ trước</span>
                </span>
              </div>
            </div>
            {/* KPI 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Số đơn đã thanh toán</span>
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Percent size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">1.420 đơn</span>
                <span className="text-[10px] font-bold text-danger flex items-center gap-0.5">
                  <TrendingDown size={12} />
                  <span>-2.3% so với kỳ trước</span>
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SVG Column Chart (2/3 width on wide screens) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Biểu đồ doanh thu theo ngày</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Bấm vào các cột để xem chi tiết đơn hàng đóng góp</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-primary rounded-xs"></span>
                    Doanh thu (triệu đồng)
                  </span>
                </div>
              </div>
              
              {/* Interactive SVG Chart */}
              <div className="relative h-64 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="155" x2="580" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="180" x2="580" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="5" y="24" className="text-[9px] font-semibold text-slate-400 fill-current">25 Tr</text>
                  <text x="5" y="69" className="text-[9px] font-semibold text-slate-400 fill-current">20 Tr</text>
                  <text x="5" y="114" className="text-[9px] font-semibold text-slate-400 fill-current">15 Tr</text>
                  <text x="5" y="159" className="text-[9px] font-semibold text-slate-400 fill-current">10 Tr</text>
                  <text x="15" y="184" className="text-[9px] font-semibold text-slate-400 fill-current">0</text>

                  {/* Columns */}
                  {/* Day 1: 15/07 - 12Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 15/07/2026')}>
                    <rect x="50" y="140" width="36" height="40" rx="4" className="fill-primary/70 group-hover/bar:fill-primary transition-colors" />
                    <text x="68" y="132" textAnchor="middle" className="text-[9px] font-bold text-slate-700 opacity-0 group-hover/bar:opacity-100 fill-current transition-opacity">12M</text>
                    <text x="68" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">15/07</text>
                  </g>

                  {/* Day 2: 16/07 - 15Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 16/07/2026')}>
                    <rect x="120" y="120" width="36" height="60" rx="4" className="fill-primary/70 group-hover/bar:fill-primary transition-colors" />
                    <text x="138" y="112" textAnchor="middle" className="text-[9px] font-bold text-slate-700 opacity-0 group-hover/bar:opacity-100 fill-current transition-opacity">15M</text>
                    <text x="138" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">16/07</text>
                  </g>

                  {/* Day 3: 17/07 - 18.5Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 17/07/2026')}>
                    <rect x="190" y="98" width="36" height="82" rx="4" className="fill-primary/70 group-hover/bar:fill-primary transition-colors" />
                    <text x="208" y="90" textAnchor="middle" className="text-[9px] font-bold text-slate-700 opacity-0 group-hover/bar:opacity-100 fill-current transition-opacity">18.5M</text>
                    <text x="208" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">17/07</text>
                  </g>

                  {/* Day 4: 18/07 - 22.4Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 18/07/2026')}>
                    <rect x="260" y="74" width="36" height="106" rx="4" className="fill-primary/70 group-hover/bar:fill-primary transition-colors" />
                    <text x="278" y="66" textAnchor="middle" className="text-[9px] font-bold text-slate-700 opacity-0 group-hover/bar:opacity-100 fill-current transition-opacity">22.4M</text>
                    <text x="278" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">18/07</text>
                  </g>

                  {/* Day 5: 19/07 - 24.5Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 19/07/2026')}>
                    <rect x="330" y="60" width="36" height="120" rx="4" className="fill-primary group-hover/bar:fill-primary-hover transition-colors" />
                    <text x="348" y="52" textAnchor="middle" className="text-[9px] font-bold text-primary fill-current opacity-0 group-hover/bar:opacity-100 transition-opacity">24.5M</text>
                    <text x="348" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">19/07</text>
                  </g>

                  {/* Day 6: 20/07 - 16.1Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 20/07/2026')}>
                    <rect x="400" y="113" width="36" height="67" rx="4" className="fill-primary/70 group-hover/bar:fill-primary transition-colors" />
                    <text x="418" y="105" textAnchor="middle" className="text-[9px] font-bold text-slate-700 opacity-0 group-hover/bar:opacity-100 fill-current transition-opacity">16.1M</text>
                    <text x="418" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">20/07</text>
                  </g>

                  {/* Day 7: 21/07 - 16.3Tr */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 21/07/2026')}>
                    <rect x="470" y="112" width="36" height="68" rx="4" className="fill-primary/70 group-hover/bar:fill-primary transition-colors" />
                    <text x="488" y="104" textAnchor="middle" className="text-[9px] font-bold text-slate-700 opacity-0 group-hover/bar:opacity-100 fill-current transition-opacity">16.3M</text>
                    <text x="488" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-400 fill-current">21/07</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Payment Method Ratio (1/3 width) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Tỷ lệ thanh toán</h3>
                <p className="text-[10px] text-slate-400 font-medium">Tỷ trọng các phương thức thanh toán</p>
              </div>

              {/* Stacked Progress Bar */}
              <div className="flex flex-col gap-6 my-4">
                <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100 cursor-pointer shadow-inner">
                  <div
                    onClick={() => openDrillDown('Giao dịch qua Chuyển khoản')}
                    className="bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ width: '68.1%' }}
                    title="Chuyển khoản: 68.1%"
                  />
                  <div
                    onClick={() => openDrillDown('Giao dịch bằng Tiền mặt')}
                    className="bg-emerald-500 hover:bg-emerald-600 transition-colors"
                    style={{ width: '28.3%' }}
                    title="Tiền mặt: 28.3%"
                  />
                  <div
                    onClick={() => openDrillDown('Giao dịch bằng Điểm thưởng')}
                    className="bg-amber-500 hover:bg-amber-600 transition-colors"
                    style={{ width: '3.6%' }}
                    title="Điểm thưởng: 3.6%"
                  />
                </div>

                {/* Legend list */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs"></span>
                      <span className="text-xs font-semibold text-slate-600">Chuyển khoản</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">84.800.000đ</span>
                      <span className="text-[9px] font-bold text-slate-400">68.1%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span>
                      <span className="text-xs font-semibold text-slate-600">Tiền mặt</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">35.200.000đ</span>
                      <span className="text-[9px] font-bold text-slate-400">28.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span>
                      <span className="text-xs font-semibold text-slate-600">Điểm thưởng</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 block">4.500.000đ</span>
                      <span className="text-[9px] font-bold text-slate-400">3.6%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] text-slate-500 font-medium text-center border border-slate-100">
                Số liệu tính trên các hóa đơn đã thanh toán.
              </div>
            </div>
          </div>

          {/* B2B Outstanding debt table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Bảng công nợ B2B chưa thu</h3>
              <p className="text-[10px] text-slate-400 font-medium">Danh sách các đối tác doanh nghiệp có hóa đơn chưa thanh toán hoặc đang nợ lũy kế</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <th className="pb-3 pl-2">Tên đối tác B2B</th>
                    <th className="pb-3">Hạn thanh toán</th>
                    <th className="pb-3 text-right">Dư nợ chưa thu</th>
                    <th className="pb-3 pl-6">Trạng thái</th>
                    <th className="pb-3 text-right pr-2">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>Khách sạn Rex</span>
                    </td>
                    <td className="py-3.5 text-slate-500">20/07/2026</td>
                    <td className="py-3.5 text-right font-bold text-red-500">15.000.000đ</td>
                    <td className="py-3.5 pl-6">
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md font-bold text-[10px]">Quá hạn (5 ngày)</span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleSendReminder('Khách sạn Rex')}
                        className="px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                      >
                        Gửi nhắc nợ
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>Homestay Sunside</span>
                    </td>
                    <td className="py-3.5 text-slate-500">18/07/2026</td>
                    <td className="py-3.5 text-right font-bold text-red-500">12.000.000đ</td>
                    <td className="py-3.5 pl-6">
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md font-bold text-[10px]">Quá hạn (7 ngày)</span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleSendReminder('Homestay Sunside')}
                        className="px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                      >
                        Gửi nhắc nợ
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span>Spa An Nhiên</span>
                    </td>
                    <td className="py-3.5 text-slate-500">25/07/2026</td>
                    <td className="py-3.5 text-right font-bold text-slate-700">8.500.000đ</td>
                    <td className="py-3.5 pl-6">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md font-bold text-[10px]">Trong hạn (4 ngày)</span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleSendReminder('Spa An Nhiên')}
                        className="px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                      >
                        Gửi nhắc nợ
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span>Gym California</span>
                    </td>
                    <td className="py-3.5 text-slate-500">30/07/2026</td>
                    <td className="py-3.5 text-right font-bold text-slate-700">5.000.000đ</td>
                    <td className="py-3.5 pl-6">
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-md font-bold text-[10px]">Chờ thanh toán</span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleSendReminder('Gym California')}
                        className="px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                      >
                        Gửi nhắc nợ
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB DỊCH VỤ & VẬN HÀNH --- */}
      {activeTab === 'operations' && (
        <div className="flex flex-col gap-6">
          {/* KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tổng số kg đã giặt</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><WashingMachine size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">1.850 kg</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+8.2% so với kỳ trước</span>
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tổng số món đã xử lý</span>
                <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Package size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">4.210 món</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+11.5% so với kỳ trước</span>
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Xử lý trung bình (SLA)</span>
                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Clock size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">3.8 giờ</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingDown size={12} />
                  <span>-10.5% thời gian xử lý (Tốt)</span>
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tỷ lệ đúng hạn SLA</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Percent size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">96.5%</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+1.8% so với kỳ trước</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Service Proportion (Donut-like SVG) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Tỷ trọng doanh thu dịch vụ</h3>
                <p className="text-[10px] text-slate-400 font-medium">Bấm vào biểu đồ để xem chi tiết đơn hàng tương ứng</p>
              </div>

              {/* Interactive Donut SVG Chart */}
              <div className="relative flex justify-center items-center h-48 my-2">
                <svg width="180" height="180" className="transform -rotate-90">
                  {/* Total circle is 2 * PI * r = 2 * 3.14 * 60 = 376.8 */}
                  {/* Giặt sấy nhanh: 45% -> 169.56 */}
                  <circle
                    cx="90"
                    cy="90"
                    r="60"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray="169.56 207.24"
                    strokeDashoffset="0"
                    className="cursor-pointer hover:stroke-blue-600 transition-all"
                    onClick={() => openDrillDown('Chi tiết dịch vụ: Giặt sấy nhanh')}
                  />
                  {/* Giặt khô cao cấp: 25% -> 94.2 */}
                  <circle
                    cx="90"
                    cy="90"
                    r="60"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray="94.2 282.6"
                    strokeDashoffset="-169.56"
                    className="cursor-pointer hover:stroke-emerald-600 transition-all"
                    onClick={() => openDrillDown('Chi tiết dịch vụ: Giặt khô cao cấp')}
                  />
                  {/* Vệ sinh giày: 18% -> 67.82 */}
                  <circle
                    cx="90"
                    cy="90"
                    r="60"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray="67.82 308.98"
                    strokeDashoffset="-263.76"
                    className="cursor-pointer hover:stroke-amber-600 transition-all"
                    onClick={() => openDrillDown('Chi tiết dịch vụ: Vệ sinh giày')}
                  />
                  {/* Giặt rèm thảm: 12% -> 45.21 */}
                  <circle
                    cx="90"
                    cy="90"
                    r="60"
                    fill="transparent"
                    stroke="#a855f7"
                    strokeWidth="20"
                    strokeDasharray="45.21 331.59"
                    strokeDashoffset="-331.58"
                    className="cursor-pointer hover:stroke-purple-600 transition-all"
                    onClick={() => openDrillDown('Chi tiết dịch vụ: Giặt rèm thảm')}
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-800">4 nhóm</span>
                  <p className="text-[9px] font-bold text-slate-400">DỊCH VỤ CHÍNH</p>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900" onClick={() => openDrillDown('Chi tiết dịch vụ: Giặt sấy nhanh')}>
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs"></span>
                  <span>Giặt sấy nhanh (45%)</span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900" onClick={() => openDrillDown('Chi tiết dịch vụ: Giặt khô cao cấp')}>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span>
                  <span>Giặt khô (25%)</span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900" onClick={() => openDrillDown('Chi tiết dịch vụ: Vệ sinh giày')}>
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span>
                  <span>Vệ sinh giày (18%)</span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900" onClick={() => openDrillDown('Chi tiết dịch vụ: Giặt rèm thảm')}>
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-xs"></span>
                  <span>Giặt rèm/thảm (12%)</span>
                </div>
              </div>
            </div>

            {/* Most Used Services Table (2/3 width) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs lg:col-span-2 flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Danh sách dịch vụ được sử dụng nhiều nhất</h3>
                <p className="text-[10px] text-slate-400 font-medium">Báo cáo chi tiết lượng đơn và đóng góp doanh thu theo từng gói dịch vụ cụ thể</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                      <th className="pb-3 pl-2">Tên gói dịch vụ</th>
                      <th className="pb-3 text-center">Số lượng đơn</th>
                      <th className="pb-3 text-right">Doanh thu tương ứng</th>
                      <th className="pb-3 text-right pr-2">Hiệu suất SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 pl-2 font-bold text-slate-800">Giặt sấy tiêu chuẩn (Quần áo hằng ngày)</td>
                      <td className="py-3.5 text-center font-semibold text-slate-600">850 đơn</td>
                      <td className="py-3.5 text-right font-bold text-slate-800">34.000.000đ</td>
                      <td className="py-3.5 text-right pr-2 text-success font-bold">98.5%</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 pl-2 font-bold text-slate-800">Vệ sinh giày Sneaker vải/da lộn</td>
                      <td className="py-3.5 text-center font-semibold text-slate-600">380 đơn</td>
                      <td className="py-3.5 text-right font-bold text-slate-800">15.200.000đ</td>
                      <td className="py-3.5 text-right pr-2 text-success font-bold">95.0%</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 pl-2 font-bold text-slate-800">Giặt khô cao cấp Vest nam / Váy cưới</td>
                      <td className="py-3.5 text-center font-semibold text-slate-600">220 đơn</td>
                      <td className="py-3.5 text-right font-bold text-slate-800">22.000.000đ</td>
                      <td className="py-3.5 text-right pr-2 text-success font-bold">92.3%</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 pl-2 font-bold text-slate-800">Giặt sấy chăn ga gối nệm</td>
                      <td className="py-3.5 text-center font-semibold text-slate-600">180 đơn</td>
                      <td className="py-3.5 text-right font-bold text-slate-800">10.800.000đ</td>
                      <td className="py-3.5 text-right pr-2 text-danger font-bold">88.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB KHÁCH HÀNG --- */}
      {activeTab === 'customers' && (
        <div className="flex flex-col gap-6">
          {/* KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tổng khách hàng mới</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Users size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">+145 khách</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+22.0% so với kỳ trước</span>
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tổng khách quay lại</span>
                <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><ArrowUpRight size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">520 khách</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+5.8% so với kỳ trước</span>
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Tỷ lệ khách quay lại</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Percent size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">68.2%</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+2.4% so với kỳ trước</span>
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold">Chi tiêu trung bình/khách</span>
                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><DollarSign size={16} /></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-black text-slate-800">235.000đ</span>
                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  <span>+4.1% so với kỳ trước</span>
                </span>
              </div>
            </div>
          </div>

          {/* Top 10 Spending Customers Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Top 10 khách hàng chi tiêu nhiều nhất</h3>
              <p className="text-[10px] text-slate-400 font-medium">Bảng xếp hạng khách hàng đem lại giá trị doanh thu cao nhất cho chuỗi</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <th className="pb-3 pl-2 text-center w-12">Hạng</th>
                    <th className="pb-3">Tên khách hàng</th>
                    <th className="pb-3">Số điện thoại</th>
                    <th className="pb-3">Loại khách</th>
                    <th className="pb-3 text-center">Số đơn đã đặt</th>
                    <th className="pb-3 text-right">Tổng chi tiêu</th>
                    <th className="pb-3 text-right pr-2">Hạng thành viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center font-black text-amber-500">1</td>
                    <td className="py-3.5 font-bold text-slate-800">Công ty TNHH Sen Vàng</td>
                    <td className="py-3.5 text-slate-500">0901 234 567</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold text-[10px]">B2B</span></td>
                    <td className="py-3.5 text-center font-semibold">45 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">38.000.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px]">Kim cương</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center font-black text-slate-400">2</td>
                    <td className="py-3.5 font-bold text-slate-800">Khách sạn Rex</td>
                    <td className="py-3.5 text-slate-500">0283 829 218</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold text-[10px]">B2B</span></td>
                    <td className="py-3.5 text-center font-semibold">32 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">28.500.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px]">Kim cương</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center font-black text-amber-600">3</td>
                    <td className="py-3.5 font-bold text-slate-800">Nguyễn Văn An</td>
                    <td className="py-3.5 text-slate-500">0932 456 789</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Khách lẻ</span></td>
                    <td className="py-3.5 text-center font-semibold">24 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">7.200.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-yellow-50 text-amber-600 rounded-md font-bold text-[10px]">Vàng</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">4</td>
                    <td className="py-3.5 font-bold text-slate-800">Trần Thị Bình</td>
                    <td className="py-3.5 text-slate-500">0913 987 654</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Khách lẻ</span></td>
                    <td className="py-3.5 text-center font-semibold">18 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">5.400.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-yellow-50 text-amber-600 rounded-md font-bold text-[10px]">Vàng</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">5</td>
                    <td className="py-3.5 font-bold text-slate-800">Spa An Nhiên</td>
                    <td className="py-3.5 text-slate-500">0909 333 444</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold text-[10px]">B2B</span></td>
                    <td className="py-3.5 text-center font-semibold">15 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">4.800.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Bạc</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">6</td>
                    <td className="py-3.5 font-bold text-slate-800">Lê Hoàng Nam</td>
                    <td className="py-3.5 text-slate-500">0988 777 666</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Khách lẻ</span></td>
                    <td className="py-3.5 text-center font-semibold">14 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">3.900.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Bạc</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">7</td>
                    <td className="py-3.5 font-bold text-slate-800">Phạm Minh Đức</td>
                    <td className="py-3.5 text-slate-500">0944 555 666</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Khách lẻ</span></td>
                    <td className="py-3.5 text-center font-semibold">12 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">3.200.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Bạc</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">8</td>
                    <td className="py-3.5 font-bold text-slate-800">Homestay Sunside</td>
                    <td className="py-3.5 text-slate-500">0977 111 222</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md font-bold text-[10px]">B2B</span></td>
                    <td className="py-3.5 text-center font-semibold">9 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">2.800.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-orange-50 text-amber-700 rounded-md font-bold text-[10px]">Đồng</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">9</td>
                    <td className="py-3.5 font-bold text-slate-800">Vũ Thị Hương</td>
                    <td className="py-3.5 text-slate-500">0902 444 888</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Khách lẻ</span></td>
                    <td className="py-3.5 text-center font-semibold">10 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">2.500.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-orange-50 text-amber-700 rounded-md font-bold text-[10px]">Đồng</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 text-center text-slate-500 font-bold">10</td>
                    <td className="py-3.5 font-bold text-slate-800">Hoàng Minh Tuấn</td>
                    <td className="py-3.5 text-slate-500">0966 222 333</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">Khách lẻ</span></td>
                    <td className="py-3.5 text-center font-semibold">8 đơn</td>
                    <td className="py-3.5 text-right font-bold text-slate-900">2.100.000đ</td>
                    <td className="py-3.5 text-right pr-2"><span className="px-2 py-0.5 bg-orange-50 text-amber-700 rounded-md font-bold text-[10px]">Đồng</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB KHO (BASIC) --- */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Low inventory supplies */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={16} /></span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Vật tư tồn thấp</h3>
                <p className="text-[10px] text-slate-400 font-medium">Danh sách các mặt hàng đang dưới mức tồn tối thiểu cần nhập gấp</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <th className="pb-3 pl-2">Tên vật tư</th>
                    <th className="pb-3 text-center">Đơn vị</th>
                    <th className="pb-3 text-center">Tồn tối thiểu</th>
                    <th className="pb-3 text-center">Tồn hiện tại</th>
                    <th className="pb-3 text-right pr-2">Cảnh báo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Nước giặt đậm đặc DUDI-PRO</td>
                    <td className="py-3.5 text-center text-slate-500">Can 20L</td>
                    <td className="py-3.5 text-center font-semibold">5 can</td>
                    <td className="py-3.5 text-center font-bold text-red-500 bg-red-50/50">2 can</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md font-bold text-[10px]">Cần nhập ngay</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Nước xả vải Comfort thơm mát</td>
                    <td className="py-3.5 text-center text-slate-500">Can 20L</td>
                    <td className="py-3.5 text-center font-semibold">6 can</td>
                    <td className="py-3.5 text-center font-bold text-red-500 bg-red-50/50">3 can</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md font-bold text-[10px]">Cần nhập ngay</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Móc treo quần áo bằng nhôm</td>
                    <td className="py-3.5 text-center text-slate-500">Cái</td>
                    <td className="py-3.5 text-center font-semibold">50 cái</td>
                    <td className="py-3.5 text-center font-bold text-red-500 bg-red-50/50">12 cái</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md font-bold text-[10px]">Dưới hạn định</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Tem cuộn in mã vạch mã hóa đơn</td>
                    <td className="py-3.5 text-center text-slate-500">Cuộn</td>
                    <td className="py-3.5 text-center font-semibold">3 cuộn</td>
                    <td className="py-3.5 text-center font-bold text-amber-600 bg-amber-50/30">1 cuộn</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md font-bold text-[10px]">Sắp hết</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* High consumption supplies */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Percent size={16} /></span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Vật tư tiêu hao nhiều nhất</h3>
                <p className="text-[10px] text-slate-400 font-medium">Thống kê lượng sử dụng và chi phí tạm tính trong kỳ báo cáo</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <th className="pb-3 pl-2">Tên vật tư</th>
                    <th className="pb-3 text-center">Đơn vị</th>
                    <th className="pb-3 text-center">Lượng tiêu hao</th>
                    <th className="pb-3 text-right pr-2">Chi phí ước tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Nước giặt đậm đặc DUDI-PRO</td>
                    <td className="py-3.5 text-center text-slate-500">Can 20L</td>
                    <td className="py-3.5 text-center font-bold text-slate-700">15 can</td>
                    <td className="py-3.5 text-right pr-2 font-black text-slate-800">6.000.000đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Nước xả vải Comfort thơm mát</td>
                    <td className="py-3.5 text-center text-slate-500">Can 20L</td>
                    <td className="py-3.5 text-center font-bold text-slate-700">12 can</td>
                    <td className="py-3.5 text-right pr-2 font-black text-slate-800">4.200.000đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Túi đóng gói tự phân hủy sinh học</td>
                    <td className="py-3.5 text-center text-slate-500">Cái</td>
                    <td className="py-3.5 text-center font-bold text-slate-700">1.200 cái</td>
                    <td className="py-3.5 text-right pr-2 font-black text-slate-800">1.800.000đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-slate-800">Móc treo quần áo bằng nhựa</td>
                    <td className="py-3.5 text-center text-slate-500">Cái</td>
                    <td className="py-3.5 text-center font-bold text-slate-700">350 cái</td>
                    <td className="py-3.5 text-right pr-2 font-black text-slate-800">1.050.000đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. Drill-Down Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drillDownTitle}
        className="w-full max-w-2xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
            <span>Danh sách đơn hàng tạo nên số liệu</span>
            <span>Mô phỏng dữ liệu Drill-down</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="pb-2.5 pl-2">Mã đơn</th>
                  <th className="pb-2.5">Khách hàng</th>
                  <th className="pb-2.5">Chi nhánh</th>
                  <th className="pb-2.5">Dịch vụ</th>
                  <th className="pb-2.5 text-right">Số tiền</th>
                  <th className="pb-2.5">Thời gian</th>
                  <th className="pb-2.5 text-right pr-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {MOCK_DRILL_DOWN_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pl-2 font-bold text-primary">{order.id}</td>
                    <td className="py-3.5 font-bold text-slate-800">{order.customer}</td>
                    <td className="py-3.5 text-slate-500">{order.branch}</td>
                    <td className="py-3.5 text-slate-600">{order.service}</td>
                    <td className="py-3.5 text-right font-black text-slate-900">{order.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="py-3.5 text-slate-400 font-medium text-[11px]">{order.time}</td>
                    <td className="py-3.5 text-right pr-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] ${
                        order.status === 'Hoàn thành'
                          ? 'bg-emerald-50 text-emerald-600'
                          : order.status === 'Đang giặt' || order.status === 'Đang xử lý'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] text-slate-500 font-semibold mt-4">
            * Dữ liệu trên đây là dữ liệu mô phỏng đại diện cho mốc số liệu được chọn, nhằm chứng minh luồng thiết kế tương tác drill-down đa cấp từ biểu đồ số liệu xuống danh sách thực thi.
          </div>
        </div>
      </Drawer>
    </div>
  );
}
