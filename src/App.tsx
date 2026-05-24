import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginModal } from './components/LoginModal';

import { HomeView } from './views/HomeView';
import { ProductListingView } from './views/ProductListingView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { UserDashboardView } from './views/UserDashboardView';
import { SellerDashboardView } from './views/SellerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { HelpCenterView } from './views/HelpCenterView';
import { TermsOfServiceView, PrivacyPolicyView, RefundPolicyView } from './views/PolicyViews';
import { SocialHubView } from './views/SocialHubView';
import { GamificationView } from './views/GamificationView';
import { AIPanelWidget } from './components/AIPanelWidget';

import { Product, CartItem, Order, Seller, Category } from './types';
import { products as initialProducts, sellers as initialSellers, categories, defaultOrders } from './data';
import { Shield, Sparkles, UserCheck } from 'lucide-react';

export default function App() {
  // Routing State
  const [currentView, setCurrentView] = useState<string>('home');
  const [navigationExtra, setNavigationExtra] = useState<any>(null);

  // Core Authorized User Session State
  // Initialized to Prem Kumar (Verified Buyer) so dashboards populate instantly for demonstration.
  const [user, setUser] = useState<{ name: string; email: string; role: 'buyer' | 'seller' | 'admin' } | null>({
    name: 'Prem Kumar',
    email: 'customer@shopnexa.com',
    role: 'buyer'
  });

  // Stateful Data Pools for Interactive Cycles
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [sellersList, setSellersList] = useState<Seller[]>(initialSellers);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  
  // UI State toggles
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Navigation controller with page displacement triggers
  const handleNavigate = (view: string, extra?: any) => {
    setCurrentView(view);
    setNavigationExtra(extra || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedSpec?: string) => {
    const specOption = selectedSpec || (product.category === 'fashion' ? 'Tan Brown Theme' : 'Standard Space Grey');
    const itemId = `${product.id}-${specOption}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { id: itemId, product, quantity, selectedSpec: specOption }];
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (code: string) => {
    if (code === 'NEXA25') {
      setAppliedPromo('NEXA25');
      return true;
    }
    return false;
  };

  // Transaction order placement callback
  const handlePlaceOrder = (
    shippingAddress: { fullName: string; street: string; city: string; state: string; zip: string },
    paymentMethod: string
  ) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = appliedPromo === 'NEXA25' ? subtotal * 0.25 : 0;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const finalTotal = subtotal - discount + shipping;

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      items: cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
        sellerId: item.product.sellerId,
      })),
      total: finalTotal,
      status: 'pending',
      shippingAddress,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // Clear completed cart
  };

  // Seller Dashboard: Adding custom product
  const handleAddProduct = (newProd: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
    const customId = 'p' + (productsList.length + 1);
    
    // Match current vendor identity or default to preloaded AuraTech
    const activeSellerId = user?.role === 'seller' ? 'v1' : 'v1';
    const activeSellerName = user?.role === 'seller' ? user.name : 'AuraTech Officials';

    const fullProduct: Product = {
      ...newProd,
      id: customId,
      sellerId: activeSellerId,
      sellerName: activeSellerName,
      rating: 5.0,
      ratingCount: 1,
    };

    setProductsList((prev) => [fullProduct, ...prev]);
  };

  // Admin Dashboard: Approve / Reject Actions on Sellers
  const handleApproveSeller = (id: string) => {
    setSellersList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'active', isApproved: true } : v))
    );
  };

  const handleRejectSeller = (id: string) => {
    setSellersList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'suspended', isApproved: false } : v))
    );
  };

  // Quick Demo account preset switcher to walk through Portal systems
  const triggerPresetRole = (role: 'buyer' | 'seller' | 'admin') => {
    if (role === 'buyer') {
      setUser({ name: 'Prem Kumar', email: 'customer@shopnexa.com', role: 'buyer' });
      handleNavigate('user-dashboard');
    } else if (role === 'seller') {
      setUser({ name: 'AuraTech Officials', email: 'contact@auratech.io', role: 'seller' });
      handleNavigate('seller-dashboard');
    } else {
      setUser({ name: 'ShopNexa Platform Admin', email: 'admin@shopnexa.com', role: 'admin' });
      handleNavigate('admin-dashboard');
    }
  };

  const activeCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans" id="shopnexa-marketplace-app">
      {/* Dynamic Header */}
      <Header
        categories={categories}
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={activeCartCount}
        user={user}
        onLogout={() => {
          setUser(null);
          handleNavigate('home');
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Responsive Canvas container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 py-8 pb-24 md:pb-12">
        {currentView === 'home' && (
          <HomeView
            products={productsList}
            categories={categories}
            sellers={sellersList}
            onNavigate={handleNavigate}
            onAddToCart={(p) => {
              handleAddToCart(p, 1);
              handleNavigate('cart');
            }}
          />
        )}

        {currentView === 'products' && (
          <ProductListingView
            products={productsList}
            categories={categories}
            initialFilters={navigationExtra || {}}
            onNavigate={handleNavigate}
            onAddToCart={(p) => {
              handleAddToCart(p, 1);
              handleNavigate('cart');
            }}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailView
            productId={navigationExtra?.id || 'p1'}
            products={productsList}
            onNavigate={handleNavigate}
            onAddToCart={(p, q, s) => {
              handleAddToCart(p, q, s);
              handleNavigate('cart');
            }}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigate={handleNavigate}
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromo}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            appliedPromo={appliedPromo}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'user-dashboard' && (
          <UserDashboardView
            orders={orders}
            onNavigate={handleNavigate}
            user={user}
          />
        )}

        {currentView === 'seller-dashboard' && (
          <SellerDashboardView
            products={productsList}
            seller={sellersList[0]} // Show first preloaded seller for simulation
            onAddProduct={handleAddProduct}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView
            products={productsList}
            sellers={sellersList}
            onApproveSeller={handleApproveSeller}
            onRejectSeller={handleRejectSeller}
          />
        )}

        {currentView === 'help-center' && (
          <HelpCenterView onNavigate={handleNavigate} />
        )}

        {currentView === 'social' && (
          <SocialHubView
            products={productsList}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            user={user}
          />
        )}

        {currentView === 'rewards' && (
          <GamificationView
            products={productsList}
            onNavigate={handleNavigate}
            user={user}
          />
        )}

        {currentView === 'terms' && <TermsOfServiceView onNavigate={handleNavigate} />}
        {currentView === 'privacy' && <PrivacyPolicyView onNavigate={handleNavigate} />}
        {currentView === 'refunds' && <RefundPolicyView onNavigate={handleNavigate} />}
      </main>

      {/* Sticky Demo Quick Portal Presets Bar */}
      <div 
        className="fixed bottom-20 sm:bottom-6 left-4 sm:left-auto sm:right-32 z-40 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 animate-fade-in"
        id="demo-preset-widgets"
      >
        <div className="flex items-center gap-1.5 text-slate-400">
          <UserCheck size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Role Switcher:</span>
        </div>
        
        <div className="flex gap-1.5">
          <button
            onClick={() => triggerPresetRole('buyer')}
            className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wide transition-all ${user?.role === 'buyer' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-350'}`}
            title="Switch to Prem Kumar (Buyer)"
          >
            Buyer
          </button>
          <button
            onClick={() => triggerPresetRole('seller')}
            className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wide transition-all ${user?.role === 'seller' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-705 text-slate-350'}`}
            title="Switch to AuraTech (Seller)"
          >
            Seller
          </button>
          <button
            onClick={() => triggerPresetRole('admin')}
            className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wide transition-all ${user?.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-350'}`}
            title="Switch to Administrator"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Footer component */}
      <Footer onNavigate={handleNavigate} onOpenLogin={() => setIsLoginModalOpen(true)} />

      {/* Mobile view bottom actions sticky rail */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={activeCartCount}
        userRole={user?.role}
      />

      {/* Interactive global Login modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(authorizedUser) => {
          setUser(authorizedUser);
          if (authorizedUser.role === 'admin') handleNavigate('admin-dashboard');
          else if (authorizedUser.role === 'seller') handleNavigate('seller-dashboard');
          else handleNavigate('user-dashboard');
        }}
      />

      {/* Floating AI Companion Widget */}
      <AIPanelWidget
        products={productsList}
        onNavigate={handleNavigate}
        onAddToCart={(p, qty, spec) => handleAddToCart(p, qty || 1, spec)}
        user={user}
      />
    </div>
  );
}
