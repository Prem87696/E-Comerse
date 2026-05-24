import React, { useState } from 'react';
import { Search, ShoppingBag, User, Laptop, Shirt, Home, LayoutDashboard, HelpCircle, ChevronDown, Menu, LogOut, ShieldCheck, Heart } from 'lucide-react';
import { Category } from '../types';
import { MegaMenu } from './MegaMenu';

interface HeaderProps {
  categories: Category[];
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  cartCount: number;
  user: { name: string; email: string; role: 'buyer' | 'seller' | 'admin' } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  currentView,
  onNavigate,
  cartCount,
  user,
  onLogout,
  onOpenLogin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('products', { search: searchQuery });
  };

  const menuItems = [
    { label: 'Shop Nexa', view: 'home' },
    { label: 'Catalog', view: 'products' },
    { label: 'Social Hub', view: 'social' },
    { label: 'Rewards Match', view: 'rewards' },
    { label: 'Help Desk', view: 'help-center' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[99999] bg-white border-b border-slate-200/80 shadow-sm">
      {/* Top Banner Offer */}
      <div className="bg-slate-900 text-white py-1 px-4 text-center font-medium tracking-wide flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase self-center shrink-0">Summer Deal</span>
        <span className="text-[10px] sm:text-xs">
          Use code <strong className="text-amber-400">NEXA25</strong> for 25% discount. Quick secure shipping!
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 sm:gap-2 text-left group shrink-0"
          id="btn-logo-home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            N
          </div>
          <div>
            <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none block">
              Shop<span className="text-blue-600">Nexa</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase hidden sm:block -mt-0.5">
              Multi-Vendor Hub
            </span>
          </div>
        </button>

        {/* Global Catalog Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search verified gadgets, leather bags, apparel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-5 pr-11 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner"
            id="global-search-input"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
            id="global-search-btn"
          >
            <Search size={14} />
          </button>
        </form>

        {/* Action Widgets */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-4">
          {/* Main Navigation links for wide desktops */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`hover:text-blue-600 transition-colors ${currentView === item.view ? 'text-blue-600' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Quick Hub Access Buttons depends on Role */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all border border-purple-100"
                >
                  <ShieldCheck size={13} />
                  <span>Admin Panel</span>
                </button>
              )}
              {user.role === 'seller' && (
                <button
                  onClick={() => onNavigate('seller-dashboard')}
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all border border-amber-100"
                >
                  <LayoutDashboard size={13} />
                  <span>Seller Hub</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('user-dashboard')}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all border border-blue-100"
              >
                <User size={13} />
                <span>My Orders</span>
              </button>
            </div>
          )}

          {/* Wishlist Icon (Hidden on mobile grid to free space) */}
          <button
            onClick={() => onNavigate('products', { filter: 'featured' })}
            className="hidden sm:flex p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-all relative"
            id="btn-wishlist-nav"
            aria-label="View Wishlist"
          >
            <Heart size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all shrink-0"
            id="btn-cart-nav"
            aria-label="View Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center animate-bounce shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Auth Toggler */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 pl-2 sm:pl-4">
              <div className="hidden xl:block text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-600 capitalize">{user.role} Account</p>
              </div>
              <button
                onClick={() => onNavigate('user-dashboard')}
                className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-inner shrink-0"
                title="Profile Portal"
              >
                {user.name.charAt(0)}
              </button>
              <button
                onClick={onLogout}
                className="hidden sm:block p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                title="Log Out Presets"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-900 text-white rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1 active:scale-[0.98] shadow-sm shadow-slate-900/10 shrink-0"
              id="btn-trigger-login"
            >
              <User size={13} />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Bars */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Sub-Header Category Navigation & Mega Menu Trigger */}
      <div className="bg-slate-50 border-t border-slate-200/60 hidden md:block relative">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onMouseEnter={() => setIsMegaOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors py-3"
            >
              <span>Explore Mega Catalog</span>
              <ChevronDown size={14} />
            </button>

            {/* Quick Categories shortcut */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('products', { category: 'electronics' })}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Laptop size={12} className="text-slate-400" />
                <span>Electronics</span>
              </button>
              <button
                onClick={() => onNavigate('products', { category: 'fashion' })}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Shirt size={12} className="text-slate-400" />
                <span>Fashion</span>
              </button>
              <button
                onClick={() => onNavigate('products', { category: 'smart-home' })}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Home size={12} className="text-slate-400" />
                <span>Smart Home</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <button onClick={() => onNavigate('help-center')} className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <HelpCircle size={13} />
              <span>Platform Rules & Rates</span>
            </button>
          </div>
        </div>

        {/* Mega Menu Integration Container */}
        <MegaMenu
          categories={categories}
          onNavigate={onNavigate}
          isOpen={isMegaOpen}
          onClose={() => setIsMegaOpen(false)}
        />
      </div>

      {/* Mobile Drawer (When clicked) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-lg animate-fade-in max-h-[80vh] overflow-y-auto">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search gadgets, clothing, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="absolute right-3 top-2 text-slate-500">
              <Search size={16} />
            </button>
          </form>

          {/* Category List */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Browse Departments</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate('products', { category: cat.slug });
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 bg-slate-50 text-slate-700 hover:bg-blue-50 rounded-lg text-left transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Route Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => { onNavigate('social'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              📱 Social Commerce Hub
            </button>
            <button
              onClick={() => { onNavigate('rewards'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              🎁 Loyalty Rewards Match
            </button>
            <button
              onClick={() => { onNavigate('help-center'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Help & Support Center
            </button>
            <button
              onClick={() => { onNavigate('products', { filter: 'featured' }); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              ❤️ My Saved Wishlist
            </button>
          </div>

          {/* Account Portal in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  Active Session: {user.name} ({user.role})
                </p>
                <button
                  onClick={() => { onNavigate('user-dashboard'); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left text-sm font-semibold text-slate-600 hover:text-blue-600"
                >
                  👤 My Orders & Invoices
                </button>
                {user.role === 'seller' && (
                  <button
                    onClick={() => { onNavigate('seller-dashboard'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left text-sm font-semibold text-amber-600 hover:text-amber-700"
                  >
                    💼 Seller Dashboard
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => { onNavigate('admin-dashboard'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    🛡️ Admin Administrator Panel
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left text-sm font-semibold text-rose-600 hover:text-rose-700"
                >
                  🚪 Sign Out Account
                </button>
              </>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                🔑 Sign In / Register Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
