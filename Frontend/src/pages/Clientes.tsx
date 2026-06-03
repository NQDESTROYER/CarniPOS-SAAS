import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  History,
  Plus,
  X
} from 'lucide-react';
import { cn, formatCLP } from '../utils/cn';
import { api } from '../services/api';

export const Clientes = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ nombre: '', rut: '', telefono: '', limite_credito: 0 });

  const fetchClients = async () => {
    try {
      const data = await api.get('/clientes');
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const formatRut = (value: string) => {
    // Basic formatting: keeps digits and ends with hyphen + last char
    const clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length <= 1) return clean;
    return clean.slice(0, -1) + '-' + clean.slice(-1).toUpperCase();
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clientes', {
        ...newClient,
        limite_credito: Number(newClient.limite_credito)
      });
      setIsModalOpen(false);
      setNewClient({ nombre: '', rut: '', telefono: '', limite_credito: 0 });
      fetchClients();
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error al crear el cliente');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Fiados</h1>
          <p className="text-slate-500 mt-1">Directorio de clientes y control de deudas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateCustomer} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Nuevo Cliente</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <input className="w-full p-3 border rounded-xl" placeholder="Nombre" value={newClient.nombre} onChange={e => setNewClient({...newClient, nombre: e.target.value})} required />
            <input className="w-full p-3 border rounded-xl" placeholder="RUT (ej: 123456789)" value={newClient.rut} onChange={e => setNewClient({...newClient, rut: formatRut(e.target.value)})} />
            <input className="w-full p-3 border rounded-xl" placeholder="Teléfono" value={newClient.telefono} onChange={e => setNewClient({...newClient, telefono: e.target.value})} />
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Límite de Crédito ($)</label>
              <input type="number" className="w-full p-3 border rounded-xl" value={newClient.limite_credito} onChange={e => setNewClient({...newClient, limite_credito: Number(e.target.value)})} />
              <div className="flex gap-2">
                {[10000, 20000, 30000].map(amt => (
                  <button type="button" key={amt} onClick={() => setNewClient({...newClient, limite_credito: amt})} className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-200">
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Guardar</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Clientes */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, RUT o teléfono..."
                className="w-full bg-slate-50 border-none pl-12 pr-6 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                  <th className="px-8 py-4">Cliente</th>
                  <th className="px-8 py-4">RUT / Teléfono</th>
                  <th className="px-8 py-4 text-right">Deuda Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clients.map((client) => (
                  <tr 
                    key={client.id} 
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      "hover:bg-slate-50 cursor-pointer transition-colors group",
                      selectedClient?.id === client.id ? "bg-red-50/30" : ""
                    )}
                  >
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">{client.nombre}</p>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500">
                      <p>{client.rut}</p>
                      <p className="flex items-center gap-1 mt-1"><Phone size={12} /> {client.telefono}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className={cn("font-black text-lg", client.deuda_total > 0 ? "text-red-600" : "text-emerald-600")}>
                        {formatCLP(client.deuda_total)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detalle del Cliente Seleccionado */}
        <div className="space-y-6">
          {selectedClient ? (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                  {selectedClient.nombre[0]}
                </div>
                <h2 className="text-2xl font-black text-slate-900">{selectedClient.nombre}</h2>
                <p className="text-sm text-slate-500">{selectedClient.rut}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deuda Actual</p>
                  <p className="text-3xl font-black text-red-600">{formatCLP(selectedClient.deuda_total)}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Límite</p>
                    <p className="text-sm font-bold text-slate-700">{formatCLP(selectedClient.limite_credito)}</p>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Disponible</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCLP(selectedClient.credito_disponible)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Users size={64} strokeWidth={1} />
              <p className="mt-4 font-bold text-lg">Selecciona un cliente</p>
              <p className="text-sm max-w-[200px]">Haz clic en la lista para ver el detalle de su cuenta corriente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
