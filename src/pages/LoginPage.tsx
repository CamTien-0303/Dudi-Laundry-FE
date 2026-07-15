import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn } from 'lucide-react';
import AppLogo from '../components/common/AppLogo';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import InlineAlert from '../components/common/InlineAlert';

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
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!passwordVal) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    // Mock Login Routing logic
    if (emailVal === 'admin@dudi.vn') {
      navigate('/admin/dashboard');
    } else if (emailVal === 'owner@dudi.vn' || emailVal === 'store@dudi.vn') {
      navigate('/store/dashboard');
    } else {
      // Show warning for other emails but redirect to store dashboard as demo default
      navigate('/store/dashboard');
    }
  };

  return (
    <div className="login-page select-none">
      <div className="login-card">
        <div className="login-card__header">
          <AppLogo />
          <p className="login-card__subtitle">Đăng nhập vào hệ thống quản lý</p>
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
            label="Email"
            type="email"
            placeholder="example@dudi.vn"
            defaultValue="admin@dudi.vn"
            required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Mật khẩu"
            placeholder="••••••••"
            defaultValue="password"
            required
          />

          <Button variant="primary" size="lg" type="submit" className="mt-2">
            <LogIn size={18} />
            Đăng nhập
          </Button>
        </form>

        <div className="login-card__footer">
          <p className="login-card__hint">Demo: Nhấn đăng nhập hoặc Enter để vào hệ thống</p>
          <div className="login-card__links">
            <button type="button" className="link-btn" onClick={() => navigate('/customer')}>
              Trang khách hàng →
            </button>
            <button type="button" className="link-btn" onClick={() => navigate('/admin/dashboard')}>
              Trang quản trị →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
