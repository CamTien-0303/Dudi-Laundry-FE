import { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Building2,
  Calendar,
  Users
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

// Top Customers mock data
const RETAIL_CUSTOMERS = [
  { name: 'Nguyễn Văn An', orders: 15, spend: 3200000 },
  { name: 'Trần Thị Bình', orders: 12, spend: 2500000 },
  { name: 'Lê Hoàng Nam', orders: 9, spend: 1800000 },
  { name: 'Phạm Minh Đức', orders: 7, spend: 1400000 },
  { name: 'Vũ Thị Hương', orders: 5, spend: 900000 },
];

const B2B_CUSTOMERS = [
  { name: 'Khách sạn Rex', orders: 45, spend: 48000000 },
  { name: 'Homestay Sunside', orders: 32, spend: 32500000 },
  { name: 'Spa An Nhiên', orders: 24, spend: 18200000 },
  { name: 'Gym California', orders: 18, spend: 12000000 },
  { name: 'Nhà hàng Sen Vàng', orders: 12, spend: 8500000 },
];

// Reactive datasets based on timeframe filter
const MOCK_DATASETS: Record<string, {
  revenueTotal: number;
  retailRevenue: number;
  b2bRevenue: number;
  ordersToday: number;
  ordersProcessing: number;
  ordersReady: number;
  revenueChart: Array<{ day: string; retail: number; b2b: number }>;
}> = {
  'Hôm nay': {
    revenueTotal: 2400000,
    retailRevenue: 1600000,
    b2bRevenue: 800000,
    ordersToday: 24,
    ordersProcessing: 8,
    ordersReady: 3,
    revenueChart: [
      { day: 'T2', retail: 1200000, b2b: 600000 },
      { day: 'T3', retail: 1400000, b2b: 800000 },
      { day: 'T4', retail: 1600000, b2b: 800000 },
      { day: 'T5', retail: 1100000, b2b: 500000 },
      { day: 'T6', retail: 1300000, b2b: 700000 },
      { day: 'T7', retail: 1500000, b2b: 700000 },
      { day: 'CN', retail: 1200000, b2b: 600000 },
    ]
  },
  'Tuần này': {
    revenueTotal: 16800000,
    retailRevenue: 10800000,
    b2bRevenue: 6000000,
    ordersToday: 168,
    ordersProcessing: 14,
    ordersReady: 9,
    revenueChart: [
      { day: 'T2', retail: 1500000, b2b: 900000 },
      { day: 'T3', retail: 1700000, b2b: 1000000 },
      { day: 'T4', retail: 1900000, b2b: 1100000 },
      { day: 'T5', retail: 1400000, b2b: 800000 },
      { day: 'T6', retail: 1600000, b2b: 900000 },
      { day: 'T7', retail: 1800000, b2b: 1000000 },
      { day: 'CN', retail: 1500000, b2b: 900000 },
    ]
  },
  'Tháng này': {
    revenueTotal: 68500000,
    retailRevenue: 42500000,
    b2bRevenue: 26000000,
    ordersToday: 680,
    ordersProcessing: 22,
    ordersReady: 15,
    revenueChart: [
      { day: 'T1', retail: 9800000, b2b: 6000000 },
      { day: 'T2', retail: 11200000, b2b: 7000000 },
      { day: 'T3', retail: 10500000, b2b: 6500000 },
      { day: 'T4', retail: 11000000, b2b: 6500000 },
    ]
  },
  'Tùy chỉnh': {
    revenueTotal: 32000000,
    retailRevenue: 20000000,
    b2bRevenue: 12000000,
    ordersToday: 320,
    ordersProcessing: 10,
    ordersReady: 5,
    revenueChart: [
      { day: 'Đợt 1', retail: 4000000, b2b: 2400000 },
      { day: 'Đợt 2', retail: 4500000, b2b: 2700000 },
      { day: 'Đợt 3', retail: 3800000, b2b: 2200000 },
      { day: 'Đợt 4', retail: 4200000, b2b: 2500000 },
      { day: 'Đợt 5', retail: 3500000, b2b: 2200000 },
    ]
  }
};

export default function StoreDashboard() {
  const { toast } = useToast();

  const [activeBranch, setActiveBranch] = useState('Chi nhánh Quận 1');
  const [activeTimeframe, setActiveTimeframe] = useState('Hôm nay');
  const [activeCustomerTab, setActiveCustomerTab] = useState<'retail' | 'b2b'>('retail');
  const [updateTime, setUpdateTime] = useState('10:30');

  // Active dataset
  const currentDataset = MOCK_DATASETS[activeTimeframe] || MOCK_DATASETS['Hôm nay'];

  const handleRefresh = () => {
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setUpdateTime(formattedTime);
    toast('Đã cập nhật dữ liệu vận hành mới nhất!', 'success');
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

      {/* 1. COMPACT OPERATIONS HEADER (No giant empty spaces) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        
        {/* Left: Title + Branch & Active Status */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
              DAILY STORE OPERATIONS
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang hoạt động
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Báo cáo tổng quan cửa hàng
          </h1>
        </div>

        {/* Right: Branch Selector, Timeframe Filter & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          
          {/* Branch Select */}
          <div className="flex items-center gap-1.5 bg-white border border-[#DCE5F0] rounded-lg px-3 py-1.5 text-xs font-bold shadow-2xs">
            <Building2 size={14} className="text-[#2563EB]" />
            <select
              value={activeBranch}
              onChange={(e) => {
                setActiveBranch(e.target.value);
                toast(`Đang xem dữ liệu cho: ${e.target.value}`, 'info');
              }}
              className="bg-transparent border-none outline-none font-bold text-slate-900 cursor-pointer"
            >
              <option value="Chi nhánh Quận 1">Chi nhánh Quận 1</option>
              <option value="Chi nhánh Quận 7">Chi nhánh Quận 7</option>
              <option value="Tất cả chi nhánh">Tất cả chi nhánh</option>
            </select>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex bg-white border border-[#DCE5F0] rounded-lg p-1 gap-1 shadow-2xs text-xs">
            {['Hôm nay', 'Tuần này', 'Tháng này', 'Tùy chỉnh'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setActiveTimeframe(t);
                  toast(`Đã cập nhật mốc thời gian: ${t}`, 'info');
                }}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer border-0 ${
                  activeTimeframe === t
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Refresh & Last Updated */}
          <button
            type="button"
            onClick={handleRefresh}
            title={`Cập nhật lúc ${updateTime}`}
            className="p-2 bg-white border border-[#DCE5F0] rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer shadow-2xs transition-colors flex items-center justify-center"
          >
            <RefreshCw size={15} />
          </button>
        </div>

      </div>

      {/* 2. OPERATIONAL SUMMARY STRIP (Main Revenue Card + 3 Operational Counters) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* MAIN REVENUE KPI CARD (Green Pastel Accent - Soft #ECFDF5) */}
        <div className="lg:col-span-6 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={16} className="text-emerald-600" />
              DOANH THU THỰC TẾ ({activeTimeframe.toUpperCase()})
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp size={12} /> +12% so với kỳ trước
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <strong className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {currentDataset.revenueTotal.toLocaleString('vi-VN')}đ
            </strong>
          </div>

          {/* Split into Retail vs B2B */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200/80">
            <div className="flex flex-col gap-0.5 bg-white/70 p-2.5 rounded-lg border border-emerald-200/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Khách lẻ</span>
              <strong className="text-base font-black text-emerald-800">
                {currentDataset.retailRevenue.toLocaleString('vi-VN')}đ
              </strong>
            </div>
            <div className="flex flex-col gap-0.5 bg-white/70 p-2.5 rounded-lg border border-emerald-200/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Khách B2B</span>
              <strong className="text-base font-black text-indigo-800">
                {currentDataset.b2bRevenue.toLocaleString('vi-VN')}đ
              </strong>
            </div>
          </div>
        </div>

        {/* 3 OPERATIONAL COUNTERS (3 Cols Each) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Counter 1: Số đơn hôm nay (Blue Pastel) */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">SỐ ĐƠN {activeTimeframe.toUpperCase()}</span>
              <ShoppingBag size={16} className="text-[#2563EB]" />
            </div>
            <div className="flex flex-col">
              <strong className="text-2xl font-black text-slate-900">{currentDataset.ordersToday}</strong>
              <span className="text-[10px] font-bold text-blue-700 mt-1">Đơn tiếp nhận</span>
            </div>
          </div>

          {/* Counter 2: Đơn đang xử lý (Amber Pastel Accent) */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">ĐANG XỬ LÝ</span>
              <Clock size={16} className="text-amber-600" />
            </div>
            <div className="flex flex-col">
              <strong className="text-2xl font-black text-amber-800">{currentDataset.ordersProcessing}</strong>
              <span className="text-[10px] font-bold text-amber-700 mt-1">Đang giặt sấy</span>
            </div>
          </div>

          {/* Counter 3: Đơn chờ trả khách (Lavender Pastel Accent) */}
          <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase">CHỜ TRẢ KHÁCH</span>
              <CheckCircle size={16} className="text-indigo-600" />
            </div>
            <div className="flex flex-col">
              <strong className="text-2xl font-black text-indigo-900">{currentDataset.ordersReady}</strong>
              <span className="text-[10px] font-bold text-indigo-700 mt-1">Đã sẵn sàng bàn giao</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. MAIN CHARTS SECTION (Revenue Bar Chart + Service Distribution Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Chart: Revenue Bar Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Biểu đồ doanh thu ({activeTimeframe})
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Phân tích dòng tiền theo nguồn Khách lẻ &amp; B2B</span>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB]" />
                Khách lẻ
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#6366F1]" />
                Đối tác B2B
              </span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="h-60 flex items-end justify-between border-b border-slate-200 pb-2 relative px-4">
              
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                {[0, 1, 2, 3].map((g) => (
                  <div key={g} className="w-full border-t border-slate-100 border-dashed" />
                ))}
              </div>

              {/* Day bars mapping */}
              {currentDataset.revenueChart.map((item) => {
                const totalVal = item.retail + item.b2b;
                const maxVal = Math.max(...currentDataset.revenueChart.map(x => x.retail + x.b2b)) || 2400000;
                const totalHeightPct = (totalVal / maxVal) * 100;
                const retailPct = (item.retail / totalVal) * 100;
                const b2bPct = (item.b2b / totalVal) * 100;

                return (
                  <div key={item.day} className="flex flex-col items-center gap-1.5 flex-1 group/bar z-10">
                    <div
                      className="w-7 relative flex flex-col justify-end rounded-t overflow-hidden transition-all duration-200 shadow-2xs cursor-pointer"
                      style={{ height: `${Math.max(totalHeightPct * 1.8, 20)}px` }}
                      onClick={() => toast(`Doanh thu ${item.day}: Lẻ ${(item.retail/1000).toLocaleString('vi-VN')}k | B2B ${(item.b2b/1000).toLocaleString('vi-VN')}k`, 'info')}
                    >
                      <div className="w-full bg-[#6366F1] group-hover/bar:bg-indigo-600 transition-colors" style={{ height: `${b2bPct}%` }} />
                      <div className="w-full bg-[#2563EB] group-hover/bar:bg-blue-700 transition-colors" style={{ height: `${retailPct}%` }} />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-[#EEF4FF] border border-[#BFDBFE] rounded-md text-[11px] text-[#2563EB] font-bold">
              <Calendar size={14} className="shrink-0" />
              <span>Nhấp chuột vào từng cột doanh thu để xem số liệu bóc tách chi tiết.</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Service Distribution Donut (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col gap-0.5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">CƠ CẤU DỊCH VỤ</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Tỷ trọng các nhóm dịch vụ xử lý</span>
          </div>

          <div className="flex flex-col items-center gap-5 justify-center py-1">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg width="130" height="130" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#2563EB"
                  strokeWidth="10"
                  strokeDasharray="88 176"
                  strokeDashoffset="0"
                  className="cursor-pointer hover:stroke-[12px] transition-all"
                  onClick={() => toast('Giặt sấy: 50% tổng đơn hàng', 'info')}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  strokeDasharray="52.8 176"
                  strokeDashoffset="-88"
                  className="cursor-pointer hover:stroke-[12px] transition-all"
                  onClick={() => toast('Vệ sinh giày: 30% tổng đơn hàng', 'info')}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="35.2 176"
                  strokeDashoffset="-140.8"
                  className="cursor-pointer hover:stroke-[12px] transition-all"
                  onClick={() => toast('Giặt hấp: 20% tổng đơn hàng', 'info')}
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-mono uppercase">Tổng Đơn</span>
                <span className="text-base font-black text-slate-900">{currentDataset.ordersToday} đơn</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full text-xs font-bold">
              <div className="flex justify-between items-center bg-[#F8FAFC] border border-[#DCE5F0] rounded p-2 px-3">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB]" />
                  Giặt sấy quần áo
                </span>
                <span className="text-slate-900 font-extrabold">50%</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#F8FAFC] border border-[#DCE5F0] rounded p-2 px-3">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
                  Vệ sinh giày
                </span>
                <span className="text-slate-900 font-extrabold">30%</span>
              </div>

              <div className="flex justify-between items-center bg-[#F8FAFC] border border-[#DCE5F0] rounded p-2 px-3">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
                  Giặt hấp cao cấp
                </span>
                <span className="text-slate-900 font-extrabold">20%</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4. TOP CUSTOMERS SECTION (Retail vs B2B Tabs) */}
      <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#2563EB]" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              KHÁCH HÀNG TIÊU BIỂU (TOP 5 CHI TIÊU)
            </h3>
          </div>

          {/* Group tab controls */}
          <div className="flex bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg p-1 gap-1 w-fit text-xs">
            <button
              type="button"
              onClick={() => setActiveCustomerTab('retail')}
              className={`px-4 py-1.5 rounded font-bold transition-all cursor-pointer border-0 ${
                activeCustomerTab === 'retail'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Khách hàng lẻ
            </button>
            <button
              type="button"
              onClick={() => setActiveCustomerTab('b2b')}
              className={`px-4 py-1.5 rounded font-bold transition-all cursor-pointer border-0 ${
                activeCustomerTab === 'b2b'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Đối tác B2B
            </button>
          </div>
        </div>

        {/* Customer Table list */}
        <div className="overflow-x-auto w-full border border-[#DCE5F0] rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Hạng</th>
                <th className="py-3 px-4">Tên khách hàng</th>
                <th className="py-3 px-4">Số lượng đơn hàng</th>
                <th className="py-3 px-4 text-right">Tổng chi tiêu tích lũy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {activeCustomerTab === 'retail' ? (
                RETAIL_CUSTOMERS.map((cust, idx) => (
                  <tr
                    key={cust.name}
                    className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => toast(`Khách hàng lẻ: ${cust.name}`, 'info')}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cust.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{cust.orders} đơn</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-[#2563EB]">{cust.spend.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))
              ) : (
                B2B_CUSTOMERS.map((cust, idx) => (
                  <tr
                    key={cust.name}
                    className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => toast(`Đối tác B2B: ${cust.name}`, 'info')}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-indigo-900">{cust.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{cust.orders} đơn</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-indigo-700">{cust.spend.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
