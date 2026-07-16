import { useState, useEffect } from 'react';
import { Share2, MessageSquare, Printer, AlertTriangle, Play, ArrowUp, ArrowDown, Info } from 'lucide-react';

import {
  PageHeader,
  Button,
  StatusBadge,
  Select,
  Input,
  ConfirmDialog,
  Modal,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';

const DEFAULT_TEMPLATES: Record<string, string> = {
  'Tạo đơn mới': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} của quý khách đã được tiếp nhận thành công. Tổng tiền tạm tính: {Tong_Tien}. Cảm ơn quý khách đã tin dùng DUDI.',
  'Cập nhật tiến độ': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} đang được xử lý giặt sấy. Quý khách có thể tra cứu tiến độ mới nhất trên hệ thống.',
  'Hoàn thành': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} đã xử lý xong và sẵn sàng bàn giao/giao hàng. Tổng tiền: {Tong_Tien}. Hẹn gặp lại quý khách!',
  'Đánh giá dịch vụ': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} đã được hoàn thành. Hãy chia sẻ đánh giá về dịch vụ giặt là của DUDI nhé!'
};

const INVOICE_PRESETS = {
  'Mẫu tối giản': {
    showLogo: false,
    showQr: true,
    showWeight: false,
    showNote: false,
    showThanks: true,
    headerText: 'DUDI LAUNDRY',
    footerText: 'Cảm ơn quý khách!'
  },
  'Mẫu đầy đủ chi tiết': {
    showLogo: true,
    showQr: true,
    showWeight: true,
    showNote: true,
    showThanks: true,
    headerText: 'HỆ THỐNG GIẶT LÀ CAO CẤP DUDI',
    footerText: 'Hân hạnh được phục vụ quý khách. Vui lòng kiểm tra kỹ quần áo trước khi ra khỏi tiệm.'
  },
  'Mẫu thương mại': {
    showLogo: true,
    showQr: true,
    showWeight: true,
    showNote: false,
    showThanks: true,
    headerText: 'DUDI LAUNDRY - ĐIỂM GIẶT SẤY TỰ ĐỘNG',
    footerText: 'Mọi thắc mắc xin liên hệ Hotline. Hẹn gặp lại quý khách!'
  }
};

