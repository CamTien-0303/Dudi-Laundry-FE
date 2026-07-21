import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { PageHeader, StatCard, DataTable, StatusBadge, useToast } from '../../components/common';

interface DashboardData {
  stats: {
    stores: string;
    storesTrend: string;
    storesDirection: 'up' | 'down' | 'neutral';
    revenue: string;
    revenueTrend: string;
    revenueDirection: 'up' | 'down' | 'neutral';
    users: string;
    usersTrend: string;
    usersDirection: 'up' | 'down' | 'neutral';
    activeRate: string;
    activeRateTrend: string;
    activeRateDirection: 'up' | 'down' | 'neutral';
  };
  alerts: {
    expiring: { text: string; count: number };
    pending: { text: string; amount: string; count: number };
    suspended: { text: string; count: number };
  };
  revenueChart: {
    points: { cx: number; cy: number }[];
    path: string;
    fillPath: string;
    trendText: string;
    weeks: string[];
  };
  growthChart: {
    bars: { label: string; val: number; val2: number }[];
    trendText: string;
  };
  topStores: {
    code: string;
    name: string;
    count: string;
    status: string;
    variant: 'success' | 'info' | 'warning' | 'error' | 'default';
  }[];
}

// 1. Dữ liệu: Hôm nay
const dataToday: DashboardData = {
  stats: {
    stores: '12',
    storesTrend: '+0 hôm nay',
    storesDirection: 'neutral',
    revenue: '4.8M',
    revenueTrend: '+5% so với hôm qua',
    revenueDirection: 'up',
    users: '146',
    usersTrend: '+12 hôm nay',
    usersDirection: 'up',
    activeRate: '97.8%',
    activeRateTrend: 'Hoạt động tốt',
    activeRateDirection: 'neutral',
  },
  alerts: {
    expiring: { text: '1 đối tác hết hạn hôm nay (Wash 24h - MER-003).', count: 1 },
    pending: { text: '1 giao dịch nạp điểm Zalo Invoice đang chờ kiểm tra.', amount: '200K VNĐ', count: 1 },
    suspended: { text: '0 đối tác tạm ngưng (Tất cả hoạt động tốt).', count: 0 },
  },
  revenueChart: {
    weeks: ['Sáng', 'Trưa', 'Chiều', 'Tối'],
    path: 'M 0 160 C 50 180, 100 120, 150 130 C 200 140, 250 80, 300 100 C 350 110, 400 40, 450 70 C 475 80, 500 50, 500 50',
    fillPath: 'M 0 160 C 50 180, 100 120, 150 130 C 200 140, 250 80, 300 100 C 350 110, 400 40, 450 70 C 475 80, 500 50, 500 50 L 500 180 L 0 180 Z',
    points: [{ cx: 150, cy: 130 }, { cx: 300, cy: 100 }, { cx: 450, cy: 70 }, { cx: 500, cy: 50 }],
    trendText: '+5%'
  },
  growthChart: {
    bars: [
      { label: '08h', val: 20, val2: 12 },
      { label: '10h', val: 40, val2: 14 },
      { label: '12h', val: 50, val2: 15 },
      { label: '14h', val: 35, val2: 15 },
      { label: '16h', val: 75, val2: 16 },
      { label: '18h', val: 90, val2: 17 },
      { label: '20h', val: 80, val2: 17 },
    ],
    trendText: '+0 đối tác mới'
  },
  topStores: [
    { code: 'MER-001', name: 'DUDI Quận 1', count: '18 đơn / ngày', status: 'Xuất sắc', variant: 'success' },
    { code: 'MER-002', name: 'CleanPro Laundry', count: '12 đơn / ngày', status: 'Tốt', variant: 'info' },
    { code: 'MER-005', name: 'FreshCare', count: '9 đơn / ngày', status: 'Tốt', variant: 'info' },
  ]
};

