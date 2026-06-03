import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Reportes = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Reportes</h1>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
          <p>Panel de reportes en desarrollo.</p>
        </div>
      </div>
    </div>
  );
};
