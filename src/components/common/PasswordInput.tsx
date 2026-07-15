import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';
import type { InputProps } from './Input';

export default function PasswordInput(props: Omit<InputProps, 'type' | 'rightIcon'>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          tabIndex={-1}
          className="flex items-center justify-center text-muted hover:text-foreground cursor-pointer focus:outline-none"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
}
