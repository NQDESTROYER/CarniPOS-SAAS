import { ShoppingCart, Trash2, CreditCard, Plus, Minus } from 'lucide-react';
import { usePOSStore } from '../store/posStore';

export const Cart = ({ onOpenCheckout }: { onOpenCheckout: () => void }) => {
  const { cart, removeFromCart, updateQuantity } = usePOSStore();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="w-[400px] bg-slate-50 border-l border-slate-200 flex flex-col h-full shadow-2xl">
      <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-slate-900">Carrito de Venta</h2>
         </div>
         <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-wider">
           {cart.length} productos
         </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <ShoppingCart className="w-16 h-16 mb-4 stroke-[1]" />
             <p className="font-bold uppercase tracking-widest text-xs">El carrito está vacío</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group transition-all hover:border-red-200">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">${item.price.toLocaleString('es-CL')} / kg</p>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <input 
                      type="number"
                      step="0.001"
                      min="0.001"
                      className="w-20 bg-white text-center text-xs font-bold text-slate-700 py-1 rounded-md border border-transparent focus:border-red-500 outline-none"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, parseFloat(e.target.value) || 0)}
                    />
                    <span className="ml-2 pr-2 text-[10px] font-bold text-slate-400 uppercase">{item.quantity < 1 ? 'g' : 'kg'}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-2">
                <span className="font-bold text-slate-900">
                   ${(item.price * item.quantity).toLocaleString('es-CL')}
                </span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-200 space-y-4">
        <div className="space-y-3">
           <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
           </div>
           <div className="flex justify-between items-end pt-2">
              <span className="font-bold text-slate-900 text-lg">Total a pagar</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600 tracking-tight">
                  ${subtotal.toLocaleString('es-CL')}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">IVA Incluido (19%)</p>
              </div>
           </div>
        </div>

        <button 
          onClick={onOpenCheckout}
          disabled={cart.length === 0}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Procesar Venta
        </button>
      </div>
    </div>
  );
};
