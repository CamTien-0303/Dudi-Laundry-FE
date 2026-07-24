import { useState } from 'react';
import {
  Package,
  Plus,
  History,
  UserCheck,
  Search,
  Filter,
  Clock,
  Settings,
  SlidersHorizontal
} from 'lucide-react';
import { Modal, Drawer } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface InventoryLog {
  id: string;
  date: string;
  type: 'Nhập kho' | 'Xuất kho' | 'Điều chỉnh' | 'Tự động theo đơn hàng';
  quantity: number;
  stockAfter: number;
  operator: string;
  reason: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'Hóa chất' | 'Bao bì' | 'Phụ kiện khác';
  unit: string;
  currentStock: number;
  minStock: number;
  costPrice: number;
  history: InventoryLog[];
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'VT-001',
    name: 'Nước giặt',
    category: 'Hóa chất',
    unit: 'Can 20L',
    currentStock: 8,
    minStock: 3,
    costPrice: 400000,
    history: [
      { id: 'L-101', date: '2026-07-10 09:00', type: 'Nhập kho', quantity: 5, stockAfter: 8, operator: 'Nguyễn Văn A', reason: 'Nhập hàng định kỳ tháng 7' },
      { id: 'L-102', date: '2026-07-15 11:30', type: 'Tự động theo đơn hàng', quantity: -1, stockAfter: 7, operator: 'Hệ thống', reason: 'Tự động trừ theo đơn hàng #101' },
      { id: 'L-103', date: '2026-07-16 16:45', type: 'Nhập kho', quantity: 1, stockAfter: 8, operator: 'Nguyễn Văn A', reason: 'Bổ sung khẩn cấp' }
    ]
  },
  {
    id: 'VT-002',
    name: 'Nước xả',
    category: 'Hóa chất',
    unit: 'Lít',
    currentStock: 12,
    minStock: 10,
    costPrice: 35000,
    history: [
      { id: 'L-201', date: '2026-07-08 10:00', type: 'Nhập kho', quantity: 20, stockAfter: 20, operator: 'Lê Hoài Nam', reason: 'Nhập từ nhà phân phối Comfort' },
      { id: 'L-202', date: '2026-07-12 14:15', type: 'Xuất kho', quantity: -8, stockAfter: 12, operator: 'Trần Thị Bình', reason: 'Xuất dùng cho chi nhánh A' }
    ]
  },
  {
    id: 'VT-003',
    name: 'Túi đóng gói',
    category: 'Bao bì',
    unit: 'Cái',
    currentStock: 150,
    minStock: 50,
    costPrice: 1500,
    history: [
      { id: 'L-301', date: '2026-07-05 08:30', type: 'Nhập kho', quantity: 200, stockAfter: 200, operator: 'Nguyễn Văn A', reason: 'Nhập bao bì lô mới' },
      { id: 'L-302', date: '2026-07-14 17:00', type: 'Tự động theo đơn hàng', quantity: -50, stockAfter: 150, operator: 'Hệ thống', reason: 'Tự động trừ theo đơn hàng #102, #103' }
    ]
  },
  {
    id: 'VT-004',
    name: 'Móc áo',
    category: 'Phụ kiện khác',
    unit: 'Cái',
    currentStock: 0,
    minStock: 20,
    costPrice: 3000,
    history: [
      { id: 'L-401', date: '2026-06-30 09:30', type: 'Nhập kho', quantity: 50, stockAfter: 50, operator: 'Lê Hoài Nam', reason: 'Bổ sung móc nhựa' },
      { id: 'L-402', date: '2026-07-11 15:00', type: 'Xuất kho', quantity: -50, stockAfter: 0, operator: 'Trần Thị Bình', reason: 'Xuất móc treo phục vụ đơn hàng giặt ủi sấy khô lớn' }
    ]
  },
  {
    id: 'VT-005',
    name: 'Tem đơn hàng',
    category: 'Bao bì',
    unit: 'Cuộn',
    currentStock: 4,
    minStock: 5,
    costPrice: 25000,
    history: [
      { id: 'L-501', date: '2026-07-01 11:00', type: 'Nhập kho', quantity: 10, stockAfter: 10, operator: 'Nguyễn Văn A', reason: 'Nhập văn phòng phẩm' },
      { id: 'L-502', date: '2026-07-16 10:30', type: 'Xuất kho', quantity: -6, stockAfter: 4, operator: 'Trần Thị Bình', reason: 'Xuất sử dụng dán thẻ đơn hàng' }
    ]
  }
];

