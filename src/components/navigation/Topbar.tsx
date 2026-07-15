import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Settings, HelpCircle, Menu, Search, Building2 } from 'lucide-react';
import Avatar from '../common/Avatar';

interface TopbarProps {
  title?: string;
  showBranchSelector?: boolean;
  showSearch?: boolean;
  onMenuClick?: () => void;
}

export default function Topbar({
  title,
  showBranchSelector = false,
  showSearch = false,
  onMenuClick,
}: TopbarProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Chi nhánh Quận 1');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const branches = ['Chi nhánh Quận 1', 'Chi nhánh Quận 3', 'Chi nhánh Quận 7', 'Kho trung tâm'];

  return (
    <header className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-border/50 h-16 flex items-center justify-between px-4 sm:px-6 z-30 select-none">
      {/* Left section: Hamburger (Mobile) + Title / Selector */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            className="p-1.5 hover:bg-background rounded-md text-muted hover:text-foreground md:hidden cursor-pointer"
            onClick={onMenuClick}
            aria-label="Mở menu"
          >
            <Menu size={20} />
          </button>
        )}
        
        {title && !showBranchSelector && (
          <h2 className="text-sm font-semibold text-foreground hidden sm:block">
            {title}
          </h2>
        )}

        {/* Branch Selector (Store Layout) */}
        {showBranchSelector && (
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border/80 hover:border-primary/50 text-xs font-semibold text-foreground/80 rounded-lg cursor-pointer transition-all"
              onClick={() => setBranchOpen(!branchOpen)}
            >
              <Building2 size={14} className="text-primary" />
              <span>{selectedBranch}</span>
              <ChevronDown size={12} className="text-muted" />
            </button>
            {branchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setBranchOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-44 bg-surface border border-border shadow-lg rounded-lg py-1 z-20 text-xs font-medium text-foreground/80 animate-fadeIn">
                  {branches.map((b) => (
                    <button
                      key={b}
                      className={`w-full text-left px-3.5 py-2 hover:bg-background cursor-pointer ${
                        selectedBranch === b ? 'text-primary font-semibold bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedBranch(b);
                        setBranchOpen(false);
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Center: Optional Search (Admin Layout) */}
      {showSearch && (
        <div className="hidden md:flex items-center relative w-64">
          <span className="absolute left-3 text-muted pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm hệ thống..."
            className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary/60"
          />
        </div>
      )}

      {/* Right section: Icons + User dropdown */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-muted hover:text-foreground hover:bg-background rounded-full relative cursor-pointer transition-all"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Thông báo"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-surface border border-border shadow-lg rounded-xl py-1 z-20 text-xs text-foreground/80 animate-fadeIn">
                <div className="px-4 py-2 border-b border-border/50 font-bold text-foreground">
                  Thông báo mới
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-background border-b border-border/20 cursor-pointer">
                    <p className="font-semibold text-foreground/90">Yêu cầu bảo trì máy giặt #3</p>
                    <p className="text-[10px] text-muted mt-0.5">15 phút trước</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-background border-b border-border/20 cursor-pointer">
                    <p className="font-semibold text-foreground/90">Đơn hàng mới #DL-004 đã tiếp nhận</p>
                    <p className="text-[10px] text-muted mt-0.5">1 giờ trước</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-background cursor-pointer">
                    <p className="font-semibold text-foreground/90">Kho sắp hết Nước giặt (30%)</p>
                    <p className="text-[10px] text-muted mt-0.5">5 giờ trước</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 p-1 hover:bg-background rounded-full sm:rounded-lg cursor-pointer transition-all"
            onClick={() => setUserOpen(!userOpen)}
          >
            <Avatar name="Admin User" size="sm" />
            <div className="hidden sm:flex flex-col items-start text-left leading-none">
              <span className="text-xs font-bold text-foreground">DUDI Admin</span>
              <span className="text-[10px] text-muted mt-0.5">Quản lý</span>
            </div>
            <ChevronDown size={12} className="text-muted hidden sm:block" />
          </button>
          {userOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border shadow-lg rounded-xl py-1 z-20 text-xs font-semibold text-foreground/80 animate-fadeIn">
                <div className="px-4 py-2 border-b border-border/50">
                  <p className="text-foreground">Đang đăng nhập</p>
                  <p className="text-[10px] text-muted font-medium mt-0.5">admin@dudi.vn</p>
                </div>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 hover:bg-background flex items-center gap-2 text-foreground/70 hover:text-foreground cursor-pointer"
                  onClick={() => setUserOpen(false)}
                >
                  <Settings size={14} />
                  Cài đặt tài khoản
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 hover:bg-background flex items-center gap-2 text-foreground/70 hover:text-foreground cursor-pointer"
                  onClick={() => setUserOpen(false)}
                >
                  <HelpCircle size={14} />
                  Trợ giúp & Hướng dẫn
                </button>
                <div className="border-t border-border/50 my-1" />
                <a
                  href="/login"
                  className="w-full text-left px-4 py-2.5 hover:bg-danger/5 hover:text-danger flex items-center gap-2 text-foreground/70 cursor-pointer text-xs font-bold"
                >
                  <LogOut size={14} />
                  Đăng xuất
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
