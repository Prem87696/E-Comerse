import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Heart, MessageCircle, Share2, Compass, Sparkles, 
  MapPin, Users, ShoppingBag, Eye, Copy, Check, ExternalLink, 
  ChevronRight, Award, Zap, Trophy, ThumbsUp, Flame, ChevronLeft
} from 'lucide-react';
import { Product } from '../types';

interface SocialHubViewProps {
  products: Product[];
  onNavigate: (view: string, extra?: any) => void;
  onAddToCart: (product: Product, quantity?: number, spec?: string) => void;
  user: { name: string; email: string; role: string } | null;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  followers: string;
  category: string;
  picks: string[]; // product IDs
  quote: string;
  certified?: boolean;
}

interface Reel {
  id: string;
  videoUrl: string;
  title: string;
  productId: string;
  creatorName: string;
  creatorAvatar: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
}

interface GroupBuy {
  id: string;
  productId: string;
  creatorName: string;
  creatorAvatar: string;
  activeBuyers: number;
  totalNeeded: number;
  normalPrice: number;
  groupPrice: number;
  timeLeft: string; // e.g. "14m 20s"
}

export const SocialHubView: React.FC<SocialHubViewProps> = ({
  products,
  onNavigate,
  onAddToCart,
  user,
}) => {
  // --- 1. LOCAL DATA INTEGRATIONS ---
  const [creators] = useState<Creator[]>([
    {
      id: "c1",
      name: "Rohan Varma",
      handle: "@TechWithRohan",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      followers: "420K",
      category: "Tech & Gadgetry",
      picks: ["p1", "p3"],
      quote: "The dual frequency audio syncing of Premium Pro headphones is an absolute life-saver. Truly premium engineering from AuraTech!",
      certified: true
    },
    {
      id: "c2",
      name: "Sanya Chopra",
      handle: "@SanyaStyling",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      followers: "280K",
      category: "High Fashion",
      picks: ["p2", "p4"],
      quote: "Handmade cashmeres from this vendor drape perfectly. The texture is incredibly soft, and wait till you feel the double stitch lining under standard collar seams!",
      certified: true
    },
    {
      id: "c3",
      name: "Kabir Mehta",
      handle: "@SmartKabir",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      followers: "150K",
      category: "Smart Home",
      picks: ["p5", "p6"],
      quote: "My automated home setup feels 100% complete with AuraTech smart controllers. Simple integration, zero network lag, and full escrow safety.",
      certified: false
    }
  ]);

  const [reels, setReels] = useState<Reel[]>([
    {
      id: "r1",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-with-headphones-listening-to-music-40542-large.mp4",
      title: "Testing low-latency surround on these bad boys! Sound is insane 🎧",
      productId: "p1",
      creatorName: "Rohan Varma",
      creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      likes: 14200,
      commentsCount: 389,
      hasLiked: false
    },
    {
      id: "r2",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-cozy-knitted-scarf-and-beanie-41372-large.mp4",
      title: "Cozy seasonal organic cashmeres have landed! Super aesthetic beige 🍁🧥",
      productId: "p2",
      creatorName: "Sanya Chopra",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      likes: 9800,
      commentsCount: 215,
      hasLiked: true
    },
    {
      id: "r3",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-vintage-looking-smartphone-40523-large.mp4",
      title: "This smartwatch holds charging cycles for over 14 days straight! Smart home control hub ⌚📱",
      productId: "p3",
      creatorName: "Kabir Mehta",
      creatorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      likes: 5400,
      commentsCount: 112,
      hasLiked: false
    }
  ]);

  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([
    {
      id: "gb1",
      productId: "p1",
      creatorName: "Prem Kumar",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      activeBuyers: 2,
      totalNeeded: 3,
      normalPrice: 159,
      groupPrice: 119,
      timeLeft: "11m 45s"
    },
    {
      id: "gb2",
      productId: "p2",
      creatorName: "Ayesha Malik",
      creatorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
      activeBuyers: 3,
      totalNeeded: 5,
      normalPrice: 379,
      groupPrice: 299,
      timeLeft: "24m 12s"
    }
  ]);

  // --- 2. LOGISTICS TIME & STATE COUNTER ---
  const [seconds, setSeconds] = useState(1200); // countdown
  const [comments, setComments] = useState<Array<{ id: number; user: string; text: string; time: string }>>([
    { id: 1, user: "Divya93", text: "Just joined the team buy, need 1 more buyer for discount!", time: "1m ago" },
    { id: 2, user: "RajTech", text: "Does the size fit larger for jackets?", time: "3m ago" },
    { id: 3, user: "Ananya30", text: "Nexa Escrow releases funds immediately on delivery? Super clean setup", time: "Just now" }
  ]);
  const [newCommentInput, setNewCommentInput] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 1200));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // --- 3. REELS INTERACTIVE CONTROLS ---
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleLikeReel = (id: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === id) {
        const isL = !!r.hasLiked;
        return {
          ...r,
          likes: isL ? r.likes - 1 : r.likes + 1,
          hasLiked: !isL
        };
      }
      return r;
    }));
  };

  // --- 4. GROUP BUY SUBMISSION SQUAD ---
  const handleJoinGroupBuy = (gbId: string) => {
    setGroupBuys(prev => prev.map(gb => {
      if (gb.id === gbId) {
        if (gb.activeBuyers >= gb.totalNeeded) {
          alert("This squad is already complete and checkout processed!");
          return gb;
        }
        
        const newCount = gb.activeBuyers + 1;
        const isFull = newCount >= gb.totalNeeded;

        // Find associated product
        const associatedProd = products.find(p => p.id === gb.productId);
        if (associatedProd) {
          // Add item into cart with slashed rate
          const slashedProduct = { ...associatedProd, price: gb.groupPrice };
          onAddToCart(slashedProduct, 1, "Group Buy Selection");
          
          if (isFull) {
            alert(`🎉 Congratulations! SQUAD COMPLETE! Product ${associatedProd.title} has been added to your checkout cart at the maximum slashed rate of $${gb.groupPrice}!`);
          } else {
            alert(`👥 You joined the Group Buy! Need ${gb.totalNeeded - newCount} more shopper(s) to secure the final slashed rate of $${gb.groupPrice}. The item is queued in your basket!`);
          }
        }

        return {
          ...gb,
          activeBuyers: newCount
        };
      }
      return gb;
    }));
  };

  // --- 5. SHARE & EARN UTILITY ---
  const [affiliateProduct, setAffiliateProduct] = useState<string>('p1');
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleGenerateAffiliate = () => {
    const randomCode = `NEXA_SHARE_${affiliateProduct.toUpperCase()}_${Math.floor(10000 + Math.random() * 90000)}`;
    setShareCode(randomCode);
    setCopiedCode(false);
  };

  const handleCopyCode = () => {
    if (!shareCode) return;
    navigator.clipboard.writeText(`https://shopnexa.com/products?ref=${shareCode}`).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  // --- 6. REGIONAL CITY TRENDS ---
  const [selectedCity, setSelectedCity] = useState<string>('mumbai');
  const [cityTrendProducts, setCityTrendProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Dynamically filter or vary trends depending on city
    let listOrder = [...products];
    if (selectedCity === 'mumbai') {
      listOrder = [products[1], products[2]]; // premium cashmeres, etc.
    } else if (selectedCity === 'bengaluru') {
      listOrder = [products[0], products[4]]; // tech items
    } else if (selectedCity === 'delhi') {
      listOrder = [products[2], products[3]]; // smart devices, bags
    } else {
      listOrder = [products[0], products[1]]; // defaults
    }
    setCityTrendProducts(listOrder.filter(Boolean));
  }, [selectedCity, products]);

  // --- 7. LIVE FEED COMMENT POSTING ---
  const handlePostCommentOnLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    
    setComments(prev => [
      ...prev,
      {
        id: prev.length + 1,
        user: user?.name ? user.name.replace(/\s+/g, '') : "GuestShopper",
        text: newCommentInput,
        time: "Just now"
      }
    ]);
    setNewCommentInput('');
  };

  return (
    <div className="space-y-12 pb-24 text-slate-900 animate-fade-in" id="social-commerce-hub">
      
      {/* HEADER BANNER ZONE */}
      <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-blue-950 text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="space-y-4 max-w-xl text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-mono text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-2xl">
            <Sparkles size={11} className="fill-blue-400" />
            <span>Introducing ShopNexa Social-Hub</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase">
            Shop Together, <span className="text-blue-400">Earn Together</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-350 font-medium leading-relaxed">
            Experience advanced multi-vendor social commerce. Swivel model video reels, team up in Group Buying squads for pricing cuts, view city charts, and copy secure creator tags.
          </p>
        </div>

        <div className="flex select-none gap-4 bg-slate-950/60 p-5 rounded-3xl border border-slate-800 shrink-0 relative z-10 font-mono text-center">
          <div className="space-y-1">
            <span className="block text-2xl font-black text-amber-400">7.6K</span>
            <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-widest">Active squads</span>
          </div>
          <div className="w-[1px] bg-slate-800"></div>
          <div className="space-y-1">
            <span className="block text-2xl font-black text-blue-400">220+</span>
            <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-widest">Creators Live</span>
          </div>
        </div>
      </div>

      {/* THREE SEGMENTED BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TIKTOK STYLE PRODUCT REELS (COL SPAN 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950 text-white rounded-[2rem] border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-500 font-mono tracking-widest uppercase flex items-center gap-1.5">
                <Flame size={12} className="fill-rose-500" /> Product Reels
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-widest bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                Loop Mode
              </span>
            </div>

            {/* Immersive Videoplayer container */}
            <div className="aspect-[9/16] bg-black rounded-3xl overflow-hidden relative border border-slate-800 flex items-center justify-center group shadow-2xl">
              <video 
                key={reels[activeReelIndex].id}
                src={reels[activeReelIndex].videoUrl}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
                id={`shoppable-reel-${reels[activeReelIndex].id}`}
              />

              {/* Play / pause icon flag overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Creator details overlay */}
              <div className="absolute bottom-5 left-4 right-14 text-left pointer-events-auto space-y-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={reels[activeReelIndex].creatorAvatar} 
                    alt={reels[activeReelIndex].creatorName} 
                    className="w-8 h-8 rounded-full border border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-black truncate text-white">{reels[activeReelIndex].creatorName}</h4>
                    <span className="text-[9px] text-slate-400 block -mt-0.5">Influencer Pick</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                  {reels[activeReelIndex].title}
                </p>

                {/* Inline product card matching featured reel item */}
                {(() => {
                  const rProd = products.find(p => p.id === reels[activeReelIndex].productId);
                  if (!rProd) return null;
                  return (
                    <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-850 flex items-center justify-between gap-2.5 shadow-xl">
                      <img src={rProd.image} alt={rProd.title} className="w-10 h-10 rounded-lg object-cover bg-white" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h6 className="text-[10px] font-bold text-white truncate">{rProd.title}</h6>
                        <span className="text-xs font-black text-blue-400 font-mono">${rProd.price}</span>
                      </div>
                      <button
                        onClick={() => { onAddToCart(rProd, 1); alert(`${rProd.title} added to Escrow cart from Reels!`); }}
                        className="p-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase"
                      >
                        Grab
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Side Action HUD bar */}
              <div className="absolute bottom-5 right-3 flex flex-col items-center gap-4 z-10 text-white font-mono pointer-events-auto">
                <button 
                  onClick={() => handleLikeReel(reels[activeReelIndex].id)}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <div className={`p-2 rounded-full backdrop-blur-md transition ${reels[activeReelIndex].hasLiked ? 'bg-rose-600 text-white scale-110' : 'bg-black/40 border border-white/10 text-slate-300'}`}>
                    <Heart size={15} className={reels[activeReelIndex].hasLiked ? 'fill-white' : ''} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">{reels[activeReelIndex].likes}</span>
                </button>

                <button className="flex flex-col items-center gap-0.5">
                  <div className="p-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-slate-300">
                    <MessageCircle size={15} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">{reels[activeReelIndex].commentsCount}</span>
                </button>

                <button 
                  onClick={() => { alert("Affiliate referral address copied for reels!"); }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div className="p-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-slate-300">
                    <Share2 size={15} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">Share</span>
                </button>
              </div>
            </div>

            {/* Carousel controllers bottom */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => setActiveReelIndex(prev => (prev > 0 ? prev - 1 : reels.length - 1))}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl flex items-center gap-1 font-bold text-slate-300 uppercase text-[9px]"
              >
                <ChevronLeft size={12} />
                <span>Prev Reel</span>
              </button>
              <span className="font-mono text-[10px] text-slate-500 font-black">
                {activeReelIndex + 1} / {reels.length}
              </span>
              <button
                onClick={() => setActiveReelIndex(prev => (prev + 1) % reels.length)}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl flex items-center gap-1 font-bold text-slate-300 uppercase text-[9px]"
              >
                <span>Next Reel</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: LIVE SHOPPING & SQUAD GROUP BUYS (COL SPAN 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LIVE SHOPPING BROADCAST SIMULATION */}
            <div className="bg-white border border-slate-250/60 rounded-[2rem] p-5 space-y-4 shadow-sm text-left">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-red-650 animate-ping"></span>
                  <span>LIVE EVENT BROADCAST</span>
                </span>
                <span className="text-[9px] font-mono font-black text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-150">
                  <Eye size={12} className="text-blue-500" /> 2,420 AUDIENCE
                </span>
              </div>

              {/* Streaming teaser layout thumbnail */}
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-100 flex items-center justify-center select-none shadow">
                <img 
                  src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80" 
                  alt="broadcaster layout" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated overlays */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-amber-400 font-mono">
                  🔥 LIMITED DEAl: SAVE 30% ON CHAT
                </div>

                <div className="absolute bottom-3 right-3 bg-red-600/90 text-white font-black text-[9px] font-mono px-2 py-1 rounded uppercase tracking-wider">
                  Timer: {formatCountdown(seconds)}
                </div>

                {/* Host bubble avatar */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/70 p-1 pr-3 rounded-full text-white text-[9px] font-bold">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="broadcaster" className="w-5 h-5 rounded-full object-cover" />
                  <span>Host @Ananya_Tech</span>
                </div>
              </div>

              {/* Active shoppable link inside stream */}
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex items-center justify-between gap-3">
                <img 
                  src={products[0]?.image} 
                  alt="active target" 
                  className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-150"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-red-500 block">BROADCAST ITEM SHOWN</span>
                  <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{products[0]?.title}</h5>
                  <span className="font-mono text-xs font-black text-slate-800 mt-1 block">${products[0]?.price}</span>
                </div>
                <button 
                  onClick={() => { onAddToCart(products[0], 1); alert(`Grabbed stream item ${products[0].title}!`); }}
                  className="py-1.5 px-3 bg-slate-900 hover:bg-slate-805 text-white font-black text-[9px] font-mono rounded-xl uppercase tracking-wider"
                >
                  Buy Now
                </button>
              </div>

              {/* Viewer simulated comments ticker */}
              <div className="space-y-2 border-t border-slate-150/80 pt-3">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Audience Chat logs (real-time):</span>
                <div className="h-28 overflow-y-auto space-y-1.5 pr-1 text-[11px] leading-relaxed select-all">
                  {comments.map((cmt) => (
                    <p key={cmt.id} className="text-slate-600">
                      <strong className="text-slate-900 font-extrabold font-mono">@{cmt.user}:</strong> {cmt.text}
                    </p>
                  ))}
                </div>

                {/* Fast chat typing prompt */}
                <form onSubmit={handlePostCommentOnLive} className="flex gap-1.5 pt-1.5 border-t border-slate-100">
                  <input
                    type="text"
                    value={newCommentInput}
                    onChange={(e) => setNewCommentInput(e.target.value)}
                    placeholder="Type comments to stream ticker..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    type="submit"
                    className="px-3 bg-blue-600 text-white font-extrabold text-xs rounded-xl"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* SQUAD GROUP BUYING POWER (SLASH RATES) */}
            <div className="bg-white border border-slate-250/60 rounded-[2rem] p-5 space-y-4 shadow-sm text-left">
              <span className="flex items-center gap-1 bg-indigo-150 text-indigo-700 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-xl w-contain">
                <Users size={12} />
                <span>Group Buying discount squads</span>
              </span>
              <p className="text-xs text-slate-520 font-medium">
                Team up to buy identical premium vendor units. Reaching squad targets slashes listing rates and transfers items to escrow checkout!
              </p>

              <div className="space-y-3 pt-2">
                {groupBuys.map((gb) => {
                  const matchingProd = products.find(p => p.id === gb.productId);
                  if (!matchingProd) return null;
                  const slotsFilled = gb.activeBuyers;
                  const slotsTotal = gb.totalNeeded;
                  
                  return (
                    <div 
                      key={gb.id} 
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2.5xl space-y-3 hover:border-indigo-200 transition"
                      id={`group-buy-card-${gb.id}`}
                    >
                      {/* Product matching segment */}
                      <div className="flex gap-2 items-center">
                        <img src={matchingProd.image} alt={matchingProd.title} className="w-10 h-10 rounded-lg object-contain bg-white shrink-0 border border-slate-150" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h6 className="text-[11px] font-extrabold text-slate-900 truncate">{matchingProd.title}</h6>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-xs font-black text-indigo-600">${gb.groupPrice}</span>
                            <span className="font-mono text-[10px] text-slate-400 line-through">${gb.normalPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Squad details progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-black font-mono">
                          <span className="text-slate-500 uppercase tracking-widest">Active squad progress</span>
                          <span className="text-indigo-600">{slotsFilled} / {slotsTotal} SECURED</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(slotsFilled / slotsTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Initiator bio lines */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-150 text-[10px]">
                        <div className="flex items-center gap-1 text-slate-500">
                          <img src={gb.creatorAvatar} alt="buyer initiator" className="w-4.5 h-4.5 rounded-full object-cover shrink-0" />
                          <span>Squad by <strong className="text-slate-800">@{gb.creatorName.split(' ')[0]}</strong></span>
                        </div>

                        <button
                          onClick={() => handleJoinGroupBuy(gb.id)}
                          disabled={slotsFilled >= slotsTotal}
                          className="py-1 px-3.5 bg-indigo-650 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-[9px] font-mono rounded-xl uppercase tracking-wider"
                        >
                          {slotsFilled >= slotsTotal ? "Squad Filled!" : "Join Squad"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* INFLUENCER CURATION EXPERT VIEWS */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-mono">
              ★ CREATOR STOREFRONTS & INFLUENCER PICKS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creators.map((cre) => (
                <div key={cre.id} className="bg-white border border-slate-200 rounded-[2rem] p-5 space-y-4 text-left shadow-xs flex flex-col justify-between">
                  {/* Creator header profile */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <img src={cre.avatar} alt={cre.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{cre.name}</h4>
                          {cre.certified && <span className="bg-blue-105 text-blue-600 text-[8px] font-bold px-1 rounded-sm shrink-0">Vetted</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{cre.handle} • {cre.followers} Fans</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 leading-relaxed italic relative">
                      <span className="absolute -top-1.5 left-3 text-2xl text-slate-200 leading-none">“</span>
                      <p className="relative z-10 pl-2 pr-1">{cre.quote}</p>
                    </div>
                  </div>

                  {/* Creator picks catalog mini slider */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black font-mono text-slate-400 uppercase block">CREATOR VERIFIED PICKS:</span>
                    <div className="grid gap-1.5">
                      {cre.picks.map(pId => {
                        const recProduct = products.find(p => p.id === pId);
                        if (!recProduct) return null;
                        return (
                          <div 
                            key={pId}
                            onClick={() => onNavigate('product-detail', { id: pId })}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 transition cursor-pointer rounded-xl flex gap-2 items-center"
                          >
                            <img src={recProduct.image} alt={recProduct.title} className="w-7.5 h-7.5 rounded object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0 text-[10px]">
                              <p className="font-bold text-slate-800 truncate leading-tight">{recProduct.title}</p>
                              <p className="font-extrabold font-mono text-blue-600 mt-0.5">${recProduct.price}</p>
                            </div>
                            <ChevronRight size={12} className="text-slate-400" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={() => { onNavigate('products', { search: cre.name }); }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-[9px] font-mono rounded-xl uppercase tracking-wider text-center"
                  >
                    View Entire Storefront
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SEGMENT: SHARE & EARN (AFFILIATE) AND REGIONAL METRO TRENDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        
        {/* SHARE & EARN PROGRAM MODULE */}
        <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-[2rem] p-6 text-left flex flex-col justify-between space-y-5 shadow-lg border border-indigo-900/40">
          <div className="space-y-3.5">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-305 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Award size={12} />
              <span>SHOPNEXA SHARE & EARN PROGRAM</span>
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
              Earn Payouts by Promoting Verified Products!
            </h3>
            <p className="text-xs text-slate-350 leading-relaxed font-semibold">
              Generate customize referral handles, share with circles on WhatsApp, Telegram, or socials. When orders clear escrow logs with your tags, you unlock **12% immediate coin rewards**!
            </p>
          </div>

          {/* Generator interactive console */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2.5xl p-4.5 space-y-3">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block mb-1">Target Product Variant</label>
              <select 
                value={affiliateProduct} 
                onChange={(e) => setAffiliateProduct(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateAffiliate}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider"
            >
              Synthesize Creator Link
            </button>

            {shareCode && (
              <div className="p-3 bg-slate-900 rounded-2xl border border-blue-900/60 flex items-center justify-between gap-3 animate-fade-in">
                <div className="truncate min-w-0 pr-1 text-left">
                  <span className="block text-[8px] text-slate-500 font-mono font-bold uppercase">Affiliate Referral Code :</span>
                  <span className="font-mono text-[11px] text-blue-400 font-black truncate block mt-0.5 select-all">https://shopnexa.com/products?ref={shareCode}</span>
                </div>

                <button 
                  onClick={handleCopyCode}
                  className={`p-2 rounded-xl shrink-0 border transition-all ${copiedCode ? 'bg-emerald-950 text-emerald-350 border-emerald-900' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'}`}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-900">
            <span>Commission holding: <strong className="text-white font-black">12% coins</strong></span>
            <span className="h-3 w-[1px] bg-slate-800"></span>
            <span>Monthly Payout threshold: <strong className="text-white font-black">200 coins</strong></span>
          </div>
        </div>

        {/* TRENDING IN YOUR CITY MODULE */}
        <div className="bg-white border border-slate-250/60 rounded-[2rem] p-6 text-left flex flex-col justify-between space-y-5 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 font-mono tracking-widest uppercase mb-1">
                <MapPin size={12} />
                <span>TRENDING IN YOUR CITY (REGIONAL METRICS)</span>
              </span>
              
              {/* Regional city switcher */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-mono font-black rounded-lg py-1 px-2.5 outline-none tracking-wide text-slate-700 uppercase"
              >
                <option value="mumbai">📍 Mumbai Hub</option>
                <option value="bengaluru">📍 Bengaluru Tech</option>
                <option value="delhi">📍 New Delhi NCR</option>
                <option value="kolkata">📍 Kolkata</option>
              </select>
            </div>

            <p className="text-xs text-slate-520 font-medium leading-relaxed mt-1">
              ShopNexa computes actual location metrics in live time to surface products holding high purchasing density within specific zip coordinates.
            </p>
          </div>

          {/* Regional hot products grid */}
          <div className="grid grid-cols-2 gap-4">
            {cityTrendProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => onNavigate('product-detail', { id: p.id })}
                className="p-3 bg-slate-50 hover:bg-slate-100/60 border border-slate-150 rounded-2.5xl cursor-pointer transition flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="aspect-square rounded-xl bg-white overflow-hidden border border-slate-100 flex items-center justify-center p-2 mb-2 relative">
                    <img src={p.image} alt={p.title} className="max-h-24 object-contain transition group-hover:scale-103" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 right-1 bg-blue-600 text-white font-mono text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none">
                      #1 Hot
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate">{p.title}</h5>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase font-mono mt-0.5 block">{p.sellerName}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/50 mt-2 pt-2 text-xs">
                  <span className="font-mono font-black text-slate-850">${p.price}</span>
                  <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5 font-mono">
                    <Flame size={10} className="fill-emerald-600" /> TOP RUSH
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest text-center">
            ★ Sourced via local delivery tracking systems in {selectedCity.toUpperCase() || 'MUMBAI'}
          </p>
        </div>
      </div>

    </div>
  );
};
