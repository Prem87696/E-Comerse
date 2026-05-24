import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Truck, ShieldCheck, CheckCircle2, DollarSign, Wallet, 
  ArrowLeft, Info, Calendar, Percent, Plus, MapPin, User, Check, 
  Gift, AlertCircle, RefreshCw, X, ShieldAlert, Award, ChevronRight, CornerDownRight
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  appliedPromo: string;
  onPlaceOrder: (
    shippingAddress: { fullName: string; street: string; city: string; state: string; zip: string },
    paymentMethod: string
  ) => void;
  onNavigate: (view: string) => void;
}

// Prefilled Saved Addresses for High-Conversion Tap Fill
interface AddressTemplate {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  type: string;
}

const PRE_SAVED_ADDRESSES: AddressTemplate[] = [
  {
    id: 'addr-1',
    label: 'Home (Primary Address)',
    fullName: 'Prem Kumar',
    street: '124 Innovation Boulevard, Tech District',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560001',
    type: 'Home'
  },
  {
    id: 'addr-2',
    label: 'Office Workspace',
    fullName: 'Prem Kumar (AuraTech Labs)',
    street: 'Building 45-B, Outer Ring Road, Phase II',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560048',
    type: 'Office'
  }
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  appliedPromo,
  onPlaceOrder,
  onNavigate,
}) => {
  // --- SESSION CONTROLLER (GUEST VS LOGGED IN) ---
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestEmail, setGuestEmail] = useState<string>('guest_buyer@example.com');
  const [guestPhone, setGuestPhone] = useState<string>('+91 98765 43210');

  // --- ADDRESS SELECTION & FORM ---
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [fullName, setFullName] = useState<string>('Prem Kumar');
  const [street, setStreet] = useState<string>('124 Innovation Boulevard, Tech District');
  const [city, setCity] = useState<string>('Bangalore');
  const [stateValue, setStateValue] = useState<string>('Karnataka');
  const [zip, setZip] = useState<string>('560001');

  // Interactive pre-fill zip code detector
  const [pincodeDetected, setPincodeDetected] = useState<{ city: string; state: string } | null>(null);

  useEffect(() => {
    // Detect standard postal coordinates to simulate instant auto-fill
    const cleanZip = zip.trim();
    if (cleanZip === '560001') {
      setPincodeDetected({ city: 'Bangalore', state: 'Karnataka' });
    } else if (cleanZip === '110001') {
      setPincodeDetected({ city: 'New Delhi', state: 'Delhi' });
    } else if (cleanZip === '400001') {
      setPincodeDetected({ city: 'Mumbai', state: 'Maharashtra' });
    } else if (cleanZip === '560048') {
      setPincodeDetected({ city: 'Bangalore Outer', state: 'Karnataka' });
    } else {
      setPincodeDetected(null);
    }
  }, [zip]);

  const handleApplyPincodeAutofill = () => {
    if (pincodeDetected) {
      setCity(pincodeDetected.city);
      setStateValue(pincodeDetected.state);
    }
  };

  const handleSelectAddressTemplate = (addr: AddressTemplate) => {
    setSelectedAddressId(addr.id);
    setFullName(addr.fullName);
    setStreet(addr.street);
    setCity(addr.city);
    setStateValue(addr.state);
    setZip(addr.zip);
  };

  // --- DELIVERY PARAMETERS ---
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'next-day'>('standard');
  const [selectedSlot, setSelectedSlot] = useState<string>('Afternoon Cycle (1:00 PM - 5:00 PM)');

  const getDeliveryCost = () => {
    if (deliveryMethod === 'express') return 150;
    if (deliveryMethod === 'next-day') return 250;
    
    // Standard is free if subtotal > 1000
    const primarySubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    return primarySubtotal >= 1000 ? 0 : 99;
  };

  // Slots matching courier handovers
  const slotsList = [
    'Morning Drop (8:00 AM - 12:00 PM)',
    'Afternoon Cycle (1:00 PM - 5:00 PM)',
    'Evening Handover (6:00 PM - 9:00 PM)'
  ];

  // --- REDEMPTIONS & REWARDS ---
  const [redeemLoyalty, setRedeemLoyalty] = useState<boolean>(false);
  const LOYALTY_DISCOUNT_VALUE = 250.00; // equivalent of points

  const [applyGiftCard, setApplyGiftCard] = useState<boolean>(false);
  const [giftCodeInput, setGiftCodeInput] = useState<string>('GIFT_NEXA_10');
  const [giftCardDeduction, setGiftCardDeduction] = useState<number>(0);
  const [giftFeedback, setGiftFeedback] = useState<string>('');

  const handleVerifyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCodeInput.trim().toUpperCase() === 'GIFT_NEXA_10') {
      setGiftCardDeduction(500.00);
      setApplyGiftCard(true);
      setGiftFeedback('Succesfully verified! Gift balance of ₹500.00 is applied.');
    } else {
      setGiftFeedback('Invalid gift coupon identifier.');
    }
  };

  // --- CORE CONVERSIONS CALCULATION ---
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Coupons math matching parent state
  const isPromoNexa25Active = appliedPromo === 'NEXA25';
  const isPromoSave15Active = appliedPromo === 'SAVE15';
  let couponDiscount = 0;
  if (isPromoNexa25Active) {
    couponDiscount = subtotal * 0.25;
  } else if (isPromoSave15Active) {
    couponDiscount = subtotal * 0.15;
  }

  // Deductions cumulative
  const loyaltyDeductionValue = redeemLoyalty ? LOYALTY_DISCOUNT_VALUE : 0;
  const currentGiftReduction = applyGiftCard ? giftCardDeduction : 0;
  const deliverySurcharge = getDeliveryCost();

  // Escrow Safeguard Fee + VAT (10% standard)
  const safeguardFee = subtotal * 0.10;

  // Final Payable calculations
  const finalCalculatedPayable = Math.max(0, subtotal - couponDiscount - loyaltyDeductionValue - currentGiftReduction + deliverySurcharge + safeguardFee);

  // --- PAYMENT METODS TABS ---
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'banking' | 'wallet' | 'cod' | 'emi' | 'bnpl'>('card');
  
  // Card Inputs & automatic brand detector
  const [cardNumber, setCardNumber] = useState<string>('4111 2222 3333 4444');
  const [cardName, setCardName] = useState<string>('PREM KUMAR');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('382');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('visa');

  useEffect(() => {
    const rawNumber = cardNumber.replace(/\s+/g, '');
    if (rawNumber.startsWith('4')) {
      setCardBrand('visa');
    } else if (rawNumber.startsWith('5')) {
      setCardBrand('mastercard');
    } else if (rawNumber.startsWith('3')) {
      setCardBrand('amex');
    } else {
      setCardBrand('generic');
    }
  }, [cardNumber]);

  // UPI inputs
  const [upiId, setUpiId] = useState<string>('prem@upi');
  
  // Net banking selector choice
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Premier Bank Link');
  
  // Wallet choice
  const [selectedWallet, setSelectedWallet] = useState<string>('Google Wallet API');

  // COD Anti-bot Captcha
  const [captchaAnswer, setCaptchaAnswer] = useState<string>('');
  const [captchaCode] = useState<string>('8265');
  const [codVerified, setCodVerified] = useState<boolean>(false);
  const [codError, setCodError] = useState<string>('');

  const handleVerifyCodCaptcha = () => {
    if (captchaAnswer.trim() === captchaCode) {
      setCodVerified(true);
      setCodError('');
    } else {
      setCodError('Incorrect anti-bot digits.');
      setCodVerified(false);
    }
  };

  // EMI option calculator
  const [emiMonths, setEmiMonths] = useState<number>(3);
  const getEmiMonthlyFee = () => {
    const rate = emiMonths === 12 ? 0.05 : emiMonths === 6 ? 0.03 : 0.02;
    const totalWithInterest = finalCalculatedPayable * (1 + rate);
    return (totalWithInterest / emiMonths).toFixed(2);
  };

  // BNPL checkbox simulator
  const [bnplTermsApproved, setBnplTermsApproved] = useState<boolean>(false);

  // --- TERMS CHECKBOX ---
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // --- SIMULATOR CONTROL PANEL FOR SUCCESS VS ERROR PIPELINE ---
  const [forceSimulatedError, setForceSimulatedError] = useState<boolean>(false);
  const [checkoutStage, setCheckoutStage] = useState<'input' | 'authorizing' | 'failed' | 'success'>('input');
  const [failedReason, setFailedReason] = useState<string>('');
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  const handleRestartCheckoutFlow = () => {
    setCheckoutStage('input');
    setFailedReason('');
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !stateValue || !zip) {
      alert('Please fill out all address fields.');
      return;
    }
    
    if (isGuest && (!guestEmail || !guestPhone)) {
      alert('Please provide guest contact emails and numbers.');
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the standard Escrow buyer terms.');
      return;
    }

    if (paymentTab === 'cod' && !codVerified) {
      alert('Please solve the Cash on Delivery CAPTCHA first.');
      return;
    }

    // Enter authorizing stage loaders
    setCheckoutStage('authorizing');

    setTimeout(() => {
      if (forceSimulatedError) {
        // Transition to Payment Failed Screen
        setCheckoutStage('failed');
        setFailedReason('Authorization failed: Insufficient balance on selected instrument or merchant region restrictions.');
      } else {
        // Transition to Success confirmation page
        const generatedId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
        setCreatedOrderId(generatedId);
        setCheckoutStage('success');
        
        // Fire parent hook callbacks
        onPlaceOrder({
          fullName,
          street,
          city,
          state: stateValue,
          zip
        }, `${paymentTab.toUpperCase()}: ${paymentTab === 'card' ? cardNumber : paymentTab === 'upi' ? upiId : paymentTab === 'banking' ? selectedBank : paymentTab === 'wallet' ? selectedWallet : paymentTab === 'emi' ? `EMI (${emiMonths} Months)` : paymentTab === 'bnpl' ? 'NexaPay BNPL' : 'Cash on Delivery (COD)'}`);
      }
    }, 2400);
  };

  // --- TRANSITION STATES RENDERS ---

  if (checkoutStage === 'authorizing') {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-8 bg-white border border-slate-150 rounded-[3rem] shadow-xl animate-fade-in">
        <div className="relative flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto">
          <RefreshCw size={36} className="animate-spin text-blue-600" />
          <Lock size={16} className="absolute text-blue-800" />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">Validating Safe Ledger Credentials</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Our secure proxy API is establishing tokenized signatures for your {paymentTab.toUpperCase()} payment, and locking transaction funds into ShopNexa Escrow.
          </p>
        </div>

        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl max-w-xs mx-auto border border-slate-100 text-[10px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>PLATFORM SECURE PORT:</span>
            <span className="text-blue-600 font-bold">3000 // INGRESS</span>
          </div>
          <div className="flex justify-between">
            <span>VAULT LOCK SYSTEM:</span>
            <span className="text-emerald-600 font-bold">OPERATIONAL</span>
          </div>
          <div className="flex justify-between">
            <span>AUTHORIZATION VALUE:</span>
            <span className="text-slate-850 font-bold">₹{finalCalculatedPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStage === 'failed') {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6 bg-white border border-rose-150 rounded-[3rem] shadow-xl animate-fade-in" id="failed-payment-screen">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-rose-800 uppercase tracking-tight">Escrow Security Authorization Prevented</h2>
          <p className="text-xs text-slate-550 max-w-md mx-auto leading-relaxed">
            {failedReason}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl text-[11px] text-slate-600 max-w-md mx-auto space-y-1 text-left">
          <span className="font-bold block text-slate-900 border-b border-slate-205 pb-1 uppercase tracking-wide text-[10px] font-mono">Suggested Corrective Steps:</span>
          <div className="py-2 space-y-1.5 leading-relaxed font-medium">
            <p>1. Switch payment method above (e.g. choose **Cash on Delivery** or secure **Digital Wallet**).</p>
            <p>2. Verify expiry dates, ZIP codes, and sufficient pre-cleared balances on your selected instrument.</p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={handleRestartCheckoutFlow}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition"
          >
            Adjust Payment Option
          </button>
          
          <button
            onClick={() => onNavigate('cart')}
            className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition hover:bg-slate-100"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  if (checkoutStage === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-8 bg-white border border-slate-200 rounded-[3rem] shadow-xl animate-fade-in" id="success-confirmation-screen">
        <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-300 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg transform scale-105 animate-bounce">
          <CheckCircle2 size={38} className="fill-emerald-100" />
        </div>

        <div className="space-y-3.5">
          <span className="text-[10px] font-mono font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Escrow Secures Your Investment
          </span>
          <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight leading-none">Order Secured Successfully!</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Funds are locked inside standard ShopNexa Escrow platform holding. We have synchronized the customized listing with the merchant. Handover dispatch starts in 12 hours.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 max-w-md mx-auto text-left space-y-4 font-mono text-[11px] text-slate-600">
          <div className="border-b border-dashed border-slate-200 pb-2 flex justify-between items-center">
            <span className="font-bold text-[10px] uppercase text-slate-400">Transaction ID:</span>
            <strong className="text-slate-800 text-sm">{createdOrderId}</strong>
          </div>

          <div className="space-y-1.5 select-none">
            <div className="flex justify-between">
              <span>Customer ID Key:</span>
              <span className="text-slate-800 font-bold">PREM_KUMAR_56</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode Used:</span>
              <span className="text-blue-600 font-bold uppercase">{paymentTab} Method</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery ETA:</span>
              <span className="text-emerald-600 font-bold">Standard tracked (Tuesday, May 26)</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery destination ZIP:</span>
              <span className="text-slate-800">{zip}</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-200 font-sans flex justify-between text-xs font-black text-slate-950">
            <span>Total Value Preserved:</span>
            <span>₹{finalCalculatedPayable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => onNavigate('user-dashboard')}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition shadow-lg shadow-blue-500/10"
          >
            Track in My Portal Dashboard
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition"
          >
            Continue Sourcing
          </button>
        </div>
      </div>
    );
  }

  // --- BASIC CART CHANNELS REDIRECT PREVENTATIVE ---
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6 animate-fade-in">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full">
          <AlertCircle size={32} />
        </div>
        <p className="text-xl font-bold text-slate-850">Checkout is Empty</p>
        <p className="text-xs text-slate-500">
          You must place least one premium customized listing inside your cargo cart beforehand.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition"
        >
          Check Catalog listings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 text-slate-800 animate-fade-in relative" id="checkout-workspace">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <button 
            type="button"
            onClick={() => onNavigate('cart')}
            className="text-xs font-black text-blue-600 flex items-center gap-1 hover:underline uppercase tracking-wider font-mono mb-2"
          >
            <ArrowLeft size={13} className="stroke-[2.5px]" />
            <span>Return to Cargo Cart</span>
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Transactional Checkout</h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Fill your destination parameters and choose how to securely lock transaction finances into escrow holding.
          </p>
        </div>

        {/* DEMO SWITCHER RULES */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-205 rounded-2xl p-3 text-xs w-full md:w-auto">
          <Award size={16} className="text-amber-600 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-black text-amber-900 uppercase block tracking-wider text-[9px] font-mono leading-none">Simulation Controls</span>
            <label className="flex items-center gap-2 text-[10.5px] cursor-pointer font-bold text-amber-800">
              <input 
                type="checkbox" 
                checked={forceSimulatedError}
                onChange={(e) => setForceSimulatedError(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span>Trigger Payment Failure State Simulator</span>
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SHPPING, GUESTS & PAYMENT PROTOCOLS */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* STEP 1: AUTH CHANNELS (GUEST VS LOGGED IN) */}
          <div className="bg-white border border-slate-200/85 rounded-[2rem] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-105">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <User size={15} className="text-blue-600" />
                <span>1. Checkout Account Preference</span>
              </h3>

              <button
                type="button"
                onClick={() => {
                  setIsGuest(!isGuest);
                  if (!isGuest) {
                    setFullName('Guest Explorer');
                  } else {
                    setFullName('Prem Kumar');
                  }
                }}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-600 px-3 py-1.5 rounded-xl uppercase tracking-wider font-mono transition"
              >
                {isGuest ? 'Switch to Registered (Prem Kumar)' : 'Switch to Guest Checkout'}
              </button>
            </div>

            {isGuest ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Guest Email (Secure Invoicing)</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">Invoices dispatch automatically as backup vouchers.</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mobile Contact (Delivery SMS)</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50/20 border border-blue-105/10 rounded-2xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono">
                  PK
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-900">Prem Kumar (Verified Buyer)</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase px-2 rounded-lg font-mono">
                      Level 3 Trust
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450">Logged in securely. Using pre-cleared escrow identities.</p>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: SHIPPING DESTINATION */}
          <div className="bg-white border border-slate-200/85 rounded-[2rem] p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-105">
              <MapPin size={15} className="text-blue-600" />
              <span>2. Delivery Destination Addresses</span>
            </h3>

            {/* Tap address switches */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-black text-slate-400 block tracking-widest font-mono">
                Select from Pre-Saved Addresses:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRE_SAVED_ADDRESSES.map((tmpl) => {
                  const isChosen = selectedAddressId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectAddressTemplate(tmpl)}
                      className={`text-left p-4 border rounded-2xl transition hover:border-slate-350 ${isChosen ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-50/60' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center justify-between pb-1">
                        <strong className="text-xs font-bold text-slate-900 truncate">
                          {tmpl.label}
                        </strong>
                        {isChosen ? (
                          <span className="bg-blue-600 text-white rounded-full p-0.5">
                            <Check size={10} />
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-mono font-black text-slate-400 bg-slate-100 px-2 rounded">
                            {tmpl.type}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-slate-500 truncate mt-1">{tmpl.street}</p>
                      <p className="text-[10px] text-slate-450 font-mono mt-0.5">{tmpl.city}, {tmpl.state} - {tmpl.zip}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom address inputs with auto pincide handler */}
            <div className="pt-2 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Consignee Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-550 focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-550 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">ZIP Code / Pincode</label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-550 focus:bg-white transition"
                />

                {/* Intelligent PINCODE detection label */}
                {pincodeDetected && (
                  <button
                    type="button"
                    onClick={handleApplyPincodeAutofill}
                    className="mt-1.5 w-full text-left p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-900 font-bold hover:bg-amber-100 transition animate-fade-in flex items-center justify-between"
                  >
                    <span>⚡ Detected: {pincodeDetected.city}, {pincodeDetected.state}</span>
                    <strong className="uppercase underline text-[8.5px] tracking-wide">Auto-apply Coordinates</strong>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-550"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={stateValue}
                    onChange={(e) => setStateValue(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-550"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* STEP 3: COURIER DELIVERY OPTIONS & TIME SLOTS */}
          <div className="bg-white border border-slate-200/85 rounded-[2rem] p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-105">
              <Truck size={15} className="text-blue-600" />
              <span>3. Shipping Surcharges & Slots</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('standard')}
                className={`p-3 text-left border rounded-2xl transition flex flex-col justify-between h-24 ${deliveryMethod === 'standard' ? 'border-blue-600 bg-blue-50/35' : 'border-slate-200'}`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-xs font-bold text-slate-800">Ground Rail</span>
                  <span className="text-[10px] font-black text-slate-400 font-mono">3-5 DAYS</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 mt-2">
                  {subtotal >= 1000 ? 'Free Shipping' : '₹99 Surcharge'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('express')}
                className={`p-3 text-left border rounded-2xl transition flex flex-col justify-between h-24 ${deliveryMethod === 'express' ? 'border-blue-600 bg-blue-50/35' : 'border-slate-200'}`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-xs font-bold text-slate-800">Expedited Air</span>
                  <span className="text-[10px] font-black text-slate-400 font-mono">1-2 DAYS</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 mt-2">
                  +₹150 Delivery
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('next-day')}
                className={`p-3 text-left border rounded-2xl transition flex flex-col justify-between h-24 ${deliveryMethod === 'next-day' ? 'border-blue-600 bg-blue-50/35' : 'border-slate-200'}`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-xs font-bold text-slate-800">Next-Day Cargo</span>
                  <span className="text-[10px] font-black text-slate-400 font-mono">24 HOURS</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 mt-2">
                  +₹250 Priority
                </span>
              </button>
            </div>

            {/* Time Slot choosing */}
            <div className="space-y-2.5 pt-2">
              <label className="text-[10px] uppercase font-black text-slate-400 block tracking-widest font-mono">
                Select Your Handover Time-Slot:
              </label>
              
              <div className="flex flex-wrap gap-2">
                {slotsList.map((slot) => {
                  const isPicked = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border transition ${isPicked ? 'border-slate-900 bg-slate-950 text-white font-bold' : 'border-slate-200 text-slate-600 bg-slate-50/50 hover:bg-slate-50'}`}
                    >
                      {slot.split(' ')[0]} {slot.includes('Morning') ? '🌅' : slot.includes('Afternoon') ? '☀️' : '🌆'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 4: INTERACTIVE PAYMENT METHOD SELECTION TABS */}
          <div className="bg-white border border-slate-200/85 rounded-[2rem] p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-105">
              <CreditCard size={15} className="text-blue-600" />
              <span>4. Interactive Payment Settlement Methods</span>
            </h3>

            {/* TABS GRID SELECTOR */}
            <div className="grid grid-cols-2 grid-rows-4 xs:grid-cols-4 xs:grid-rows-2 sm:grid-cols-7 sm:grid-rows-1 gap-2 text-center text-[11px]">
              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'card' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <CreditCard size={15} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'upi' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <DollarSign size={15} />
                <span>UPI ID</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('banking')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'banking' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <ShieldCheck size={15} />
                <span>Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('wallet')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'wallet' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Wallet size={15} />
                <span>Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('cod')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'cod' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Check size={15} />
                <span>COD</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('emi')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'emi' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Award size={15} className="text-emerald-600" />
                <span>EMI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('bnpl')}
                className={`py-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 font-bold ${paymentTab === 'bnpl' ? 'border-blue-600 bg-blue-50/40 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Calendar size={15} className="text-indigo-650" />
                <span>BNPL</span>
              </button>
            </div>

            {/* TAB CONTENT SPACES */}
            <div className="pt-2 animate-fade-in">
              
              {/* CONTENT 1: CREDIT CARD CONSOLE */}
              {paymentTab === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/60 p-5 rounded-2xl border border-slate-150">
                  {/* Left input panel */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">Cardholder Name (Capitals)</label>
                      <input
                        type="text"
                        placeholder="PREM KUMAR"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-sans uppercase font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">Expiry MM/YY</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">Secure CVV (3-digit)</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right interactive card mockup */}
                  <div className="bg-gradient-to-tr from-slate-900 to-slate-850 p-5 rounded-2xl text-white flex flex-col justify-between h-40 shadow-md relative overflow-hidden select-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Nexa Plat Vault</span>
                        <div className="h-6 w-8 bg-amber-400/80 rounded-md border border-amber-300"></div>
                      </div>
                      
                      {/* Logo dynamic */}
                      <div className="text-right">
                        {cardBrand === 'visa' && <span className="font-sans font-black italic text-lg text-blue-400">VISA</span>}
                        {cardBrand === 'mastercard' && <span className="font-sans font-black italic text-lg text-orange-500">Mastercard</span>}
                        {cardBrand === 'amex' && <span className="font-sans font-black italic text-lg text-indigo-400">AMEX</span>}
                        {cardBrand === 'generic' && <span className="font-sans text-xs uppercase tracking-widest text-slate-400">Card</span>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="block font-mono text-sm tracking-widest font-bold">
                        {cardNumber ? cardNumber : '•••• •••• •••• ••••'}
                      </span>
                      
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                        <div>
                          <span className="text-slate-500 block text-[7px]">Card Holder</span>
                          <span className="font-bold text-slate-205">{cardName ? cardName : 'YOUR BRAND NAME'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[7px]">Expires</span>
                          <span className="font-bold text-slate-205">{cardExpiry ? cardExpiry : 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT 2: UPI SECTOR */}
              {paymentTab === 'upi' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 space-y-4">
                  <div className="max-w-md space-y-2">
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">Enter UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="prem@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => alert('UPI ID validated! Instantly verified.')}
                        className="px-4 bg-slate-900 text-white rounded-lg text-xs font-bold font-mono"
                      >
                        Verify VPA
                      </button>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block font-medium">Verify through mobile alerts on PhonePe, GPay, or Paytm instantly.</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200/50 flex flex-col md:flex-row items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 border border-slate-150 rounded-xl flex items-center justify-center flex-shrink-0">
                      {/* Simulated QR block layout */}
                      <div className="w-full h-full bg-slate-100 border border-slate-205 flex flex-col items-center justify-center p-1 text-center font-mono text-[8px] text-slate-400 font-bold select-none leading-none">
                        <span>QR LOCK BOX</span>
                        <div className="grid grid-cols-4 gap-0.5 mt-2 max-w-[50px]">
                          {Array.from({ length: 16 }).map((_, idx) => (
                            <div key={idx} className={`w-2.5 h-2.5 ${((idx % 3 === 0) || (idx === 7)) ? 'bg-slate-905' : 'bg-slate-200'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Instant Scan QR Option</h4>
                      <p className="text-[10.5px] text-slate-500 leading-normal font-medium">
                        Need faster checkouts? Display this secure dynamic Scan Receipt code in your GPay app on your screen to complete instant payments directly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT 3: NET BANKING */}
              {paymentTab === 'banking' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 space-y-2">
                  <label className="block text-[10px] font-black text-slate-450 uppercase mb-1">Select Bank from List</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-bold"
                  >
                    <option>HDFC Premier Bank Link</option>
                    <option>State Bank Corporate Vault</option>
                    <option>ICICI Commercial Express</option>
                    <option>Axis Secure Networks</option>
                    <option>Kotak Smart Finance Portal</option>
                  </select>
                  <span className="text-[9.5px] text-slate-400 block pt-1 leading-normal font-medium">Redirects securely to high-speed banking gateways with pre-authorized API safeguards.</span>
                </div>
              )}

              {/* CONTENT 4: WALLET */}
              {paymentTab === 'wallet' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 space-y-3 text-xs font-bold">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-widest font-mono">Select Active Mobile Wallet Providers:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {['Google Wallet API', 'Apple Pay Ledger', 'Amazon Pay Vault', 'Paytm Secure'].map((w) => {
                      const isActive = selectedWallet === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSelectedWallet(w)}
                          className={`flex-1 p-2.5 border rounded-xl font-bold font-mono transition text-center ${isActive ? 'border-blue-600 bg-blue-50 text-blue-700 font-extrabold' : 'border-slate-200 bg-white'}`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CONTENT 5: CASH ON DELIVERY WITH ANTI BOT */}
              {paymentTab === 'cod' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-rose-150/40 space-y-4">
                  <div className="flex items-start gap-2.5 text-xs text-slate-650 leading-normal">
                    <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span>Secure Cash on delivery requires manual confirmation. A standard handling fee of **₹50** applies.</span>
                      <span className="block mt-1 font-bold text-slate-850">To prevent bot orders, please solve the security code lock:</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 text-white font-mono tracking-widest font-bold text-center px-4 py-2 rounded-xl text-sm select-none border border-slate-700">
                      {captchaCode}
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Type Captcha digits..."
                      required={paymentTab === 'cod'}
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="bg-white border border-slate-200 px-3 py-2 text-xs font-mono rounded-lg focus:outline-none w-36 text-center"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyCodCaptcha}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg uppercase transition"
                    >
                      Audit Code
                    </button>
                  </div>

                  {codVerified ? (
                    <p className="text-[10px] text-emerald-650 font-bold block bg-emerald-50 p-2 rounded-lg">✓ Captcha solved. COD handshakes approved!</p>
                  ) : (
                    codError && <p className="text-[10px] text-rose-500 font-bold">{codError}</p>
                  )}
                </div>
              )}

              {/* CONTENT 6: EQUATED MONTHLY EMI CALCULATOR */}
              {paymentTab === 'emi' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 space-y-4">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-slate-450 uppercase mb-1">Select Installment Plan Schedule</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[3, 6, 12].map((m) => {
                        const rate = m === 12 ? 'No-Cost' : m === 6 ? '14% p.a.' : '12% p.a.';
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setEmiMonths(m)}
                            className={`p-3 border rounded-xl text-left transition ${emiMonths === m ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-extrabold shadow-3xs' : 'border-slate-200 bg-white'}`}
                          >
                            <span className="block font-bold text-xs">{m} Months</span>
                            <span className="text-[9px] text-slate-450 block font-mono">{rate} Promo</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-100/35 border border-emerald-250/20 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="font-sans font-black">Monthly Payable installment Amount:</span>
                    <strong className="text-sm font-mono tracking-tight">₹{Number(getEmiMonthlyFee()).toLocaleString('en-IN')} / month</strong>
                  </div>
                </div>
              )}

              {/* CONTENT 7: BUY NOW PAY LATER */}
              {paymentTab === 'bnpl' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-600">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">NexaPay Later Network Approval</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Pre-approved limits detected: **₹40,000** interest-free for 15 days.</p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 font-bold cursor-pointer bg-white p-3 border border-slate-200 rounded-xl">
                    <input 
                      type="checkbox" 
                      checked={bnplTermsApproved}
                      onChange={(e) => setBnplTermsApproved(e.target.checked)}
                      required={paymentTab === 'bnpl'}
                      className="rounded accent-indigo-650 mt-0.5"
                    />
                    <span>Deploy NexaPay Later credit line for this ₹{finalCalculatedPayable.toLocaleString('en-IN')} purchase block. Settle before June 10, 2226.</span>
                  </label>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER REVIEW, DISCOUNT OVERRIDES, LOYALTY */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECURE CHECKOUT CORNER DETAILS LISTING */}
          <div className="bg-white border border-slate-200/85 rounded-[2rem] p-6 shadow-sm space-y-5">
            
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-slate-900 font-black text-[15px] uppercase tracking-wider">
                Consignee Audit Review
              </h3>
            </div>

            {/* Itemised minimalist visual rows */}
            <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 text-xs font-semibold hover:bg-slate-50 rounded-xl p-1 transition">
                  <img src={item.product.image} className="w-10 h-10 object-cover rounded-md" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-slate-800 truncate">
                      {item.product.title}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-mono block">
                      {item.quantity}x @ ₹{item.product.price} ({item.selectedSpec || 'v1'})
                    </span>
                  </div>
                  <strong className="text-slate-950 font-mono">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            {/* LOYALTY REWARDS DEDUCTION STACK INTERACTION */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 font-bold bg-slate-50 hover:bg-slate-100/70 p-3.5 border border-slate-205 rounded-2xl cursor-pointer transition select-none">
                <input 
                  type="checkbox"
                  checked={redeemLoyalty}
                  onChange={(e) => setRedeemLoyalty(e.target.checked)}
                  className="rounded accent-emerald-600 mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="block font-black text-slate-900 uppercase text-[9.5px] tracking-wide">Redeem 1,250 Nexa Coins</span>
                  <span className="text-[10px] text-slate-450 block leading-tight">Deduct exactly **₹250** instantly from final payable ledger balance.</span>
                </div>
              </label>
            </div>

            {/* GIFT CARD ENTRY BLOCK */}
            <div className="bg-slate-50/50 p-3.5 border border-slate-202 rounded-2xl space-y-2">
              <span className="text-[9px] uppercase font-black text-slate-450 block tracking-widest font-mono">Use Certified Gift Cards:</span>
              <div className="flex gap-1.5">
                <input 
                  type="text" 
                  placeholder="GIFT_NEXA_10"
                  value={giftCodeInput}
                  onChange={(e) => setGiftCodeInput(e.target.value)}
                  className="bg-white border border-slate-202 px-3 py-1.5 text-xs font-mono rounded-xl focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={handleVerifyGiftCard}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Verify
                </button>
              </div>
              {giftFeedback && (
                <p className={`text-[9.5px] font-bold ${applyGiftCard ? 'text-emerald-650' : 'text-rose-500'}`}>{giftFeedback}</p>
              )}
            </div>

            {/* REAL TIME SURCHARGES BREAKDOWN */}
            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs text-slate-600 leading-snug font-medium">
              
              <div className="flex justify-between">
                <span>Items Total Combined</span>
                <span className="font-bold text-slate-900 font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                  <span>Ledger Coupon Saved</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {redeemLoyalty && (
                <div className="flex justify-between text-emerald-650 font-bold">
                  <span>Loyalty Redeemed</span>
                  <span>-₹{LOYALTY_DISCOUNT_VALUE.toLocaleString('en-IN')}</span>
                </div>
              )}

              {applyGiftCard && (
                <div className="flex justify-between text-emerald-650 font-bold">
                  <span>Gift Cards Redeemed</span>
                  <span>-₹{giftCardDeduction.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="capitalize">Shipping Class Fee ({deliveryMethod})</span>
                <span className="font-bold text-slate-900 font-mono">₹{deliverySurcharge.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>VAT & Escrow Insurance Fee (10%)</span>
                <span className="font-bold text-slate-900 font-mono">₹{safeguardFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3.5 border-t border-slate-150 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold text-slate-850">Final Escrow Amount:</span>
                <span className="text-2xl font-black font-mono leading-none font-sans font-semibold">₹{finalCalculatedPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* TERMS & POLICIES CHECKBOX */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-[10.5px] cursor-pointer text-slate-500 select-none">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="rounded accent-blue-600 mt-1"
                />
                <span className="leading-snug font-medium">
                  By completing payment setup, I authorize Nexa-Escrow proxy holds according to standard international checkout dispute laws.
                </span>
              </label>
            </div>

            {/* CTA TRIGGER PLACING ORDER */}
            <div className="pt-2.5">
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5"
                id="btn-place-order"
              >
                <ShieldCheck size={14} className="stroke-[2.5px]" />
                <span>Place Escrow Order</span>
                <ChevronRight size={13} />
              </button>
            </div>

          </div>

          {/* SECURE CHECKOUT TRUST CORNER BANNER */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start gap-3">
            <ShieldCheck size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">ShopNexa Certified Gateway</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                Credentials are saved with 256-bit sandbox protocols. Zero personal details are stored permanently in plain text. Secure, fast, fully trusted.
              </p>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
