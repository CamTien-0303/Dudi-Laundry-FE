import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useToast } from '../../components/common';

interface PartnerRow {
  code: string;
  name: string;
  orders: number;
  revenue: string;
  growth: string;
  growthDirection: 'up' | 'down';
  health: string;
  healthColor: string;
}

interface NetworkNode {
  id: string;
  name: string;
  code: string;
  status: 'healthy' | 'warning' | 'expiring';
  x: number;
  y: number;
  orders: number;
  revenue: string;
  health: string;
}

interface FilterDataset {
  metrics: {
    stores: string;
    storesTrend: string;
    revenue: string;
    revenueTrend: string;
    users: string;
    usersTrend: string;
    health: string;
    healthStatus: string;
  };
  pulse: {
    revenue: { val: string; trend: string };
    orders: { val: string; trend: string };
    partners: { val: string; trend: string };
    users: { val: string; trend: string };
    chartPath: string;
    fillPath: string;
    markers: string[];
    labels: string[];
  };
  partners: PartnerRow[];
}

const networkNodesData: NetworkNode[] = [
  { id: 'q1', name: 'DUDI Quận 1', code: 'MER-001', status: 'healthy', x: 28, y: 35, orders: 245, revenue: '28.4M', health: '99.8%' },
  { id: 'q3', name: 'DUDI Quận 3', code: 'MER-002', status: 'healthy', x: 55, y: 28, orders: 198, revenue: '21.2M', health: '99.4%' },
  { id: 'thu_duc', name: 'Thủ Đức', code: 'MER-003', status: 'warning', x: 75, y: 65, orders: 156, revenue: '17.8M', health: '97.2%' },
  { id: 'q7', name: 'Q7 WashCare', code: 'MER-004', status: 'expiring', x: 38, y: 72, orders: 88, revenue: '9.2M', health: '92.0%' },
];

