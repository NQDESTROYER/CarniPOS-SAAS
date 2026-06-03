import { 
  Wallet, 
  Lock, 
  Unlock, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { cn, formatCLP } from '../utils/cn';

export const Caja = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Caja y Turnos</h1>
          <p className="text-slate-500 mt-1">Control de flujo de efectivo y arqueos.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95">
            <Lock size={20} />
            Cerrar Turno (Arqueo)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumen de Caja */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ventas del Día</p>
                <p className="text-3xl font-black text-slate-900">{formatCLP(1250400)}</p>
                <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                   <TrendingUp size={14} /> +15.2% vs ayer
                </p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Abonos Fiados</p>
                <p className="text-3xl font-black text-blue-600">{formatCLP(450200)}</p>
                <p className="text-xs text-slate-500 font-medium">Recaudación de deudas</p>
             </div>
             <div className="space-y-1 bg-slate-900 p-6 rounded-3xl text-white -m-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total en Efectivo</p>
                <p className="text-3xl font-black text-white">{formatCLP(1700600)}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Monto esperado en gaveta</p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Últimos Movimientos de Caja</h3>
                <button className="text-xs font-bold text-red-500 hover:underline">Ver todo el historial</button>
             </div>
             <div className="divide-y divide-slate-50">
                {[
                  { desc: 'Venta POS #1229 - Efectivo', type: 'Venta', amount: 15400, time: '14:22', icon: TrendingUp, color: 'text-emerald-500' },
                  { desc: 'Abono Cliente: Juan Pérez', type: 'Abono', amount: 45000, time: '14:10', icon: Wallet, color: 'text-blue-500' },
                  { desc: 'Venta POS #1228 - Tarjeta', type: 'Venta', amount: 89000, time: '13:55', icon: TrendingUp, color: 'text-emerald-500' },
                  { desc: 'Salida de Caja: Insumos Limpieza', type: 'Gasto', amount: -5000, time: '12:30', icon: TrendingDown, color: 'text-red-500' },
                ].map((mov, i) => (
                  <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl bg-slate-100", mov.color)}>
                           <mov.icon size={18} />
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{mov.desc}</p>
                           <p className="text-xs text-slate-500">{mov.time} • {mov.type}</p>
                        </div>
                     </div>
                     <p className={cn("font-black text-lg", mov.amount < 0 ? "text-red-500" : "text-slate-900")}>
                        {mov.amount > 0 ? '+' : ''}{formatCLP(mov.amount)}
                     </p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Informativo */}
        <div className="space-y-6">
           <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2.5rem] text-amber-900">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle size={24} className="text-amber-500" />
                 <h3 className="font-bold">Recordatorio de Seguridad</h3>
              </div>
              <p className="text-sm leading-relaxed opacity-80">
                 No olvides realizar retiros parciales si el efectivo en caja supera los **$500.000**.
              </p>
              <button className="mt-6 w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all">
                 Realizar Retiro Parcial
              </button>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <FileText size={20} className="text-slate-400" />
                 Reportes Rápidos
              </h3>
              <div className="space-y-2">
                 {['X-Report (Parcial)', 'Z-Report (Final)', 'Detalle de Abonos', 'Libro de Ventas'].map(rep => (
                   <button key={rep} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors flex items-center justify-between group">
                      {rep}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

function ArrowRight(props: any) {
  return <Unlock {...props} />
}
