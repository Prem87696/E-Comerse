import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, Star, Heart, TrendingUp, Laptop, Shirt, Home, Activity, 
  Sparkles as BeautyIcon, BookOpen, ShoppingCart, Percent, RotateCcw, ShieldCheck, 
  Flame, Gift, Tag, Award, Play, Send, CheckCircle2, Phone, Smile, Mail, 
  Download, Smartphone, Eye, Users, ThumbsUp, Layers, HelpCircle, ArrowLeftRight, Clock, Plus, Trash
} from 'lucide-react';
import { Product, Category, Seller } from '../types';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  sellers: Seller[];
  onNavigate: (view: string, extra?: any) => void;
  onAddToCart: (product: Product) => void;
}

// Extensive lists of highly-curated mock items for specific departments to power premium conversion sections
const budgetDeals = [
  { id: 'b1', title: 'Acoustic Metallic Keyring Hook', priceRupees: 99, originalPriceRupees: 250, image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=80', limit: 'Under ₹99' },
  { id: 'b2', title: 'Carbon Fiber Multi-Card Sleeve', priceRupees: 199, originalPriceRupees: 599, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80', limit: 'Under ₹199' },
  { id: 'b3', title: 'Aluminium Pivot Desktop Desk Mount', priceRupees: 499, originalPriceRupees: 1499, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80', limit: 'Under ₹499' },
  { id: 'b4', title: 'Braided Dual Type-C Quick Cable', priceRupees: 189, originalPriceRupees: 499, image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80', limit: 'Under ₹199' },
  { id: 'b5', title: 'Pocket Ceramic Cactus Pot Desk Companion', priceRupees: 95, originalPriceRupees: 199, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80', limit: 'Under ₹99' },
  { id: 'b6', title: 'Stainless Steel Portable Spice Spoon Set', priceRupees: 450, originalPriceRupees: 899, image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&auto=format&fit=crop&q=80', limit: 'Under ₹499' }
];

const beautyProducts = [
  { id: 'bp1', title: 'Organic Rosehip & Squalane Facial Oil', price: 28.00, rating: 4.8, reviews: 215, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80' },
  { id: 'bp2', title: 'Hand-Carved Nephrite Jade Facial Roller Set', price: 19.50, rating: 4.7, reviews: 142, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&auto=format&fit=crop&q=80' },
  { id: 'bp3', title: 'Botanical Calendula Soothing Sleep Mask', price: 24.00, rating: 4.9, reviews: 88, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80' }
];

const groceryEssentials = [
  { id: 'gr1', title: 'Single-Origin Himalayan Darjeeling First Flush (Loose Leaf)', price: 18.00, weight: '250g', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop&q=80' },
  { id: 'gr2', title: 'Raw Cold-Pressed Organic Kerman Pistachios', price: 14.50, weight: '400g', image: 'https://images.unsplash.com/photo-1553521041-d168abd31de3?w=400&auto=format&fit=crop&q=80' },
  { id: 'gr3', title: 'Artisanal Saffron Infused Wild Forest Honey', price: 21.00, weight: '350g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80' }
];

const homeAndKitchen = [
  { id: 'hk1', title: 'Aesthetic Stoneware Drip Brewer Pot', price: 34.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
  { id: 'hk2', title: 'Modular Anodized Magnetic Knife Rack', price: 42.00, rating: 4.8, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=80' },
  { id: 'hk3', title: 'Indoor Circular Air Bamboo Bonsai Rail', price: 25.00, rating: 4.5, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80' }
];

const influencerPicks = [
  { id: 'inf1', influencer: 'Isha Mehra', handle: '@isha_lifestyle', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', text: "The cashmere overcoat combined with Vogue Essentials bags feels absolutely divine on evening strolls across tech avenues.", productLiked: 'Premium Leather Backpack' },
  { id: 'inf2', influencer: 'Chetan Dev', handle: '@dev_tech_review', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=120&auto=format&fit=crop&q=80', text: "I analyzed the SoundAura latency logs on my coding rig — 15ms flat with spatial routing! A total must-have for builders.", productLiked: 'SoundAura Wireless ANC' }
];

const liveChats = [
  { user: 'Amit R.', comment: 'Can we get this delivered in Bangalore by tomorrow evening?' },
  { user: 'Neha Sharma', comment: 'Just ordered the SoundAura, is the 25% off coupon active?' },
  { user: 'Rohit K.', comment: 'That leather backpack is extremely premium, highly recommended!' },
  { user: 'Shreya Roy', comment: 'Perfect aesthetics for my minimal work desk setups!' },
  { user: 'Vikram Gowda', comment: 'Escrow hold is an absolute lifesaver. Keeps transactions secure!' },
  { user: 'Priya Patel', comment: 'Is the organic squalane face oil cold-pressed??' }
];

const platformBrands = [
  { name: 'AuraTech', logoText: 'AT', bg: 'bg-purple-950 text-purple-300' },
  { name: 'Vogue Essentials', logoText: 'VE', bg: 'bg-amber-950 text-amber-300' },
  { name: 'EcoVentures', logoText: 'EV', bg: 'bg-emerald-950 text-emerald-300' },
  { name: 'Zenith Crafts', logoText: 'ZC', bg: 'bg-rose-950 text-rose-300' },
  { name: 'BoltAero', logoText: 'BA', bg: 'bg-blue-950 text-blue-300' },
  { name: 'PureMist Organics', logoText: 'PM', bg: 'bg-indigo-950 text-indigo-300' }
];

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  sellers,
  onNavigate,
  onAddToCart,
}) => {
  // 1. Interactive States
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 29, seconds: 48 });
  const [heartedIds, setHeartedIds] = useState<string[]>(['p1', 'p3']);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeBudgetFilter, setActiveBudgetFilter] = useState<'all' | 'Under ₹99' | 'Under ₹199' | 'Under ₹499'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [liveStreamComments, setLiveStreamComments] = useState(liveChats.slice(0, 3));
  const [frequentlyBoughtSelected, setFrequentlyBoughtSelected] = useState<string[]>(['p1', 'p4']);
  const [showFrequentlyBoughtSuccess, setShowFrequentlyBoughtSuccess] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // 2. Countdown Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 29, seconds: 48 }; // reset loop
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Rolling live streaming chat simulation
  useEffect(() => {
    const chatTimer = setInterval(() => {
      setLiveStreamComments((prev) => {
        const remainingChats = liveChats.filter(chat => !prev.some(p => p.comment === chat.comment));
        if (remainingChats.length === 0) {
          return [liveChats[Math.floor(Math.random() * liveChats.length)], prev[0], prev[1]];
        }
        const nextChat = remainingChats[Math.floor(Math.random() * remainingChats.length)];
        return [nextChat, ...prev.slice(0, 2)];
      });
    }, 4000);
    return () => clearInterval(chatTimer);
  }, []);

  // 4. Rotating top announcements
  const announcements = [
    "🔥 EXCLUSIVE OFFER: Get flat 25% OFF across premium designer lines using code NEXA25",
    "🚚 FAST DELIVERY: Enjoy free tracked shipping direct-to-destination above ₹1,000 / $100 orders",
    "🛡️ ESCROW PROMISE: Absolute transaction safety with our 14-day client vault hold",
    "💎 CRITICAL ASSURANCE: All merchant vendors are verified with active regulatory audit protocols"
  ];

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(bannerTimer);
  }, []);

  // 5. Data Sorting
  const heroSlides = [
    {
      badge: "Summer Festival 2026",
      title: "Handcrafted Luxury meet Next-Gen Audio Specs",
      desc: "Connect directly with vetted premium creators. Enjoy integrated dispatch logs and strict 14-day escrow protection on checkout.",
      highlight: "ShopNexa Elite Collection",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      cta: "Browse Flagships",
      id: "p1"
    },
    {
      badge: "Limited Edition Release",
      title: "Mastercrafted Full-Grain Cashmere & Leatherwear",
      desc: "Tailored to provide negative profile spatial storage. Sustainably sourced cashmere blended for comfortable coding cycles.",
      highlight: "Vogue Essentials Launch",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",
      cta: "Explore Fashion",
      id: "p6"
    },
    {
      badge: "Intelligent Spaces",
      title: "Vibrant Ambilight Synced Desk Installations",
      desc: "Transform your development space. Desktop-integrated RGB system matching acoustic layers dynamically on active signals.",
      highlight: "Smart Living Revolution",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      cta: "Configure Space",
      id: "p4"
    }
  ];

  // Map preloaded db products
  const flashSaleItems = products.slice(0, 3).map((item, index) => {
    const limits = [6, 3, 11];
    const claims = [82, 94, 76];
    return { ...item, stockLimit: limits[index] || 5, claimPercent: claims[index] || 80 };
  });

  const recommendedProducts = products.filter(p => p.rating >= 4.7).slice(0, 3);
  const trendingProducts = products.filter(p => !p.featured).slice(0, 4);
  const bestSellers = products.filter(p => p.id === 'p1' || p.id === 'p3' || p.id === 'p8');
  const newArrivals = products.slice().reverse().slice(0, 4);
  const premiumStores = sellers.slice(0, 3);

  // Filter budget items
  const filteredBudgetDeals = activeBudgetFilter === 'all' 
    ? budgetDeals 
    : budgetDeals.filter(b => b.limit === activeBudgetFilter);

  // 6. Functions
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartedIds((curr) => 
      curr.includes(id) ? curr.filter(item => item !== id) : [...curr, id]
    );
  };

  const handleFrequentlyBoughtToggle = (id: string) => {
    setFrequentlyBoughtSelected((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBuyBundle = () => {
    frequentlyBoughtSelected.forEach(id => {
      const prodObj = products.find(p => p.id === id);
      if (prodObj) {
        onAddToCart(prodObj);
      }
    });
    setShowFrequentlyBoughtSuccess(true);
    setTimeout(() => setShowFrequentlyBoughtSuccess(false), 3500);
  };

  const currentPromoProduct = products.find(p => p.id === heroSlides[currentHeroSlide].id) || products[0];

  return (
    <div className="space-y-12 pb-24 text-slate-900 animate-fade-in" id="home-view-container">
      
      {/* SECTION 1: TOP ANNOUNCEMENT BAR */}
      <section 
        className="w-full bg-slate-950 text-white py-2 sm:py-2.5 px-3 sm:px-4 overflow-hidden relative border-b border-white/5" 
        id="section-announcement-bar"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-wide relative z-10 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 sm:flex-initial">
            <span className="bg-gradient-to-r from-blue-500 to-amber-400 text-slate-950 font-black px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wider shrink-0 animate-pulse">
              INFO
            </span>
            <div className="transition-opacity duration-500 text-slate-100 font-medium truncate sm:whitespace-normal">
              {announcements[currentBannerIndex]}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0">
            <span className="hover:text-blue-400 cursor-pointer flex items-center gap-1">
              <Phone size={11} /> +1 (800) Shop-Nexa
            </span>
            <span>|</span>
            <span className="hover:text-amber-400 cursor-pointer flex items-center gap-1">
              <ShieldCheck size={11} /> Audited Escrow Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTEGRATED MULTI-OPTIONS SEARCH & WISHLIST OVERLAY INFO (Complementary info block) */}
      <section className="bg-white border border-slate-200/70 p-4.5 rounded-[1.8rem] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" id="section-search-info">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Percent size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Conversion Multipliers Active</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">25% Discount Coupon <span className="text-blue-600 font-bold">NEXA25</span> applied in active session memory.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => onNavigate('products', { filter: 'featured' })} 
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200/80 transition-colors flex items-center gap-1.5"
          >
            <Heart size={12} className="text-rose-600 fill-rose-600" />
            <span>Wishlisted Items ({heartedIds.length})</span>
          </button>
          <button 
            onClick={() => onNavigate('cart')} 
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart size={12} />
            <span>Instant Cart Checkout</span>
          </button>
        </div>
      </section>

      {/* SECTION 3: MEGA CATEGORY BODY EXPRESS MENU (BODY ACCENTS) */}
      <section className="space-y-4" id="section-mega-express-menu">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest font-mono">Departmental Hubs</span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Mega Category Expressway</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">6 DEPARTMENTS STANDARDIZED</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('products', { category: cat.slug })}
              className="p-4 bg-white hover:bg-slate-950 hover:text-white border border-slate-200/80 hover:border-slate-950 rounded-2xl text-left transition-all duration-300 group shadow-sm flex flex-col justify-between h-32 relative overflow-hidden"
              id={`mega-express-${cat.slug}`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 group-hover:bg-white/10 group-hover:text-blue-400 flex items-center justify-center transition-colors relative z-10">
                {cat.iconName === 'Laptop' && <Laptop size={18} />}
                {cat.iconName === 'Shirt' && <Shirt size={18} />}
                {cat.iconName === 'Home' && <Home size={18} />}
                {cat.iconName === 'Activity' && <Activity size={18} />}
                {cat.iconName === 'Sparkles' && <BeautyIcon size={18} />}
                {cat.iconName === 'BookOpen' && <BookOpen size={18} />}
              </div>
              <div className="relative z-10">
                <h4 className="text-xs font-black tracking-tight leading-tight uppercase group-hover:text-blue-300">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-400 group-hover:text-slate-300 mt-0.5">{cat.count.toLocaleString()} Listings</p>
              </div>
              <ChevronRightIcon className="absolute right-3 bottom-3 text-slate-300 group-hover:text-white group-hover:translate-x-1 duration-200 z-10" />
              
              {/* BACKDROP WATERMARK ICON (Acts like background PNG) */}
              <div className="absolute -right-4 -bottom-4 text-slate-100 group-hover:text-white/5 transition-colors duration-300 pointer-events-none z-0">
                {cat.iconName === 'Laptop' && <Laptop size={100} strokeWidth={1} />}
                {cat.iconName === 'Shirt' && <Shirt size={100} strokeWidth={1} />}
                {cat.iconName === 'Home' && <Home size={100} strokeWidth={1} />}
                {cat.iconName === 'Activity' && <Activity size={100} strokeWidth={1} />}
                {cat.iconName === 'Sparkles' && <BeautyIcon size={100} strokeWidth={1} />}
                {cat.iconName === 'BookOpen' && <BookOpen size={100} strokeWidth={1} />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 4: HERO CAROUSEL WITH OFFER BADGES & COUNTDOWN */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-[2rem] border border-slate-800 shadow-xl" id="section-hero-carousel">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Slides Content */}
        <div className="p-4 sm:p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10 transition-all duration-500">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                {heroSlides[currentHeroSlide].badge}
              </span>
              <span className="bg-white/10 border border-white/20 text-slate-300 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                <Clock size={10} className="animate-pulse" />
                <span>Escrow Hold Secured</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {heroSlides[currentHeroSlide].title.split("meet")[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300 block">
                meet {heroSlides[currentHeroSlide].title.split("meet")[1]}
              </span>
            </h1>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
              {heroSlides[currentHeroSlide].desc}
            </p>

            {/* Simulated Live Countdown Tracker */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 inline-flex flex-col sm:flex-row items-center gap-4">
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Flash Launch Closes:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                <div className="bg-slate-950 px-2.5 py-1 rounded text-white border border-white/5">{String(countdown.hours).padStart(2, '0')}h</div>
                <span>:</span>
                <div className="bg-slate-950 px-2.5 py-1 rounded text-white border border-white/5">{String(countdown.minutes).padStart(2, '0')}m</div>
                <span>:</span>
                <div className="bg-slate-950 px-2.5 py-1 rounded text-rose-400 border border-white/5 animate-pulse">{String(countdown.seconds).padStart(2, '0')}s</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('product-detail', { id: heroSlides[currentHeroSlide].id })}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-750 font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{heroSlides[currentHeroSlide].cta}</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Catalog Index
              </button>
            </div>
          </div>

          {/* Right graphic preview with quick cart adder */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl w-full max-w-sm relative group hover:border-blue-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute -top-3 -right-3 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                EXCLUSIVE VALUE
              </div>
              <img
                src={heroSlides[currentHeroSlide].image}
                alt={heroSlides[currentHeroSlide].highlight}
                className="w-full h-48 object-cover rounded-2xl group-hover:scale-102 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 space-y-2">
                <span className="text-[9px] font-bold tracking-wider text-blue-400 uppercase block">{heroSlides[currentHeroSlide].highlight}</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{currentPromoProduct.title}</h3>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-300 block">${currentPromoProduct.price}</span>
                    <span className="text-[10px] text-slate-400 line-through block">${currentPromoProduct.originalPrice}</span>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(currentPromoProduct)}
                  className="w-full py-2 bg-white text-slate-950 hover:bg-blue-400 hover:text-white font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart size={12} />
                  <span>Direct Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls & Bullet Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pb-2 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${currentHeroSlide === i ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-500'}`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* SECTION 5: QUICK CATEGORY CARDS (ROUNDED BUBBLES) */}
      <section className="space-y-4" id="section-quick-categories">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Express Access</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Rapid Shopping Circles</h2>
          <p className="text-xs text-slate-500">Pick an active department to instantly narrow our catalog down.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4.5 sm:gap-6 pt-2">
          {categories.map((cat, idx) => {
            const circleColor = [
              'ring-blue-100 bg-blue-50', 'ring-amber-100 bg-amber-50', 
              'ring-emerald-100 bg-emerald-50', 'ring-rose-100 bg-rose-50',
              'ring-purple-100 bg-purple-50', 'ring-zinc-100 bg-zinc-50'
            ][idx % 6];
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('products', { category: cat.slug })}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-4 ${circleColor} group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                  <div className="text-slate-700 p-1">
                    {cat.iconName === 'Laptop' && <Laptop size={20} />}
                    {cat.iconName === 'Shirt' && <Shirt size={20} />}
                    {cat.iconName === 'Home' && <Home size={20} />}
                    {cat.iconName === 'Activity' && <Activity size={20} />}
                    {cat.iconName === 'Sparkles' && <BeautyIcon size={20} />}
                    {cat.iconName === 'BookOpen' && <BookOpen size={20} />}
                  </div>
                </div>
                <span className="text-xs font-black tracking-tight text-slate-800 uppercase group-hover:text-blue-600 transition-colors">
                  {cat.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: FLASH SALE PORTLET */}
      <section className="bg-amber-55 bg-[#FFFBEB] border border-amber-200/60 p-6 rounded-[2.2rem] space-y-6 shadow-sm" id="section-flash-sale">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-200/50 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-amber-500 rounded-xl text-slate-950 flex items-center justify-center font-bold">
              <Flame size={18} className="animate-bounce" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nexa Flash Surge Offer</h3>
                <span className="bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Highly limited stock volumes on premium digital modules.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">Surge Closes In:</span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1.5 rounded-xl">
              <span>{String(countdown.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span>{String(countdown.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="text-rose-400">{String(countdown.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flashSaleItems.map((prod) => (
            <div 
              key={prod.id}
              onClick={() => onNavigate('product-detail', { id: prod.id })}
              className="bg-white border border-slate-205/80 p-4 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group relative"
            >
              <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded">
                SAVE {Math.round((prod.originalPrice - prod.price) / prod.originalPrice * 100)}%
              </span>
              <span className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded shadow">
                ONLY {prod.stockLimit} LEFT
              </span>

              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-50 relative">
                <img 
                  src={prod.image} 
                  alt={prod.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold block">{prod.sellerName}</span>
                  <h4 className="text-xs font-black text-slate-850 truncate">{prod.title}</h4>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold">
                    <span>Stock Claimed</span>
                    <span>{prod.claimPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: `${prod.claimPercent}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-105">
                  <div>
                    <span className="text-base font-black text-slate-900">${prod.price}</span>
                    <span className="text-[10px] text-slate-400 line-through block">${prod.originalPrice}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod);
                    }}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                    title="Add to active checkout"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: RECOMMENDED FOR YOU */}
      <section className="space-y-4" id="section-recommended">
        <div>
          <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-mono">Tailored Recommendations</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Selected For Your Workspace</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedProducts.map((prod) => (
            <div 
              key={prod.id}
              onClick={() => onNavigate('product-detail', { id: prod.id })}
              className="bg-white border border-slate-200/80 p-4.5 rounded-[1.8rem] flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 duration-300" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{prod.category}</span>
                <h4 className="text-xs font-black text-slate-850 truncate group-hover:text-blue-600 transition-colors">{prod.title}</h4>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={10} className="fill-amber-500" />
                  <span className="text-[10px] font-black">{prod.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-slate-900">${prod.price}</span>
                  <span className="text-[10px] text-blue-600 font-bold hover:underline">Request details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: TRENDING PRODUCTS */}
      <section className="space-y-4" id="section-trending">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest font-mono">Live Popularity Heatmap</span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Trending Hot Products</h2>
          </div>
          <button onClick={() => onNavigate('products')} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <span>Scroll full indices</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onNavigate('product-detail', { id: prod.id })}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-500/20 transition-all group cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-video bg-slate-50 relative overflow-hidden">
                <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-104 duration-300" referrerPolicy="no-referrer" />
                <span className="absolute top-3 left-3 bg-slate-950 text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide">
                  TRENDING
                </span>
                <button
                  onClick={(e) => toggleWishlist(prod.id, e)}
                  className="absolute top-3 right-3 p-1.5 bg-white/70 hover:bg-white text-slate-600 hover:text-rose-600 rounded-full transition-colors z-10"
                >
                  <Heart size={13} className={heartedIds.includes(prod.id) ? 'fill-rose-500 text-rose-500' : ''} />
                </button>
              </div>

              <div className="p-4.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>{prod.sellerName}</span>
                    <span className="capitalize">{prod.category}</span>
                  </div>
                  <h3 className="text-xs font-black text-slate-850 mt-1 uppercase duration-200">{prod.title}</h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">${prod.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod);
                    }}
                    className="text-[10px] bg-slate-900 hover:bg-blue-600 text-white font-black px-3 py-1.5 rounded-xl transition-all"
                  >
                    + Rapid Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: BEST SELLERS */}
      <section className="space-y-4" id="section-bestsellers">
        <div>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-mono">Traction Leaderboard</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Best Sellers Highlights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((prod) => (
            <div 
              key={prod.id}
              onClick={() => onNavigate('product-detail', { id: prod.id })}
              className="bg-slate-950 text-white p-5 rounded-[2rem] hover:scale-[1.01] duration-300 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-48 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="bg-amber-500 text-slate-950 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    BEST SELLER
                  </span>
                  <h4 className="text-xs font-black truncate max-w-[160px]">{prod.title}</h4>
                  <p className="text-[10px] text-slate-400">Merchant: {prod.sellerName}</p>
                </div>
                <img src={prod.image} alt={prod.title} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
              </div>

              <div className="flex items-end justify-between border-t border-white/5 pt-3">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">DIRECT VALUE</span>
                  <strong className="text-sm text-amber-300 font-extrabold">${prod.price}</strong>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(prod);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-750 text-white font-black text-[10px] rounded-xl transition-colors"
                >
                  Buy Instantly
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: NEW ARRIVALS */}
      <section className="space-y-4" id="section-new-arrivals">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">Fresh Off Production</span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">New Catalog Releases</h2>
          </div>
          <span className="text-[10px] font-black text-slate-400 font-mono tracking-wider">4 FRESH ENTRIES INGESTED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onNavigate('product-detail', { id: prod.id })}
              className="bg-white border border-slate-201 hover:shadow-lg transition-all rounded-3xl p-3 flex flex-col justify-between cursor-pointer group"
            >
              <div className="aspect-[4/3] rounded-2.5xl overflow-hidden bg-slate-50 relative">
                <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-102 duration-200" referrerPolicy="no-referrer" />
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow">
                  NEW ARRIVAL
                </span>
              </div>
              <div className="pt-3.5 space-y-2">
                <div>
                  <span className="text-[9px] text-slate-400 font-semibold block">{prod.sellerName}</span>
                  <h4 className="text-xs font-black text-slate-850 truncate">{prod.title}</h4>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs font-black text-slate-900">${prod.price}</span>
                  <span className="text-[9px] text-blue-600 font-bold group-hover:underline">Spec sheet</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: TOP BRANDS (SLIDING LOGOS ACCENT) */}
      <section className="bg-slate-900 text-white py-8 px-6 rounded-[2rem]" id="section-top-brands">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[8px] font-black text-amber-400 tracking-widest uppercase font-mono">Audited Partnerships</span>
            <h3 className="text-base font-black tracking-tight leading-tight">Elite Global Brand Collaborations</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-center">
            {platformBrands.map((brand, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/35 duration-200 transition-colors"
                title={`${brand.name} authorized pipeline`}
              >
                <span className={`w-7 h-7 rounded-lg text-xs font-bold leading-none flex items-center justify-center ${brand.bg}`}>
                  {brand.logoText}
                </span>
                <span className="text-xs font-semibold text-slate-300">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: PREMIUM BRAND STORES SHOWCASE */}
      <section className="space-y-4" id="section-premium-stores">
        <div>
          <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest font-mono">SaaS Escrow Integration</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Premium Partner Stores</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {premiumStores.map((store) => (
            <div 
              key={store.id}
              className="bg-white border border-slate-200 p-5 rounded-[2.2rem] flex flex-col justify-between hover:shadow-md transition-all h-64 shadow-sm"
              id={`premium-store-${store.id}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={store.logo} alt={store.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{store.name}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold">Registered Vendor {store.joinedDate}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                  <div>
                    <span className="text-[8px] text-slate-400 block font-bold">RATING</span>
                    <strong className="text-[11px] text-slate-800 flex items-center justify-center gap-0.5">
                      <Star size={10} className="fill-amber-500 text-amber-500" /> {store.rating}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block font-bold">REVIEWS</span>
                    <strong className="text-[11px] text-slate-850">{(store.reviewCount || 400).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block font-bold">COMMISSION</span>
                    <strong className="text-[11px] text-emerald-600">~{store.commissionRate * 100}%</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('products', { seller: store.id })}
                className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white hover:text-white font-black text-[10px] rounded-xl transition-all"
              >
                Browse Vendor Boutique
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 13: SPECIAL BUDGET DEALS SLIDER HEADER */}
      <section className="bg-slate-50 rounded-[2.2rem] border border-slate-200/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4" id="section-budget-deals-intro">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 font-bold">
            <Tag size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nexa Indian Budget Deals</h3>
            <p className="text-xs text-slate-500 mt-0.5">Specialized pricing brackets tailored to optimize cargo value.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex-wrap">
          {['all', 'Under ₹99', 'Under ₹199', 'Under ₹499'].map((filterVal) => (
            <button
              key={filterVal}
              onClick={() => setActiveBudgetFilter(filterVal as any)}
              className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${activeBudgetFilter === filterVal ? 'bg-amber-500 text-slate-950' : 'text-slate-650 hover:bg-slate-50'}`}
            >
              {filterVal === 'all' ? 'Show All' : filterVal}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 14: UNDER ₹99 / ₹199 / ₹499 SECTION */}
      <section className="space-y-4" id="section-under-price-caps">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredBudgetDeals.map((deal) => {
            const parsedUSD = Math.round(deal.priceRupees / 83 * 100) / 100;
            return (
              <div 
                key={deal.id}
                className="bg-white border border-slate-200 hover:border-amber-500/40 p-3 rounded-2.5xl flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 relative">
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-102 duration-200" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1.5 left-1.5 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide font-mono">
                      {deal.limit}
                    </span>
                  </div>
                  <h4 className="text-[10px] font-black text-slate-800 tracking-tight leading-snug truncate-2-lines">{deal.title}</h4>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-extrabold text-slate-900">₹{deal.priceRupees}</strong>
                    <span className="text-[9px] text-slate-400 line-through block">₹{deal.originalPriceRupees}</span>
                  </div>
                  <button 
                    onClick={() => {
                      // Map custom product object for cart ingestion
                      const virtualProduct: Product = {
                        id: deal.id,
                        title: `${deal.title} (${deal.limit})`,
                        price: parsedUSD,
                        originalPrice: parsedUSD * 2.5,
                        category: 'books',
                        rating: 5.0,
                        ratingCount: 1,
                        sellerId: 'v3',
                        sellerName: 'Budget Deals Store',
                        description: `Indian Budget items listed under ${deal.limit}. Secure checkout enabled.`,
                        image: deal.image,
                        specs: { 'Origin': 'Made in India', 'Currency': 'INR' },
                        stock: 99
                      };
                      onAddToCart(virtualProduct);
                    }}
                    className="p-1.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-900 rounded-lg transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 15: ELECTRONICS SPECIAL DEALS DEEP FOCUS */}
      <section className="space-y-4" id="section-electronics-deals">
        <div>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-mono">Hardware Pipelines</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Electronics Deeply Deserved</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.filter(p => p.category === 'electronics').slice(0, 2).map((item) => (
            <div 
              key={item.id}
              onClick={() => onNavigate('product-detail', { id: item.id })}
              className="bg-white border border-slate-200 rounded-[2rem] p-5 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-5"
            >
              <div className="w-full sm:w-44 h-40 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    ANC FLAGSHIP
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed truncate-3-lines">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-sm font-black text-slate-900">${item.price}</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1">${item.originalPrice}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 hover:underline">Request logistics status</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 16: FASHION COLLECTION */}
      <section className="space-y-4" id="section-fashion-deals">
        <div>
          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest font-mono">Sustainably Sourced Threads</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">The Modern Fashion Wardrobe</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.filter(p => p.category === 'fashion').slice(0, 2).map((item) => (
            <div 
              key={item.id}
              onClick={() => onNavigate('product-detail', { id: item.id })}
              className="bg-white border border-slate-200 rounded-[2rem] p-5 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-5"
            >
              <div className="w-full sm:w-44 h-40 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                    VOGUE ORIGINAL
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed truncate-3-lines">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 col-auto">
                  <div>
                    <span className="text-sm font-black text-slate-900">${item.price}</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1">${item.originalPrice}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 hover:underline">Examine fit guides</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 17: BEAUTY PRODUCTS */}
      <section className="space-y-4" id="section-beauty-collection">
        <div>
          <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest font-mono">Skin wellness indexes</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Beauty Oils & Accents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beautyProducts.map((beauty) => (
            <div 
              key={beauty.id}
              className="bg-white border border-slate-200 p-4 rounded-[1.8rem] hover:shadow-md transition-all relative group"
            >
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden">
                <img src={beauty.image} alt={beauty.title} className="w-full h-full object-cover group-hover:scale-101 duration-300" referrerPolicy="no-referrer" />
              </div>
              <div className="mt-4 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">100% Organic certified</span>
                <h4 className="text-xs font-black text-slate-850 truncate">{beauty.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-black text-slate-900">${beauty.price}</span>
                  <button 
                    onClick={() => {
                      const mockProduct: Product = {
                        id: beauty.id,
                        title: beauty.title,
                        price: beauty.price,
                        originalPrice: beauty.price * 1.5,
                        category: 'beauty',
                        rating: beauty.rating,
                        ratingCount: beauty.reviews,
                        sellerId: 'v3',
                        sellerName: 'EcoVentures Beauty',
                        description: 'A deeply soothing beauty treatment compiled direct-from-source organically.',
                        image: beauty.image,
                        specs: { 'Source': 'Himalayan foothills', 'Volume': '50ml' },
                        stock: 14
                      };
                      onAddToCart(mockProduct);
                    }}
                    className="text-[10px] font-black text-blue-600 hover:underline"
                  >
                    + Add to checkout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 18: GROCERY ESSENTIALS */}
      <section className="space-y-4" id="section-grocery-collection">
        <div>
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">Fresh Harvest Storage</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Premium Grocery Essentials</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groceryEssentials.map((grocery) => (
            <div 
              key={grocery.id}
              className="bg-white border border-slate-200 p-4 rounded-[1.8rem] hover:shadow-md transition-all relative group"
            >
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden">
                <img src={grocery.image} alt={grocery.title} className="w-full h-full object-cover group-hover:scale-101 duration-300" referrerPolicy="no-referrer" />
              </div>
              <div className="mt-4 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Sourced directly • {grocery.weight}</span>
                <h4 className="text-xs font-black text-slate-850 truncate">{grocery.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-black text-slate-900">${grocery.price}</span>
                  <button 
                    onClick={() => {
                      const mockProduct: Product = {
                        id: grocery.id,
                        title: grocery.title,
                        price: grocery.price,
                        originalPrice: grocery.price * 1.4,
                        category: 'sports',
                        rating: 4.9,
                        ratingCount: 52,
                        sellerId: 'v3',
                        sellerName: 'EcoVentures Organics',
                        description: 'Raw agricultural output packed sustainably with full health validation seals.',
                        image: grocery.image,
                        specs: { 'Weight': grocery.weight, 'Expiry': '12 Months' },
                        stock: 25
                      };
                      onAddToCart(mockProduct);
                    }}
                    className="text-[10px] font-black text-emerald-600 hover:underline"
                  >
                    Add healthy bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 19: HOME & KITCHEN */}
      <section className="space-y-4" id="section-home-kitchen">
        <div>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-mono">Aesthetic living spaces</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Home & Kitchen Stonewares</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeAndKitchen.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-slate-200 p-4 rounded-[1.8rem] hover:shadow-md transition-all relative group"
            >
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-101 duration-300" referrerPolicy="no-referrer" />
              </div>
              <div className="mt-4 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Designed for daily calm</span>
                <h4 className="text-xs font-black text-slate-850 truncate">{item.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-black text-slate-900">${item.price}</span>
                  <button 
                    onClick={() => {
                      const mockProduct: Product = {
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        originalPrice: item.price * 1.5,
                        category: 'smart-home',
                        rating: item.rating,
                        ratingCount: 38,
                        sellerId: 'v3',
                        sellerName: 'Minimalist Cookware Co.',
                        description: 'High performance clay and ceramic ware designed with extreme negative contours.',
                        image: item.image,
                        specs: { 'Material': 'Glazed Clay', 'Washable': 'Yes' },
                        stock: 10
                      };
                      onAddToCart(mockProduct);
                    }}
                    className="text-[10px] font-black text-blue-600 hover:underline"
                  >
                    Buy pottery item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 20: FREQUENTLY BOUGHT TOGETHER WITH REAL-TIME ADD LOGIC */}
      <section className="bg-slate-900 text-white rounded-[2.2rem] p-6 space-y-6 border border-slate-800" id="section-frequent-bundles">
        <div className="border-b border-white/5 pb-4">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest font-mono">Direct Synergy Savings</span>
          <h3 className="text-base font-black tracking-tight leading-tight">Frequently Bought Together Bundle</h3>
          <p className="text-xs text-slate-400 mt-0.5">Combine these items to claim an instant additional 10% bundle coupon automatically!</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {/* Item 1 */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
              <input 
                type="checkbox" 
                checked={frequentlyBoughtSelected.includes('p1')} 
                onChange={() => handleFrequentlyBoughtToggle('p1')}
                className="w-4.5 h-4.5 text-blue-600 rounded"
              />
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80" alt="Item One" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div>
                <strong className="block font-bold">SoundAura Wireless ANC</strong>
                <span className="text-slate-400 font-mono">$199.99</span>
              </div>
            </div>

            <span className="text-xl font-bold text-slate-500">+</span>

            {/* Item 2 */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
              <input 
                type="checkbox" 
                checked={frequentlyBoughtSelected.includes('p4')} 
                onChange={() => handleFrequentlyBoughtToggle('p4')}
                className="w-4.5 h-4.5 text-blue-600 rounded"
              />
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80" alt="Item Two" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
              <div>
                <strong className="block font-bold">NexaGlow Ambilight Bar</strong>
                <span className="text-slate-400 font-mono">$45.50</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl min-w-[220px] text-right space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">BUNDLE PRICING</span>
              <div className="flex items-center justify-end gap-2 mt-1">
                {frequentlyBoughtSelected.length === 2 ? (
                  <>
                    <span className="text-xs text-slate-400 line-through">$245.49</span>
                    <strong className="text-lg font-black text-amber-300">$220.94</strong>
                  </>
                ) : frequentlyBoughtSelected.length === 1 ? (
                  <strong className="text-lg font-black text-amber-300">
                    ${frequentlyBoughtSelected.includes('p1') ? '199.99' : '45.50'}
                  </strong>
                ) : (
                  <strong className="text-lg font-black text-slate-500">$0.00</strong>
                )}
              </div>
              {frequentlyBoughtSelected.length === 2 && (
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">✓ Saved additional $24.55!</span>
              )}
            </div>

            <button
              onClick={handleBuyBundle}
              disabled={frequentlyBoughtSelected.length === 0}
              className={`w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/15 transition-all text-center flex items-center justify-center gap-1.5 ${frequentlyBoughtSelected.length === 0 && 'opacity-40 cursor-not-allowed'}`}
            >
              <ShoppingCart size={13} />
              <span>Purchase Synergy Bundle</span>
            </button>
          </div>
        </div>

        {showFrequentlyBoughtSuccess && (
          <div className="p-4 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800 text-xs font-bold text-center animate-scale-up">
            🎉 SUCCESS: Selected bundle items added to checkout with active coupons automatically!
          </div>
        )}
      </section>

      {/* SECTION 21: RECENTLY VIEWED (SESSION RECENT STICKERS) */}
      <section className="space-y-4" id="section-recently-viewed">
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Session Cache History</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Recently Visited Listings</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[products[0], products[2], products[3], products[1]].map((prod) => (
            <div 
              key={prod.id}
              onClick={() => onNavigate('product-detail', { id: prod.id })}
              className="bg-white border border-slate-200/75 p-3.5 rounded-2xl flex items-center gap-3 hover:border-blue-500/20 shadow-sm transition-all cursor-pointer group"
            >
              <img src={prod.image} alt={prod.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" referrerPolicy="no-referrer" />
              <div className="truncate">
                <h4 className="text-[11px] font-black text-slate-800 truncate">{prod.title}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-slate-900">${prod.price}</span>
                  <span className="text-[9px] text-slate-400 line-through">${prod.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 22: INFLUENCER PICKS */}
      <section className="space-y-4" id="section-influencer-picks">
        <div>
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest font-mono">Curated styling blocks</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Creators & Influencers Picks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {influencerPicks.map((pick) => (
            <div 
              key={pick.id}
              className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-5 items-start bg-gradient-to-tr from-slate-50 to-white"
            >
              <div className="flex items-center gap-3 flex-shrink-0">
                <img src={pick.avatar} alt={pick.influencer} className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-100 shadow" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{pick.influencer}</h4>
                  <span className="text-[10px] text-blue-600 font-mono font-bold block">{pick.handle}</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-xs text-slate-650 italic leading-relaxed">
                  "{pick.text}"
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Faves: <strong className="text-slate-800">{pick.productLiked}</strong></span>
                  <button 
                    onClick={() => onNavigate('products')} 
                    className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <span>Inspect item</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 23: LIVE SHOPPING EVENT PANEL */}
      <section className="bg-slate-950 text-white rounded-[2.2rem] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 border border-slate-800 relative overflow-hidden" id="section-live-shopping">
        <div className="absolute top-0 right-1/2 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest font-mono">LIVE RECORDING • STAGE ACTIVE</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Desk Setup Aesthetics & Audio Tech</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
              Platform director Prem Kumar reviews AuraTech spatial hardware, testing audio latency, ambilight sync speeds, and 14-day escrow clearing paths.
            </p>
          </div>

          {/* Pseudo Video Player Placeholder Frame */}
          <div className="relative aspect-video max-w-lg bg-slate-900 rounded-2xl overflow-hidden border border-white/10 group flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80" alt="Video Player frame" className="absolute top-0 left-0 w-full h-full object-cover opacity-40 group-hover:scale-101 duration-300" referrerPolicy="no-referrer" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-750 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer">
                <Play size={24} className="ml-1 fill-white" />
              </span>
              <span className="text-[10px] tracking-widest font-black uppercase text-amber-400">CONNECTING STREAMING PORTS</span>
            </div>
            {/* Live Indicator overlay */}
            <span className="absolute bottom-3 left-3 bg-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
              <Eye size={10} /> 1,420 watching
            </span>
          </div>
        </div>

        {/* Live Chats Stream panel */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-80">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Stream Live Chat Feed</span>
            <div className="space-y-3 max-h-[200px] overflow-hidden">
              {liveStreamComments.map((chat, idx) => (
                <div key={idx} className="text-xs space-y-0.5 animate-fade-in">
                  <span className="font-mono text-amber-300 font-bold block">{chat.user}:</span>
                  <p className="text-slate-300 italic">"{chat.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              placeholder="Post a comment to stream..." 
              className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" 
              readOnly 
              value="Checking server credentials..."
            />
            <button className="p-1.5 bg-blue-600 rounded-lg text-white" disabled>
              <Send size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 24: WHY SHOP WITH US */}
      <section className="space-y-4" id="section-why-us">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Platform Core Pillars</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">The ShopNexa Trust Standard</h2>
          <p className="text-xs text-slate-500">Why thousands of builders shop direct-from-vendor securely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-3">
          <div className="p-5 bg-white border border-slate-200/80 rounded-2.5xl text-center space-y-3 hover:shadow-md duration-300 transition-all">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck size={20} />
            </div>
            <strong className="text-xs font-black text-slate-900 uppercase tracking-tight block">14-Day Escrow Guard</strong>
            <p className="text-[10px] text-slate-500 leading-relaxed">Funds remain locked in safety reserves until delivery logs confirm standard arrival.</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2.5xl text-center space-y-3 hover:shadow-md duration-300 transition-all">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Award size={20} />
            </div>
            <strong className="text-xs font-black text-slate-900 uppercase tracking-tight block">Verified Elite Sellers</strong>
            <p className="text-[10px] text-slate-500 leading-relaxed">Audited legal identification coordinates, genuine stock validation, and star score minimums protect catalogs.</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2.5xl text-center space-y-3 hover:shadow-md duration-300 transition-all">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Activity size={20} />
            </div>
            <strong className="text-xs font-black text-slate-900 uppercase tracking-tight block">Real-time GPS Logs</strong>
            <p className="text-[10px] text-slate-500 leading-relaxed">Every dispatch connects direct to localized APIs. Tracking details update automatically inside dashboards.</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2.5xl text-center space-y-3 hover:shadow-md duration-300 transition-all">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw size={20} />
            </div>
            <strong className="text-xs font-black text-slate-900 uppercase tracking-tight block">Zero Agent Markup</strong>
            <p className="text-[10px] text-slate-500 leading-relaxed">We bypass traditional wholesale markup pricing. Buy direct-from-vendor. Saves up to 40% value.</p>
          </div>
        </div>
      </section>

      {/* SECTION 25: CUSTOMER REVIEWS INDEX */}
      <section className="space-y-4" id="section-testimonials">
        <div>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-mono">Verified Customer Voice</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Testimonials & Reviews</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { author: 'Vikram Srinivasan', comment: 'The premium overcoat cashmere blazer feels absolutely top-notch. Secure escrow hold let me order with zero loss apprehension!', rating: 5, date: 'May 14, 2026', title: 'Absolute premium thread count' },
            { author: 'Ananya Sharma', comment: 'SoundAura ANC beats my high brand headphones in noise cancellation depth. Arrived flat in Bangalore inside 36 hours.', rating: 5, date: 'May 18, 2026', title: 'Audiophile grade cancellation' },
            { author: 'Rahul Gupta', comment: 'Ambilight bars are linear custom Linear Jade gasket mechanical switches — typing feedback is crisp, pure mechanical delight.', rating: 4, date: 'May 20, 2026', title: 'Top tier tactile feedback' }
          ].map((rev, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={11} className={idx < rev.rating ? 'fill-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                </div>
                <strong className="text-xs font-bold text-slate-900 uppercase block">{rev.title}</strong>
                <p className="text-[11px] text-slate-500 italic leading-relaxed truncate-3-lines">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                  {rev.author.charAt(0)}
                </div>
                <span className="text-[10px] text-slate-700 font-bold">{rev.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 26: SELLER ONBOARDING INVITATION PANEL */}
      <section className="bg-gradient-to-tr from-slate-950 to-slate-900 text-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 relative overflow-hidden text-center border border-slate-800" id="section-seller-onboarding">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block font-mono">Open Partner Ecosystem</span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Interested in Listing Your Craft Brand?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Onboard as a registered ShopNexa vendor under 5 minutes. Take advantage of automated bank deposits, integrated API shipping labels, and a flat 0% listing setup protocol.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => onNavigate('seller-dashboard')} 
              className="px-6 py-3 bg-white hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl active:scale-95 transition-all outline-none"
            >
              Access Business Entrance
            </button>
            <button 
              onClick={() => onNavigate('help-center')} 
              className="px-6 py-3 bg-slate-800 hover:bg-slate-705 text-white border border-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              View Commission Structures
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 27: APP DOWNLOAD GRAPHIC BANNER */}
      <section className="bg-gradient-to-tr from-blue-900 to-indigo-950 text-white rounded-[2rem] sm:rounded-[2.2rem] p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border border-indigo-900/40 shadow-xl" id="section-app-download">
        <div className="md:col-span-8 space-y-4">
          <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest font-mono">Modern pocket commerce</span>
          <h3 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
            Download the ShopNexa Application
          </h3>
          <p className="text-slate-350 text-xs leading-relaxed max-w-xl">
            Track shipping coordinates, verify escrow releases, and enjoy swift biometric checkout options direct from your mobile device. Scan the matrix or tap to install instantly.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white border border-white/10 rounded-xl text-xs flex items-center gap-2 transition-colors">
              <Smartphone size={13} />
              <div className="text-left leading-none">
                <span className="text-[9px] text-slate-400 font-bold block bg-transparent">GET IT ON</span>
                <strong className="text-xs font-black">Google Play</strong>
              </div>
            </button>
            <button className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white border border-white/10 rounded-xl text-xs flex items-center gap-2 transition-colors">
              <Download size={13} />
              <div className="text-left leading-none">
                <span className="text-[9px] text-slate-400 font-bold block bg-transparent">DOWNLOAD ON THE</span>
                <strong className="text-xs font-black">App Store</strong>
              </div>
            </button>
          </div>
        </div>

        {/* QR Preview Side */}
        <div className="md:col-span-4 flex flex-col items-center bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="w-28 h-28 bg-white p-2.5 rounded-xl flex items-center justify-center">
            {/* Mock Vector QR representation */}
            <div className="w-full h-full border-4 border-slate-950 p-1.5 flex flex-wrap justify-between">
              <div className="w-7 h-7 bg-slate-950"></div>
              <div className="w-7 h-7 bg-slate-950"></div>
              <div className="w-7 h-7 bg-slate-950"></div>
              <div className="w-10 h-10 self-end bg-slate-950"></div>
            </div>
          </div>
          <span className="text-[10px] font-black tracking-widest text-blue-300 font-mono text-center block">SCAN TO DOWNLOAD APP [v1.0.4]</span>
        </div>
      </section>

      {/* SECTION 28: NEWSLETTER (FEEDBACK TRANSITION INSTALLED) */}
      <section className="bg-slate-50 border border-slate-200/60 rounded-[2.2rem] p-6 md:p-10" id="section-newsletter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[9px] font-mono font-black text-blue-600 uppercase tracking-widest block">Stay In Sync</span>
            <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase">Subscribe to Our Design Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
              Get notified on verified creator launches, limited stock flash drops, and weekly platform escrow policy updates. No catalog spam, unsubscribe anytime.
            </p>
          </div>

          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 animate-scale-up">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">Subscription Completed!</strong>
                  <span className="text-[10px] leading-relaxed">Check your mailbox for premium validation links. Welcome onboard!</span>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) {
                    setIsSubscribed(true);
                  }
                }} 
                className="flex gap-2"
              >
                <input 
                  type="email" 
                  required
                  placeholder="Inscribe email address..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-201 text-xs rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white" 
                />
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 29: RICH ENHANCED BODY FOOTER HELPLINES */}
      <section className="bg-white border border-slate-200/80 p-5 rounded-[2rem] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs" id="section-rich-compliances">
        <div className="space-y-1">
          <strong className="text-slate-850 block font-bold uppercase tracking-wider font-mono">Platform Helplines</strong>
          <span className="text-slate-500">Helpline email: <strong className="text-blue-600">licensing@shopnexa.com</strong></span>
          <span className="text-slate-500 block">Immediate Escalation: <strong className="text-slate-800">+1 (800) 555-NEXA</strong></span>
        </div>
        <div className="space-y-1">
          <strong className="text-slate-850 block font-bold uppercase tracking-wider font-mono">Escrow Auditing</strong>
          <span className="text-slate-500">AES-256 ledger security. Funds releases require verified logistics delivery metrics confirmation.</span>
        </div>
        <div className="space-y-1">
          <strong className="text-slate-850 block font-bold uppercase tracking-wider font-mono">Local Node</strong>
          <span className="text-slate-500">ShopNexa Corp, 124 Innovation Blvd, Bangalore, Karnataka, 560001, India.</span>
        </div>
      </section>

    </div>
  );
};

// Generic Icon component to satisfy JSX elements
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