const mockDatasets: Record<string, FilterDataset> = {
  today: {
    metrics: {
      stores: '12',
      storesTrend: '+0 hôm nay',
      revenue: '4.8M',
      revenueTrend: '+5% so với hôm qua',
      users: '146',
      usersTrend: '+12 hôm nay',
      health: '97.8%',
      healthStatus: '● Hoạt động tốt'
    },
    pulse: {
      revenue: { val: '4.8M VNĐ', trend: '↑ 5.2% so với hôm qua' },
      orders: { val: '42 đơn', trend: '↑ 4.1% so với hôm qua' },
      partners: { val: '12 cửa hàng', trend: '● Hoạt động 100%' },
      users: { val: '146 người', trend: '↑ 12 người dùng mới' },
      chartPath: 'M 0 160 C 80 150, 140 130, 200 140 C 260 120, 320 80, 380 90 C 440 60, 500 70, 600 40',
      fillPath: 'M 0 160 C 80 150, 140 130, 200 140 C 260 120, 320 80, 380 90 C 440 60, 500 70, 600 40 L 600 180 L 0 180 Z',
      markers: [
        '08:00 — Ca sáng khởi động',
        '12:30 — Đỉnh điểm đơn hàng trưa',
        '15:00 — 18 đơn giặt sấy hoàn thành'
      ],
      labels: ['08h', '11h', '14h', '17h', '20h']
    },
    partners: [
      { code: 'MER-001', name: 'DUDI Q1', orders: 18, revenue: '2.1M', growth: '5%', growthDirection: 'up', health: '99.8%', healthColor: '#22C55E' },
      { code: 'MER-002', name: 'DUDI Q3', orders: 12, revenue: '1.4M', growth: '3%', growthDirection: 'up', health: '99.4%', healthColor: '#22C55E' },
      { code: 'MER-003', name: 'Wash 24h', orders: 8, revenue: '0.8M', growth: '2%', growthDirection: 'down', health: '97.2%', healthColor: '#F59E0B' },
      { code: 'MER-004', name: 'CleanPro', orders: 6, revenue: '0.5M', growth: '1%', growthDirection: 'up', health: '98.1%', healthColor: '#22C55E' },
      { code: 'MER-005', name: 'Giặt Sấy Nhà Tôi', orders: 4, revenue: '0.3M', growth: '5%', growthDirection: 'down', health: '92.0%', healthColor: '#EF4444' },
    ]
  },
  '7days': {
    metrics: {
      stores: '12',
      storesTrend: '+1 trong tuần',
      revenue: '31.6M',
      revenueTrend: '+8% so với tuần trước',
      users: '920',
      usersTrend: '+140 trong tuần',
      health: '98.2%',
      healthStatus: '● Ổn định'
    },
    pulse: {
      revenue: { val: '31.6M VNĐ', trend: '↑ 8.4% so với tuần trước' },
      orders: { val: '360 đơn', trend: '↑ 7.8% so với tuần trước' },
      partners: { val: '12 cửa hàng', trend: '↑ 1 đối tác mới' },
      users: { val: '920 người', trend: '↑ 140 người dùng mới' },
      chartPath: 'M 0 170 C 80 150, 140 120, 200 130 C 260 110, 320 60, 380 75 C 440 50, 500 40, 600 30',
      fillPath: 'M 0 170 C 80 150, 140 120, 200 130 C 260 110, 320 60, 380 75 C 440 50, 500 40, 600 30 L 600 180 L 0 180 Z',
      markers: [
        'T2 — DUDI Q3 mở rộng quy mô',
        'T5 — Chương trình tích điểm 2X',
        'T7 — Tuần kỷ lục 95 đơn/ngày'
      ],
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    },
    partners: [
      { code: 'MER-001', name: 'DUDI Q1', orders: 92, revenue: '11.2M', growth: '12%', growthDirection: 'up', health: '99.8%', healthColor: '#22C55E' },
      { code: 'MER-002', name: 'DUDI Q3', orders: 76, revenue: '8.8M', growth: '10%', growthDirection: 'up', health: '99.4%', healthColor: '#22C55E' },
      { code: 'MER-003', name: 'Wash 24h', orders: 54, revenue: '6.1M', growth: '1%', growthDirection: 'down', health: '97.2%', healthColor: '#F59E0B' },
      { code: 'MER-004', name: 'CleanPro', orders: 42, revenue: '4.2M', growth: '6%', growthDirection: 'up', health: '98.1%', healthColor: '#22C55E' },
      { code: 'MER-005', name: 'Giặt Sấy Nhà Tôi', orders: 22, revenue: '2.1M', growth: '8%', growthDirection: 'down', health: '92.0%', healthColor: '#EF4444' },
    ]
  },
  month: {
    metrics: {
      stores: '12',
      storesTrend: '+2 tháng này',
      revenue: '128.4M',
      revenueTrend: '+15% so với tháng trước',
      users: '3.2K',
      usersTrend: '+320 tháng này',
      health: '98.5%',
      healthStatus: '● Ổn định'
    },
    pulse: {
      revenue: { val: '128.4M VNĐ', trend: '↑ 15.2% so với tháng trước' },
      orders: { val: '1,420 đơn', trend: '↑ 14.6% so với tháng trước' },
      partners: { val: '12 cửa hàng', trend: '↑ 2 đối tác gia hạn' },
      users: { val: '3,240 người', trend: '↑ 320 người dùng mới' },
      chartPath: 'M 0 160 C 80 140, 140 100, 200 110 C 260 120, 320 50, 380 70 C 440 85, 500 35, 600 45',
      fillPath: 'M 0 160 C 80 140, 140 100, 200 110 C 260 120, 320 50, 380 70 C 440 85, 500 35, 600 45 L 600 180 L 0 180 Z',
      markers: [
        '07/07 — DUDI Quận 3 kích hoạt',
        '15/07 — Doanh thu cao nhất (8.4M)',
        '21/07 — 2 cửa hàng gia hạn'
      ],
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4']
    },
    partners: [
      { code: 'MER-001', name: 'DUDI Q1', orders: 245, revenue: '28.4M', growth: '18%', growthDirection: 'up', health: '99.8%', healthColor: '#22C55E' },
      { code: 'MER-002', name: 'DUDI Q3', orders: 198, revenue: '21.2M', growth: '12%', growthDirection: 'up', health: '99.4%', healthColor: '#22C55E' },
      { code: 'MER-003', name: 'Wash 24h', orders: 156, revenue: '17.8M', growth: '4%', growthDirection: 'down', health: '97.2%', healthColor: '#F59E0B' },
      { code: 'MER-004', name: 'CleanPro', orders: 142, revenue: '15.5M', growth: '8%', growthDirection: 'up', health: '98.1%', healthColor: '#22C55E' },
      { code: 'MER-005', name: 'Giặt Sấy Nhà Tôi', orders: 88, revenue: '9.2M', growth: '10%', growthDirection: 'down', health: '92.0%', healthColor: '#EF4444' },
    ]
  },
  customShort: {
    metrics: {
      stores: '12',
      storesTrend: '+1 trong kỳ chọn',
      revenue: '28.4M',
      revenueTrend: '+6% so với kỳ trước',
      users: '810',
      usersTrend: '+110 trong kỳ chọn',
      health: '98.0%',
      healthStatus: '● Ổn định'
    },
    pulse: {
      revenue: { val: '28.4M VNĐ', trend: '↑ 6.2% so với kỳ trước' },
      orders: { val: '310 đơn', trend: '↑ 5.5% so với kỳ trước' },
      partners: { val: '12 cửa hàng', trend: '● Đang theo dõi' },
      users: { val: '810 người', trend: '↑ 110 người dùng mới' },
      chartPath: 'M 0 150 C 80 135, 140 115, 200 125 C 260 100, 320 55, 380 70 C 440 45, 500 35, 600 25',
      fillPath: 'M 0 150 C 80 135, 140 115, 200 125 C 260 100, 320 55, 380 70 C 440 45, 500 35, 600 25 L 600 180 L 0 180 Z',
      markers: [
        '15/07 — Bắt đầu kỳ theo dõi',
        '18/07 — Đối soát ZaloPay',
        '21/07 — Kết thúc kỳ chọn'
      ],
      labels: ['15/07', '17/07', '19/07', '21/07']
    },
    partners: [
      { code: 'MER-001', name: 'DUDI Q1', orders: 85, revenue: '9.8M', growth: '8%', growthDirection: 'up', health: '99.8%', healthColor: '#22C55E' },
      { code: 'MER-002', name: 'DUDI Q3', orders: 68, revenue: '7.5M', growth: '9%', growthDirection: 'up', health: '99.4%', healthColor: '#22C55E' },
      { code: 'MER-003', name: 'Wash 24h', orders: 48, revenue: '5.2M', growth: '3%', growthDirection: 'down', health: '97.2%', healthColor: '#F59E0B' },
      { code: 'MER-004', name: 'CleanPro', orders: 38, revenue: '3.8M', growth: '4%', growthDirection: 'up', health: '98.1%', healthColor: '#22C55E' },
      { code: 'MER-005', name: 'Giặt Sấy Nhà Tôi', orders: 18, revenue: '1.8M', growth: '6%', growthDirection: 'down', health: '92.0%', healthColor: '#EF4444' },
    ]
  },
  customLong: {
    metrics: {
      stores: '14',
      storesTrend: '+4 đối tác mới',
      revenue: '385M',
      revenueTrend: '+22% so với kỳ trước',
      users: '8.5K',
      usersTrend: '+940 trong kỳ chọn',
      health: '98.9%',
      healthStatus: '● Tăng trưởng mạnh'
    },
    pulse: {
      revenue: { val: '385M VNĐ', trend: '↑ 22.4% so với kỳ trước' },
      orders: { val: '4,520 đơn', trend: '↑ 21.0% so với kỳ trước' },
      partners: { val: '14 cửa hàng', trend: '↑ 4 đối tác mới' },
      users: { val: '8,540 người', trend: '↑ 940 người dùng mới' },
      chartPath: 'M 0 180 C 80 140, 140 110, 200 90 C 260 80, 320 60, 380 40 C 440 30, 500 20, 600 15',
      fillPath: 'M 0 180 C 80 140, 140 110, 200 90 C 260 80, 320 60, 380 40 C 440 30, 500 20, 600 15 L 600 180 L 0 180 Z',
      markers: [
        'Tháng 5 — Khởi động DUDI Q1',
        'Tháng 6 — Tích hợp Zalo Invoice',
        'Tháng 7 — Đạt mốc 14 chi nhánh'
      ],
      labels: ['Tháng 5', 'Tháng 6', 'Tháng 7']
    },
    partners: [
      { code: 'MER-001', name: 'DUDI Q1', orders: 880, revenue: '98.4M', growth: '25%', growthDirection: 'up', health: '99.8%', healthColor: '#22C55E' },
      { code: 'MER-002', name: 'DUDI Q3', orders: 690, revenue: '78.2M', growth: '20%', growthDirection: 'up', health: '99.4%', healthColor: '#22C55E' },
      { code: 'MER-003', name: 'Wash 24h', orders: 590, revenue: '64.8M', growth: '12%', growthDirection: 'up', health: '97.2%', healthColor: '#F59E0B' },
      { code: 'MER-004', name: 'CleanPro', orders: 480, revenue: '52.5M', growth: '15%', growthDirection: 'up', health: '98.1%', healthColor: '#22C55E' },
      { code: 'MER-005', name: 'Giặt Sấy Nhà Tôi', orders: 310, revenue: '34.2M', growth: '2%', growthDirection: 'down', health: '92.0%', healthColor: '#EF4444' },
    ]
  }
};

