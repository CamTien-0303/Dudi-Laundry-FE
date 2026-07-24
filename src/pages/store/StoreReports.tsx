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
  ArrowUpRight,
  AlertTriangle,
  Percent,
  Calendar,
  Filter
} from 'lucide-react';
import { Drawer } from '../../components/common';
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
  
  // Page configuration and filters (Role simulated via logged in user state)
  const [role] = useState<'owner' | 'manager'>('owner');
  const [activeTimeframe, setActiveTimeframe] = useState<'yesterday' | 'week' | 'month' | 'custom'>('week');
  const [fromDate, setFromDate] = useState('2026-07-15');
  const [toDate, setToDate] = useState('2026-07-21');
  const [branch, setBranch] = useState('all');
  const [channel, setChannel] = useState('all');
  
  // Tabs config (4 Isolated Tabs)
  const [activeTab, setActiveTab] = useState<'revenue' | 'operations' | 'customers' | 'inventory'>('revenue');

  // Drilldown Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drillDownTitle, setDrillDownTitle] = useState('Chi tiết đơn hàng');

  // Handle actions
  const handleExport = (type: 'Excel' | 'PDF') => {
    toast(`Đang xuất tệp báo cáo ${type}... Tệp sẽ tự động tải về sau vài giây.`, 'success');
  };

  const handleSaveFavorite = () => {
    toast('Đã lưu bộ lọc báo cáo hiện tại vào danh sách yêu thích!', 'success');
  };

  const handleApplyFilter = () => {
    toast('Đã cập nhật số liệu báo cáo theo bộ lọc chọn!', 'success');
  };

  const handleSendReminder = (partnerName: string) => {
    toast(`Đã gửi nhắc nợ tự động qua Zalo/Email thành công đến: ${partnerName}`, 'success');
  };

  const openDrillDown = (title: string) => {
    setDrillDownTitle(title);
    setIsDrawerOpen(true);
  };

  // Branch locked for manager role
  const currentBranch = role === 'manager' ? 'q7' : branch;

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

      {/* 1. STORE REPORTS HEADER (Excel / PDF Export Buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            STORE ANALYTICS WORKSPACE
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Báo cáo chi tiết cửa hàng
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <FileText size={15} className="text-red-500" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT MASTER FILTER TOOLBAR */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col gap-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-1 rounded-lg border border-[#DCE5F0]">
            {[
              { id: 'yesterday', label: 'Hôm qua' },
              { id: 'week', label: 'Tuần này' },
              { id: 'month', label: 'Tháng trước' },
              { id: 'custom', label: 'Tùy chỉnh' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTimeframe(t.id as any);
                  if (t.id === 'yesterday') {
                    setFromDate('2026-07-20');
                    setToDate('2026-07-20');
                  } else if (t.id === 'week') {
                    setFromDate('2026-07-15');
                    setToDate('2026-07-21');
                  } else if (t.id === 'month') {
                    setFromDate('2026-06-01');
                    setToDate('2026-06-30');
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border-0 ${
                  activeTimeframe === t.id
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Branch & Sales Channel Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Branch Select */}
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md px-3 py-1.5">
              <Building2 size={13} className="text-[#2563EB]" />
              <select
                value={currentBranch}
                disabled={role === 'manager'}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="all">Tất cả chi nhánh</option>
                <option value="q1">Chi nhánh Quận 1</option>
                <option value="q7">Chi nhánh Quận 7</option>
                <option value="thu_duc">Chi nhánh Thủ Đức</option>
              </select>
            </div>

            {/* Sales Channel Select */}
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md px-3 py-1.5">
              <Filter size={13} className="text-slate-400" />
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="all">Tất cả kênh bán</option>
                <option value="retail">Khách lẻ tại quầy</option>
                <option value="b2b">Đối tác B2B</option>
              </select>
            </div>

            {/* Save Favorite & View Report Buttons */}
            <button
              type="button"
              onClick={handleSaveFavorite}
              title="Lưu cấu hình báo cáo hiện tại vào bộ lọc yêu thích"
              className="p-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] text-slate-600 rounded-md cursor-pointer transition-colors"
            >
              <Heart size={14} className="text-rose-500 fill-rose-500" />
            </button>

            <button
              type="button"
              onClick={handleApplyFilter}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
            >
              <span>Xem báo cáo</span>
            </button>
          </div>

        </div>

        {/* Dynamic Custom Date Pickers (ONLY SHOWN WHEN "TÙY CHỈNH" IS SELECTED) */}
        {activeTimeframe === 'custom' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 animate-fadeIn">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Calendar size={13} className="text-[#2563EB]" />
              Chọn từ ngày:
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1 text-xs font-semibold outline-none focus:border-[#2563EB]"
            />
            <span className="text-slate-400 font-bold">đến:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1 text-xs font-semibold outline-none focus:border-[#2563EB]"
            />
          </div>
        )}
      </div>

      {/* 3. ISOLATED TAB NAVIGATION (4 TABS) */}
      <div className="flex border-b border-[#DCE5F0] bg-white rounded-xl p-1 gap-1 shadow-2xs">
        {[
          { id: 'revenue', label: 'Doanh thu', icon: DollarSign },
          { id: 'operations', label: 'Dịch vụ & Vận hành', icon: WashingMachine },
          { id: 'customers', label: 'Khách hàng', icon: Users },
          { id: 'inventory', label: 'Kho vật tư', icon: Package }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-1 justify-center border-0 ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <IconComp size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. ISOLATED TAB CONTENTS */}
      
      {/* TAB 1: DOANH THU */}
      {activeTab === 'revenue' && (
        <div className="flex flex-col gap-6">
          
          {/* 4 KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Total Revenue */}
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase">TỔNG DOANH THU</span>
                <DollarSign size={16} className="text-[#2563EB]" />
              </div>
              <strong className="text-2xl font-black text-slate-900">124.500.000đ</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +18.5% so với kỳ trước
              </span>
            </div>

            {/* KPI 2: Retail Revenue */}
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase">DOANH THU KHÁCH LẺ</span>
                <Users size={16} className="text-emerald-600" />
              </div>
              <strong className="text-2xl font-black text-slate-900">78.200.000đ</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +12.4% so với kỳ trước
              </span>
            </div>

            {/* KPI 3: B2B Revenue */}
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase">DOANH THU B2B</span>
                <ArrowUpRight size={16} className="text-indigo-600" />
              </div>
              <strong className="text-2xl font-black text-[#2563EB]">46.300.000đ</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +30.1% so với kỳ trước
              </span>
            </div>

            {/* KPI 4: Paid Orders Count */}
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase">ĐƠN ĐÃ THANH TOÁN</span>
                <Percent size={16} className="text-amber-600" />
              </div>
              <strong className="text-2xl font-black text-slate-900">1.420 đơn</strong>
              <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                <TrendingDown size={12} /> -2.3% so với kỳ trước
              </span>
            </div>

          </div>

          {/* REVENUE CHART & PAYMENT METHOD RATIO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: Revenue Bar Chart (lg:col-span-8) - CLICK TO DRILL DOWN */}
            <div className="lg:col-span-8 bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Biểu đồ doanh thu theo ngày
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Chạm vào các cột để xem danh sách đơn hàng đóng góp (Drill-down)</span>
                </div>
                <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Triệu đồng
                </span>
              </div>
              
              {/* Interactive SVG Bar Chart */}
              <div className="relative h-60 w-full pt-2">
                <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                  <line x1="30" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="155" x2="580" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="180" x2="580" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                  <text x="5" y="24" className="text-[9px] font-semibold text-slate-400 fill-current">25 Tr</text>
                  <text x="5" y="69" className="text-[9px] font-semibold text-slate-400 fill-current">20 Tr</text>
                  <text x="5" y="114" className="text-[9px] font-semibold text-slate-400 fill-current">15 Tr</text>
                  <text x="5" y="159" className="text-[9px] font-semibold text-slate-400 fill-current">10 Tr</text>

                  {/* Day 1 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 15/07/2026')}>
                    <rect x="50" y="140" width="36" height="40" rx="4" className="fill-[#2563EB]/70 group-hover/bar:fill-[#2563EB] transition-colors" />
                    <text x="68" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-500 fill-current">15/07</text>
                  </g>

                  {/* Day 2 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 16/07/2026')}>
                    <rect x="120" y="120" width="36" height="60" rx="4" className="fill-[#2563EB]/70 group-hover/bar:fill-[#2563EB] transition-colors" />
                    <text x="138" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-500 fill-current">16/07</text>
                  </g>

                  {/* Day 3 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 17/07/2026')}>
                    <rect x="190" y="98" width="36" height="82" rx="4" className="fill-[#2563EB]/70 group-hover/bar:fill-[#2563EB] transition-colors" />
                    <text x="208" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-500 fill-current">17/07</text>
                  </g>

                  {/* Day 4 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 18/07/2026')}>
                    <rect x="260" y="74" width="36" height="106" rx="4" className="fill-[#2563EB]/70 group-hover/bar:fill-[#2563EB] transition-colors" />
                    <text x="278" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-500 fill-current">18/07</text>
                  </g>

                  {/* Day 5 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 19/07/2026')}>
                    <rect x="330" y="60" width="36" height="120" rx="4" className="fill-[#2563EB] group-hover/bar:fill-blue-700 transition-colors" />
                    <text x="348" y="198" textAnchor="middle" className="text-[9px] font-bold text-[#2563EB] fill-current">19/07 ⭐</text>
                  </g>

                  {/* Day 6 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 20/07/2026')}>
                    <rect x="400" y="113" width="36" height="67" rx="4" className="fill-[#2563EB]/70 group-hover/bar:fill-[#2563EB] transition-colors" />
                    <text x="418" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-500 fill-current">20/07</text>
                  </g>

                  {/* Day 7 */}
                  <g className="group/bar cursor-pointer" onClick={() => openDrillDown('Chi tiết doanh thu ngày 21/07/2026')}>
                    <rect x="470" y="112" width="36" height="68" rx="4" className="fill-[#2563EB]/70 group-hover/bar:fill-[#2563EB] transition-colors" />
                    <text x="488" y="198" textAnchor="middle" className="text-[9px] font-bold text-slate-500 fill-current">21/07</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Right: Payment Ratio Stack (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col justify-between gap-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Tỷ lệ thanh toán</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Tỷ trọng phương thức thanh toán</span>
              </div>

              <div className="flex flex-col gap-5 my-2">
                <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-slate-100 cursor-pointer">
                  <div onClick={() => openDrillDown('Giao dịch qua Chuyển khoản')} className="bg-[#2563EB] hover:bg-blue-700 transition-colors" style={{ width: '68.1%' }} />
                  <div onClick={() => openDrillDown('Giao dịch bằng Tiền mặt')} className="bg-emerald-500 hover:bg-emerald-600 transition-colors" style={{ width: '28.3%' }} />
                  <div onClick={() => openDrillDown('Giao dịch bằng Điểm thưởng')} className="bg-amber-500 hover:bg-amber-600 transition-colors" style={{ width: '3.6%' }} />
                </div>

                <div className="flex flex-col gap-2 text-xs font-bold">
                  <div className="flex justify-between items-center bg-[#F8FAFC] p-2 rounded border border-[#DCE5F0]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB]" />
                      Chuyển khoản
                    </span>
                    <span className="font-mono text-slate-900">84.800.000đ (68.1%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F8FAFC] p-2 rounded border border-[#DCE5F0]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                      Tiền mặt
                    </span>
                    <span className="font-mono text-slate-900">35.200.000đ (28.3%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F8FAFC] p-2 rounded border border-[#DCE5F0]">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                      Điểm thưởng
                    </span>
                    <span className="font-mono text-slate-900">4.500.000đ (3.6%)</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-semibold text-center">
                Số liệu tính trên các hóa đơn đã thanh toán
              </span>
            </div>

          </div>

          {/* B2B OUTSTANDING DEBT TABLE */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">CÔNG NỢ B2B CHƯA THU</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Danh sách đối tác doanh nghiệp có dư nợ chưa thanh toán</span>
            </div>
            
            <div className="overflow-x-auto border border-[#DCE5F0] rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Tên đối tác B2B</th>
                    <th className="py-3 px-4">Hạn thanh toán</th>
                    <th className="py-3 px-4 text-right">Dư nợ chưa thu</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0]">
                  <tr className="bg-white hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Khách sạn Rex</td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">20/07/2026</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-red-600">15.000.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                        Quá hạn (5 ngày)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSendReminder('Khách sạn Rex')}
                        className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-[#EEF4FF] rounded transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        Gửi nhắc nợ
                      </button>
                    </td>
                  </tr>

                  <tr className="bg-white hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Homestay Sunside</td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">18/07/2026</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-red-600">12.000.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                        Quá hạn (7 ngày)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSendReminder('Homestay Sunside')}
                        className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-[#EEF4FF] rounded transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        Gửi nhắc nợ
                      </button>
                    </td>
                  </tr>

                  <tr className="bg-white hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Spa An Nhiên</td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">25/07/2026</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-slate-900">8.500.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                        Trong hạn (4 ngày)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSendReminder('Spa An Nhiên')}
                        className="px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-[#EEF4FF] rounded transition-colors border-0 bg-transparent cursor-pointer"
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

      {/* TAB 2: DỊCH VỤ & VẬN HÀNH */}
      {activeTab === 'operations' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">TỔNG KG ĐÃ GIẶT</span>
              <strong className="text-2xl font-black text-slate-900">1.850 kg</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +8.2% so với kỳ trước
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">TỔNG MÓN ĐÃ XỬ LÝ</span>
              <strong className="text-2xl font-black text-slate-900">4.210 món</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +11.5% so với kỳ trước
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">XỬ LÝ TRUNG BÌNH (SLA)</span>
              <strong className="text-2xl font-black text-slate-900">3.8 giờ</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingDown size={12} /> -10.5% thời gian xử lý (Tốt)
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">TỶ LỆ ĐÚNG HẠN SLA</span>
              <strong className="text-2xl font-black text-slate-900">96.5%</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +1.8% so với kỳ trước
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KHÁCH HÀNG */}
      {activeTab === 'customers' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">KHÁCH HÀNG MỚI</span>
              <strong className="text-2xl font-black text-slate-900">+145 khách</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +22.0% so với kỳ trước
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">KHÁCH QUAY LẠI</span>
              <strong className="text-2xl font-black text-slate-900">520 khách</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +5.8% so với kỳ trước
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">TỶ LỆ GIỮ CHÂN</span>
              <strong className="text-2xl font-black text-slate-900">68.2%</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +2.4% so với kỳ trước
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">CHI TIÊU TB / KHÁCH</span>
              <strong className="text-2xl font-black text-slate-900">235.000đ</strong>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={12} /> +4.1% so với kỳ trước
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KHO VẬT TƯ */}
      {activeTab === 'inventory' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-red-500" />
                VẬT TƯ CHẠM NGƯỠNG TỒN TỐI THIỂU
              </h3>
            </div>

            <div className="overflow-x-auto border border-[#DCE5F0] rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Tên vật tư</th>
                    <th className="py-3 px-4 text-center">ĐVT</th>
                    <th className="py-3 px-4 text-center">Tồn tối thiểu</th>
                    <th className="py-3 px-4 text-center">Tồn hiện tại</th>
                    <th className="py-3 px-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0]">
                  <tr className="bg-[#FFF1F2]/60 font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Nước giặt đậm đặc DUDI-PRO</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">Can 20L</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">5 can</td>
                    <td className="py-3 px-4 text-center font-mono font-black text-red-600">2 can</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold text-[10px]">Cần nhập gấp</span>
                    </td>
                  </tr>

                  <tr className="bg-[#FFF1F2]/60 font-medium">
                    <td className="py-3 px-4 font-bold text-slate-900">Nước xả vải Comfort thơm mát</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">Can 20L</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">6 can</td>
                    <td className="py-3 px-4 text-center font-mono font-black text-red-600">3 can</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold text-[10px]">Cần nhập gấp</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. DRILL-DOWN ORDER DETAILS DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drillDownTitle}
        className="w-full sm:w-[500px]"
      >
        <div className="flex flex-col gap-4 text-left text-xs p-1">
          <div className="flex justify-between items-center border-b border-[#DCE5F0] pb-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
            <span>DANH SÁCH ĐƠN HÀNG CẤU THÀNH</span>
            <span>DRILL-DOWN</span>
          </div>

          <div className="overflow-x-auto border border-[#DCE5F0] rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Mã đơn</th>
                  <th className="py-2.5 px-3">Khách hàng</th>
                  <th className="py-2.5 px-3">Dịch vụ</th>
                  <th className="py-2.5 px-3 text-right">Số tiền</th>
                  <th className="py-2.5 px-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5F0]">
                {MOCK_DRILL_DOWN_ORDERS.map((o) => (
                  <tr key={o.id} className="bg-white hover:bg-slate-50 transition-colors font-medium">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#2563EB]">{o.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{o.customer}</td>
                    <td className="py-2.5 px-3 text-slate-600">{o.service}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">{o.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Drawer>

    </div>
  );
}
