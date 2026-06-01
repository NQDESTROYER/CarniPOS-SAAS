import { usePOSStore } from '../store/posStore';
import { useState } from 'react';
import { X, User, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export const CheckoutModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, salesChannel, processSale, clients } = usePOSStore();
  const [method, setMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia' | 'FIAR'>('Efectivo');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.prices[salesChannel] * item.quantity), 0);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = () => {
    if (method === 'FIAR' && !selectedClient) return;
    processSale(method, selectedClient);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-surface-container border-2 border-on-surface/5 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
        {success ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-16 h-16" />
             </div>
             <h2 className="text-4xl font-black uppercase tracking-tighter italic">Venta Exitosa</h2>
             <p className="text-on-surface/50 font-bold mt-2 uppercase tracking-widest text-sm">El comprobante ha sido generado</p>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-surface flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Finalizar Cobro</h2>
                <p className="text-on-surface/40 font-bold uppercase tracking-widest text-xs mt-1">Selecciona el método de pago</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                {(['Efectivo', 'Tarjeta', 'Transferencia', 'FIAR'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={clsx(
                      "w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between group",
                      method === m 
                        ? "bg-primary border-primary text-surface shadow-[0_10px_20px_rgba(255,45,120,0.2)]" 
                        : "bg-surface border-transparent hover:border-on-surface/10"
                    )}
                  >
                    <span className="font-black uppercase tracking-widest text-lg italic">{m}</span>
                    {method === m && <CheckCircle2 className="w-6 h-6" />}
                  </button>
                ))}
              </div>

              <div className="flex flex-col justify-between">
                {method === 'FIAR' ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-surface p-4 rounded-2xl border border-on-surface/5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 mb-2">Buscar Cliente</label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30" />
                         <input 
                            type="text" 
                            placeholder="Nombre del cliente..."
                            className="w-full bg-surface-container border-2 border-transparent focus:border-primary outline-none py-2 pl-10 pr-4 rounded-xl font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                         />
                      </div>
                      
                      <div className="mt-4 max-h-40 overflow-y-auto space-y-1 pr-2">
                        {filteredClients.map(client => (
                          <button
                            key={client.id}
                            onClick={() => setSelectedClient(client.id)}
                            className={clsx(
                              "w-full p-3 rounded-xl text-left transition-colors flex justify-between items-center",
                              selectedClient === client.id ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-surface-container"
                            )}
                          >
                            <span className="font-bold">{client.name}</span>
                            <span className="text-[10px] font-black opacity-50">DEUDA: ${client.debt.toLocaleString('es-CL')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface p-8 rounded-3xl border border-on-surface/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/30">Total a Pagar</span>
                    <span className="text-6xl font-black text-primary tracking-tighter italic my-4">
                       ${total.toLocaleString('es-CL')}
                    </span>
                    <span className="bg-success/10 text-success text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Listo para procesar</span>
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={method === 'FIAR' && !selectedClient}
                  className="w-full py-6 bg-primary text-surface rounded-2xl font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,45,120,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 mt-8"
                >
                  Confirmar {method}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
