import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { usePOSStore } from '../store/posStore';

export const Cart = ({ onOpenCheckout }: { onOpenCheckout: () => void }) => {
  const { cart, removeFromCart, salesChannel } = usePOSStore();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.prices[salesChannel] * item.quantity), 0);

  return (
    <div className="w-[400px] bg-surface-container border-l-2 border-surface flex flex-col h-full">
      <div className="p-6 border-b border-surface flex items-center justify-between">
         <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-black uppercase tracking-widest text-sm">Resumen de Venta</h2>
         </div>
         <span className="bg-surface px-3 py-1 rounded-full text-[10px] font-bold text-primary border border-primary/20">
           {cart.length} ITEMS
         </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-on-surface/20">
             <ShoppingCart className="w-16 h-16 mb-4 stroke-[1]" />
             <p className="font-bold uppercase tracking-widest text-sm">Carrito Vacío</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-surface p-4 rounded-xl flex items-center justify-between group">
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-on-surface/40 uppercase tracking-tighter">
                    {item.quantity} kg x ${item.prices[salesChannel].toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <span className="font-black text-primary italic">
                   ${(item.prices[salesChannel] * item.quantity).toLocaleString('es-CL')}
                </span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-surface space-y-4">
        <div className="space-y-2">
           <div className="flex justify-between text-on-surface/50 font-bold text-xs uppercase tracking-widest">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
           </div>
           <div className="flex justify-between text-on-surface/50 font-bold text-xs uppercase tracking-widest">
              <span>Impuestos (IVA 19%)</span>
              <span>Incluido</span>
           </div>
           <div className="flex justify-between items-end pt-2">
              <span className="font-black uppercase tracking-tighter text-xl italic">Total</span>
              <span className="text-4xl font-black text-primary tracking-tighter italic">
                ${subtotal.toLocaleString('es-CL')}
              </span>
           </div>
        </div>

        <button 
          onClick={onOpenCheckout}
          disabled={cart.length === 0}
          className="w-full py-5 bg-primary rounded-xl font-black uppercase tracking-[0.2em] text-surface shadow-[0_10px_30px_rgba(255,45,120,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-3"
        >
          <CreditCard className="w-6 h-6" />
          Cobrar Ahora
        </button>
      </div>
    </div>
  );
};
