import { Droplets } from 'lucide-react';

interface AppLogoProps {
  collapsed?: boolean;
  variant?: 'default' | 'light';
}

export default function AppLogo({ collapsed = false, variant = 'default' }: AppLogoProps) {
  const isLight = variant === 'light';
  
  return (
    <div className="app-logo">
      <div className={`app-logo__icon ${isLight ? 'bg-white/20 shadow-none' : ''}`} style={isLight ? { background: 'rgba(255, 255, 255, 0.2)' } : {}}>
        <Droplets size={28} color="white" />
      </div>
      {!collapsed && (
        <div className="app-logo__text">
          <span className={`app-logo__name ${isLight ? 'text-white' : ''}`}>DUDI</span>
          <span className={`app-logo__tagline ${isLight ? 'text-white/70' : ''}`}>Laundry</span>
        </div>
      )}
    </div>
  );
}
