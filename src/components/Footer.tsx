import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800" id="shopnexa-footer">
      {/* Upper Trust Badges */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">14-Day Escrow Escort</h4>
              <p className="text-xs text-slate-400 mt-1">Funds are safely held until shipping confirmation, ensuring absolute multi-vendor customer safety.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Verified Independent Sellers</h4>
              <p className="text-xs text-slate-400 mt-1">We enforce standard regulatory ID audits and visual stock checks on every listed active brand.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Standard Integrated Logistics</h4>
              <p className="text-xs text-slate-400 mt-1">Express API connection with world-class shipping solutions, showing direct coordinates in your panel.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              Shop<span className="text-blue-500">Nexa</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            The next-generation cloud multi-vendor marketplace connecting verified independent designers, gadget craft houses, and sustainable lifestyle creators.
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-blue-500" />
              <span>+1 (800) 555-NEXA (Support)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-blue-500" />
              <span>licensing@shopnexa.com</span>
            </div>
          </div>
        </div>

        {/* Catalog Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Market Departments</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Electronics Products
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Modern Designer Fashion
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Smart Home Assistants
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Sports & Outdoor Equipment
              </button>
            </li>
          </ul>
        </div>

        {/* Vendor Partnering section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Vendor Partnering</h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Interested in listing your premium designs? Access seller terms and on-boarding guides.
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('seller-dashboard')}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>Seller/Vendor Onboarding</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onNavigate('help-center')}
              className="block text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              How commission rates work
            </button>
          </div>
        </div>

        {/* Legal & Policy compliance */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Platform Regulations</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Terms of Service License
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Privacy & Biometrics Protection
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('refunds')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                14-Day Escrow Refund System
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('help-center')} className="hover:text-white hover:underline underline-offset-4 transition-all">
                Help Desk & FAQ Portal
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Lower bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ShopNexa Multi-Vendor Marketplace Inc. Realized with ultimate web core structures.</p>
          <div className="flex items-center gap-1.5 font-semibold text-slate-400">
            <span>Crafted with passion for authentic commerce</span>
            <Heart size={12} className="text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
