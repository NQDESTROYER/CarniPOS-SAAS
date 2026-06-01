import { LayoutDashboard, Wallet, BarChart3, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  onOpenFiados: () => void;
  onOpenReports: () => void;
}

export const Sidebar = ({ onOpenFiados, onOpenReports }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Ventas', active: true },
    { icon: Wallet, label: 'Fiados', onClick: onOpenFiados },
    { icon: BarChart3, label: 'Reportes', onClick: onOpenReports },
    { icon: Settings, label: 'Config' },
  ];

  return (
    <div className="w-24 bg-surface border-r-2 border-surface-container flex flex-col items-center py-8 justify-between">
      <div className="space-y-8">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={clsx(
              "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
              item.active 
                ? "bg-primary text-surface shadow-[0_0_20px_rgba(255,45,120,0.3)]" 
                : "text-on-surface/40 hover:bg-surface-container hover:text-primary"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      <button className="w-14 h-14 rounded-2xl flex items-center justify-center text-on-surface/20 hover:text-error hover:bg-error/10 transition-all">
        <LogOut className="w-6 h-6" />
      </button>
    </div>
  );
};
