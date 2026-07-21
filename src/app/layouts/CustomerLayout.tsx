import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { Home, ClipboardList, User, HelpCircle, LogOut, ArrowLeft } from 'lucide-react';
import AppLogo from '../../components/common/AppLogo';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsOpen(false);
    navigate('/login');
  };

  const handleBack = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/customer');
    }
  };

  const showBackButton = location.pathname !== '/customer' && location.pathname !== '/customer/';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      {/* Sticky Header with Max Width */}
      <header className="sticky top-0 w-full bg-white border-b border-slate-100 z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-4 md:px-6 h-[68px] flex items-center justify-between">
          <AppLogo />
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/customer/orders"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`
              }
            >
              Đơn hàng
            </NavLink>
            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`
              }
            >
              Tài khoản
            </NavLink>
            <NavLink
              to="/customer/support"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`
              }
            >
              Hỗ trợ
            </NavLink>
          </div>
          
          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs select-none border border-blue-100 hover:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
            >
              KH
            </button>
            
            {isOpen && (
              <>
                {/* Backdrop to close dropdown on click outside */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50 animate-fadeIn">
                  {/* Header */}
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Đang đăng nhập</p>
                    <p className="text-sm font-bold text-slate-800">Khách hàng</p>
                  </div>
                  
                  {/* Items */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/customer/profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <User size={15} className="text-slate-400" />
                      <span>Tài khoản</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/customer/support');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <HelpCircle size={15} className="text-slate-400" />
                      <span>Trợ giúp & Hướng dẫn</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-slate-100 my-1" />
                  
                  {/* Danger Logout Item */}
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} className="text-red-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full bg-slate-50 min-w-0">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 pt-[28px] pb-24 md:pb-8">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-white/80 border border-slate-200/65 px-3 py-1.5 rounded-xl transition-all select-none cursor-pointer duration-200 shadow-3xs animate-fadeIn"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              <span>Quay lại</span>
            </button>
          )}
          <Outlet />
        </div>
      </main>

      {/* Fixed Bottom Navigation (Mobile Only, hidden from md) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around z-30 select-none md:hidden shadow-lg">
        <NavLink
          to="/customer"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all px-4 py-1 rounded-xl
            ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`
          }
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>
        
        <NavLink
          to="/customer/orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all px-4 py-1 rounded-xl
            ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`
          }
        >
          <ClipboardList size={20} />
          <span>Đơn hàng</span>
        </NavLink>
        
        <NavLink
          to="/customer/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all px-4 py-1 rounded-xl
            ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`
          }
        >
          <User size={20} />
          <span>Tài khoản</span>
        </NavLink>
        
        <NavLink
          to="/customer/support"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all px-4 py-1 rounded-xl
            ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`
          }
        >
          <HelpCircle size={20} />
          <span>Hỗ trợ</span>
        </NavLink>
      </nav>
    </div>
  );
}
