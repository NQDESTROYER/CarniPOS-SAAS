import { usePOSStore } from '../store/posStore';
import { useState, useEffect } from 'react';
import { X, User, CheckCircle2, Wallet, CreditCard, Landmark, BookOpen } from 'lucide-react';
import { cn, formatCLP } from '../utils/cn';

export const CheckoutModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, processSale, clients, fetchClients, fetchActiveShift, activeShift } = usePOSStore();
  const [method, setMethod] = useState<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'FIAR'>('EFECTIVO');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetchClients(),
        fetchActiveShift()
      ]);
    }
  }, [isOpen, fetchClients, fetchActiveShift]);

  const filteredClients = (clients || []).filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = async () => {
    setError(null);
    if (!activeShift) {
      setError('No hay un turno de caja abierto para procesar la venta.');
      return;
    }
    if (method === 'FIAR' && !selectedClient) {
      setError('Debes seleccionar un cliente para vender al fiado.');
      return;
    }
    
    try {
      await processSale(method, selectedClient);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la venta');
    }
  };

  const paymentMethods = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'TARJETA', label: 'Tarjeta', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'TRANSFERENCIA', label: 'Transfer', icon: Landmark, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'FIAR', label: 'Fiado (Crédito)', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200">
        {success ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-16 h-16" />
             </div>
             <h2 className="text-4xl font-bold text-slate-900">¡Venta Exitosa!</h2>
             <p className="text-slate-500 font-medium mt-2">La transacción se ha registrado correctamente</p>
          </div>
        ) : (
          <div className="flex flex-col h-[600px]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Finalizar Venta</h2>
                <p className="text-slate-500 text-sm mt-1">Selecciona el método de pago para completar el cobro</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Métodos de Pago */}
              <div className="w-1/3 border-r border-slate-100 p-8 space-y-3 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Medios de Pago</p>
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      method === m.id 
                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200" 
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", method === m.id ? "bg-white/20" : m.bg)}>
                      <m.icon className={cn("w-6 h-6", method === m.id ? "text-white" : m.color)} />
                    </div>
                    <span className="font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Selección de Cliente o Resumen */}
              <div className="flex-1 p-8 bg-slate-50/50 flex flex-col">
                {method === 'FIAR' ? (
                  <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Seleccionar Cliente</p>
                    <div className="relative mb-4">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                       <input 
                          type="text" 
                          placeholder="Buscar por nombre..."
                          className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none py-3 pl-12 pr-4 rounded-2xl font-medium transition-all"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                       />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {filteredClients.map(client => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client.id)}
                          className={cn(
                            "w-full p-4 rounded-2xl text-left transition-all flex justify-between items-center group",
                            selectedClient === client.id 
                              ? "bg-amber-100 border-2 border-amber-500 text-amber-900" 
                              : "bg-white border border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <div>
                            <p className="font-bold">{client.nombre}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Crédito disp: {formatCLP(client.credito_disponible)}</p>
                          </div>
                          {selectedClient === client.id && <CheckCircle2 className="text-amber-600" size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-6">
                      <Wallet className="text-red-600" size={32} />
                    </div>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Total a Recibir</p>
                    <h3 className="text-6xl font-bold text-slate-900 tracking-tighter my-2">
                       {formatCLP(total)}
                    </h3>
                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4">
                      <CheckCircle2 size={14} />
                      Listo para Cobrar
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-medium flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={method === 'FIAR' && !selectedClient}
                  className="w-full mt-8 py-5 bg-slate-900 hover:bg-red-600 text-white rounded-2xl font-bold text-lg shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                >
                  Confirmar Pago
                  <CheckCircle2 className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
