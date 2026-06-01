import { usePOSStore } from '../store/posStore';
import { useState } from 'react';
import { X, Search, DollarSign, Wallet } from 'lucide-react';
import { clsx } from 'clsx';

export const FiadosPaymentModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { clients, collectFiado } = usePOSStore();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [search, setSearch] = useState('');

  const client = clients.find(c => c.id === selectedClient);
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleCollect = () => {
    if (!selectedClient || !amount) return;
    collectFiado(selectedClient, Number(amount));
    onClose();
    setSelectedClient('');
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-surface-container border-2 border-primary/20 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-surface bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tighter italic">Abono a Deuda</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Módulo de Recaudación</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
           <div className="space-y-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface/30" />
                 <input 
                    type="text" 
                    placeholder="Buscar cliente deudor..."
                    className="w-full bg-surface border-2 border-transparent focus:border-primary outline-none py-4 pl-12 pr-4 rounded-2xl font-bold transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                {filteredClients.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClient(c.id)}
                    className={clsx(
                      "p-4 rounded-xl text-left flex justify-between items-center transition-all",
                      selectedClient === c.id ? "bg-primary text-surface" : "bg-surface hover:bg-surface-container"
                    )}
                  >
                    <span className="font-bold">{c.name}</span>
                    <span className={clsx("font-black italic", selectedClient === c.id ? "text-surface" : "text-primary")}>
                      ${c.debt.toLocaleString('es-CL')}
                    </span>
                  </button>
                ))}
              </div>
           </div>

           {client && (
             <div className="bg-surface p-6 rounded-2xl border-2 border-dashed border-primary/20 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-black uppercase tracking-widest text-on-surface/40">Monto a Recibir</span>
                   <span className="text-xs font-black text-success uppercase">Abonando a deuda</span>
                </div>
                
                <div className="relative">
                   <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                   <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-transparent text-5xl font-black tracking-tighter outline-none pl-10 placeholder:text-on-surface/10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      autoFocus
                   />
                </div>
                
                <p className="mt-4 text-[10px] font-bold text-on-surface/30 uppercase text-center tracking-widest">
                  Este monto se sumará al flujo de caja de "Fiados" y no afectará las ventas directas.
                </p>
             </div>
           )}

           <button
             onClick={handleCollect}
             disabled={!selectedClient || !amount}
             className="w-full py-5 bg-success text-surface rounded-2xl font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(0,255,148,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
           >
             <CheckCircle2 className="w-6 h-6" />
             Registrar Pago
           </button>
        </div>
      </div>
    </div>
  );
};

// Internal icon for the button
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
