import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { FiadosPaymentModal } from './components/FiadosPaymentModal';
import { ReportsModal } from './components/ReportsModal';

function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFiadosOpen, setIsFiadosOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-surface text-on-surface overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          onOpenFiados={() => setIsFiadosOpen(true)} 
          onOpenReports={() => setIsReportsOpen(true)} 
        />
        
        <main className="flex-1 flex flex-col overflow-hidden bg-surface">
           <div className="p-6 pb-0">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Terminal de Venta</h2>
              <div className="flex items-center gap-2 mt-2">
                 <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Sincronizado con Central</span>
              </div>
           </div>
           <ProductGrid />
        </main>

        <Cart onOpenCheckout={() => setIsCheckoutOpen(true)} />
      </div>

      {/* Modals */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
      
      <FiadosPaymentModal 
        isOpen={isFiadosOpen} 
        onClose={() => setIsFiadosOpen(false)} 
      />

      <ReportsModal 
        isOpen={isReportsOpen} 
        onClose={() => setIsReportsOpen(false)} 
      />
    </div>
  );
}

export default App;
