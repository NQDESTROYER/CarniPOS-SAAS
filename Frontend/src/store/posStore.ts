import { create } from 'zustand';
import type { POSState, Client } from '../types/pos';

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Juan Pérez', debt: 15000 },
  { id: 'c2', name: 'María González', debt: 45000 },
  { id: 'c3', name: 'Restaurante El Parrón', debt: 120000 },
];

export const usePOSStore = create<POSState>((set) => ({
  salesChannel: 'Vitrina',
  cart: [],
  clients: MOCK_CLIENTS,
  cashInDrawer: 0,
  fiadosCollected: 0,
  isDrawerOpen: false,

  setSalesChannel: (salesChannel) => set({ salesChannel }),

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),

  clearCart: () => set({ cart: [] }),

  processSale: (method, clientId) => set((state) => {
    const total = state.cart.reduce((acc, item) => acc + (item.prices[state.salesChannel] * item.quantity), 0);
    
    let nextCash = state.cashInDrawer;
    let nextClients = state.clients;

    if (method === 'Efectivo') {
      nextCash += total;
    } else if (method === 'FIAR' && clientId) {
      nextClients = state.clients.map(c => 
        c.id === clientId ? { ...c, debt: c.debt + total } : c
      );
    }

    return {
      cashInDrawer: nextCash,
      clients: nextClients,
      cart: []
    };
  }),

  collectFiado: (clientId, amount) => set((state) => ({
    fiadosCollected: state.fiadosCollected + amount,
    clients: state.clients.map(c => 
      c.id === clientId ? { ...c, debt: Math.max(0, c.debt - amount) } : c
    )
  })),
}));
