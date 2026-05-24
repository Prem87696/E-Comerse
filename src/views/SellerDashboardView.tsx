import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Award, PlusCircle, CheckCircle2, DollarSign, Package, TrendingUp, Sparkles, 
  Filter, Percent, Info, User, MapPin, Truck, ShieldCheck, AlertCircle, Calendar, ChevronRight, 
  Plus, Minus, X, Check, Activity, FileText, UploadCloud, HelpCircle, MessageSquare, Clock, 
  ArrowUpRight, Lock, Tag, ChevronDown, ShoppingBag, RotateCcw, Sliders, Eye, RefreshCw, BarChart2,
  LockKeyhole, MessageCircle, FileDown, Layers, HelpCircle as HelpIcon, Flame
} from 'lucide-react';
import { Product, Seller } from '../types';

interface SellerDashboardViewProps {
  products: Product[];
  seller: Seller;
  onAddProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  products,
  seller,
  onAddProduct,
}) => {
  // Main Category filter or navigation Tab
  // 7 Tabs based on requirements:
  // - compliance: Onboarding Checklist, KYC, SLA
  // - analytics: Sales/Revenue overview, general SaaS analytics, Traffic & conversion
  // - catalog: Product inventory management, Add Product, Bulk, Variants & SKU, Low stock, Prices, Image uploads
  // - orders: Live order states (Pending, Shipped, Cancelled, Returned) & Return requests
  // - campaigns: Coupon Creator, Flash Sale Opt-in
  // - support: Q&A, Review replies, Help tickets
  const [activeTab, setActiveTab] = useState<'compliance' | 'analytics' | 'catalog' | 'orders' | 'campaigns' | 'support' | 'payouts'>('analytics');

  const vendorProducts = products.filter((p) => p.sellerId === seller.id);

  // --- STATE 1: SELLER ONBOARDING CHECKLIST ---
  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 'step-1', title: 'Verify Business KYC Details', completed: true, desc: 'Provide legal tax codes and registered identities.' },
    { id: 'step-2', title: 'Set Up Bank Payout Coordinates', completed: false, desc: 'Connect direct bank routing codes for weekly payouts.' },
    { id: 'step-3', title: 'Add Core Product Listing with Variants', completed: true, desc: 'Publish a catalog item with stock grids.' },
    { id: 'step-4', title: 'Confirm Shipping SLS Logistics Guidelines', completed: false, desc: 'Commit to the 24-48h dispatch policy.' },
    { id: 'step-5', title: 'Complete Verification Deposit Call', completed: false, desc: 'Receive a test deposit to lock secure Escrow pathways.' }
  ]);

  const handleToggleChecklist = (id: string) => {
    setOnboardingSteps(prev => prev.map(step => step.id === id ? { ...step, completed: !step.completed } : step));
  };

  const onboardingProgress = Math.round(
    (onboardingSteps.filter(s => s.completed).length / onboardingSteps.length) * 100
  );

  // --- STATE 2: KYC STATUS & BUSINESS FORM ---
  const [kycForm, setKycForm] = useState({
    businessName: 'Nexa Innovations India',
    gstin: '29AABBC1234D1Z9',
    pan: 'AABCN9988G',
    businessType: 'Private Limited',
    ownerName: 'Prem Kumar',
    addressProofType: 'Utility Bill'
  });
  const [kycStatus, setKycStatus] = useState<'approved' | 'pending' | 'draft'>('approved');
  const [kycFeedbackMsg, setKycFeedbackMsg] = useState('All verification documents processed successfully.');

  const handleUpdateKyc = (key: string, value: string) => {
    setKycForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveKycDraft = () => {
    setKycStatus('pending');
    setKycFeedbackMsg('Evaluating legal tax records. ETA 24 Hours.');
    alert('KYC documentation saved & uploaded successfully. Admin review is pending.');
  };

  // --- STATE 3: SLA PERFORMANCE SCORECARDS ---
  const slaStats = {
    deliveryTime: '1.4 Days Avg',
    dispatchOnTime: '98.5% SLA Match',
    customerEscalations: '0.2%',
    tierRating: 'A+ Elite Vendor Status',
    cancellationRate: '0.4%'
  };

  // --- STATE 4: ANALYTICS TRAFFIC & CONVERSION METRICS ---
  const trafficChannels = [
    { source: 'Nexa Recommended Systems', visitors: 14205, percentage: '45%' },
    { source: 'Direct Search Catalog', visitors: 8200, percentage: '26%' },
    { source: 'Coupons Campaigns', visitors: 5620, percentage: '18%' },
    { source: 'Social References (IG, YT)', visitors: 3450, percentage: '11%' }
  ];

  const conversionRates = {
    visitors: '31,475 Users',
    addToCartRatio: '8.4%',
    checkoutInitiationRate: '4.2%',
    finalPurchaseRate: '2.95% Conversion Ratio'
  };

  // Sales and revenue breakdown matrices
  const weeklyRevenueData = [
    { label: 'Week 1', revenue: 14250, orders: 120 },
    { label: 'Week 2', revenue: 19800, orders: 154 },
    { label: 'Week 3', revenue: 16500, orders: 130 },
    { label: 'Week 4', revenue: 24650, orders: 189 },
    { label: 'Week 5', revenue: 28900, orders: 247 },
    { label: 'Week 6', revenue: 32400, orders: 282 }
  ];

  // --- STATE 5: PRODUCT CATALOG ENHANCEMENTS ---
  const [activeCatalogSubtab, setActiveCatalogSubtab] = useState<'listings' | 'add' | 'bulk' | 'prices'>('listings');
  
  // Custom new product states matching requirements
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('149.99');
  const [newOriginalPrice, setNewOriginalPrice] = useState('199.99');
  const [newCategory, setNewCategory] = useState('electronics');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80');
  const [newStock, setNewStock] = useState('35');
  const [newSku, setNewSku] = useState('TSH-BLK-04');
  const [specs, setSpecs] = useState<{ [key: string]: string }>({ 'Material': 'Alloy Carbon Matrix', 'Warranty': '2 Years' });
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  // Add customized variant sizes & colors
  const [variantsColors, setVariantsColors] = useState<string[]>(['Charcoal Smoke', 'Ivory Cream']);
  const [variantsSizes, setVariantsSizes] = useState<string[]>(['M', 'L']);
  const [newColorInput, setNewColorInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');

  const [formSuccess, setFormSuccess] = useState(false);

  const addSpecPair = () => {
    if (specKey && specVal) {
      setSpecs({ ...specs, [specKey]: specVal });
      setSpecKey('');
      setSpecVal('');
    }
  };

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) {
      alert('Please fill out essential fields.');
      return;
    }

    onAddProduct({
      title: newTitle,
      price: parseFloat(newPrice),
      originalPrice: parseFloat(newOriginalPrice),
      description: newDescription,
      category: newCategory,
      image: newImage,
      specs: { ...specs, SKU: newSku, Colorways: variantsColors.join(', '), Dimensions: variantsSizes.join(', ') },
      stock: parseInt(newStock) || 12,
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setNewTitle('');
      setNewDescription('');
      setActiveCatalogSubtab('listings');
    }, 2000);
  };

  // CSV Import / Export Handler Mockups
  const handleExportCSV = () => {
    const headers = 'ID,Title,Category,Price,OriginalPrice,SKU,Stock,Rating\n';
    const rows = vendorProducts.map(p => 
      `"${p.id}","${p.title}","${p.category}",${p.price},${p.originalPrice},"${p.id.toUpperCase()}-SKU",${p.stock},${p.rating}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShopNexa_Inventory_Report_${seller.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [bulkFileUploaded, setBulkFileUploaded] = useState(false);
  const [bulkSuccessCount, setBulkSuccessCount] = useState(0);

  const handleSimulateCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBulkFileUploaded(true);
      setBulkSuccessCount(4); // simulate 4 items successfully queued
      setTimeout(() => {
        alert('Bulk inventory uploaded successfully! 4 items mapped to your catalog draft catalog.');
        setBulkFileUploaded(false);
      }, 1500);
    }
  };

  // --- PRICE & DISCOUNT AD-HOC UPDATE STATE ---
  const [editableProducts, setEditableProducts] = useState<Product[]>([]);
  useEffect(() => {
    setEditableProducts(products.filter(p => p.sellerId === seller.id));
  }, [products, seller]);

  const handleUpdatePrice = (id: string, field: 'price' | 'stock', value: string) => {
    setEditableProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          [field]: parseFloat(value) || 0
        };
      }
      return p;
    }));
  };

  const handleSavePriceDiscounts = () => {
    alert('Interactive prices, stock thresholds, and discount margins saved live to client state database!');
  };

  // --- STATE 6: ORDERS CORE & RETURNS ---
  const [ordersFilter, setOrdersFilter] = useState<'all' | 'pending' | 'shipped' | 'cancelled' | 'returned'>('all');
  
  // Custom mock orders specifically for the seller dashboard matching statuses
  const [sellerOrders, setSellerOrders] = useState([
    { id: 'ORD-8265', buyer: 'Aman Varma', item: 'Infinite Carbon Audio Buds', price: 129.99, qty: 1, date: '21 May 2026', status: 'pending', tracking: '' },
    { id: 'ORD-9102', buyer: 'Sneha Kapoor', item: 'Luxe Minimalist Leather Satchel', price: 210.00, qty: 2, date: '19 May 2026', status: 'shipped', tracking: 'NX-99882211' },
    { id: 'ORD-4491', buyer: 'Diana Prince', item: 'Titanium Smart Ring Sync v2', price: 189.99, qty: 1, date: '15 May 2026', status: 'cancelled', tracking: '' },
    { id: 'ORD-1205', buyer: 'Vikas Rao', item: 'Carbon Aero Water Carafe', price: 49.99, qty: 3, date: '12 May 2026', status: 'returned', tracking: 'NX-41002220' }
  ]);

  // Customer Return Requests Disputes
  const [returnRequests, setReturnRequests] = useState([
    { id: 'RET-382', buyer: 'Karan Johar', product: 'Infinite Carbon Audio Buds', price: 129.99, reason: 'Sound balance defective on left audio buds', date: '23 May 2026', status: 'In Review' },
    { id: 'RET-111', buyer: 'Preeti Deshmukh', product: 'Luxe Minimalist Leather Satchel', price: 210.00, reason: 'Color mismatched from digital preview', date: '18 May 2026', status: 'Refund Approved' }
  ]);

  const handleShipOrder = (orderId: string) => {
    setSellerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'shipped', tracking: 'NX-TRK' + Math.floor(10000 + Math.random() * 90000) } : o));
    alert(`Order ${orderId} marked as dispatched! Dynamic shipping labels and logistics metrics are synced.`);
  };

  const handleCancelOrder = (orderId: string) => {
    setSellerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    alert(`Order ${orderId} has been successfully cancelled and client vault has been notified for full refund.`);
  };

  const handleResolveReturn = (retId: string, newState: 'Refund Approved' | 'Denied') => {
    setReturnRequests(prev => prev.map(ret => ret.id === retId ? { ...ret, status: newState } : ret));
    alert(`Return request ${retId} resolved as: ${newState.toUpperCase()}. Escrow adjustment executed.`);
  };

  // Filter orders count
  const filteredOrdersList = sellerOrders.filter(o => {
    if (ordersFilter === 'all') return true;
    return o.status === ordersFilter;
  });

  // --- STATE 7: CAMPAIGNS & GROWTH (COUPON & FLASH SALE) ---
  const [coupons, setCoupons] = useState([
    { id: 'cp-1', code: 'SPRINGVIBES', type: 'percentage', value: 20, description: '20% Off Spring Seduction Sale', maxRedemptions: 150, currentRedeemed: 42, active: true },
    { id: 'cp-2', code: 'LAUNCH100', type: 'flat', value: 100, description: 'Flat $100 Off Premium Series Gear', maxRedemptions: 50, currentRedeemed: 18, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState('15');
  const [newCouponDesc, setNewCouponDesc] = useState('Storewide discount coupon');
  const [newCouponCap, setNewCouponCap] = useState('100');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) {
      alert('Please fill out coupon code identifier.');
      return;
    }
    const newCp = {
      id: 'cp-' + Date.now(),
      code: newCouponCode.toUpperCase().trim(),
      type: newCouponType,
      value: parseFloat(newCouponValue) || 10,
      description: newCouponDesc,
      maxRedemptions: parseInt(newCouponCap) || 100,
      currentRedeemed: 0,
      active: true
    };
    setCoupons([newCp, ...coupons]);
    setNewCouponCode('');
    alert(`Coupon code ${newCp.code} published live to checkout routes!`);
  };

  const handleToggleCouponState = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  // Flash Sale Opt-in State
  const [flashOptIn, setFlashOptIn] = useState<{ [key: string]: boolean }>({});
  const handleToggleFlashEvent = (productId: string) => {
    setFlashOptIn(prev => ({ ...prev, [productId]: !prev[productId] }));
    const isOn = !flashOptIn[productId];
    alert(isOn ? 'Optimized for upcoming Flash Sale with 25% automatic margin cuts!' : 'Flash Sale participation withdrawn.');
  };

  // --- STATE 8: CUSTOMERS & DISPUTES HELP PORTAL ---
  const [customerQuestions, setCustomerQuestions] = useState([
    { id: 'q-1', author: 'Aditya Sen', product: 'Infinite Carbon Audio Buds', query: 'Is active ANC supported with Android v13 or does it require third-party codec files?', reply: '', active: false },
    { id: 'q-2', author: 'Deepika P.', product: 'Luxe Minimalist Leather Satchel', query: 'Is there a warranty against strap stitch damage?', reply: 'Yes, Deepika! All of our leather commodities come backed by 1-Year comprehensive seller warranty against split seams.', active: true }
  ]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [questionReplyText, setQuestionReplyText] = useState('');

  const submitQuestionReply = (id: string) => {
    if (!questionReplyText.trim()) return;
    setCustomerQuestions(prev => prev.map(q => q.id === id ? { ...q, reply: questionReplyText, active: true } : q));
    setQuestionReplyText('');
    setActiveQuestionId(null);
    alert('Reply published live to the product detail page widget!');
  };

  const [customerReviews, setCustomerReviews] = useState([
    { id: 'rev-1', author: 'Megha Nair', rating: 5, comment: 'Astonishing build. Unboxing absolute pure luxury.', response: '' },
    { id: 'rev-2', author: 'Jayesh G.', rating: 3, comment: 'Good specs, but the initial instructions were completely missing in the packaging envelope.', response: 'Hi Jayesh, deeply sorry about that! I am emailing the digital manual directly to your customer account.' }
  ]);
  const [activeRevId, setActiveRevId] = useState<string | null>(null);
  const [reviewResponseText, setReviewResponseText] = useState('');

  const submitReviewResponse = (id: string) => {
    if (!reviewResponseText.trim()) return;
    setCustomerReviews(prev => prev.map(r => r.id === id ? { ...r, response: reviewResponseText } : r));
    setReviewResponseText('');
    setActiveRevId(null);
    alert('Your official merchant reply was cataloged. Buyers will see it on ShopNexa.');
  };

  const [merchantTickets, setMerchantTickets] = useState([
    { id: 'TKT-8271', subject: 'Tax invoice mismatch on international flight freight code', category: 'Finance & Invoicing', priority: 'High', status: 'Open', date: '24 May 2026' },
    { id: 'TKT-4102', subject: 'Self-logistic seller shipping labels printer orientation setting', category: 'Fulfillment Logistics', priority: 'Low', status: 'Resolved', date: '21 May 2026' }
  ]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('Medium');
  const [newTicketCategory, setNewTicketCategory] = useState('Inventory Sync');

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject) return;
    const newTkt = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      subject: newTicketSubject,
      category: newTicketCategory,
      priority: newTicketPriority,
      status: 'Open',
      date: 'Today'
    };
    setMerchantTickets([newTkt, ...merchantTickets]);
    setNewTicketSubject('');
    alert('Merchant Support Ticket opened. Technical response dispatched within 4 hours.');
  };

  // --- STATE 9: PAYOUT HISTORIES ---
  const payoutRecords = [
    { id: 'PAY-4402', period: '15 May - 21 May 2026', grossVolume: 4200.00, commissionPayed: 420.00, payoutProcessed: 3780.00, status: 'Settled to Bank Account' },
    { id: 'PAY-1109', period: '08 May - 14 May 2026', grossVolume: 8500.50, commissionPayed: 850.05, payoutProcessed: 7650.45, status: 'Settled to Bank Account' },
    { id: 'PAY-7721', period: '01 May - 07 May 2026', grossVolume: 3100.00, commissionPayed: 310.00, payoutProcessed: 2790.00, status: 'Settled to Bank Account' }
  ];

  const totalPayoutProcessedSum = payoutRecords.reduce((acc, current) => acc + current.payoutProcessed, 0);

  return (
    <div className="space-y-10 pb-20 animate-fade-in text-slate-800" id="seller-dashboard-workspace">
      
      {/* HEADER BAR: MERCHANT CORPORATE PROFILES */}
      <section className="bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-850 text-white rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10 flex-col sm:flex-row text-center sm:text-left">
          <img
            src={seller.logo}
            alt={seller.name}
            className="w-16 h-16 rounded-2xl object-cover bg-slate-800 border-2 border-slate-700 shadow-md flex-shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">{seller.name}</h2>
              <span className={`bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[9px] font-mono font-black tracking-widest uppercase px-2.5 py-0.5 rounded-xl`}>
                Active Pro Vendor
              </span>
              <span className="bg-blue-950 border border-blue-500/40 text-blue-300 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-xl">
                SLA Compliance Max
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Merchant Contact: <span className="font-mono text-slate-300">{seller.email}</span> • Associated Sourcing Tier V
            </p>
          </div>
        </div>

        {/* Dashboard Navigation Channels Tabs Row */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 relative z-10">
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'compliance' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Compliance & Checklist
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Sales Hub
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            My Listings
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Orders & Returns
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'campaigns' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Deals
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'support' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Support & Care
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3 py-1.5 font-black text-[11px] rounded-xl transition uppercase tracking-wider ${activeTab === 'payouts' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-white/5 text-slate-300'}`}
          >
            Payouts
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TAB 1: COMPLIANCE, ONBOARDING, KYC & SLA COMPLIANCE SCORE */}
      {/* ========================================================= */}
      {activeTab === 'compliance' && (
        <section className="space-y-8 animate-fade-in" id="compliance-channel-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ONBOARDING PROGRESS AND INTERACTIVE STEP CHECKER LIST */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-600 tracking-widest font-mono uppercase block">Sourcing Start Checklist</span>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Seller Onboarding Tracker ({onboardingProgress}%)</h3>
                <p className="text-xs text-slate-400">Mark items as completed to activate the VIP automatic weekly checkout fastpath.</p>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-650 transition-all duration-500 rounded-full" 
                  style={{ width: `${onboardingProgress}%` }}
                />
              </div>

              <div className="divide-y divide-slate-100">
                {onboardingSteps.map((step) => (
                  <div key={step.id} className="py-4 flex gap-3.5 items-start">
                    <button
                      type="button"
                      onClick={() => handleToggleChecklist(step.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${step.completed ? 'bg-blue-600 border-blue-650 text-white' : 'border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                      {step.completed && <Check size={12} className="stroke-[2.5px]" />}
                    </button>
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold leading-normal transition-colors ${step.completed ? 'text-slate-900 line-through' : 'text-slate-850'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-450 leading-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KYC BUSINESS VERIFICATION AND DOCUMENT UI */}
            <div className="lg:col-span-6 space-y-7">
              
              <div className="bg-white border border-slate-205 rounded-[2rem] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 font-mono tracking-widest block uppercase">Regulated Legal Hold</span>
                    <h3 className="text-sm font-black text-slate-900 uppercase">KYC & Business Verification UI</h3>
                  </div>
                  
                  {/* KYC Status indicators */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${kycStatus === 'approved' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
                    Status: {kycStatus}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-start gap-2 text-xs text-slate-500">
                  <Info size={14} className="text-blue-650 mt-0.5 flex-shrink-0" />
                  <p className="text-[10.5px] leading-relaxed">
                    {kycFeedbackMsg}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
                  <div>
                    <label className="block mb-1">Registered Business Name</label>
                    <input
                      type="text"
                      value={kycForm.businessName}
                      onChange={(e) => handleUpdateKyc('businessName', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Business PAN (Identity Code)</label>
                    <input
                      type="text"
                      value={kycForm.pan}
                      onChange={(e) => handleUpdateKyc('pan', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">GSTIN Tax Registration ID</label>
                    <input
                      type="text"
                      value={kycForm.gstin}
                      onChange={(e) => handleUpdateKyc('gstin', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Entity Operation Class</label>
                    <select
                      value={kycForm.businessType}
                      onChange={(e) => handleUpdateKyc('businessType', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                    >
                      <option>LLC</option>
                      <option>Private Limited</option>
                      <option>Partnership Firm</option>
                      <option>Sole Proprietorship</option>
                    </select>
                  </div>
                  
                  {/* File uploads simulated */}
                  <div className="sm:col-span-2 pt-2">
                    <label className="block mb-1.5">Business Address & Verification Document File</label>
                    <div className="border border-dashed border-slate-250 hover:border-slate-400 bg-slate-50 p-4.5 rounded-2xl text-center transition cursor-pointer">
                      <UploadCloud size={20} className="mx-auto text-slate-400 mb-1" />
                      <span className="text-[11px] text-slate-700 block font-bold">GST_Tax_Receipts_2026_Certified.pdf</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">PDF or PNG files up to 10MB</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveKycDraft}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono uppercase font-black text-[10px] tracking-wide rounded-xl active:scale-[0.99] transition"
                  >
                    Resubmit KYC Application Verification
                  </button>
                </div>
              </div>

              {/* SLA LOGISTICS AND CARRIER PERFORMANCE MATRIX */}
              <div className="bg-slate-900 text-white rounded-[2rem] p-6 border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-emerald-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest font-mono text-slate-350">Platform Performance SLA Status</h3>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ShopNexa tracks fulfillments accurately. Merchants matching core guidelines receive priority delivery options and lower commission holds on weekly dispersals.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] uppercase text-slate-500 block">Avg Dispatch Latency</span>
                    <strong className="text-slate-100">{slaStats.deliveryTime}</strong>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] uppercase text-slate-500 block">SLA Commitment Rate</span>
                    <strong className="text-teal-400">{slaStats.dispatchOnTime}</strong>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] uppercase text-slate-500 block">Escrow Cancellation Ratio</span>
                    <strong className="text-slate-100">{slaStats.cancellationRate}</strong>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[9px] uppercase text-slate-500 block">Escorlation Ticket disputes</span>
                    <strong className="text-emerald-405">{slaStats.customerEscalations}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[9px] text-zinc-450 uppercase">Current Sourcing Class Tier:</span>
                  <strong className="text-amber-400 font-extrabold">{slaStats.tierRating}</strong>
                </div>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RICH WEB ANALYTICS & SAAS ORDER VOLUMES SCOREBOARD */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <section className="space-y-8 animate-fade-in" id="analytics-channel-workspace">
          
          {/* Quick Bento-like highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Gross Revenue Volume</span>
              <div className="flex justify-between items-baseline">
                <strong className="text-3xl font-black text-slate-950 font-mono">${seller.totalSales.toLocaleString()}</strong>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg font-mono">+18% MoM</span>
              </div>
              <p className="text-[10.5px] text-slate-450 font-medium">Accumulating logistics direct commissions</p>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Escrow Preserved Balance</span>
              <div className="flex justify-between items-baseline">
                <strong className="text-3xl font-black text-slate-950 font-mono">${seller.balance.toLocaleString()}</strong>
                <span className="text-[10.5px] rounded-lg bg-orange-50 text-orange-700 px-2 py-0.5 font-bold font-mono">2 Active holds</span>
              </div>
              <p className="text-[10.5px] text-slate-450 font-medium">Auto-released after delivery audits verify quality</p>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Weekly Orders Dispatch</span>
              <div className="flex justify-between items-baseline">
                <strong className="text-3xl font-black text-slate-950 font-mono">1,485 Pcs</strong>
                <span className="text-[10px] font-bold text-emerald-650 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">+4.2%</span>
              </div>
              <p className="text-[10.5px] text-slate-450 font-medium">Dispatched with certified logistics carriers</p>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Conversion Visitor Ratio</span>
              <div className="flex justify-between items-baseline">
                <strong className="text-3xl font-black text-slate-950 font-mono">{conversionRates.addToCartRatio}</strong>
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">Optimal</span>
              </div>
              <p className="text-[10.5px] text-slate-450 font-medium">Active visitor purchase conversion math</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* WEEKLY TIMELINE CHART */}
            <div className="lg:col-span-8 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-blue-650 font-mono uppercase tracking-widest block">Core Sourcing Volumes</span>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Weekly Revenues Timeline & Volume Growth</h3>
                </div>
                
                <span className="text-[10px] font-mono font-black uppercase text-slate-405">Currency: USD</span>
              </div>

              {/* Pure CSS Charts */}
              <div className="h-60 pt-8 flex items-end justify-between gap-4">
                {weeklyRevenueData.map((data, i) => {
                  const maxRevenue = 32400;
                  const barHeightPercent = (data.revenue / maxRevenue) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Floating tooltip on hover */}
                      <div className="absolute bottom-full mb-1 bg-slate-900 text-white rounded-lg p-2 text-center text-[10px] opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg pointer-events-none z-10 font-mono min-w-[100px]">
                        <p className="font-bold font-sans">{data.label}</p>
                        <p className="text-blue-400">${data.revenue.toLocaleString()}</p>
                        <p className="text-slate-400">{data.orders} Orders</p>
                      </div>

                      <div className="w-full bg-slate-50 hover:bg-blue-50/50 rounded-xl h-44 flex items-end relative overflow-hidden border border-slate-100 shadow-inner">
                        <div 
                          className="w-full rounded-b-xl bg-gradient-to-t from-blue-700 via-blue-600 to-indigo-500 transition-all duration-1000"
                          style={{ height: `${barHeightPercent}%` }}
                        />
                      </div>
                      
                      <span className="text-[10px] font-black text-slate-450 font-mono uppercase tracking-tight">{data.label}</span>
                      <span className="text-[9.5px] font-bold text-slate-800 font-mono">${(data.revenue/1000).toFixed(1)}k</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRAFFIC CHANNELS & CONVERSION FUNNELS */}
            <div className="lg:col-span-4 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black font-mono uppercase tracking-widest text-slate-400">Sourcing Funnel Audit</span>
                <h3 className="text-sm font-black text-slate-900 uppercase">Traffic & Conversions</h3>
                <p className="text-[11px] text-slate-400">Live ratios representing checkout authorizations.</p>
              </div>

              {/* Traffic sources */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-widest font-mono">Organic Traffic Ingress</span>
                
                <div className="space-y-2 text-xs">
                  {trafficChannels.map((tc, idx) => (
                    <div key={idx} className="space-y-1 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex justify-between items-center font-semibold text-slate-800">
                        <span>{tc.source}</span>
                        <strong className="font-mono text-slate-900">{tc.percentage}</strong>
                      </div>
                      <div className="relative w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: tc.percentage }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>Visitor Count:</span>
                        <span>{tc.visitors.toLocaleString()} IP Codes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funnel conversion rates */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-widest font-mono">Conversion Quality Rates</span>
                
                <div className="p-3 bg-blue-50/30 border border-blue-105/10 rounded-2xl text-[11.5px] text-slate-700 font-medium space-y-1.5">
                  <div className="flex justify-between">
                    <span>Unique Sourcing Sessions:</span>
                    <strong className="text-slate-900 font-mono">{conversionRates.visitors}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Add-to-Cart Action Ratio:</span>
                    <strong className="text-slate-900 font-mono">{conversionRates.addToCartRatio}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Checkout Initiations:</span>
                    <strong className="text-slate-900 font-mono">{conversionRates.checkoutInitiationRate}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 border border-emerald-100/50 p-1.5 rounded-lg mt-2">
                    <span>Fulfillment Ratio:</span>
                    <strong className="font-mono font-black">{conversionRates.finalPurchaseRate}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* PRODUCT PERFORMANCE MATRIX */}
          <div className="bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-mono font-black tracking-wider text-slate-400">Inventory Monetization Matrix</span>
                <h3 className="text-sm font-black text-slate-900 uppercase">Individual Product Performance Index</h3>
              </div>
              <button 
                type="button"
                onClick={handleExportCSV}
                className="text-[10.5px] bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl font-mono flex items-center gap-1 hover:bg-slate-800"
              >
                <FileDown size={12} />
                <span>Export Index CSV Report</span>
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="py-2.5 px-4">Commodity Item Description</th>
                    <th className="py-2.5 px-4 font-mono">IP Traffic</th>
                    <th className="py-2.5 px-4 font-mono">Checkout Clicks</th>
                    <th className="py-2.5 px-4 font-mono">Conversion Ratio</th>
                    <th className="py-2.5 px-4 font-mono font-bold">Gross Earned Value</th>
                    <th className="py-2.5 px-4">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                  {vendorProducts.map((p, i) => {
                    const mockViews = 2450 + (i * 850);
                    const mockConversion = 2.4 + (i * 0.4);
                    const mockEarned = p.price * Math.round(mockViews * (mockConversion/100));
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={p.image} className="w-9 h-9 object-cover rounded-lg border border-slate-100 bg-slate-50" referrerPolicy="no-referrer" />
                          <span className="text-slate-900 font-bold max-w-[2400px] truncate">{p.title}</span>
                        </td>
                        <td className="py-3 px-4 font-mono">{mockViews.toLocaleString()} IPs</td>
                        <td className="py-3 px-4 font-mono">{Math.round(mockViews * 0.08)} Hits</td>
                        <td className="py-3 px-4 text-slate-900 font-mono font-bold text-blue-650">{mockConversion.toFixed(2)}%</td>
                        <td className="py-3 px-4 text-slate-950 font-mono font-black">${mockEarned.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                            Profitable Listing
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PRODUCT INVENTORY, ADD FORM, BULK CSV UPLOAD, V-SKU */}
      {/* ========================================================= */}
      {activeTab === 'catalog' && (
        <section className="space-y-8 animate-fade-in" id="catalog-channel-workspace">
          
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveCatalogSubtab('listings')}
              className={`pb-3.5 px-6 font-black text-xs uppercase tracking-wider relative ${activeCatalogSubtab === 'listings' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Listings & Stock Thresholds
              {activeCatalogSubtab === 'listings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
            <button
              onClick={() => setActiveCatalogSubtab('add')}
              className={`pb-3.5 px-6 font-black text-xs uppercase tracking-wider relative ${activeCatalogSubtab === 'add' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Configure Single Listing
              {activeCatalogSubtab === 'add' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
            <button
              onClick={() => setActiveCatalogSubtab('bulk')}
              className={`pb-3.5 px-6 font-black text-xs uppercase tracking-wider relative ${activeCatalogSubtab === 'bulk' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Bulk Upload spreadsheets
              {activeCatalogSubtab === 'bulk' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
            <button
              onClick={() => setActiveCatalogSubtab('prices')}
              className={`pb-3.5 px-6 font-black text-xs uppercase tracking-wider relative ${activeCatalogSubtab === 'prices' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Margin & Price Adjuster
              {activeCatalogSubtab === 'prices' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          </div>

          {/* SUBTAB 1: PRODUCT LISTINGS & SKU INVENTORIES */}
          {activeCatalogSubtab === 'listings' && (
            <div className="bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Product Variant & SKU Catalog Inventory</h3>
                  <p className="text-xs text-slate-450">Maintain sizes, colors, SKUs, and track low-stock warnings.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    Download CSV Template
                  </button>
                  <button
                    onClick={() => setActiveCatalogSubtab('add')}
                    className="px-4 py-2 bg-blue-650 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl"
                  >
                    + Publish Catalog Item
                  </button>
                </div>
              </div>

              {/* Low Stock Highlight Alert Box banner */}
              {vendorProducts.some(p => p.stock <= 5) && (
                <div className="p-4 bg-rose-50 border border-rose-150 rounded-2xl flex items-start gap-3 text-xs text-rose-800 animate-pulse">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 font-medium">
                    <strong className="font-black uppercase tracking-wider block text-[10px]">Supply Replenishment Alerts</strong>
                    <p>Fulfillment reserves are nearly exhausted for selected high-conversion items. Increase warehouse stock counts immediately to prevent logistics SLA penalty deductions.</p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto text-xs select-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase tracking-widest bg-slate-50/40">
                      <th className="py-2 px-4">Item details</th>
                      <th className="py-2 px-4">SKU Code</th>
                      <th className="py-2 px-4">Variants Model Config</th>
                      <th className="py-2 px-4 font-mono font-bold">Standard Price</th>
                      <th className="py-2 px-4 font-mono">Stock Hold</th>
                      <th className="py-2 px-4 font-mono">Warehouse Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                    {vendorProducts.map((p) => {
                      const computedSku = p.title.substring(0, 3).toUpperCase() + '-' + p.id.toUpperCase();
                      const itemLowStockThreshold = p.stock <= 8;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <img src={p.image} className="w-11 h-11 object-cover rounded-xl border border-slate-100 bg-slate-50" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-slate-900 font-bold max-w-[200px] truncate">{p.title}</h4>
                              <span className="text-[9.5px] uppercase font-mono font-black text-blue-650">{p.category} Department</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-900 text-slate-450 font-bold">
                            {computedSku}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[10.5px]">
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-slate-150 px-1.5 py-0.5 rounded text-[9.5px]">Onyx Black</span>
                              <span className="bg-slate-150 px-1.5 py-0.5 rounded text-[9.5px]">Carbon Gray</span>
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9.5px] font-bold">L, XL</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-black text-slate-900">${p.price}</td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${itemLowStockThreshold ? 'bg-rose-50 text-rose-700 font-extrabold ring-1 ring-rose-200' : 'bg-slate-100 text-slate-800'}`}>
                              {p.stock} Units
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {itemLowStockThreshold ? (
                              <span className="text-[9px] uppercase font-black text-rose-650 font-mono tracking-wider block">Low Stock Alert</span>
                            ) : (
                              <span className="text-[9px] uppercase font-black text-emerald-650 font-mono tracking-wider block">Adequate supply</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 2: ADD SINGLE PRODUCT FORM WITH COMPREHENSIVE INPUTS */}
          {activeCatalogSubtab === 'add' && (
            <div className="bg-white border border-slate-205 rounded-[2.5rem] p-6 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Single Commodity Listing Sourcing Form</h3>
                <p className="text-xs text-slate-500">Configure sizes, colors, SKUs, and specifications perfectly beforehand.</p>
              </div>

              {formSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-1" />
                  <h4 className="font-bold text-lg">Product Verification Successful!</h4>
                  <p className="text-xs text-emerald-700">Listing added live across global marketplace caches instantly.</p>
                </div>
              ) : (
                <form onSubmit={handlePublishProduct} className="space-y-6 text-xs font-semibold text-slate-650">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block mb-1.5">Asset Listing Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ergonomic Aerospace Titanium Key Organizer"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5">Sourcing Department</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl font-bold"
                      >
                        <option value="electronics">Electronics Gear</option>
                        <option value="fashion">Fashion Apparel & Apparel</option>
                        <option value="smart-home">Smart Living Assist</option>
                        <option value="sports">Athletics & Sourcing gear</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block mb-1.5">SKU ID Code</label>
                        <input
                          type="text"
                          placeholder="CARB-SLT-01"
                          value={newSku}
                          onChange={(e) => setNewSku(e.target.value)}
                          className="w-full px-2 py-2.5 bg-slate-55 border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5">Retail Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full px-2 py-2.5 bg-slate-55 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5">MSRP Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newOriginalPrice}
                          onChange={(e) => setNewOriginalPrice(e.target.value)}
                          className="w-full px-2 py-2.5 bg-slate-55 border border-slate-20 rounded-xl font-mono text-slate-450"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1.5">Media Assets (Product Image URL)</label>
                      <input
                        type="text"
                        required
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5">Initial Warehouse Inventory (Units Stock)</label>
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5">Main Copy (Description Specifications Profile)</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter detailed dimensions, craftsmanship descriptions, material compositions..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>

                  {/* VARIANT MANAGEMENT & COLORWAYS INGRESS CONTAINER */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-bold text-slate-700">Add Color Variants</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Glacier White"
                          value={newColorInput}
                          onChange={(e) => setNewColorInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newColorInput) {
                              setVariantsColors([...variantsColors, newColorInput]);
                              setNewColorInput('');
                            }
                          }}
                          className="px-2.5 py-1.5 bg-slate-900 text-white font-bold rounded-lg"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {variantsColors.map(c => (
                          <span key={c} className="bg-slate-200/80 text-[10px] px-2 py-0.5 rounded-md flex items-center font-bold gap-1 text-slate-700">
                            <span>{c}</span>
                            <button type="button" onClick={() => setVariantsColors(variantsColors.filter(item => item !== c))} className="text-red-500 font-bold">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-slate-700">Add Dimension / Size Variants</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. L, XL, Standard"
                          value={newSizeInput}
                          onChange={(e) => setNewSizeInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newSizeInput) {
                              setVariantsSizes([...variantsSizes, newSizeInput]);
                              setNewSizeInput('');
                            }
                          }}
                          className="px-2.5 py-1.5 bg-slate-900 text-white font-bold rounded-lg"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {variantsSizes.map(s => (
                          <span key={s} className="bg-slate-200/80 text-[10px] px-2 py-0.5 rounded-md flex items-center font-bold gap-1 text-slate-700">
                            <span>{s}</span>
                            <button type="button" onClick={() => setVariantsSizes(variantsSizes.filter(item => item !== s))} className="text-red-500 font-bold">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SPEC SUMMARY TABLE INGRESS */}
                  <div className="space-y-2">
                    <label className="block font-black text-slate-400 uppercase font-mono tracking-widest text-[9px]">Additional Sourcing Specs Specifications</label>
                    <div className="grid grid-cols-1 sm:grid-cols-10 gap-3">
                      <input
                        type="text"
                        placeholder="Key (e.g. Warranty)"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        className="sm:col-span-4 px-3 py-2 bg-slate-55 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 5-Years International)"
                        value={specVal}
                        onChange={(e) => setSpecVal(e.target.value)}
                        className="sm:col-span-4 px-3 py-2 bg-slate-55 border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={addSpecPair}
                        className="sm:col-span-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold"
                      >
                        Add Spec
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {Object.entries(specs).map(([k, v]) => (
                        <span key={k} className="inline-flex text-[10.5px] font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 gap-1.5">
                          <strong>{k}:</strong> {v}
                          <button type="button" onClick={() => {
                            const copy = { ...specs };
                            delete copy[k];
                            setSpecs(copy);
                          }} className="text-red-500">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-650 text-white hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest transition shadow-lg shadow-blue-500/10"
                    >
                      Authenticate Specs & Publish Listing
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SUBTAB 3: BULK PRODUCT SPREADSHEETS UPLOAD COMPONENT */}
          {activeCatalogSubtab === 'bulk' && (
            <div className="bg-white border border-slate-205 rounded-[2.5rem] p-8 max-w-2xl mx-auto space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-650 rounded-full mx-auto flex items-center justify-center">
                <UploadCloud size={28} />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900 uppercase">Interactive Bulk Product Sourcing Uploads</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Export complete active inventory lists, map product variants, colors, weight indices, and bulk modify warehouse counts via structured templates.
                </p>
              </div>

              <div className="border border-dashed border-slate-250 bg-slate-50 rounded-2xl p-8 relative hover:border-slate-400 transition">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleSimulateCSVUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className="space-y-2">
                  <div className="inline-flex py-1.5 px-3 bg-blue-105/10 text-blue-700 font-mono font-bold rounded-lg text-[10px] uppercase">
                    Select spreadsheet file (.xlsx, .csv)
                  </div>
                  <p className="text-xs text-slate-450 font-medium">Or drag and drop your completed catalog mapping sheets here</p>
                  <p className="text-[10px] text-slate-400">Inventory schemas verified automatic instantly.</p>
                </div>
              </div>

              {bulkFileUploaded && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium leading-none animate-pulse">
                  Verifying column constraints and SKU indices...
                </div>
              )}

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-5 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition uppercase tracking-wider"
                >
                  Download Model Template
                </button>
              </div>
            </div>
          )}

          {/* SUBTAB 4: AD-HOC MARGIN & PRICE ADJUSTER DIRECT MATRIX */}
          {activeCatalogSubtab === 'prices' && (
            <div className="bg-white border border-slate-205 rounded-[2.5rem] p-6 shadow-sm space-y-5 animate-fade-in font-sans font-semibold">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 uppercase">Margin, Price, and Discounts Direct Console</h3>
                <p className="text-xs text-slate-450">Change direct prices and warehouse stock reserves instantly across Active caches.</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {editableProducts.map((p) => {
                  const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
                  return (
                    <div key={p.id} className="py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex gap-3 items-center flex-1">
                        <img src={p.image} className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="text-slate-900 font-bold truncate max-w-[200px]">{p.title}</h4>
                          <span className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-wider">SKU: {p.id.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold text-slate-750">
                        <div>
                          <label className="block text-[8px] uppercase text-slate-450 mb-0.5">Sale Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={p.price}
                            onChange={(e) => handleUpdatePrice(p.id, 'price', e.target.value)}
                            className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase text-slate-450 mb-0.5">Warehouse Stock</label>
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleUpdatePrice(p.id, 'stock', e.target.value)}
                            className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase text-slate-450 mb-0.5">Live Deal Margin</label>
                          <div className="bg-slate-50 border border-slate-150 p-2 rounded-lg text-[10.5px] font-black text-emerald-700 uppercase tracking-widest text-center">
                            Save {discountPercent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSavePriceDiscounts}
                  className="w-full py-3.5 bg-slate-950 font-black text-xs text-white uppercase tracking-widest.rounded-xl"
                >
                  Save Global Margin Reductions
                </button>
              </div>
            </div>
          )}

        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 4: COMPREHENSIVE ORDERS FULFILLMENT & RETURN TRACKS */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <section className="space-y-8 animate-fade-in" id="orders-channel-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ORDERS TABLE LOGISTICS */}
            <div className="lg:col-span-8 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-6">
              <div className="space-y-1 pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Live Sourcing Order Dispatch Control</h3>
                  <p className="text-xs text-slate-450">Authorize parcel packing lists and trigger logic dispatches weekly.</p>
                </div>

                {/* Filter buttons */}
                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 gap-1 text-[10px] font-mono font-black uppercase">
                  {['all', 'pending', 'shipped', 'cancelled', 'returned'].map((stat) => {
                    const isChosen = ordersFilter === stat;
                    return (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => setOrdersFilter(stat as any)}
                        className={`px-2.5 py-1 rounded-lg transition ${isChosen ? 'bg-slate-900 text-white font-black' : 'hover:bg-slate-100 text-slate-500'}`}
                      >
                        {stat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredOrdersList.length === 0 ? (
                  <p className="py-8 text-center text-slate-400 font-mono">No logistics files found under chosen filters.</p>
                ) : (
                  filteredOrdersList.map((order) => (
                    <div key={order.id} className="py-4.5 space-y-3 font-semibold select-none">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 text-sm">{order.id}</strong>
                          <span className="text-slate-400 block text-[10.5px]">{order.buyer} • Registered Account ID</span>
                        </div>

                        {/* Status tag */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase ${order.status === 'shipped' ? 'bg-emerald-50 text-emerald-800' : order.status === 'cancelled' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-150/60 font-mono text-[11px] leading-relaxed">
                        <div>
                          <span className="text-slate-450 block text-[9px]">INVOICE COMMODITY</span>
                          <span className="font-bold text-slate-800">{order.item}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px]">GROSS REVENUE</span>
                          <span className="font-bold text-slate-900">${(order.price * order.qty).toFixed(2)} ({order.qty} pcs)</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px]">TRACK CODES</span>
                          <span className="text-slate-800 font-bold">{order.tracking ? order.tracking : 'WAIT-DISPATCH'}</span>
                        </div>
                      </div>

                      {/* SLA Dispatches action commands */}
                      {order.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold tracking-wide rounded-xl uppercase text-[9px]"
                          >
                            Cancel Holder
                          </button>
                          <button
                            onClick={() => handleShipOrder(order.id)}
                            className="px-4 py-2 bg-blue-650 hover:bg-blue-700 text-white font-black tracking-wide rounded-xl uppercase text-[9px]"
                          >
                            Generate Label & Ship Cargo
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RETURN CHECKS DISPUTES */}
            <div className="lg:col-span-4 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[9px] tracking-widest uppercase font-mono font-bold text-rose-600 block">Customer Refund Safeholds</span>
                <h3 className="text-sm font-black text-slate-900 uppercase">Return Requests Disputes</h3>
                <p className="text-xs text-slate-450">Dispute holds on Escrow payout timelines.</p>
              </div>

              <div className="space-y-4">
                {returnRequests.map((ret) => (
                  <div key={ret.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 font-semibold text-xs leading-relaxed text-slate-750">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-1.5">
                      <div>
                        <strong className="text-slate-900 font-bold block">{ret.product}</strong>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">Dispute ID: {ret.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${ret.status === 'Refund Approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                        {ret.status}
                      </span>
                    </div>

                    <div className="space-y-1 font-medium">
                      <p className="text-[10.5px]"><strong className="text-slate-900">Buyer Reason:</strong> "{ret.reason}"</p>
                      <p className="text-[11px] font-bold text-slate-900">Total Escrow At Dispute: <span className="font-mono">${ret.price}</span></p>
                    </div>

                    {ret.status === 'In Review' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleResolveReturn(ret.id, 'Denied')}
                          className="flex-1 py-1.5 border border-slate-250 bg-white hover:bg-slate-100 text-[10px] font-black uppercase tracking-wider rounded-lg"
                        >
                          Deny Return
                        </button>
                        <button
                          onClick={() => handleResolveReturn(ret.id, 'Refund Approved')}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg"
                        >
                          Authorize Refund
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 5: CREATING CAMPAIGNS, COUPONS & FLASH OPT-IN */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <section className="space-y-8 animate-fade-in" id="campaigns-channel-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COUPON GENERATOR FORM */}
            <div className="lg:col-span-5 bg-white border border-slate-250 rounded-[2.2rem] p-6 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black text-blue-650 font-mono tracking-widest block">Market Expansion Tools</span>
                <h3 className="text-sm font-black text-slate-905 uppercase">Coupon Code Generation Panel</h3>
                <p className="text-xs text-slate-450">Authorize custom coupon codes to boost buyer conversion rates.</p>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-semibold text-slate-650">
                <div>
                  <label className="block mb-1.5">Coupon Identifier Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH30V"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-55 border border-slate-200 rounded-xl font-mono uppercase tracking-wider font-black text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1.5">Coupon Deduction Unit</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-blue-800 font-bold"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Cash ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5">Discount Value</label>
                    <input
                      type="number"
                      required
                      placeholder="15"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 p-2 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1.5">Redemption Use Cap</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={newCouponCap}
                      onChange={(e) => setNewCouponCap(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200 p-2 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Promotion Validity</label>
                    <div className="bg-slate-100 p-2 border border-slate-200 rounded-xl text-center text-[10.5px] uppercase font-bold tracking-wider">
                      Active: 30 Days
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5">Public Banner Tagline Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Saves 15% overall on checkouts"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-55 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-650 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition"
                  >
                    Authenticate Discount Voucher
                  </button>
                </div>
              </form>
            </div>

            {/* LIVE ACTIVE COUPONS & FLASH SALE PARTICIPATION CHECKBOXES */}
            <div className="lg:col-span-7 space-y-7">
              
              <div className="bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase">Live Voucher Redemptions ({coupons.length})</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {coupons.map((cp) => (
                    <div key={cp.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 font-semibold text-xs leading-relaxed text-slate-700">
                      <div className="flex justify-between items-start border-b border-slate-200 pb-1">
                        <strong className="font-mono text-slate-905 bg-slate-200 px-2 py-0.5 rounded text-[11px] uppercase tracking-widest">
                          {cp.code}
                        </strong>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${cp.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                          {cp.active ? 'Active' : 'Halted'}
                        </span>
                      </div>

                      <p className="font-medium text-slate-600 text-[11px] leading-snug">"{cp.description}"</p>
                      
                      <div className="space-y-1 text-[10.5px] border-t border-slate-200/50 pt-2 font-mono">
                        <div className="flex justify-between">
                          <span>Discount Matrix:</span>
                          <span className="font-bold text-slate-900">{cp.type === 'percentage' ? `${cp.value}% Off` : `$${cp.value} Flat`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Redeemed Index:</span>
                          <span className="font-bold text-slate-900">{cp.currentRedeemed} / {cp.maxRedemptions} Pcs</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1 font-mono text-[9px]">
                        <button
                          type="button"
                          onClick={() => handleToggleCouponState(cp.id)}
                          className={`w-full py-1 rounded border capitalize ${cp.active ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                        >
                          {cp.active ? 'Pause Campaign' : 'Resume Campaign'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FLASH SALE EVENT PARTICIPATION BOX */}
              <div className="bg-slate-950 text-white rounded-[2.2rem] p-6 border border-slate-800 space-y-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 text-rose-400">
                  <Flame size={18} className="text-orange-500 animate-pulse fill-orange-500/10" />
                  <h3 className="text-xs font-black uppercase tracking-widest font-mono text-orange-450">ShopNexa Flash Sale Event Arena</h3>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fast track your inventory conversion rates. Opt-in catalog products to participate in our upcoming global Flash Sale on <strong>Tuesday noon</strong>. ShopNexa slashes prices by 25% but boosts traffic indices by up to 8x.
                </p>

                <div className="divide-y divide-slate-850/50 text-xs">
                  {vendorProducts.map((p) => {
                    const isParticipating = !!flashOptIn[p.id];
                    return (
                      <div key={p.id} className="py-3 flex items-center justify-between">
                        <div className="flex gap-2 items-center flex-1 min-w-0 pr-3">
                          <img src={p.image} className="w-8 h-8 object-cover rounded-lg shrink-0 border border-slate-850" />
                          <span className="truncate text-slate-205 font-bold">{p.title}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleFlashEvent(p.id)}
                          className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] uppercase font-black tracking-wide border transition ${isParticipating ? 'bg-orange-600 border-orange-500 text-white font-extrabold shadow-md animate-bounce' : 'border-slate-830 text-slate-400 hover:text-white hover:bg-slate-900/'}`}
                        >
                          {isParticipating ? '🔥 Participating' : 'Opt-in Flash'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 6: CUSTOMER CARE PORTAL, REVIEW REPLIES, HELP TICKETS */}
      {/* ======================================================== */}
      {activeTab === 'support' && (
        <section className="space-y-8 animate-fade-in" id="support-channel-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs font-semibold text-slate-700">
            
            {/* Direct Q&A and Review Answers */}
            <div className="lg:col-span-8 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-6">
              
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Customer Questions & Q&A Board</h3>
                  <p className="text-xs text-slate-450">Provide support to potential buyers to drive high-conversion checkouts.</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {customerQuestions.map((q) => (
                    <div key={q.id} className="py-4 space-y-2.5 font-semibold">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 font-bold block">{q.product}</strong>
                          <span className="text-[10.5px] text-slate-400 font-mono">Queried by: {q.author}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-black uppercase ${q.active ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800 animate-pulse'}`}>
                          {q.active ? 'Answered live' : 'Needs Response'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-650 bg-slate-50 border border-slate-150/60 p-3 rounded-2xl leading-relaxed italic">
                        "{q.query}"
                      </p>

                      {q.reply ? (
                        <div className="pl-4 border-l-2 border-blue-500 text-[11px] leading-relaxed text-slate-550 italic">
                          <strong className="text-blue-600 block font-mono text-[9px] uppercase tracking-wider">Official Merchant Reply:</strong>
                          <p>"{q.reply}"</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activeQuestionId === q.id ? (
                            <div className="space-y-2 animate-fade-in">
                              <textarea
                                value={questionReplyText}
                                onChange={(e) => setQuestionReplyText(e.target.value)}
                                placeholder="Write clear support answer composition..."
                                className="w-full bg-slate-55 border border-slate-200 p-2.5 rounded-xl text-xs"
                                rows={2}
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setActiveQuestionId(null)}
                                  className="px-3 py-1.5 border border-slate-200 rounded-lg"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => submitQuestionReply(q.id)}
                                  className="px-4 py-1.5 bg-blue-650 text-white rounded-lg font-black uppercase"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveQuestionId(q.id);
                                setQuestionReplyText('');
                              }}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 font-extrabold text-white px-3.5 py-2 rounded-xl uppercase tracking-wider"
                            >
                              Post Official Sourcing Advice
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* REVIEWS REPLIES COMPONENT */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Review Responses & Customer Feedback</h3>
                  <p className="text-xs text-slate-450">Review comments posted by verified purchasers with official merchant response widgets.</p>
                </div>

                <div className="space-y-4">
                  {customerReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 font-semibold text-xs leading-relaxed text-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 font-bold block">{rev.author}</strong>
                          <span className="text-[10px] text-amber-500 font-mono font-bold tracking-wider">★ {rev.rating} Stars Rating</span>
                        </div>
                        <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase">Verified Buyer</span>
                      </div>

                      <p className="text-[11px] text-slate-650 italic">"{rev.comment}"</p>

                      {rev.response ? (
                        <div className="pl-3 border-l-2 border-indigo-500/50 bg-white p-2.5 rounded-r-xl text-[11px] text-indigo-950 font-medium italic">
                          <strong className="text-indigo-600 block text-[8px] uppercase tracking-wider font-mono">Response Posted:</strong>
                          <p>"{rev.response}"</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activeRevId === rev.id ? (
                            <div className="space-y-2 animate-fade-in">
                              <textarea
                                value={reviewResponseText}
                                onChange={(e) => setReviewResponseText(e.target.value)}
                                placeholder="Express standard gratitude or corrective directives..."
                                className="w-full bg-white border border-slate-205 p-2 rounded-lg"
                                rows={2}
                              />
                              <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setActiveRevId(null)} className="px-2.5 py-1 border border-slate-200 rounded-lg">Cancel</button>
                                <button type="button" onClick={() => submitReviewResponse(rev.id)} className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg uppercase text-[10px]">Submit Response</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRevId(rev.id);
                                setReviewResponseText('');
                              }}
                              className="text-[9.5px] font-black uppercase text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200"
                            >
                              Write Merchant Reply
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* OPEN TICKETS WITH HIGH DESK AGENTS */}
            <div className="lg:col-span-4 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-widest block">Merchant Help Desk</span>
                <h3 className="text-sm font-black text-slate-905 uppercase">Support Tickets Gate</h3>
                <p className="text-xs text-slate-450">File support tickets with ShopNexa engineering representatives directly.</p>
              </div>

              {/* Ticket list */}
              <div className="space-y-3 pt-2">
                {merchantTickets.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-2 leading-relaxed">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-slate-900 font-bold text-xs">{t.subject}</strong>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold">{t.id} • {t.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${t.status === 'Resolved' ? 'bg-slate-200 text-slate-650' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-[9.5px] text-slate-400 font-mono">
                      <span>Priority: <strong className="text-slate-700 font-bold capitalize">{t.priority}</strong></span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Ticket inputs */}
              <form onSubmit={handleCreateSupportTicket} className="border-t border-slate-100 pt-4 space-y-3 text-xs font-semibold text-slate-650">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono block">Open Ticket Console</span>
                
                <div>
                  <label className="block mb-1">Ticket Subject / Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bank Payout routing failure on 21 May cycle"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    className="w-full p-2 bg-slate-55 border border-slate-200 rounded-lg font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div>
                    <label className="block mb-1">Select Priority</label>
                    <select
                      value={newTicketPriority}
                      onChange={(e) => setNewTicketPriority(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-1.5 rounded-lg"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Help Category</label>
                    <select
                      value={newTicketCategory}
                      onChange={(e) => setNewTicketCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-1.5 rounded-lg font-bold text-slate-800"
                    >
                      <option>Finance & Payouts</option>
                      <option>Inventory Sync</option>
                      <option>Logistics dispatch SLS</option>
                      <option>Return Dispute audits</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono font-black tracking-wider uppercase text-[10px] rounded-lg"
                >
                  Confirm Support Ticket
                </button>
              </form>

            </div>

          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* TAB 7: PAYOUT HISTORY, CYCLE SCHEDULE, COMMISSION SPLITS */}
      {/* ======================================================== */}
      {activeTab === 'payouts' && (
        <section className="space-y-8 animate-fade-in text-xs font-semibold text-slate-750" id="payouts-channel-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PAYOUT CALCULATOR & COMMISSION BREAKDOWN */}
            <div className="lg:col-span-4 bg-white border border-slate-250 rounded-[2.2rem] p-6 shadow-xs space-y-5">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-black text-slate-400 tracking-widest block">Active Sourcing Clearance</span>
                <h3 className="text-sm font-black text-slate-900 uppercase">Payout & Commission Calculator</h3>
                <p className="text-xs text-slate-450">Review direct commission percentages and tax holding structures.</p>
              </div>

              {/* Live Calculator mockup values */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-4 font-mono text-[11px] leading-relaxed select-none">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Payout Cycles:</span>
                  <strong className="text-slate-800 font-extrabold text-[12.5px]">Weekly (Every Wednesday 02:00 AM)</strong>
                </div>

                <div className="space-y-1.5 font-medium">
                  <div className="flex justify-between">
                    <span>Vendor gross sales base:</span>
                    <span className="text-slate-905 font-bold">${(14250.00).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-indigo-700 font-bold">
                    <span>ShopNexa base platform cut (10%):</span>
                    <span>-${(1425.00).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT & Sourcing holds (2% inclusive):</span>
                    <span className="text-slate-905">-${(285.00).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-rose-650 bg-rose-50 px-1.5 py-0.5 rounded">
                    <span>Fulfillment courier holds:</span>
                    <span>-$0.00</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-sans text-xs font-black text-slate-950">
                  <span>Merchant Net Payout Due:</span>
                  <span className="text-lg font-black font-mono text-emerald-700">${(12540.00).toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/50 border border-amber-205 rounded-2xl flex items-start gap-2">
                <Info size={15} className="text-amber-805 mt-0.5 flex-shrink-0" />
                <p className="text-[10.5px] leading-relaxed text-amber-900 font-medium">
                  We maintain funds securely in ShopNexa Escrow. Standard weekly dispersal triggers automatically upon verified package delivery holds. Only elite sellers with SLA ratings &gt;95% qualify for 24h fast dispersals.
                </p>
              </div>
            </div>

            {/* PAYOUT DISPERSAL HISTORY TABLE */}
            <div className="lg:col-span-8 bg-white border border-slate-205 rounded-[2.2rem] p-6 shadow-sm space-y-5">
              <div className="space-y-1 pb-3 border-b border-indigo-50 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-905 uppercase">Merchant Dispersal & Bank Settlements History</h3>
                  <p className="text-xs text-slate-450">Review completed direct deposits and routing hash references.</p>
                </div>
                <div className="text-right text-[10.5px] font-mono text-slate-400">
                  Lifetime processed payout: <strong className="text-slate-800 font-bold font-sans">${totalPayoutProcessedSum.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                </div>
              </div>

              <div className="overflow-x-auto select-none">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase tracking-widest bg-slate-50/50">
                      <th className="py-2.5 px-4 font-mono">Disversal ID</th>
                      <th className="py-2.5 px-4">Ledger Time Period</th>
                      <th className="py-2.5 px-4 font-mono">Gross Sales Volume</th>
                      <th className="py-2.5 px-4 font-mono">ShopNexa Commission Base</th>
                      <th className="py-2.5 px-4 font-mono font-bold text-emerald-850">Direct Net Dispersed</th>
                      <th className="py-2.5 px-4">Settlement File Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                    {payoutRecords.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/40">
                        <td className="py-3.5 px-4 font-mono text-slate-800 font-bold">{p.id}</td>
                        <td className="py-3.5 px-4 font-sans font-bold">{p.period}</td>
                        <td className="py-3.5 px-4 font-mono">${p.grossVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="py-3.5 px-4 font-mono text-indigo-700">-${p.commissionPayed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-950 font-black text-emerald-700">${p.payoutProcessed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg uppercase tracking-wide">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </section>
      )}

    </div>
  );
};