// 2. Dữ liệu: 7 ngày qua
const data7Days: DashboardData = {
  stats: {
    stores: '12',
    storesTrend: '+1 trong tuần',
    storesDirection: 'up',
    revenue: '32.6M',
    revenueTrend: '+8% so với tuần trước',
    revenueDirection: 'up',
    users: '920',
    usersTrend: '+140 trong tuần',
    usersDirection: 'up',
    activeRate: '98.2%',
    activeRateTrend: 'Ổn định',
    activeRateDirection: 'neutral',
  },
  alerts: {
    expiring: { text: '2 đối tác hết hạn trong tuần (Wash 24h và CleanPro).', count: 2 },
    pending: { text: '2 giao dịch nạp điểm Zalo Invoice đang chờ kiểm tra.', amount: '600K VNĐ', count: 2 },
    suspended: { text: '1 đối tác tạm ngưng (MER-004 - Giặt Sấy Nhà Tôi).', count: 1 },
  },
  revenueChart: {
    weeks: ['T2', 'T4', 'T6', 'CN'],
    path: 'M 0 180 C 50 160, 100 140, 150 150 C 200 130, 250 90, 300 110 C 350 80, 400 50, 450 65 C 475 70, 500 40, 500 40',
    fillPath: 'M 0 180 C 50 160, 100 140, 150 150 C 200 130, 250 90, 300 110 C 350 80, 400 50, 450 65 C 475 70, 500 40, 500 40 L 500 180 L 0 180 Z',
    points: [{ cx: 150, cy: 150 }, { cx: 300, cy: 110 }, { cx: 450, cy: 65 }, { cx: 500, cy: 40 }],
    trendText: '+8%'
  },
  growthChart: {
    bars: [
      { label: 'T2', val: 25, val2: 10 },
      { label: 'T3', val: 35, val2: 10 },
      { label: 'T4', val: 50, val2: 11 },
      { label: 'T5', val: 45, val2: 11 },
      { label: 'T6', val: 70, val2: 12 },
      { label: 'T7', val: 85, val2: 12 },
      { label: 'CN', val: 95, val2: 12 },
    ],
    trendText: '+1 đối tác mới'
  },
  topStores: [
    { code: 'MER-001', name: 'DUDI Quận 1', count: '92 đơn / tuần', status: 'Xuất sắc', variant: 'success' },
    { code: 'MER-002', name: 'CleanPro Laundry', count: '76 đơn / tuần', status: 'Tốt', variant: 'info' },
    { code: 'MER-003', name: 'Wash 24h', count: '54 đơn / tuần', status: 'Tốt', variant: 'info' },
  ]
};

// 3. Dữ liệu: Tháng này
const dataMonth: DashboardData = {
  stats: {
    stores: '12',
    storesTrend: '+2 tháng này',
    storesDirection: 'up',
    revenue: '128M',
    revenueTrend: '+15% so với tháng trước',
    revenueDirection: 'up',
    users: '3.2K',
    usersTrend: '+320 tháng này',
    usersDirection: 'up',
    activeRate: '98.5%',
    activeRateTrend: 'Ổn định',
    activeRateDirection: 'neutral',
  },
  alerts: {
    expiring: { text: '3 đối tác sắp hết hạn gói Enterprise tuần này.', count: 3 },
    pending: { text: '2 giao dịch nạp điểm Zalo Invoice đang chờ kiểm tra.', amount: '1.5M VNĐ', count: 2 },
    suspended: { text: '1 đối tác tạm ngưng (Giặt Sấy Nhà Tôi - MER-004).', count: 1 },
  },
  revenueChart: {
    weeks: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    path: 'M 0 170 C 50 150, 100 130, 150 140 C 200 150, 250 80, 300 90 C 350 100, 400 40, 450 60 C 475 70, 500 30, 500 30',
    fillPath: 'M 0 170 C 50 150, 100 130, 150 140 C 200 150, 250 80, 300 90 C 350 100, 400 40, 450 60 C 475 70, 500 30, 500 30 L 500 180 L 0 180 Z',
    points: [{ cx: 150, cy: 140 }, { cx: 300, cy: 90 }, { cx: 450, cy: 60 }, { cx: 500, cy: 30 }],
    trendText: '+15%'
  },
  growthChart: {
    bars: [
      { label: 'T2', val: 30, val2: 12 },
      { label: 'T3', val: 45, val2: 18 },
      { label: 'T4', val: 65, val2: 24 },
      { label: 'T5', val: 55, val2: 28 },
      { label: 'T6', val: 80, val2: 36 },
      { label: 'T7', val: 95, val2: 42 },
      { label: 'CN', val: 110, val2: 50 },
    ],
    trendText: '+8 đối tác mới'
  },
  topStores: [
    { code: 'MER-001', name: 'DUDI Quận 1', count: '245 đơn / tháng', status: 'Xuất sắc', variant: 'success' },
    { code: 'MER-002', name: 'CleanPro Laundry', count: '198 đơn / tháng', status: 'Tốt', variant: 'info' },
    { code: 'MER-003', name: 'Wash 24h', count: '156 đơn / tháng', status: 'Tốt', variant: 'info' },
  ]
};