export default function StoreInventory() {
  const { toast } = useToast();

  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tất cả');

  const [isLaundryStaff, setIsLaundryStaff] = useState(false);
  const [autoDeduct, setAutoDeduct] = useState(true);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [importItemId, setImportItemId] = useState('VT-001');
  const [importQty, setImportQty] = useState<number>(5);
  const [importCost, setImportCost] = useState<number>(400000);
  const [importSupplier, setImportSupplier] = useState('');
  const [importNotes, setImportNotes] = useState('');

  const [actionItemId, setActionItemId] = useState('VT-001');
  const [actionType, setActionType] = useState<'export' | 'adjust'>('export');
  const [actionQty, setActionQty] = useState<number>(1);
  const [actionNotes, setActionNotes] = useState('');
  const [reconcileReason, setReconcileReason] = useState('');
  
  const [exportError, setExportError] = useState('');
  const [reconcileError, setReconcileError] = useState('');

  const selectedItemForHistory = items.find(i => i.id === selectedItemId) || null;
  const activeImportItem = items.find(i => i.id === importItemId) || items[0];
  const activeActionItem = items.find(i => i.id === actionItemId) || items[0];

  const lowStockCount = items.filter(i => i.currentStock <= i.minStock).length;
  const totalValue = items.reduce((sum, i) => sum + i.currentStock * i.costPrice, 0);

  const filteredItems = items.filter(i => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      i.name.toLowerCase().includes(query) ||
      i.id.toLowerCase().includes(query);

    if (categoryFilter === 'Tất cả') return matchesSearch;
    return matchesSearch && i.category === categoryFilter;
  });

  const getConversionMessage = (itemId: string) => {
    if (itemId === 'VT-001') {
      return 'Quy tắc quy đổi: 1 Can 20L = 20 Lít. Vui lòng nhập số lượng theo đơn vị Can.';
    }
    return null;
  };

  const handleConfirmImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLaundryStaff) return;

    if (importQty <= 0) {
      toast('Số lượng nhập kho phải lớn hơn 0.', 'error');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setItems(prev =>
      prev.map(item => {
        if (item.id === importItemId) {
          const newQty = item.currentStock + importQty;
          const newLog: InventoryLog = {
            id: `L-${Date.now()}`,
            date: formattedDate,
            type: 'Nhập kho',
            quantity: importQty,
            stockAfter: newQty,
            operator: 'Nguyễn Văn A',
            reason: importNotes.trim() || `Nhập hàng từ ${importSupplier || 'NCC mặc định'}`
          };
          return {
            ...item,
            currentStock: newQty,
            costPrice: importCost || item.costPrice,
            history: [...item.history, newLog]
          };
        }
        return item;
      })
    );

    setIsImportModalOpen(false);
    setImportNotes('');
    setImportSupplier('');
    toast(`Đã xác nhận nhập kho thành công cho vật tư ${activeImportItem.name}.`, 'success');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLaundryStaff) return;

    let hasError = false;
    setExportError('');
    setReconcileError('');

    if (actionQty <= 0) {
      setExportError('Số lượng phải lớn hơn 0.');
      return;
    }

    if (actionType === 'export' && actionQty > activeActionItem.currentStock) {
      setExportError(`Số lượng xuất (${actionQty}) vượt quá tồn kho hiện tại (${activeActionItem.currentStock}).`);
      hasError = true;
    }

    const isLargeAdjustment = actionType === 'adjust' && actionQty >= 20;
    if (isLargeAdjustment && !reconcileReason.trim()) {
      setReconcileError('Bắt buộc nhập lý do đối soát chi tiết khi điều chỉnh số lượng lớn (>= 20).');
      hasError = true;
    }

    if (hasError) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setItems(prev =>
      prev.map(item => {
        if (item.id === actionItemId) {
          const newQty = Math.max(0, item.currentStock - actionQty);
          const delta = -actionQty;

          const newLog: InventoryLog = {
            id: `L-${Date.now()}`,
            date: formattedDate,
            type: 'Điều chỉnh',
            quantity: delta,
            stockAfter: newQty,
            operator: 'Nguyễn Văn A',
            reason: actionType === 'export'
              ? (actionNotes.trim() || 'Xuất phục vụ giặt sấy chi nhánh')
              : `Điều chỉnh kiểm kê. Lý do: ${reconcileReason.trim() || actionNotes.trim() || 'Chênh lệch thực tế'}`
          };

          return {
            ...item,
            currentStock: newQty,
            history: [...item.history, newLog]
          };
        }
        return item;
      })
    );

    const expectedStock = Math.max(0, activeActionItem.currentStock - actionQty);
    if (expectedStock <= activeActionItem.minStock) {
      toast(`Cảnh báo: Vật tư ${activeActionItem.name} đã chạm mức tồn kho tối thiểu.`, 'warning');
    }

    setIsExportModalOpen(false);
    setActionNotes('');
    setReconcileReason('');
    toast('Cập nhật tồn kho vật tư thành công.', 'success');
  };

  const getStatusBadge = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-rose-800 bg-[#FFF1F2] border border-[#FECDD3]">
          Hết hàng
        </span>
      );
    }
    if (item.currentStock <= item.minStock) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-[#FFFBEB] border border-[#FDE68A]">
          Sắp hết
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 bg-[#ECFDF5] border border-[#A7F3D0]">
        Còn hàng
      </span>
    );
  };

  const getRowClass = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'bg-[#FFF1F2]/60 hover:bg-[#FFF1F2] transition-colors cursor-pointer';
    if (item.currentStock <= item.minStock) return 'bg-[#FFFBEB]/60 hover:bg-[#FFFBEB] transition-colors cursor-pointer';
    return 'bg-white hover:bg-slate-50/80 transition-colors cursor-pointer';
  };

  return (
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-5 text-left">
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

      {/* 1. INVENTORY CONTROL CENTER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            INVENTORY CONTROL CENTER
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Quản lý kho vật tư &amp; hóa chất
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedItemId(items[0]?.id || null)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <History size={14} className="text-[#2563EB]" />
            <span>Lịch sử biến động</span>
          </button>

          {!isLaundryStaff && (
            <button
              type="button"
              onClick={() => {
                setImportItemId('VT-001');
                setImportQty(5);
                setImportCost(400000);
                setIsImportModalOpen(true);
              }}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer border-0 shadow-2xs flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Nhập kho</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. COMPACT TOP KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* KPI 1: Low stock count */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">
              MẶT HÀNG SẮP HẾT / HẾT HÀNG
            </span>
            <strong className="text-2xl font-black text-slate-900">
              {lowStockCount} <span className="text-xs text-amber-800 font-bold">mã vật tư</span>
            </strong>
          </div>
          <span className="p-2.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
            <Package size={18} />
          </span>
        </div>

        {/* KPI 2: Total Inventory Value */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">
              TỔNG GIÁ TRỊ TỒN KHO
            </span>
            <strong className="text-2xl font-black text-[#2563EB]">
              {totalValue.toLocaleString('vi-VN')}đ
            </strong>
          </div>
          <span className="p-2.5 bg-blue-100 text-[#2563EB] rounded-lg shrink-0">
            <SlidersHorizontal size={18} />
          </span>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE GRID: 8 COLS TABLE vs 4 COLS PERMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: 8 COLS - INVENTORY DATA TABLE */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* SEARCH & CATEGORY FILTER TOOLBAR */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Tìm tên hoặc mã vật tư..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] text-slate-900 text-xs font-semibold rounded-md pl-8 pr-3 py-1.5 outline-none transition-all"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-md px-3 py-1.5 w-full sm:w-auto">
              <Filter size={13} className="text-slate-400 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  toast(`Lọc theo nhóm vật tư: ${e.target.value}`, 'info');
                }}
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-800 cursor-pointer w-full"
              >
                <option value="Tất cả">Tất cả nhóm vật tư</option>
                <option value="Hóa chất">Hóa chất</option>
                <option value="Bao bì">Bao bì</option>
                <option value="Phụ kiện khác">Phụ kiện khác</option>
              </select>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                  <tr className="border-b border-[#DCE5F0] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Tên vật tư</th>
                    <th className="py-3 px-4">Nhóm</th>
                    <th className="py-3 px-4 text-center">ĐVT</th>
                    <th className="py-3 px-4 text-center">Tồn kho</th>
                    <th className="py-3 px-4 text-center">Tối thiểu</th>
                    <th className="py-3 px-4 text-right">Giá vốn</th>
                    <th className="py-3 px-4 text-right">Giá trị tồn</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0]">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-xs text-slate-400 font-semibold">
                        Không tìm thấy vật tư nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const itemVal = item.currentStock * item.costPrice;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItemId(item.id)}
                          className={getRowClass(item)}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-500">{item.id}</td>
                          
                          <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>

                          <td className="py-3 px-4 font-semibold text-slate-600">{item.category}</td>

                          <td className="py-3 px-4 text-center font-bold text-slate-700">{item.unit}</td>

                          <td className="py-3 px-4 text-center font-mono font-black text-slate-900">{item.currentStock}</td>

                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">{item.minStock}</td>

                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                            {item.costPrice.toLocaleString('vi-VN')}đ
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                            {itemVal.toLocaleString('vi-VN')}đ
                          </td>

                          <td className="py-3 px-4 text-center">{getStatusBadge(item)}</td>

                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {!isLaundryStaff ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionItemId(item.id);
                                    setActionType('export');
                                    setActionQty(1);
                                    setExportError('');
                                    setReconcileError('');
                                    setIsExportModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-[#EEF4FF] text-slate-700 hover:text-[#2563EB] rounded text-[10px] font-bold transition-colors cursor-pointer border border-[#DCE5F0]"
                                >
                                  Xuất / Điều chỉnh
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Readonly</span>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedItemId(item.id)}
                                className="p-1 hover:text-[#2563EB] text-slate-400 transition-colors border-0 bg-transparent cursor-pointer"
                                title="Xem nhật ký"
                              >
                                <History size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 4 COLS - COMPACT PERMISSIONS & AUTOMATION PANEL */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* COMPACT PERMISSIONS PANEL */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col gap-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <UserCheck size={14} className="text-[#2563EB]" />
              QUYỀN HẠN THAO TÁC KHO
            </h3>

            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg">
              <div className="flex flex-col">
                <strong className="text-xs font-bold text-slate-900">Nhân viên giặt</strong>
                <span className="text-[10px] text-slate-400 font-medium">Chế độ chỉ xem (Readonly)</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLaundryStaff(!isLaundryStaff);
                  toast(
                    isLaundryStaff
                      ? 'Đã chuyển sang chế độ Chủ tiệm/Quản lý kho.'
                      : 'Đã kích hoạt chế độ nhân viên giặt (Readonly).',
                    'info'
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isLaundryStaff ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    isLaundryStaff ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-[#EEF4FF] border border-[#BFDBFE] p-3 rounded-lg text-xs text-slate-800 font-semibold leading-relaxed">
              <span className="font-bold text-[#2563EB]">🔒 Quy định bảo mật:</span>
              <p className="mt-1 text-[11px] text-slate-600 font-medium">
                Chỉ Chủ tiệm có quyền Nhập / Xuất / Điều chỉnh kho. Nhân viên giặt chỉ xem số lượng tồn.
              </p>
            </div>
          </div>

          {/* COMPACT AUTO DEDUCT PANEL */}
          <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 shadow-2xs flex flex-col gap-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Settings size={14} className="text-slate-500" />
              TỰ ĐỘNG HÓA HỆ THỐNG
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Trừ kho tự động theo đơn</span>
              <button
                type="button"
                onClick={() => {
                  setAutoDeduct(!autoDeduct);
                  toast(
                    autoDeduct
                      ? 'Đã tắt tính năng tự động trừ kho.'
                      : 'Đã kích hoạt tự động trừ kho vật tư theo định mức.',
                    'info'
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoDeduct ? 'bg-[#2563EB]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    autoDeduct ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {autoDeduct && (
              <p className="text-[10px] font-semibold text-[#2563EB] bg-[#EEF4FF] p-2.5 rounded border border-[#BFDBFE]">
                💡 Tự động trừ vật tư khi đơn hàng được tiếp nhận theo định mức đã cấu hình.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* 4. STOCK MOVEMENT LOG DRAWER */}
      <Drawer
        isOpen={selectedItemId !== null}
        onClose={() => setSelectedItemId(null)}
        title="Lịch sử biến động vật tư"
        className="w-full sm:w-[420px]"
      >
        {selectedItemForHistory && (
          <div className="flex flex-col gap-4 text-left text-xs p-1">
            <div className="flex items-center gap-3 border-b border-[#DCE5F0] pb-3">
              <div className="w-10 h-10 bg-[#EEF4FF] border border-[#BFDBFE] rounded-lg text-[#2563EB] font-bold flex items-center justify-center text-sm shrink-0">
                📦
              </div>
              <div className="min-w-0 flex flex-col">
                <strong className="text-sm font-black text-slate-900 truncate">
                  {selectedItemForHistory.name}
                </strong>
                <span className="text-slate-500 font-mono text-[11px]">
                  {selectedItemForHistory.id} · {selectedItemForHistory.category}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#F8FAFC] p-3 rounded-lg border border-[#DCE5F0]">
              <span className="font-bold text-slate-600">TỒN KHO HIỆN TẠI:</span>
              <strong className="text-[#2563EB] font-mono text-base">{selectedItemForHistory.currentStock} {selectedItemForHistory.unit}</strong>
            </div>

            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              <h4 className="font-bold text-slate-900 flex items-center gap-1">
                <Clock size={13} className="text-[#2563EB]" />
                Nhật ký biến động chi tiết
              </h4>

              {[...selectedItemForHistory.history].reverse().map((log) => {
                const isPositive = log.quantity > 0;
                return (
                  <div key={log.id} className="p-2.5 border-b border-slate-100 flex justify-between items-start text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{log.type}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                      </div>
                      <span className="text-slate-600 text-[11px]">{log.reason}</span>
                      <span className="text-[10px] text-slate-400">Người thao tác: {log.operator}</span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <strong className={isPositive ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}>
                        {isPositive ? `+${log.quantity}` : log.quantity}
                      </strong>
                      <span className="text-[10px] text-slate-400">Tồn sau: {log.stockAfter}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Drawer>

      {/* 5. IMPORT MODAL */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Nhập kho vật tư"
        size="sm"
      >
        <form onSubmit={handleConfirmImport} className="flex flex-col gap-3 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Chọn vật tư nhập *</label>
            <select
              value={importItemId}
              onChange={(e) => {
                setImportItemId(e.target.value);
                const selected = items.find(i => i.id === e.target.value);
                if (selected) setImportCost(selected.costPrice);
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-semibold outline-none"
            >
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Số lượng nhập ({activeImportItem.unit}) *</label>
            <input
              type="number"
              value={importQty}
              onChange={(e) => setImportQty(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-mono font-bold outline-none"
              min="1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Đơn giá vốn (đ) *</label>
            <input
              type="number"
              value={importCost}
              onChange={(e) => setImportCost(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-mono font-bold outline-none"
              min="0"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Lý do / Ghi chú nhập</label>
            <textarea
              value={importNotes}
              onChange={(e) => setImportNotes(e.target.value)}
              placeholder="Nhập ghi chú nhập hàng..."
              className="w-full h-16 p-2 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none resize-none"
            />
          </div>

          {getConversionMessage(importItemId) && (
            <p className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
              💡 {getConversionMessage(importItemId)}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2563EB] text-white font-bold rounded cursor-pointer border-0 shadow-2xs"
            >
              Xác nhận nhập kho
            </button>
          </div>
        </form>
      </Modal>

      {/* 6. EXPORT / ADJUST MODAL */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setActionNotes('');
          setReconcileReason('');
          setExportError('');
          setReconcileError('');
        }}
        title="Xuất kho / Điều chỉnh kiểm kê"
        size="sm"
      >
        <form onSubmit={handleConfirmAction} className="flex flex-col gap-3 text-left text-xs">
          <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#DCE5F0] flex justify-between">
            <span className="font-bold text-slate-600">Vật tư:</span>
            <strong className="text-slate-900">{activeActionItem.name} (Tồn: {activeActionItem.currentStock} {activeActionItem.unit})</strong>
          </div>

          <div className="flex bg-[#F8FAFC] p-1 rounded border border-[#DCE5F0] gap-1">
            <button
              type="button"
              onClick={() => setActionType('export')}
              className={`flex-1 py-1 text-center font-bold rounded cursor-pointer border-0 ${
                actionType === 'export' ? 'bg-[#2563EB] text-white' : 'text-slate-600'
              }`}
            >
              Xuất dùng (-)
            </button>
            <button
              type="button"
              onClick={() => setActionType('adjust')}
              className={`flex-1 py-1 text-center font-bold rounded cursor-pointer border-0 ${
                actionType === 'adjust' ? 'bg-amber-600 text-white' : 'text-slate-600'
              }`}
            >
              Điều chỉnh kiểm kê
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Số lượng ({activeActionItem.unit}) *</label>
            <input
              type="number"
              value={actionQty}
              onChange={(e) => {
                setActionQty(Math.max(1, parseInt(e.target.value) || 0));
                setExportError('');
              }}
              className="w-full h-[38px] px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 font-mono font-bold outline-none"
              min="1"
              required
            />
            {exportError && <span className="text-red-500 font-bold">{exportError}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Lý do xuất / điều chỉnh *</label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="w-full h-16 p-2 bg-[#F8FAFC] border border-[#DCE5F0] rounded text-slate-900 outline-none resize-none"
              required
            />
          </div>

          {actionType === 'adjust' && actionQty >= 20 && (
            <div className="flex flex-col gap-1 bg-red-50 p-2 rounded border border-red-200">
              <label className="font-bold text-red-800">⚠️ Lý do đối soát chi tiết (Bắt buộc &gt;= 20 đơn vị)</label>
              <textarea
                value={reconcileReason}
                onChange={(e) => {
                  setReconcileReason(e.target.value);
                  if (e.target.value.trim()) setReconcileError('');
                }}
                placeholder="Nhập giải trình đối soát chi tiết..."
                className="w-full h-16 p-2 bg-white border border-red-200 rounded text-slate-900 outline-none resize-none"
              />
              {reconcileError && <span className="text-red-500 font-bold">{reconcileError}</span>}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2563EB] text-white font-bold rounded cursor-pointer border-0 shadow-2xs"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
