import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, AlertTriangle, UserCheck, Settings, ExternalLink } from 'lucide-react';
import {
  PageHeader,
  Button,
  StatusBadge,
  Modal,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface RenewalInfo {
  code: string;
  ownerName: string;
  phone: string;
  tier: string;
  lastRenewedDate: string;
  expiryDate: string;
  renewalCount: number;
  status: 'Đã gia hạn' | 'Sắp hết hạn' | 'Đã quá hạn';
}

const INITIAL_RENEWALS: RenewalInfo[] = [
  {
    code: 'MER-001',
    ownerName: 'Nguyễn Văn An',
    phone: '0901234567',
    tier: 'Pro',
    lastRenewedDate: '01/01/2026',
    expiryDate: '31/12/2026',
    renewalCount: 3,
    status: 'Đã gia hạn'
  },
  {
    code: 'MER-002',
    ownerName: 'Trần Thị Bình',
    phone: '0918765432',
    tier: 'Basic',
    lastRenewedDate: '20/07/2026',
    expiryDate: '30/07/2026',
    renewalCount: 1,
    status: 'Sắp hết hạn'
  },
  {
    code: 'MER-003',
    ownerName: 'Lê Quốc Huy',
    phone: '0987654321',
    tier: 'Enterprise',
    lastRenewedDate: '15/06/2026',
    expiryDate: '15/07/2026',
    renewalCount: 5,
    status: 'Đã quá hạn'
  },
  {
    code: 'MER-004',
    ownerName: 'Phạm Minh Tú',
    phone: '0933334444',
    tier: 'Pro',
    lastRenewedDate: '01/07/2026',
    expiryDate: '01/10/2026',
    renewalCount: 2,
    status: 'Đã gia hạn'
  },
  {
    code: 'MER-005',
    ownerName: 'Hoàng Gia Linh',
    phone: '0905556666',
    tier: 'Basic',
    lastRenewedDate: '10/07/2026',
    expiryDate: '25/07/2026',
    renewalCount: 1,
    status: 'Sắp hết hạn'
  }
];

export default function AdminRenewals() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [renewals, setRenewals] = useState<RenewalInfo[]>(INITIAL_RENEWALS);
  const [selectedTab, setSelectedTab] = useState<'Tất cả' | 'Sắp hết hạn' | 'Đã quá hạn'>('Tất cả');
  const [autoReminder, setAutoReminder] = useState(true);

  // Manual Renewal Modal States
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<RenewalInfo | null>(null);
  const [renewalMonths, setRenewalMonths] = useState<number>(1);

  // Count summaries
  const upcomingCount = renewals.filter(r => r.status === 'Sắp hết hạn').length;
  const overdueCount = renewals.filter(r => r.status === 'Đã quá hạn').length;
  const renewedThisMonthCount = renewals.filter(r => r.status === 'Đã gia hạn').length;

  const handleReminderClick = (partner: RenewalInfo) => {
    toast(`Đã gửi tin nhắn nhắc phí đến số điện thoại ${partner.phone} qua Zalo OA`, 'success');
  };

  const handleManualRenewalClick = (partner: RenewalInfo) => {
    setActivePartner(partner);
    setRenewalMonths(1);
    setManualModalOpen(true);
  };

  const executeManualRenewal = () => {
    if (activePartner) {
      // Calculate new expiry date based on selection (mocked logic)
      const expiryParts = activePartner.expiryDate.split('/');
      let day = parseInt(expiryParts[0], 10);
      let month = parseInt(expiryParts[1], 10);
      let year = parseInt(expiryParts[2], 10);

      month += renewalMonths;
      if (month > 12) {
        year += Math.floor(month / 12);
        month = month % 12 || 12;
      }

      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = month < 10 ? `0${month}` : month;
      const newExpiryDate = `${formattedDay}/${formattedMonth}/${year}`;

      setRenewals(prev =>
        prev.map(r =>
          r.code === activePartner.code
            ? {
                ...r,
                status: 'Đã gia hạn',
                expiryDate: newExpiryDate,
                renewalCount: r.renewalCount + 1,
                lastRenewedDate: new Date().toLocaleDateString('vi-VN')
              }
            : r
        )
      );

      toast(`Gia hạn thành công gói ${activePartner.tier} cho đối tác ${activePartner.ownerName} thêm ${renewalMonths} tháng. Hạn dùng mới: ${newExpiryDate}`, 'success');
      setManualModalOpen(false);
      setActivePartner(null);
    }
  };

  // Tab Filtering
  const filteredRenewals = renewals.filter(r => {
    if (selectedTab === 'Sắp hết hạn') return r.status === 'Sắp hết hạn';
    if (selectedTab === 'Đã quá hạn') return r.status === 'Đã quá hạn';
    return true; // Tất cả lịch sử
  });

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Đã gia hạn': return 'success';
      case 'Sắp hết hạn': return 'warning';
      case 'Đã quá hạn': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12 text-slate-800">
      <PageHeader
        title="Lịch sử gia hạn và nhắc phí"
        description="Theo dõi hạn dùng, lịch sử gia hạn và nhắc phí đối tác."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Gia hạn' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Sắp hết hạn</span>
            <strong className="text-xl font-extrabold text-amber-500">{upcomingCount}</strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Đã quá hạn</span>
            <strong className="text-xl font-extrabold text-red-500">{overdueCount}</strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 animate-pulse">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Đã gia hạn tháng này</span>
            <strong className="text-xl font-extrabold text-emerald-600">{renewedThisMonthCount}</strong>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
            <UserCheck size={18} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Tự động nhắc phí</span>
            <strong className={`text-sm font-extrabold uppercase ${autoReminder ? 'text-blue-600' : 'text-slate-400'}`}>
              {autoReminder ? 'Đang bật' : 'Đang tắt'}
            </strong>
          </div>
          <label className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoReminder}
              onChange={(e) => setAutoReminder(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Auto SMS Config Area */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoReminder}
              onChange={(e) => setAutoReminder(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">
              Tự động gửi tin nhắn nhắc phí trước 7 ngày và 3 ngày khi hết hạn
            </span>
          </label>
          <span className="text-[10px] text-slate-450 pl-6 font-semibold">
            Tin nhắn sẽ gửi qua Zalo OA nếu đối tác đã kết nối.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-1.5 font-bold w-fit">
          <Settings size={14} className="animate-spin-slow" />
          Cấu hình nhắc phí
        </div>
      </div>

      {/* Category Tabs & Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Tab selection panel */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {(['Tất cả lịch sử', 'Sắp hết hạn 1-15 ngày', 'Đã quá hạn'] as const).map((tabText) => {
            const tabVal = tabText === 'Tất cả lịch sử' ? 'Tất cả' : tabText === 'Sắp hết hạn 1-15 ngày' ? 'Sắp hết hạn' : 'Đã quá hạn';
            const isSelected = selectedTab === tabVal;
            return (
              <button
                key={tabText}
                onClick={() => setSelectedTab(tabVal)}
                className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                  isSelected ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tabText}
              </button>
            );
          })}
        </div>

        {/* Custom Renewal List Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-extrabold uppercase border-b border-slate-100 tracking-wider">
              <tr>
                <th className="px-4 py-3">Mã đối tác</th>
                <th className="px-4 py-3">Tên chủ tiệm</th>
                <th className="px-4 py-3">Gói hiện tại</th>
                <th className="px-4 py-3">Ngày gia hạn gần nhất</th>
                <th className="px-4 py-3">Ngày hết hạn</th>
                <th className="px-4 py-3 text-center">Số lần đã gia hạn</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRenewals.map((r) => {
                const isOverdue = r.status === 'Đã quá hạn';
                return (
                  <tr
                    key={r.code}
                    className={`transition-all ${
                      isOverdue
                        ? 'bg-red-50/40 hover:bg-red-50/60 border-l-4 border-l-red-500'
                        : r.status === 'Sắp hết hạn'
                        ? 'bg-amber-50/15 hover:bg-amber-50/30'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-800 select-all">{r.code}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{r.ownerName}</td>
                    <td className="px-4 py-3.5 font-bold">{r.tier}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-500">{r.lastRenewedDate}</td>
                    <td className={`px-4 py-3.5 font-bold ${isOverdue ? 'text-red-650' : 'text-slate-550'}`}>{r.expiryDate}</td>
                    <td className="px-4 py-3.5 text-center font-bold">{r.renewalCount}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge label={r.status} variant={getBadgeVariant(r.status)} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleManualRenewalClick(r)}
                          className="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                        >
                          Gia hạn thủ công
                        </button>
                        <button
                          onClick={() => handleReminderClick(r)}
                          className="px-2 py-1 text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded transition-colors cursor-pointer"
                        >
                          Nhắc phí
                        </button>
                        <button
                          onClick={() => navigate(`/admin/partners/${r.code}`)}
                          className="px-2 py-1 text-[10px] font-bold text-slate-650 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer flex items-center gap-0.5"
                        >
                          Xem chi tiết
                          <ExternalLink size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRenewals.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-semibold bg-white">
                    Không có dữ liệu gia hạn phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footnote notes constraint */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-450 font-semibold flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Lịch sử gia hạn được lưu giữ vĩnh viễn để phục vụ đối soát tài chính.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Mỗi ngày chỉ nên gửi nhắc phí thủ công tối đa 1 lần/đối tác.</span>
          </div>
        </div>
      </div>

      {/* Manual Renewal Modal */}
      <Modal
        isOpen={manualModalOpen}
        onClose={() => {
          setManualModalOpen(false);
          setActivePartner(null);
        }}
        title="Gia hạn gói dịch vụ thủ công"
        size="md"
      >
        {activePartner && (
          <div className="flex flex-col gap-4 text-xs text-slate-800">
            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Đối tác:</span>
                <strong className="text-slate-800 font-extrabold">{activePartner.ownerName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Mã đối tác:</span>
                <strong className="text-slate-800 font-extrabold">{activePartner.code}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Gói dịch vụ hiện tại:</span>
                <span className="font-bold text-blue-600">{activePartner.tier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Ngày hết hạn hiện tại:</span>
                <span className="font-bold text-red-650">{activePartner.expiryDate}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-slate-700">Chọn số tháng gia hạn *</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRenewalMonths(m)}
                    className={`py-2 px-3 border rounded-xl text-center cursor-pointer font-bold transition-all text-xs ${
                      renewalMonths === m
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m} tháng
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setManualModalOpen(false);
                  setActivePartner(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={executeManualRenewal}
              >
                Xác nhận gia hạn
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
