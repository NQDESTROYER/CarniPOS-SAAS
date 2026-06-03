import { create } from 'zustand';
import { api } from '../services/api';

interface Product {
  id: string;
  nombre: string;
  categoria: { nombre: string };
  preciosCanal: Array<{ canal: string; precio_kilo: number }>;
}

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface Shift {
  id: string;
  estado: 'ABIERTO' | 'CERRADO';
}

interface Client {
  id: string;
  nombre: string;
  deuda_total: number;
  credito_disponible: number;
}

type Channel = 'VITRINA' | 'MAYORISTA' | 'CANAL_ENTERO';

interface POSState {
  salesChannel: Channel;
  cart: CartItem[];
  productsByChannel: Record<string, Product[]>; // Cache por canal
  clients: Client[];
  activeShift: Shift | null;
  loading: boolean;
  lastFetch: {
    products: Record<string, number>;
    clients: number;
  };
  
  setSalesChannel: (channel: Channel) => void;
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchClients: (force?: boolean) => Promise<void>;
  fetchActiveShift: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  processSale: (method: string, clientId?: string) => Promise<void>;
}

const CACHE_TIME = 1000 * 60 * 5; // 5 minutos

export const usePOSStore = create<POSState>((set, get) => ({
  salesChannel: 'VITRINA',
  cart: [],
  productsByChannel: {},
  clients: [],
  activeShift: null,
  loading: false,
  lastFetch: {
    products: {},
    clients: 0
  },

  setSalesChannel: (salesChannel) => {
    set({ salesChannel });
    // Gatillar carga en segundo plano si no está en caché, pero sin bloquear el cambio de pestaña
    get().fetchProducts();
  },

  fetchActiveShift: async () => {
    try {
      const shift = await api.get('/caja/activo');
      set({ activeShift: shift });
    } catch (error) {
      console.error('Error fetching active shift:', error);
    }
  },

  fetchProducts: async (force = false) => {
    const channel = get().salesChannel;
    const now = Date.now();
    
    // Si ya tenemos los productos de este canal y el caché es válido, no hacer nada
    if (!force && get().productsByChannel[channel] && (now - (get().lastFetch.products[channel] || 0) < CACHE_TIME)) {
      return;
    }

    // Solo mostrar loading si es la primera vez que cargamos este canal
    if (!get().productsByChannel[channel]) {
      set({ loading: true });
    }

    try {
      const data = await api.get(`/products?canal=${channel}`);
      set((state) => ({ 
        productsByChannel: { ...state.productsByChannel, [channel]: data },
        lastFetch: { 
          ...state.lastFetch, 
          products: { ...state.lastFetch.products, [channel]: now } 
        } 
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchClients: async (force = false) => {
    const now = Date.now();
    if (!force && get().clients.length > 0 && (now - get().lastFetch.clients < CACHE_TIME)) {
      return;
    }

    try {
      const data = await api.get('/clientes');
      set({ 
        clients: data,
        lastFetch: { ...get().lastFetch, clients: now }
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  },

  addToCart: (product) => set((state) => {
    const price = product.preciosCanal.find(p => p.canal === state.salesChannel)?.precio_kilo || 0;
    const existing = state.cart.find(item => item.id === product.id);
    
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 0.1 } : item
        )
      };
    }
    
    return { 
      cart: [...state.cart, { 
        id: product.id, 
        name: product.nombre, 
        category: product.categoria.nombre, 
        price, 
        quantity: 1 
      }] 
    };
  }),

  updateQuantity: (index, qty) => set((state) => {
    const newCart = [...state.cart];
    if (newCart[index]) {
      newCart[index].quantity = qty;
    }
    return { cart: newCart };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),

  clearCart: () => set({ cart: [] }),

  processSale: async (method, clientId) => {
    const { cart, salesChannel, activeShift } = get();
    
    if (!activeShift) {
      throw new Error('No hay un turno de caja abierto');
    }

    try {
      await api.post('/ventas', {
        turno_id: activeShift.id,
        canal_venta: salesChannel,
        metodo_pago: method.toUpperCase(),
        cliente_id: clientId || undefined,
        items: cart.map(item => ({
          producto_id: item.id,
          cantidad_kg: item.quantity,
        }))
      });
      set({ cart: [] });
      if (method === 'FIAR') get().fetchClients(true);
    } catch (error) {
      console.error('Error processing sale:', error);
      throw error;
    }
  },
}));
