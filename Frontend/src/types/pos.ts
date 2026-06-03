export type SalesChannel = 'Vitrina' | 'Mayorista' | 'Canal Entero';

export interface Product {
  id: string;
  name: string;
  prices: Record<SalesChannel, number>;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Client {
  id: string;
  name: string;
  debt: number;
}

export interface POSState {
  salesChannel: SalesChannel;
  cart: CartItem[];
  clients: Client[];
  cashInDrawer: number;
  fiadosCollected: number;
  isDrawerOpen: boolean;
  
  setSalesChannel: (channel: SalesChannel) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  processSale: (method: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'FIAR', clientId?: string) => void;
  collectFiado: (clientId: string, amount: number) => void;
}
