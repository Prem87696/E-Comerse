import React, { useState } from 'react';
import { ShoppingBag, Truck, MapPin, User, Star, Package, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import { Order } from '../types';

interface UserDashboardViewProps {
  orders: Order[];
  onNavigate: (view: string, extra?: any) => void;
  user: { name: string; email: string; role: 'buyer' | 'seller' | 'admin' } | null;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  orders,
  onNavigate,
  user,
}) => {
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(orders[0] || null);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'records'>('records');

  const username = user?.name || "Prem Kumar";
  const email = user?.email || "customer@shopnexa.com";

  // Timeline Steps
  const getTimelineSteps = (status: Order['status']) => {
    const steps = [
      { label: 'Escrow Confirmed', done: true },
      { label: 'Vendor Packing', done: ['processing', 'shipped', 'delivered'].includes(status) },
      { label: 'Cargo In-Transit', done: ['shipped', 'delivered'].includes(status) },
      { label: 'Final Delivery', done: status === 'delivered' },
    ];
    return steps;
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in" id="user-dashboard-container">
      {/* 1. Header Profile segment */}
      <section className="bg-slate-900 rounded-[2rem] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            {username.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">{username}</h2>
              <span className="bg-blue-900 border border-blue-500 text-blue-300 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{email} • Registered since Jan 2024</p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 text-xs text-slate-400">
          <button
            onClick={() => setActiveSubTab('records')}
            className={`px-4 py-2 font-bold rounded-xl ${activeSubTab === 'records' ? 'bg-white text-slate-900' : 'hover:bg-white/5 text-slate-300'}`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 font-bold rounded-xl ${activeSubTab === 'profile' ? 'bg-white text-slate-900' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Billing profile
          </button>
        </div>
      </section>

      {/* Profile info page or Orders track page */}
      {activeSubTab === 'profile' ? (
        <section className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <h3 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">Platform Account Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Full Identity Name</span>
              <p className="text-slate-800 font-semibold">{username}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Email Coordinates</span>
              <p className="text-slate-850 font-mono text-zinc-750 font-semibold">{email}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Standard Billing Gateway</span>
              <p className="text-slate-800 font-semibold">Visa Credit Card Ending (**** 4444)</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Pre-authorized Shipping Target</span>
              <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                124 Innovation Boulevard, Tech District. Bangalore, Karnataka - 560001
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-[2rem] flex items-center justify-between">
            <p className="text-[10px] text-slate-450">Two-Factor security authentication is enabled via high banking layers.</p>
            <button className="px-3.5 py-1.5 bg-slate-200 text-slate-850 font-bold text-xs rounded-xl hover:bg-slate-300">
              Manage Keys
            </button>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Order histories */}
          <section className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200/60 rounded-[2rem] p-5 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cargo Orders Archives</h3>
              <p className="text-[11px] text-slate-450 mt-0.5">Below is a list of historic active shipments processed on ShopNexa</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-slate-500">No transactions recorded under this profile.</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedTrackingOrder(ord)}
                    className={`p-4 border rounded-2xl cursor-pointer hover:shadow-sm transition-all focus:outline-none flex flex-col md:flex-row md:items-center justify-between gap-4 ${selectedTrackingOrder?.id === ord.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">{ord.id}</strong>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ord.status === 'delivered' ? 'bg-emerald-110 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Placed: {new Date(ord.date).toLocaleDateString()}
                      </p>
                      
                      {/* Sub-item names */}
                      <div className="text-[11px] text-slate-650 font-semibold truncate max-w-sm">
                        {ord.items.map(item => `${item.quantity}x ${item.title}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-0 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">ESCROW TOTAL</span>
                        <strong className="text-sm font-black text-slate-900">${ord.total.toFixed(2)}</strong>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Side: LIVE SHIPMENT TIMELINE DETAIL */}
          <aside className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Truck size={14} className="text-blue-500" />
                <span>Live Logistics Tracker</span>
              </h3>
              <p className="text-[11px] text-slate-450 mt-0.5">Select any order on the left to inspect package coordinates.</p>
            </div>

            {selectedTrackingOrder ? (
              <div className="space-y-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-slate-450 font-bold block">TRACKING IDENTIFICATION CODE</span>
                    <strong className="font-mono mt-0.5 inline-block text-slate-750 font-semibold">
                      {selectedTrackingOrder.trackingNumber || 'TRK-NEXA38029A'}
                    </strong>
                  </div>
                  <span className="text-blue-600 font-bold hover:underline cursor-pointer">Copy Link</span>
                </div>

                {/* Timeline Visualizer */}
                <div className="relative pl-6 space-y-6 border-l-2 border-slate-100">
                  {getTimelineSteps(selectedTrackingOrder.status).map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Check dot background */}
                      <span className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${step.done ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}>
                        {step.done && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                      <div>
                        <h4 className={`text-xs font-bold leading-none ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {step.done ? 'Action processed successfully' : 'Pending core logistics validation'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery coordinates */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-slate-450 tracking-widest flex items-center gap-1.5">
                    <MapPin size={11} className="text-slate-400" />
                    <span>Target Destination Coordinates</span>
                  </h4>
                  <div className="text-xs font-semibold text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <p className="font-bold">{selectedTrackingOrder.shippingAddress.fullName}</p>
                    <p>{selectedTrackingOrder.shippingAddress.street}</p>
                    <p>{selectedTrackingOrder.shippingAddress.city}, {selectedTrackingOrder.shippingAddress.state} - {selectedTrackingOrder.shippingAddress.zip}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">Please select an archived order on the left to track progress.</p>
            )}
          </aside>

        </div>
      )}
    </div>
  );
};
