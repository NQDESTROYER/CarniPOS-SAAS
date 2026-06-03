import { useState, useEffect } from 'react';
import { 
  Box, 
  Plus, 
  ArrowRight, 
  Scale, 
  AlertCircle,
  TrendingDown,
  X
} from 'lucide-react';
import { formatCLP } from '../utils/cn';
import { api } from '../services/api';

export const Inventario = () => {
  const [lotes, setLotes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const [desposteData, setDesposteData] = useState({ merma: 0 });

  const fetchLotes = async () => {
    try {
      const data = await api.get('/lotes');
      setLotes(data);
    } catch (error) {
      console.error('Error fetching lotes:', error);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const handleProcessDesposte = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simplificado para la demostración funcional
      await api.post('/desposte', {
        lote_id: selectedLote.id,
        merma_total_kg: Number(desposteData.merma),
        detalles: [] 
      });
      setIsModalOpen(false);
      fetchLotes();
    } catch (error) {
      console.error('Error processing desposte:', error);
      alert('Error al procesar el desposte');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventario y Reses</h1>
          <p className="text-slate-500 mt-1">Control de recepción y procesos de desposte.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
             <AlertCircle size={20} className="text-amber-500" />
             Reportar Merma
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg active:scale-95">
            <Plus size={20} />
            Recepción de Res
          </button>
        </div>
      </div>

      {isModalOpen && selectedLote && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleProcessDesposte} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Procesar Lote {selectedLote.numero_caravana}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <input type="number" className="w-full p-3 border rounded-xl" placeholder="Merma Total (kg)" value={desposteData.merma} onChange={e => setDesposteData({...desposteData, merma: Number(e.target.value)})} required />
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Finalizar Proceso</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Box className="text-red-500" />
            Lotes en Cámara
          </h2>
          <div className="space-y-4">
            {lotes.map((lote) => (
              <div key={lote.id} className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:shadow-xl hover:ring-2 hover:ring-red-500/20 transition-all cursor-pointer" onClick={() => { setSelectedLote(lote); setIsModalOpen(true); }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-red-500 transition-colors">
                    <Scale size={28} />
                  </div>
                  <div>
                    <p className="font-black text-lg text-slate-900">Lote {lote.numero_caravana}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{lote.calidad} • {new Date(lote.fecha_ingreso).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="font-black text-xl text-slate-900">{lote.peso_actual} kg</p>
                    <p className="text-xs text-slate-400 font-medium">{formatCLP(lote.costo_total)}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