// 4. Dữ liệu: Khoảng ngày ngắn (<= 7 ngày)
const dataRangeShort: DashboardData = {
  ...data7Days,
  stats: {
    ...data7Days.stats,
    revenue: '28.4M',
    revenueTrend: '+6% so với kỳ trước',
    users: '810',
    usersTrend: '+110 trong kỳ',
  }
};

// 5. Dữ liệu: Khoảng ngày trung bình (8 - 31 ngày)
const dataRangeMedium: DashboardData = {
  ...dataMonth,
  stats: {
    ...dataMonth.stats,
    revenue: '110.5M',
    revenueTrend: '+12% so với kỳ trước',
    users: '2.8K',
    usersTrend: '+290 trong kỳ',
  }
};

// 6. Dữ liệu: Khoảng ngày dài (> 31 ngày)
const dataRangeLong: DashboardData = {
  stats: {
    stores: '14',
    storesTrend: '+4 đối tác mới',
    storesDirection: 'up',
    revenue: '385M',
    revenueTrend: '+22% so với kỳ trước',
    revenueDirection: 'up',
    users: '8.5K',
    usersTrend: '+940 trong kỳ',
    usersDirection: 'up',
    activeRate: '98.9%',
    activeRateTrend: 'Tăng trưởng mạnh',
    activeRateDirection: 'up',
  },
  alerts: {
    expiring: { text: '5 đối tác sắp hết hạn gói cần được hỗ trợ gia hạn.', count: 5 },
    pending: { text: '4 giao dịch nạp điểm Zalo Invoice đang chờ kiểm soát.', amount: '3.2M VNĐ', count: 4 },
    suspended: { text: '2 đối tác đang tạm ngưng phục vụ để nâng cấp.', count: 2 },
  },
  revenueChart: {
    weeks: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
    path: 'M 0 180 C 50 140, 100 120, 150 110 C 200 90, 250 80, 300 70 C 350 60, 400 40, 450 30 C 475 25, 500 15, 500 15',
    fillPath: 'M 0 180 C 50 140, 100 120, 150 110 C 200 90, 250 80, 300 70 C 350 60, 400 40, 450 30 C 475 25, 500 15, 500 15 L 500 180 L 0 180 Z',
    points: [{ cx: 150, cy: 110 }, { cx: 300, cy: 70 }, { cx: 450, cy: 30 }, { cx: 500, cy: 15 }],
    trendText: '+22%'
  },
  growthChart: {
    bars: [
      { label: 'Tháng 1', val: 40, val2: 20 },
      { label: 'Tháng 2', val: 55, val2: 25 },
      { label: 'Tháng 3', val: 70, val2: 30 },
      { label: 'Tháng 4', val: 65, val2: 35 },
      { label: 'Tháng 5', val: 85, val2: 40 },
      { label: 'Tháng 6', val: 95, val2: 45 },
      { label: 'Tháng 7', val: 115, val2: 55 },
    ],
    trendText: '+15 đối tác mới'
  },
  topStores: [
    { code: 'MER-001', name: 'DUDI Quận 1', count: '880 đơn / kỳ', status: 'Xuất sắc', variant: 'success' },
    { code: 'MER-002', name: 'CleanPro Laundry', count: '690 đơn / kỳ', status: 'Tốt', variant: 'info' },
    { code: 'MER-003', name: 'Wash 24h', count: '590 đơn / kỳ', status: 'Tốt', variant: 'info' },
  ]
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<'today' | '7days' | 'month' | 'range'>('month');
  const [startDate, setStartDate] = useState('2026-07-15');
  const [endDate, setEndDate] = useState('2026-07-21');
  const [rangeType, setRangeType] = useState<'short' | 'medium' | 'long'>('short');

  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN');
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN'));
      toast('Cập nhật dữ liệu mới nhất thành công!', 'success');
    }, 500);
  };

  const handleApplyRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'error');
      return;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      setRangeType('short');
    } else if (diffDays <= 31) {
      setRangeType('medium');
    } else {
      setRangeType('long');
    }
    toast('Đã áp dụng khoảng ngày!', 'success');
  };

  // Chọn bộ dữ liệu theo bộ lọc thời gian đang active
  const getActiveData = (): DashboardData => {
    if (activeFilter === 'today') return dataToday;
    if (activeFilter === '7days') return data7Days;
    if (activeFilter === 'month') return dataMonth;
    
    // activeFilter === 'range'
    if (rangeType === 'short') return dataRangeShort;
    if (rangeType === 'medium') return dataRangeMedium;
    return dataRangeLong;
  };

  const currentData = getActiveData();

  const columns = [
    { 
      key: 'name', 
      header: 'Tên cửa hàng', 
      render: (row: typeof currentData.topStores[0]) => (
        <span 
          onClick={() => navigate(`/admin/partners/${row.code}`)}
          className="font-bold text-blue-650 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {row.name}
        </span>
      ) 
    },
    { key: 'count', header: 'Hiệu suất' },
    { key: 'status', header: 'Đánh giá', className: 'text-right', render: (row: typeof currentData.topStores[0]) => <StatusBadge label={row.status} variant={row.variant} /> },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16">
      
      {/* Header & Refresh */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <PageHeader
          title="Tổng quan hệ thống"
          description="Giám sát toàn bộ hoạt động của hệ thống DUDI Laundry."
        />
        <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end text-xs text-slate-400 font-semibold self-start md:self-end">
          <span>Cập nhật lần cuối: {lastUpdated}</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-slate-100 hover:bg-slate-200 border-0 rounded-xl text-slate-600 font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Bộ lọc đầu trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs text-left">
        <div className="flex gap-1.5 flex-wrap select-none">
          {(['today', '7days', 'month', 'range'] as const).map((filter) => {
            const labels = {
              today: 'Hôm nay',
              '7days': '7 ngày qua',
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
                    toast(`Đã lọc theo: ${labels[filter]}`, 'info');
                  }
                }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-655 border-slate-250'
                }`}
                style={{
                  backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                  borderColor: isSelected ? '#2563eb' : '#cbd5e1'
                }}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {activeFilter === 'range' && (
          <div className="flex items-center gap-2 flex-wrap animate-fadeIn">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 text-xs font-bold">đến</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleApplyRange}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-sm"
            >
              Áp dụng
            </button>
          </div>
        )}
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div onClick={() => navigate('/admin/partners')} className="cursor-pointer transition-transform hover:scale-101">
          <StatCard
            title="Cửa hàng"
            value={currentData.stats.stores}
            icon={<Building2 size={20} />}
            variant="info"
            trend={{ value: currentData.stats.storesTrend, direction: currentData.stats.storesDirection }}
          />
        </div>
        <div onClick={() => navigate('/admin/transactions')} className="cursor-pointer transition-transform hover:scale-101">
          <StatCard
            title="Tổng doanh thu"
            value={currentData.stats.revenue}
            icon={<DollarSign size={20} />}
            variant="success"
            trend={{ value: currentData.stats.revenueTrend, direction: currentData.stats.revenueDirection }}
          />
        </div>
        <StatCard
          title="Người dùng"
          value={currentData.stats.users}
          icon={<Users size={20} />}
          variant="default"
          trend={{ value: currentData.stats.usersTrend, direction: currentData.stats.usersDirection }}
        />
        <StatCard
          title="Tỉ lệ hoạt động"
          value={currentData.stats.activeRate}
          icon={<Activity size={20} />}
          variant="warning"
          trend={{ value: currentData.stats.activeRateTrend, direction: currentData.stats.activeRateDirection }}
        />
      </div>

      {/* Khối cảnh báo hệ thống */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Đối tác sắp hết hạn */}
        <div className="bg-amber-50/65 border border-amber-250 rounded-2xl p-4.5 text-left flex gap-3 shadow-3xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Đối tác sắp hết hạn</span>
            <span className="text-slate-800 font-extrabold text-sm">{currentData.alerts.expiring.count} đối tác hết hạn</span>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
              {currentData.alerts.expiring.text}
            </p>
            <button 
              onClick={() => navigate('/admin/partners')}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold self-start mt-2 border-0 bg-transparent p-0 cursor-pointer flex items-center gap-1"
            >
              Xem ngay <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Card 2: Thanh toán đang chờ */}
        <div className="bg-blue-50/65 border border-blue-255 rounded-2xl p-4.5 text-left flex gap-3 shadow-3xs">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Clock size={18} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Thanh toán đang chờ</span>
            <span className="text-slate-800 font-extrabold text-sm">{currentData.alerts.pending.amount} chờ đối soát</span>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
              {currentData.alerts.pending.text}
            </p>
            <button 
              onClick={() => navigate('/admin/transactions')}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold self-start mt-2 border-0 bg-transparent p-0 cursor-pointer flex items-center gap-1"
            >
              Duyệt giao dịch <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Card 3: Đối tác tạm ngừng */}
        <div className="bg-red-50/65 border border-red-255 rounded-2xl p-4.5 text-left flex gap-3 shadow-3xs">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <Activity size={18} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Đối tác tạm ngừng</span>
            <span className="text-slate-800 font-extrabold text-sm">{currentData.alerts.suspended.count} đối tác đang tạm ngưng</span>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
              {currentData.alerts.suspended.text}
            </p>
            <button 
              onClick={() => navigate('/admin/partners')}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold self-start mt-2 border-0 bg-transparent p-0 cursor-pointer flex items-center gap-1"
            >
              Xem danh sách <ArrowRight size={11} />
            </button>
          </div>
        </div>

      </div>

      {/* Khối biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Biểu đồ Doanh thu */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm text-left flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Doanh thu theo thời gian</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp size={12} />
              {currentData.revenueChart.trendText}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-450 font-semibold mb-2 animate-none">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Doanh thu thực tế (M VNĐ)</span>
            </div>
          </div>
          
          <div className="w-full flex items-center justify-center py-2">
            <svg key={activeFilter + rangeType} className="w-full h-48 overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Chart Line Path */}
              <path 
                d={currentData.revenueChart.fillPath}
                fill="url(#chartGrad)" 
              />
              <path 
                d={currentData.revenueChart.path}
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              
              {/* Data Points */}
              {currentData.revenueChart.points.map((pt, idx) => (
                <circle key={idx} cx={pt.cx} cy={pt.cy} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {currentData.revenueChart.weeks.map((wk, idx) => (
              <span key={idx}>{wk}</span>
            ))}
          </div>
        </div>

        {/* Biểu đồ Tăng trưởng */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm text-left flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Tăng trưởng đối tác & đơn hàng</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp size={12} />
              {currentData.growthChart.trendText}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-455 font-semibold mb-2">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Đơn hàng hàng ngày (k)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Cửa hàng đăng ký</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-48 pt-6 px-4">
            {currentData.growthChart.bars.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex justify-center gap-1.5 items-end h-36">
                  <div 
                    className="w-2.5 bg-blue-500 rounded-t-xs transition-all duration-500 animate-fadeIn" 
                    style={{ height: `${item.val}%` }}
                    title={`Đơn hàng: ${item.val}`}
                  />
                  <div 
                    className="w-2.5 bg-emerald-500 rounded-t-xs transition-all duration-500 animate-fadeIn" 
                    style={{ height: `${item.val2 * 2}%` }}
                    title={`Đối tác: ${item.val2}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Stores Table */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-foreground text-left">Cửa hàng hoạt động tốt nhất</h2>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <DataTable
            columns={columns}
            rows={currentData.topStores}
          />
        </div>
      </div>

    </div>
  );
}
