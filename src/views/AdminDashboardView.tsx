import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Percent, DollarSign, Store, Clock, Check, X, TrendingUp, Sparkles,
  AlertTriangle, Activity, Settings, Layers, Tag, Gift, Award, HelpCircle, Search, FileText,
  ArrowUpRight, Trash2, Edit2, RotateCcw, AlertOctagon, CheckCircle, Flame, Plus, Database,
  Settings2, RefreshCw, Send, Save, Globe, Bell, Lock, Key, MessageSquare, Sliders, MapPin, 
  Truck, CreditCard, LayoutDashboard, Eye, FileDown, Terminal, Mail, Info, ChevronRight
} from 'lucide-react';
import { Product, Seller, Order } from '../types';

interface AdminDashboardViewProps {
  products: Product[];
  sellers: Seller[];
  onApproveSeller: (id: string) => void;
  onRejectSeller: (id: string) => void;
}

// -------------------------------------------------------------
// MOCK DATASETS & STRUCTURES
// -------------------------------------------------------------
interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  role: string;
  action: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

interface FraudAlert {
  id: string;
  source: string;
  threatLevel: 'High' | 'Medium' | 'Low';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
}

interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  sellers,
  onApproveSeller,
  onRejectSeller,
}) => {
  // Navigation Sidebar states
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'orders' | 'users' | 'promotions' | 'moderation' | 'settings'>('overview');

  // Interactive local states for ALL 41 functions
  // 1. Core lists synced with props where available
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localSellers, setLocalSellers] = useState<Seller[]>([]);
  
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
    setLocalSellers(sellers);
  }, [sellers]);

  // Dynamic Chart Filters
  const [graphRange, setGraphRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedGraphPoint, setSelectedGraphPoint] = useState<number | null>(null);

  // 1. OVERVIEW & ANALYTICS DATA
  const salesGraphData = {
    daily: [
      { label: 'Mon', revenue: 4200, orders: 35 },
      { label: 'Tue', revenue: 5800, orders: 48 },
      { label: 'Wed', revenue: 3100, orders: 26 },
      { label: 'Thu', revenue: 7200, orders: 60 },
      { label: 'Fri', revenue: 9100, orders: 75 },
      { label: 'Sat', revenue: 11200, orders: 95 },
      { label: 'Sun', revenue: 8400, orders: 70 },
    ],
    weekly: [
      { label: 'Wk 1', revenue: 24000, orders: 195 },
      { label: 'Wk 2', revenue: 31500, orders: 240 },
      { label: 'Wk 3', revenue: 28900, orders: 222 },
      { label: 'Wk 4', revenue: 47250, orders: 380 },
      { label: 'Wk 5', revenue: 59300, orders: 490 },
      { label: 'Wk 6', revenue: 64200, orders: 520 },
    ],
    monthly: [
      { label: 'Jan', revenue: 124000, orders: 980 },
      { label: 'Feb', revenue: 145000, orders: 1120 },
      { label: 'Mar', revenue: 189000, orders: 1480 },
      { label: 'Apr', revenue: 210000, orders: 1650 },
      { label: 'May', revenue: 254800, orders: 2190 },
    ]
  };

  const fraudAlertsData: FraudAlert[] = [
    { id: 'FRD-903', source: 'IP Routing loop (Multi-accounts)', threatLevel: 'High', description: 'Same credit hash used for onboarding 3 disparate sellers in 10 minutes.', status: 'open' },
    { id: 'FRD-441', source: 'Loyalty Loophole exploited', threatLevel: 'Medium', description: 'User account prem92@shopnexa attempted claiming referral bonus 18 times within a single token session.', status: 'investigating' },
    { id: 'FRD-102', source: 'SLA Speed manipulation', threatLevel: 'Low', description: 'Seller AuraTech uploaded pre-generated carrier codes prior to physical inventory pickup.', status: 'resolved' }
  ];
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(fraudAlertsData);

  // System Health state indicators
  const [systemHealth, setSystemHealth] = useState({
    cpuLoad: 24,
    memoryUsage: 4.8,
    payoutGatewayLatency: 64,
    dbConnectionState: 'Active',
    cacheStatus: '98.5% Hit Rate',
    cronScheduler: 'Active'
  });
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // 2. CATALOG MANAGEMENT STATES
  const [categoriesList, setCategoriesList] = useState([
    { id: 'cat-1', name: 'Electronics & Gadgets', slug: 'electronics', commission: 8, active: true },
    { id: 'cat-2', name: 'Premium Luxury Fashion', slug: 'fashion', commission: 12, active: true },
    { id: 'cat-3', name: 'Smart Living Systems', slug: 'home', commission: 5, active: true },
    { id: 'cat-4', name: 'Sports, Tech & Leisure', slug: 'sports', commission: 7, active: true }
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatComm, setNewCatComm] = useState('10');

  const [brandList, setBrandList] = useState([
    { id: 'brd-1', name: 'AuraTech Officials', active: true, featured: true },
    { id: 'brd-2', name: 'CarbonCraft Labs', active: true, featured: false },
    { id: 'brd-3', name: 'MinimalLux', active: false, featured: false }
  ]);
  const [newBrandName, setNewBrandName] = useState('');

  const [attributeList, setAttributeList] = useState([
    { id: 'attr-1', name: 'Colorway Specs', type: 'Visual Tonal Codes', values: ['Space Grey', 'Stardust Gold', 'Ivory White'] },
    { id: 'attr-2', name: 'RAM Size Storage', type: 'Technical Hardware', values: ['8GB LPDDR5', '16GB LPDDR5X', '64GB Unified Memory'] }
  ]);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrValues, setNewAttrValues] = useState('');

  // Product approvals queue
  const [pendingProducts, setPendingProducts] = useState([
    { id: 'ppr-01', title: 'Aerospace Carbon Fiber Drone v4', sellerName: 'AuraTech Officials', cost: 1299.99, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', originalPrice: 1599.99, description: 'Supercharged commercial-grade drone with carbon housing specifications.', category: 'electronics' },
    { id: 'ppr-02', title: 'Ergonomic Kinetic Desk Frame', sellerName: 'MinimalLux', cost: 450.00, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80', originalPrice: 599.99, description: 'Auto-adjust smart desk supporting digital posture diagnostics.', category: 'home' }
  ]);

  // 3. FULFILLMENTS & CUSTOMER CLAIMS STATE
  const [orderQuerySearch, setOrderQuerySearch] = useState('');
  const [adminOrders, setAdminOrders] = useState([
    { id: 'ORD-9915', date: '2026-05-23', buyer: 'Arjun Sen', amount: 379.99, item: 'AuraTech Sound Buds', status: 'pending', trackingNum: 'EL-908221' },
    { id: 'ORD-8824', date: '2026-05-22', buyer: 'Samantha J.', amount: 1450.00, item: 'Carbon Edition Road Bike', status: 'shipped', trackingNum: 'NX-99882200' },
    { id: 'ORD-1209', date: '2026-05-21', buyer: 'Karan Johar', amount: 890.00, item: 'Luxe Leather Modular Sofa', status: 'delivered', trackingNum: 'NX-88221144' },
    { id: 'ORD-3305', date: '2026-05-20', buyer: 'Divya Rawat', amount: 199.99, item: 'Titanium Smart Ring', status: 'cancelled', trackingNum: '' }
  ]);

  const [refundClaims, setRefundClaims] = useState([
    { id: 'RFD-302', orderId: 'ORD-1209', client: 'Karan Johar', claimedSum: 890.00, explanation: 'Leather arrived with minor side scuffs. Propose partial hold cashback.', status: 'Waiting Review' },
    { id: 'RFD-118', orderId: 'ORD-3305', client: 'Divya Rawat', claimedSum: 199.99, explanation: 'Order cancelled by system during stock failure. Full chargeback requested.', status: 'Auto Approved' }
  ]);

  const [returnRequests, setReturnRequests] = useState([
    { id: 'RET-89', orderId: 'ORD-9915', client: 'Arjun Sen', product: 'AuraTech Sound Buds', state: 'Return Label Issued', logisticCarrier: 'Nexa Express Standard' }
  ]);

  // 4. USER & ACCESS DIRECTORIES
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([
    { id: 'STF-10', name: 'Vikas Sharma', email: 'vikas@shopnexa.com', role: 'Finance Auditor', permissions: ['Financial claims', 'Refund payout authorization'] },
    { id: 'STF-25', name: 'Riya Gupta', email: 'riya.g@shopnexa.com', role: 'Support Moderator', permissions: ['Comments moderation', 'Ticketing operations'] }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Support Moderator');

  const [userRoster, setUserRoster] = useState([
    { id: 'USR-889', name: 'Prem Kumar', email: 'customer@shopnexa.com', status: 'Active', purchasesCount: 14, rank: 'Platinum VIP' },
    { id: 'USR-112', name: 'Deepika Padukone', email: 'deepika@lux.in', status: 'Active', purchasesCount: 41, rank: 'Elite Star' },
    { id: 'USR-440', name: 'Suspicious Bot Account', email: 'bot99@scammail.ru', status: 'Suspended', purchasesCount: 0, rank: 'Unregistered' }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'AUD-3301', timestamp: '2026-05-24 02:40:15', operator: 'Prem Kumar (Sysadmin)', role: 'Owner', action: 'Approved incoming seller AuraTech license application.', ip: '109.22.41.98', severity: 'info' },
    { id: 'AUD-3302', timestamp: '2026-05-24 02:41:22', operator: 'Vikas Sharma (Finance)', role: 'Staff', action: 'Authorized instant claim payout amount $199.99 on ORD-3305.', ip: '14.22.105.14', severity: 'info' },
    { id: 'AUD-3303', timestamp: '2026-05-24 02:43:05', operator: 'System Web Threat Defender', role: 'SecDaemon', action: 'Multiple unauthorized referral sign-ups detected. Throttling range USR-440 IP addresses.', ip: '185.122.9.22', severity: 'critical' }
  ]);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // 5. PROMOTIONS & REWARDS STATE
  const [heroBanners, setHeroBanners] = useState([
    { id: 'ban-1', headline: 'Next-Generation Smart Aesthetics Hub', discountNote: 'Flat 20% OFF Core Series Products', targetUrl: '/products?category=electronics', active: true },
    { id: 'ban-2', headline: 'Avant-Garde Designer Leather Handbags', discountNote: 'Exclusive Pre-Sales Direct Release', targetUrl: '/products?category=fashion', active: false }
  ]);
  const [newBannerHeadline, setNewBannerHeadline] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');

  const [couponsList, setCouponsList] = useState([
    { id: 'cp-10', code: 'PLATINUM500', value: 500, type: 'flat', description: 'Flat $500 Off High-End Electronics', minCart: 2000, active: true },
    { id: 'cp-20', code: 'NEXASUMMER', value: 15, type: 'percentage', description: '15% Off Storewide Summer Catalog', minCart: 100, active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('15');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');

  const [giftCards, setGiftCards] = useState([
    { id: 'GFT-881', code: 'NEXA-GIFT-A882', initialBalance: 250.00, currentBalance: 250.00, assignedUser: 'prem92006@gmail.com', expiry: '2027-12-31' },
    { id: 'GFT-904', code: 'VIP-MEMB-7721', initialBalance: 1000.00, currentBalance: 780.00, assignedUser: 'customer@shopnexa.com', expiry: '2026-11-20' }
  ]);
  const [newGiftUser, setNewGiftUser] = useState('');
  const [newGiftVal, setNewGiftVal] = useState('100');

  const [loyaltyRules, setLoyaltyRules] = useState({
    pointEarnMultiplier: 10,  // e.g. 10 points per dollar
    redemptionRateUSD: 100,    // 100 points = $1
    goldTierMinPoints: 5000,
    vipTierMinPoints: 12000,
    doubleRewardsCategory: 'fashion'
  });

  const [referralParams, setReferralParams] = useState({
    referrerBonusUSD: 15.00,
    inviteeBonusUSD: 10.00,
    referralOrderThresholdUSD: 50.00,
    activeLinksCount: 1420
  });

  // 6. COMMENTS & ENGAGEMENT MODERATION
  const [reviewsModeration, setReviewsModeration] = useState([
    { id: 'rev-301', author: 'Jayesh G.', item: 'Extreme Edition Smart Watch', rating: 1, text: 'This watches charger broke on my very first try. Complete chinese plastic waste!', status: 'pending' },
    { id: 'rev-302', author: 'Anita Roy', item: 'AuraTech Sound Buds', rating: 5, text: 'Magnificent digital acoustic isolation stage. Sound field compares beautifully against airpods.', status: 'approved' }
  ]);

  const [questionsModeration, setQuestionsModeration] = useState([
    { id: 'qa-401', clientName: 'Sanjay Dutt', product: 'AuraTech Sound Buds', queryText: 'Are separate ear tips included for deep fit sizes?', staffResponse: '', status: 'unresolved' }
  ]);
  const [qaDraftAnswer, setQaDraftAnswer] = useState('');

  // 7. GLOBAL SETTINGS & LOCALE CONFIGURATIONS
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripeMockFallback: true,
    nexaEscrowHoldPeriodDays: 7,
    authorizedPayoutMethods: ['Direct Bank Wire Routing', 'Stripe Connect Wallet']
  });

  const [shippingSettings, setShippingSettings] = useState({
    flatRateGroundUSD: 9.99,
    expressPremiumUSD: 24.99,
    freeShippingThresholdUSD: 150.00,
    automaticLogsCarrierSync: true
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultTaxGSTRatePercentage: 18,
    harmonizedStateTaxHSTPercentage: 13,
    sellerTCSCollectionRatePercentage: 1,
    autoMailTaxInvoices: true
  });

  const [seoConfig, setSeoConfig] = useState({
    homepageMetaTitle: 'ShopNexa Platform Marketplace - Elite Architectural Sourcing App',
    homepageMetaDesc: 'Discover leading hardware design products, modern luxury garments, and smart appliances in high-fidelity sandbox environments.',
    metaKeywords: 'SaaS ecommerce marketplace, Carbon Fiber commodities, Premium soundbuds, IoT Smart tech, elite direct sellers'
  });

  const [cmsPages, setCmsPages] = useState([
    { id: 'cms-1', path: '/terms', pageTitle: 'Terms of Service Governance Document', lastModified: '2026-05-20', content: 'ShopNexa holds full client escrow reserves in trust standard. Delivery must pass SLA latency indicators...' },
    { id: 'cms-2', path: '/privacy', pageTitle: 'Information Protocol Disclosure (Privacy Policy)', lastModified: '2026-05-18', content: 'Encryption models govern all payment keys. We do not expose credit files or tracking logs to external vendors...' }
  ]);
  const [activeCmsId, setActiveCmsId] = useState<string | null>(null);
  const [cmsDraftContent, setCmsDraftContent] = useState('');

  const [notificationRules, setNotificationRules] = useState([
    { id: 'not-1', name: 'Buyer Order Disbursement SMS', channels: ['SMS API Gateway', 'Direct App Push'], enabled: true },
    { id: 'not-2', name: 'Fraud Flag Instantly Alerts SecDaemons', channels: ['Email Secure Digest', 'Staff Slack Integration Webhook'], enabled: true },
    { id: 'not-3', name: 'Weekly Merchant Wallet Payout Recap', channels: ['Email Secure Digest'], enabled: false }
  ]);

  const localizationConfig = {
    languages: [
      { code: 'en-US', name: 'English (US Standard Pro)', default: true },
      { code: 'hi-IN', name: 'Hindi Devangari Unicode (Maha-Market)', default: false },
      { code: 'es-MX', name: 'Spanish (LatAm Markets)', default: false }
    ],
    currencies: [
      { code: 'USD', symbol: '$', rateMultiplier: 1.0, precisionDigits: 2, default: true },
      { code: 'INR', symbol: '₹', rateMultiplier: 83.45, precisionDigits: 0, default: false },
      { code: 'EUR', symbol: '€', rateMultiplier: 0.92, precisionDigits: 2, default: false }
    ]
  };

  // -------------------------------------------------------------
  // DYNAMIC CALCULATIONS & METRICS
  // -------------------------------------------------------------
  const totalRevenueSum = adminOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSellersCount = localSellers.length;
  const pendingSellersQueueCount = localSellers.filter(s => s.status === 'pending').length;
  const approvedSellersCount = localSellers.filter(s => s.status !== 'pending').length;

  const totalProductsInDatabase = localProducts.length;
  const pendingProductApprovalsCount = pendingProducts.length;

  // -------------------------------------------------------------
  // CORE DISPATCH ACTION CALLBACKS
  // -------------------------------------------------------------

  // Refresh health metrics (Simulated latency indicator)
  const handleTriggerHealthCheckDiagnostics = () => {
    setIsRefreshingHealth(true);
    setTimeout(() => {
      setSystemHealth(prev => ({
        ...prev,
        cpuLoad: Math.floor(15 + Math.random() * 25),
        payoutGatewayLatency: Math.floor(45 + Math.random() * 35),
      }));
      setIsRefreshingHealth(false);
    }, 800);
  };

  // Flush Redis Cache Trigger
  const handleRunCachePurgeRedisCluster = () => {
    alert('Instructed Redis Memory Pool and active Route JSON caches to instantly release. Dynamic index values rebuilt in 40ms!');
    setSystemHealth(prev => ({ ...prev, cacheStatus: '100% Hit Rate (Cache Rebuilt)' }));
  };

  // User Actions
  const handleToggleUserStatus = (id: string) => {
    setUserRoster(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        alert(`Account state for student ${u.name} updated to: ${nextStatus.toUpperCase()}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Seller Approvals
  const approveVendorPartner = (id: string) => {
    onApproveSeller(id);
    alert('Merchant registration verified & security keys injected. Notification email dispatched explaining commission rate configurations.');
  };

  // Product Approvals
  const handleManageProductApproval = (productId: string, action: 'approve' | 'reject') => {
    const item = pendingProducts.find(p => p.id === productId);
    if (!item) return;

    if (action === 'approve') {
      // Re-route into actual catalog via applet function helper:
      alert(`Product ${item.title} has passed visual guidelines! Synchronizing image previews into platform search indexes.`);
      setLocalProducts(prev => [
        {
          id: item.id,
          title: item.title,
          price: item.cost,
          originalPrice: item.originalPrice,
          description: item.description,
          category: item.category,
          rating: 4.8,
          ratingCount: 1,
          sellerId: 'v1',
          sellerName: item.sellerName,
          image: item.image,
          specs: { Quality: 'Certified Elite Sourcing Standard' },
          stock: 45
        },
        ...prev
      ]);
    } else {
      alert(`Listing ${item.title} feedback recorded: Rejected due to metadata standards mismatch.`);
    }

    setPendingProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Categories Manager
  const handleInsertMarketplaceCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const item = {
      id: 'cat-' + (categoriesList.length + 1),
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      commission: parseInt(newCatComm) || 10,
      active: true
    };
    setCategoriesList([...categoriesList, item]);
    setNewCatName('');
    alert(`Custom Class Category "${item.name}" registered with a standard Base Comm rate of ${item.commission}%`);
  };

  // Coupon configuration
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const item = {
      id: 'cp-' + Date.now(),
      code: newCouponCode.trim().toUpperCase(),
      value: parseFloat(newCouponValue) || 15.00,
      type: newCouponType,
      description: `Coupon published for automated markdown checkouts.`,
      minCart: 200,
      active: true
    };
    setCouponsList([item, ...couponsList]);
    setNewCouponCode('');
    alert(`Platform-wide promo discount code ${item.code} verified and injected into checkout routing.`);
  };

  // Staff Account creation
  const handleAddSecurityStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const item: StaffAccount = {
      id: 'STF-' + Math.floor(100 + Math.random() * 900),
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      permissions: ['Comments moderation', 'System health diagnostics']
    };
    setStaffAccounts([item, ...staffAccounts]);
    setNewStaffName('');
    setNewStaffEmail('');
    alert(`Staff credentials constructed for ${item.name}. Active keychains provisioned.`);
  };

  // CMS policy update
  const handleTriggerCmsDraftSave = () => {
    if (!activeCmsId) return;
    setCmsPages(prev => prev.map(p => p.id === activeCmsId ? { ...p, content: cmsDraftContent, lastModified: 'Today' } : p));
    alert('Draft page markdown cached, updated inside the virtual files array.');
    setActiveCmsId(null);
  };

  // Fraud Management response
  const handleExecuteFraudBlock = (id: string, action: 'block' | 'dimiss') => {
    setFraudAlerts(prev => prev.map(f => f.id === id ? { ...f, status: action === 'block' ? 'resolved' : 'dismissed' } : f));
    alert(action === 'block' ? `IP and payment profile associated with ${id} frozen.` : `Trace alert dismissed.`);
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in text-slate-800" id="platform-admin-hub-container">
      
      {/* HEADER SECTION WITH MASTER STATS STATUS AND CLUSTERS PANEL */}
      <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-650 via-indigo-600 to-sky-400 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border border-indigo-400/20">
            A
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Platform Administrative Control Hub</h2>
              <span className="bg-indigo-900 border border-indigo-400 text-indigo-300 text-[9px] font-mono font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                Security-Level IV Auth
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Session Status: <strong className="text-emerald-400 font-mono">● Secured Live</strong> • Connected to ShopNexa Cloud Core
            </p>
          </div>
        </div>

        {/* Global Hub Navigation Selector Slots */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 relative z-10 text-xs font-bold text-slate-350">
          {[
            { id: 'overview', label: 'Monitor Hub', icon: LayoutDashboard },
            { id: 'catalog', label: 'Inventory (Cat)', icon: Layers },
            { id: 'orders', label: 'Fulfillment & Claims', icon: Truck },
            { id: 'users', label: 'Directories & Security', icon: Users },
            { id: 'promotions', label: 'Rewards & Banners', icon: Gift },
            { id: 'moderation', label: 'Moderation Q&A', icon: MessageSquare },
            { id: 'settings', label: 'Global Setup', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 font-bold rounded-xl transition flex items-center gap-1.5 uppercase text-[10px] tracking-wider ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-white/5 text-slate-300'}`}
            >
              <tab.icon size={12} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* HUB SECTION 1: MASTER OVERVIEW & REVENUES SAAS ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <article className="space-y-8 animate-fade-in" id="overview-saas-view">
          
          {/* Dashboard Premium Card Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-white border border-slate-200/80 rounded-[1.5rem] shadow-xs hover:border-slate-300 transition block relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono block">Gross Platform Volume</span>
              <strong className="text-2xl md:text-3xl font-black text-slate-900 font-mono block mt-1">${totalRevenueSum.toLocaleString()}</strong>
              <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1 font-mono">
                <ArrowUpRight size={12} />
                <span>+18.4% Sourcing Growth</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-2">Sum of 4 real transaction orders</span>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-[1.5rem] shadow-xs hover:border-slate-300 transition block relative">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono block">Secured Buyers</span>
              <strong className="text-2xl md:text-3xl font-black text-slate-900 block mt-1">1,420 Users</strong>
              <div className="text-[10px] text-indigo-600 flex items-center gap-1 mt-1 font-semibold">
                <Activity size={12} />
                <span>Platinum Tier Ranks Dominating</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-2">Active loyalty wallets active</span>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-[1.5rem] shadow-xs hover:border-slate-300 transition block relative">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono block">Seller Commission Queue</span>
              <strong className="text-2xl md:text-3xl font-black text-slate-900 block mt-1">{approvedSellersCount} Merchants</strong>
              <div className="text-[10px] text-amber-600 flex items-center gap-1 mt-1 font-bold">
                <Clock size={12} />
                <span>{pendingSellersQueueCount} pending certification</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-2">SLA target metrics verified weekly</span>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-[1.5rem] shadow-xs hover:border-slate-300 transition block relative">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono block">Admin Validation Pool</span>
              <strong className="text-2xl md:text-3xl font-black text-slate-900 block mt-1">{pendingProductApprovalsCount} Items</strong>
              <div className="text-[10px] text-orange-600 flex items-center gap-1 mt-1 font-black uppercase">
                <AlertTriangle size={12} />
                <span>Critical Quality Check</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-2">Awaiting catalog inclusion validation</span>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sales and Orders Interactive Graph Panel */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-150">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-indigo-650 font-mono uppercase tracking-wider block">Unified Transaction Graph</span>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Sales & Orders Volume Registry</h3>
                </div>
                
                {/* Graph Range Filter */}
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {['daily', 'weekly', 'monthly'].map((rng) => (
                    <button
                      key={rng}
                      onClick={() => { setGraphRange(rng as any); setSelectedGraphPoint(null); }}
                      className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg transition-all ${graphRange === rng ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {rng}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic SVG / Styled CSS bar graph */}
              <div className="space-y-4">
                <div className="h-56 flex items-end justify-between gap-3 pt-6 relative">
                  
                  {/* Chart vertical guide lines */}
                  <div className="absolute inset-x-0 top-6 bottom-4 flex flex-col justify-between pointer-events-none mb-1">
                    <div className="border-t border-slate-100 w-full h-px"></div>
                    <div className="border-t border-slate-100 w-full h-px"></div>
                    <div className="border-t border-slate-100 w-full h-px"></div>
                  </div>

                  {salesGraphData[graphRange].map((item, idx) => {
                    const maxVal = Math.max(...salesGraphData[graphRange].map(p => p.revenue));
                    const percentage = (item.revenue / maxVal) * 100;
                    const isSelected = selectedGraphPoint === idx;

                    return (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center gap-2 group relative z-10 cursor-pointer"
                        onClick={() => setSelectedGraphPoint(idx)}
                      >
                        <div className="w-full bg-slate-50 border border-slate-100 hover:border-indigo-200/80 rounded-lg h-36 flex items-end relative overflow-hidden">
                          <div 
                            className={`w-full rounded-b-md transition-all duration-500 ${isSelected ? 'bg-indigo-650 shadow-md' : 'bg-slate-300 group-hover:bg-indigo-400'}`}
                            style={{ height: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{item.label}</span>
                        <span className="text-[9.5px] font-black text-slate-800 font-mono">${(item.revenue / 1000).toFixed(1)}k</span>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Data detail panel */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-h-[44px] flex items-center justify-between text-xs font-medium text-slate-650">
                  {selectedGraphPoint !== null ? (
                    <>
                      <span>Interval Index: <strong className="text-indigo-650 font-bold">{salesGraphData[graphRange][selectedGraphPoint].label}</strong></span>
                      <span>Total Revenue processed: <strong className="text-slate-900 font-bold">${salesGraphData[graphRange][selectedGraphPoint].revenue.toLocaleString()}</strong></span>
                      <span>Orders matched: <strong className="text-slate-900 font-bold">{salesGraphData[graphRange][selectedGraphPoint].orders} conversions</strong></span>
                    </>
                  ) : (
                    <span className="text-slate-400 italic font-mono text-[10.5px]">Click any bar above to query specific intervals.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Department-wise marketplace contributions (Category Shares Pie substitute) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 font-mono tracking-widest block uppercase">Segment Analytics</span>
                <h3 className="text-sm font-black text-slate-900 uppercase">Category Performance</h3>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { name: 'Electronics and smart gadgets', slug: 'electronics', share: '45%', color: 'bg-indigo-600', val: '$82,040' },
                  { name: 'Luxury clothing and fashion', slug: 'fashion', share: '30%', color: 'bg-rose-500', val: '$54,420' },
                  { name: 'Home aesthetics & decor', slug: 'home', share: '15%', color: 'bg-emerald-500', val: '$27,240' },
                  { name: 'Sports, Tech & fitness apparel', slug: 'sports', share: '10%', color: 'bg-amber-500', val: '$20,820' },
                ].map((dept, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-100/50 transition">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span className="truncate">{dept.name}</span>
                      <span className="font-mono">{dept.share}</span>
                    </div>
                    <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${dept.color}`} style={{ width: dept.share }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Gross Segment Value:</span>
                      <span>{dept.val} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FRAUD ALERTS PANEL */}
            <div className="lg:col-span-7 bg-white border border-slate-250 rounded-[2.2rem] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5 animate-pulse">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-650"></span>
                    <span className="text-[9px] font-bold text-rose-600 tracking-widest font-mono uppercase">Secdaemon Gateways</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Active Fraud Alerts & Risk Traces</h3>
                </div>
                
                <span className="text-[10px] font-semibold text-slate-400 font-mono">Platform Shields: Armed</span>
              </div>

              <div className="space-y-4">
                {fraudAlerts.map((flag) => (
                  <div 
                    key={flag.id} 
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${flag.status === 'resolved' || flag.status === 'dismissed' ? 'opacity-50 bg-slate-100 border-slate-200' : 'bg-rose-50/40 border-rose-100 hover:bg-rose-50/60'}`}
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold font-mono">{flag.id}</strong>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase ${flag.threatLevel === 'High' ? 'bg-rose-600 text-white' : flag.threatLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'}`}>
                          Threat: {flag.threatLevel}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800">{flag.source}</p>
                      <p className="text-[10.5px] text-slate-500 leading-normal">{flag.description}</p>
                      <p className="text-[10px] text-slate-400">Mitigation status: <span className="font-mono lowercase text-indigo-650">{flag.status}</span></p>
                    </div>

                    {flag.status === 'open' && (
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleExecuteFraudBlock(flag.id, 'block')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono uppercase text-[9.5px] font-black rounded-xl transition"
                        >
                          Freeze Account & IP
                        </button>
                        <button
                          onClick={() => handleExecuteFraudBlock(flag.id, 'dimiss')}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-350 text-slate-700 font-mono uppercase text-[9.5px] font-bold rounded-xl transition"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* REAL-TIME SYSTEM HEALTH DIAGNOSTICS */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-[2.2rem] p-6 shadow-sm space-y-4 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider font-mono text-slate-300">System Health Telemetry</h3>
                </div>

                <button 
                  onClick={handleTriggerHealthCheckDiagnostics}
                  disabled={isRefreshingHealth}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white shrink-0 disabled:opacity-40"
                  title="Run Diagnostics"
                >
                  <RefreshCw size={14} className={isRefreshingHealth ? 'animate-spin' : ''} />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Platform memory socket logs track physical latency buffers. Standard response metrics are auto-evaluated against internal SLA criteria.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[9px] uppercase text-zinc-500 block">CPU Virtual Thread Allocation</span>
                  <strong className="text-slate-100 text-sm">{systemHealth.cpuLoad}% Load</strong>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[9px] uppercase text-zinc-500 block">RAM Pool buffer allocation</span>
                  <strong className="text-slate-100 text-sm">{systemHealth.memoryUsage} GB of 8GB</strong>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[9px] uppercase text-zinc-500 block">Gateway Dispersal Speed</span>
                  <strong className="text-emerald-400 text-sm">{systemHealth.payoutGatewayLatency}ms latency</strong>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[9px] uppercase text-zinc-500 block">Escorlations Cron Job</span>
                  <strong className="text-slate-100 text-sm">{systemHealth.cronScheduler}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono">
                <span className="text-[9.5px] uppercase text-slate-400">Dynamic Edge Cache:</span>
                <strong className="text-amber-400">{systemHealth.cacheStatus}</strong>
              </div>

              <button
                type="button"
                onClick={handleRunCachePurgeRedisCluster}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-mono uppercase text-[9px] font-black tracking-wider rounded-xl transition mt-2 border border-slate-700/50"
              >
                Flush System Cache Redis Cluster
              </button>
            </div>

          </div>

          {/* TOP PERFORMERS ROWS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Sellers Table */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono block">Volume Leaders</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Top Merchants & Compliance Rates</h3>
              
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase py-1.5">
                      <th className="pb-2">Merchant Partner</th>
                      <th className="pb-2 font-mono">Products Limit</th>
                      <th className="pb-2 text-right">Escrow Payout GMV</th>
                      <th className="pb-2 text-right font-mono">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {localSellers.map((v) => (
                      <tr key={v.id}>
                        <td className="py-2.5 flex items-center gap-2">
                          <img src={v.logo} className="w-6 h-6 object-cover rounded-lg bg-slate-100" referrerPolicy="no-referrer" />
                          <span className="font-bold text-slate-900">{v.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-505 font-mono">{v.productsCount} SKUs authorized</td>
                        <td className="py-2.5 text-right font-black text-slate-900 font-mono">${v.totalSales.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-mono text-emerald-650">{(v.commissionRate * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products Volume Table */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono block">Product Leaders</span>
              <h3 className="text-sm font-black text-slate-900 uppercase">Top-Grossing Catalog Commodities</h3>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left font-semibold">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase py-1.5">
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-right">RRP Price</th>
                      <th className="pb-2 text-right font-mono">Stock Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-705">
                    {localProducts.slice(0, 4).map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 flex items-center gap-2">
                          <img src={p.image} className="w-6 h-6 object-cover rounded" referrerPolicy="no-referrer" />
                          <span className="font-bold text-slate-900 shrink-0 max-w-[120px] truncate">{p.title}</span>
                        </td>
                        <td className="py-2.5 text-slate-500 capitalize">{p.category}</td>
                        <td className="py-2.5 text-right font-black text-slate-900">${p.price}</td>
                        <td className={`py-2.5 text-right font-mono font-bold ${p.stock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {p.stock} units
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </article>
      )}

      {/* ========================================================= */}
      {/* HUB SECTION 2: CATALOG CONTROL & MERCHANDISE REJECTION LOG */}
      {/* ========================================================= */}
      {activeTab === 'catalog' && (
        <article className="space-y-8 animate-fade-in" id="catalog-control-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. Pending Product Approvals */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-5">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase">Pending Catalog Sourcing Queue</h3>
                <p className="text-xs text-slate-405 mt-0.5">Inspect physical standard qualities of merchant additions prior to index exposure.</p>
              </div>

              {pendingProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle className="text-emerald-500 mx-auto" size={32} />
                  <p className="text-xs text-slate-500 italic">Inventory queues are clear. All catalog additions active!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingProducts.map((p) => (
                    <div key={p.id} className="py-4 flex flex-col sm:flex-row gap-4 items-start justify-between">
                      <div className="flex gap-4">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-16 h-16 object-cover bg-slate-50 border rounded-xl flex-shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1 text-xs font-semibold">
                          <h4 className="text-sm font-black text-slate-900">{p.title}</h4>
                          <p className="text-indigo-650">Submitted by: <strong className="font-bold text-slate-800">{p.sellerName}</strong></p>
                          <p className="text-slate-450 leading-normal">{p.description}</p>
                          <div className="flex gap-2 font-mono text-[10.5px]">
                            <span>RRP Price: <strong className="text-slate-900">${p.cost}</strong></span>
                            <span>Target Category: <strong className="text-slate-900 uppercase">{p.category}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleManageProductApproval(p.id, 'approve')}
                          className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-mono uppercase text-[9px] font-black rounded-lg transition"
                        >
                          Approve Listing
                        </button>
                        <button
                          onClick={() => handleManageProductApproval(p.id, 'reject')}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 font-mono text-slate-700 uppercase text-[9px] font-bold rounded-lg transition border border-slate-200"
                        >
                          Reject with feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Category management & attributes */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Category form */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase">Platform Category Registry</h3>
                </div>

                <div className="space-y-2 text-xs">
                  {categoriesList.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 font-bold block">{cat.name}</strong>
                        <span className="text-[10px] text-slate-450 font-mono">Commission rate: {cat.commission}%</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5 font-mono">Active</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleInsertMarketplaceCategory} className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Add Sourcing Category</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sports Equipment"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Commission % (e.g. 10)"
                      value={newCatComm}
                      onChange={(e) => setNewCatComm(e.target.value)}
                      className="w-2/3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="submit"
                      className="w-1/3 bg-slate-900 hover:bg-slate-800 text-white font-mono uppercase text-[10px] font-black rounded-xl transition"
                    >
                      Insert
                    </button>
                  </div>
                </form>
              </div>

              {/* Brands config */}
              <div className="bg-white border border-slate-202 rounded-[1.8rem] p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-mono uppercase font-black text-slate-400 block tracking-widest">Global Brand Registry</span>
                
                <div className="space-y-2 text-xs">
                  {brandList.map(b => (
                    <div key={b.id} className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg text-xs font-semibold">
                      <span>{b.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${b.active ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-205 text-slate-500'}`}>
                        {b.active ? 'Licensed Partner' : 'Expired'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5 pt-2">
                  <input 
                    type="text" 
                    placeholder="Register Brand..." 
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="w-2/3 px-2.5 py-1.5 border border-slate-205 text-xs rounded-xl"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (!newBrandName) return;
                      setBrandList([...brandList, { id: 'brd-' + Date.now(), name: newBrandName, active: true, featured: false }]);
                      setNewBrandName('');
                    }}
                    className="w-1/3 bg-indigo-600 text-white font-mono uppercase text-[9px] font-black rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Attributes Config */}
              <div className="bg-white border border-slate-202 rounded-[1.8rem] p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-mono uppercase font-black text-slate-400 block tracking-widest">Specification Matrix Keys</span>
                
                <div className="space-y-2.5 text-xs">
                  {attributeList.map(attr => (
                    <div key={attr.id} className="space-y-1 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex justify-between">
                        <strong className="text-slate-800">{attr.name}</strong>
                        <span className="text-[9.5px] text-slate-400 font-mono">{attr.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {attr.values.map((v, i) => (
                          <span key={i} className="bg-slate-200 text-slate-800 px-1.5 py-0.5 text-[9px] rounded font-mono">{v}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <input 
                    type="text" 
                    placeholder="Attribute Type (e.g. Weight Grid)" 
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 text-xs rounded-xl"
                  />
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      placeholder="Values (comma separated)" 
                      value={newAttrValues}
                      onChange={(e) => setNewAttrValues(e.target.value)}
                      className="w-2/3 px-2.5 py-1 border border-slate-202 text-xs rounded-xl"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!newAttrName || !newAttrValues) return;
                        setAttributeList([...attributeList, { id: 'attr-' + Date.now(), name: newAttrName, type: 'Dynamic Custom Set', values: newAttrValues.split(',') }]);
                        setNewAttrName('');
                        setNewAttrValues('');
                      }}
                      className="w-1/3 bg-slate-900 text-white font-mono uppercase text-[9px] font-black rounded-xl"
                    >
                      Define
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </article>
      )}

      {/* ========================================================= */}
      {/* HUB SECTION 3: ORDERS, DEBIT REFUNDS & CLAIMS LOGS SHEET */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <article className="space-y-8 animate-fade-in" id="claims-control-workspace">
          
          {/* Order Search Filter & Manager */}
          <div className="bg-white border border-slate-200 rounded-[2.2rem] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Platform Unified Order & Escrow Ledger</h3>
                <p className="text-xs text-slate-405 mt-0.5 font-bold">Query system-wide sales records and dispatch tracking parameters.</p>
              </div>

              <div className="relative max-w-sm w-full font-bold">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Query buyer name or ID..."
                  value={orderQuerySearch}
                  onChange={(e) => setOrderQuerySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:bg-white transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto text-xs font-semibold text-slate-750">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase pb-1 tracking-widest">
                    <th className="py-2">Tx Identifier</th>
                    <th className="py-2">Date Stamp</th>
                    <th className="py-2">Client Buyer</th>
                    <th className="py-2">Commodity Item</th>
                    <th className="py-2 text-right">Escrow Sum</th>
                    <th className="py-2">Status Code</th>
                    <th className="py-2 text-right">Carrier Trac</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminOrders
                    .filter(o => o.buyer.toLowerCase().includes(orderQuerySearch.toLowerCase()) || o.id.includes(orderQuerySearch))
                    .map((o) => (
                      <tr key={o.id}>
                        <td className="py-3 font-mono font-bold text-slate-900">{o.id}</td>
                        <td className="py-3 font-mono text-slate-500">{o.date}</td>
                        <td className="py-3 text-slate-800">{o.buyer}</td>
                        <td className="py-3 text-slate-600 max-w-[150px] truncate">{o.item}</td>
                        <td className="py-3 text-right font-black text-slate-950 font-mono">${o.amount}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-xl text-[9px] font-mono font-black uppercase tracking-wide inline-block ${o.status === 'delivered' ? 'bg-emerald-50 text-emerald-800' : o.status === 'shipped' ? 'bg-indigo-50 text-indigo-850' : o.status === 'cancelled' ? 'bg-slate-100 text-slate-505' : 'bg-amber-50 text-amber-900 animate-pulse'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">{o.trackingNum || 'Null Carrier'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Refund Claims moderation */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Debenture Refund Requests</h3>
              <p className="text-xs text-slate-450">Authorize platform chargebacks safely according to escrow dispute conditions.</p>

              <div className="space-y-3.5 text-xs font-semibold">
                {refundClaims.map((claim) => (
                  <div key={claim.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-100/55 transition">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <strong className="text-slate-9 font-bold font-mono block">{claim.id}</strong>
                        <span className="text-[10px] text-indigo-650 font-mono">Linked order reference: {claim.orderId}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-mono font-bold ${claim.status === 'Waiting Review' ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                        {claim.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700 text-xs">
                      <span>Claimants Account: <strong>{claim.client}</strong></span>
                      <strong className="text-slate-900 font-mono text-indigo-650">${claim.claimedSum} claimed</strong>
                    </div>
                    
                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 leading-normal">
                      "{claim.explanation}"
                    </p>

                    {claim.status === 'Waiting Review' && (
                      <div className="flex gap-2 pt-1 justify-end">
                        <button
                          onClick={() => {
                            setRefundClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'Authorized & Sent' } : c));
                            alert(`Refund processing complete for ${claim.id}. Gateway cleared disbursement.`);
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase text-[9px] font-black rounded-lg transition animate-bounce"
                        >
                          Approve Refund Payout
                        </button>
                        <button
                          onClick={() => {
                            setRefundClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'Denied/Arbitrated' } : c));
                            alert(`Refund claim ${claim.id} disputed. Arbitrator assigned to review ticket log.`);
                          }}
                          className="px-2.5 py-1 bg-slate-205 hover:bg-slate-300 text-slate-700 font-mono text-[9px] uppercase font-bold rounded-lg transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Return Merchandise authorizations (RMA) */}
            <div className="bg-white border border-slate-202 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-905 uppercase">Returns & RMA Carrier Tracker</h3>
              <p className="text-xs text-slate-450 font-bold">Track the route process of physical returned goods back into vendor inventories.</p>

              <div className="space-y-3.5 text-xs font-semibold">
                {returnRequests.map((ret) => (
                  <div key={ret.id} className="p-4 bg-indigo-50/20 border border-indigo-100 rounded-xl space-y-2">
                    <div className="flex justify-between">
                      <strong className="text-indigo-850 font-mono font-bold block">{ret.id}</strong>
                      <span className="text-[10px] bg-indigo-100 text-indigo-850 px-2.5 py-0.5 rounded-lg font-mono font-black uppercase">
                        {ret.state}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-700">
                      <div>Commodity claim: <strong>{ret.product}</strong></div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>Initiated by: {ret.client}</span>
                        <span>Logistics: {ret.logisticCarrier}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 flex gap-1.5 justify-end border-t border-indigo-100/50">
                      <button
                        onClick={() => {
                          setReturnRequests(prev => prev.map(r => r.id === ret.id ? { ...r, state: 'Inventory Rec' } : r));
                          alert('Claim inventory confirmed returning to AuraTech depot warehouses. Release payout code authorized.');
                        }}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-white font-mono uppercase text-[9.5px] font-black rounded-lg transition-all"
                      >
                        Confirm Receipt at warehouse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </article>
      )}

      {/* ========================================================= */}
      {/* HUB SECTION 4: USER & SECURITY DIRECTORIES, ACCESS CONTROL */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <article className="space-y-8 animate-fade-in" id="users-access-control">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* User directories management */}
            <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Verified User Database Registry</h3>
              
              <div className="space-y-3 text-xs">
                {userRoster.map((item) => (
                  <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold font-sans">{item.name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      </div>
                      <p className="text-slate-450 text-[10.5px] font-mono leading-none">{item.email}</p>
                      <div className="flex gap-2 text-[9px] font-bold font-mono">
                        <span className="text-slate-500">{item.purchasesCount} historical purchases</span>
                        <span className="text-indigo-650 bg-indigo-50 px-1 py-0.5 rounded">{item.rank}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono uppercase font-black tracking-wider ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleToggleUserStatus(item.id)}
                        className={`p-1.5 hover:bg-slate-200 rounded-lg transition ${item.status === 'Active' ? 'text-rose-600' : 'text-emerald-650'}`}
                        title={item.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        <Sliders size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merchant directory lists (Approve / Suspension handles) */}
            <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Licensed Merchant Roster</h3>
              
              <div className="space-y-3 text-xs font-semibold">
                {localSellers.map((sell) => (
                  <div key={sell.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={sell.logo} className="w-10 h-10 rounded-xl object-cover bg-slate-200" referrerPolicy="no-referrer" />
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 font-bold block">{sell.name}</strong>
                        <span className="text-[10px] text-slate-405 font-mono">{sell.email}</span>
                        <div className="flex gap-1.5 text-[9px] font-mono">
                          <span>Hold Delay: {paymentSettings.nexaEscrowHoldPeriodDays} days</span>
                          <span className="text-indigo-650">Comm rate: {(sell.commissionRate * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sell.status === 'pending' ? (
                        <button
                          onClick={() => approveVendorPartner(sell.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono uppercase text-[9px] font-black rounded-lg transition"
                        >
                          Verify & Approve
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono tracking-wider font-extrabold uppercase ${sell.status === 'active' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                            {sell.status}
                          </span>
                          <button
                            onClick={() => {
                              onRejectSeller(sell.id);
                              alert(`Merchant ${sell.name} has been placed in suspends state. Custom route checks deactivated.`);
                            }}
                            className="p-1 text-slate-450 hover:text-rose-650 transition"
                            title="Suspend/Restrict Merchant"
                          >
                            <Lock size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Role Based Access Control & Staff directory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Role-Based Access Control Protocols & Staff Accounts</h3>
              <p className="text-xs text-slate-455 font-bold">Declare target access parameters, authorize keys for support coordinators.</p>

              <div className="space-y-3 pt-2">
                {staffAccounts.map((staff) => (
                  <div key={staff.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{staff.name}</strong>
                        <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-black">{staff.role}</span>
                      </div>
                      <p className="text-slate-450 text-[10.5px] font-mono">{staff.email}</p>
                      
                      {/* Permission Badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {staff.permissions.map((perm, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-850 px-1.5 py-0.5 text-[9px] rounded font-mono">{perm}</span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStaffAccounts(prev => prev.filter(s => s.id !== staff.id));
                        alert(`Administrative keychain revoked for ${staff.name}.`);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                      title="Revoke Permission Clearances"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Security staff creation wizard */}
              <form onSubmit={handleAddSecurityStaff} className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Staff Representative Name..."
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="px-3 py-2 border border-slate-205 text-xs rounded-xl font-bold"
                />
                <input
                  type="email"
                  required
                  placeholder="name@shopnexa.com"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="px-3 py-2 border border-slate-205 text-xs rounded-xl font-bold"
                />
                <div className="flex gap-2">
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="px-2 py-1.5 border border-slate-205 text-xs rounded-xl font-black w-2/3"
                  >
                    <option>Support Moderator</option>
                    <option>Finance Auditor</option>
                    <option>SecDaemon Expert</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-850 text-white font-mono uppercase text-[9.5px] font-black rounded-xl w-1/3 transition"
                  >
                    Assign Keys
                  </button>
                </div>
              </form>
            </div>

            {/* Platform Audit Logs Segment */}
            <div className="lg:col-span-4 bg-slate-950 text-slate-100 rounded-[2.2rem] p-6 shadow-sm border border-slate-800 space-y-4">
              <div className="pb-2 border-b border-slate-850 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">Internal Security Daemon Logs</span>
                <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider">Audit logs Searcher</h3>
              </div>

              {/* Log Query input */}
              <input
                type="text"
                placeholder="Query operator activity log..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-white placeholder-slate-500 font-mono"
              />

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {auditLogs
                  .filter(log => log.operator.toLowerCase().includes(auditSearchQuery.toLowerCase()) || log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()))
                  .map((log) => (
                    <div key={log.id} className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between text-zinc-400 text-[9px]">
                        <span>Timestamp: {log.timestamp}</span>
                        <span className={`px-1.5 py-0.25 rounded uppercase ${log.severity === 'critical' ? 'bg-red-900/60 text-red-300' : 'bg-slate-800 text-zinc-300'}`}>
                          {log.severity}
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed">
                        <strong className="text-zinc-200">{log.operator}</strong>: {log.action}
                      </p>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Node IP: {log.ip}</span>
                        <span>Track ID: {log.id}</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => alert('Structured JSON formatted platform security ledger compiled!')}
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-mono uppercase text-[9px] tracking-wider rounded-xl transition"
                >
                  Export Secure Compliance Log File
                </button>
              </div>
            </div>

          </div>

        </article>
      )}

      {/* ========================================================= */}
      {/* HUB SECTION 5: PROMOTIONS, BANNERS, LOYALTY, COUPONS SETS */}
      {/* ========================================================= */}
      {activeTab === 'promotions' && (
        <article className="space-y-8 animate-fade-in" id="marketing-reward-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Banner Layout settings */}
            <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-1000 uppercase">Banner Manager Layout Control</h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Publish storefront dynamic banners and adjust URL redirects on active hero carousels.
              </p>

              <div className="space-y-3.5 text-xs font-semibold">
                {heroBanners.map((ban) => (
                  <div key={ban.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${ban.active ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                    <div className="space-y-1">
                      <strong className="text-sm font-extrabold tracking-tight block leading-tight">{ban.headline}</strong>
                      <span className="text-[10px] text-indigo-400 block font-mono bg-indigo-950/40 p-1 rounded-md">{ban.discountNote}</span>
                      <span className="text-[9.5px] block font-mono text-zinc-400">Target path slug: {ban.targetUrl}</span>
                    </div>

                    <div className="flex flex-col gap-1 items-end shrink-0">
                      <span className={`text-[9px] uppercase font-bold font-mono ${ban.active ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {ban.active ? 'Running' : 'Offline'}
                      </span>
                      <button
                        onClick={() => {
                          setHeroBanners(prev => prev.map(b => b.id === ban.id ? { ...b, active: !b.active } : b));
                        }}
                        className={`px-2 py-1 text-[9px] font-bold rounded uppercase font-mono ${ban.active ? 'bg-slate-800 hover:bg-slate-750 text-white' : 'bg-indigo-650 hover:bg-indigo-700 text-white'}`}
                      >
                        {ban.active ? 'Deactivate' : 'Go Live'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Register Banner */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Create Banner</span>
                <input
                  type="text"
                  placeholder="Headline (e.g. 5x Points Event)..."
                  value={newBannerHeadline}
                  onChange={(e) => setNewBannerHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Sourcing URL (/products?keyword=X)..."
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    className="w-2/3 px-3 py-1.5 border border-slate-205 text-xs rounded-xl"
                  />
                  <button
                    onClick={() => {
                      if (!newBannerHeadline) return;
                      setHeroBanners([
                        ...heroBanners,
                        { id: 'ban-' + Date.now(), headline: newBannerHeadline, discountNote: 'Storewide flash checkouts pre-approved', targetUrl: newBannerUrl, active: true }
                      ]);
                      setNewBannerHeadline('');
                      setNewBannerUrl('');
                      alert('Storefront hero banner successfully queued!');
                    }}
                    className="w-1/3 bg-slate-900 text-white font-mono uppercase text-[9.5px] font-black rounded-xl transition"
                  >
                    Publish Slot
                  </button>
                </div>
              </div>
            </div>

            {/* Platform coupons dashboard */}
            <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Coupon Manager</h3>
              
              <div className="space-y-3 font-semibold text-xs text-slate-750">
                {couponsList.map((cp) => (
                  <div key={cp.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 hover:bg-slate-100/50 transition">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-extrabold font-mono text-sm tracking-tight">{cp.code}</strong>
                        <span className={`px-2 py-0.25 rounded text-[9.5px] font-mono font-black uppercase ${cp.type === 'percentage' ? 'bg-indigo-50 text-indigo-705' : 'bg-teal-50 text-teal-800'}`}>
                          {cp.type === 'percentage' ? `${cp.value}% Off` : `$${cp.value} Flat`}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[10.5px]">{cp.description}</p>
                      <span className="text-[9.5px] text-slate-405 block font-mono">Applicable min-cart: ${cp.minCart}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCouponsList(prev => prev.map(c => c.id === cp.id ? { ...c, active: !c.active } : c));
                        }}
                        className={`text-[9.5px] px-2 py-1.5 font-mono uppercase font-black rounded-lg transition-all ${cp.active ? 'bg-amber-50 text-amber-805 hover:bg-amber-100/50' : 'bg-slate-200 text-slate-650 hover:bg-slate-300'}`}
                      >
                        {cp.active ? 'Pause Promo' : 'Resume Code'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic coupon creation form */}
              <form onSubmit={handleCreateCoupon} className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="CODEID (e.g. SAVE30)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-205 text-xs rounded-xl font-bold font-mono uppercase"
                />
                <input
                  type="number"
                  required
                  placeholder="Discount magnitude..."
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-205 text-xs rounded-xl"
                />
                <div className="flex gap-1.5">
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="px-1 py-1.5 border border-slate-205 text-xs rounded-xl font-bold w-1/2"
                  >
                    <option value="percentage">Percent %</option>
                    <option value="flat">Flat USD ($)</option>
                  </select>
                  <button
                    type="submit"
                    className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-mono uppercase text-[9.5px] font-black rounded-xl transition"
                  >
                    Insert Code
                  </button>
                </div>
              </form>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Loyalty point config slots */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Loyalty reward Manager</h3>
              
              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-slate-450 font-mono tracking-wider">Point Multiplier (Earn standard per $1)</label>
                  <input
                    type="number"
                    value={loyaltyRules.pointEarnMultiplier}
                    onChange={(e) => setLoyaltyRules({ ...loyaltyRules, pointEarnMultiplier: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-slate-450 font-mono tracking-wider">Redemption Threshold (Pts to equal $1 USD)</label>
                  <input
                    type="number"
                    value={loyaltyRules.redemptionRateUSD}
                    onChange={(e) => setLoyaltyRules({ ...loyaltyRules, redemptionRateUSD: parseInt(e.target.value) || 100 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-slate-450 font-mono tracking-wider">Silver to Gold Points tier minimum</label>
                  <input
                    type="number"
                    value={loyaltyRules.goldTierMinPoints}
                    onChange={(e) => setLoyaltyRules({ ...loyaltyRules, goldTierMinPoints: parseInt(e.target.value) || 5000 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-202 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-slate-450 font-mono tracking-wider">Bonus Promo Focus category</label>
                  <select
                    value={loyaltyRules.doubleRewardsCategory}
                    onChange={(e) => setLoyaltyRules({ ...loyaltyRules, doubleRewardsCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-202 rounded-xl"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Premium Fashion</option>
                    <option value="home">Smart Living</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Loyalty matrix updated. Automatic customer tier transitions will compute at next cron scheduler cycle.')}
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-mono uppercase text-[9.5px] font-black rounded-xl transition"
                >
                  Save Loyalty Rules Sheet
                </button>
              </div>
            </div>

            {/* Gift Card Manager */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Gift Card system</h3>
              
              <div className="space-y-3.5 text-xs font-semibold">
                {giftCards.map((card) => (
                  <div key={card.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-100/50 transition">
                    <div className="flex justify-between font-mono">
                      <strong className="text-indigo-850 font-bold block">{card.code}</strong>
                      <span className="text-emerald-750 font-black">${card.currentBalance} left</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Owner: {card.assignedUser}</span>
                      <span>Expires: {card.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider font-mono block">Issue Gift Voucher Code</span>
                <input
                  type="text"
                  placeholder="Target Client Email..."
                  value={newGiftUser}
                  onChange={(e) => setNewGiftUser(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-205 text-xs rounded-xl"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Balance Amount ($)"
                    value={newGiftVal}
                    onChange={(e) => setNewGiftVal(e.target.value)}
                    className="w-2/3 px-3 py-1.5 border border-slate-205 text-xs rounded-xl"
                  />
                  <button
                    onClick={() => {
                      if (!newGiftUser) return;
                      const gen = 'NEXA-GFT-' + Math.floor(1000 + Math.random() * 9000);
                      setGiftCards([
                        ...giftCards,
                        { id: 'GFT-' + Date.now(), code: gen, initialBalance: parseFloat(newGiftVal) || 100, currentBalance: parseFloat(newGiftVal) || 100, assignedUser: newGiftUser, expiry: '2027-12-31' }
                      ]);
                      setNewGiftUser('');
                      alert(`Gift Voucher ${gen} dispatched securely to ${newGiftUser}`);
                    }}
                    className="w-1/3 bg-slate-900 text-white font-mono uppercase text-[9px] font-black rounded-xl"
                  >
                    Issue
                  </button>
                </div>
              </div>
            </div>

            {/* Referral channel metrics */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Referral Marketing optimizer</h3>
              
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-3 font-semibold">
                <div className="flex justify-between">
                  <span>Reward to Inviter (USD balance credit):</span>
                  <input
                    type="number"
                    value={referralParams.referrerBonusUSD}
                    onChange={(e) => setReferralParams({ ...referralParams, referrerBonusUSD: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1.5 py-0.5 text-right font-mono border rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Sign-up bonus to Invitee:</span>
                  <input
                    type="number"
                    value={referralParams.inviteeBonusUSD}
                    onChange={(e) => setReferralParams({ ...referralParams, inviteeBonusUSD: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-1.5 py-0.5 text-right font-mono border rounded"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-450 border-t border-slate-100/50 pt-2 font-mono">
                  <span>Outstanding referral links:</span>
                  <strong>{referralParams.activeLinksCount} active links</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('New referral balance structures committed live to transaction gateways.')}
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-mono uppercase text-[9.5px] font-black rounded-xl transition"
              >
                Apply Referral Margins
              </button>
            </div>

          </div>

        </article>
      )}

      {/* ========================================================= */}
      {/* HUB SECTION 6: DISCUSSION REVIEW MODERATION & CLIENT Q&A */}
      {/* ========================================================= */}
      {activeTab === 'moderation' && (
        <article className="space-y-8 animate-fade-in" id="moderation-workspace">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Review Moderation and response replies */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Interactive Reviews Moderation Sheet</h3>
              <p className="text-xs text-slate-450 font-bold">Approve incoming reviews or flag profane contributions.</p>

              <div className="space-y-4 text-xs font-semibold">
                {reviewsModeration.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-100/50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-slate-900 block font-sans">{rev.author}</strong>
                        <span className="text-[10px] text-indigo-650 font-mono">Product item: {rev.item}</span>
                      </div>
                      
                      <div className="flex gap-1.5 shrink-0">
                        <span className="text-amber-500 font-mono">{rev.rating}⭐</span>
                        <span className={`px-2 py-0.25 rounded text-[9px] font-mono font-black uppercase ${rev.status === 'approved' ? 'bg-emerald-50 text-emerald-850' : 'bg-amber-55/40 text-amber-900'}`}>
                          {rev.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium italic bg-white p-2 rounded border border-slate-105/60 leading-normal">
                      "{rev.text}"
                    </p>

                    {rev.status === 'pending' && (
                      <div className="pt-2 flex gap-1.5 justify-end border-t border-slate-100/40">
                        <button
                          onClick={() => {
                            setReviewsModeration(prev => prev.map(r => r.id === rev.id ? { ...r, status: 'approved' } : r));
                            alert('Review approved for global catalog access.');
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-750 text-white font-mono uppercase text-[9.5px] font-black rounded-lg transition"
                        >
                          Approve Review
                        </button>
                        <button
                          onClick={() => {
                            setReviewsModeration(prev => prev.filter(r => r.id !== rev.id));
                            alert('Review flagged and released from directories.');
                          }}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 font-mono uppercase text-[9.5px] font-bold rounded-lg transition"
                        >
                          Flag & Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Product Q&As */}
            <div className="lg:col-span-6 bg-white border border-slate-202 rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Product Q&A Answers & Moderation</h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Provide platform-certified replies to buyer questions instantly or sync draft seller responses.
              </p>

              <div className="space-y-4 text-xs font-semibold">
                {questionsModeration.map((qa) => (
                  <div key={qa.id} className="p-4 bg-indigo-50/20 border border-indigo-100 rounded-xl space-y-2">
                    <div className="flex justify-between text-indigo-900">
                      <span>Question by: <strong>{qa.clientName}</strong></span>
                      <span className="text-[10px] font-mono uppercase font-black uppercase text-indigo-650">{qa.status}</span>
                    </div>
                    
                    <p className="text-xs text-slate-700 font-extrabold italic">
                      "Q: {qa.queryText} on item {qa.product}"
                    </p>

                    {qa.status === 'unresolved' ? (
                      <div className="space-y-2 pt-2 border-t border-indigo-100/50">
                        <textarea
                          placeholder="Draft administrative certified answer..."
                          value={qaDraftAnswer}
                          onChange={(e) => setQaDraftAnswer(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-205 rounded-xl text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!qaDraftAnswer) return;
                              setQuestionsModeration(prev => prev.map(q => q.id === qa.id ? { ...q, staffResponse: qaDraftAnswer, status: 'resolved' } : q));
                              setQaDraftAnswer('');
                              alert('Your reply has been queued live into user-viewable product FAQ sections!');
                            }}
                            className="px-3.5 py-1.5 bg-indigo-655 hover:bg-indigo-700 text-white font-mono uppercase text-[9.5px] font-black rounded-lg transition"
                          >
                            Publish certified reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-xs leading-normal font-sans border border-emerald-100">
                        <strong className="block text-[9.5px] uppercase font-mono tracking-wider">Certified Staff Answer:</strong>
                        "{qa.staffResponse}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </article>
      )}

      {/* ========================================================= */}
      {/* HUB SECTION 7: DETAILED SYSTEM localization, TAX & SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <article className="space-y-8 animate-fade-in" id="localization-settings">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Payment, shipping, and tax policies settings */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.2rem] p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase">Platform Sourcing & Localization Constants</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-semibold text-slate-700 border-b border-slate-100 pb-5">
                {/* Payments API Config */}
                <div className="space-y-3.5 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-1 text-slate-900 border-b border-slate-200/50 pb-1.5">
                    <CreditCard size={13} className="text-indigo-600" />
                    <strong className="text-xs uppercase tracking-tight">Payments Setup</strong>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={paymentSettings.stripeEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                      />
                      <span>Sandbox Stripe Gateway</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={paymentSettings.stripeMockFallback}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeMockFallback: e.target.checked })}
                      />
                      <span>Escrow Multi-Routing</span>
                    </label>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-450 uppercase font-mono">Escrow Release Lag</span>
                      <input
                        type="number"
                        value={paymentSettings.nexaEscrowHoldPeriodDays}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, nexaEscrowHoldPeriodDays: parseInt(e.target.value) || 7 })}
                        className="w-full px-2 py-1 bg-white border rounded font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping logistics rates */}
                <div className="space-y-3.5 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-1 text-slate-900 border-b border-slate-200/50 pb-1.5">
                    <Truck size={13} className="text-rose-650" />
                    <strong className="text-xs uppercase tracking-tight">Logistics Margins</strong>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono text-slate-450 block uppercase">Ground Rate ($)</span>
                      <input
                        type="number"
                        value={shippingSettings.flatRateGroundUSD}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, flatRateGroundUSD: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-0.5 border rounded font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono text-slate-450 block uppercase">Free Settle Min ($)</span>
                      <input
                        type="number"
                        value={shippingSettings.freeShippingThresholdUSD}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThresholdUSD: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-0.5 border rounded font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax codes matrices */}
                <div className="space-y-3.5 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-1 text-slate-900 border-b border-slate-200/50 pb-1.5">
                    <Sliders size={13} className="text-emerald-650" />
                    <strong className="text-xs uppercase tracking-tight">GST/HST Tax Setup</strong>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono text-slate-450 block uppercase">Standard GST %</span>
                      <input
                        type="number"
                        value={taxSettings.defaultTaxGSTRatePercentage}
                        onChange={(e) => setTaxSettings({ ...taxSettings, defaultTaxGSTRatePercentage: parseInt(e.target.value) || 18 })}
                        className="w-full px-2 py-0.5 border rounded font-mono"
                      />
                    </div>
                    <label className="flex items-center gap-1 text-[10px] mt-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={taxSettings.autoMailTaxInvoices}
                        onChange={(e) => setTaxSettings({ ...taxSettings, autoMailTaxInvoices: e.target.checked })}
                      />
                      <span>Email Tax Invoices</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic CMS Page visual markdown compiler */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-indigo-650 tracking-wider font-mono block">Dynamic CMS Page Editor</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left - Page Links List */}
                  <div className="space-y-2">
                    {cmsPages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => { setActiveCmsId(page.id); setCmsDraftContent(page.content); }}
                        className={`w-full p-3 border rounded-xl text-left block transition font-bold ${activeCmsId === page.id ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/50'}`}
                      >
                        <div className="flex justify-between text-[11px] text-slate-450 font-mono mb-1">
                          <span>Route: {page.path}</span>
                          <span>Edited: {page.lastModified}</span>
                        </div>
                        <span className="text-xs font-black block">{page.pageTitle}</span>
                      </button>
                    ))}
                  </div>

                  {/* Right - Plaintext markup editor */}
                  <div className="space-y-3">
                    {activeCmsId !== null ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={cmsDraftContent}
                          onChange={(e) => setCmsDraftContent(e.target.value)}
                          className="w-full p-2 bg-slate-50 border rounded-xl font-mono text-xs whitespace-pre-wrap"
                        />
                        <div className="flex gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={handleTriggerCmsDraftSave}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-755 text-white font-mono uppercase text-[9px] font-black rounded-lg transition"
                          >
                            Commit page revision
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-6 border rounded-xl flex items-center justify-center text-center text-xs text-slate-400 italic">
                        Select a Page from the CMS directory on the left to activate editing capabilities in this module.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Languages and currency list selectors */}
              <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Supported Checkout Languages</span>
                  <div className="space-y-1.5 mt-2">
                    {localizationConfig.languages.map((lang, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 border border-slate-100/60 rounded-xl font-semibold">
                        <span>{lang.name}</span>
                        <span className="text-[9.5px] text-slate-450 font-mono">Locale: {lang.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Exchange Currency Multipliers</span>
                  <div className="space-y-1.5 mt-2">
                    {localizationConfig.currencies.map((curr, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 border border-slate-100/60 rounded-xl font-semibold">
                        <span>Base Currency: <strong>{curr.code} ({curr.symbol})</strong></span>
                        <strong className="text-slate-900 font-mono">Multiplier: x{curr.rateMultiplier}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* General Commit parameters */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Platform localized constants secured cleanly inside local states.')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono uppercase text-[10px] font-black rounded-xl transition"
                >
                  Save Global System Configurations
                </button>
              </div>

            </div>

            {/* SEO metadata optimizer card and browser preview */}
            <div className="lg:col-span-4 space-y-8">
              
              <div className="bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-sm space-y-4">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase">Search Engine Optimization (SEO)</h3>
                </div>

                <div className="space-y-3.5 text-xs font-bold text-slate-700">
                  <div className="space-y-1">
                    <label className="block text-[9.5px] uppercase font-mono text-slate-400">Google SERP Meta Title</label>
                    <input
                      type="text"
                      value={seoConfig.homepageMetaTitle}
                      onChange={(e) => setSeoConfig({ ...seoConfig, homepageMetaTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-205 rounded-xl font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9.5px] uppercase font-mono text-slate-400">Crawler Page Description Meta</label>
                    <textarea
                      rows={3}
                      value={seoConfig.homepageMetaDesc}
                      onChange={(e) => setSeoConfig({ ...seoConfig, homepageMetaDesc: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-205 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9.5px] uppercase font-mono text-slate-400">Indexing Match Phrases (Keywords)</label>
                    <input
                      type="text"
                      value={seoConfig.metaKeywords}
                      onChange={(e) => setSeoConfig({ ...seoConfig, metaKeywords: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-medium"
                    />
                  </div>

                  {/* Live Google Search Card preview widget */}
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-mono text-indigo-650 block">Search Result Card Render</span>
                    <strong className="text-blue-800 text-[13px] hover:underline cursor-pointer block leading-snug">{seoConfig.homepageMetaTitle}</strong>
                    <span className="text-emerald-700 text-[10.5px] font-mono block">https://shopnexa.com/portal/home</span>
                    <p className="text-[11.5px] text-slate-550 leading-relaxed font-sans font-medium">
                      {seoConfig.homepageMetaDesc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Structured JSON Index guidelines synchronized into index metadata headers.')}
                    className="w-full py-2.5 bg-slate-900 text-white font-mono uppercase text-[9px] font-black tracking-wider rounded-xl transition"
                  >
                    Transmit SEO parameters
                  </button>
                </div>
              </div>

              {/* Notification manager streams */}
              <div className="bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-sm space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-440 tracking-wider font-mono block text-slate-400">System Notification Streams</span>
                
                <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
                  {notificationRules.map((stream) => (
                    <div key={stream.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-100/50 transition">
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-slate-905">{stream.name}</strong>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={stream.enabled}
                            onChange={() => {
                              setNotificationRules(prev => prev.map(n => n.id === stream.id ? { ...n, enabled: !n.enabled } : n));
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-8 h-4 rounded-full transition-colors relative ${stream.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${stream.enabled ? 'right-0.5' : 'left-0.5'}`} />
                          </div>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {stream.channels.map((chan, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 text-[9px] px-1.5 py-0.25 rounded font-mono">{chan}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </article>
      )}

    </div>
  );
};
