import { Droplets } from 'lucide-react';

interface AppLogoProps {
  collapsed?: boolean;
}

export default function AppLogo({ collapsed = false }: AppLogoProps) {
  return (
    <div className="app-logo">
      <div className="app-logo__icon">
        <Droplets size={28} />
      </div>
      {!collapsed && (
        <div className="app-logo__text">
          <span className="app-logo__name">DUDI</span>
          <span className="app-logo__tagline">Laundry</span>
        </div>
      )}
    </div>
  );
}
