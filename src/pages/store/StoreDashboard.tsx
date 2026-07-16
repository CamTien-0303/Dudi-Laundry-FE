import { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
} from 'lucide-react';
import { PageHeader } from '../../components/common';
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

const REVENUE_DATA_7_DAYS = [
  { day: 'T2', retail: 1200000, b2b: 600000 },
  { day: 'T3', retail: 1400000, b2b: 800000 },
  { day: 'T4', retail: 1600000, b2b: 800000 }, // Max total = 2.4M (T4)
  { day: 'T5', retail: 1100000, b2b: 500000 },
  { day: 'T6', retail: 1300000, b2b: 700000 },
  { day: 'T7', retail: 1500000, b2b: 700000 },
  { day: 'CN', retail: 1200000, b2b: 600000 },
];

export default function StoreDashboard() {
  const { toast } = useToast();

  const [activeBranch, setActiveBranch] = useState('Tất cả chi nhánh');
  const [activeTimeframe, setActiveTimeframe] = useState('Hôm nay');
  const [activeCustomerTab, setActiveCustomerTab] = useState<'retail' | 'b2b'>('retail');
  const [updateTime, setUpdateTime] = useState('10:30');

  const handleRefresh = () => {
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setUpdateTime(formattedTime);
    toast('Đã cập nhật dữ liệu báo cáo mới nhất!', 'success');
  };

  const handleKpiClick = (title: string) => {
    toast(`Xem chi tiết báo cáo: ${title}`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* Premium Header Controls Block */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader
            title="Báo cáo tổng quan"
            description="Theo dõi doanh thu, đơn hàng và hiệu suất cửa hàng."
          />
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Branch selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600">
              <Building2 size={14} className="text-slate-400" />
              <select
                value={activeBranch}
                onChange={(e) => {
                  setActiveBranch(e.target.value);
                  toast(`Đang hiển thị cho: ${e.target.value}`, 'info');
                }}
                className="bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="Tất cả chi nhánh">Tất cả chi nhánh</option>
                <option value="Chi nhánh Quận 1">Chi nhánh Quận 1</option>
                <option value="Chi nhánh Quận 7">Chi nhánh Quận 7</option>
              </select>
            </div>

            {/* Timeframe selector tabs */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
              {['Hôm nay', 'Tuần này', 'Tháng này', 'Tùy chỉnh'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTimeframe(t);
                    toast(`Thay đổi mốc thời gian sang: ${t}`, 'info');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTimeframe === t ? 'bg-white text-blue-650 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-3 mt-1">
          <span>Hệ thống DUDI Laundry Platform</span>
          <span>Cập nhật lúc {updateTime}</span>
        </div>
      </div>

      {/* Grid of 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full min-w-0">
        
        {/* KPI 1: Revenue */}
        <div
          onClick={() => handleKpiClick('Doanh thu thực tế')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-550">Doanh thu thực tế</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <DollarSign size={18} />
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800">2.400.000đ</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp size={12} />
              <span>+12% so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Number of Orders */}
        <div
          onClick={() => handleKpiClick('Số đơn hôm nay')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-550">Số đơn hôm nay</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <ShoppingBag size={18} />
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800">24 đơn</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp size={12} />
              <span>+8% so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* KPI 3: In Process */}
        <div
          onClick={() => handleKpiClick('Đơn đang xử lý')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-550">Đơn đang xử lý</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
              <Clock size={18} />
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800">8 đơn</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
              <TrendingDown size={12} />
              <span>-5% so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Awaiting Handover */}
        <div
          onClick={() => handleKpiClick('Đơn chờ trả khách')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-550">Đơn chờ trả khách</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
              <CheckCircle size={18} />
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800">3 đơn</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp size={12} />
              <span>+2% so với kỳ trước</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts grid (2/3 width revenue bar, 1/3 service distribution donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        
        {/* Left chart: Revenue Bar layout (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-slate-800">Biểu đồ doanh thu 7 ngày</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Doanh thu cao nhất vào thứ Tư: 2.400.000đ</span>
            </div>
            
            {/* Chart Legend */}
            <div className="flex gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-slate-650">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                Khách lẻ (1.6M)
              </span>
              <span className="flex items-center gap-1 text-slate-650">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
                B2B (800K)
              </span>
            </div>
          </div>

          {/* Bar Chart Simulation Container */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="h-64 flex items-end justify-between border-b border-slate-200 pb-2 relative px-4">
              
              {/* Grid Background guides */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                {[0, 1, 2, 3].map((g) => (
                  <div key={g} className="w-full border-t border-slate-100 border-dashed" />
                ))}
              </div>

              {/* Day bars mapping */}
              {REVENUE_DATA_7_DAYS.map((item) => {
                const totalVal = item.retail + item.b2b;
                const maxVal = 2400000;
                const totalHeightPct = (totalVal / maxVal) * 100;
                const retailPct = (item.retail / totalVal) * 100;
                const b2bPct = (item.b2b / totalVal) * 100;
                const isMaxDay = item.day === 'T4';

                return (
                  <div key={item.day} className="flex flex-col items-center gap-1.5 flex-1 group/bar z-10">
                    
                    {/* Bar columns stack */}
                    <div
                      className="w-8 relative flex flex-col justify-end rounded-t-md overflow-hidden transition-all duration-200 shadow-xs"
                      style={{ height: `${totalHeightPct * 2.2}px` }}
                      onClick={() => toast(`Doanh thu ${item.day}: Retail ${(item.retail/1000)}k | B2B ${(item.b2b/1000)}k`, 'info')}
                    >
                      {/* B2B block (top segment) */}
                      <div className="w-full bg-indigo-400 group-hover/bar:bg-indigo-500 transition-colors" style={{ height: `${b2bPct}%` }} />
                      
                      {/* Retail block (bottom segment) */}
                      <div className="w-full bg-blue-500 group-hover/bar:bg-blue-600 transition-colors" style={{ height: `${retailPct}%` }} />
                    </div>

                    {/* Day label */}
                    <span className={`text-[10px] font-bold ${isMaxDay ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
                      {item.day} {isMaxDay && '⭐'}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center gap-2.5 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] text-blue-800 font-semibold">
              <Calendar size={14} className="text-blue-500 shrink-0" />
              <span>Chạm vào các cột doanh thu ngày để xem thông tin chi tiết từng nguồn doanh số.</span>
            </div>
          </div>
        </div>

        {/* Right chart: Donut layout (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-slate-800">Cơ cấu dịch vụ</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Tỷ trọng số lượng đơn dịch vụ</span>
          </div>

          {/* Donut graphic simulation */}
          <div className="flex flex-col items-center gap-5 justify-center py-2">
            
            {/* SVG circle donut */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* 50% Giặt sấy (blue) - circumference of r=28 is 175.9 */}
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="88 176"
                  strokeDashoffset="0"
                  className="cursor-pointer hover:stroke-[12px] transition-all"
                  onClick={() => toast('Giặt sấy: 50% tổng số lượng đơn', 'info')}
                />
                
                {/* 30% Vệ sinh giày (amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="10"
                  strokeDasharray="52.8 176"
                  strokeDashoffset="-88"
                  className="cursor-pointer hover:stroke-[12px] transition-all"
                  onClick={() => toast('Vệ sinh giày: 30% tổng số lượng đơn', 'info')}
                />

                {/* 20% Giặt hấp (emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray="35.2 176"
                  strokeDashoffset="-140.8"
                  className="cursor-pointer hover:stroke-[12px] transition-all"
                  onClick={() => toast('Giặt hấp: 20% tổng số lượng đơn', 'info')}
                />
              </svg>
              
              {/* Inner Text overlay */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Tổng Đơn</span>
                <span className="text-lg font-extrabold text-slate-800">35 đơn</span>
              </div>
            </div>

            {/* Donut Chart Legend */}
            <div className="flex flex-col gap-2 w-full text-xs font-bold text-slate-750">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-2 px-3">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  Giặt sấy
                </span>
                <span className="text-slate-800 font-extrabold">50%</span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-2 px-3">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  Vệ sinh giày
                </span>
                <span className="text-slate-800 font-extrabold">30%</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-2 px-3">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  Giặt hấp
                </span>
                <span className="text-slate-800 font-extrabold">20%</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Top 5 Customers Section (Retail vs B2B Tabs) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-slate-800">Khách hàng tiêu biểu</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Top 5 khách hàng có chi tiêu cao nhất</span>
          </div>

          {/* Group tab controls */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1 w-fit">
            <button
              onClick={() => setActiveCustomerTab('retail')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCustomerTab === 'retail' ? 'bg-white text-blue-650 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Khách hàng lẻ
            </button>
            <button
              onClick={() => setActiveCustomerTab('b2b')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCustomerTab === 'b2b' ? 'bg-white text-blue-650 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Đối tác B2B
            </button>
          </div>
        </div>

        {/* Customer Table list */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3 pl-4">Hạng</th>
                <th className="p-3">Tên khách hàng</th>
                <th className="p-3">Số lượng đơn hàng</th>
                <th className="p-3 text-right pr-4">Tổng chi tiêu tích lũy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {activeCustomerTab === 'retail' ? (
                RETAIL_CUSTOMERS.map((cust, idx) => (
                  <tr
                    key={cust.name}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => toast(`Khách hàng lẻ: ${cust.name}`, 'info')}
                  >
                    <td className="p-3 pl-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-800">{cust.name}</td>
                    <td className="p-3 font-semibold text-slate-600">{cust.orders} đơn</td>
                    <td className="p-3 text-right pr-4 font-extrabold text-blue-650">{cust.spend.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))
              ) : (
                B2B_CUSTOMERS.map((cust, idx) => (
                  <tr
                    key={cust.name}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => toast(`Đối tác B2B: ${cust.name}`, 'info')}
                  >
                    <td className="p-3 pl-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="p-3 font-bold text-indigo-750">{cust.name}</td>
                    <td className="p-3 font-semibold text-slate-600">{cust.orders} đơn</td>
                    <td className="p-3 text-right pr-4 font-extrabold text-indigo-650">{cust.spend.toLocaleString('vi-VN')} đ</td>
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
