import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: 'buyer' | 'seller' | 'admin' }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [simulateRole, setSimulateRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !fullName)) {
      setError('Please input valid credentials to sign in.');
      return;
    }
    setError('');
    // Mock login successful
    onLoginSuccess({
      name: isSignUp ? fullName : (simulateRole === 'buyer' ? 'Prem Kumar' : simulateRole === 'seller' ? 'AuraTech Officials' : 'ShopNexa Platform Admin'),
      email: email,
      role: simulateRole
    });
    onClose();
  };

  const selectPreset = (role: 'buyer' | 'seller' | 'admin') => {
    setSimulateRole(role);
    if (role === 'buyer') {
      setEmail('customer@shopnexa.com');
      setFullName('Prem Kumar');
    } else if (role === 'seller') {
      setEmail('vendor@auratech.io');
      setFullName('AuraTech Officials');
    } else {
      setEmail('admin@shopnexa.com');
      setFullName('Chief Platform Director');
    }
    setPassword('••••••••');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100 animate-scale-up">
        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
          id="btn-close-login"
        >
          <X size={18} />
        </button>

        {/* Header decoration */}
        <div className="bg-slate-900 text-white p-6 pb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-70"></div>
          <div className="relative z-10 flex items-center mb-2">
            <Sparkles className="text-blue-400 mr-2" size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">ShopNexa Portal</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight relative z-10">
            {isSignUp ? "Generate Seller or Buyer Profile" : "Access Premium Marketplace"}
          </h2>
          <p className="text-xs text-slate-300 mt-1 relative z-10 leading-relaxed">
            Welcome to ShopNexa. Experience a secure, high-fidelity multi-vendor commerce hub.
          </p>
        </div>

        <div className="p-6">
          {/* Quick Preset Selector for Easy Walkthrough / Demo Testing */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Demo Role Core Simulator (Recommended)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => selectPreset('buyer')}
                className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${simulateRole === 'buyer' ? 'border-blue-600 bg-blue-50/70 text-blue-600 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'}`}
              >
                Customer Portal
              </button>
              <button 
                type="button"
                onClick={() => selectPreset('seller')}
                className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${simulateRole === 'seller' ? 'border-blue-600 bg-blue-50/70 text-blue-600 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'}`}
              >
                Vendor Access
              </button>
              <button 
                type="button"
                onClick={() => selectPreset('admin')}
                className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${simulateRole === 'admin' ? 'border-blue-600 bg-blue-50/70 text-blue-600 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'}`}
              >
                Owner Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name / Vendor Title</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-[13px] text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Prem Kumar or Solar Apparel" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                    id="input-login-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-[13px] text-slate-400" />
                <input 
                  type="email" 
                  placeholder="e.g. user@shopnexa.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  id="input-login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Secure Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-[13px] text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  id="input-login-pass"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5"
              id="btn-login-submit"
            >
              <ShieldCheck size={16} />
              <span>{isSignUp ? "Create Account & Sign In" : "Secure Auth Access"}</span>
            </button>
          </form>

          {/* Registration toggler */}
          <div className="mt-5 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold underline underline-offset-4"
              id="btn-switch-signup"
            >
              {isSignUp ? "Already have an account? Sign In" : "New to the platform? Create Seller/Buyer Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
