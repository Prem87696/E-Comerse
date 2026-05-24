import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, ArrowRight, ShieldCheck, Mail, Send, Activity, Info, BookOpen } from 'lucide-react';
import { HelpArticle } from '../types';
import { helpArticles } from '../data';

interface HelpCenterViewProps {
  onNavigate: (view: string) => void;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('h1');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Filter articles based on search query
  const filteredArticles = helpArticles.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setTicketSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => {
      setTicketSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in" id="help-center-view">
      
      {/* 1. HERO SEARCH ACCORDION HEADER */}
      <section className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Support Desk</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            How can we assist your commerce?
          </h1>
          <p className="text-xs md:text-sm text-slate-350 leading-relaxed">
            Search our audited knowledge indexes or submit transactional disputes direct-to-destination instantly.
          </p>

          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-3.5 text-slate-450" size={16} />
            <input
              type="text"
              placeholder="Search seller rates, escrow terms, or shipping guidelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-slate-900 rounded-xl text-xs backdrop-blur-md border border-white/10 focus:outline-none transition-all placeholder:text-slate-450"
            />
          </div>
        </div>
      </section>

      {/* 2. DIRECT FAQ DRAWERS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side:Collapsible accordion index */}
        <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-slate-900 font-bold text-base">Audited FAQ Encyclopedia</h3>
            <p className="text-xs text-slate-500 mt-1">Collated guidelines containing standard platform operation variables.</p>
          </div>

          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <p className="text-xs text-slate-550 py-4 italic text-center">No articles matched your current query.</p>
            ) : (
              filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="border border-slate-205/60 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === art.id ? null : art.id)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-850 transition-colors"
                  >
                    <span>{art.title}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 font-mono">
                      {expandedId === art.id ? 'Close' : 'Read'}
                    </span>
                  </button>

                  {expandedId === art.id && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-650 leading-relaxed space-y-3">
                      <p>{art.content}</p>
                      <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 font-semibold">
                        <span>Category: {art.category} • Views: {art.views} Audits</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: SUBMIT A SUPPORT TICKET */}
        <aside className="lg:col-span-4 bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Submit Cargo Dispute / Ticket</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              File a direct transactional review mapping. Support managers replies within an average 3-hour limit.
            </p>
          </div>

          {ticketSuccess ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-100 animate-scale-up">
              <span className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center mx-auto text-sm">
                ✓
              </span>
              <strong className="text-emerald-800 text-xs block">Ticket Submitted Securely!</strong>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                Platform directors will review credentials immediately. A callback was dispatched to your mail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Prem Kumar"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Secure Email</label>
                <input
                  type="email"
                  required
                  placeholder="user@shopnexa.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Query Descriptions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Inscribe transaction ID or vendor dispute coordinates..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-750 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/10 text-center flex items-center justify-center gap-1.5 transition-colors"
                id="btn-confirm-ticket"
              >
                <Send size={12} />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
            <Mail size={14} className="text-blue-500 flex-shrink-0" />
            <div className="text-[10px] text-slate-450 leading-relaxed">
              <span>Direct operational mailbox:</span><br />
              <strong className="text-slate-700 font-mono">support@shopnexa.com</strong>
            </div>
          </div>
        </aside>

      </section>

      {/* 3. POLICY LINK SUGGESTION BAR */}
      <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <BookOpen className="text-zinc-650" size={18} />
          <div>
            <strong className="text-slate-850 block font-bold">Standard Multi-Vendor Policies</strong>
            <span className="text-slate-550">Review terms of services, Escrow escrow hold details, and general refund frameworks.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('terms')} className="text-xs font-bold text-blue-600 hover:underline">Terms</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => onNavigate('privacy')} className="text-xs font-bold text-blue-600 hover:underline">Privacy</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => onNavigate('refunds')} className="text-xs font-bold text-blue-600 hover:underline">Refunds</button>
        </div>
      </section>

    </div>
  );
};
