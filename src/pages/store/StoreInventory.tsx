import { useState } from 'react';
import {
  Package,
  Plus,
  History,
  ShieldAlert,
  UserCheck,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Settings,
  SlidersHorizontal
} from 'lucide-react';
import { PageHeader, Modal, Drawer } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface InventoryLog {
  id: string;
  date: string;
  type: 'Nhập kho' | 'Xuất kho' | 'Điều chỉnh' | 'Tự động theo đơn hàng';
  quantity: number; // e.g. +5, -2, -10
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

  // Core database state
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tất cả');

  // Permission states: Chế độ nhân viên giặt
  const [isLaundryStaff, setIsLaundryStaff] = useState(false);

  // System Config states
  const [autoDeduct, setAutoDeduct] = useState(true);

  // Details Drawer state (History logs)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Modal control states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Form states: Nhập kho
  const [importItemId, setImportItemId] = useState('VT-001');
  const [importQty, setImportQty] = useState<number>(5);
  const [importCost, setImportCost] = useState<number>(400000);
  const [importSupplier, setImportSupplier] = useState('');
  const [importNotes, setImportNotes] = useState('');

  // Form states: Xuất kho / Điều chỉnh kiểm kê
  const [actionItemId, setActionItemId] = useState('VT-001');
  const [actionType, setActionType] = useState<'export' | 'adjust'>('export');
  const [actionQty, setActionQty] = useState<number>(1);
  const [actionNotes, setActionNotes] = useState('');
  const [reconcileReason, setReconcileReason] = useState('');
  
  // Validation errors
  const [exportError, setExportError] = useState('');
  const [reconcileError, setReconcileError] = useState('');

  // Resolve active objects
  const selectedItemForHistory = items.find(i => i.id === selectedItemId) || null;
  const activeImportItem = items.find(i => i.id === importItemId) || items[0];
  const activeActionItem = items.find(i => i.id === actionItemId) || items[0];

  // Expose KPIs calculations
  // Count items with stock <= minStock
  const lowStockCount = items.filter(i => i.currentStock <= i.minStock).length;
  // Sum currentStock * costPrice
  const totalValue = items.reduce((sum, i) => sum + i.currentStock * i.costPrice, 0);

  // Filter & Search logic
  const filteredItems = items.filter(i => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      i.name.toLowerCase().includes(query) ||
      i.id.toLowerCase().includes(query);

    if (categoryFilter === 'Tất cả') return matchesSearch;
    return matchesSearch && i.category === categoryFilter;
  });

  // Check if item unit conversion helper is needed
  // "VT-001" is "Nước giặt" and unit is "Can 20L". Conversion rules: 1 Can = 20 Lít
  const getConversionMessage = (itemId: string) => {
    if (itemId === 'VT-001') {
      return 'Quy tắc quy đổi: 1 Can 20L = 20 Lít. Vui lòng nhập số lượng theo đơn vị Can.';
    }
    return null;
  };

  // Handle Nhập kho action submission
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
            operator: 'Nguyễn Văn A', // Mock User
            reason: importNotes.trim() || `Nhập hàng từ ${importSupplier || 'NCC mặc định'}`
          };
          return {
            ...item,
            currentStock: newQty,
            costPrice: importCost || item.costPrice, // Update cost price if provided
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

  // Handle Xuất kho / Điều chỉnh kiểm kê submission
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

    // Constraints check: Không cho xuất vượt số lượng tồn
    if (actionType === 'export' && actionQty > activeActionItem.currentStock) {
      setExportError(`Số lượng xuất (${actionQty}) vượt quá tồn kho hiện tại (${activeActionItem.currentStock}).`);
      hasError = true;
    }

    // Threshold check for large adjustment: if adjust quantity is >= 20, reconciliation reason is required
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
          let newQty = item.currentStock;
          let delta = 0;

          if (actionType === 'export') {
            newQty = item.currentStock - actionQty;
            delta = -actionQty;
          } else {
            // Adjust inventory (this can overwrite or add/subtract, we'll implement it as set target or relative adjustment.
            // Let's implement it as relative deduction/addition: default deduct, or they can choose. Let's make it deduct for simplification, or relative adjust.
            // Let's do a relative deduction since it's most common, or let them specify adjust quantity which subtracts from stock).
            // Let's subtract from stock (e.g. -actionQty) and represent as "Điều chỉnh kiểm kê giảm" or "Điều chỉnh kiểm kê"
            newQty = Math.max(0, item.currentStock - actionQty);
            delta = -actionQty;
          }

          const newLog: InventoryLog = {
            id: `L-${Date.now()}`,
            date: formattedDate,
            type: 'Điều chỉnh',
            quantity: delta,
            stockAfter: newQty,
            operator: 'Nguyễn Văn A',
            reason: actionType === 'export' 
              ? (actionNotes.trim() || 'Xuất phục vụ giặt sấy chi nhánh')
              : `Điều chỉnh kiểm kê. Lý do đối soát: ${reconcileReason.trim() || actionNotes.trim() || 'Chênh lệch thực tế'}`
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

    // Alert toast if stock level triggers minimum
    const expectedStock = actionType === 'export' 
      ? activeActionItem.currentStock - actionQty 
      : Math.max(0, activeActionItem.currentStock - actionQty);

    if (expectedStock <= activeActionItem.minStock) {
      toast(`Cảnh báo: Vật tư ${activeActionItem.name} đã chạm mức tồn kho tối thiểu.`, 'warning');
    }

    setIsExportModalOpen(false);
    setActionNotes('');
    setReconcileReason('');
    toast('Cập nhật tồn kho vật tư thành công.', 'success');
  };

  // Get status color configuration
  const getStatusBadge = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-50 text-rose-700 border-rose-100">Hết hàng</span>;
    }
    if (item.currentStock <= item.minStock) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-100">Sắp hết</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">Còn hàng</span>;
  };

  // Determine row color based on stock status
  const getRowClass = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'bg-rose-50/20 hover:bg-rose-50/40 transition-colors cursor-pointer';
    if (item.currentStock <= item.minStock) return 'bg-amber-50/30 hover:bg-amber-50/50 transition-colors cursor-pointer';
    return 'hover:bg-slate-50/80 transition-colors cursor-pointer';
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      
      {/* Title Header with primary action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <PageHeader
          title="Quản lý kho vật tư"
          description="Quản lý danh sách, nhập xuất và tồn kho vật tư."
        />
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {!isLaundryStaff && (
            <button
              type="button"
              onClick={() => {
                setImportItemId('VT-001');
                setImportQty(5);
                setImportCost(400000);
                setIsImportModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-bold text-xs shadow-sm bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl transition-colors cursor-pointer border-none"
            >
              <Plus size={15} /> Nhập kho
            </button>
          )}
        </div>
      </div>

      {/* Quick Statistics Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* KPI 1: Low stock count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500">Mặt hàng sắp hết/Hết hàng</span>
            <span className="text-2xl font-black text-slate-800 flex items-baseline gap-1.5">
              {lowStockCount} <span className="text-xs font-bold text-slate-400">mã vật tư</span>
            </span>
          </div>
          <span className={`p-3 rounded-xl shrink-0 group-hover:scale-105 transition-transform ${
            lowStockCount > 0 ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'
          }`}>
            <Package size={20} />
          </span>
        </div>

        {/* KPI 2: Total Inventory Value */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500">Tổng giá trị tồn kho</span>
            <span className="text-2xl font-black text-blue-600">
              {totalValue.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <span className="p-3 bg-blue-50 text-blue-500 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
            <SlidersHorizontal size={20} />
          </span>
        </div>
      </div>

      {/* Main Grid: Filters & Table (col-span-8) vs Sidebar (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Filter tools and Data table */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            {/* Search */}
            <div className="relative flex-1 w-full max-w-sm">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Tìm theo mã hoặc tên vật tư..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Category Select Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0 w-full sm:w-auto max-w-xs self-end sm:self-auto">
              <Filter size={13} className="text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  toast(`Lọc theo nhóm vật tư: ${e.target.value}`, 'info');
                }}
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 cursor-pointer w-full"
              >
                <option value="Tất cả">Tất cả nhóm</option>
                <option value="Hóa chất">Hóa chất</option>
                <option value="Bao bì">Bao bì</option>
                <option value="Phụ kiện khác">Phụ kiện khác</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex flex-col gap-3">
            
            {/* Inline warning message if items running low */}
            {items.some(item => item.currentStock <= item.minStock) && (
              <div className="bg-amber-50 border border-amber-250/60 rounded-xl p-3.5 flex items-start gap-2.5 text-xs animate-fadeIn shadow-2xs">
                <span className="text-base select-none leading-none mt-0.5">⚠️</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-amber-800">Cảnh báo mức tồn kho:</span>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-semibold">
                    Vật tư đã chạm mức tồn kho tối thiểu. Vui lòng kiểm tra và lên kế hoạch nhập hàng.
                  </p>
                </div>
              </div>
            )}

            {/* Desktop Table with horizontal scroll on mobile */}
            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Tên vật tư</th>
                    <th className="py-3 px-4">Nhóm</th>
                    <th className="py-3 px-4 text-center">ĐVT</th>
                    <th className="py-3 px-4 text-center">Tồn kho</th>
                    <th className="py-3 px-4 text-center">Tối thiểu</th>
                    <th className="py-3 px-4 text-right">Giá vốn</th>
                    <th className="py-3 px-4 text-right">Tổng giá trị tồn</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                        Không tìm thấy vật tư nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isLow = item.currentStock <= item.minStock;
                      const itemVal = item.currentStock * item.costPrice;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItemId(item.id)}
                          className={getRowClass(item)}
                        >
                          {/* Code */}
                          <td className="py-3 px-4 font-bold text-slate-500">{item.id}</td>
                          
                          {/* Name */}
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <span className="flex items-center gap-1.5">
                              {item.name}
                              {isLow && (
                                <span className="text-amber-500 font-bold" title="Tồn kho thấp hơn mức an toàn!">⚠️</span>
                              )}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-slate-500 font-medium">{item.category}</td>

                          {/* Unit */}
                          <td className="py-3 px-4 text-center text-slate-600 font-semibold">{item.unit}</td>

                          {/* Stock */}
                          <td className="py-3 px-4 text-center font-bold text-slate-800">{item.currentStock}</td>

                          {/* Min stock */}
                          <td className="py-3 px-4 text-center text-slate-400 font-bold">{item.minStock}</td>

                          {/* Cost price */}
                          <td className="py-3 px-4 text-right text-slate-600 font-semibold">
                            {item.costPrice.toLocaleString('vi-VN')}đ
                          </td>

                          {/* Total stock value */}
                          <td className="py-3 px-4 text-right font-bold text-slate-800">
                            {itemVal.toLocaleString('vi-VN')}đ
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">{getStatusBadge(item)}</td>

                          {/* Row Actions */}
                          <td className="py-3 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              {!isLaundryStaff ? (
                                <>
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
                                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg font-bold text-[10px] transition-colors cursor-pointer border border-transparent shadow-2xs"
                                  >
                                    Xuất / Điều chỉnh
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Readonly</span>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedItemId(item.id)}
                                className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                                title="Xem lịch sử"
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

        {/* Right Side: Permissions & Auto Deduct config */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card 1: Phân quyền */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-blue-600" /> Phân quyền hoạt động
            </h3>

            {/* Toggle switch staff mode */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 select-none">
                  {isLaundryStaff ? (
                    <ShieldAlert size={13} className="text-amber-500 animate-pulse" />
                  ) : (
                    <CheckCircle size={13} className="text-emerald-500" />
                  )}
                  Nhân viên giặt
                </span>
                <span className="text-[9px] text-slate-400">Xem thử giới hạn quyền</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLaundryStaff(!isLaundryStaff);
                  toast(
                    isLaundryStaff
                      ? 'Đã chuyển sang chế độ Chủ tiệm/Quản lý kho. Đầy đủ quyền nhập/xuất.'
                      : 'Đã kích hoạt chế độ nhân viên giặt. Giới hạn chỉ được xem tồn kho.',
                    'info'
                  );
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  isLaundryStaff ? 'bg-amber-500' : 'bg-slate-200'
                }`}
                aria-label="Toggle Laundry Staff Mode"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isLaundryStaff ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Warnings context */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                ℹ️ Lưu ý phân quyền:
              </span>
              <p className="text-[10px] text-blue-800 leading-relaxed font-semibold">
                Khi bật "Chế độ nhân viên giặt", người dùng chỉ có thể xem số lượng tồn kho và lịch sử biến động. Chức năng Nhập/Xuất/Điều chỉnh sẽ bị khóa.
              </p>
            </div>
          </div>

          {/* Card 2: Auto deduct */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Settings size={16} className="text-slate-500" /> Tự động hóa hệ thống
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 select-none">
                  Trừ kho theo định mức đơn
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAutoDeduct(!autoDeduct);
                    toast(
                      autoDeduct
                        ? 'Đã tắt tính năng tự động trừ kho.'
                        : 'Đã kích hoạt tự động trừ kho vật tư theo định mức đơn hàng.',
                      'info'
                    );
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoDeduct ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                  aria-label="Toggle Auto Deduct"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      autoDeduct ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {autoDeduct && (
                <div className="text-[10px] text-blue-900 bg-blue-50/50 border border-blue-100 p-2.5 rounded-xl font-semibold leading-relaxed animate-fadeIn">
                  💡 Vật tư sẽ được tự động trừ khi đơn hàng phát sinh theo định mức đã thiết lập.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Nhập kho */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Nhập kho vật tư"
        size="md"
      >
        <form onSubmit={handleConfirmImport} className="flex flex-col gap-4 text-slate-800">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Material selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Chọn vật tư nhập kho</label>
              <select
                value={importItemId}
                onChange={(e) => {
                  setImportItemId(e.target.value);
                  const selected = items.find(i => i.id === e.target.value);
                  if (selected) {
                    setImportCost(selected.costPrice);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
              >
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
                ))}
              </select>
            </div>

            {/* Qty to import */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Số lượng cần nhập ({activeImportItem.unit})
              </label>
              <input
                type="number"
                value={importQty}
                onChange={(e) => setImportQty(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                min="1"
                required
              />
            </div>

            {/* Cost price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Đơn giá vốn nhập (đ)</label>
              <input
                type="number"
                value={importCost}
                onChange={(e) => setImportCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                min="0"
                required
              />
            </div>

            {/* Supplier */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Nhà cung cấp</label>
              <input
                type="text"
                placeholder="Nhập tên nhà cung cấp..."
                value={importSupplier}
                onChange={(e) => setImportSupplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Lý do / Ghi chú nhập kho</label>
              <textarea
                value={importNotes}
                onChange={(e) => setImportNotes(e.target.value)}
                placeholder="Ví dụ: Nhập hàng định kỳ tháng 10, Nhập thêm hàng khuyến mãi..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all h-20 resize-none"
              />
            </div>

          </div>

          {/* Conversion notice helper if material has units conversion rule */}
          {getConversionMessage(importItemId) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-[10px]">
              <span className="text-xs select-none">💡</span>
              <p className="text-amber-900 font-semibold leading-relaxed">
                {getConversionMessage(importItemId)}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end mt-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-slate-650 bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Xác nhận nhập kho
            </button>
          </div>

        </form>
      </Modal>

      {/* Modal: Xuất kho / Điều chỉnh kiểm kê */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setActionNotes('');
          setReconcileReason('');
          setExportError('');
          setReconcileError('');
        }}
        title="Thao tác Xuất kho / Điều chỉnh"
        size="md"
      >
        <form onSubmit={handleConfirmAction} className="flex flex-col gap-4 text-slate-800 font-medium">
          
          {/* Target Item summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Vật tư thao tác</span>
              <span className="font-extrabold text-slate-800">{activeActionItem.name} ({activeActionItem.id})</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Tồn kho hiện tại</span>
              <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-150">
                {activeActionItem.currentStock} {activeActionItem.unit}
              </span>
            </div>
          </div>

          {/* Action type: Export or Adjust */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setActionType('export');
                setExportError('');
                setReconcileError('');
              }}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                actionType === 'export' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Xuất dùng kho (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setActionType('adjust');
                setExportError('');
                setReconcileError('');
              }}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                actionType === 'adjust' ? 'bg-white text-amber-600 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Điều chỉnh kiểm kê
            </button>
          </div>

          {/* Qty to input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              Số lượng cần {actionType === 'export' ? 'xuất' : 'điều chỉnh giảm'} ({activeActionItem.unit})
            </label>
            <input
              type="number"
              value={actionQty}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value) || 0);
                setActionQty(val);
                setExportError('');
              }}
              className={`w-full bg-slate-50 border focus:bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all ${
                exportError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-400'
              }`}
              min="1"
              required
            />
            {exportError && (
              <span className="text-[10px] font-bold text-rose-500">⚠️ {exportError}</span>
            )}
          </div>

          {/* General Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Lý do / Chi tiết giao dịch <span className="text-rose-500">*</span></label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder={
                actionType === 'export' 
                  ? 'Ví dụ: Xuất dùng cho chi nhánh A, Sử dụng cho mẻ giặt chăn lớn...'
                  : 'Ví dụ: Chênh lệch khi kiểm kho thực tế...'
              }
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all h-16 resize-none"
              required
            />
          </div>

          {/* Conditionally trigger Large Reconciliation details */}
          {actionType === 'adjust' && actionQty >= 20 && (
            <div className="flex flex-col gap-1.5 p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl animate-fadeIn">
              <label className="text-xs font-bold text-rose-800 flex items-center gap-1">
                ⚠️ Lý do đối soát chi tiết <span className="text-rose-500 font-bold">*</span>
              </label>
              <textarea
                value={reconcileReason}
                onChange={(e) => {
                  setReconcileReason(e.target.value);
                  if (e.target.value.trim()) setReconcileError('');
                }}
                placeholder="Số lượng chênh lệch lớn (>= 20 đơn vị). Vui lòng nhập lý do đối soát đối chiếu chi tiết để giải trình kiểm toán..."
                className={`w-full bg-white border focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all h-20 resize-none ${
                  reconcileError ? 'border-rose-500' : 'border-rose-200'
                }`}
              />
              {reconcileError && (
                <span className="text-[10px] font-bold text-rose-500">{reconcileError}</span>
              )}
            </div>
          )}

          {/* Conversion helper notice */}
          {getConversionMessage(actionItemId) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-[10px]">
              <span className="text-xs select-none">💡</span>
              <div className="flex flex-col gap-0.5">
                <p className="text-amber-900 font-semibold leading-relaxed">
                  Quy tắc quy đổi: 1 Can 20L = 20 Lít.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Hệ thống hỗ trợ quy đổi đơn vị khi xuất lẻ sang Lít. Lượng xuất {actionQty} Can tương đương {actionQty * 20} Lít.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end mt-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-slate-650 bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Xác nhận {actionType === 'export' ? 'xuất kho' : 'điều chỉnh'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Drawer: Lịch sử biến động kho */}
      <Drawer
        isOpen={selectedItemId !== null}
        onClose={() => setSelectedItemId(null)}
        title="Lịch sử biến động kho"
        className="w-full max-w-md"
      >
        {selectedItemForHistory && (
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Header card summary */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="w-12 h-12 bg-slate-50 border border-slate-250/70 rounded-2xl flex items-center justify-center text-slate-600 text-lg font-bold shrink-0 animate-fadeIn">
                  📦
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-900 truncate">
                    {selectedItemForHistory.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 items-center mt-1">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {selectedItemForHistory.id}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      Nhóm: {selectedItemForHistory.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tồn hiện tại card */}
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-150 mb-5">
                <span className="text-xs font-bold text-slate-600">TỒN KHO HIỆN TẠI</span>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-150 flex items-center gap-1">
                  {selectedItemForHistory.currentStock} {selectedItemForHistory.unit}
                </span>
              </div>

              {/* Transactions log timelines */}
              <div className="flex flex-col gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1 mb-1">
                  <Clock size={12} /> Nhật ký giao dịch kho
                </h4>
                
                {[...selectedItemForHistory.history].reverse().map((log) => {
                  const isPositive = log.quantity > 0;
                  const absQty = Math.abs(log.quantity);
                  
                  return (
                    <div key={log.id} className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            log.type === 'Nhập kho'
                              ? 'bg-emerald-50 text-emerald-700'
                              : log.type === 'Xuất kho'
                              ? 'bg-blue-50 text-blue-700'
                              : log.type === 'Tự động theo đơn hàng'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{log.date}</span>
                        </div>
                        
                        <p className="text-xs font-medium text-slate-700 leading-relaxed break-words mt-0.5">
                          {log.reason}
                        </p>
                        
                        <span className="text-[10px] text-slate-400">
                          Người thực hiện: <strong className="text-slate-500">{log.operator}</strong>
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className={`text-xs font-black flex items-center gap-0.5 ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {isPositive ? `+${absQty}` : `-${absQty}`} {selectedItemForHistory.unit.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Tồn sau: <strong>{log.stockAfter}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Close Drawer button */}
            <div className="mt-8 border-t border-slate-150 pt-4">
              <button
                type="button"
                onClick={() => setSelectedItemId(null)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer bg-white"
              >
                Đóng lịch sử
              </button>
            </div>

          </div>
        )}
      </Drawer>

    </div>
  );
}
