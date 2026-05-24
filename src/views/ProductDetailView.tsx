import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Star, ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart, 
  MessageSquare, AlertCircle, Sparkles, Share2, Copy, Check, 
  ChevronRight, Play, RotateCcw, Box, HelpCircle, Flag, Info, 
  CreditCard, ChevronDown, SlidersHorizontal, ArrowLeftRight, CheckCircle2,
  Trash2, Plus, Minus, ThumbsUp, X, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Review, Category } from '../types';
import { mockReviewsByProductId } from '../data';

interface ProductDetailViewProps {
  productId: string;
  products: Product[];
  onNavigate: (view: string, extra?: any) => void;
  onAddToCart: (product: Product, quantity?: number, spec?: string) => void;
}

// Interfaces for custom rich enrichment structures
interface EnrichmentData {
  gallery: string[];
  videoThumbnail: string;
  videoUrl: string;
  rotationImages: string[];
  highlights: { title: string; desc: string; icon: string }[];
  coupons: { code: string; label: string; minAmount: number; saving: number }[];
  bankOffers: { bank: string; terms: string; discount: string }[];
  emiOptions: { months: number; amount: number; rate: string }[];
  boxContents: string[];
  sizeChart: { size: string; chest: string; length: string; shoulder: string }[];
  aiSentiment: {
    score: number;
    positives: string[];
    negatives: string[];
    summary: string;
  };
  qa: { q: string; a: string; votes: number; userVoted?: boolean; date: string }[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  products,
  onNavigate,
  onAddToCart,
}) => {
  // --- 1. CORE FIND PRODUCT STATE ---
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="text-center py-24 animate-fade-in space-y-6">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full">
          <AlertCircle size={32} />
        </div>
        <p className="text-xl font-bold text-slate-800">Product Variant Offline</p>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We could not locate this customized listing. The seller may have temporarily paused inventory for replenishment.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 bg-blue-600 text-white font-extrabold text-xs rounded-2xl shadow-lg hover:bg-blue-700 transition"
        >
          Return to Marketplace Catalog
        </button>
      </div>
    );
  }

  // --- 2. MULTI-PERSPECTIVE DATA ENRICHMENT SCHEMAS ---
  // We establish high-fidelity mock assets tailored to the product categories
  const getEnrichmentData = (prod: Product): EnrichmentData => {
    const isFashion = prod.category === 'fashion';
    const isElec = prod.category === 'electronics' || prod.category === 'smart-home';

    const defaultGallery = [
      prod.image,
      isFashion 
        ? 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80',
      isFashion
        ? 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
      isFashion
        ? 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80'
    ];

    const rotationImages = [
      prod.image,
      isFashion
        ? 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
      isFashion
        ? 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
      prod.image
    ];

    const highlightsMap = {
      electronics: [
        { title: 'Aerospace Grade Build', desc: 'Crafted with premium anodized housing and sweatproof rubber components.', icon: 'Award' },
        { title: 'Intelligent Charging Grid', desc: 'Preserves cell health with smart cycle power cutoffs and overcharge barriers.', icon: 'Zap' },
        { title: 'Zero Latency Sync', desc: 'Low bluetooth transmission interval suited for realtime streaming and audio gaming panels.', icon: 'Cpu' }
      ],
      fashion: [
        { title: 'Sustainably Sourced Base', desc: '100% trace certified organic fibers processed without microplastic waste margins.', icon: 'Leaf' },
        { title: 'Reinforced Twin Stitching', desc: 'Dual-pass thread seals guarantee absolute durability across stress joints.', icon: 'Activity' },
        { title: 'High Circulating Breathability', desc: 'Promotes rapid sweat evaporation under warm seasons or dynamic motion.', icon: 'Wind' }
      ]
    };

    const highlights = isFashion ? highlightsMap.fashion : highlightsMap.electronics;

    // Coupons configuration
    const coupons = [
      { code: 'NEXA25', label: 'Save 25% Off Storewide', minAmount: 40, saving: Math.round(prod.price * 0.25) },
      { code: 'SECURE10', label: 'Extra $10 on Verified Escrow Signups', minAmount: 100, saving: 10 },
      { code: 'FREESHIP', label: 'Waive standard logistics fees', minAmount: 50, saving: 10 }
    ];

    // Bank card offers
    const bankOffers = [
      { bank: 'Nexa Platinum Card', terms: 'Get 5% unlimited cashback as instant platform ledger balances.', discount: '5% Instant Back' },
      { bank: 'Global Premium Bank', terms: 'Apply Credit EMI checkout for flat $15 voucher codes on verification.', discount: '$15 Cashback Credit' },
      { bank: 'Unified UPI Network', terms: 'Settle via verified instant code scanner and receive $3 discount rewards.', discount: '$3 Unified Wallet Off' }
    ];

    // EMI breakdown
    const emiOptions = [
      { months: 3, amount: Math.round((prod.price / 3) * 1.02), rate: '12% p.a.' },
      { months: 6, amount: Math.round((prod.price / 6) * 1.04), rate: '14% p.a.' },
      { months: 12, amount: Math.round((prod.price / 12) * 1.05), rate: 'No-Cost Promo' }
    ];

    // Box checklist
    const boxContents = isFashion
      ? ['Premium Product Variant', 'Scented Linen Storage Dust Bag', 'Nexa Certified Quality Check Seal Card', 'Recycled Cardboard Outer Frame Box']
      : ['Product Hard Body Frame', 'USB-C Shielded Fast Charging Wire', 'Warranty Certificate & Audit Certificate', 'Sustainable Protective Cushioning Mould'];

    // Sizing Matrix
    const sizeChart = [
      { size: 'S / Spec V1', chest: '36 in / Minimal', length: '27 in / Base', shoulder: '16.5 in / Short' },
      { size: 'M / Spec V2', chest: '38 in / Standard', length: '28 in / Flat', shoulder: '17 in / Comfort' },
      { size: 'L / Spec V3', chest: '40 in / Expanded', length: '29 in / Long', shoulder: '18 in / Wide' },
      { size: 'XL / Spec V4', chest: '42 in / Maximum', length: '30 in / Tall', shoulder: '19 in / Deep' }
    ];

    // AI generated dynamic review analysis
    const aiSentiment = {
      score: prod.rating >= 4.8 ? 96 : 89,
      positives: isElec 
        ? ['Incredible acoustic clarity and high-capacity battery range', 'Instant seamless smartphone syncing and zero noise leakages'] 
        : ['Exquisitely soft cashmere material and premium heavy drape layouts', 'Extremely resilient to stretching or standard machine wear parameters'],
      negatives: isElec
        ? ['Charging cable included in box is relatively short', 'Microphone profile is sensitive to strong wind breezes']
        : ['Sizing runs slightly smaller across athletic shoulders', 'Dry cleaning recommended for initial cyclic care'],
      summary: `Based on over ${prod.ratingCount} independent reviews parsed by the Nexa-AI Core, customers heavily praise the robust build, pristine finish stability, and supreme utility of this listing. Minor observations concern component accessories, making this a stellar verified purchase for utility enthusiasts.`
    };

    // Customer Questions
    const qa = [
      { q: 'Is the warranty valid internationally or region specific?', a: 'The included 1 Year Brand Warranty represents full global coverage. Authorized brand centers will verify your digital purchase receipt online automatically.', votes: 14, date: '2026-04-12' },
      { q: 'What is the recommended cleaning/upkeep instructions?', a: isFashion ? 'We recommend mild handwashing or gentle dry cleans to protect the delicate raw organic thread matrices.' : 'A soft microfiber cloth wipe maintains the premium casing look. Avoid exposing charging contact points to heavy wet fluids.', votes: 9, date: '2026-05-02' },
      { q: 'Are returns truly safe on the Nexa platform?', a: 'Absolutely. Nexa secures payment holds inside an isolated Escrow ledger. If you initiate a return within 14 days, the courier collects the parcel, and funds release to your original wallet instantly on system arrival check.', votes: 31, date: '2026-05-10' }
    ];

    return {
      gallery: defaultGallery,
      videoThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-lying-on-a-table-32986-large.mp4',
      rotationImages,
      highlights,
      coupons,
      bankOffers,
      emiOptions,
      boxContents,
      sizeChart,
      aiSentiment,
      qa
    };
  };

  const enrichment = getEnrichmentData(product);

  // --- 3. DYNAMIC STATES ---
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Custom video controller
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 360 viewer controller
  const [is360Active, setIs360Active] = useState<boolean>(false);
  const [rotationIndex, setRotationIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Options configuration
  const fallbackOptions = product.category === 'fashion' 
    ? ['Organic Cashmere Cream', 'Midnight Core Charcoal', 'Luxe Camel Beige'] 
    : ['Standard Space Grey', 'Premium Obsidian Matte', 'Arctic Silver Essence'];

  const sizesList = product.category === 'fashion' 
    ? ['S', 'M', 'L', 'XL'] 
    : ['V1 Base System', 'V2 Pro Package'];

  const [selectedColor, setSelectedColor] = useState<string>(fallbackOptions[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeFeedback, setPincodeFeedback] = useState<{ status: 'success' | 'error' | 'idle'; message: string }>({ status: 'idle', message: '' });
  
  // Modals & triggers
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportComment, setReportComment] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  
  // Coupon systems
  const [copiedCoupon, setCopiedCoupon] = useState<string>('');
  
  // Dynamic user Q&A state
  const [qaList, setQaList] = useState(enrichment.qa);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [qaFeedback, setQaFeedback] = useState<string>('');

  // Wishlist, Compare synchronized keys matching Catalog lists
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nexa_hearted_pids');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.includes(product.id);
      }
    } catch (e) {}
    return false;
  });

  const [compareProductIds, setCompareProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('compare_product_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCompareShared, setIsCompareShared] = useState<boolean>(compareProductIds.includes(product.id));

  // Recently Viewed tracker execution inside clean useEffect hook
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recently_viewed_pids');
      let viewedList: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(viewedList)) viewedList = [];
      // Remove product ID if already exists, and push to front
      viewedList = viewedList.filter(id => id !== product.id);
      viewedList.unshift(product.id);
      // Keep up to 6 unique history pieces
      const trimmed = viewedList.slice(0, 6);
      localStorage.setItem('recently_viewed_pids', JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Recently viewed storage sync halted.', e);
    }
  }, [product.id]);

  // Handle 360 view rotating cycle
  useEffect(() => {
    let timer: any;
    if (autoRotate && is360Active) {
      timer = setInterval(() => {
        setRotationIndex((prev) => (prev + 1) % enrichment.rotationImages.length);
      }, 700);
    }
    return () => clearInterval(timer);
  }, [autoRotate, is360Active, enrichment.rotationImages.length]);

  // Synchronize dynamic elements
  const handleToggleWishlist = () => {
    try {
      const saved = localStorage.getItem('nexa_hearted_pids');
      let hearted: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(hearted)) hearted = [];

      if (isWishlisted) {
        hearted = hearted.filter(x => x !== product.id);
        setIsWishlisted(false);
      } else {
        hearted.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('nexa_hearted_pids', JSON.stringify(hearted));
    } catch (e) {}
  };

  const handleToggleCompare = () => {
    try {
      const saved = localStorage.getItem('compare_product_ids');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];

      if (isCompareShared) {
        list = list.filter(id => id !== product.id);
        setIsCompareShared(false);
        setCompareProductIds(list);
      } else {
        if (list.length >= 3) {
          alert('Maximum of 3 customized listings can be compared simultaneously inside your panel!');
          return;
        }
        list.push(product.id);
        setIsCompareShared(true);
        setCompareProductIds(list);
      }
      localStorage.setItem('compare_product_ids', JSON.stringify(list));
    } catch (e) {}
  };

  // --- 4. INTERACTION EVENT HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is360Active || isVideoPlaying) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '240%'
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
    setIsHovered(false);
  };

  const handlePlayVideo = () => {
    setIs360Active(false);
    setIsVideoPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.warn('Autoplay block triggered', e));
      }
    }, 100);
  };

  const handleExitVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
  };

  // Clipboard share action
  const [shareFeedback, setShareFeedback] = useState<boolean>(false);
  const handleShareProduct = () => {
    const tempUrl = `${window.location.origin}/products?id=${product.id}`;
    navigator.clipboard.writeText(tempUrl).then(() => {
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }).catch(() => {
      alert(`Shareable Link: ${tempUrl}`);
    });
  };

  // Copy standard discount coupons
  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(''), 3000);
    });
  };

  // ZIP / Pincode availability check simulator
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 4) {
      setPincodeFeedback({ status: 'error', message: 'Please enter a valid postal code structure.' });
      return;
    }
    
    // Simulate smart geographic delivery window calculations
    const cleanPincode = pincode.replace(/\s+/g, '');
    const startsWithDigit = /^[1-9]/.test(cleanPincode);

    if (!startsWithDigit) {
      setPincodeFeedback({ status: 'error', message: 'Delivery temporarily restricted in this zone.' });
    } else {
      setPincodeFeedback({
        status: 'success',
        message: `Guaranteed delivery by Tuesday, May 26! Managed via Express Air logistics. Cash on Delivery is eligible.`
      });
    }
  };

  // Ask new continuous user question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const added = {
      q: newQuestion,
      a: 'The merchant has been notified and standard verified support agents will provide detailed responses within brief hours.',
      votes: 1,
      userVoted: true,
      date: 'Just Now'
    };

    setQaList(prev => [added, ...prev]);
    setNewQuestion('');
    setQaFeedback('Thank you! Your query has been published.');
    setTimeout(() => setQaFeedback(''), 4000);
  };

  // Submit report form
  const handle_submit_report = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportComment.trim()) return;
    setReportSuccess(true);
    setReportComment('');
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSuccess(false);
    }, 3500);
  };

  // Vote / upvote FAQ answers
  const handleVoteQA = (index: number) => {
    setQaList(prev => prev.map((item, idx) => {
      if (idx === index) {
        const hasVoted = item.userVoted;
        return {
          ...item,
          votes: hasVoted ? item.votes - 1 : item.votes + 1,
          userVoted: !hasVoted
        };
      }
      return item;
    }));
  };

  // --- 5. FREQUENTLY BOUGHT TOGETHER BUNDLE ---
  // We extract matching secondary add-on selections from catalog pool
  const getBundlePartners = () => {
    return products
      .filter((p) => p.id !== product.id)
      .slice(0, 2);
  };

  const bundlePartners = getBundlePartners();
  const [partnerSelections, setPartnerSelections] = useState<{ [key: string]: boolean }>({
    [product.id]: true,
    ...(bundlePartners[0] ? { [bundlePartners[0].id]: true } : {}),
    ...(bundlePartners[1] ? { [bundlePartners[1].id]: true } : {})
  });

  const toggleBundleSelection = (id: string) => {
    // Primary item must remain locked selected to maintain purchase logic
    if (id === product.id) return;
    setPartnerSelections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getBundleAccumulatedSum = () => {
    let total = 0;
    if (partnerSelections[product.id]) total += product.price;
    bundlePartners.forEach(p => {
      if (partnerSelections[p.id]) total += p.price;
    });
    return parseFloat(total.toFixed(2));
  };

  const handleAddBundleToCart = () => {
    let count = 0;
    if (partnerSelections[product.id]) {
      onAddToCart(product, 1, selectedColor);
      count++;
    }
    bundlePartners.forEach(p => {
      if (partnerSelections[p.id]) {
        // Find option mapping
        const partnerOption = p.category === 'fashion' ? 'Midnight Core Charcoal' : 'Standard Space Grey';
        onAddToCart(p, 1, partnerOption);
        count++;
      }
    });

    alert(`Successfully transferred ${count} bundle assets directly to your Escrow cart!`);
    onNavigate('cart');
  };

  // --- 6. SIMILAR CAROUSEL SELECTOR ---
  const similarProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.price > 100))
    .slice(0, 4);

  // --- 7. RECENTLY VIEWED UTILITIES ---
  const getRecentlyViewedListings = () => {
    try {
      const stored = localStorage.getItem('recently_viewed_pids');
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Exclude active viewing product to make timeline feed interesting
          const ids = parsed.filter(i => i !== product.id).slice(0, 4);
          return products.filter(p => ids.includes(p.id));
        }
      }
    } catch (e) {}
    return [];
  };

  const recentlyViewed = getRecentlyViewedListings();

  // Instant order routing helper
  const handleBuyNow = () => {
    onAddToCart(product, quantity, selectedColor || selectedSize);
    onNavigate('checkout');
  };

  return (
    <>
      <div className="space-y-12 pb-24 text-slate-900 animate-fade-in relative" id="conversion-detail-pipeline">
      
      {/* SECTION 1: POLISHED PROGRESSIVE BREADCRUMBS & CORE METADATA */}
      <nav className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-500">
          <button 
            onClick={() => onNavigate('products')}
            className="hover:text-blue-600 transition flex items-center gap-1 font-bold font-mono uppercase text-[10px] tracking-wide"
          >
            <ArrowLeft size={14} />
            <span>Storefront</span>
          </button>
          <ChevronRight size={12} className="text-slate-350" />
          <span className="capitalize font-semibold text-slate-400">{product.category}</span>
          <ChevronRight size={12} className="text-slate-350" />
          <span className="text-slate-800 font-extrabold truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="flex items-center gap-3 self-end xs:self-auto font-mono text-[10px] text-slate-400">
          <span>LISTING: <strong className="text-slate-700 font-bold">{product.id.toUpperCase()}</strong></span>
          <span className="h-3 w-[1px] bg-slate-200"></span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={11} /> IN STOCK ({product.stock} units)
          </span>
        </div>
      </nav>

      {/* SECTION 2: BENTO MATRIX SYSTEM - IMAGE ENGINE VS CONFIGURATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPARTMENT (COL SPAN 7): IMAGE SHOWCASE WITH ACCURATE CONTROLS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="relative bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden p-6 md:p-10 shadow-sm flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
            {/* Top Info Tags */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10 w-full px-1">
              <div className="flex gap-1.5">
                <span className="bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-xs">
                  Escrow Verified
                </span>
                {product.featured && (
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <Sparkles size={9} className="fill-slate-950" />
                    <span>Top Choice</span>
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2.5 rounded-2xl border transition-all ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-400'}`}
                  title={isWishlisted ? 'Remove from Wislist' : 'Add to Wishlist'}
                >
                  <Heart size={16} className={isWishlisted ? 'fill-rose-600' : ''} />
                </button>
                <button
                  onClick={handleToggleCompare}
                  className={`p-2.5 rounded-2xl border transition-all ${isCompareShared ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-400'}`}
                  title="Include in Compare Queue"
                >
                  <ArrowLeftRight size={16} />
                </button>
              </div>
            </div>

            {/* Standard magnifying glass tooltip */}
            {!is360Active && !isVideoPlaying && (
              <div className="absolute bottom-5 left-6 text-slate-400 font-mono text-[9px] font-bold flex items-center gap-1.5 bg-slate-50/80 backdrop-blur-xs px-2.5 py-1 rounded-lg pointer-events-none z-10">
                <Info size={10} className="text-blue-500" />
                <span>Move cursor over image to zoom details</span>
              </div>
            )}

            {/* MAIN VIEWER COMPONENT CONTROLS */}
            <div className="w-full h-full flex items-center justify-center relative aspect-square">
              {is360Active ? (
                /* 360 Spin Viewport frame */
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="relative rounded-2xl overflow-hidden max-h-[350px] w-full flex items-center justify-center">
                    <img 
                      src={enrichment.rotationImages[rotationIndex]} 
                      alt="360 view rotating asset"
                      className="object-contain max-h-[320px] transition-all duration-300 transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
                  </div>
                  
                  <div className="w-full max-w-sm mt-6 space-y-2 text-center">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>ANGLE: {rotationIndex * 90}°</span>
                      <span>DRAGGING COORDINATE ROTATE</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={enrichment.rotationImages.length - 1} 
                      value={rotationIndex}
                      onChange={(e) => { setAutoRotate(false); setRotationIndex(Number(e.target.value)); }}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button 
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${autoRotate ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {autoRotate ? '■ Pause Motor' : '▶ Autoplay Orb'}
                      </button>
                      <button 
                        onClick={() => { setRotationIndex(0); setAutoRotate(false); }}
                        className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"
                      >
                        <RotateCcw size={8} /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              ) : isVideoPlaying ? (
                /* Interactive Video Player screen */
                <div className="w-full h-full flex flex-col justify-between p-1 relative z-10">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1">
                      <Play size={10} className="text-red-500 fill-red-500" />
                      <span>Product Cinematic Teaser</span>
                    </span>
                    <button 
                      onClick={handleExitVideo} 
                      className="p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                      title="Return to Photos"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center flex-1 max-h-[380px]">
                    <video 
                      ref={videoRef}
                      src={enrichment.videoUrl} 
                      controls 
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium text-center pt-2">
                    Teaser audio tracks highlight components. Sourced for verification.
                  </p>
                </div>
              ) : (
                /* Primary Image displaying coordinate Magnifying Glass Zoom */
                <div 
                  className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden cursor-crosshair group"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={activeImage}
                    alt={product.title}
                    className="w-full h-full object-contain max-h-[380px] md:max-h-[420px] rounded-xl transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Dynamic magnifying layout view card */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 pointer-events-none rounded-xl border border-slate-200 shadow-2xl transition-opacity duration-200"
                      style={{
                        ...zoomStyle,
                        backgroundColor: '#fff',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 20
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* LOWER THUMBNAILS HORIZONTAL PANEL */}
          <div className="flex flex-wrap items-center gap-3">
            {enrichment.gallery.map((imgUrl, i) => {
              const isActive = activeImage === imgUrl && !is360Active && !isVideoPlaying;
              return (
                <button
                  key={i}
                  onClick={() => { setActiveImage(imgUrl); setIs360Active(false); setIsVideoPlaying(false); }}
                  className={`w-16 h-16 md:w-20 md:h-20 bg-white border rounded-2xl overflow-hidden p-1.5 flex items-center justify-center group relative transition ${isActive ? 'ring-2 ring-blue-600 border-transparent shadow-sm scale-102' : 'border-slate-200 hover:border-slate-350 bg-slate-50/50'}`}
                >
                  <img src={imgUrl} alt={`angle thumbnail ${i}`} className="w-full h-full object-cover rounded-xl transition group-hover:scale-102" referrerPolicy="no-referrer" />
                  {i === 3 && (
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-white font-mono text-[9px] font-black tracking-widest uppercase">
                      +Angles
                    </div>
                  )}
                </button>
              );
            })}

            {/* Play video preview layout thumbnail button */}
            <button
              onClick={handlePlayVideo}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center transition gap-1 relative ${isVideoPlaying ? 'ring-2 ring-red-500 bg-red-50 text-red-600 border-transparent' : 'border-2 border-dashed border-red-200 bg-red-50/20 text-red-500 hover:bg-red-50/50'}`}
              title="Play Video Product Guide"
            >
              <Play size={18} className="fill-red-500 text-red-500" />
              <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider">Video</span>
            </button>

            {/* 360 viewer layout thumbnail button */}
            <button
              onClick={() => { setIs360Active(true); setIsVideoPlaying(false); }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center transition gap-1 relative ${is360Active ? 'ring-2 ring-blue-600 bg-blue-50 text-blue-600 border-transparent' : 'border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-100/60'}`}
              title="Activate 360 degree 3D orbit simulation"
            >
              <RotateCcw size={18} className="text-blue-500" />
              <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider">360° Orb</span>
            </button>
          </div>

          {/* ESCROW PROTECTION BANNER IN DETAIL */}
          <div className="p-5 bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl space-y-3 relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-44 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck size={18} />
              <h4 className="text-xs font-black uppercase tracking-widest font-mono">100% Secure Nexa-Escrow holding</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-xl font-medium">
              Funds are held securely by ShopNexa Escrow system. Once items are delivered and verified by you, the vendor receives payout. Zero-risk transaction architecture.
            </p>
          </div>
        </div>

        {/* RIGHT COMPARTMENT (COL SPAN 5): DETAILED SELECTION & ACTION CARD */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-8 space-y-7 shadow-sm">
          
          {/* HEADER: BRAND & TITLE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onNavigate('products', { seller: product.sellerId })}
                className="text-xs font-black text-blue-600 hover:underline uppercase block tracking-widest font-mono"
              >
                {product.sellerName} [VERIFIED]
              </button>
              <span className="text-[10px] uppercase font-black text-slate-400 font-mono flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                <ShieldCheck size={11} className="text-blue-500" /> Merchant ID: {product.sellerId}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight uppercase">
              {product.title}
            </h1>

            {/* RATINGS LINE WITH AUDIT VALUE */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-lg">
                <span className="text-xs font-black text-amber-800 font-mono">{product.rating}</span>
                <Star size={11} className="fill-amber-500 text-amber-500" />
              </div>
              <span className="text-xs text-slate-500 font-semibold font-mono">({product.ratingCount} Verified Purchase Audits)</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500 hover:underline cursor-pointer font-bold font-mono text-[10px] uppercase">
                24 QAs
              </span>
            </div>
          </div>

          {/* DYNAMIC PRICING SEGMENTS */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-widest font-mono">ESCROW BUY RATE</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">${product.price}</span>
                  <span className="text-sm text-slate-400 line-through font-mono">${product.originalPrice}</span>
                </div>
              </div>
              
              <div className="bg-rose-100 text-rose-800 font-black text-[10px] font-mono px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-2xs">
                SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% INSTANT
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
              ★ taxes inclusive. free tracked shipping on values above $100.
            </p>
          </div>

          {/* COUPOUN CARDS WITH COPIED FEEDBACK */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono flex items-center gap-1.5">
              <Gift size={13} className="text-emerald-500" />
              <span>Click to Copy Coupons</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {enrichment.coupons.map((coupon) => {
                const isCopied = copiedCoupon === coupon.code;
                return (
                  <button
                    key={coupon.code}
                    onClick={() => handleCopyCouponCode(coupon.code)}
                    className={`relative text-left p-3 border rounded-2xl transition-all overflow-hidden flex flex-col justify-between ${isCopied ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-100' : 'bg-white border-slate-200/80 hover:border-slate-350 text-slate-705'}`}
                  >
                    <div className="absolute top-0 right-0 py-0.5 px-2 bg-slate-100 text-[8px] font-bold font-mono rounded-bl text-slate-400">
                      CODE
                    </div>
                    <div>
                      <strong className={`text-xs font-black tracking-wider block font-mono ${isCopied ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {coupon.code}
                      </strong>
                      <span className="text-[9px] text-slate-400 font-semibold leading-tight block mt-0.5 truncate max-w-[120px]">
                        {coupon.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-slate-100 w-full text-[9px] font-bold">
                      <span className="text-slate-400 font-mono uppercase text-[8px]">Save up to ${coupon.saving}</span>
                      <span className={`font-black uppercase tracking-wider flex items-center gap-0.5 text-[8px] font-mono ${isCopied ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {isCopied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> TAP COPY</>}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SPEC ALTERNATIVE CHOICES & CONTROLLERS (Swatch configuration) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Color Swatch Panel */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                Select Colorway: <strong className="text-slate-700 font-extrabold">{selectedColor}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {fallbackOptions.map((opt) => {
                  const isActive = selectedColor === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedColor(opt)}
                      className={`px-3 py-2 text-[11px] font-bold rounded-2xl border transition-all flex items-center gap-2 ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${opt.includes('Black') || opt.includes('Obsidian') ? 'bg-black border border-slate-800' : opt.includes('White') || opt.includes('Silver') ? 'bg-slate-100 border border-slate-300' : opt.includes('Charcoal') ? 'bg-slate-500' : 'bg-amber-600'}`}></span>
                      <span>{opt.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Stepper / Guide Toggle */}
            <div className="space-y-2.5 pt-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <label className="font-black text-slate-400 uppercase tracking-widest font-mono">
                  Dimension / Package Config:
                </label>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-blue-600 hover:underline font-extrabold uppercase font-mono tracking-wider flex items-center gap-1 text-[9px]"
                >
                  <Info size={11} /> 📏 Click Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((sz) => {
                  const isActive = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-[11px] font-bold rounded-xl border transition-all ${isActive ? 'border-slate-900 bg-slate-900 text-white font-extrabold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOUCH ORDER QUANTITY STEPPER */}
            <div className="space-y-2.5 pt-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                Adjustment quantity stepper
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-250 rounded-2xl overflow-hidden shadow-inner bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-black transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-5 py-2 font-mono text-xs font-black text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200 font-black transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-[11px]">
                  {product.stock <= 5 ? (
                    <span className="text-red-600 font-extrabold block animate-pulse">⚠️ Priority scarce stock. Only {product.stock} pieces remaining!</span>
                  ) : (
                    <span className="text-slate-400 font-medium block">Standard merchant transit capacity covers {product.stock} pieces.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DELIVEY AND ZIPCODE CHECKER SECT */}
          <div className="p-5 bg-slate-50/60 border border-slate-200/50 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Truck size={14} className="text-blue-500" />
              <span>Verify Geographic Delivery Speed</span>
            </h4>
            
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter 5-6 digit zip code..." 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={8}
                className="bg-white border border-slate-200 px-3 py-2 text-xs rounded-xl flex-1 focus:outline-none focus:border-blue-550 font-mono"
              />
              <button 
                type="submit"
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition"
              >
                Verify Air
              </button>
            </form>

            {pincodeFeedback.status !== 'idle' && (
              <div className={`p-3 rounded-xl border text-[11px] font-semibold leading-relaxed ${pincodeFeedback.status === 'success' ? 'bg-emerald-50 border-emerald-150 text-emerald-800' : 'bg-red-50 border-red-150 text-red-800'}`}>
                {pincodeFeedback.message}
              </div>
            )}

            {/* Standard static return/warranty quick stats */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/55 text-[11px]">
              <div className="flex gap-2 font-semibold">
                <Box size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-850 block">14-Day Returns</span>
                  <span className="text-[9px] text-slate-400 font-medium font-mono">100% Escrow Refunds</span>
                </div>
              </div>
              <div className="flex gap-2 font-semibold">
                <ShieldCheck size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-850 block">1 Year Warranty</span>
                  <span className="text-[9px] text-slate-400 font-medium font-mono">Authentic Protection</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TRANSACTION CTA SYSTEM ACTION GROUP - RECHOSEN STYLINGS */}
          <div className="space-y-3 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={() => onAddToCart(product, quantity, selectedColor || selectedColor)}
                className="py-4 px-5 border-2 border-slate-950 bg-white text-slate-950 font-black text-xs rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 select-none"
                id="cta-addto-cart"
              >
                <ShoppingBag size={15} />
                <span>Add to Escrow Cart</span>
              </button>
              
              <button
                onClick={handleBuyNow}
                className="py-4 px-5 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/15 uppercase tracking-wider block text-center"
                id="cta-buynow-instant"
              >
                Checkout Instantly
              </button>
            </div>

            <div className="flex items-center justify-center gap-5 pt-1.5 text-xs">
              <button 
                onClick={handleShareProduct}
                className="text-slate-450 hover:text-slate-755 font-bold flex items-center gap-1.5 font-mono text-[10px] uppercase select-none transition"
              >
                {shareFeedback ? (
                  <><Check size={13} className="text-emerald-500" /> Coordinated Link Copied</>
                ) : (
                  <><Share2 size={13} /> Share Product Spec</>
                )}
              </button>

              <span className="text-slate-300">|</span>

              <button 
                onClick={() => setIsReportOpen(true)}
                className="text-slate-450 hover:text-red-650 font-bold flex items-center gap-1.5 font-mono text-[10px] uppercase select-none transition"
              >
                <Flag size={13} /> Report listing
              </button>
            </div>
          </div>

          {/* ACCEPTED PAYMENT BADGES */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-mono text-center">
              Verified Nexa Secure Routing Partners
            </span>
            <div className="flex items-center justify-center gap-3.5 opacity-65 flex-wrap">
              <span className="bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-black border rounded text-slate-500 leading-tight">STRIPE</span>
              <span className="bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-black border rounded text-slate-500 leading-tight font-sans">GPay</span>
              <span className="bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-black border rounded text-slate-500 leading-tight">VISA</span>
              <span className="bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-black border rounded text-slate-500 leading-tight">PAYPAL</span>
              <span className="bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-black border rounded text-slate-500 leading-tight">COD ELIGIBLE</span>
            </div>
          </div>

          {/* BANK CARD INTERACTIVE OFFERS PANEL */}
          <div className="border border-slate-200/60 rounded-3xl p-4.5 bg-slate-50/30 space-y-3.5">
            <h5 className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono flex items-center gap-1.5">
              <CreditCard size={13} className="text-blue-500" />
              <span>Available Bank Discounts & EMI options</span>
            </h5>
            
            <div className="space-y-2.5 text-xs">
              {enrichment.bankOffers.map((offer, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 border-b border-slate-100 last:border-0 pb-2.5 last:pb-0">
                  <div className="space-y-0.5">
                    <strong className="text-slate-800 font-extrabold text-[12px] block">{offer.bank}</strong>
                    <p className="text-[10px] text-slate-450 leading-normal font-medium">{offer.terms}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg flex-shrink-0 self-center">
                    {offer.discount}
                  </span>
                </div>
              ))}
            </div>

            {/* Dynamic calculator mini segment inside card view */}
            <div className="border-t border-slate-205/65 pt-3.5 space-y-2.5">
              <span className="text-[10px] uppercase font-black text-slate-400 font-mono tracking-wider block">EMI installment estimate calculator</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {enrichment.emiOptions.map((opt) => (
                  <div key={opt.months} className="bg-white border rounded-xl p-2 font-semibold">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">{opt.months} Months</span>
                    <strong className="text-slate-800 text-[12px] font-mono block">${opt.amount}/mo</strong>
                    <span className="text-[9.5px] text-emerald-600 block leading-tight mt-0.5 font-bold font-mono">{opt.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BUNDLE PACKAGE PRODUCER (Frequently bought together) */}
      <section className="bg-white border border-slate-200/70 p-6 md:p-8 rounded-[2.5rem] shadow-sm select-none" id="frequently-bought-together-bundle">
        <div className="space-y-1.5 mb-6">
          <span className="bg-emerald-50 text-emerald-700 font-mono font-black text-[9px] uppercase px-2.5 py-1 rounded-full tracking-widest inline-block">
            COMBO SAVINGS BLOCK
          </span>
          <h2 className="text-lg md:text-xl font-black uppercase text-slate-950 tracking-tight">
            Frequently Bought Combined Assets list
          </h2>
          <p className="text-xs text-slate-450 max-w-2xl font-medium leading-relaxed">
            Acquire these popular verified add-ons alongside the core variant block to bypass secondary logistics charges instantly.
          </p>
        </div>

        {/* COMBINATION COMPARTMENTS GRID */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8 justify-between">
          <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 flex-1 w-full">
            {/* Main Item Checkbox card */}
            <div className={`p-4 border rounded-3xl flex items-center gap-3 bg-slate-50 w-full md:max-w-xs ${partnerSelections[product.id] ? 'border-blue-600 ring-2 ring-blue-50' : 'border-slate-200'}`}>
              <button 
                onClick={() => toggleBundleSelection(product.id)}
                className="w-5 h-5 bg-blue-600 text-white rounded-lg flex items-center justify-center cursor-default flex-shrink-0"
              >
                <Check size={12} className="stroke-[3]" />
              </button>
              <img src={product.image} alt={product.title} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
              <div className="truncate flex-1">
                <span className="text-[9px] font-bold text-blue-600 uppercase font-mono block">Active Variant</span>
                <strong className="text-slate-800 text-xs font-black truncate block">{product.title}</strong>
                <span className="text-xs font-mono font-extrabold text-slate-700 mt-0.5 block">${product.price}</span>
              </div>
            </div>

            {/* Render secondary bundle listings */}
            {bundlePartners.map((item, idx) => {
              const checked = partnerSelections[item.id];
              return (
                <React.Fragment key={item.id}>
                  <div className="text-slate-300 font-black text-xl px-1">+</div>
                  
                  <div 
                    onClick={() => toggleBundleSelection(item.id)}
                    className={`p-4 border rounded-3xl flex items-center gap-3 cursor-pointer hover:border-slate-350 transition w-full md:max-w-xs relative ${checked ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-50' : 'border-slate-200 bg-white'}`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border ${checked ? 'bg-blue-600 border-blue-600 text-white animate-scale-up' : 'border-slate-300 bg-white'}`}>
                      {checked && <Check size={12} className="stroke-[3]" />}
                    </div>
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="truncate flex-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Add-On Item</span>
                      <strong className="text-slate-800 text-xs font-black truncate block text-slate-850">{item.title}</strong>
                      <span className="text-xs font-mono font-extrabold text-slate-700 mt-0.5 block">${item.price}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* COMBINATION BILL OUTPUT PILE */}
          <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-[2rem] text-center lg:text-left space-y-4 min-w-[240px] w-full lg:w-auto">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block font-mono">Accumulated Combo Rate</span>
              <strong className="text-2xl md:text-3xl text-slate-900 font-mono block leading-none">${getBundleAccumulatedSum()}</strong>
            </div>
            
            <button
              onClick={handleAddBundleToCart}
              className="w-full py-3 px-5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag size={14} /> Add Bundle to Cart
            </button>
            <span className="text-[9px] text-slate-400 font-medium block">★ Bundling saves up to $15 packaging fees.</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUCT CORE HIGHLIGHTS & DESCRIPTION DEPOSITS */}
      <section className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-xs select-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Highlights bento row */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
              Variant Engineering Benefits
            </h3>
            
            <div className="space-y-3">
              {enrichment.highlights.map((hil, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 hover:shadow-2xs transition">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Sparkles size={14} className="fill-indigo-100" />
                    <strong className="text-xs font-black uppercase tracking-wide text-slate-800">{hil.title}</strong>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{hil.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Specifications Table */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                Pristine Data Specifications Ledger
              </h3>
              <span className="text-[9px] font-bold text-slate-400 font-mono">VERIFIED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
              {Object.entries(product.specs).map(([label, value], idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl text-xs transition"
                >
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[9.5px] font-mono">{label}</span>
                  <span className="font-black text-slate-800 truncate max-w-[150px]">{value}</span>
                </div>
              ))}
            </div>

            {/* What's in the box container */}
            <div className="p-5 border border-slate-100 rounded-3xl space-y-3.5 mt-5 bg-amber-50/10">
              <span className="text-[10px] uppercase font-black text-slate-400 font-mono tracking-widest block flex items-center gap-1.5">
                <Box size={14} className="text-amber-600" />
                <span>Authorized Cargo Packaging Inventory (What's in the box)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {enrichment.boxContents.map((boxItem, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600 font-semibold font-sans">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span>{boxItem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CUSTOMER REVIEWS RATING BREAKDOWNS & AI REVIEWS SUMMARY */}
      <section className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-8 space-y-8 shadow-sm">
        <div className="border-b border-slate-100 pb-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono mb-1">
            CONSOLIDATED AUDITS AND CUSTOMER PERCEPTION
          </h3>
          <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase">
            Platform Quality Scorecard
          </h2>
        </div>

        {/* Aggregate statistics row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Numerical average stars column */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-6 rounded-3xl text-center space-y-3">
            <span className="text-[10.5px] font-black uppercase text-slate-400 tracking-wider block font-mono">AVERAGE platform score</span>
            <strong className="text-5xl font-black text-slate-900 font-mono block leading-none mt-1">{product.rating}</strong>
            <div className="flex justify-center text-amber-400 py-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'fill-amber-450 text-amber-500' : ''} />
              ))}
            </div>
            <p className="text-xs text-slate-450 font-semibold font-mono">Based on {product.ratingCount} automated logs</p>

            {/* Symmetrical Star percent breakdown layout bars */}
            <div className="space-y-2 pt-4 border-t border-slate-200 text-left text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-8 text-[11px] font-mono">5 ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="w-8 font-mono text-right text-slate-400">85%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 text-[11px] font-mono">4 ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="w-8 font-mono text-right text-slate-400">10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 text-[11px] font-mono">3 ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '3%' }}></div>
                </div>
                <span className="w-8 font-mono text-right text-slate-400">3%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 text-[11px] font-mono">2 ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '1%' }}></div>
                </div>
                <span className="w-8 font-mono text-right text-slate-400">1%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 text-[11px] font-mono">1 ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '1%' }}></div>
                </div>
                <span className="w-8 font-mono text-right text-slate-400">1%</span>
              </div>
            </div>
          </div>

          {/* SYSTEM REVIEWS SMART GENERATION COMPOSITIONS */}
          <div className="lg:col-span-8 bg-gradient-to-tr from-blue-50/50 to-indigo-50/50 border border-blue-100/60 rounded-3xl p-6 md:p-8 space-y-4">
            <header className="flex items-center gap-2 text-indigo-700">
              <Sparkles size={16} className="fill-indigo-100" />
              <h4 className="text-[10px] font-black uppercase tracking-widest font-mono">AI Sensed review summarizer (Nexa-AI Core)</h4>
            </header>

            <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
              {enrichment.aiSentiment.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-150 text-xs">
              <div className="space-y-2">
                <strong className="text-emerald-705 uppercase tracking-wider font-bold block text-[11px] font-mono">★ Positive Consensus:</strong>
                <ul className="space-y-1.5 text-slate-600 list-none">
                  {enrichment.aiSentiment.positives.map((pos, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <strong className="text-amber-800 uppercase tracking-wider font-bold block text-[11px] font-mono">★ Potential Limitations:</strong>
                <ul className="space-y-1.5 text-slate-600 list-none">
                  {enrichment.aiSentiment.negatives.map((neg, i) => (
                    <li key={i} className="flex items-start gap-2 font-medium">
                      <span className="text-amber-500 font-bold">&#8226;</span>
                      <span>{neg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER SUBMITTED PHOTOS ROW */}
        <div className="space-y-3.5 border-t border-slate-100 pt-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
            User Verified hands-on photos ({enrichment.gallery.length} attachments)
          </span>

          <div className="flex flex-wrap gap-3.5">
            {enrichment.gallery.map((pImg, idx) => (
              <div 
                key={idx} 
                onClick={() => { setActiveImage(pImg); setIs360Active(false); }}
                className="w-16 h-16 md:w-20 md:h-20 border border-slate-200 rounded-2xl overflow-hidden p-1 bg-slate-50 cursor-zoom-in group hover:border-slate-400 transition"
                title="Tap to highlight photo in center"
              >
                <img src={pImg} alt="customer hands on" className="w-full h-full object-cover rounded-xl transition group-hover:scale-102" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* VERIFIED AUDITS LIST FEEDBACK */}
        <div className="space-y-5 border-t border-slate-100 pt-6">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block font-mono">
            Direct customer reviews logs
          </span>

          <div className="space-y-5 max-w-4xl divide-y divide-slate-100">
            {(mockReviewsByProductId[product.id] || []).concat([
              { id: 'def-1', author: 'Vikram S. / Tech Lead', rating: 5, date: '2026-05-18', comment: 'Spectacular quality. Materials are highly premium and transaction execution via Escrow was completely seamless. Buy now!', helpfulCount: 14 }
            ]).map((rev, idx) => (
              <div key={rev.id} className={`pt-5 first:pt-0 pb-1.5 space-y-2.5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shadow-inner uppercase font-mono">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{rev.author}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={11} className="fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  "{rev.comment}"
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                  <span>Helpful Audit?</span>
                  <button className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition font-black">
                     HELPFUL ({rev.helpfulCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: INTERACTIVE CUSTOMER Q&A LOGS */}
      <section className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-xs select-none">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono mb-1">
            VERIFIED RESIDENT ADVICE
          </h3>
          <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase">
            Product Platform Q&A
          </h2>
        </div>

        {/* Ask Question block */}
        <form onSubmit={handleAddQuestion} className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-3xl">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
            Ask the verified community or merchant a custom question
          </label>
          <div className="flex gap-2.5">
            <input 
              type="text" 
              placeholder="E.g., Does this variant require external adapter packages for US grids?" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="bg-white border border-slate-200 px-4 py-3 rounded-2xl flex-1 text-xs focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition"
            >
              Ask community
            </button>
          </div>
          {qaFeedback && (
            <div className="text-xs text-emerald-705 font-bold animate-pulse font-mono">
              {qaFeedback}
            </div>
          )}
        </form>

        {/* Questions list display */}
        <div className="space-y-5 pt-2">
          {qaList.map((item, idx) => (
            <div key={idx} className="p-4 border border-slate-100/80 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-blue-600 uppercase font-mono block">QUESTION #{idx + 1}</span>
                  <strong className="text-slate-950 font-black tracking-tight block text-[13px] uppercase leading-tight font-sans">
                    {item.q}
                  </strong>
                </div>

                <button 
                  onClick={() => handleVoteQA(idx)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold font-mono transition-all ${item.userVoted ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold' : 'bg-white hover:bg-slate-50 text-slate-455'}`}
                >
                  <ThumbsUp size={11} /> {item.votes} Help
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-2.5 px-3.5 rounded-xl text-slate-650 flex gap-2 font-medium leading-relaxed">
                <span className="font-extrabold text-blue-600 font-mono">A.</span>
                <p>{item.a}</p>
              </div>

              <div className="text-[9px] text-slate-400 font-bold font-mono text-right capitalize">
                Answered {item.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: SIMILAR CORRESPONDING CAROUSEL (Similar Products) */}
      {similarProducts.length > 0 && (
        <section className="space-y-6 select-none" id="similar-products-complement">
          <div className="space-y-1">
            <span className="bg-indigo-50 text-indigo-700 font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
              Category matching
            </span>
            <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">
              Complementary Variant listings
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => onNavigate('product-detail', { id: p.id })}
                className="bg-white border border-slate-200/60 p-3 rounded-3xl hover:border-slate-350 transition cursor-pointer select-none space-y-3 shadow-2xs group flex flex-col justify-between"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 relative">
                  <img src={p.image} alt={p.title} className="object-contain max-h-[140px] group-hover:scale-102 transition duration-300" referrerPolicy="no-referrer" />
                  <span className="bg-white/80 backdrop-blur-2xs border border-slate-100 py-0.5 px-1.5 rounded-md text-[9px] font-black tracking-tight font-mono absolute bottom-2 right-2 text-slate-700">
                    ★ {p.rating}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-mono text-[9px] font-bold text-slate-400 uppercase truncate">
                    {p.sellerName}
                  </h4>
                  <p className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 uppercase transition tracking-tight">
                    {p.title}
                  </p>
                  <strong className="text-xs font-black text-slate-900 font-mono block">
                    ${p.price}
                  </strong>
                </div>

                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddToCart(p, 1); 
                    alert(`${p.title} included in your cart!`);
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-950 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:text-white rounded-xl transition"
                >
                  ADD TO ESCROW
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 8: RECENTLY VIEWED PRODUCTS BLOCK */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-5 border-t border-slate-200/50 pt-10 select-none" id="recently-viewed-panel-timeline">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">
              Your browser interaction logs
            </span>
            <h3 className="text-base font-black uppercase text-slate-800 tracking-tight">
              Recently Viewed listings history
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((pv) => (
              <div 
                key={pv.id}
                onClick={() => onNavigate('product-detail', { id: pv.id })}
                className="bg-white border border-slate-205 p-3 rounded-2xl hover:border-slate-350 cursor-pointer select-none space-y-2.5 transition flex gap-3.5 items-center group shadow-3xs"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-1 flex-shrink-0 relative">
                  <img src={pv.image} alt={pv.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                </div>
                <div className="truncate flex-1">
                  <h4 className="text-[11px] font-black text-slate-850 truncate uppercase tracking-tight group-hover:text-blue-600 transition">
                    {pv.title}
                  </h4>
                  <span className="text-xs font-mono font-extrabold text-slate-505 block">
                    ${pv.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FLOATING STICKY ACTION RAIL - MOBILE EXCLUSIVE BAR CHECKOUT (<lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 py-3 px-4.5 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between gap-4 z-[45] shadow-2xl">
        <div className="flex flex-col items-start min-w-[100px]">
          <span className="text-[8px] font-black uppercase text-slate-400 font-mono tracking-widest">Active Pricing</span>
          <strong className="text-lg font-black text-slate-900 font-mono tracking-tight">${product.price}</strong>
        </div>

        <div className="flex gap-2 flex-1">
          <button
            onClick={() => onAddToCart(product, quantity, selectedColor)}
            className="flex-1 py-3 bg-white border border-slate-900 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-center"
          >
            Add to Cart
          </button>
          
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-center"
          >
            Buy Now
          </button>
        </div>
      </div>
      </div>
      
      {/* Modals outside the animate-fade-in container to prevent fixed stacking context trap */}
      {/* --- REUSABLE POP-UP MODAL: SIZE CHART DIALOG --- */}
      <AnimatePresence>
        {isSizeChartOpen && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
            <motion.div 
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                className="bg-white rounded-[2rem] w-full max-w-xl p-6 md:p-8 space-y-6 shadow-2xl border"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    📐 Premium Configuration & Fit Chart Matrix
                  </h3>
                  <button 
                    onClick={() => setIsSizeChartOpen(false)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                  This verification ledger translates structural dimensional codes for standard merchant distributions. Verify measurements before checkout locks.
                </p>

                <div className="overflow-hidden border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-405 font-mono text-[9px] uppercase font-black">
                      <tr>
                        <th className="p-3">Size Spec Category</th>
                        <th className="p-3">Chest / Frame Width</th>
                        <th className="p-3">Length / Height Volume</th>
                        <th className="p-3">Shoulder Radial Offset</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-semibold text-slate-705">
                      {enrichment.sizeChart.map((row) => (
                        <tr key={row.size} className="hover:bg-slate-50/50">
                          <td className="p-3 font-extrabold text-slate-900">{row.size}</td>
                          <td className="p-3 font-mono">{row.chest}</td>
                          <td className="p-3 font-mono">{row.length}</td>
                          <td className="p-3 font-mono">{row.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-150 text-[11px] text-blue-800 leading-relaxed font-semibold">
                  ★ <strong>Confidence Promise:</strong> Nexa protects standard size mismatches. Courier pickup is processed free if selected coordinates fall short.
                </div>

                <button
                  onClick={() => setIsSizeChartOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white font-black text-xs rounded-xl uppercase tracking-widest hover:bg-slate-800 transition shadow-sm text-center"
                >
                  Close Spec Matrix
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      {/* --- REUSABLE POP-UP MODAL: REPORT PRODUCT FORM --- */}
      <AnimatePresence>
        {isReportOpen && (
            <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
              <motion.div 
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                className="bg-white rounded-[2rem] w-full max-w-md p-6 space-y-5 shadow-2xl border"
              >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Flag size={14} className="text-red-500 animate-pulse" />
                  <span>Report Listing coordinates</span>
                </h3>
                <button 
                  onClick={() => setIsReportOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {reportSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 space-y-2 text-xs font-semibold text-center py-8">
                  <CheckCircle2 size={36} className="text-emerald-500 mx-auto animate-bounce" />
                  <strong className="block text-sm font-black">Audit Case Filed Successfully!</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Our platform administrators are flagged. We will investigate this merchant catalog profile structure within 24 hours. Thank you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handle_submit_report} className="space-y-4">
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                    Ensure details represent actual listing deviations. Unverified or malicious reporting patterns will lock user account features.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                      Category of reporting infraction
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-bold">
                      <option>Inaccurate pricing parameters</option>
                      <option>Prohibited trademark counterfeit replica</option>
                      <option>Misleading images or false specification claims</option>
                      <option>Suspicious seller communication patterns</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                      Describe violation coordinates
                    </label>
                    <textarea 
                      rows={4}
                      placeholder="Enter verified particulars..."
                      value={reportComment}
                      onChange={(e) => setReportComment(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setIsReportOpen(false)}
                      className="py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider text-center hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center hover:bg-red-705 transition shadow-md shadow-red-200"
                    >
                      File Case Report
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
};
