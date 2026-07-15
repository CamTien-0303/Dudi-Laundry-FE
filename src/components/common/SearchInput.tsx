import { Search, X } from 'lucide-react';
import Input from './Input';
import type { InputProps } from './Input';

interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export default function SearchInput({ value, onClear, onChange, ...props }: SearchInputProps) {
  const hasValue = !!value;

  return (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      leftIcon={<Search size={16} />}
      rightIcon={
        hasValue && onClear ? (
          <button
            type="button"
            className="flex items-center justify-center text-muted hover:text-foreground cursor-pointer"
            onClick={onClear}
            aria-label="Xóa tìm kiếm"
          >
            <X size={16} />
          </button>
        ) : undefined
      }
      {...props}
    />
  );
}
