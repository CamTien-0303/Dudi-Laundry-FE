import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export default function Card({ title, children, className = '', icon }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || icon) && (
        <div className="card__header">
          {icon && <span className="card__icon">{icon}</span>}
          {title && <h3 className="card__title">{title}</h3>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
}
