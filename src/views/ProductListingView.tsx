import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, SlidersHorizontal, Grid, Star, ShoppingCart, RefreshCw, X, 
  ChevronDown, ChevronUp, Heart, Eye, ArrowLeftRight, Check, List, 
  Sparkles, Truck, BadgePercent, ShieldCheck, CheckSquare, Square,
  ShoppingBag, Trash2, Sliders, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { Product, Category } from '../types';

interface ProductListingViewProps {
  products: Product[];
  categories: Category[];
  initialFilters?: { category?: string; search?: string; seller?: string; filter?: string };
  onNavigate: (view: string, extra?: any) => void;
  onAddToCart: (product: Product) => void;
}

// 1. Definition of Enriched Product Attributes
interface EnrichedProduct extends Product {
  color: string;
  size: string;
  material: string;
  deliverySpeed: 'Same Day' | 'Express (1-2 days)' | 'Standard (3-5 days)';
  cod: boolean;
  returnable: boolean;
  freeDelivery: boolean;
  warranty: string;
  offers: string;
  discountPercent: number;
  isNew: boolean;
}

export const ProductListingView: React.FC<ProductListingViewProps> = ({
  products,
  categories,
  initialFilters,
  onNavigate,
  onAddToCart,
}) => {
  // --- 2. STATE DECLARATIONS ---
  // Basic states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<number>(300);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Advanced filters state
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [selectedDiscount, setSelectedDiscount] = useState<number | 'all'>('all');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedDeliverySpeeds, setSelectedDeliverySpeeds] = useState<string[]>([]);
  const [selectedWarranties, setSelectedWarranties] = useState<string[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  
  // Booleans
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [requireCod, setRequireCod] = useState<boolean>(false);
  const [requireReturnable, setRequireReturnable] = useState<boolean>(false);
  const [requireFreeDelivery, setRequireFreeDelivery] = useState<boolean>(false);

  // Layout UI states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<EnrichedProduct | null>(null);
  const [compareProductIds, setCompareProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('compare_product_ids');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [heartedIds, setHeartedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexa_hearted_pids');
    return saved ? JSON.parse(saved) : [];
  });

  // Collapsible Sidebar Sections
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    price: false,
    rating: false,
    discount: false,
    brand: false,
    color: true,
    size: true,
    material: true,
    badges: false,
    shipping: true,
    warranty: true,
    offers: true,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // --- 3. HARVEST & SYNC INITIAL FILTERS ---
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.category) {
        setSelectedCategory(initialFilters.category);
      }
      if (initialFilters.search) {
        setSearchQuery(initialFilters.search);
      }
      if (initialFilters.seller) {
        setSelectedSellers([initialFilters.seller]);
      }
      if (initialFilters.filter === 'featured') {
        setSortBy('rating');
      }
      setCurrentPage(1);
    }
  }, [initialFilters]);

  // Persists local states
  useEffect(() => {
    localStorage.setItem('compare_product_ids', JSON.stringify(compareProductIds));
  }, [compareProductIds]);

  useEffect(() => {
    localStorage.setItem('nexa_hearted_pids', JSON.stringify(heartedIds));
  }, [heartedIds]);

  // Handle beautiful loading shim on filter shifts
  const triggerFilterChange = () => {
    setIsLoadingPage(true);
    setCurrentPage(1);
    const timeOut = setTimeout(() => {
      setIsLoadingPage(false);
    }, 450);
    return () => clearTimeout(timeOut);
  };

  // Run loading animation on filters changes
  useEffect(() => {
    triggerFilterChange();
  }, [
    selectedCategory, searchQuery, selectedSellers, sortBy, priceRange,
    selectedColors, selectedSizes, selectedMaterials, selectedRating,
    selectedDiscount, selectedDeliverySpeeds, onlyInStock, requireCod,
    requireReturnable, requireFreeDelivery, selectedWarranties, selectedOffers
  ]);

  const toggleSection = (sect: string) => {
    setCollapsedSections(prev => ({ ...prev, [sect]: !prev[sect] }));
  };

  // --- 4. DYNAMIC ENRICHMENT LOGIC ---
  const enrichedProductsList: EnrichedProduct[] = products.map((prod, index) => {
    // Deterministic static mappings to guarantee high-fidelity interactivity
    const colors = ['Cosmic Black', 'Slate Blue', 'Ash Gray', 'Off-White', 'Crimson Red'];
    const materials = ['Aluminium', 'Organic Cashmere', 'Silicon', 'Full-Grain Leather', 'Ceramic'];
    const deliverySpeeds: ('Same Day' | 'Express (1-2 days)' | 'Standard (3-5 days)')[] = [
      'Same Day',
      'Express (1-2 days)',
      'Standard (3-5 days)'
    ];
    const warranties = ['No Warranty', '1 Year Brand Warranty', '2 Year Platinum Protection'];
    const offersList = [
      'Flat 25% Off',
      'Buy 1 Get 1 Free',
      'No-Cost EMI available'
    ];

    const colorIdx = Math.abs(prod.id.charCodeAt(prod.id.length - 1) || 0) % colors.length;
    const materialIdx = Math.abs(prod.id.charCodeAt(0) || 0) % materials.length;
    const deliveryIdx = (index + 2) % deliverySpeeds.length;
    const warrantyIdx = (index + (prod.category === 'electronics' ? 2 : 1)) % warranties.length;
    const offerIdx = index % offersList.length;

    const discountPercent = prod.originalPrice > prod.price 
      ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
      : Math.floor(10 + (index * 7.5) % 45); // deterministic 10% to 55%

    const derivedMRP = prod.originalPrice > prod.price
      ? prod.originalPrice
      : Math.round(prod.price * (1 + discountPercent/100) * 100) / 100;

    let sizes = ['Standard'];
    if (prod.category === 'fashion') {
      sizes = ['S', 'M', 'L', 'XL'];
    } else if (prod.category === 'electronics' || prod.category === 'smart-home') {
      sizes = ['Standard Specs', 'Pro Specs'];
    }

    return {
      ...prod,
      originalPrice: derivedMRP,
      color: colors[colorIdx],
      size: sizes[index % sizes.length],
      material: materials[materialIdx],
      deliverySpeed: deliverySpeeds[deliveryIdx],
      cod: index % 2 === 0,
      returnable: prod.id !== 'p5' && prod.id !== 'p10',
      freeDelivery: prod.price >= 49,
      warranty: warranties[warrantyIdx],
      offers: offersList[offerIdx],
      discountPercent,
      isNew: index % 3 === 0
    };
  });

  // Extract unique filter assets dynamically
  const uniqueSellersMap = Array.from(new Set(products.map(p => JSON.stringify({ id: p.sellerId, name: p.sellerName })))) as string[];
  const sellersList = uniqueSellersMap.map(s => JSON.parse(s)) as { id: string; name: string }[];
  
  const allAvailableColors = ['Cosmic Black', 'Slate Blue', 'Ash Gray', 'Off-White', 'Crimson Red'];
  const allAvailableSizes = ['S', 'M', 'L', 'XL', 'Standard Specs', 'Pro Specs', 'Standard'];
  const allAvailableMaterials = ['Aluminium', 'Organic Cashmere', 'Silicon', 'Full-Grain Leather', 'Ceramic'];
  const allAvailableDeliverySpeeds = ['Same Day', 'Express (1-2 days)', 'Standard (3-5 days)'];
  const allAvailableWarranties = ['No Warranty', '1 Year Brand Warranty', '2 Year Platinum Protection'];
  const allAvailableOffers = ['Flat 25% Off', 'Buy 1 Get 1 Free', 'No-Cost EMI available'];

  // Toggle helpers
  const handleToggleSeller = (id: string) => {
    setSelectedSellers(curr => 
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectedColors(curr =>
      curr.includes(color) ? curr.filter(x => x !== color) : [...curr, color]
    );
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes(curr =>
      curr.includes(size) ? curr.filter(x => x !== size) : [...curr, size]
    );
  };

  const handleToggleMaterial = (mat: string) => {
    setSelectedMaterials(curr =>
      curr.includes(mat) ? curr.filter(x => x !== mat) : [...curr, mat]
    );
  };

  const handleToggleDeliverySpeed = (speed: string) => {
    setSelectedDeliverySpeeds(curr =>
      curr.includes(speed) ? curr.filter(x => x !== speed) : [...curr, speed]
    );
  };

  const handleToggleWarranty = (warranty: string) => {
    setSelectedWarranties(curr =>
      curr.includes(warranty) ? curr.filter(x => x !== warranty) : [...curr, warranty]
    );
  };

  const handleToggleOffer = (offer: string) => {
    setSelectedOffers(curr =>
      curr.includes(offer) ? curr.filter(x => x !== offer) : [...curr, offer]
    );
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartedIds(curr =>
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]
    );
  };

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareProductIds(curr => {
      if (curr.includes(id)) {
        return curr.filter(x => x !== id);
      } else {
        if (curr.length >= 3) {
          alert("Maximum of 3 products can be compared at once! Please deselect key listings first.");
          return curr;
        }
        return [...curr, id];
      }
    });
  };

  // --- 5. MASTER FILTER PIPELINE ---
  const filteredProducts = enrichedProductsList.filter((prod) => {
    // 1. Category 
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;

    // 2. Search Text
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inTitle = prod.title.toLowerCase().includes(q);
      const inDesc = prod.description.toLowerCase().includes(q);
      const inBrand = prod.sellerName.toLowerCase().includes(q);
      const inCategory = prod.category.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inBrand && !inCategory) return false;
    }

    // 3. Price Ceiling
    if (prod.price > priceRange) return false;

    // 4. Brands / Sellers Checklist (Any Match)
    if (selectedSellers.length > 0 && !selectedSellers.includes(prod.sellerId)) return false;

    // 5. Ratings Minimum
    if (selectedRating !== 'all' && prod.rating < selectedRating) return false;

    // 6. Discount Threshold
    if (selectedDiscount !== 'all' && prod.discountPercent < selectedDiscount) return false;

    // 7. Colors (Any Match)
    if (selectedColors.length > 0 && !selectedColors.includes(prod.color)) return false;

    // 8. Sizes (Any Match)
    if (selectedSizes.length > 0 && !selectedSizes.includes(prod.size)) return false;

    // 9. Materials (Any Match)
    if (selectedMaterials.length > 0 && !selectedMaterials.includes(prod.material)) return false;

    // 10. Delivery Speed (Any Match)
    if (selectedDeliverySpeeds.length > 0 && !selectedDeliverySpeeds.includes(prod.deliverySpeed)) return false;

    // 11. Custom toggles
    if (onlyInStock && prod.stock <= 0) return false;
    if (requireCod && !prod.cod) return false;
    if (requireReturnable && !prod.returnable) return false;
    if (requireFreeDelivery && !prod.freeDelivery) return false;

    // 12. Warranties (Any Match)
    if (selectedWarranties.length > 0 && !selectedWarranties.includes(prod.warranty)) return false;

    // 13. Offers (Any Match)
    if (selectedOffers.length > 0 && !selectedOffers.includes(prod.offers)) return false;

    return true;
  });

  // --- 6. SORT CONTROL CENTER ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.ratingCount - a.ratingCount;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.isNew ? 1 : a.isNew ? -1 : 0;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discountPercent - a.discountPercent;
      case 'fast-delivery':
        // Rank 'Same Day' top, then 'Express', then standard
        const speedWeight = (s: string) => s === 'Same Day' ? 3 : s.includes('Express') ? 2 : 1;
        return speedWeight(b.deliverySpeed) - speedWeight(a.deliverySpeed);
      case 'relevance':
      default:
        // Relevance default: combine rating score & featured weighting
        const scoreA = a.rating * 10 + (a.featured ? 15 : 0);
        const scoreB = b.rating * 10 + (b.featured ? 15 : 0);
        return scoreB - scoreA;
    }
  });

  // Pagination bounds calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPagedProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  // Reset function back to complete system defaults
  const handleResetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSellers([]);
    setSortBy('relevance');
    setPriceRange(300);
    setSelectedRating('all');
    setSelectedDiscount('all');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedDeliverySpeeds([]);
    setSelectedWarranties([]);
    setSelectedOffers([]);
    setOnlyInStock(false);
    setRequireCod(false);
    setRequireReturnable(false);
    setRequireFreeDelivery(false);
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  // Dedicated chip clearing callbacks
  const handleClearSingleFilter = (type: string, value?: any) => {
    switch(type) {
      case 'category': setSelectedCategory('all'); break;
      case 'search': setSearchQuery(''); break;
      case 'price': setPriceRange(300); break;
      case 'rating': setSelectedRating('all'); break;
      case 'discount': setSelectedDiscount('all'); break;
      case 'seller': setSelectedSellers(curr => curr.filter(x => x !== value)); break;
      case 'color': setSelectedColors(curr => curr.filter(x => x !== value)); break;
      case 'size': setSelectedSizes(curr => curr.filter(x => x !== value)); break;
      case 'material': setSelectedMaterials(curr => curr.filter(x => x !== value)); break;
      case 'speed': setSelectedDeliverySpeeds(curr => curr.filter(x => x !== value)); break;
      case 'warranty': setSelectedWarranties(curr => curr.filter(x => x !== value)); break;
      case 'offer': setSelectedOffers(curr => curr.filter(x => x !== value)); break;
      case 'stock': setOnlyInStock(false); break;
      case 'cod': setRequireCod(false); break;
      case 'returnable': setRequireReturnable(false); break;
      case 'delivery': setRequireFreeDelivery(false); break;
    }
  };

  // --- 7. BREADCRUMB TEXT GENERATOR ---
  const activeCategoryObject = categories.find(c => c.slug === selectedCategory);
  const getBreadcrumb = () => {
    const list = [
      { label: 'Home', action: () => onNavigate('home') },
      { label: 'Market Catalog', action: () => setSelectedCategory('all') }
    ];
    if (selectedCategory !== 'all' && activeCategoryObject) {
      list.push({ label: activeCategoryObject.name, action: () => {} });
    }
    if (searchQuery) {
      list.push({ label: `Search results: "${searchQuery}"`, action: () => {} });
    }
    return list;
  };

  return (
    <>
    <div className="space-y-6 pb-24 text-slate-900 animate-fade-in" id="product-listing-view-container">
      
      {/* 7.1 PROGRESSIVE BREADCRUMBS BLOCK */}
      <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">
        {getBreadcrumb().map((crumb, idx, arr) => (
          <React.Fragment key={idx}>
            <button 
              onClick={crumb.action}
              className={`hover:text-blue-600 transition-colors ${idx === arr.length - 1 ? 'text-slate-600 font-extrabold cursor-default pointer-events-none' : ''}`}
            >
              {crumb.label}
            </button>
            {idx < arr.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
      </nav>

      {/* 7.2 RESPONSIVE HEADER BLOCK */}
      <header className="bg-white border border-slate-200/50 p-6 md:p-8 rounded-3xl space-y-4 shadow-sm relative overflow-hidden" id="departmental-catalog-header">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="bg-blue-50 text-blue-600 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest inline-block font-mono">
              {selectedCategory === 'all' ? 'All Departments' : activeCategoryObject?.name}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {selectedCategory === 'all' ? 'Supreme Digital Pipeline' : `${activeCategoryObject?.name} Hub`}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed">
              Browse {sortedProducts.length} verified listings. Secure Escrow payment systems hold your funds until items arrive safely. Clean transit logging enabled on dispatch.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 flex-shrink-0">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[100px] text-center">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">RESULTS</span>
              <strong className="text-base font-black text-slate-900">{sortedProducts.length}</strong>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[100px] text-center">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">COMPARING</span>
              <strong className="text-base font-black text-blue-600">{compareProductIds.length}/3</strong>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[100px] text-center hidden xs:block">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">WISHLISTED</span>
              <strong className="text-base font-black text-rose-500">{heartedIds.length}</strong>
            </div>
          </div>
        </div>

        {/* 7.3 SEARCH INPUT BAR WITH AUTO RESET */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by keyword, specific brand, category parameter, design specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex lg:hidden items-center justify-center gap-2 flex-1 sm:flex-initial transition-all"
            >
              <SlidersHorizontal size={14} className="text-blue-600" />
              <span>Filters Drawer ({
                (selectedCategory !== 'all' ? 1 : 0) +
                (searchQuery ? 1 : 0) +
                selectedSellers.length +
                (priceRange < 300 ? 1 : 0) +
                (selectedRating !== 'all' ? 1 : 0) +
                (selectedDiscount !== 'all' ? 1 : 0) +
                selectedColors.length +
                selectedSizes.length +
                selectedMaterials.length +
                selectedDeliverySpeeds.length +
                selectedWarranties.length +
                selectedOffers.length +
                (onlyInStock ? 1 : 0) +
                (requireCod ? 1 : 0) +
                (requireReturnable ? 1 : 0) +
                (requireFreeDelivery ? 1 : 0)
              })</span>
            </button>

            <button
              onClick={handleResetAllFilters}
              className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold hover:text-red-500 transition-colors"
              title="Reset All Parameters"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 7.4 ACTIVE FILTER CHIPS TRACKER SECTION */}
      {((selectedCategory !== 'all') || (searchQuery !== '') || (selectedSellers.length > 0) || (priceRange < 300) || (selectedRating !== 'all') || (selectedDiscount !== 'all') || (selectedColors.length > 0) || (selectedSizes.length > 0) || (selectedMaterials.length > 0) || (selectedDeliverySpeeds.length > 0) || (selectedWarranties.length > 0) || (selectedOffers.length > 0) || onlyInStock || requireCod || requireReturnable || requireFreeDelivery) && (
        <section className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2 select-none" id="active-filters-chips-wrapper">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Active Filter Criteria:</span>
            <button 
              onClick={handleResetAllFilters}
              className="text-[10px] text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              <span>Clear All Active</span>
              <X size={10} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Category Chip */}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 capitalize">
                <span>Dept: {selectedCategory}</span>
                <button onClick={() => handleClearSingleFilter('category')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}

            {/* Search Chip */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Search: "{searchQuery}"</span>
                <button onClick={() => handleClearSingleFilter('search')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}

            {/* Max Budget Chip */}
            {priceRange < 300 && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Budget Max: ${priceRange}</span>
                <button onClick={() => handleClearSingleFilter('price')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}

            {/* Rating Chip */}
            {selectedRating !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Rating: {selectedRating}★ & Above</span>
                <button onClick={() => handleClearSingleFilter('rating')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}

            {/* Discount Chip */}
            {selectedDiscount !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Save: {selectedDiscount}%+ Off</span>
                <button onClick={() => handleClearSingleFilter('discount')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}

            {/* Brands Checkboxes list */}
            {selectedSellers.map(bId => {
              const brandObj = sellersList.find(s => s.id === bId);
              return (
                <span key={bId} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                  <span>Brand: {brandObj?.name || bId}</span>
                  <button onClick={() => handleClearSingleFilter('seller', bId)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
                </span>
              );
            })}

            {/* Colors */}
            {selectedColors.map(colorVal => (
              <span key={colorVal} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Col: {colorVal}</span>
                <button onClick={() => handleClearSingleFilter('color', colorVal)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            ))}

            {/* Sizes */}
            {selectedSizes.map(sizeVal => (
              <span key={sizeVal} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Size: {sizeVal}</span>
                <button onClick={() => handleClearSingleFilter('size', sizeVal)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            ))}

            {/* Materials */}
            {selectedMaterials.map(matVal => (
              <span key={matVal} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Mat: {matVal}</span>
                <button onClick={() => handleClearSingleFilter('material', matVal)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            ))}

            {/* Delivery speed */}
            {selectedDeliverySpeeds.map(speedVal => (
              <span key={speedVal} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Del: {speedVal}</span>
                <button onClick={() => handleClearSingleFilter('speed', speedVal)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            ))}

            {/* Warranties */}
            {selectedWarranties.map(wVal => (
              <span key={wVal} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Warranty: {wVal}</span>
                <button onClick={() => handleClearSingleFilter('warranty', wVal)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            ))}

            {/* Offers */}
            {selectedOffers.map(oVal => (
              <span key={oVal} className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700">
                <span>Offer: {oVal}</span>
                <button onClick={() => handleClearSingleFilter('offer', oVal)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            ))}

            {/* Booleans status */}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 font-mono text-[9px]">
                <span>In Stock Only</span>
                <button onClick={() => handleClearSingleFilter('stock')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}
            {requireCod && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 font-mono text-[9px]">
                <span>COD Eligible</span>
                <button onClick={() => handleClearSingleFilter('cod')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}
            {requireReturnable && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 font-mono text-[9px]">
                <span>Returnable</span>
                <button onClick={() => handleClearSingleFilter('returnable')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}
            {requireFreeDelivery && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 font-mono text-[9px]">
                <span>Free Delivery</span>
                <button onClick={() => handleClearSingleFilter('delivery')} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"><X size={10} /></button>
              </span>
            )}
          </div>
        </section>
      )}

      {/* 7.5 CONTROL BAR TOOLBAR (SORT & MODE TOGGLES) */}
      <section className="bg-white border border-slate-200/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm" id="catalog-toolbar-control">
        <p className="text-xs font-bold text-slate-500 font-mono">
          SHOWING {Math.min(indexOfLastItem, sortedProducts.length)}-{sortedProducts.length} OF {sortedProducts.length} PIECES
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Sorting drop container */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xs:inline font-mono">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="relevance">⚖️ Relevance Alignment</option>
              <option value="popularity">🔥 Standard Popularity</option>
              <option value="price-low">📉 Price: Low to High</option>
              <option value="price-high">📈 Price: High to Low</option>
              <option value="newest">✨ Fresh New Releases</option>
              <option value="rating">⭐️ High Customer Rating</option>
              <option value="discount">🏷️ Top Discount Levels</option>
              <option value="fast-delivery">⚡ Same Day / Express</option>
            </select>
          </div>

          <span className="h-5 w-[1px] bg-slate-200"></span>

          {/* Grid Layout Toggles */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Show Compact Grid Layout"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Show Horizontal Rich List Cards"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 7.6 MAIN RESPONSIVE TWO-COLUMN SYSTEM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="catalog-listing-workspace-grid">
        
        {/* FILTERS SIDEBAR DECORATION - DESKTOP ONLY */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-5 space-y-6 shadow-sm max-h-[85vh] overflow-y-auto custom-scrollbar sticky top-24 select-none">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Sliders size={13} className="text-blue-600 animate-spin-slow" />
              <span>Standard Constraints</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono">VERIFIED</span>
          </div>

          {/* Collapsible Section: Price Range Filter */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('price')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Maximum Price</span>
              {collapsedSections.price ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.price && (
              <div className="pt-1.5 space-y-3">
                <input
                  type="range"
                  min="5"
                  max="300"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-100 cursor-pointer"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>$5</span>
                  <span className="bg-blue-50 text-blue-600 font-extrabold px-2 py-0.5 rounded">Limit: ${priceRange}</span>
                  <span>$300+</span>
                </div>
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Department categories (exclusive selector) */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Market Divisions</span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center justify-between ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-650 hover:bg-slate-50'}`}
              >
                <span>🌐 All Departments</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-xl flex items-center justify-between transition-all ${selectedCategory === cat.slug ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-650 hover:bg-slate-50'}`}
                >
                  <span className="capitalize truncate max-w-[130px]">{cat.name}</span>
                  <span className="text-[9px] bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded-md font-mono">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Brands / Sellers Category Toggle */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('brand')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Partner Brands</span>
              {collapsedSections.brand ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.brand && (
              <div className="pt-1.5 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {sellersList.map((seller) => {
                  const isChecked = selectedSellers.includes(seller.id);
                  return (
                    <button
                      key={seller.id}
                      onClick={() => handleToggleSeller(seller.id)}
                      className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-1 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare size={14} className="text-blue-600 flex-shrink-0" />
                      ) : (
                        <Square size={14} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span className="truncate flex-1">{seller.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Rating Minimum Filters */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('rating')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Customer Review Score</span>
              {collapsedSections.rating ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.rating && (
              <div className="pt-1.5 space-y-1">
                {[4.5, 4.0, 3.5, 3.0].map((starVal) => {
                  const isActive = selectedRating === starVal;
                  return (
                    <button
                      key={starVal}
                      onClick={() => setSelectedRating(isActive ? 'all' : starVal)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all ${isActive ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < Math.floor(starVal) ? 'fill-amber-400 text-amber-400' : ''} />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold">{starVal} & above</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Discount Levels threshold */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('discount')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Discount Threshold</span>
              {collapsedSections.discount ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.discount && (
              <div className="pt-1.5 space-y-1">
                {[40, 30, 20, 10].map((discVal) => {
                  const isActive = selectedDiscount === discVal;
                  return (
                    <button
                      key={discVal}
                      onClick={() => setSelectedDiscount(isActive ? 'all' : discVal)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between transition-all ${isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <BadgePercent size={12} className="text-emerald-500" />
                        <span>{discVal}% & Above Saving</span>
                      </span>
                      <Check size={11} className={isActive ? 'opacity-100 text-emerald-600' : 'opacity-0'} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Stock / Cash On Delivery Booleans */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('badges')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Fulfillment Status</span>
              {collapsedSections.badges ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.badges && (
              <div className="pt-1.5 space-y-2.5">
                <button
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-0.5 transition-colors"
                >
                  {onlyInStock ? (
                    <CheckSquare size={14} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <Square size={14} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span>Exclude Out-of-Stock</span>
                </button>

                <button
                  onClick={() => setRequireCod(!requireCod)}
                  className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-0.5 transition-colors"
                >
                  {requireCod ? (
                    <CheckSquare size={14} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <Square size={14} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span>COD Express Available</span>
                </button>

                <button
                  onClick={() => setRequireReturnable(!requireReturnable)}
                  className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-0.5 transition-colors"
                >
                  {requireReturnable ? (
                    <CheckSquare size={14} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <Square size={14} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span>Returnable Products</span>
                </button>

                <button
                  onClick={() => setRequireFreeDelivery(!requireFreeDelivery)}
                  className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-0.5 transition-colors"
                >
                  {requireFreeDelivery ? (
                    <CheckSquare size={14} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <Square size={14} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span className="flex items-center gap-1.5">
                    <Truck size={12} className="text-blue-500" />
                    <span>Free Tracked Delivery</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Color options */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('color')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Aesthetic Colorways</span>
              {collapsedSections.color ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.color && (
              <div className="pt-1.5 grid grid-cols-2 gap-1.5">
                {allAvailableColors.map((colorVal) => {
                  const isChecked = selectedColors.includes(colorVal);
                  return (
                    <button
                      key={colorVal}
                      onClick={() => handleToggleColor(colorVal)}
                      className={`px-2 py-1.5 border rounded-xl text-[10px] font-bold text-left transition-all truncate flex items-center gap-1.5 ${isChecked ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' : 'border-slate-200 hover:bg-slate-50 text-slate-705'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        colorVal.includes('Black') ? 'bg-black' : 
                        colorVal.includes('White') ? 'bg-slate-200 border border-slate-300' : 
                        colorVal.includes('Blue') ? 'bg-blue-600' : 
                        colorVal.includes('Gray') ? 'bg-slate-400' : 'bg-red-500'
                      }`}></span>
                      <span>{colorVal.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Sizes */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('size')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono font-bold">Standard Sizing</span>
              {collapsedSections.size ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.size && (
              <div className="pt-1.5 flex flex-wrap gap-1">
                {allAvailableSizes.map((sizeVal) => {
                  const isChecked = selectedSizes.includes(sizeVal);
                  return (
                    <button
                      key={sizeVal}
                      onClick={() => handleToggleSize(sizeVal)}
                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all ${isChecked ? 'border-indigo-600 bg-indigo-50 text-indigo-705' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                    >
                      {sizeVal}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Materials */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('material')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono font-bold">Material Specs</span>
              {collapsedSections.material ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.material && (
              <div className="pt-1.5 space-y-1">
                {allAvailableMaterials.map((matVal) => {
                  const isChecked = selectedMaterials.includes(matVal);
                  return (
                    <button
                      key={matVal}
                      onClick={() => handleToggleMaterial(matVal)}
                      className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-1 transition-colors animate-fade-in"
                    >
                      {isChecked ? (
                        <CheckSquare size={13} className="text-blue-600 flex-shrink-0" />
                      ) : (
                        <Square size={13} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span className="truncate">{matVal}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Transit Speed Options */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('shipping')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Transit Speeds</span>
              {collapsedSections.shipping ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.shipping && (
              <div className="pt-1.5 space-y-1">
                {allAvailableDeliverySpeeds.map((speedVal) => {
                  const isChecked = selectedDeliverySpeeds.includes(speedVal);
                  return (
                    <button
                      key={speedVal}
                      onClick={() => handleToggleDeliverySpeed(speedVal)}
                      className="flex items-center gap-2.5 w-full text-left text-xs text-slate-705 hover:text-blue-600 py-1 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare size={13} className="text-blue-600 flex-shrink-0" />
                      ) : (
                        <Square size={13} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span>{speedVal}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Warranty Status */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('warranty')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Assurance & Warranty</span>
              {collapsedSections.warranty ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.warranty && (
              <div className="pt-1.5 space-y-1">
                {allAvailableWarranties.map((wVal) => {
                  const isChecked = selectedWarranties.includes(wVal);
                  return (
                    <button
                      key={wVal}
                      onClick={() => handleToggleWarranty(wVal)}
                      className="flex items-center gap-2.5 w-full text-left text-xs text-slate-705 hover:text-blue-600 py-1 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare size={13} className="text-blue-600 flex-shrink-0" />
                      ) : (
                        <Square size={13} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span className="truncate">{wVal}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="h-[1px] bg-slate-100 block"></span>

          {/* Collapsible Section: Exclusive Store Offers */}
          <div className="space-y-2">
            <button 
              onClick={() => toggleSection('offers')} 
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Exclusive Offers</span>
              {collapsedSections.offers ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>
            {!collapsedSections.offers && (
              <div className="pt-1.5 space-y-1">
                {allAvailableOffers.map((oVal) => {
                  const isChecked = selectedOffers.includes(oVal);
                  return (
                    <button
                      key={oVal}
                      onClick={() => handleToggleOffer(oVal)}
                      className="flex items-center gap-2.5 w-full text-left text-xs text-slate-705 hover:text-blue-600 py-1 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare size={13} className="text-blue-600 flex-shrink-0" />
                      ) : (
                        <Square size={13} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span className="truncate">{oVal}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* --- 7.7 MAIN PRODUCT TILES PLATFORM --- */}
        <main className="lg:col-span-9 space-y-6" id="catalog-listing-products-main">
          
          {/* SKELETON LOADING LOOPS */}
          {isLoadingPage ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-200/60 p-5 rounded-3xl space-y-4 animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-5/6 block"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 block"></div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 rounded-lg w-10"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            /* EMPTY VIEW FALLBACK STATE with recommended chips */
            <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl p-8 max-w-xl mx-auto space-y-6" id="empty-catalog-fallback">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
                <ShoppingBag size={24} className="stroke-2 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-900 font-extrabold text-xl">Zero Matching Products Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We scanned our entire global network cache but couldn't resolve items matching your specific parameters. Try clearing some toggles or typing a wider query.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block">Recommended General Queries:</span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['SoundAura', 'Smartwatch', 'Cashmere', 'Electronics', 'Minimalist'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                    >
                      🔍 "{tag}"
                    </button>
                  ))}
                </div>
              </div>

              <span className="h-[1px] bg-slate-150 block"></span>

              <button
                onClick={handleResetAllFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
              >
                Reset All Filter Criteria
              </button>
            </div>
          ) : (
            /* RENDER COMPACT GRID OR HORIZONTAL LISTS MODE */
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`} id="catalog-products-active-feed">
              {currentPagedProducts.map((prod) => {
                const isHearted = heartedIds.includes(prod.id);
                const isComparedFlag = compareProductIds.includes(prod.id);
                
                return (
                  <div
                    key={prod.id}
                    onClick={() => onNavigate('product-detail', { id: prod.id })}
                    className={`bg-white border hover:border-blue-500/20 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex ${viewMode === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row'}`}
                    id={`catalog-card-${prod.id}`}
                  >
                    {/* Visual Media with Badges */}
                    <div className={`relative bg-slate-50 overflow-hidden flex-shrink-0 ${viewMode === 'grid' ? 'aspect-[4/3] w-full' : 'w-full sm:w-60 md:w-64 aspect-[4/3] sm:aspect-square'}`}>
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-104 duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />

                      {/* Top Action Buttons (Heart, Compare, Zoom) */}
                      <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-10">
                        <button
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className={`p-2 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-500 hover:text-rose-600 rounded-full shadow-xs transition-all duration-200`}
                          title={isHearted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart size={14} className={isHearted ? 'fill-rose-500 text-rose-500 animate-pulse' : ''} />
                        </button>

                        <button
                          onClick={(e) => toggleCompare(prod.id, e)}
                          className={`p-2 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-500 hover:text-indigo-600 rounded-full shadow-xs transition-all duration-200`}
                          title="Add to compare listing"
                        >
                          <ArrowLeftRight size={14} className={isComparedFlag ? 'text-indigo-600 fill-indigo-100 font-extrabold rotate-180 duration-300' : ''} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(prod);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-500 hover:text-blue-600 rounded-full shadow-xs transition-all duration-200"
                          title="Quick view details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>

                      {/* Promo overlay tag & new tag */}
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                        {prod.isNew && (
                          <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                            NEW
                          </span>
                        )}
                        <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[8.5px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-xs">
                          {prod.category}
                        </span>
                      </div>

                      {/* Core Badging Details (Fulfillment Status indicators) */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap gap-1">
                        {prod.freeDelivery && (
                          <span className="bg-emerald-500/90 text-slate-950 font-black text-[8px] tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                            <Truck size={10} />
                            <span>FREE DEL</span>
                          </span>
                        )}
                        {prod.cod && (
                          <span className="bg-amber-500/95 text-slate-950 font-black text-[8px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
                            COD OK
                          </span>
                        )}
                        <span className="bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                          {prod.deliverySpeed}
                        </span>
                      </div>
                    </div>

                    {/* Meta Card Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 capitalize font-mono tracking-wide">{prod.sellerName}</span>
                          <span className="text-[9.5px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">Stock: {prod.stock}</span>
                        </div>
                        
                        <h3 className="text-xs md:text-sm font-black text-slate-905 uppercase line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {prod.title}
                        </h3>

                        {/* Interactive Ratings Grid */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className={i < Math.floor(prod.rating) ? 'fill-amber-400 text-amber-400' : ''} />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-650 font-bold">{prod.rating}</span>
                          <span className="text-[10px] text-slate-400">({prod.ratingCount} reviews)</span>
                        </div>

                        {/* Extra descriptors for wide list display mode */}
                        {viewMode === 'list' && (
                          <p className="text-xs text-slate-500 leading-normal line-clamp-2 pt-1 font-medium select-none">
                            {prod.description}
                          </p>
                        )}

                        {/* Custom metadata details (Material, Sizing) */}
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-slate-600 font-semibold font-mono">
                          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Mat: {prod.material}</span>
                          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Spec: {prod.size}</span>
                        </div>
                      </div>

                      {/* Action trigger footer section */}
                      <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base md:text-lg font-black text-slate-900">${prod.price.toFixed(2)}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-slate-400 line-through font-bold">${prod.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          {prod.discountPercent > 0 && (
                            <span className="text-[9.5px] font-extrabold text-emerald-600 uppercase tracking-widest font-mono block mt-0.5 shadow-xs">
                              🏷️ SAVE {prod.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(prod);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-95 flex items-center gap-1.5"
                          title="Add item to checkout cycle"
                        >
                          <ShoppingCart size={12} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 7.8 ADVANCED COMMERCE PAGINATION */}
          {sortedProducts.length > 0 && (
            <footer className="bg-white border border-slate-200/50 p-4.5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none" id="catalog-advanced-pagination">
              <span className="text-xs text-slate-500 font-mono font-bold">
                PAGE {currentPage} OF {totalPages} ({sortedProducts.length} TOTAL LISTINGS CHANNELS)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none text-slate-750 text-xs font-bold rounded-xl transition-colors font-mono"
                >
                  &larr; PREV
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl font-bold text-xs font-mono transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none text-slate-755 text-xs font-bold rounded-xl transition-colors font-mono"
                >
                  NEXT &rarr;
                </button>
              </div>
            </footer>
          )}
        </main>
      </div>

      {/* --- 8. FLOATING STICKY COMPARE TRAILER TRAY --- */}
      {compareProductIds.length > 0 && (
        <section 
          className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white border border-slate-850 px-6 py-4 rounded-[2.2rem] shadow-2xl flex flex-col sm:flex-row items-center gap-4 z-40 max-w-full w-[90%] sm:w-auto animate-bounce-short select-none"
          id="sticky-compare-trailer"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-indigo-650 text-indigo-300 flex items-center justify-center font-black animate-pulse">
              <ArrowLeftRight size={14} />
            </span>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-300">Compare Workshop active</h4>
              <p className="text-[9px] text-slate-400">{compareProductIds.length} of 3 items staged for comprehensive comparison metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2.5">
              {compareProductIds.map(pId => {
                const itemObj = enrichedProductsList.find(p => p.id === pId);
                return (
                  <div key={pId} className="w-10 h-10 rounded-full border border-slate-950 overflow-hidden relative group">
                    <img src={itemObj?.image} alt={itemObj?.title} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => toggleCompare(pId, e)}
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Deselect item from compare"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>

            <span className="h-6 w-[1.5px] bg-slate-800"></span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Compare Specs</span>
                <ArrowUpRight size={12} />
              </button>
              <button
                onClick={() => setCompareProductIds([])}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                title="Flush staging array"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>

      {/* --- 9. HIGH-FIDELITY COMPARE OVERLAY SCREEN MODAL --- */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative border border-slate-100 shadow-2xl">
            <button 
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="bg-indigo-50 text-indigo-600 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">Compare Workshop Matrix</span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase mt-1">Cross-Verification Spec Sheet</h2>
              <p className="text-xs text-slate-500 mt-0.5">Scrutinize pricing levels, physical dimensions, material grades and legal warranties directly side-by-side.</p>
            </div>

            <div className="overflow-x-auto min-w-full border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td className="p-4 font-black text-slate-405 uppercase tracking-wider font-mono w-[20%]">COMPARE FIELD</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 min-w-[180px]">
                          <div className="space-y-3.5">
                            <div className="w-20 h-20 bg-slate-105 rounded-xl overflow-hidden shadow-xs mx-auto">
                              <img src={itemObj?.image} alt={itemObj?.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center space-y-1">
                              <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">{itemObj?.sellerName}</span>
                              <h4 className="font-extrabold text-slate-850 line-clamp-2 uppercase min-h-[32px]">{itemObj?.title}</h4>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Price */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Immediate Value</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200">
                          <strong className="text-slate-900 text-sm font-black">${itemObj?.price}</strong>
                          {itemObj && itemObj.originalPrice > itemObj.price && (
                            <span className="text-slate-400 line-through text-[10px] ml-2 font-bold">${itemObj.originalPrice}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Save Discount Percentage */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Saving Discount</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 text-emerald-600 font-extrabold">
                          {itemObj?.discountPercent}% OFF
                        </td>
                      );
                    })}
                  </tr>
                  {/* Category */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Category Depart</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 capitalize font-medium text-slate-650">
                          {itemObj?.category}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Rating Stars */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Customer Review</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <strong className="text-slate-900 font-bold">{itemObj?.rating}</strong>
                            <span className="text-slate-400 text-[10px]/none flex">({itemObj?.ratingCount} tests)</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {/* Materials */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Material Grade</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 font-semibold text-slate-650">
                          {itemObj?.material}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Physical spec sizing */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Sizing Specification</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 font-semibold font-mono text-[11px] text-slate-600">
                          {itemObj?.size}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Warranty information */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Standard Warranty</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 font-bold text-indigo-600 capitalize">
                          {itemObj?.warranty}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Fulfillment badging */}
                  <tr>
                    <td className="p-4 bg-slate-50/50 font-bold text-slate-800">Fulfillment Perks</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200 font-medium space-y-1 select-none">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${itemObj?.freeDelivery ? 'bg-emerald-500' : 'bg-slate-350'}`}></span>
                            <span className="text-[10px] text-slate-500">Free Delivery: {itemObj?.freeDelivery ? 'YES' : 'NO'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${itemObj?.cod ? 'bg-amber-500' : 'bg-slate-350'}`}></span>
                            <span className="text-[10px] text-slate-500">COD Available: {itemObj?.cod ? 'YES' : 'NO'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${itemObj?.returnable ? 'bg-indigo-500' : 'bg-rose-500'}`}></span>
                            <span className="text-[10px] text-slate-500">Return Policy: {itemObj?.returnable ? '14 Days' : 'Final Sale'}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {/* ADD CORE CART CLICK ACTION */}
                  <tr className="bg-slate-50/30">
                    <td className="p-4 font-black">ACTIVE PIPELINE</td>
                    {compareProductIds.map(pId => {
                      const itemObj = enrichedProductsList.find(p => p.id === pId);
                      return (
                        <td key={pId} className="p-4 border-l border-slate-200">
                          <div className="space-y-1.5 w-full">
                            <button
                              onClick={() => {
                                if (itemObj) {
                                  onAddToCart(itemObj);
                                  alert(`Successfully added ${itemObj.title} to your instant checkout path!`);
                                }
                              }}
                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                            >
                              <ShoppingCart size={11} />
                              <span>Acquire Piece</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsCompareModalOpen(false);
                                if (itemObj) {
                                  onNavigate('product-detail', { id: itemObj.id });
                                }
                              }}
                              className="w-full py-1 text-slate-650 hover:text-slate-900 border border-slate-250 text-[10px] text-center font-bold tracking-wide rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- 10. PRODUCT REUSABLE QUICK VIEW MODAL WINDOW --- */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative border border-slate-100 shadow-2xl">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
              {/* Product Image preview frame */}
              <div className="space-y-3">
                <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden shadow-inner border border-slate-100 relative">
                  <img src={quickViewProduct.image} alt={quickViewProduct.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-slate-900 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    {quickViewProduct.category}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 italic text-[10.5px] font-medium text-slate-550">
                  ⚡ Shipped direct via our {quickViewProduct.deliverySpeed} program
                </div>
              </div>

              {/* Specs & action pane */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 font-mono">{quickViewProduct.sellerName}</span>
                  <h3 className="text-base md:text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                    {quickViewProduct.title}
                  </h3>
                  
                  {/* Rating summary */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className={i < Math.floor(quickViewProduct.rating) ? 'fill-amber-400 text-amber-400' : ''} />
                      ))}
                    </div>
                    <strong className="text-xs font-bold text-slate-800">{quickViewProduct.rating}</strong>
                    <span className="text-[10px] text-slate-400">({quickViewProduct.ratingCount} inspections)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {quickViewProduct.description}
                </p>

                {/* Technical stats breakdown */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">Product Specifications:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-650 font-semibold leading-tight capitalize">
                    <div>📏 Standard Sizing: <span className="text-slate-800 font-bold font-mono text-[10.5px]">{quickViewProduct.size}</span></div>
                    <div>🎨 Aesthetic Color: <span className="text-slate-800 font-bold">{quickViewProduct.color}</span></div>
                    <div>🪵 Materials grade: <span className="text-slate-800 font-bold">{quickViewProduct.material}</span></div>
                    <div>🛡️ Warranty plan: <span className="text-blue-600 font-bold">{quickViewProduct.warranty}</span></div>
                  </div>
                </div>

                {/* Instant pricing indicator */}
                <div className="flex items-baseline gap-2 pb-2">
                  <span className="text-xl md:text-2xl font-black text-slate-905">${quickViewProduct.price.toFixed(2)}</span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-xs text-slate-400 line-through font-bold">${quickViewProduct.originalPrice.toFixed(2)}</span>
                  )}
                  {quickViewProduct.discountPercent > 0 && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono">
                      -{quickViewProduct.discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      onAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={13} />
                    <span>Instant Add To Checkout</span>
                  </button>

                  <button
                    onClick={(e) => {
                      toggleWishlist(quickViewProduct.id, e);
                    }}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-rose-600 rounded-xl transition-colors"
                    title="Toggle wishlist item state"
                  >
                    <Heart size={15} className={heartedIds.includes(quickViewProduct.id) ? 'fill-rose-500 text-rose-500' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 11. MOBILE FILTER SLIDE DRAWER SCREEN --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex justify-end z-50 select-none animate-fade-in lg:hidden">
          <div className="w-[85%] max-w-sm bg-white h-full overflow-y-auto p-5 space-y-6 flex flex-col justify-between shadow-2xl">
            
            {/* Drawer top bar config */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-blue-600" />
                  <span>Staged Filter Drawer</span>
                </h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  aria-label="Close Filter Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable contents inside mobile frame */}
              <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                {/* 1. Price constraint inside mobile drawer */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Maximum Price</span>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-100 cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>$5</span>
                    <span className="text-blue-600 font-extrabold font-mono">${priceRange} limit</span>
                    <span>$300+</span>
                  </div>
                </div>

                <span className="h-[1px] bg-slate-100 block"></span>

                {/* 2. Department categories */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Market Divisions</span>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${selectedCategory === 'all' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      All Departments
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left text-xs px-2.5 py-1 rounded-lg flex items-center justify-between transition-all ${selectedCategory === cat.slug ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <span className="capitalize">{cat.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold select-none font-mono">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <span className="h-[1px] bg-slate-100 block"></span>

                {/* 3. Brands checking */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Partner Brands</span>
                  <div className="space-y-1 pt-0.5">
                    {sellersList.map((seller) => {
                      const isChecked = selectedSellers.includes(seller.id);
                      return (
                        <button
                          key={seller.id}
                          onClick={() => handleToggleSeller(seller.id)}
                          className="flex items-center gap-2.5 w-full text-left text-xs text-slate-700 hover:text-blue-600 py-1 transition-colors"
                        >
                          {isChecked ? (
                            <CheckSquare size={14} className="text-blue-600 flex-shrink-0" />
                          ) : (
                            <Square size={14} className="text-slate-300 flex-shrink-0" />
                          )}
                          <span className="truncate">{seller.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <span className="h-[1px] bg-slate-100 block"></span>

                {/* 4. Rating checks */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Customer Review Score</span>
                  <div className="space-y-1 pt-0.5">
                    {[4.5, 4.0, 3.5, 3.0].map((starVal) => {
                      const isActive = selectedRating === starVal;
                      return (
                        <button
                          key={starVal}
                          onClick={() => setSelectedRating(isActive ? 'all' : starVal)}
                          className={`w-full text-left text-xs px-2 py-1 flex items-center gap-2 rounded-lg transition-all ${isActive ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className={i < Math.floor(starVal) ? 'fill-amber-400 text-amber-400' : ''} />
                            ))}
                          </div>
                          <span>{starVal} & above</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <span className="h-[1px] bg-slate-100 block"></span>

                {/* 5. Custom Perks status controls */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Fulfillment Perks</span>
                  <div className="space-y-1.5 pt-0.5">
                    <button onClick={() => setOnlyInStock(!onlyInStock)} className="flex items-center gap-2.5 text-xs text-slate-700 py-0.5 w-full text-left">
                      {onlyInStock ? <CheckSquare size={13} className="text-blue-600" /> : <Square size={13} className="text-slate-300" />}
                      <span>Exclude Out-of-Stock</span>
                    </button>
                    <button onClick={() => setRequireCod(!requireCod)} className="flex items-center gap-2.5 text-xs text-slate-700 py-0.5 w-full text-left">
                      {requireCod ? <CheckSquare size={13} className="text-blue-600" /> : <Square size={13} className="text-slate-300" />}
                      <span>COD Eligible</span>
                    </button>
                    <button onClick={() => setRequireFreeDelivery(!requireFreeDelivery)} className="flex items-center gap-2.5 text-xs text-slate-700 py-0.5 w-full text-left">
                      {requireFreeDelivery ? <CheckSquare size={13} className="text-blue-600" /> : <Square size={13} className="text-slate-300" />}
                      <span>Free Delivery</span>
                    </button>
                  </div>
                </div>

                <span className="h-[1px] bg-slate-100 block"></span>

                {/* 6. Aesthetics */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Aesthetics</span>
                  <div className="grid grid-cols-2 gap-1 bg-slate-50 p-2 rounded-xl">
                    {allAvailableColors.map(col => {
                      const isActive = selectedColors.includes(col);
                      return (
                        <button
                          key={col}
                          onClick={() => handleToggleColor(col)}
                          className={`text-[9.5px]/none font-bold p-1 rounded border capitalize flex items-center justify-center gap-1.5 ${isActive ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${col.includes('Black') ? 'bg-black' : col.includes('White') ? 'bg-slate-300' : 'bg-blue-600'}`}></span>
                          <span>{col.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom panel for slide filtering controls */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl text-center shadow-md shadow-blue-500/10 active:scale-95 duration-200"
              >
                Apply Constraints ({sortedProducts.length})
              </button>
              <button
                onClick={handleResetAllFilters}
                className="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-[10px] uppercase rounded-xl text-center transition-colors"
              >
                Restore Master Defaults
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

// Simple inline Chevron icon to satisfy mega categorizer elements
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
