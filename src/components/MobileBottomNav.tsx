import React from 'react';
import { Home, Grid, ShoppingBag, LayoutDashboard, HelpCircle } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  userRole?: 'buyer' | 'seller' | 'admin' | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  cartCount,
  userRole
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-around px-4 shadow-lg pb-safe">
      <button 
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${currentView === 'home' ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <Home size={18} />
        <span className="text-[10px] font-bold mt-1">Home</span>
      </button>

      <button 
        onClick={() => onNavigate('products')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${currentView === 'products' ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <Grid size={18} />
        <span className="text-[10px] font-bold mt-1">Catalog</span>
      </button>

      <button 
        onClick={() => onNavigate('cart')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all relative ${currentView === 'cart' ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <ShoppingBag size={18} />
        {cartCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-bold mt-1">Cart</span>
      </button>

      <button 
        onClick={() => {
          if (userRole === 'admin') onNavigate('admin-dashboard');
          else if (userRole === 'seller') onNavigate('seller-dashboard');
          else onNavigate('user-dashboard');
        }}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${['user-dashboard', 'seller-dashboard', 'admin-dashboard'].includes(currentView) ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <LayoutDashboard size={18} />
        <span className="text-[10px] font-bold mt-1">Dash</span>
      </button>

      <button 
        onClick={() => onNavigate('help-center')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${currentView === 'help-center' ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <HelpCircle size={18} />
        <span className="text-[10px] font-bold mt-1">Help</span>
      </button>
    </div>
  );
};
