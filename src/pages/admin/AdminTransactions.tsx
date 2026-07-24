import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, Download, Search, ArrowUpRight } from 'lucide-react';
import { ConfirmDialog, Modal } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Transaction {
  code: string;
  time: string;
  partnerName: string;
  partnerCode: string;
  content: string;
  method: string;
  type: string;
  amount: number;
  status: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    code: 'TXN-001',
    time: '15/07/2026 09:00',
    partnerName: 'DUDI Quận 1',
    partnerCode: 'MER-001',
    content: 'Gia hạn gói Pro 12 tháng',
    method: 'Chuyển khoản',
    type: 'Gia hạn',
    amount: 6000000,
    status: 'Hoàn tất'
  },
  {
    code: 'TXN-002',
    time: '15/07/2026 10:30',
    partnerName: 'CleanPro Laundry',
    partnerCode: 'MER-002',
    content: 'Đăng ký mới gói Basic',
    method: 'Ví điện tử',
    type: 'Đăng ký mới',
    amount: 499000,
    status: 'Đang chờ'
  },
  {
    code: 'TXN-003',
    time: '14/07/2026 14:00',
    partnerName: 'Wash 24h',
    partnerCode: 'MER-003',
    content: 'Nâng cấp Enterprise',
    method: 'Chuyển khoản',
    type: 'Nâng cấp gói',
    amount: 4999000,
    status: 'Đang chờ quá 48h'
  },
  {
    code: 'TXN-004',
    time: '13/07/2026 16:20',
    partnerName: 'FreshCare',
    partnerCode: 'MER-005',
    content: 'Gia hạn Basic',
    method: 'Tiền mặt',
    type: 'Gia hạn',
    amount: 499000,
    status: 'Đã hủy'
  },
  {
    code: 'TXN-005',
    time: '12/07/2026 08:15',
    partnerName: 'Giặt Sấy Nhà Tôi',
    partnerCode: 'MER-004',
    content: 'Nâng cấp Pro',
    method: 'Chuyển khoản',
    type: 'Nâng cấp gói',
    amount: 1499000,
    status: 'Hoàn tất'
  }
];

const formatCurrency = (val: number): string => {
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const formatted = absVal.toLocaleString('vi-VN') + 'đ';
  return isNegative ? `-${formatted}` : formatted;
};

