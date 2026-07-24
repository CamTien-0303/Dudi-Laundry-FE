import { useState, useEffect } from 'react';
import { Share2, MessageSquare, Printer, Eye, EyeOff, Info, Play } from 'lucide-react';
import { PageHeader, ConfirmDialog, Modal } from '../../components/common';
import { useToast } from '../../components/common/Toast';

const DEFAULT_TEMPLATES: Record<string, string> = {
  'Tạo đơn mới': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} của quý khách đã được tiếp nhận thành công. Tổng tiền tạm tính: {Tong_Tien}. Cảm ơn quý khách đã tin dùng DUDI.',
  'Cập nhật tiến độ': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} đang được xử lý giặt sấy. Quý khách có thể tra cứu tiến độ mới nhất trên hệ thống.',
  'Hoàn thành': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} đã xử lý xong và sẵn sàng bàn giao/giao hàng. Tổng tiền: {Tong_Tien}. Hẹn gặp lại quý khách!',
  'Đánh giá dịch vụ': 'Chào {Ten_Khach}, đơn hàng {Ma_Don} đã được hoàn thành. Hãy chia sẻ đánh giá về dịch vụ giặt là của DUDI nhé!'
};

export default function AdminZaloInvoiceSettings() {
  const { toast } = useToast();

  // Top Tabs
  const [activeTab, setActiveTab] = useState<'zalo' | 'zns' | 'invoice'>('zalo');

  // 1. ZALO OA STATE
  const [oaId, setOaId] = useState('2408159938102391280');
  const [secretKey, setSecretKey] = useState('AbcxyZ12398471928371928');
  const [accessToken, setAccessToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvYV9pZCI6IjI0MDgxNTk5MzgxMDIzOTEyODAifQ');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
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
      toast('Vui lòng nhập số điện thoại người nhận thử.', 'error');
      return;
    }
    setTestSmsModalOpen(false);
    toast(`Đã gửi tin nhắn ZNS mẫu đến số điện thoại ${testPhone.trim()} qua Zalo OA.`, 'success');
  };

  const executeSave = () => {
    const data = {
      oaId,
      secretKey,
      accessToken,
      connectionStatus,
      templates,
      paperSize,
      showLogo,
      showQr,
      showWeight,
      showNote,
      showThanks,
      headerText,
      footerText
    };
    localStorage.setItem('dudi_zalo_invoice_settings', JSON.stringify(data));
    toast('Đã lưu cấu hình Zalo và mẫu hóa đơn thành công.', 'success');
  };

  const handleSaveClick = () => {
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
    <div className="w-full bg-[#F4F7FB] min-h-screen text-slate-800 p-4 md:p-8 flex flex-col gap-6 text-left">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
        <PageHeader
          title="Cấu hình Zalo & In ấn"
          description="Quản lý cổng kết nối Zalo OA, cấu hình mẫu tin ZNS tự động và thiết kế mẫu hóa đơn in ấn cho toàn hệ thống."
          breadcrumb={[
            { label: 'Hệ thống', to: '/admin/dashboard' },
            { label: 'Zalo & Hóa đơn' },
          ]}
        />
      </div>

      {/* 3 TOP TABS */}
      <div className="flex border-b border-[#DCE5F0] gap-2 bg-white p-1.5 rounded-xl border shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('zalo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
            activeTab === 'zalo'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Share2 size={16} />
          <span>1. Kết nối Zalo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
            activeTab === 'zns'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare size={16} />
          <span>2. Mẫu tin ZNS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invoice')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
            activeTab === 'invoice'
              ? 'bg-[#2563EB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer size={16} />
          <span>3. Mẫu hóa đơn</span>
        </button>
      </div>

      {/* TAB 1: KẾT NỐI ZALO */}
      {activeTab === 'zalo' && (
        <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Share2 size={18} className="text-[#2563EB]" />
              THÔNG TIN KẾT NỐI ZALO OFFICIAL ACCOUNT
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
              connectionStatus === 'Đã kết nối'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {connectionStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form inputs */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* OA ID */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Zalo OA ID *</label>
                <input
                  type="text"
                  placeholder="Nhập ID kênh Zalo Official Account"
                  value={oaId}
                  onChange={(e) => setOaId(e.target.value)}
                  className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md text-slate-900 text-xs font-semibold outline-none transition-all"
                />
              </div>

              {/* Secret Key with Mask & Show/Hide Eye */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Secret Key *</label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    placeholder="Nhập Secret Key ứng dụng Zalo"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full h-[42px] pl-3.5 pr-10 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md text-slate-900 text-xs font-semibold outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                  >
                    {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Access Token with Mask & Show/Hide Eye */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">Access Token *</label>
                <div className="relative">
                  <input
                    type={showAccessToken ? 'text' : 'password'}
                    placeholder="Nhập Access Token dài hạn từ Zalo Developers"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full h-[42px] pl-3.5 pr-10 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 rounded-md text-slate-900 text-xs font-semibold outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessToken(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                  >
                    {showAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs"
                >
                  Kiểm tra kết nối
                </button>
              </div>

            </div>

            {/* Streamlined Guidance Card */}
            <div className="lg:col-span-4 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg p-4 text-xs text-slate-600 flex flex-col gap-2.5">
              <strong className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Info size={15} className="text-[#2563EB]" />
                HƯỚNG DẪN KẾT NỐI ZALO OA
              </strong>
              <p className="leading-relaxed">1. Đăng nhập cổng <strong>Zalo Developers Portal</strong> với quyền Administrator.</p>
              <p className="leading-relaxed">2. Tạo ứng dụng liên kết và cấp quyền ZNS cho OA ID tương ứng.</p>
              <p className="leading-relaxed">3. Tạo Access Token dài hạn và dán các tham số bảo mật vào các ô bên trái.</p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: MẪU TIN ZNS */}
      {activeTab === 'zns' && (
        <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={18} className="text-[#2563EB]" />
              QUẢN LÝ MẪU TIN NHẮN ZNS TỰ ĐỘNG
            </h3>
            <span className="text-xs font-bold text-slate-400">4 MẪU CHUẨN SB08</span>
          </div>

          {/* 4 Event Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8FAFC] p-1.5 rounded-lg border border-[#DCE5F0]">
            {['Tạo đơn mới', 'Cập nhật tiến độ', 'Hoàn thành', 'Đánh giá dịch vụ'].map((evt) => (
              <button
                key={evt}
                type="button"
                onClick={() => setActiveEvent(evt)}
                className={`py-2 px-3 text-xs font-bold rounded-md transition-all cursor-pointer border-0 ${
                  activeEvent === evt
                    ? 'bg-white text-[#2563EB] shadow-2xs border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {evt}
              </button>
            ))}
          </div>

          {/* Template Content Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Nội dung mẫu ZNS ({activeEvent})</label>
              <span className={`text-[11px] font-mono font-bold ${isLengthExceeded ? 'text-red-600 font-black' : 'text-slate-400'}`}>
                Số ký tự: {activeTemplateText.length} / 250
              </span>
            </div>

            <textarea
              rows={5}
              value={activeTemplateText}
              onChange={(e) => handleTemplateContentChange(e.target.value)}
              placeholder="Nhập nội dung tin nhắn ZNS..."
              className={`w-full px-3.5 py-3 bg-[#F8FAFC] border rounded-md text-slate-900 text-xs font-semibold outline-none transition-all resize-none leading-relaxed ${
                isLengthExceeded ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {isLengthExceeded && (
              <span className="text-red-500 text-[10px] font-bold">Nội dung mẫu vượt quá giới hạn 250 ký tự cho phép.</span>
            )}
          </div>

          {/* Dynamic Insertion Variables */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-xs font-bold text-blue-900">Danh sách biến chèn động (Nhấp để chèn):</span>
            <div className="flex flex-wrap gap-2">
              {['{Ten_Khach}', '{Ma_Don}', '{Tong_Tien}'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleTemplateContentChange(activeTemplateText + ' ' + v)}
                  className="px-3 py-1 bg-white border border-blue-300 text-[#2563EB] font-mono text-xs font-bold rounded hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTestSmsModalOpen(true)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] rounded-md text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Play size={14} className="text-[#2563EB]" />
              <span>Gửi thử tin nhắn</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: MẪU HÓA ĐƠN */}
      {activeTab === 'invoice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Config Left Column */}
          <div className="lg:col-span-7 bg-white border border-[#DCE5F0] rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Printer size={18} className="text-[#2563EB]" />
                THIẾT LẬP CẤU HÌNH MẪU HÓA ĐƠN IN
              </h3>
            </div>

            {/* Paper size */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-800">Khổ giấy hóa đơn *</label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="K57">Khổ nhỏ K57 (57mm)</option>
                <option value="K80">Khổ tiêu chuẩn K80 (80mm)</option>
                <option value="A5">Khổ A5</option>
              </select>
            </div>

            {/* Header Text */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-800">Tiêu đề Header hóa đơn</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-semibold outline-none"
              />
            </div>

            {/* Footer Text */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-800">Lời cảm ơn / Footer hóa đơn</label>
              <textarea
                rows={2}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-semibold outline-none resize-none"
              />
            </div>

            {/* Exactly 5 Checkbox Toggles */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800">Các trường hiển thị trên hóa đơn (5 trường)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: 'Logo tiệm', checked: showLogo, set: setShowLogo },
                  { label: 'Mã QR tra cứu', checked: showQr, set: setShowQr },
                  { label: 'Số kg', checked: showWeight, set: setShowWeight },
                  { label: 'Ghi chú đơn', checked: showNote, set: setShowNote },
                  { label: 'Lời cảm ơn', checked: showThanks, set: setShowThanks }
                ].map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-md cursor-pointer select-none transition-colors ${
                      item.checked
                        ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB] font-bold'
                        : 'bg-[#F8FAFC] border-[#DCE5F0] hover:bg-slate-100 text-slate-700 font-semibold'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <span className="text-xs truncate">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={handlePrintTest}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#DCE5F0] text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Printer size={14} className="text-slate-500" />
                <span>In thử hóa đơn</span>
              </button>

              <button
                type="button"
                onClick={handleSaveClick}
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>

          {/* Thermal Print Live Preview Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                LIVE PREVIEW HÓA ĐƠN ({paperSize})
              </span>
              <span className="text-[10px] font-bold text-slate-400">IN NHIỆT XEM TRƯỚC</span>
            </div>

            <div className="bg-[#FAF9F5] border-2 border-dashed border-slate-300 rounded-xl p-5 shadow-2xs font-mono text-[11px] text-slate-800 leading-relaxed flex flex-col gap-3 min-h-[460px]">
              
              {/* Logo */}
              {showLogo && (
                <div className="flex flex-col items-center gap-1 text-center border-b border-dashed border-slate-300 pb-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-xs">
                    DU
                  </div>
                  <strong className="text-[10px] tracking-widest font-black uppercase mt-0.5">DUDI LAUNDRY</strong>
                </div>
              )}

              {/* Header text */}
              <div className="text-center font-bold text-xs uppercase leading-tight border-b border-dashed border-slate-300 pb-2.5">
                {headerText || 'TIỆM GIẶT ỦI'}
              </div>

              {/* Store info */}
              <div className="flex flex-col gap-1 border-b border-dashed border-slate-300 pb-2 text-[10px]">
                <div className="flex justify-between"><span>Cửa hàng:</span><span>Chi nhánh Q1</span></div>
                <div className="flex justify-between"><span>Địa chỉ:</span><span>123 Nguyễn Huệ</span></div>
                <div className="flex justify-between"><span>Hotline:</span><span>1900 1234</span></div>
              </div>

              {/* Customer info */}
              <div className="flex flex-col gap-1 border-b border-dashed border-slate-300 pb-2 text-[10px]">
                <div className="flex justify-between"><span>Khách hàng:</span><strong>Nguyễn Văn An</strong></div>
                <div className="flex justify-between"><span>SĐT:</span><span>0901234567</span></div>
              </div>

              {/* Order items */}
              <div className="flex flex-col gap-1.5 border-b border-dashed border-slate-300 pb-2.5 text-[10px]">
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
                  <div className="flex justify-between text-slate-500 text-[9px]">
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
                  <div className="text-slate-500 text-[9px] italic pt-0.5">
                    * Ghi chú: Giặt sạch vết bùn đất gót giày.
                  </div>
                )}
              </div>

              {/* Total payment */}
              <div className="flex flex-col gap-1 border-b border-dashed border-slate-300 pb-2 text-[11px] font-bold">
                <div className="flex justify-between"><span>Tổng cộng:</span><span>90.000đ</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-1 text-xs font-black text-slate-900">
                  <span>Thực thu:</span>
                  <span>90.000đ</span>
                </div>
              </div>

              {/* QR code */}
              {showQr && (
                <div className="flex flex-col items-center gap-1.5 border-b border-dashed border-slate-300 pb-2.5 text-center">
                  <div className="w-16 h-16 bg-white border border-slate-300 p-1 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-900 flex flex-wrap p-0.5 gap-0.5 justify-center content-center">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 ${i % 3 === 0 || i % 5 === 2 ? 'bg-white' : 'bg-slate-900'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Quét QR tra cứu đơn</span>
                </div>
              )}

              {/* Thanks footer */}
              {showThanks && (
                <div className="text-center text-[10px] text-slate-600 italic leading-relaxed pt-1">
                  {footerText || 'Cảm ơn quý khách!'}
                </div>
              )}

              <div className="mt-auto text-center text-[8px] text-slate-400 font-mono border-t border-dashed border-slate-300 pt-2">
                Mã tra cứu: DUDI-ORD-998822
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TEST ZNS SMS MODAL */}
      <Modal
        isOpen={testSmsModalOpen}
        onClose={() => setTestSmsModalOpen(false)}
        title="Gửi thử tin nhắn ZNS"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-xs text-slate-800 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-800">Số điện thoại người nhận *</label>
            <input
              type="text"
              placeholder="Ví dụ: 0901234567"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#DCE5F0] focus:border-[#2563EB] rounded-md text-slate-900 text-xs font-semibold outline-none"
            />
          </div>

          <div className="bg-[#F8FAFC] border border-[#DCE5F0] rounded-md p-3 flex flex-col gap-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-slate-900">Nội dung tin nhắn giả lập sẽ gửi:</span>
            <p className="italic bg-white p-2 rounded border border-slate-200 leading-relaxed text-slate-700">
              {activeTemplateText
                .replace(/{Ten_Khach}/g, 'Nguyễn Văn An')
                .replace(/{Ma_Don}/g, 'ORD-12345')
                .replace(/{Tong_Tien}/g, '90.000đ')
              }
            </p>
          </div>

          <div className="flex justify-end gap-2.5 mt-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTestSmsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors cursor-pointer border-0"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSendTestSms}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-md transition-colors cursor-pointer border-0 shadow-2xs"
            >
              Xác nhận gửi
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRM SAVE DIALOG */}
      <ConfirmDialog
        isOpen={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        onConfirm={() => {
          setSaveConfirmOpen(false);
          executeSave();
        }}
        title="Xác nhận lưu cấu hình"
        variant="primary"
        message="Thay đổi mẫu hóa đơn sẽ ảnh hưởng đến việc in ấn của toàn bộ hệ thống cửa hàng. Bạn có chắc chắn muốn tiếp tục?"
      />
    </div>
  );
}
