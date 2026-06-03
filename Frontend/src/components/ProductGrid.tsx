import { useEffect } from 'react';
import { usePOSStore } from '../store/posStore';
import { Package, Loader2 } from 'lucide-react';
import { cn, formatCLP } from '../utils/cn';

export const ProductGrid = () => {
  const { salesChannel, addToCart, productsByChannel, fetchProducts, loading } = usePOSStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, salesChannel]);

  const products = productsByChannel[salesChannel] || [];

  if (loading && products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold uppercase tracking-widest text-xs">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {products.map((product) => {
          const price = product.preciosCanal.find(p => p.canal === salesChannel)?.precio_kilo || 0;
          
          return (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all text-left flex flex-col justify-between h-52 active:scale-95 overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                  {product.categoria.nombre}
                </span>
                <h3 className="text-xl font-bold mt-3 text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                  {product.nombre}
                </h3>
              </div>
              
              <div className="relative z-10 flex flex-col">
                <span className="text-slate-400 text-xs font-medium">Precio por kilo</span>
                <div className="flex items-baseline gap-1">
                   <span className="text-red-600 font-bold text-3xl tracking-tighter">
                     {formatCLP(price)}
                   </span>
                </div>
              </div>
              
              {/* Decorative background icon */}
              <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 group-hover:text-red-50 transition-colors z-0" />
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <span className="text-2xl font-bold">+</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
