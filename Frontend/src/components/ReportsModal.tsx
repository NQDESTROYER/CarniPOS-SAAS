import { usePOSStore } from '../store/posStore';
import { X, BarChart3, ShieldCheck, TrendingUp, Users, PieChart } from 'lucide-react';

export const ReportsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cashInDrawer, fiadosCollected } = usePOSStore();
  
  const totalExpected = cashInDrawer + fiadosCollected;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-surface-container border-2 border-on-surface/10 w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header - More compact */}
        <div className="p-6 border-b border-surface flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary text-surface rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tighter italic leading-tight">Reportes de Gestión</h2>
                <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em]">Resumen de Operaciones hoy</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable if needed, but designed to fit */}
        <div className="p-6 overflow-y-auto grid grid-cols-12 gap-6">
           
           {/* Primary Metrics */}
           <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-4">
              <div className="bg-surface p-6 rounded-2xl border border-on-surface/5 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center gap-2 text-primary">
                       <TrendingUp className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Ventas Efectivo</span>
                    </div>
                    <p className="text-3xl font-black mt-2 italic">${cashInDrawer.toLocaleString('es-CL')}</p>
                 </div>
                 <p className="text-[9px] text-on-surface/30 mt-4 uppercase font-bold tracking-widest">Total recaudado hoy</p>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-on-surface/5 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center gap-2 text-success">
                       <Users className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Abonos Fiados</span>
                    </div>
                    <p className="text-3xl font-black mt-2 italic text-success">${fiadosCollected.toLocaleString('es-CL')}</p>
                 </div>
                 <p className="text-[9px] text-on-surface/30 mt-4 uppercase font-bold tracking-widest">Recuperación de cartera</p>
              </div>

              {/* Added: Distribution placeholder */}
              <div className="col-span-2 bg-surface p-6 rounded-2xl border border-on-surface/5">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <PieChart className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Distribución de Métodos</span>
                    </div>
                    <span className="text-[9px] font-bold text-on-surface/20 uppercase">Solo Efectivo vs Fiado</span>
                 </div>
                 <div className="h-4 bg-surface-container rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary" style={{ width: `${(cashInDrawer / (totalExpected || 1)) * 100}%` }} />
                    <div className="h-full bg-success" style={{ width: `${(fiadosCollected / (totalExpected || 1)) * 100}%` }} />
                 </div>
                 <div className="flex justify-between mt-3">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                       <span className="text-[9px] font-bold uppercase">Ventas ({Math.round((cashInDrawer / (totalExpected || 1)) * 100)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-success" />
                       <span className="text-[9px] font-bold uppercase">Fiados ({Math.round((fiadosCollected / (totalExpected || 1)) * 100)}%)</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Total Box - More compact but still bold */}
           <div className="col-span-12 lg:col-span-4 bg-primary/5 p-6 rounded-2xl border-2 border-primary/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <BarChart3 className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 pointer-events-none" />
              
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Total en Caja</span>
              <span className="text-5xl font-black text-on-surface tracking-tighter italic">
                 ${totalExpected.toLocaleString('es-CL')}
              </span>
              
              <div className="flex items-center gap-2 mt-6 px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30">
                 <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-primary">Sincronizado</span>
              </div>

              <button
                className="w-full mt-8 py-4 bg-primary text-surface rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                onClick={onClose}
              >
                Cerrar Turno
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