export default function AdminZaloInvoiceSettings() {
  const { toast } = useToast();

  // 1. ZALO STATE
  const [oaId, setOaId] = useState('2408159938102391280');
  const [secretKey, setSecretKey] = useState('AbcxyZ12398471928371928');
  const [accessToken, setAccessToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvYV9pZCI6IjI0MDgxNTk5MzgxMDIzOTEyODAifQ');
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'Đã kết nối' | 'Lỗi kết nối'>('Đã kết nối');

  // 2. ZNS STATE
  const [activeEvent, setActiveEvent] = useState('Tạo đơn mới');
  const [templates, setTemplates] = useState<Record<string, string>>(DEFAULT_TEMPLATES);
  const [testSmsModalOpen, setTestSmsModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('0901234567');

  // 3. INVOICE STATE
  const [paperSize, setPaperSize] = useState('K80');
  const [showLogo, setShowLogo] = useState(true);
  const [showQr, setShowQr] = useState(true);
  const [showWeight, setShowWeight] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const [showThanks, setShowThanks] = useState(true);
  const [headerText, setHeaderText] = useState('HỆ THỐNG GIẶT LÀ CAO CẤP DUDI');
  const [footerText, setFooterText] = useState('Hân hạnh được phục vụ quý khách. Vui lòng kiểm tra kỹ quần áo trước khi ra khỏi tiệm.');
  
  // Sortable mock blocks
  const [invoiceLayoutOrder, setInvoiceLayoutOrder] = useState<string[]>([
    'Thông tin tiệm',
    'Thông tin khách hàng',
    'Chi tiết đơn hàng',
    'Thanh toán',
    'Mã QR',
    'Chân trang'
  ]);

  // Save Confirm Dialog
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dudi_zalo_invoice_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.oaId) setOaId(parsed.oaId);
        if (parsed.secretKey) setSecretKey(parsed.secretKey);
        if (parsed.accessToken) setAccessToken(parsed.accessToken);
        if (parsed.isTokenExpired !== undefined) setIsTokenExpired(parsed.isTokenExpired);
        if (parsed.connectionStatus) setConnectionStatus(parsed.connectionStatus);
        if (parsed.templates) setTemplates(parsed.templates);
        if (parsed.paperSize) setPaperSize(parsed.paperSize);
        if (parsed.showLogo !== undefined) setShowLogo(parsed.showLogo);
        if (parsed.showQr !== undefined) setShowQr(parsed.showQr);
        if (parsed.showWeight !== undefined) setShowWeight(parsed.showWeight);
        if (parsed.showNote !== undefined) setShowNote(parsed.showNote);
        if (parsed.showThanks !== undefined) setShowThanks(parsed.showThanks);
        if (parsed.headerText) setHeaderText(parsed.headerText);
        if (parsed.footerText) setFooterText(parsed.footerText);
        if (parsed.invoiceLayoutOrder) setInvoiceLayoutOrder(parsed.invoiceLayoutOrder);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleTestConnection = () => {
    if (!oaId || !secretKey || !accessToken) {
      setConnectionStatus('Lỗi kết nối');
      toast('Vui lòng điền đầy đủ thông tin kết nối Zalo OA.', 'error');
      return;
    }
    if (isTokenExpired) {
      setConnectionStatus('Lỗi kết nối');
      toast('Kết nối thất bại. Token đã hết hạn.', 'error');
      return;
    }
    setConnectionStatus('Đã kết nối');
    toast('Kết nối tới Zalo Official Account thành công!', 'success');
  };

  const handleTemplateContentChange = (val: string) => {
    setTemplates(prev => ({
      ...prev,
      [activeEvent]: val
    }));
  };

  const handleSendTestSms = () => {
    if (!testPhone.trim()) {
      toast('Vui lòng nhập số điện thoại gửi thử.', 'error');
      return;
    }
    setTestSmsModalOpen(false);
    toast(`Đã gửi tin nhắn mẫu đến số điện thoại ${testPhone.trim()} qua Zalo OA`, 'success');
  };

  const handleSelectPreset = (presetName: keyof typeof INVOICE_PRESETS) => {
    const config = INVOICE_PRESETS[presetName];
    setShowLogo(config.showLogo);
    setShowQr(config.showQr);
    setShowWeight(config.showWeight);
    setShowNote(config.showNote);
    setShowThanks(config.showThanks);
    setHeaderText(config.headerText);
    setFooterText(config.footerText);
    toast(`Đã áp dụng ${presetName}`, 'info');
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...invoiceLayoutOrder];
    if (direction === 'up' && index > 0) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[index - 1];
      newOrder[index - 1] = temp;
    } else if (direction === 'down' && index < newOrder.length - 1) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[index + 1];
      newOrder[index + 1] = temp;
    }
    setInvoiceLayoutOrder(newOrder);
  };

  const executeSave = () => {
    const data = {
      oaId,
      secretKey,
      accessToken,
      isTokenExpired,
      connectionStatus,
      templates,
      paperSize,
      showLogo,
      showQr,
      showWeight,
      showNote,
      showThanks,
      headerText,
      footerText,
      invoiceLayoutOrder
    };
    localStorage.setItem('dudi_zalo_invoice_settings', JSON.stringify(data));
    toast('Đã lưu cấu hình Zalo và mẫu hóa đơn.', 'success');
  };

  const handleSaveClick = () => {
    // Check template variable braces match {Variable}
    const currentText = templates[activeEvent] || '';
    const bracesCountOpen = (currentText.match(/\{/g) || []).length;
    const bracesCountClose = (currentText.match(/\}/g) || []).length;
    if (bracesCountOpen !== bracesCountClose) {
      toast('Nội dung mẫu chứa dấu ngoặc biến {} không khớp cú pháp.', 'error');
      return;
    }

    setSaveConfirmOpen(true);
  };

  const handlePrintTest = () => {
    toast(`Bắt đầu in thử hóa đơn khổ ${paperSize}...`, 'info');
  };

  const activeTemplateText = templates[activeEvent] || '';
  const isLengthExceeded = activeTemplateText.length > 250;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800">
      <PageHeader
        title="Cấu hình Zalo & In ấn"
        description="Thiết lập cổng kết nối Zalo OA, cấu hình tin nhắn ZNS gửi tự động và thiết kế biểu mẫu hóa đơn in ấn."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Zalo & Hóa đơn' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        
        {/* Left column (Config panels) */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-w-0 w-full">
          
          {/* Section 1: Zalo OA Connect */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Share2 size={18} className="text-blue-500" />
                Cấu hình Zalo Official Account
              </span>
              <StatusBadge label={connectionStatus} variant={connectionStatus === 'Đã kết nối' ? 'success' : 'error'} />
            </h3>

            {isTokenExpired && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span className="font-bold">Token truy cập Zalo OA đã hết hạn hoặc không hợp lệ. Vui lòng làm mới từ Zalo Developers.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <Input
                  id="oaId"
                  label="Zalo OA ID"
                  value={oaId}
                  onChange={(e) => setOaId(e.target.value)}
                  placeholder="Nhập ID kênh Zalo OA"
                />
                <Input
                  id="secretKey"
                  label="Secret Key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Nhập Secret Key ứng dụng"
                />
              </div>

              {/* Developer Help Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-600 flex flex-col gap-2.5">
                <strong className="text-xs font-bold text-slate-750 flex items-center gap-1">
                  <Info size={14} className="text-blue-500" />
                  Hướng dẫn cấu hình
                </strong>
                <p className="leading-relaxed">1. Truy cập <strong>Zalo Developers Portal</strong> và đăng nhập bằng tài khoản Admin OA.</p>
                <p className="leading-relaxed">2. Đăng ký ứng dụng liên kết và phân quyền ZNS cho OA ID tương ứng.</p>
                <p className="leading-relaxed">3. Tạo Access Token với thời hạn dài và dán vào ô bên dưới.</p>
                
                <label className="inline-flex items-center gap-2 cursor-pointer mt-1.5 select-none pt-1.5 border-t border-slate-200">
                  <input
                    type="checkbox"
                    checked={isTokenExpired}
                    onChange={(e) => {
                      setIsTokenExpired(e.target.checked);
                      if (e.target.checked) setConnectionStatus('Lỗi kết nối');
                    }}
                    className="w-3.5 h-3.5 rounded text-red-650 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="font-bold text-[10px] text-red-600">Giả lập Token hết hạn</span>
                </label>
              </div>
            </div>

            <Input
              id="accessToken"
              label="Access Token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Nhập Access Token lấy từ Zalo Developers"
            />

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={handleTestConnection}>
                Kiểm tra kết nối
              </Button>
            </div>
          </div>

          {/* Section 2: ZNS Template Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <MessageSquare size={18} className="text-blue-500" />
              Quản lý mẫu tin nhắn ZNS
            </h3>

            {/* Event tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl">
              {['Tạo đơn mới', 'Cập nhật tiến độ', 'Hoàn thành', 'Đánh giá dịch vụ'].map((evt) => (
                <button
                  key={evt}
                  type="button"
                  onClick={() => {
                    setActiveEvent(evt);
                  }}
                  className={`flex-1 text-center py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    activeEvent === evt ? 'bg-white text-blue-600 shadow-sm border border-slate-150' : 'text-slate-550 hover:bg-slate-100'
                  }`}
                >
                  {evt}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Nội dung mẫu ZNS</span>
                <span className={`text-[10px] font-bold ${isLengthExceeded ? 'text-red-500 font-extrabold' : 'text-slate-400'}`}>
                  Số ký tự: {activeTemplateText.length} / 250
                </span>
              </div>
              <textarea
                rows={4}
                value={activeTemplateText}
                onChange={(e) => handleTemplateContentChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-700 text-xs focus:border-primary focus:bg-white outline-none transition-all placeholder-slate-400 resize-none font-semibold text-sm ${
                  isLengthExceeded ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Nhập nội dung mẫu gửi tin..."
              />
              {isLengthExceeded && (
                <span className="text-[10px] text-red-500 font-bold">Nội dung tin nhắn vượt quá giới hạn 250 ký tự cho phép.</span>
              )}
            </div>

            {/* Insertion Variables Guide */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-blue-800">Danh sách biến khả dụng (Nhấp để chèn):</span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {['{Ten_Khach}', '{Ma_Don}', '{Tong_Tien}'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleTemplateContentChange(activeTemplateText + ' ' + v)}
                    className="px-2.5 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => setTestSmsModalOpen(true)} className="flex items-center gap-1">
                <Play size={13} />
                Gửi thử tin nhắn
              </Button>
            </div>
          </div>

          {/* Section 3: Invoice Template Designer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Printer size={18} className="text-blue-500" />
                Thiết lập mẫu hóa đơn
              </span>
            </h3>

            {/* Presets block */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700">Chọn mẫu in soạn sẵn</span>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(INVOICE_PRESETS).map((pname) => (
                  <button
                    key={pname}
                    type="button"
                    onClick={() => handleSelectPreset(pname as keyof typeof INVOICE_PRESETS)}
                    className="py-2.5 px-3 border border-slate-200 rounded-xl text-center font-bold text-xs hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer"
                  >
                    {pname}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Select
                id="paperSize"
                label="Khổ giấy hóa đơn"
                options={['K57', 'K80', 'A5']}
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
              />
              <Input
                id="invoiceHeader"
                label="Tiêu đề Header hóa đơn"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
              />
            </div>

            <Input
              id="invoiceFooter"
              label="Lời cảm ơn / Footer hóa đơn"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />

            {/* Fields to toggle checkbox */}
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-xs font-bold text-slate-700">Các trường hiển thị trên hóa đơn</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Logo tiệm', checked: showLogo, set: setShowLogo },
                  { label: 'Mã QR tra cứu', checked: showQr, set: setShowQr },
                  { label: 'Số kg', checked: showWeight, set: setShowWeight },
                  { label: 'Ghi chú đơn', checked: showNote, set: setShowNote },
                  { label: 'Lời cảm ơn', checked: showThanks, set: setShowThanks }
                ].map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-center gap-2.5 px-3 py-2 border rounded-xl cursor-pointer select-none transition-all ${
                      item.checked ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <span className="text-xs font-bold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sortable block drag-drop mock */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-slate-700">Sắp xếp thứ tự in ấn nội dung</span>
              <div className="border border-slate-150 rounded-xl p-3 bg-slate-50/50 flex flex-col gap-2">
                {invoiceLayoutOrder.map((block, idx) => (
                  <div key={block} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-450">{idx + 1}</span>
                      {block}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${idx === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === invoiceLayoutOrder.length - 1}
                        className={`p-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${idx === invoiceLayoutOrder.length - 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <Button variant="outline" size="sm" onClick={handlePrintTest} className="flex items-center gap-1 text-xs">
              <Printer size={14} />
              In thử hóa đơn
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveClick} className="flex items-center gap-1.5 text-xs font-bold px-6">
              Lưu cấu hình
            </Button>
          </div>
        </div>

        {/* Right column (Thermal Print Live Preview) */}
        <div className="lg:col-span-5 w-full min-w-0 flex flex-col gap-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Live Preview Hóa Đơn ({paperSize})</h3>
          
          {/* Invoice ticket container */}
          <div className="bg-[#fdfbf7] border-2 border-dashed border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col gap-4 font-mono text-[11px] text-slate-800 leading-relaxed relative min-h-[500px]">
            
            {/* Logo preview */}
            {showLogo && (
              <div className="flex flex-col items-center gap-1 text-center border-b border-dashed border-slate-200 pb-3">
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-extrabold text-sm">
                  DU
                </div>
                <strong className="text-[10px] tracking-widest font-extrabold uppercase mt-1">DUDI LAUNDRY</strong>
              </div>
            )}

            {/* Custom Header Text */}
            <div className="text-center font-bold text-xs uppercase leading-tight border-b border-dashed border-slate-200 pb-3">
              {headerText || 'TIỆM GIẶT ỦI'}
            </div>

            {/* Ordered sections content render */}
            {invoiceLayoutOrder.map((sectionName) => {
              if (sectionName === 'Thông tin tiệm') {
                return (
                  <div key={sectionName} className="flex flex-col gap-1 border-b border-dashed border-slate-200 pb-2.5">
                    <div className="flex justify-between"><span>Cửa hàng:</span><span>Chi nhánh Q1</span></div>
                    <div className="flex justify-between"><span>Địa chỉ:</span><span>123 Nguyễn Huệ</span></div>
                    <div className="flex justify-between"><span>Hotline:</span><span>1900 1234</span></div>
                  </div>
                );
              }
              if (sectionName === 'Thông tin khách hàng') {
                return (
                  <div key={sectionName} className="flex flex-col gap-1 border-b border-dashed border-slate-200 pb-2.5">
                    <div className="flex justify-between"><span>Khách hàng:</span><strong>Nguyễn Văn An</strong></div>
                    <div className="flex justify-between"><span>SĐT:</span><span>0901234567</span></div>
                  </div>
                );
              }
              if (sectionName === 'Chi tiết đơn hàng') {
                return (
                  <div key={sectionName} className="flex flex-col gap-1.5 border-b border-dashed border-slate-200 pb-2.5">
                    <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
                      <span>Dịch vụ</span>
                      <span>SL</span>
                      <span>Thành tiền</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giặt sấy quần áo</span>
                      <span>2.5kg</span>
                      <span>50.000đ</span>
                    </div>
                    {showWeight && (
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>- Trọng lượng đo:</span>
                        <span>2.5 kg</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Giày thể thao</span>
                      <span>1 đôi</span>
                      <span>40.000đ</span>
                    </div>
                    {showNote && (
                      <div className="text-slate-500 text-[10px] italic pt-1">
                        * Ghi chú: Giặt sạch vết bùn đất gót giày.
                      </div>
                    )}
                  </div>
                );
              }
              if (sectionName === 'Thanh toán') {
                return (
                  <div key={sectionName} className="flex flex-col gap-1 border-b border-dashed border-slate-200 pb-2.5 text-xs font-bold">
                    <div className="flex justify-between"><span>Tổng cộng:</span><span>90.000đ</span></div>
                    <div className="flex justify-between text-blue-600"><span>Khuyến mãi:</span><span>-0đ</span></div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold">
                      <span>Thực thu:</span>
                      <span>90.000đ</span>
                    </div>
                  </div>
                );
              }
              if (sectionName === 'Mã QR') {
                if (!showQr) return null;
                return (
                  <div key={sectionName} className="flex flex-col items-center gap-2 border-b border-dashed border-slate-200 pb-3 text-center">
                    <div className="w-20 h-20 bg-white border border-slate-300 p-1 flex items-center justify-center">
                      {/* Simulated QR block code */}
                      <div className="w-full h-full bg-slate-900 flex flex-wrap p-0.5 gap-0.5 justify-center content-center">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 ${i % 3 === 0 || i % 5 === 2 ? 'bg-white' : 'bg-slate-900'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Quét mã QR để tra cứu tiến độ đơn</span>
                  </div>
                );
              }
              if (sectionName === 'Chân trang') {
                if (!showThanks) return null;
                return (
                  <div key={sectionName} className="text-center text-[10px] text-slate-600 italic leading-relaxed pt-2">
                    {footerText || 'Cảm ơn quý khách!'}
                  </div>
                );
              }
              return null;
            })}

            <div className="mt-auto text-center text-[8px] text-slate-400 font-bold border-t border-dashed border-slate-200 pt-3">
              Mã tra cứu: DUDI-ORD-998822
            </div>

          </div>
        </div>

      </div>

      {/* Connection Test Number input Modal */}
      <Modal
        isOpen={testSmsModalOpen}
        onClose={() => setTestSmsModalOpen(false)}
        title="Gửi thử tin nhắn ZNS"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-xs text-slate-800">
          <Input
            id="testPhone"
            label="Số điện thoại người nhận *"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="Ví dụ: 0901234567"
          />

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-1.5 mt-1 text-[11px] text-slate-600">
            <span className="font-bold text-slate-700">Nội dung tin nhắn giả lập sẽ gửi:</span>
            <p className="italic bg-white p-2 rounded-lg border border-slate-150 leading-relaxed text-slate-500">
              {activeTemplateText
                .replace(/{Ten_Khach}/g, 'Nguyễn Văn An')
                .replace(/{Ma_Don}/g, 'ORD-12345')
                .replace(/{Tong_Tien}/g, '90.000đ')
              }
            </p>
          </div>

          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setTestSmsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendTestSms}>
              Xác nhận gửi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Settings Confirmation */}
      <ConfirmDialog
        isOpen={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        onConfirm={() => {
          setSaveConfirmOpen(false);
          executeSave();
        }}
        title="Xác nhận lưu cấu hình"
        variant="primary"
        message="Thay đổi mẫu hóa đơn sẽ ảnh hưởng đến việc in ấn của toàn bộ cửa hàng. Bạn có chắc chắn muốn tiếp tục?"
      />
    </div>
  );
}
