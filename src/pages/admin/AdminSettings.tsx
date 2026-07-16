import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertTriangle, CheckCircle, Info, Upload, Trash2 } from 'lucide-react';
import {
  PageHeader,
  Button,
  Select,
  Input,
  ConfirmDialog,
} from '../../components/common';
import { useToast } from '../../components/common/Toast';



export default function AdminSettings() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'platform' | 'region' | 'support' | 'security'>('platform');

  // PLATFORM STATE
  const [sysName, setSysName] = useState('DUDI Laundry Platform');
  const [footerText, setFooterText] = useState('© 2026 DUDI Laundry. All rights reserved.');
  const [logoHeader, setLogoHeader] = useState<string | null>(null);
  const [logoHeaderName, setLogoHeaderName] = useState('');
  const [logoHeaderError, setLogoHeaderError] = useState('');
  const [favicon, setFavicon] = useState<string | null>(null);
  const [faviconName, setFaviconName] = useState('');
  const [faviconError, setFaviconError] = useState('');
  const [logoEmail, setLogoEmail] = useState<string | null>(null);
  const [logoEmailName, setLogoEmailName] = useState('');
  const [logoEmailError, setLogoEmailError] = useState('');

  // REGION STATE
  const [language, setLanguage] = useState('Tiếng Việt');
  const [originalLanguage, setOriginalLanguage] = useState('Tiếng Việt');
  const [currency, setCurrency] = useState('VND');
  const [originalCurrency, setOriginalCurrency] = useState('VND');
  const [currencyPos, setCurrencyPos] = useState('Sau số');
  const [numSeparator, setNumSeparator] = useState('Phẩy nghìn, Chấm thập phân');
  const [timezone, setTimezone] = useState('GMT+7');

  // SUPPORT STATE
  const [hotline, setHotline] = useState('1900 1234');
  const [docLink, setDocLink] = useState('https://docs.dudi.vn');
  const [techEmail, setTechEmail] = useState('support@dudi.vn');

  // SECURITY STATE
  const [minPassLen, setMinPassLen] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Form utilities
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Load from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('dudi_sys_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sysName) setSysName(parsed.sysName);
        if (parsed.footerText) setFooterText(parsed.footerText);
        if (parsed.logoHeader) {
          setLogoHeader(parsed.logoHeader);
          setLogoHeaderName(parsed.logoHeaderName || 'logo_header.png');
        }
        if (parsed.favicon) {
          setFavicon(parsed.favicon);
          setFaviconName(parsed.faviconName || 'favicon.ico');
        }
        if (parsed.logoEmail) {
          setLogoEmail(parsed.logoEmail);
          setLogoEmailName(parsed.logoEmailName || 'logo_email.png');
        }
        if (parsed.language) {
          setLanguage(parsed.language);
          setOriginalLanguage(parsed.language);
        }
        if (parsed.currency) {
          setCurrency(parsed.currency);
          setOriginalCurrency(parsed.currency);
        }
        if (parsed.currencyPos) setCurrencyPos(parsed.currencyPos);
        if (parsed.numSeparator) setNumSeparator(parsed.numSeparator);
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.hotline) setHotline(parsed.hotline);
        if (parsed.docLink) setDocLink(parsed.docLink);
        if (parsed.techEmail) setTechEmail(parsed.techEmail);
        if (parsed.minPassLen) setMinPassLen(parsed.minPassLen);
        if (parsed.sessionTimeout) setSessionTimeout(parsed.sessionTimeout);
        if (parsed.maintenanceMode) setMaintenanceMode(parsed.maintenanceMode);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (val: string | null) => void,
    setName: (val: string) => void,
    setError: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // accept PNG, JPG, SVG
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Định dạng file không hợp lệ. Chỉ chấp nhận PNG, JPG, SVG.');
      toast('Định dạng file không hợp lệ.', 'error');
      return;
    }

    // limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Dung lượng file vượt quá giới hạn 5MB.');
      toast('Dung lượng file quá lớn.', 'error');
      return;
    }

    setName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreDefaults = () => {
    if (activeTab === 'platform') {
      setSysName('DUDI Laundry Platform');
      setFooterText('© 2026 DUDI Laundry. All rights reserved.');
      setLogoHeader(null);
      setLogoHeaderName('');
      setLogoHeaderError('');
      setFavicon(null);
      setFaviconName('');
      setFaviconError('');
      setLogoEmail(null);
      setLogoEmailName('');
      setLogoEmailError('');
      toast('Đã khôi phục cài đặt Nền tảng mặc định.', 'info');
    } else if (activeTab === 'region') {
      setLanguage('Tiếng Việt');
      setCurrency('VND');
      setCurrencyPos('Sau số');
      setNumSeparator('Phẩy nghìn, Chấm thập phân');
      setTimezone('GMT+7');
      toast('Đã khôi phục cài đặt Định dạng & Vùng mặc định.', 'info');
    } else if (activeTab === 'support') {
      setHotline('1900 1234');
      setDocLink('https://docs.dudi.vn');
      setTechEmail('support@dudi.vn');
      toast('Đã khôi phục thông tin Liên hệ & Hỗ trợ mặc định.', 'info');
    } else if (activeTab === 'security') {
      setMinPassLen(8);
      setSessionTimeout(30);
      setMaintenanceMode(false);
      toast('Đã khôi phục cấu hình Bảo mật mặc định.', 'info');
    }
    setSaveSuccess(false);
  };

  const executeSave = () => {
    const settingsData = {
      sysName,
      footerText,
      logoHeader,
      logoHeaderName,
      favicon,
      faviconName,
      logoEmail,
      logoEmailName,
      language,
      currency,
      currencyPos,
      numSeparator,
      timezone,
      hotline,
      docLink,
      techEmail,
      minPassLen,
      sessionTimeout,
      maintenanceMode
    };

    localStorage.setItem('dudi_sys_settings', JSON.stringify(settingsData));
    setOriginalLanguage(language);
    setOriginalCurrency(currency);
    setSaveSuccess(true);
    setFormErrors({});
    toast('Cấu hình hệ thống đã được cập nhật thành công', 'success');
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!sysName.trim()) errors.sysName = 'Tên hệ thống không được trống.';
    if (!currency.trim()) errors.currency = 'Đơn vị tiền tệ không được trống.';
    if (minPassLen < 6) errors.minPassLen = 'Độ dài mật khẩu tối thiểu phải từ 6 ký tự.';
    if (sessionTimeout < 5) errors.sessionTimeout = 'Session Timeout phải tối thiểu 5 phút.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast('Vui lòng kiểm tra lại thông tin nhập liệu.', 'error');
      return;
    }

    const languageOrCurrencyChanged = language !== originalLanguage || currency !== originalCurrency;
    if (languageOrCurrencyChanged) {
      setConfirmDialogOpen(true);
    } else {
      executeSave();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-800 w-full min-w-0">
      <PageHeader
        title="Cấu hình hệ thống"
        description="Thiết lập thông tin nền tảng, định dạng dữ liệu, liên hệ hỗ trợ và bảo mật."
        breadcrumb={[
          { label: 'Hệ thống', to: '/admin/dashboard' },
          { label: 'Cấu hình' },
        ]}
      />

      {/* Save Success Indicator Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-2.5 text-emerald-800 animate-fadeIn">
          <CheckCircle className="text-emerald-500 shrink-0" size={18} />
          <span className="font-extrabold text-xs">Cấu hình hệ thống đã được cập nhật thành công</span>
        </div>
      )}

      {/* Maintenance Mode Warning Screen Banner */}
      {maintenanceMode && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-1 text-red-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500 shrink-0" size={18} />
            <span className="font-extrabold text-xs">Hệ thống đang bảo trì để nâng cấp. Vui lòng quay lại sau</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold pl-6">
            Ghi chú: Super Admin vẫn có thể truy cập.
          </span>
        </div>
      )}

      <form onSubmit={handleSaveClick} className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start w-full min-w-0">
        
        {/* Left Side: Tabs Nav Controls */}
        <div className="w-full lg:w-[280px] shrink-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1.5 h-fit">
          <button
            type="button"
            onClick={() => { setActiveTab('platform'); setSaveSuccess(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'platform' ? 'bg-blue-50 text-blue-650' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Thông tin nền tảng
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('region'); setSaveSuccess(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'region' ? 'bg-blue-50 text-blue-650' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Định dạng & Vùng
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('support'); setSaveSuccess(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'support' ? 'bg-blue-50 text-blue-650' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Liên hệ & Hỗ trợ
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('security'); setSaveSuccess(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security' ? 'bg-blue-50 text-blue-650' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bảo mật & Hệ thống
          </button>
        </div>

        {/* Right Side: Tab Panel Form Details */}
        <div className="w-full min-w-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          
          {/* TAB 1: PLATFORM SETTINGS */}
          {activeTab === 'platform' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                <h3 className="text-sm font-bold text-slate-800">Thông tin nền tảng</h3>
              </div>

              <div className="relative z-10 w-full">
                <Input
                  id="sysName"
                  label="Tên hệ thống *"
                  value={sysName}
                  onChange={(e) => {
                    setSysName(e.target.value);
                    if (formErrors.sysName) setFormErrors(prev => ({ ...prev, sysName: '' }));
                  }}
                  error={formErrors.sysName}
                  placeholder="DUDI Laundry Platform"
                />
              </div>

              {/* Logo Files Upload Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 relative z-0">
                {/* Header Logo */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center">
                    Logo Header
                  </span>
                  
                  {logoHeader ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2.5 items-center justify-center h-40 relative w-full overflow-hidden">
                      <div className="flex flex-col items-center gap-1.5 w-full h-full justify-center">
                        <img src={logoHeader} alt="Header Logo Preview" className="max-h-16 object-contain" />
                        <span className="text-[9px] text-slate-450 truncate w-full font-bold px-2">{logoHeaderName}</span>
                        <button
                          type="button"
                          onClick={() => { setLogoHeader(null); setLogoHeaderName(''); }}
                          className="absolute top-2 right-2 p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-full shadow transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo-header"
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2.5 items-center justify-center h-40 relative cursor-pointer w-full"
                    >
                      <Upload size={20} className="text-slate-400" />
                      <span className="text-[10px] text-slate-550 font-bold">Bấm tải logo Header</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Định dạng PNG, JPG, SVG. Tối đa 5MB.</span>
                      <input
                        id="logo-header"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setLogoHeader, setLogoHeaderName, setLogoHeaderError)}
                        className="sr-only"
                      />
                    </label>
                  )}
                  {logoHeaderError && <span className="text-[9.5px] text-red-500 font-bold">{logoHeaderError}</span>}
                </div>

                {/* Favicon Logo */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center">
                    Favicon
                  </span>
                  
                  {favicon ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2.5 items-center justify-center h-40 relative w-full overflow-hidden">
                      <div className="flex flex-col items-center gap-1.5 w-full h-full justify-center">
                        <img src={favicon} alt="Favicon Preview" className="max-h-12 object-contain" />
                        <span className="text-[9px] text-slate-450 truncate w-full font-bold px-2">{faviconName}</span>
                        <button
                          type="button"
                          onClick={() => { setFavicon(null); setFaviconName(''); }}
                          className="absolute top-2 right-2 p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-full shadow transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="favicon"
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2.5 items-center justify-center h-40 relative cursor-pointer w-full"
                    >
                      <Upload size={20} className="text-slate-400" />
                      <span className="text-[10px] text-slate-550 font-bold">Bấm tải Favicon</span>
                      <span className="text-[9px] text-slate-450 font-semibold">Định dạng PNG, JPG, SVG. Tối đa 5MB.</span>
                      <input
                        id="favicon"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setFavicon, setFaviconName, setFaviconError)}
                        className="sr-only"
                      />
                    </label>
                  )}
                  {faviconError && <span className="text-[9.5px] text-red-500 font-bold">{faviconError}</span>}
                </div>

                {/* Email Logo */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center">
                    Logo Email
                  </span>
                  
                  {logoEmail ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2.5 items-center justify-center h-40 relative w-full overflow-hidden">
                      <div className="flex flex-col items-center gap-1.5 w-full h-full justify-center">
                        <img src={logoEmail} alt="Email Logo Preview" className="max-h-16 object-contain" />
                        <span className="text-[9px] text-slate-450 truncate w-full font-bold px-2">{logoEmailName}</span>
                        <button
                          type="button"
                          onClick={() => { setLogoEmail(null); setLogoEmailName(''); }}
                          className="absolute top-2 right-2 p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-full shadow transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo-email"
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2.5 items-center justify-center h-40 relative cursor-pointer w-full"
                    >
                      <Upload size={20} className="text-slate-400" />
                      <span className="text-[10px] text-slate-550 font-bold">Bấm tải logo Email</span>
                      <span className="text-[9px] text-slate-400 font-semibold">Định dạng PNG, JPG, SVG. Tối đa 5MB.</span>
                      <input
                        id="logo-email"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setLogoEmail, setLogoEmailName, setLogoEmailError)}
                        className="sr-only"
                      />
                    </label>
                  )}
                  {logoEmailError && <span className="text-[9.5px] text-red-500 font-bold">{logoEmailError}</span>}
                </div>
              </div>

              <Input
                id="footerText"
                label="Thông tin bản quyền Footer"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="© 2026 DUDI Laundry. All rights reserved."
              />
            </div>
          )}

          {/* TAB 2: FORMAT & REGION SETTINGS */}
          {activeTab === 'region' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                <h3 className="text-sm font-bold text-slate-800">Định dạng & Vùng</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  id="language"
                  label="Ngôn ngữ mặc định"
                  options={['Tiếng Việt', 'Tiếng Anh']}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                <Select
                  id="timezone"
                  label="Múi giờ hệ thống"
                  options={['GMT+7', 'GMT+8', 'GMT+0']}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Select
                    id="currency"
                    label="Đơn vị tiền tệ"
                    options={['VND', 'USD']}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                  {formErrors.currency && (
                    <span className="text-[10px] text-red-500 font-semibold pl-1">{formErrors.currency}</span>
                  )}
                </div>

                <Select
                  id="currencyPos"
                  label="Vị trí ký hiệu tiền tệ"
                  options={['Trước số', 'Sau số']}
                  value={currencyPos}
                  onChange={(e) => setCurrencyPos(e.target.value)}
                />
              </div>

              <Select
                id="numSeparator"
                label="Định dạng dấu phân cách số"
                options={['Phẩy nghìn, Chấm thập phân', 'Chấm nghìn, Phẩy thập phân']}
                value={numSeparator}
                onChange={(e) => setNumSeparator(e.target.value)}
              />

              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span className="font-bold">
                  Thay đổi tiền tệ sẽ ảnh hưởng đến Dashboard, báo cáo doanh thu và màn hình tạo đơn.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & SUPPORT SETTINGS */}
          {activeTab === 'support' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                <h3 className="text-sm font-bold text-slate-800">Liên hệ & Hỗ trợ</h3>
              </div>

              <Input
                id="hotline"
                label="Hotline tổng đài hỗ trợ đối tác"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="1900 1234"
              />

              <Input
                id="docLink"
                label="Link tài liệu hướng dẫn"
                value={docLink}
                onChange={(e) => setDocLink(e.target.value)}
                placeholder="https://docs.dudi.vn"
              />

              <Input
                id="techEmail"
                label="Email nhận thông báo kỹ thuật"
                type="email"
                value={techEmail}
                onChange={(e) => setTechEmail(e.target.value)}
                placeholder="support@dudi.vn"
              />
            </div>
          )}

          {/* TAB 4: SECURITY & SYSTEM SETTINGS */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                <h3 className="text-sm font-bold text-slate-800">Bảo mật & Hệ thống</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="minPassLen"
                  label="Độ dài tối thiểu mật khẩu *"
                  type="number"
                  value={minPassLen}
                  onChange={(e) => {
                    setMinPassLen(parseInt(e.target.value, 10) || 0);
                    if (formErrors.minPassLen) setFormErrors(prev => ({ ...prev, minPassLen: '' }));
                  }}
                  error={formErrors.minPassLen}
                />

                <Input
                  id="sessionTimeout"
                  label="Session Timeout (phút) *"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => {
                    setSessionTimeout(parseInt(e.target.value, 10) || 0);
                    if (formErrors.sessionTimeout) setFormErrors(prev => ({ ...prev, sessionTimeout: '' }));
                  }}
                  error={formErrors.sessionTimeout}
                />
              </div>

              {/* Maintenance Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-800">Chế độ bảo trì hệ thống (Maintenance Mode)</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Tạm thời ngăn mọi truy cập từ bên ngoài trừ Super Admin.</span>
                </div>
                <label className="inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded text-red-650 focus:ring-red-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons footer bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleRestoreDefaults}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw size={13} />
              Khôi phục mặc định
            </Button>

            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="flex items-center gap-1.5 text-xs font-bold px-5"
            >
              <Save size={14} />
              Lưu cấu hình
            </Button>
          </div>

        </div>

      </form>

      {/* Confirmation modal for critical changes (language or currency change) */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          setConfirmDialogOpen(false);
          executeSave();
        }}
        title="Xác nhận cập nhật vùng dữ liệu"
        variant="primary"
        message="Thay đổi này sẽ ảnh hưởng đến hiển thị của toàn bộ người dùng và đối tác. Bạn có chắc chắn muốn tiếp tục?"
      />
    </div>
  );
}
