import { 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Package, 
  Wallet, 
  LogOut,
  LayoutDashboard,
  Box
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingBag, label: 'Ventas (POS)', path: '/pos' },
  { icon: Users, label: 'Clientes (Fiados)', path: '/clientes' },
  { icon: Box, label: 'Inventario / Reses', path: '/inventario' },
  { icon: BarChart3, label: 'Reportes', path: '/reportes' },
  { icon: Wallet, label: 'Caja / Turno', path: '/caja' },
  { icon: Settings, label: 'Configuración', path: '/config' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const userInitials = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
          <Package className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-white text-xl tracking-tight">Carni<span className="text-red-500">POS</span></h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">SaaS Edition</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-red-600/10 text-red-500 font-medium" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-red-500" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-400 flex items-center justify-center font-bold text-white text-xs">
            {userInitials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.app_metadata?.role?.toLowerCase() || 'Usuario'}</p>
          </div>
        </div>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
