import { usePOSStore } from '../store/posStore';
import type { SalesChannel } from '../types/pos';
import { clsx } from 'clsx';

export const Header = () => {
  const { salesChannel, setSalesChannel } = usePOSStore();
  
  const channels: SalesChannel[] = ['Vitrina', 'Mayorista', 'Canal Entero'];

  return (
    <header className="h-20 border-b-2 border-surface-container flex items-center justify-between px-8 bg-surface">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-surface">CP</div>
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">CarniSaaS <span className="text-primary not-italic">POS</span></h1>
      </div>

      <div className="flex bg-surface-container p-1 rounded-xl">
        {channels.map((channel) => (
          <button
            key={channel}
            onClick={() => setSalesChannel(channel)}
            className={clsx(
              "px-6 py-2 rounded-lg font-bold transition-all uppercase text-sm tracking-widest",
              salesChannel === channel 
                ? "bg-primary text-surface shadow-[0_0_20px_rgba(255,45,120,0.3)]" 
                : "text-on-surface hover:bg-surface"
            )}
          >
            {channel}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface/50 font-bold">Cajera de Turno</div>
          <div className="font-bold">Valeria S.</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container border border-on-surface/10 overflow-hidden">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Valeria" alt="Avatar" />
        </div>
      </div>
    </header>
  );
};
