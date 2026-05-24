import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, MessageSquare, X, Send, Bot, Check, Laptop, Shirt, 
  Percent, ArrowLeftRight, HelpCircle, Gift, Tag, Award, 
  Search, ArrowRight, Star, ShoppingBag, MapPin, ExternalLink, RefreshCw
} from 'lucide-react';
import { Product } from '../types';

interface AIPanelWidgetProps {
  products: Product[];
  onNavigate: (view: string, extra?: any) => void;
  onAddToCart: (product: Product, quantity?: number, spec?: string) => void;
  user: { name: string; email: string; role: string } | null;
}

export const AIPanelWidget: React.FC<AIPanelWidgetProps> = ({
  products,
  onNavigate,
  onAddToCart,
  user,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'finder' | 'compare' | 'deals'>('chat');
  
  // --- STATE FOR CHAT TAB ---
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string; items?: Product[]; actions?: string[] }>>([
    { 
      sender: 'bot', 
      text: `Hello ${user?.name || 'Shopper'}! I am **NexaAI**, your intelligent multi-vendor assistant. How can I guide your cart strategy today?`, 
      time: 'Just now',
      actions: ['Suggest top gadget', 'How does Escrow work?', 'Recommend sizing']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- STATE FOR PRODUCT & GIFT FINDER ---
  const [finderCategory, setFinderCategory] = useState<string>('all');
  const [finderBudget, setFinderBudget] = useState<number>(500);
  const [finderVibe, setFinderVibe] = useState<string>('tech');
  const [finderRecipient, setFinderRecipient] = useState<string>('self');
  const [finderItems, setFinderItems] = useState<Product[]>([]);
  const [hasSearchedFinder, setHasSearchedFinder] = useState(false);

  // --- STATE FOR INTUITIVE COMPARISON ASSISTANT ---
  const [compareId1, setCompareId1] = useState<string>('');
  const [compareId2, setCompareId2] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  // --- STATE FOR DEAL FINDER & DYNAMIC COUPONS ---
  const [scannedDeals, setScannedDeals] = useState<Product[]>([]);
  const [personalCoupon, setPersonalCoupon] = useState<{ code: string; discount: number; expiry: string } | null>(null);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

  // Load initial deals
  useEffect(() => {
    // Sort products by level of discount (originalPrice - price)
    const sorted = [...products]
      .filter(p => p.originalPrice > p.price)
      .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price))
      .slice(0, 4);
    setScannedDeals(sorted);
  }, [products]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- SIZE RECOMMENDER LOGIC ---
  const [sizeHeight, setSizeHeight] = useState('175');
  const [sizeWeight, setSizeWeight] = useState('70');
  const [sizeFit, setSizeFit] = useState('regular');
  const [recommendedSizeResult, setRecommendedSizeResult] = useState<string | null>(null);

  const calculateSizeRecommendation = () => {
    const h = parseInt(sizeHeight) || 170;
    const w = parseInt(sizeWeight) || 68;
    
    let baseSize = 'M';
    if (h < 165) {
      baseSize = w < 60 ? 'S' : 'M';
    } else if (h >= 165 && h <= 180) {
      if (w < 65) baseSize = 'S';
      else if (w >= 65 && w <= 78) baseSize = 'M';
      else baseSize = 'L';
    } else {
      baseSize = w < 80 ? 'L' : 'XL';
    }

    if (sizeFit === 'slim' && baseSize !== 'S') {
      // Maybe stay or size down
    } else if (sizeFit === 'oversized') {
      baseSize = baseSize === 'S' ? 'M' : baseSize === 'M' ? 'L' : 'XL';
    }

    setRecommendedSizeResult(baseSize);

    // Also push a bot message in chat
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'user',
          text: `Size calculation request: Height ${sizeHeight}cm, Weight ${sizeWeight}kg, fit style ${sizeFit}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          sender: 'bot',
          text: `✨ **NexaAI Size Intelligence Outcome**: We highly recommend choosing **Size ${baseSize}** for your custom selection. Our model compared over 450 actual customer fittings in the same weight tier of fashion inventory to secure this suggestion.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  // --- CHAT MESSAGE DISPATCH ---
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    // Add user message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, time: timestamp }]);
    if (!textToSend) setInputMessage('');

    // Trigger bot response simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      let replyItems: Product[] = [];
      const cleanText = text.toLowerCase();

      if (cleanText.includes('gadget') || cleanText.includes('device') || cleanText.includes('electronics')) {
        const electronicsList = products.filter(p => p.category === 'electronics');
        replyText = `I analyzed our current multi-vendor catalog. Here are the top featured tech gadgets with direct escrow clearance. Which one would you like to inspect?`;
        replyItems = electronicsList.slice(0, 2);
      } else if (cleanText.includes('escrow') || cleanText.includes('how does') || cleanText.includes('protect')) {
        replyText = `🔒 **ShopNexa Escrow Infrastructure** protects both buyers and sellers:\n\n1. **Your Payment Hold**: When you order, your payment is placed in an isolated, cryptographically secure platform account registry.\n\n2. **Tracked Logistics Dispatch**: The chosen multi-vendor completes dispatch with tracked express logistics.\n\n3. **Delivery Verification**: Once you check the physical product package and verify, our ledger releases payout to the seller. You can safely dispute any issues within 14 days!`;
      } else if (cleanText.includes('size') || cleanText.includes('height') || cleanText.includes('fit')) {
        replyText = `Sure! Let's calculate your optimal clothing size. You can use the size calculator widget on the side, or tell me your specs. Based on general statistics, a height of 175cm and weight of 70kg maps perfectly to **Size M** in our hand-tailored leather jackets.`;
      } else if (cleanText.includes('gift') || cleanText.includes('recommender') || cleanText.includes('buy for')) {
        replyText = `I can help you recommend the perfect gift! Try moving over to the **Finder & Expert** tab in my toolbar to tailor recommendations by recipient profile.`;
      } else if (cleanText.includes('compare') || cleanText.includes('better')) {
        replyText = `I can execute side-by-side analysis! Check out the **Comparison Tool** tab in this console to cross-reference prices, merchant trust ratings, and specifications instantly.`;
      } else {
        replyText = `I hear you! I've searched the Nexa catalog. The overall trending product right now is **${products[0]?.title || 'Multi-Vendor gear'}** from vendor *${products[0]?.sellerName}* priced at **$${products[0]?.price}**. Would you like me to look up specific items or apply special discount coupons?`;
      }

      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: replyText, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          items: replyItems.length > 0 ? replyItems : undefined
        }
      ]);
    }, 1200);
  };

  // --- RUN INTERACTIVE PRODUCT FINDER ---
  const handleExecuteFinder = () => {
    setHasSearchedFinder(true);
    // Find products matching constraints
    let matched = products.filter(p => {
      // Category filter
      if (finderCategory !== 'all' && p.category !== finderCategory) return false;
      // Budget filter
      if (p.price > finderBudget) return false;
      return true;
    });

    // Custom sort/preference based on Vibe representation
    if (finderVibe === 'minimalist') {
      // Simulate vibe filter - e.g. text containing minimalist, luxury, slim, clean
      matched = matched.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    } else if (finderVibe === 'tech') {
      matched = matched.filter(p => p.category === 'electronics' || p.category === 'smart-home');
    } else if (finderVibe === 'luxe') {
      matched = matched.sort((a, b) => b.price - a.price);
    }

    setFinderItems(matched.slice(0, 3));
  };

  // --- EXECUTE DYNAMIC COMPARISON ---
  const handleCompareWithAI = () => {
    if (!compareId1 || !compareId2) return;
    const p1 = products.find(p => p.id === compareId1);
    const p2 = products.find(p => p.id === compareId2);
    if (!p1 || !p2) return;

    // Simulate smart comparative output
    const isP1Cheaper = p1.price < p2.price;
    const hasP1BestRating = p1.rating > p2.rating;

    let aiVerdict = '';
    if (p1.category === p2.category) {
      if (isP1Cheaper && hasP1BestRating) {
        aiVerdict = `🥇 **Recommendation:** **${p1.title}** represents the clear optimal choice, offering a better price of $${p1.price} alongside higher verified buyer ratings (${p1.rating}/5.0).`;
      } else if (!isP1Cheaper && !hasP1BestRating) {
        aiVerdict = `🥇 **Recommendation:** **${p2.title}** is superior. It delivers higher customer reviews at a more competitive entry pricing point of $${p2.price}.`;
      } else {
        aiVerdict = `🥇 **Recommendation:** If you prioritize budget and cost efficiencies, choose **${isP1Cheaper ? p1.title : p2.title}** ($${isP1Cheaper ? p1.price : p2.price}). However, if you seek premium specifications and overall merchant reputation, **${hasP1BestRating ? p1.title : p2.title}** (${hasP1BestRating ? p1.rating : p2.rating} ⭐) is well worth the extra margin.`;
      }
    } else {
      aiVerdict = `⚠️ **Category Mismatch Warning**: These belong to different departments. Choose **${p1.title}** if you are looking for ${p1.category} utilities, or **${p2.title}** if you require ${p2.category} solutions.`;
    }

    setComparisonResult({
      prod1: p1,
      prod2: p2,
      verdict: aiVerdict,
      winnerId: hasP1BestRating ? p1.id : p2.id
    });
  };

  // --- GENERATE PERSONALIZED DYNAMIC COUPON ---
  const handleGenerateCoupon = () => {
    setCouponStatus('generating');
    setTimeout(() => {
      const discountPct = Math.floor(Math.random() * 10) + 10; // 10% - 19%
      const code = `NEXAAI${discountPct}_${Math.floor(100 + Math.random() * 900)}`;
      setPersonalCoupon({
        code,
        discount: discountPct,
        expiry: 'Expires in 30 minutes'
      });
      setCouponStatus('ready');
    }, 1500);
  };

  return (
    <>
      {/* 🔮 Pulse Floating Assistant Launch Button & Interactive Help Prompt */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-none gap-2 group">
        {!isOpen && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ask NexaAI Assistant</span>
            <Sparkles size={11} className="text-amber-400 fill-amber-400/20" />
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_32px_rgba(79,70,229,0.35)] hover:shadow-[0_8px_32px_rgba(79,70,229,0.55)] transition-all duration-300 transform active:scale-95 ${isOpen ? 'bg-gradient-to-tr from-rose-500 to-rose-600 rotate-90 scale-105' : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:scale-108'}`}
          style={{ animation: !isOpen ? 'pulse 2s infinite' : 'none' }}
          id="floating-ai-assistant-btn"
          title="Interactive AI-Commerce Companion"
        >
          {isOpen ? <X size={20} /> : <Sparkles className="animate-spin-slow w-5.5 h-5.5 sm:w-6 sm:h-6 fill-white" />}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
          100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
        .custom-widget-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-widget-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
        }
        .custom-widget-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4);
          border-radius: 99px;
        }
        .custom-widget-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.6);
        }
      `}</style>

      {/* 🪐 Expandable AI Console Portal */}
      {isOpen && (
        <div 
          className="fixed bottom-[88px] sm:bottom-24 right-3 sm:right-6 md:right-8 left-3 sm:left-auto w-auto sm:w-[440px] h-[55vh] sm:h-[640px] max-h-[70vh] bg-slate-950/98 backdrop-blur-xl text-white rounded-[2rem] border border-slate-800/80 shadow-[0_20px_50px_rgba(8,124,250,0.15)] flex flex-col overflow-hidden z-50 animate-slide-up"
          id="ai-commerce-assistant-container"
        >
          {/* Header Segment */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-5 py-4.5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative">
                <Sparkles size={18} className="fill-white animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black tracking-widest uppercase text-slate-100 font-mono">NEXAAI Companion</h3>
                  <span className="bg-blue-500/10 text-blue-400 font-mono text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-blue-500/10">v1.4 Live</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-medium">Core AI-Commerce Optimizer</span>
                  <span className="text-[10px] text-slate-500 font-mono">• Active</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-white rounded-xl transition-all text-[9px] uppercase font-mono tracking-widest border border-slate-800 hover:border-slate-700"
            >
              Hide
            </button>
          </div>

          {/* Assistant Sub-Navigation Menu Tabs */}
          <div className="grid grid-cols-4 bg-slate-950/80 border-b border-slate-800/80 text-[10px] text-slate-400 font-bold tracking-wider uppercase text-center font-mono select-none">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`py-3.5 flex flex-col items-center gap-1.5 border-r border-slate-900 transition-all ${activeTab === 'chat' ? 'bg-slate-900 text-blue-400 font-black border-b-2 border-b-blue-500' : 'hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              <MessageSquare size={13} className={activeTab === 'chat' ? 'text-blue-400' : 'text-slate-450'} />
              <span>NexaChat</span>
            </button>
            <button 
              onClick={() => setActiveTab('finder')}
              className={`py-3.5 flex flex-col items-center gap-1.5 border-r border-slate-900 transition-all ${activeTab === 'finder' ? 'bg-slate-900 text-blue-400 font-black border-b-2 border-b-blue-500' : 'hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              <Search size={13} className={activeTab === 'finder' ? 'text-blue-400' : 'text-slate-450'} />
              <span>Finder</span>
            </button>
            <button 
              onClick={() => setActiveTab('compare')}
              className={`py-3.5 flex flex-col items-center gap-1.5 border-r border-slate-900 transition-all ${activeTab === 'compare' ? 'bg-slate-900 text-blue-400 font-black border-b-2 border-b-blue-500' : 'hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              <ArrowLeftRight size={13} className={activeTab === 'compare' ? 'text-blue-400' : 'text-slate-450'} />
              <span>Compare</span>
            </button>
            <button 
              onClick={() => setActiveTab('deals')}
              className={`py-3.5 flex flex-col items-center gap-1.5 transition-all ${activeTab === 'deals' ? 'bg-slate-900 text-blue-400 font-black border-b-2 border-b-blue-500' : 'hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              <Percent size={13} className={activeTab === 'deals' ? 'text-blue-400' : 'text-slate-450'} />
              <span>Deals/Coupons</span>
            </button>
          </div>

          {/* Interactive Portal Content Area */}
          <div className="flex-1 overflow-y-auto p-4.5 space-y-4 bg-slate-950/40 custom-widget-scrollbar">
            
            {/* TAB 1: NEXA CHAT POPUP & BOT SUPPORT */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col justify-between gap-4">
                {/* Scrollable messages container */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-md">
                          <Bot size={15} className="text-blue-400" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-xs leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium' : 'bg-slate-900/80 text-slate-200 rounded-tl-none border border-slate-800'}`}>
                        {msg.text.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className={line.startsWith('1.') || line.startsWith('*') ? 'pl-2 my-1' : 'mb-1'}>
                            {line.startsWith('**') || line.includes('**') ? (
                              // Rudimentary double asterisk bold parser
                              line.split('**').map((token, tIdx) => tIdx % 2 === 1 ? <strong key={tIdx} className="text-amber-300 font-black">{token}</strong> : token)
                            ) : line}
                          </p>
                        ))}

                        {/* If bot suggests matching items */}
                        {msg.items && (
                          <div className="mt-3 grid gap-2.5">
                            {msg.items.map(item => (
                              <div key={item.id} className="flex gap-2.5 p-2.5 bg-slate-950/90 rounded-xl border border-slate-800 items-center hover:border-slate-700 transition">
                                <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                                <div className="flex-1 min-w-0 text-[10px] text-left">
                                  <p className="font-extrabold text-slate-100 truncate">{item.title}</p>
                                  <p className="font-bold font-mono text-blue-400 mt-0.5">₹{item.price.toLocaleString('en-IN')}</p>
                                </div>
                                <button 
                                  onClick={() => { onAddToCart(item, 1); alert(`${item.title} added to cart from AI!`); }}
                                  className="px-2.5 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 transition"
                                >
                                  ADD
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Interactive bot quick actions */}
                        {msg.actions && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleSendMessage(act)}
                                className="px-2.5 py-1.5 bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-[9px] font-black tracking-wider transition-all"
                              >
                                {act}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className="block text-[8px] text-slate-500 font-mono mt-1.5 text-right font-medium">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <Bot size={15} className="text-blue-400 animate-pulse" />
                      </div>
                      <div className="bg-slate-900/60 p-3 px-4 rounded-2xl rounded-tl-none border border-slate-805 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Inline Apparel Size Recommender Widget inside Chat */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3.5 relative overflow-hidden backdrop-blur-sm shadow-md">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-extrabold font-mono tracking-wide">
                    <Shirt size={13} className="text-blue-400" />
                    <span>AI CLOTHING SIZE RECOMMENDATION</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">Our fitting algorithms benchmark your parameters against instant real catalog dimension metrics.</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-slate-100">
                    <div className="space-y-1">
                      <span className="block text-[8px] text-slate-450 font-mono tracking-widest font-black uppercase">HEIGHT (CM)</span>
                      <input 
                        type="number" 
                        value={sizeHeight} 
                        onChange={(e) => setSizeHeight(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 font-mono text-center text-xs p-1.5 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition focus:ring-2 focus:ring-blue-500/10" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] text-slate-450 font-mono tracking-widest font-black uppercase">WEIGHT (KG)</span>
                      <input 
                        type="number" 
                        value={sizeWeight} 
                        onChange={(e) => setSizeWeight(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 font-mono text-center text-xs p-1.5 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition focus:ring-2 focus:ring-blue-500/10" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] text-slate-450 font-mono tracking-widest font-black uppercase">FIT PROFILE</span>
                      <select 
                        value={sizeFit} 
                        onChange={(e) => setSizeFit(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 text-center text-[10px] p-2 rounded-xl border border-slate-800 font-mono focus:outline-none focus:border-blue-500 transition"
                      >
                        <option value="slim">Slim Fit</option>
                        <option value="regular">Regular</option>
                        <option value="oversized">Oversized</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={calculateSizeRecommendation}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-[10px] text-white font-extrabold uppercase tracking-widest rounded-xl hover:from-blue-500 hover:to-indigo-600 transition shadow-[0_4px_12px_rgba(79,70,229,0.25)] flex items-center justify-center gap-1.5"
                  >
                    <span>Run Fitting Engine</span>
                    <Sparkles size={11} className="fill-white" />
                  </button>

                  {recommendedSizeResult && (
                    <div className="text-center bg-slate-950/80 p-2.5 rounded-xl border border-blue-900/60 text-[11.5px] font-bold leading-relaxed flex items-center justify-center gap-2 animate-fade-in">
                      <span>🎉 Recommended Size:</span>
                      <span className="text-amber-400 font-black font-mono bg-blue-950 px-3 py-1 rounded text-xs border border-blue-800/40 shadow-inner">{recommendedSizeResult}</span>
                    </div>
                  )}
                </div>

                {/* Input Segment */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
                  className="flex gap-2 relative bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-md focus-within:border-blue-500/50 transition-all duration-300"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about deals, warranty terms, escrow safety..."
                    className="flex-1 bg-transparent px-3 text-xs py-2 text-slate-105 placeholder:text-slate-500 focus:outline-none font-medium"
                  />
                  <button 
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
                  >
                    <Send size={13} className="fill-white" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: AI CATALOG PRODUCT FINDER & GIFT RECOMMENDER */}
            {activeTab === 'finder' && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4.5 space-y-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold font-mono tracking-wide">
                    <Laptop size={14} className="text-blue-400" />
                    <span>AI CATALOG SEARCH SCANNING</span>
                  </div>
                  
                  {/* Category dropdown selector */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">🎯 Department Sector</label>
                    <select
                      value={finderCategory}
                      onChange={(e) => setFinderCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="all">Analyze All Departments</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion & Style</option>
                      <option value="smart-home">Smart Home Devices</option>
                    </select>
                  </div>

                  {/* Budget selector slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                      <span>💸 Maximum Budget</span>
                      <span className="text-amber-400 text-xs font-bold font-mono">₹{finderBudget.toLocaleString('en-IN')}</span>
                    </div>
                    <input 
                      type="range"
                      min="100"
                      max="50000"
                      step="250"
                      value={finderBudget}
                      onChange={(e) => setFinderBudget(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Vibe selection buttons */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">✨ Target Aesthetic / Style</label>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {[
                        { id: 'tech', label: '💻 Tech-Forward' },
                        { id: 'minimalist', label: '🌾 Minimalist' },
                        { id: 'luxe', label: '👑 Luxe Quality' },
                        { id: 'casual', label: '☕ Comfort Everyday' }
                      ].map(v => (
                        <button
                          key={v.id}
                          onClick={() => setFinderVibe(v.id)}
                          className={`p-2 rounded-xl transition-all border text-left font-semibold ${finderVibe === v.id ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-transparent text-white font-extrabold shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gift Recommender add-on segment */}
                  <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">🎁 Recipient Profile (Optional)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'self', label: 'Myself' },
                        { id: 'partner', label: 'Partner' },
                        { id: 'parent', label: 'Parent' },
                        { id: 'geek', label: 'Tech Expert' }
                      ].map(r => (
                        <button
                          key={r.id}
                          onClick={() => setFinderRecipient(r.id)}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${finderRecipient === r.id ? 'bg-indigo-600/25 border-indigo-505 text-indigo-305 font-black' : 'bg-slate-950 border-slate-800 text-slate-450 hover:bg-slate-900 hover:text-slate-300'}`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleExecuteFinder}
                    className="w-full py-3 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-[0_4px_12px_rgba(79,70,229,0.25)] flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Sparkles size={14} className="fill-white animate-spin-slow" />
                    <span>Run Intelligent Scanner</span>
                  </button>
                </div>

                {/* MATCHED CARD LISTING OUTCOMES */}
                {hasSearchedFinder && (
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono select-none">Top Matches Scanned</h4>
                    {finderItems.length === 0 ? (
                      <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-slate-450 text-xs italic">
                        No products matches your budget limit. Try increasing budget capacity slider.
                      </div>
                    ) : (
                      <div className="grid gap-2.5">
                        {finderItems.map(item => (
                          <div key={item.id} className="p-3 bg-slate-900 border border-slate-800/60 hover:border-slate-700 transition rounded-2xl flex gap-3.5 items-center shadow-xs">
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0 text-left">
                              <span className="text-[8px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800/40 font-mono uppercase font-black tracking-widest">{item.category}</span>
                              <h5 className="text-xs font-bold text-slate-100 truncate mt-1.5">{item.title}</h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs font-black text-blue-400">₹{item.price.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-400 font-bold font-mono">⭐ {item.rating}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 shrink-0">
                              <button 
                                onClick={() => { onAddToCart(item, 1); alert(`${item.title} added to cart from AI!`); }}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition"
                              >
                                BUY
                              </button>
                              <button 
                                onClick={() => { onNavigate('product-detail', { id: item.id }); setIsOpen(false); }}
                                className="text-[8px] text-slate-450 hover:text-white uppercase font-bold font-mono text-center tracking-widest p-1"
                              >
                                DETAIL
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PRODUCT COMPARISON ASSISTANT */}
            {activeTab === 'compare' && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4.5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold font-mono tracking-wide">
                    <ArrowLeftRight size={14} className="text-blue-400" />
                    <span>Side-By-Side AI Evaluation</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">Cross-reference distinct multi-vendor specifications, quality ratings, and escrow guarantees side-by-side.</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono block mb-1">Select Item One</label>
                      <select
                        value={compareId1}
                        onChange={(e) => setCompareId1(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition"
                      >
                        <option value="">-- Select First Product --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (₹{p.price.toLocaleString('en-IN')})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono block mb-1">Select Item Two</label>
                      <select
                        value={compareId2}
                        onChange={(e) => setCompareId2(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 transition"
                      >
                        <option value="">-- Select Second Product --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (₹{p.price.toLocaleString('en-IN')})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCompareWithAI}
                    disabled={!compareId1 || !compareId2}
                    className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-indigo-650 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                  >
                    Compare Specifications Side-By-Side
                  </button>
                </div>

                {/* COMPARISON SPEC TABLE */}
                {comparisonResult && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3.5 shadow-sm animate-fade-in">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Comparative Metrics</h5>
                    
                    <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2 text-[10px] font-mono tracking-wider text-slate-500">
                      <div>Attribute</div>
                      <div className="font-extrabold truncate text-slate-200 text-left">{comparisonResult.prod1.title}</div>
                      <div className="font-extrabold truncate text-slate-200 text-left">{comparisonResult.prod2.title}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs items-center text-left">
                      <span className="text-[9px] font-mono text-slate-500 font-black uppercase">Escrow Price</span>
                      <span className="font-bold font-mono text-slate-100">₹{comparisonResult.prod1.price.toLocaleString('en-IN')}</span>
                      <span className="font-bold font-mono text-slate-100">₹{comparisonResult.prod2.price.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs items-center text-left">
                      <span className="text-[9px] font-mono text-slate-500 font-black uppercase">Rating</span>
                      <span className="font-bold text-amber-400 flex items-center gap-0.5">⭐ {comparisonResult.prod1.rating}</span>
                      <span className="font-bold text-amber-400 flex items-center gap-0.5">⭐ {comparisonResult.prod2.rating}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs items-center text-left">
                      <span className="text-[9px] font-mono text-slate-500 font-black uppercase">Stock Pool</span>
                      <span className="font-semibold text-slate-300">{comparisonResult.prod1.stock} units</span>
                      <span className="font-semibold text-slate-300">{comparisonResult.prod2.stock} units</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300 leading-relaxed text-left">
                      <span className="text-[8px] bg-blue-950 text-blue-300 font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border border-blue-900/30">Nexa AI Outcome Verdict</span>
                      <p className="mt-1 font-medium text-slate-200">{comparisonResult.verdict}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                      <button 
                        onClick={() => { onAddToCart(comparisonResult.prod1, 1); alert(`${comparisonResult.prod1.title} added to cart!`); }}
                        className="py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg text-[9px] font-black uppercase border border-slate-800 transition"
                      >
                        Add #{comparisonResult.prod1.id.toUpperCase()}
                      </button>
                      <button 
                        onClick={() => { onAddToCart(comparisonResult.prod2, 1); alert(`${comparisonResult.prod2.title} added to cart!`); }}
                        className="py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg text-[9px] font-black uppercase border border-slate-800 transition"
                      >
                        Add #{comparisonResult.prod2.id.toUpperCase()}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: AI DEAL FINDER & DYNAMIC COUPON GENERATION */}
            {activeTab === 'deals' && (
              <div className="space-y-4">
                {/* Coupon claim portal */}
                <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-900/40 rounded-3xl p-5 text-center space-y-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                    <Award size={20} className="text-blue-400 fill-blue-500/10" />
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest font-mono text-slate-100">Dynamic Coupon Synthesizer</h4>
                    <p className="text-[10.5px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed font-medium">
                      Nexa AI monitors checkout queues in live time, generating high rate personalized discount codes on demand based on merchant budget profiles.
                    </p>
                  </div>

                  {couponStatus === 'idle' && (
                    <button
                      onClick={handleGenerateCoupon}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl uppercase tracking-widest transition shadow-md shadow-blue-500/10"
                    >
                      Synthesize Custom Promo
                    </button>
                  )}

                  {couponStatus === 'generating' && (
                    <div className="text-[11px] text-slate-400 flex items-center justify-center gap-2 py-2">
                      <RefreshCw size={13} className="animate-spin text-blue-400" />
                      <span>Scanning seller margins and generating crypt code...</span>
                    </div>
                  )}

                  {couponStatus === 'ready' && personalCoupon && (
                    <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/20 text-center space-y-2 animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full pointer-events-none"></div>
                      <div className="text-[8px] text-slate-450 font-black uppercase tracking-widest font-mono">PROMO GENERATED SUCCESSFULLY</div>
                      <div className="text-lg font-black font-mono text-amber-400 tracking-wider bg-slate-950 py-1.5 px-3 rounded-lg border border-slate-800 select-all shadow-inner">
                        {personalCoupon.code}
                      </div>
                      <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide">
                        Slashes {personalCoupon.discount}% Off Any Ledger Order!
                      </p>
                      <span className="text-[8px] text-slate-500 font-mono block">
                        🕒 {personalCoupon.expiry} • Auto-destruct timer live
                      </span>
                    </div>
                  )}
                </div>

                {/* AI deal catalog marks */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[9px] text-rose-400 font-black tracking-widest uppercase font-mono select-none">
                    <Percent size={11} className="text-rose-400" />
                    <span>AI SCANNED DEALS (MAX DISCOUNT OUTLETS)</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {scannedDeals.map(p => {
                      const saving = Math.round(p.originalPrice - p.price);
                      return (
                        <div key={p.id} className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden group hover:border-slate-705 transition shadow-xs">
                          <div className="absolute top-0 right-0 bg-rose-600 text-[8px] font-black text-white px-2 py-0.5 rounded-bl uppercase tracking-wider select-none">
                            -₹{saving.toLocaleString('en-IN')}
                          </div>
                          
                          <img src={p.image} alt={p.title} className="w-full h-20 object-cover rounded-xl mb-2" referrerPolicy="no-referrer" />
                          <h6 className="text-[10px] font-extrabold text-slate-200 truncate pr-4">{p.title}</h6>
                          
                          <div className="flex items-baseline gap-1 mt-1 font-mono">
                            <span className="text-xs font-black text-blue-400">₹{p.price.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] text-slate-500 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                          </div>

                          <button 
                            onClick={() => { onAddToCart(p, 1); alert(`${p.title} added to cart from AI!`); }}
                            className="w-full py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-[8px] font-black rounded-lg text-slate-300 mt-2 tracking-widest uppercase transition"
                          >
                            Add Deal
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Escrow Safe Seal */}
          <div className="p-3.5 bg-slate-950 text-slate-400 border-t border-slate-800/80 font-mono text-[8.5px] uppercase tracking-wider text-center font-bold flex items-center justify-center gap-1.5">
            <Check size={11} className="text-emerald-500 shrink-0" />
            <span>NEXAAI is fully synchronized via platform API & Escrow ledgers</span>
          </div>
        </div>
      )}
    </>
  );
};