export default function AdminTransactions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dudi_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Advanced Filters State
  const [search, setSearch] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Tất cả');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('Tất cả');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  // Confirmation dialogs
  const [confirmCollectOpen, setConfirmCollectOpen] = useState(false);
  const [activeTxn, setActiveTxn] = useState<Transaction | null>(null);
  const [collectSuccessOpen, setCollectSuccessOpen] = useState(false);

  const [confirmRefundOpen, setConfirmRefundOpen] = useState(false);
  const [txnToRefund, setTxnToRefund] = useState<Transaction | null>(null);

  // Invoice view modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceTxn, setInvoiceTxn] = useState<Transaction | null>(null);

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('dudi_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleCollectClick = (txn: Transaction) => {
    setActiveTxn(txn);
    setConfirmCollectOpen(true);
  };

  const handleConfirmCollect = () => {
    if (activeTxn) {
      setTransactions(prev =>
        prev.map(t => (t.code === activeTxn.code ? { ...t, status: 'Hoàn tất' } : t))
      );
      setConfirmCollectOpen(false);
      setCollectSuccessOpen(true);
    }
  };

  const handleRefundClick = (txn: Transaction) => {
    setTxnToRefund(txn);
    setConfirmRefundOpen(true);
  };

  const handleConfirmRefund = () => {
    if (txnToRefund) {
      const refundTxn: Transaction = {
        code: `REFUND-${txnToRefund.code}`,
        time: new Date().toLocaleString('vi-VN'),
        partnerName: txnToRefund.partnerName,
        partnerCode: txnToRefund.partnerCode,
        content: `Hoàn tiền: ${txnToRefund.content}`,
        method: txnToRefund.method,
        type: txnToRefund.type,
        amount: -txnToRefund.amount,
        status: 'Hoàn tất'
      };

      setTransactions(prev => [refundTxn, ...prev]);
      toast(`Đã thực hiện hoàn tiền cho giao dịch ${txnToRefund.code}.`, 'success');
      setConfirmRefundOpen(false);
      setTxnToRefund(null);
    }
  };

  const handleViewInvoice = (txn: Transaction) => {
    setInvoiceTxn(txn);
    setInvoiceModalOpen(true);
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    toast(`Báo cáo ${format} đang được tạo trong nền. Bạn sẽ nhận được thông báo tải về khi hoàn tất.`, 'info');
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.partnerName.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = selectedMethod === 'Tất cả' || t.method === selectedMethod;
    const matchesType = selectedType === 'Tất cả' || t.type === selectedType;
    const matchesStatus = selectedStatus === 'Tất cả' || t.status === selectedStatus;

    // Date / Time filter logic
    let matchesDate = true;
    if (selectedTimeFilter === 'Hôm nay') {
      matchesDate = t.time.startsWith('15/07/2026');
    } else if (selectedTimeFilter === '7 ngày') {
      const tDateParts = t.time.split(' ')[0].split('/');
      const day = parseInt(tDateParts[0], 10);
      matchesDate = day >= 9 && day <= 15 && tDateParts[1] === '07';
    } else if (selectedTimeFilter === 'Tháng này') {
      matchesDate = t.time.includes('/07/2026');
    } else if (selectedTimeFilter === 'Tháng trước') {
      matchesDate = t.time.includes('/06/2026');
    } else if (selectedTimeFilter === 'Tùy chọn') {
      if (startDate) {
        const tDateParts = t.time.split(' ')[0].split('/');
        const tDate = new Date(parseInt(tDateParts[2]), parseInt(tDateParts[1]) - 1, parseInt(tDateParts[0]));
        const sDate = new Date(startDate);
        matchesDate = matchesDate && tDate >= sDate;
      }
      if (endDate) {
        const tDateParts = t.time.split(' ')[0].split('/');
        const tDate = new Date(parseInt(tDateParts[2]), parseInt(tDateParts[1]) - 1, parseInt(tDateParts[0]));
        const eDate = new Date(endDate);
        matchesDate = matchesDate && tDate <= eDate;
      }
    }

    return matchesSearch && matchesMethod && matchesType && matchesStatus && matchesDate;
  });

  // Calculate Cashflow Health metrics from current transactions
  const totalCollected = transactions
    .filter(t => t.status === 'Hoàn tất' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter(t => t.status === 'Đang chờ')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOverdue = transactions
    .filter(t => t.status === 'Đang chờ quá 48h')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalAdjusted = transactions
    .filter(t => t.status === 'Đã hủy' || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const isFilterActive =
    !!search ||
    selectedTimeFilter !== 'Tất cả' ||
    !!startDate ||
    !!endDate ||
    selectedMethod !== 'Tất cả' ||
    selectedType !== 'Tất cả' ||
    selectedStatus !== 'Tất cả';

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

      {/* 1. HEADER (No heavy hero, clean export actions) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            FINANCE & RECONCILIATION
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý doanh thu và thanh toán
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Download size={13} className="text-slate-500" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-lg text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Download size={13} className="text-slate-500" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* 2. KHỐI TỔNG QUAN TÀI CHÍNH (Financial Summary Strip - Soft Pastel Backgrounds) */}
      <section className="w-full bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Tổng doanh thu (Nổi bật nhất, số lớn) */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-wider">TỔNG DOANH THU</span>
            <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">128.000.000đ</span>
            <span className="text-[11px] font-bold text-blue-700 mt-1 flex items-center gap-1">
              <ArrowUpRight size={13} /> Toàn bộ hệ thống DUDI
            </span>
          </div>

          {/* Card 2: Doanh thu tháng này */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">DOANH THU THÁNG NÀY</span>
            <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">18.500.000đ</span>
            <span className="text-[11px] font-bold text-emerald-700 mt-1">↑ +12.4% so với tháng trước</span>
          </div>

          {/* Card 3: Giao dịch chờ xử lý (Accent Amber) */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">GIAO DỊCH CHỜ XỬ LÝ</span>
            <span className="text-2xl md:text-3xl font-black text-amber-700 tracking-tight">3</span>
            <span className="text-[11px] font-bold text-amber-800 mt-1">Yêu cầu cần Admin duyệt</span>
          </div>

          {/* Card 4: Chưa thanh toán (Accent Red) */}
          <div className="bg-red-50/60 border border-red-200 rounded-lg p-4 flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider">CHƯA THANH TOÁN</span>
            <span className="text-2xl md:text-3xl font-black text-red-700 tracking-tight">2</span>
            <span className="text-[11px] font-bold text-red-800 mt-1">Yêu cầu gia hạn/nâng cấp chưa trả tiền</span>
          </div>

        </div>
      </section>

      {/* 3. TÌNH TRẠNG DÒNG TIỀN (Cashflow Health Strip directly below summary) */}
      <section className="w-full bg-white border border-[#DCE5F0] rounded-xl p-4 md:p-5 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            TÌNH TRẠNG DÒNG TIỀN (REALTIME CASHFLOW HEALTH)
          </span>
          <span className="text-[10px] font-bold text-slate-400">ĐỐI SOÁT TỰ ĐỘNG</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          {/* Đã thu */}
          <div className="flex flex-col gap-1 bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Đã thu</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <strong className="text-sm font-black text-slate-900">{formatCurrency(totalCollected)}</strong>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-emerald-500 h-full w-[85%]"></div>
            </div>
          </div>

          {/* Đang chờ xác nhận */}
          <div className="flex flex-col gap-1 bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Đang chờ xác nhận</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <strong className="text-sm font-black text-amber-700">{formatCurrency(totalPending)}</strong>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-amber-500 h-full w-[40%]"></div>
            </div>
          </div>

          {/* Quá hạn */}
          <div className="flex flex-col gap-1 bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Quá hạn (&gt;48h)</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <strong className="text-sm font-black text-red-700">{formatCurrency(totalOverdue)}</strong>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-red-500 h-full w-[65%]"></div>
            </div>
          </div>

          {/* Hoàn / Điều chỉnh */}
          <div className="flex flex-col gap-1 bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Hoàn / Điều chỉnh</span>
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            </div>
            <strong className="text-sm font-black text-slate-700">{formatCurrency(totalAdjusted)}</strong>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-slate-400 h-full w-[15%]"></div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FINANCE TOOLBAR (Compact Professional Filter Bar) */}
      <div className="bg-white border border-[#DCE5F0] rounded-lg p-3 shadow-2xs flex flex-col gap-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          
          {/* Keyword Search */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Từ khóa</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Đối tác hoặc mã GD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md pl-8 pr-2 py-1.5 outline-none transition-all"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Time Filter Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian</label>
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'Hôm nay', '7 ngày', 'Tháng này', 'Tháng trước', 'Tùy chọn'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Method */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phương thức</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'Chuyển khoản', 'Ví điện tử', 'Tiền mặt'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại GD</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'Đăng ký mới', 'Gia hạn', 'Nâng cấp gói'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-bold rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              {['Tất cả', 'Hoàn tất', 'Đang chờ', 'Đang chờ quá 48h', 'Đã hủy'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Custom Date Range Pickers (Only visible when selectedTimeFilter === 'Tùy chọn') */}
        {selectedTimeFilter === 'Tùy chọn' && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Từ ngày:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md px-2.5 py-1 outline-none cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Đến ngày:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md px-2.5 py-1 outline-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Clear filter button (Only visible when filter active) */}
        {isFilterActive && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedTimeFilter('Tất cả');
                setStartDate('');
                setEndDate('');
                setSelectedMethod('Tất cả');
                setSelectedType('Tất cả');
                setSelectedStatus('Tất cả');
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-red-600 bg-transparent border-0 cursor-pointer p-0"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* 5. TRANSACTION TABLE (Enterprise Sharp Table with Status Dots & Highlights) */}
      <div className="bg-white border border-[#DCE5F0] rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Mã giao dịch</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Tên đối tác</th>
                <th className="py-3 px-4">Nội dung</th>
                <th className="py-3 px-4">Phương thức</th>
                <th className="py-3 px-4">Loại GD</th>
                <th className="py-3 px-4 text-right">Số tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((row) => {
                  const isPending48h = row.status === 'Đang chờ quá 48h';
                  const isPending = row.status === 'Đang chờ';
                  const isCompleted = row.status === 'Hoàn tất';

                  // Row background styling
                  let rowBgClass = 'bg-white hover:bg-slate-50/80';
                  if (isPending48h) {
                    rowBgClass = 'bg-red-50/40 hover:bg-red-50/70';
                  } else if (isPending) {
                    rowBgClass = 'bg-amber-50/30 hover:bg-amber-50/60';
                  }

                  return (
                    <tr
                      key={row.code}
                      className={`${rowBgClass} transition-colors duration-150 font-medium text-slate-800`}
                    >
                      {/* 1. Mã giao dịch */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {row.code}
                      </td>

                      {/* 2. Thời gian */}
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {row.time}
                      </td>

                      {/* 3. Tên đối tác */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/partners/${row.partnerCode}`)}
                          className="font-bold text-[#2563EB] hover:underline transition-colors text-left cursor-pointer border-0 bg-transparent p-0"
                        >
                          {row.partnerName}
                        </button>
                      </td>

                      {/* 4. Nội dung */}
                      <td className="py-3 px-4 text-slate-700">
                        {row.content}
                      </td>

                      {/* 5. Phương thức */}
                      <td className="py-3 px-4 text-slate-600 font-semibold">
                        {row.method}
                      </td>

                      {/* 6. Loại giao dịch */}
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {row.type}
                        </span>
                      </td>

                      {/* 7. Số tiền */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={row.amount < 0 ? 'text-red-600' : 'text-slate-900'}>
                          {formatCurrency(row.amount)}
                        </span>
                      </td>

                      {/* 8. Trạng thái (Dot + Label) */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : isPending48h
                                ? 'bg-red-500 animate-pulse'
                                : isPending
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          ></span>
                          <span
                            className={
                              isCompleted
                                ? 'text-emerald-700'
                                : isPending48h
                                ? 'text-red-700'
                                : isPending
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }
                          >
                            {row.status}
                          </span>
                        </span>
                      </td>

                      {/* 9. Thao tác (Clean Action Hierarchy) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewInvoice(row)}
                            className="text-[#2563EB] hover:underline font-bold text-xs bg-transparent border-0 cursor-pointer p-0"
                          >
                            Xem hóa đơn
                          </button>

                          {(isPending || isPending48h) && (
                            <button
                              type="button"
                              onClick={() => handleCollectClick(row)}
                              className="px-2.5 py-1 text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white rounded transition-colors cursor-pointer border-0 shadow-2xs"
                            >
                              Xác nhận đã thu tiền
                            </button>
                          )}

                          {isCompleted && row.amount > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRefundClick(row)}
                              className="px-2 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors cursor-pointer"
                            >
                              Hoàn tiền
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-slate-400 font-semibold">
                    Không tìm thấy giao dịch nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM COLLECT DIALOG */}
      <ConfirmDialog
        isOpen={confirmCollectOpen}
        onClose={() => setConfirmCollectOpen(false)}
        onConfirm={handleConfirmCollect}
        title="Xác nhận thanh toán"
        variant="primary"
        message={`Bạn có chắc chắn xác nhận đã thu đủ số tiền cho giao dịch ${activeTxn?.code} từ đối tác ${activeTxn?.partnerName}?`}
      />

      {/* COLLECT SUCCESS MODAL */}
      <Modal
        isOpen={collectSuccessOpen}
        onClose={() => {
          setCollectSuccessOpen(false);
          setActiveTxn(null);
        }}
        title="Thông báo thanh toán"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-center py-2 text-slate-800">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 leading-snug">Xác nhận giao dịch thành công</h4>
            <p className="text-xs text-slate-600 font-bold mt-2 leading-relaxed">
              Thanh toán thành công. Gói dịch vụ của bạn đã được gia hạn đến ngày 15/08/2026.
            </p>
            <p className="text-[10px] text-slate-500 font-semibold mt-3 bg-slate-50 p-2.5 border border-slate-200 rounded-md">
              Đã gửi thông báo Zalo/Email cho chủ tiệm.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setCollectSuccessOpen(false);
                setActiveTxn(null);
              }}
              className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md border-0 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRM REFUND DIALOG */}
      <ConfirmDialog
        isOpen={confirmRefundOpen}
        onClose={() => setConfirmRefundOpen(false)}
        onConfirm={handleConfirmRefund}
        title="Xác nhận hoàn tiền"
        variant="danger"
        message={`Bạn có chắc chắn muốn hoàn tiền cho giao dịch ${txnToRefund?.code} của đối tác ${txnToRefund?.partnerName}? Thao tác này sẽ tạo một giao dịch âm đối chiếu.`}
      />

      {/* VIEW INVOICE MODAL */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => {
          setInvoiceModalOpen(false);
          setInvoiceTxn(null);
        }}
        title={`Hóa đơn ${invoiceTxn?.code}`}
        size="md"
      >
        {invoiceTxn && (
          <div className="flex flex-col gap-4 text-xs text-slate-800 text-left">
            <div className="flex flex-col items-center gap-1 border-b border-[#DCE5F0] pb-3 text-center">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">HÓA ĐƠN THANH TOÁN</h4>
              <span className="text-[10px] text-slate-400 font-mono">DUDI LAUNDRY PLATFORM MANAGEMENT</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2.5 py-2 border-b border-[#DCE5F0] text-slate-600">
              <span className="font-bold">Mã giao dịch:</span>
              <strong className="text-slate-900 text-right font-mono">{invoiceTxn.code}</strong>
              
              <span className="font-bold">Thời gian:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.time}</span>
              
              <span className="font-bold">Đối tác:</span>
              <strong className="text-slate-900 text-right">{invoiceTxn.partnerName}</strong>
              
              <span className="font-bold">Nội dung:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.content}</span>
              
              <span className="font-bold">Phương thức:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.method}</span>
              
              <span className="font-bold">Loại giao dịch:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.type}</span>
              
              <span className="font-bold">Trạng thái:</span>
              <span className="text-right font-bold text-emerald-600">{invoiceTxn.status}</span>
            </div>

            <div className="flex justify-between items-center pt-2 text-sm">
              <span className="font-black text-slate-900 text-xs uppercase">TỔNG THANH TOÁN:</span>
              <strong className="text-[#2563EB] font-black text-base font-mono">{formatCurrency(invoiceTxn.amount)}</strong>
            </div>

            <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-[#DCE5F0]">
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer border-0"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => toast('Bắt đầu in hóa đơn...', 'info')}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs"
              >
                In hóa đơn
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
