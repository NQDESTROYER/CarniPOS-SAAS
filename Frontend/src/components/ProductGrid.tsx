import { usePOSStore } from '../store/posStore';
import type { Product } from '../types/pos';

export const ProductGrid = () => {
  const { salesChannel, addToCart } = usePOSStore();
  
  // In a real app we would filter or fetch products based on salesChannel
  const products: Product[] = [
    { id: '1', name: 'Lomo Vetado', prices: { Vitrina: 12990, Mayorista: 10990, 'Canal Entero': 9990 }, category: 'Vacuno' },
    { id: '2', name: 'Posta Rosada', prices: { Vitrina: 8990, Mayorista: 7490, 'Canal Entero': 6990 }, category: 'Vacuno' },
    { id: '3', name: 'Chuleta Parrillera', prices: { Vitrina: 5990, Mayorista: 4990, 'Canal Entero': 4490 }, category: 'Cerdo' },
    { id: '4', name: 'Pechuga de Pollo', prices: { Vitrina: 4990, Mayorista: 3990, 'Canal Entero': 3490 }, category: 'Ave' },
    { id: '5', name: 'Malaya de Cerdo', prices: { Vitrina: 7990, Mayorista: 6990, 'Canal Entero': 6490 }, category: 'Cerdo' },
    { id: '6', name: 'Sobrebasa', prices: { Vitrina: 9990, Mayorista: 8990, 'Canal Entero': 8490 }, category: 'Vacuno' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 overflow-y-auto h-full">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => addToCart(product)}
          className="group relative bg-surface-container p-4 rounded-xl border-2 border-transparent hover:border-primary transition-all text-left flex flex-col justify-between h-40 active:scale-95"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">{product.category}</span>
            <h3 className="text-xl font-bold mt-1 group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
          </div>
          
          <div className="flex items-baseline gap-1">
             <span className="text-primary font-black text-2xl tracking-tighter">
               ${product.prices[salesChannel].toLocaleString('es-CL')}
             </span>
             <span className="text-xs font-bold text-on-surface/30 uppercase">/ kg</span>
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-surface">
              <span className="text-lg font-bold">+</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
