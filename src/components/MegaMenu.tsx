import React from 'react';
import { Laptop, Shirt, Home, Activity, Sparkles, BookOpen, ChevronRight, Percent, ShieldCheck, HelpCircle } from 'lucide-react';
import { Category } from '../types';

interface MegaMenuProps {
  categories: Category[];
  onNavigate: (view: string, extra?: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ categories, onNavigate, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 animate-fade-in"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Categories Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Discover Categories</h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate('products', { category: cat.slug });
                  onClose();
                }}
                className="flex items-center w-full text-left text-slate-700 hover:text-blue-600 transition-colors group"
              >
                <span className="p-1.5 rounded bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 mr-2.5 transition-colors">
                  {cat.iconName === 'Laptop' && <Laptop size={14} />}
                  {cat.iconName === 'Shirt' && <Shirt size={14} />}
                  {cat.iconName === 'Home' && <Home size={14} />}
                  {cat.iconName === 'Activity' && <Activity size={14} />}
                  {cat.iconName === 'Sparkles' && <Sparkles size={14} />}
                  {cat.iconName === 'BookOpen' && <BookOpen size={14} />}
                </span>
                <span className="font-medium text-sm">{cat.name}</span>
                <span className="ml-auto text-xs text-slate-400">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hot Picks / Featured links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Trending Deals</h3>
          <div className="space-y-3">
            <button
              onClick={() => { onNavigate('products', { filter: 'featured' }); onClose(); }}
              className="flex items-center text-left text-slate-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              <Percent size={16} className="text-amber-500 mr-2" />
              <span>Shop All Featured Discounts</span>
            </button>
            <button
              onClick={() => { onNavigate('products', { category: 'electronics' }); onClose(); }}
              className="flex items-center text-left text-slate-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
              <span>NextGen Tech Gear</span>
            </button>
            <button
              onClick={() => { onNavigate('products', { category: 'fashion' }); onClose(); }}
              className="flex items-center text-left text-slate-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
              <span>Vogue Essentials Collection</span>
            </button>
            <button
              onClick={() => { onNavigate('products', { category: 'smart-home' }); onClose(); }}
              className="flex items-center text-left text-slate-700 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
              <span>Smart Living Essentials</span>
            </button>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <h4 className="text-xs font-semibold text-amber-800 mb-1 flex items-center">
              <Percent size={14} className="mr-1 inline" /> Premium Flash Offer
            </h4>
            <p className="text-xs text-amber-700">Enter coupon <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">NEXA25</code> at active checkout for 25% off physical items!</p>
          </div>
        </div>

        {/* Seller Info Segment */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Partner Hub</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Own a premium brand or run an active supply chain? Onboard as a registered ShopNexa vendor.
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => { onNavigate('seller-dashboard'); onClose(); }}
              className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              <span>Access Seller Dashboard</span>
              <ChevronRight size={14} className="ml-0.5" />
            </button>
            <button
              onClick={() => { onNavigate('help-center'); onClose(); }}
              className="flex items-center text-xs text-slate-600 hover:text-blue-600 transition-colors"
            >
              <HelpCircle size={14} className="mr-1.5 text-slate-400" />
              <span>Seller Support & Rates</span>
            </button>
            <button
              onClick={() => { onNavigate('terms'); onClose(); }}
              className="flex items-center text-xs text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ShieldCheck size={14} className="mr-1.5 text-slate-400" />
              <span>Multi-Vendor Licensing</span>
            </button>
          </div>
        </div>

        {/* Big Promo Card */}
        <div className="rounded-2xl overflow-hidden bg-slate-900 text-white p-6 relative flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-900/40 px-2 py-1 rounded">Next-Gen Marketplace</span>
            <h4 className="text-lg font-bold mt-2 leading-tight">Empowering Independent Brands Globally</h4>
            <p className="text-xs text-slate-400 mt-2">Zero integration fees. 14-day absolute Escrow buyer guarantee.</p>
          </div>
          <button 
            onClick={() => { onNavigate('products'); onClose(); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all text-center"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
