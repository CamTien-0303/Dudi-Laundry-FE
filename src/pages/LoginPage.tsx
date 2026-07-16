import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn } from 'lucide-react';
import AppLogo from '../components/common/AppLogo';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import InlineAlert from '../components/common/InlineAlert';
import Checkbox from '../components/common/Checkbox';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const emailVal = (formData.get('email') as string || '').trim().toLowerCase();
    const passwordVal = formData.get('password') as string || '';

    if (!emailVal) {
      setError('Vui lòng nhập Email hoặc SĐT.');
      return;
    }
    if (!passwordVal) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    // Mock Login Routing logic
    if (emailVal.includes('admin')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/store/dashboard');
    }
  };

  return (
    <div className="login-page select-none">
      <div className="login-card">
        <div className="login-card__header flex flex-col items-center">
          <AppLogo />
          <h1 className="text-lg font-bold text-foreground mt-3">Đăng nhập hệ thống quản lý</h1>
          <p className="login-card__subtitle text-center mt-1">
            Dành cho Admin, chủ tiệm và nhân viên được cấp tài khoản.
          </p>
        </div>

        {error && (
          <InlineAlert
            variant="danger"
            message={error}
            className="mb-4"
          />
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <Input
            id="email"
            name="email"
            label="Email hoặc SĐT"
            type="text"
            placeholder="Nhập email hoặc số điện thoại"
            required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            required
          />

          <div className="flex items-center justify-between text-xs mt-1">
            <Checkbox
              id="remember"
              name="remember"
              label="Ghi nhớ đăng nhập"
            />
            <button
              type="button"
              className="link-btn text-xs"
              onClick={() => alert('Tính năng quên mật khẩu hiện chưa khả dụng trong bản demo.')}
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button variant="primary" size="lg" type="submit" className="mt-2">
            <LogIn size={18} />
            Đăng nhập
          </Button>
        </form>

        <div className="login-card__footer mt-6">
          <p className="login-card__hint text-xs text-muted-foreground mb-2">Khu vực Demo thử nghiệm:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/customer')}>
              Vào trang khách hàng
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
              Demo Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/store/dashboard')}>
              Demo Chủ tiệm
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-3 text-center">
            Các nút demo chỉ dùng trong môi trường phát triển.
          </p>
        </div>
      </div>
    </div>
  );
}
