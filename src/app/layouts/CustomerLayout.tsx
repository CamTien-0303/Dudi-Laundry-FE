import { Outlet, NavLink } from 'react-router';
import { Home, ClipboardList, User } from 'lucide-react';
import AppLogo from '../../components/common/AppLogo';

export default function CustomerLayout() {
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
          </div>
          
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs select-none border border-blue-100">
            KH
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full bg-slate-50 min-w-0">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 pt-[28px] pb-24 md:pb-8">
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
      </nav>
    </div>
  );
}
