import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { formatCLP, cn } from '../utils/cn';

const stats = [
  { label: 'Ventas de Hoy', value: 1250400, trend: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Fiados Pendientes', value: 3450000, trend: '+2.1%', isUp: true, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Abonos Recibidos', value: 450200, trend: '+8.4%', isUp: true, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Clientes Activos', value: 142, trend: '-2', isUp: false, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

export const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Buenas tardes, Tomas</h1>
          <p className="text-slate-500 mt-1">Aquí está lo que está pasando hoy en la carnicería.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
          <Clock size={20} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Turno: Abierto hace 4h 22m</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full", stat.isUp ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50")}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {typeof stat.value === 'number' && stat.label !== 'Clientes Activos' ? formatCLP(stat.value) : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Ventas por Categoría</h2>
            <select className="bg-slate-50 border-none text-sm font-medium rounded-xl px-4 py-2 text-slate-600 outline-none ring-2 ring-transparent focus:ring-red-500/20 transition-all">
              <option>Últimos 7 días</option>
              <option>Este mes</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[65, 45, 80, 55, 90, 70, 40].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="bg-slate-100 group-hover:bg-red-500 transition-all duration-500 rounded-t-2xl w-full" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCLP(h * 15000)}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold text-center mt-3 uppercase tracking-wider">Día {i+1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white">
          <h2 className="text-xl font-bold mb-6">Próximos Vencimientos</h2>
          <div className="space-y-4">
            {[
              { name: 'Asado de Tira (Lote #442)', qty: '15.4 kg', days: '2 días' },
              { name: 'Lomo Vetado (Lote #440)', qty: '8.2 kg', days: 'Hoy' },
              { name: 'Pulpa de Cerdo (Lote #438)', qty: '22.0 kg', days: '4 días' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer group">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.qty}</p>
                </div>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg", item.days === 'Hoy' ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300")}>
                  {item.days}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all transform active:scale-95">
            Gestionar Stock
          </button>
        </div>
      </div>
    </div>
  );
};
