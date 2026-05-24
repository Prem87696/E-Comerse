import React from 'react';
import { ArrowLeft, ShieldCheck, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyViewProps {
  onNavigate: (view: string) => void;
}

export const TermsOfServiceView: React.FC<PolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fade-in" id="terms-view">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Return to Marketplace Front</span>
      </button>

      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <FileText className="text-blue-600" size={24} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terms of Service Agreement</h1>
            <p className="text-xs text-slate-500 mt-1">Last revised: May 24, 2026 • ShopNexa Multi-Vendor Licensing</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">1. Acceptance of Licensing Terms</h3>
            <p>
              By accessing, browsing, or utilizing the ShopNexa multi-vendor marketplace platform, you agree to be bound by these standard Terms of Service and all applicable regional guidelines. If you do not agree to code specifications, you must immediately cease accessing the ecosystem.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">2. Multi-Vendor Account Roles</h3>
            <p>
              ShopNexa provides an escrow transaction bridge between Buyers and independent Sellers/Vendors. All registered vendors undergo business registration audits. Users are solely responsible for keeping credentials confidential. Under no condition does ShopNexa accept liabilities for un-encrypted credential shares.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">3. Escrow Hold & Transaction Authorization</h3>
            <p>
              Every transaction is processed through our Secure Escrow Hold Box. Funds are captured during active checkout authorizations and held dynamically. After the logistics partner registers package status as "Delivered", the escrow funds are locked for an additional 44-hour customer review span before releasing direct-to-destination to the respective vendor merchant.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">4. Prohibited Catalog Commodities</h3>
            <p>
              Sellers are strictly forbidden from listing non-original designs, hazardous compounds, unverified medical nodes, or products breaching active trademarks of original labels. ShopNexa platform directors preserve full authorization to ban accounts or freeze wallets instantly on suspect listings.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>For clarifications, email: licensing@shopnexa.com</span>
          <span className="font-bold text-slate-650">ShopNexa Legal Operations</span>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyView: React.FC<PolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fade-in" id="privacy-view">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Return to Marketplace Front</span>
      </button>

      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <ShieldCheck className="text-blue-600" size={24} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Privacy & Cookie Protections</h1>
            <p className="text-xs text-slate-500 mt-1">Last revised: May 24, 2026 • Encrypted Data Shield Protocols</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">1. Information Capturing Policies</h3>
            <p>
              To process secure dispatch coordinates, ShopNexa maps basic identifiers (name, recipient address, email coordinates, credit options) during active sessions. These credentials remain locked in secure cloud environments beneath AES-256 databases.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">2. Cookies & Circus Tracking</h3>
            <p>
              We employ standard minimal technical cookie files to preserve active session status, remember your escrow cart item allocations, and maintain dashboard login parameters across devices. No tracking is shared with secondary marketing networks.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">3. Bank and Payment Transits</h3>
            <p>
              All merchant credentials and checkout transactions transit securely via top-certified routers (e.g. Stripe API gateways). Raw visual card codes never touch ShopNexa server logs, eliminating internal attack surface vectors completely.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100 text-[11px] text-zinc-400">
          <p>© 2026 ShopNexa Marketplace Systems. All customer biometrics and routing lines are privacy protected.</p>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyView: React.FC<PolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fade-in" id="refunds-view">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Return to Marketplace Front</span>
      </button>

      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <HelpCircle className="text-blue-600" size={24} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">14-Day Escrow Refund Framework</h1>
            <p className="text-xs text-slate-500 mt-1">Last revised: May 24, 2026 • Buyer Dispute Guarantee Rules</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-5 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">1. Escrow Protection Period</h3>
            <p>
              To resolve traditional multi-vendor coordination risks, ShopNexa maps all trades to a 14-day Escrow buyer protection grid. Vendors will not receive direct sales credentials until the logistics tracker confirms successful destination delivery, and the buyer fails to open a dispute within 48 hours.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">2. Dispute Initiation Steps</h3>
            <p>
              If a product arrives damaged, fails performance specs, or contradicts visual catalog files, click "Submit Dispute" inside the Help Desk instantly. The support team freezes the respective escrow allocation and audits the logs within 24 hours. Buyers receive return transport shipping vouchers immediately on approved reviews.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">3. Return Cargo Clearance</h3>
            <p>
              Returned commodities must retain original labels, instruction brochures, and storage crates. Once the vendor validates incoming cargo returns, escrow allocations are fully refunded to the buyer's payment method within 5-7 business days.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-150 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 border border-emerald-100">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <p className="text-[11px] text-emerald-850 font-semibold mb-0">
            Every transaction is backed by our customer-first escrow covenant. Zero loss risks.
          </p>
        </div>
      </div>
    </div>
  );
};