const systemLogsData = [
  { time: '14:32', event: 'CleanPro gia hạn thành công gói dịch vụ Professional (12 tháng)', type: 'system', badge: 'Hệ thống' },
  { time: '14:16', event: 'DUDI Quận 3 ghi nhận thanh toán 2.4M VNĐ qua ZaloPay QR', type: 'payment', badge: 'Thanh toán' },
  { time: '13:52', event: 'Giặt Sấy Nhà Tôi tạm ngưng hoạt động để bảo trì thiết bị', type: 'warning', badge: 'Cảnh báo' },
  { time: '12:20', event: 'Khởi tạo thành công hồ sơ đối tác mới #024 (WashCare Q7)', type: 'partner', badge: 'Đối tác' },
  { time: '11:45', event: 'Zalo Invoice đồng bộ hóa đơn điện tử thành công (128 giao dịch)', type: 'integration', badge: 'Tích hợp' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<'today' | '7days' | 'month' | 'range'>('month');
  const [startDate, setStartDate] = useState('2026-07-15');
  const [endDate, setEndDate] = useState('2026-07-21');
  
  // Pulse tab state
  const [pulseTab, setPulseTab] = useState<'revenue' | 'orders' | 'partners' | 'users'>('revenue');

  // Hover node tooltip for Network Overview
  const [activeNode, setActiveNode] = useState<NetworkNode | null>(networkNodesData[1]);

  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN');
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [rangeAppliedCount, setRangeAppliedCount] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN'));
      toast('Đã cập nhật toàn bộ dữ liệu mới nhất từ mạng lưới DUDI!', 'success');
    }, 500);
  };

  const handleApplyRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'error');
      return;
    }
    setRangeAppliedCount(prev => prev + 1);
    toast('Đã áp dụng khoảng ngày và cập nhật dữ liệu!', 'success');
  };

  // Synchronously compute current active dataset
  const getActiveData = (): FilterDataset => {
    if (activeFilter === 'today') return mockDatasets.today;
    if (activeFilter === '7days') return mockDatasets['7days'];
    if (activeFilter === 'month') return mockDatasets.month;
    
    // activeFilter === 'range'
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return mockDatasets.customLong;
    }
    return mockDatasets.customShort;
  };

  const currentData = getActiveData();

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

      {/* 1. PHẦN ĐẦU TRANG */}
      <div className="flex flex-col gap-4">
        
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
              DUDI NETWORK CONTROL CENTER
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Tổng quan hệ thống
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold shrink-0">
            <span>Cập nhật lần cuối: <strong className="text-slate-700">{lastUpdated}</strong></span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-lg text-slate-700 font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#2563EB]' : 'text-slate-500'} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Segmented Control Filter Bar (Directly under title, NOT inside giant card) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex bg-slate-200/70 p-1 rounded-lg border border-slate-300/60 text-xs font-bold self-start select-none">
            {(['today', '7days', 'month', 'range'] as const).map((filter) => {
              const labels = {
                today: 'Hôm nay',
                '7days': '7 ngày',
                month: 'Tháng này',
                range: 'Khoảng ngày'
              };
              const isSelected = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter);
                    if (filter !== 'range') {
                      toast(`Đã lọc dữ liệu theo: ${labels[filter]}`, 'info');
                    }
                  }}
                  className={`px-4 py-1.5 rounded-md transition-all cursor-pointer border-0 ${
                    isSelected
                      ? 'bg-white text-[#2563EB] font-black shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-semibold bg-transparent'
                  }`}
                >
                  {labels[filter]}
                </button>
              );
            })}
          </div>

          {activeFilter === 'range' && (
            <div className="flex items-center gap-2 flex-wrap text-xs animate-fadeIn">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#DCE5F0] rounded-lg font-bold text-slate-800 outline-none focus:border-[#2563EB]"
              />
              <span className="text-slate-400 font-bold">đến</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#DCE5F0] rounded-lg font-bold text-slate-800 outline-none focus:border-[#2563EB]"
              />
              <button
                onClick={handleApplyRange}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer border-0 shadow-2xs"
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 2. EXECUTIVE METRICS STRIP (Full-width white strip ~110-130px height, 4 regions separated by vertical dividers) */}
      <section className="w-full bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs min-h-[110px] flex items-center">
        <div 
          key={activeFilter + startDate + endDate + rangeAppliedCount}
          className="w-full grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#DCE5F0] animate-fadeIn"
        >
          
          {/* Region 1: CỬA HÀNG */}
          <div 
            onClick={() => navigate('/admin/partners')}
            className="p-4 md:px-6 flex flex-col gap-1 cursor-pointer hover:bg-slate-50/80 transition-colors rounded-lg"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CỬA HÀNG</span>
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {currentData.metrics.stores}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={13} /> {currentData.metrics.storesTrend}
            </span>
          </div>

          {/* Region 2: DOANH THU */}
          <div 
            onClick={() => navigate('/admin/transactions')}
            className="p-4 md:px-6 flex flex-col gap-1 cursor-pointer hover:bg-slate-50/80 transition-colors rounded-lg"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DOANH THU</span>
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {currentData.metrics.revenue}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={13} /> {currentData.metrics.revenueTrend}
            </span>
          </div>

          {/* Region 3: NGƯỜI DÙNG */}
          <div className="p-4 md:px-6 flex flex-col gap-1 rounded-lg">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NGƯỜI DÙNG</span>
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {currentData.metrics.users}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={13} /> {currentData.metrics.usersTrend}
            </span>
          </div>

          {/* Region 4: SYSTEM HEALTH */}
          <div className="p-4 md:px-6 flex flex-col gap-1 rounded-lg">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SYSTEM HEALTH</span>
            <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {currentData.metrics.health}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{currentData.metrics.healthStatus}</span>
            </span>
          </div>

        </div>
      </section>

      {/* 3. MAIN CONTROL AREA (2 Columns ~68% / 32%, Gap 20px) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* BÊN TRÁI (~68% / lg:col-span-8): DUDI PULSE (Large Panel) */}
        <div className="lg:col-span-8 bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-5 text-left">
          
          {/* Header Panel with Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#2563EB]" />
              <h2 className="text-base font-black tracking-wider text-slate-900 uppercase">
                DUDI PULSE
              </h2>
              <span className="text-xs text-slate-500 font-medium ml-1">
                Toàn cảnh hoạt động mạng lưới
              </span>
            </div>

            {/* Header Tabs */}
            <div className="inline-flex gap-1 text-xs font-bold bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
              {(['revenue', 'orders', 'partners', 'users'] as const).map((tab) => {
                const tabLabels = {
                  revenue: 'Doanh thu',
                  orders: 'Đơn hàng',
                  partners: 'Đối tác',
                  users: 'Người dùng'
                };
                const active = pulseTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPulseTab(tab)}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer border-0 ${
                      active ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                    }`}
                  >
                    {tabLabels[tab]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-header Metric */}
          <div key={activeFilter + pulseTab} className="flex items-baseline gap-3 animate-fadeIn">
            <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {currentData.pulse[pulseTab].val}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp size={13} /> {currentData.pulse[pulseTab].trend}
            </span>
          </div>

          {/* Large SVG Chart with Event Markers (Radius ~10px) */}
          <div key={activeFilter + startDate + endDate + rangeAppliedCount} className="w-full bg-[#F8FAFC] border border-[#DCE5F0] rounded-[10px] p-4 relative overflow-hidden animate-fadeIn">
            
            {/* Event Markers Overlay */}
            <div className="flex flex-wrap gap-2 text-[10px] font-bold mb-3 z-10 relative">
              {currentData.pulse.markers.map((markerText, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-blue-200 text-[#2563EB] rounded-md shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  {markerText}
                </span>
              ))}
            </div>

            {/* SVG Line Chart */}
            <div className="w-full h-52 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="pulseChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

                {/* Fill Path */}
                <path 
                  d={currentData.pulse.fillPath}
                  fill="url(#pulseChartGrad)" 
                  className="transition-all duration-500"
                />

                {/* Line Path */}
                <path 
                  d={currentData.pulse.chartPath}
                  fill="none" 
                  stroke="#2563EB" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />

                {/* Data Event Points */}
                <circle cx="200" cy="110" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="380" cy="70" r="5" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="500" cy="35" r="5" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
              {currentData.pulse.labels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>

          </div>

        </div>

        {/* BÊN PHẢI (~32% / lg:col-span-4): ACTION CENTER (Vertical Panel) */}
        <div className="lg:col-span-4 bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-4 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              CẦN XỬ LÝ
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-black">
              7
            </span>
          </div>

          {/* Item List separated by dividers */}
          <div className="flex flex-col divide-y divide-[#DCE5F0]">
            
            {/* Task 1: URGENT */}
            <div className="py-3 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-red-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  URGENT
                </span>
                <span className="text-slate-400">Còn 3 ngày</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs font-bold text-slate-900">3 đối tác sắp hết hạn gói</span>
                <button
                  type="button"
                  onClick={() => navigate('/admin/partners')}
                  className="text-xs font-bold text-[#2563EB] hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Xử lý →
                </button>
              </div>
            </div>

            {/* Task 2: PAYMENT */}
            <div className="py-3 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-amber-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  PAYMENT
                </span>
                <span className="text-slate-400">1.5M VNĐ</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs font-bold text-slate-900">2 giao dịch cần đối soát</span>
                <button
                  type="button"
                  onClick={() => navigate('/admin/transactions')}
                  className="text-xs font-bold text-[#2563EB] hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Kiểm tra →
                </button>
              </div>
            </div>

            {/* Task 3: PARTNER */}
            <div className="py-3 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#2563EB] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  PARTNER
                </span>
                <span className="text-slate-400">Tạm ngưng</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs font-bold text-slate-900">Giặt Sấy Nhà Tôi (MER-004)</span>
                <button
                  type="button"
                  onClick={() => navigate('/admin/partners/MER-004')}
                  className="text-xs font-bold text-[#2563EB] hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Xem →
                </button>
              </div>
            </div>

            {/* Task 4: SYSTEM */}
            <div className="py-3 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  SYSTEM
                </span>
                <span className="text-emerald-700 font-extrabold">Online</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs font-bold text-slate-900">Zalo Invoice tích hợp</span>
                <span className="text-xs text-slate-500 font-semibold">Bình thường</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. NETWORK OVERVIEW & 5. PARTNER PERFORMANCE (Section 45% / 55% Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* BÊN TRÁI (~45% / lg:col-span-5): NETWORK OVERVIEW */}
        <div className="lg:col-span-5 bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-4 text-left">
          
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              MẠNG LƯỚI DUDI
            </h2>
            <span className="text-[10px] font-bold text-slate-400">4 CHI NHÁNH KÍCH HOẠT</span>
          </div>

          {/* Network Visualization Container */}
          <div className="w-full bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg p-4 h-[240px] relative overflow-hidden flex flex-col justify-between">
            
            {/* Grid background overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Connecting Ethernet Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="28%" y1="35%" x2="55%" y2="28%" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="55%" y1="28%" x2="75%" y2="65%" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="28%" y1="35%" x2="38%" y2="72%" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* Nodes */}
            {networkNodesData.map((node) => {
              const isSelected = activeNode?.id === node.id;
              const statusColor = node.status === 'healthy' ? '#22C55E' : node.status === 'warning' ? '#F59E0B' : '#EF4444';

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setActiveNode(node)}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-10"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="relative flex items-center gap-1.5 bg-white border border-[#DCE5F0] px-2.5 py-1 rounded-full shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor }}></span>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-[#2563EB]' : 'text-slate-800'}`}>
                      {node.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Mini Tooltip Card (Bottom overlay) */}
            {activeNode && (
              <div className="z-20 bg-slate-900 text-white p-3 rounded-lg text-xs flex justify-between items-center shadow-md animate-fadeIn mt-auto">
                <div className="flex flex-col">
                  <span className="font-extrabold text-white">{activeNode.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{activeNode.code}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Đơn hàng</div>
                    <div className="font-extrabold text-white">{activeNode.orders}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Doanh thu</div>
                    <div className="font-extrabold text-white">{activeNode.revenue}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Health</div>
                    <div className="font-extrabold text-emerald-400">{activeNode.health}</div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* BÊN PHẢI (~55% / lg:col-span-7): PARTNER PERFORMANCE */}
        <div className="lg:col-span-7 bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-4 text-left">
          
          <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              HIỆU SUẤT ĐỐI TÁC
            </h2>
            <button
              type="button"
              onClick={() => navigate('/admin/partners')}
              className="text-xs font-bold text-[#2563EB] hover:underline bg-transparent border-0 cursor-pointer p-0"
            >
              Xem tất cả →
            </button>
          </div>

          {/* Dense Clean Table */}
          <div className="overflow-x-auto">
            <table key={activeFilter + startDate + endDate + rangeAppliedCount} className="w-full text-left text-xs border-collapse animate-fadeIn">
              <thead>
                <tr className="border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Cửa hàng</th>
                  <th className="py-2.5 px-3 text-right">Đơn</th>
                  <th className="py-2.5 px-3 text-right">Doanh thu</th>
                  <th className="py-2.5 px-3 text-right">Tăng trưởng</th>
                  <th className="py-2.5 px-3 text-right">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5F0]">
                {currentData.partners.map((row) => (
                  <tr
                    key={row.code}
                    onClick={() => navigate(`/admin/partners/${row.code}`)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer font-medium text-slate-800"
                  >
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 hover:text-[#2563EB]">{row.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{row.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{row.orders}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{row.revenue}</td>
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={row.growthDirection === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                        {row.growthDirection === 'up' ? '↑ ' : '↓ '}{row.growth}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold">
                      <span className="inline-flex items-center gap-1 text-slate-900">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.healthColor }}></span>
                        {row.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* 6. SYSTEM ACTIVITY (Audit / Event Log Strip at Bottom) */}
      <section className="w-full bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-4 text-left">
        
        <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            HOẠT ĐỘNG HỆ THỐNG
          </h2>
          <span className="text-[10px] font-mono font-bold text-slate-400">REALTIME AUDIT LOG</span>
        </div>

        {/* Audit Log Rows */}
        <div className="flex flex-col divide-y divide-[#DCE5F0] text-xs">
          {systemLogsData.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-400 text-[11px] shrink-0">{item.time}</span>
                <span className="font-semibold text-slate-800">{item.event}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shrink-0">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
