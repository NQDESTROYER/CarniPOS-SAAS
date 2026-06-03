import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const Configuracion = () => {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/settings').then(data => setNombre(data.nombre)).catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch('/settings', { nombre });
      alert('Configuración actualizada');
    } catch (e) {
      alert('Error al guardar');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Negocio</label>
        <input 
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6"
        />
        <button onClick={handleSave} disabled={loading} className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};
