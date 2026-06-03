import { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Plus,
  Minus,
  X,
  CheckCircle2,
  ShoppingCart
} from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { cn, formatCLP, formatKG } from '../utils/cn';
import { usePOSStore } from '../store/posStore';
import { CheckoutModal } from '../components/CheckoutModal';

const categories = ['Todo', 'Vacuno', 'Cerdo', 'Pollo', 'Embutidos'];

export const POS = () => {
  const { 
    productsByChannel, 
    cart, 
    salesChannel, 
    loading, 
    fetchProducts, 
    setSalesChannel, 
    addToCart, 
    clearCart,
    updateQuantity,
    removeFromCart
  } = usePOSStore();

  const [activeCategory, setActiveCategory] = useState('Todo');
  const [search, setSearch] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCartIndex, setSelectedCartIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, salesChannel]);

  const products = productsByChannel[salesChannel] || [];
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 animate-in slide-in-from-right duration-500">
      {/* Catálogo */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Canales */}
        <div className="bg-white p-2 rounded-2xl flex gap-2 shadow-sm border border-slate-200">
          {['VITRINA', 'MAYORISTA', 'CANAL_ENTERO'].map(channel => (
            <button
              key={channel}
              onClick={() => setSalesChannel(channel as any)}
              className={cn(
                "flex-1 py-3 px-6 rounded-xl font-bold transition-all text-sm tracking-wide",
                salesChannel === channel 
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/30" 
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {channel}
            </button>
          ))}
        </div>

        {/* Categorías y Búsqueda */}
        <div className="flex items-center gap-4">
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all border-2",
                  activeCategory === cat 
                    ? "bg-slate-900 border-slate-900 text-white" 
                    : "bg-white border-transparent text-slate-500 hover:border-slate-200 shadow-sm"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar corte..."
              className="bg-white pl-12 pr-6 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20 w-64 shadow-sm text-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 xl:grid-cols-3 gap-4 pr-2 custom-scrollbar">
          {loading ? (
            <LoadingSpinner />
          ) : (
            products
              .filter(p => (activeCategory === 'Todo' || p.categoria.nombre === activeCategory) && p.nombre.toLowerCase().includes(search.toLowerCase()))
              .map(product => {
                const price = product.preciosCanal.find(p => p.canal === salesChannel)?.precio_kilo || 0;
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-red-500/50 transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Plus size={20} />
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">{product.categoria.nombre}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{product.nombre}</h3>
                    <p className="text-2xl font-black text-slate-900 mt-2">{formatCLP(price)}<span className="text-xs text-slate-400 font-medium"> /kg</span></p>
                  </button>
                );
              })
          )}
        </div>
      </div>

      {/* Carrito Moderno */}
      <div className="w-[450px] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="p-8 pb-4 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Detalle Venta</h2>
          </div>
          <button 
            onClick={clearCart} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Vaciar Carrito"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Lista de Items con Controles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.map((item, i) => (
            <div 
              key={item.id}
              className={cn(
                "p-4 rounded-[2rem] border-2 transition-all group",
                selectedCartIndex === i 
                  ? "bg-slate-50 border-slate-900 shadow-lg" 
                  : "bg-white border-slate-100 hover:border-slate-200"
              )}
              onClick={() => setSelectedCartIndex(i)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <input 
                    type="number"
                    step="0.001"
                    className="w-28 bg-white text-center font-black text-slate-900 text-lg py-2 rounded-xl border-2 border-slate-100 focus:border-red-500 outline-none transition-all"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        updateQuantity(i, 0);
                        return;
                      }
                      const parsed = parseFloat(val);
                      // Limitar a 3 decimales para evitar números largos
                      const rounded = Math.round(parsed * 1000) / 1000;
                      updateQuantity(i, rounded);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="ml-2 pr-3 text-xs font-bold text-slate-400 uppercase">{item.quantity < 1 ? 'g' : 'kg'}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{formatCLP(item.price)} /kg</p>
                  <p className="font-black text-lg text-slate-900">{formatCLP(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 mt-20">
              <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
                <Plus size={40} strokeWidth={1} />
              </div>
              <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Agregue productos para comenzar</p>
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        <div className="p-8 bg-slate-900 rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">Subtotal (IVA Inc.)</p>
              <p className="text-4xl font-black text-white tracking-tighter">{formatCLP(total)}</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5">
               <p className="text-white/40 font-bold text-[8px] uppercase tracking-widest text-center">Items</p>
               <p className="text-white font-black text-center">{cart.length}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-center gap-3 bg-red-600 py-6 rounded-3xl hover:bg-red-500 transition-all font-black text-xl uppercase tracking-[0.1em] text-white shadow-2xl shadow-red-900/40 transform active:scale-95 disabled:opacity-30 disabled:grayscale"
          >
            <CheckCircle2 size={28} />
            Completar Venta
          </button>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
};
