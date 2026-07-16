import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, Download } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  DataTable,
  FilterBar,
  Select,
  ConfirmDialog,
  Modal,
} from '../../components/common';
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

const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'Hoàn tất': return 'success';
    case 'Đang chờ': return 'warning';
    case 'Đang chờ quá 48h': return 'error';
    case 'Đã hủy': return 'default';
    default: return 'default';
  }
};

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

    // Date range filter
    let matchesDate = true;
    if (startDate) {
      // Convert transaction time (DD/MM/YYYY HH:MM) to date object
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

    return matchesSearch && matchesMethod && matchesType && matchesStatus && matchesDate;
  });

  const columns = [
    {
      key: 'code',
      header: 'Mã giao dịch',
      render: (row: Transaction) => <span className="font-extrabold text-slate-800">{row.code}</span>
    },
    {
      key: 'time',
      header: 'Thời gian',
      render: (row: Transaction) => <span className="text-slate-500 font-semibold">{row.time}</span>
    },
    {
      key: 'partnerName',
      header: 'Tên đối tác',
      render: (row: Transaction) => (
        <button
          onClick={() => navigate(`/admin/partners/${row.partnerCode}`)}
          className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left cursor-pointer"
        >
          {row.partnerName}
        </button>
      )
    },
    {
      key: 'content',
      header: 'Nội dung',
      render: (row: Transaction) => <span className="font-medium text-slate-650">{row.content}</span>
    },
    {
      key: 'method',
      header: 'Phương thức',
      render: (row: Transaction) => <span className="text-slate-500 font-bold">{row.method}</span>
    },
    {
      key: 'type',
      header: 'Loại giao dịch',
      render: (row: Transaction) => {
        if (row.type === 'Nâng cấp gói') {
          return <StatusBadge label={row.type} variant="info" />;
        }
        return <span className="font-bold text-slate-650">{row.type}</span>;
      }
    },
    {
      key: 'amount',
      header: 'Số tiền',
      className: 'text-right font-extrabold',
      render: (row: Transaction) => (
        <span className={row.amount < 0 ? 'text-red-600' : 'text-slate-800'}>
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: Transaction) => <StatusBadge label={row.status} variant={getStatusVariant(row.status)} />
    },
    {
      key: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      render: (row: Transaction) => {
        const isPending = row.status === 'Đang chờ' || row.status === 'Đang chờ quá 48h';
        const isCompleted = row.status === 'Hoàn tất' && row.amount > 0; // Negative amounts represent refunds and cannot be refunded again

        return (
          <div className="flex justify-end gap-1">
            <button
              onClick={() => handleViewInvoice(row)}
              className="px-2 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
            >
              Xem hóa đơn
            </button>
            {isPending && (
              <button
                onClick={() => handleCollectClick(row)}
                className="px-2 py-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
              >
                Xác nhận đã thu tiền
              </button>
            )}
            {isCompleted && (
              <button
                onClick={() => handleRefundClick(row)}
                className="px-2 py-1 text-[11px] font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded transition-colors cursor-pointer"
              >
                Hoàn tiền
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header section with export options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <PageHeader
          title="Quản lý doanh thu và thanh toán"
          description="Theo dõi doanh thu, giao dịch và các khoản thanh toán của đối tác."
          breadcrumb={[
            { label: 'Hệ thống', to: '/admin/dashboard' },
            { label: 'Tài chính' },
          ]}
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')} className="flex items-center gap-1.5 text-xs font-bold">
            <Download size={14} />
            Xuất Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} className="flex items-center gap-1.5 text-xs font-bold">
            <Download size={14} />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards with Mini trend SVG line chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Tổng doanh thu</span>
            <strong className="text-xl font-extrabold text-slate-800">128.000.000đ</strong>
          </div>
          {/* SVG sparkline chart */}
          <svg className="w-16 h-8 text-emerald-500 shrink-0" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 0 25 Q 15 12 30 20 T 60 5 T 90 15 T 100 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Doanh thu tháng này</span>
          <strong className="text-xl font-extrabold text-slate-800">18.500.000đ</strong>
          <span className="text-[9px] text-emerald-600 font-bold mt-1">↑ +12.4% so với tháng trước</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Giao dịch chờ xử lý</span>
          <strong className="text-xl font-extrabold text-amber-500">3</strong>
          <span className="text-[9px] text-slate-400 font-semibold mt-1">Yêu cầu cần Platform Admin duyệt</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Chưa thanh toán</span>
          <strong className="text-xl font-extrabold text-red-500">2</strong>
          <span className="text-[9px] text-red-600 font-bold mt-1">Yêu cầu nâng cấp/gia hạn chưa trả tiền</span>
        </div>
      </div>

      {/* Advanced Filter section */}
      <FilterBar onClear={() => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setSelectedMethod('Tất cả');
        setSelectedType('Tất cả');
        setSelectedStatus('Tất cả');
      }} showClear={!!search || !!startDate || !!endDate || selectedMethod !== 'Tất cả' || selectedType !== 'Tất cả' || selectedStatus !== 'Tất cả'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Từ khóa</label>
            <input
              type="text"
              placeholder="Đối tác hoặc Mã giao dịch..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-700 focus:border-blue-500 font-semibold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Từ ngày</label>
            <input
              type="date"
              className="w-full px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-750 focus:border-blue-500 font-semibold h-[30px]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Đến ngày</label>
            <input
              type="date"
              className="w-full px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none text-slate-750 focus:border-blue-500 font-semibold h-[30px]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Phương thức</label>
            <Select
              options={['Tất cả', 'Chuyển khoản', 'Ví điện tử', 'Tiền mặt']}
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="py-1 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Loại GD</label>
            <Select
              options={['Tất cả', 'Đăng ký mới', 'Gia hạn', 'Nâng cấp gói']}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-1 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Trạng thái</label>
            <Select
              options={['Tất cả', 'Hoàn tất', 'Đang chờ', 'Đang chờ quá 48h', 'Đã hủy']}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1 text-xs"
            />
          </div>
        </div>
      </FilterBar>

      {/* Transaction Table */}
      <DataTable
        columns={columns}
        rows={filteredTransactions}
        emptyState={
          <div className="text-sm font-semibold text-muted py-6">
            Không tìm thấy giao dịch nào phù hợp.
          </div>
        }
      />

      {/* Confirm Collect Dialog */}
      <ConfirmDialog
        isOpen={confirmCollectOpen}
        onClose={() => setConfirmCollectOpen(false)}
        onConfirm={handleConfirmCollect}
        title="Xác nhận thanh toán"
        variant="primary"
        message={`Bạn có chắc chắn xác nhận đã thu đủ số tiền cho giao dịch ${activeTxn?.code} từ đối tác ${activeTxn?.partnerName}?`}
      />

      {/* Collect Success Modal */}
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
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 leading-snug">Xác nhận giao dịch thành công</h4>
            <p className="text-xs text-slate-600 font-bold mt-3 leading-relaxed">
              Thanh toán thành công. Gói dịch vụ của bạn đã được gia hạn đến ngày 15/08/2026
            </p>
            <p className="text-[10px] text-slate-400 font-semibold mt-3 bg-slate-50 p-2.5 border border-slate-100 rounded-xl">
              Đã gửi thông báo Zalo/Email cho chủ tiệm.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCollectSuccessOpen(false);
                setActiveTxn(null);
              }}
              className="w-full"
            >
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Refund Dialog */}
      <ConfirmDialog
        isOpen={confirmRefundOpen}
        onClose={() => setConfirmRefundOpen(false)}
        onConfirm={handleConfirmRefund}
        title="Xác nhận hoàn tiền"
        variant="danger"
        message={`Bạn có chắc chắn muốn hoàn tiền cho giao dịch ${txnToRefund?.code} của đối tác ${txnToRefund?.partnerName}? Thao tác này sẽ tạo một giao dịch âm đối chiếu.`}
      />

      {/* View Invoice Modal */}
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
          <div className="flex flex-col gap-4 text-xs text-slate-800">
            <div className="flex flex-col items-center gap-1 border-b border-slate-100 pb-3 text-center">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Hóa đơn thanh toán</h4>
              <span className="text-[10px] text-slate-400 font-semibold">DUDI Laundry Platform Management</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 py-2 border-b border-slate-100 text-slate-600">
              <span className="font-bold">Mã giao dịch:</span>
              <strong className="text-slate-800 text-right">{invoiceTxn.code}</strong>
              
              <span className="font-bold">Thời gian:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.time}</span>
              
              <span className="font-bold">Đối tác:</span>
              <strong className="text-slate-800 text-right">{invoiceTxn.partnerName}</strong>
              
              <span className="font-bold">Nội dung:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.content}</span>
              
              <span className="font-bold">Phương thức:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.method}</span>
              
              <span className="font-bold">Loại giao dịch:</span>
              <span className="text-slate-700 text-right">{invoiceTxn.type}</span>
              
              <span className="font-bold">Trạng thái:</span>
              <span className="text-right">
                <StatusBadge label={invoiceTxn.status} variant={getStatusVariant(invoiceTxn.status)} />
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 text-sm">
              <span className="font-extrabold text-slate-800 text-xs uppercase">Tổng thanh toán:</span>
              <strong className="text-blue-600 font-extrabold text-base">{formatCurrency(invoiceTxn.amount)}</strong>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setInvoiceModalOpen(false)}>
                Đóng
              </Button>
              <Button variant="primary" size="sm" onClick={() => toast('Bắt đầu in hóa đơn...', 'info')}>
                In hóa đơn
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
