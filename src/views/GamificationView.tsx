import React, { useState, useEffect } from 'react';
import { 
  Trophy, Award, Gift, Clock, Sparkles, User, Star, StarOff, CheckCheck, 
  RefreshCw, Copy, Check, Users, ShieldCheck, ChevronRight, Zap, Play, ChevronDown
} from 'lucide-react';
import { Product } from '../types';

interface GamificationViewProps {
  products: Product[];
  onNavigate: (view: string, extra?: any) => void;
  user: { name: string; email: string; role: string } | null;
}

interface CheckInDay {
  day: number;
  reward: number;
  label: string;
  claimed: boolean;
  isToday: boolean;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  products,
  onNavigate,
  user,
}) => {
  // --- 1. STATE DRIVERS ---
  const [loyaltyCoins, setLoyaltyCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nexa_loyalty_coins');
      return saved ? parseInt(saved) : 450;
    } catch {
      return 450;
    }
  });

  const [experiencePoints, setExperiencePoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nexa_experience_points');
      return saved ? parseInt(saved) : 1200;
    } catch {
      return 1200;
    }
  });

  const saveRewardsState = (coins: number, xp: number) => {
    setLoyaltyCoins(coins);
    setExperiencePoints(xp);
    try {
      localStorage.setItem('nexa_loyalty_coins', coins.toString());
      localStorage.setItem('nexa_experience_points', xp.toString());
    } catch (e) {}
  };

  // --- 2. DAILY CHECK-IN REWARDS CALENDAR ---
  const [checkInDays, setCheckInDays] = useState<CheckInDay[]>([
    { day: 1, reward: 15, label: "+15 Coins", claimed: true, isToday: false },
    { day: 2, reward: 20, label: "+20 Coins", claimed: true, isToday: false },
    { day: 3, reward: 25, label: "+25 Coins", claimed: false, isToday: true },
    { day: 4, reward: 30, label: "+30 Coins", claimed: false, isToday: false },
    { day: 5, reward: 35, label: "+35 Coins", claimed: false, isToday: false },
    { day: 6, reward: 50, label: "+50 Mega", claimed: false, isToday: false },
    { day: 7, reward: 100, label: "👑 Jackpot", claimed: false, isToday: false },
  ]);

  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const handleClaimCheckIn = (dayNum: number) => {
    if (hasCheckedInToday) return;

    setCheckInDays(prev => prev.map(d => {
      if (d.day === dayNum && d.isToday && !d.claimed) {
        const nextCoins = loyaltyCoins + d.reward;
        const nextXp = experiencePoints + 50;
        saveRewardsState(nextCoins, nextXp);
        setHasCheckedInToday(true);
        alert(`🎉 Checked In! Settle into Day ${dayNum}. You claimed +${d.reward} Nexa Coins and earned +50 Experience points!`);
        return { ...d, claimed: true };
      }
      return d;
    }));
  };

  // --- 3. SPIN-THE-WHEEL GAME ---
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const prizes = [
    { label: "+10 Coins", color: "bg-slate-900", value: 10, type: "coins" },
    { label: "+50 Coins", color: "bg-blue-950", value: 50, type: "coins" },
    { label: "15% Coupon", color: "bg-indigo-950", value: "VIP15", type: "coupon" },
    { label: "+100 Coins", color: "bg-slate-950", value: 100, type: "coins" },
    { label: "Free Shipping", color: "bg-blue-900", value: "FREESHIP", type: "shipping" },
    { label: "+30 Coins", color: "bg-indigo-900", value: 30, type: "coins" },
  ];

  const handleSpinTheWheel = () => {
    if (isSpinning) return;
    
    // Cost of spin: 20 Coins
    if (loyaltyCoins < 20) {
      alert("⚠️ Insufficient coins. Wheel spins cost 20 Nexa Coins!");
      return;
    }

    setIsSpinning(true);
    setSpinResult(null);

    // Dynamic rotation degree calculation
    const currentCoins = loyaltyCoins - 20;
    saveRewardsState(currentCoins, experiencePoints);

    const extraRots = 5 * 360; // 5 full rotations
    const targetIdx = Math.floor(Math.random() * prizes.length);
    const targetDeg = extraRots + (targetIdx * (360 / prizes.length));
    
    setSpinDeg(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prizeWon = prizes[targetIdx];
      setSpinResult(prizeWon.label);

      let finalCoins = currentCoins;
      if (prizeWon.type === 'coins' && typeof prizeWon.value === 'number') {
        finalCoins += prizeWon.value;
      }
      
      saveRewardsState(finalCoins, experiencePoints + 30);
      alert(`🎡 Spin complete! The wheel landed on [${prizeWon.label}]. Your account has been credited!`);
    }, 4000);
  };

  // --- 4. SCRATCH CARD ENGINE ---
  const [isScratched, setIsScratched] = useState(false);
  const [scratchReward, setScratchReward] = useState<{ label: string; coins: number } | null>(null);
  const [scratchStatus, setScratchStatus] = useState<'idle' | 'scratching' | 'claimed'>('idle');

  const handleScratchAction = () => {
    if (scratchStatus !== 'idle') return;
    setScratchStatus('scratching');

    // Cost: 30 Coins
    if (loyaltyCoins < 30) {
      alert("⚠️ You need 30 Nexa Coins to buy a golden scratch card!");
      setScratchStatus('idle');
      return;
    }

    const deductedCoins = loyaltyCoins - 30;
    saveRewardsState(deductedCoins, experiencePoints);

    setTimeout(() => {
      const isJackpot = Math.random() > 0.7;
      const amountGained = isJackpot ? 150 : 60;
      const labelText = isJackpot ? "👑 JACKPOT OVERLAY MULTIPLIER" : "⭐ STANDARD SCRATCH MATCH";

      setScratchReward({
        label: labelText,
        coins: amountGained
      });

      const updatedCoins = deductedCoins + amountGained;
      saveRewardsState(updatedCoins, experiencePoints + 40);
      setScratchStatus('claimed');
    }, 1500);
  };

  const handleResetScratch = () => {
    setScratchStatus('idle');
    setScratchReward(null);
  };

  // --- 5. REVIEW AND EARN POINTS ---
  const [targetProduct, setTargetProduct] = useState<string>('p1');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewEarningsClaimed, setReviewEarningsClaimed] = useState(false);

  const handleSubmitReviewEarn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewText.length < 10) {
      alert("⚠️ Feedback comments must stand longer than 10 characters to verify reward compliance!");
      return;
    }

    const nextCoins = loyaltyCoins + 35;
    const nextXp = experiencePoints + 60;
    saveRewardsState(nextCoins, nextXp);
    
    setReviewEarningsClaimed(true);
    setReviewText('');
    alert(`⭐ Review Published! Your buyer review has been verified through our multi-vendor ledger, claiming +35 Nexa Coins and +60 XP directly to your profile. Good job!`);
    setTimeout(() => setReviewEarningsClaimed(false), 5000);
  };

  // --- 6. VIP MEMBERSHIP TIER DECODER ---
  const getVIPTier = (xpValue: number) => {
    if (xpValue < 500) return { name: "Bronze Novice", color: "from-amber-700 to-amber-900", next: 500, nextName: "Silver Explorer", discount: "0%" };
    if (xpValue >= 500 && xpValue < 1500) return { name: "Silver Explorer", color: "from-slate-400 to-slate-600", next: 1500, nextName: "Gold Elite", discount: "2%" };
    if (xpValue >= 1500 && xpValue < 3000) return { name: "Gold Elite", color: "from-yellow-500 to-amber-600", next: 3000, nextName: "Platinum Diamond", discount: "4%" };
    return { name: "Platinum Diamond VIP", color: "from-blue-600 to-indigo-900", next: 10000, nextName: "Infinity Club", discount: "6%" };
  };

  const activeVIP = getVIPTier(experiencePoints);

  return (
    <div className="space-y-12 pb-24 text-slate-900 animate-fade-in" id="gamification-center-arena">
      
      {/* WALLET & STATUS HIGH LEVEL OVERVIEW */}
      <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* VIP Status and XP */}
        <div className="flex gap-4 items-center text-left w-full md:w-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy size={32} className="fill-slate-950" />
          </div>
          <div className="space-y-1.5 flex-1 md:flex-initial">
            <div className="flex items-center gap-1.5">
              <span className={`bg-gradient-to-r ${activeVIP.color} text-white font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl`}>
                {activeVIP.name}
              </span>
              <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider">Level Progress</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase leading-none">
              {user?.name || "Prem Kumar"}
            </h2>

            {/* Progress bar to next tier */}
            <div className="space-y-1 w-full md:w-64 pt-1">
              <div className="flex justify-between items-center text-[9px] font-bold font-mono text-slate-400">
                <span>XP: {experiencePoints} / {activeVIP.next}</span>
                <span>Tier Up to {activeVIP.nextName}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/40">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((experiencePoints / activeVIP.next) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nexa Vault Balance */}
        <div className="bg-slate-950 text-white rounded-[2rem] border border-slate-800 p-6 flex items-center justify-between gap-12 w-full md:w-auto shrink-0 relative overflow-hidden select-all shadow-md">
          <div className="space-y-1 text-left relative z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] font-mono block">Nexa Loyalty Vault Balance</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-amber-400 font-mono tracking-tight leading-none">
                {loyaltyCoins}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Nexa Coins</span>
            </div>
            <p className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider font-mono">
              ★ 100 coins = $1.00 escrow discount credit
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 relative z-10">
            <Award size={24} className="animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* REWARDS MATRIX: DAILY CHECK-IN & GAMES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DAILY REWARDS CALENDAR (COL SPAN 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-250/60 rounded-[2.5rem] p-6 space-y-5 shadow-sm text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-indigo-600 font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Clock size={14} /> Daily Check-In streak board
            </span>
            <span className="text-[10px] bg-slate-50 border border-slate-150 font-bold uppercase font-mono px-2 py-0.5 rounded text-slate-500">
              Active Streak
            </span>
          </div>

          <p className="text-xs text-slate-520 leading-relaxed font-semibold">
            Claim coins by logging into ShopNexa daily! Sustaining streak rewards unlocks progressive jackpot milestones on Day 7.
          </p>

          {/* Streak Days block layout */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {checkInDays.map((day) => {
              const isClaimable = day.isToday && !day.claimed && !hasCheckedInToday;
              return (
                <button
                  key={day.day}
                  onClick={() => handleClaimCheckIn(day.day)}
                  disabled={!isClaimable}
                  className={`p-3.5 rounded-2.5xl transition-all border text-center flex flex-col justify-between h-24 ${day.claimed ? 'bg-indigo-50 border-indigo-150 text-indigo-900' : isClaimable ? 'bg-amber-50 border-amber-300 text-amber-900 hover:scale-102 ring-4 ring-amber-100' : 'bg-slate-50 border-slate-150 text-slate-405'}`}
                >
                  <span className="block text-[9px] font-black uppercase font-mono text-slate-400">DAY {day.day}</span>
                  
                  <div className="flex items-center justify-center my-1.5">
                    {day.claimed ? (
                      <CheckCheck size={18} className="text-indigo-600" />
                    ) : (
                      <span className="font-mono text-xs font-black">{day.reward}</span>
                    )}
                  </div>

                  <span className={`block text-[8px] font-bold uppercase tracking-wider ${day.claimed ? 'text-indigo-600' : isClaimable ? 'text-amber-800 animate-pulse' : 'text-slate-400'}`}>
                    {day.claimed ? "Claimed" : day.isToday ? "Claim!" : day.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs font-mono font-bold text-slate-500">
            <span>TODAY INVENTORY CLAIM:</span>
            <span className={hasCheckedInToday ? "text-indigo-600" : "text-amber-600 animate-pulse"}>
              {hasCheckedInToday ? "✓ COMPLETED TODAY" : "⚡ UNCLAIMED PORTAL READY"}
            </span>
          </div>
        </div>

        {/* PLAYGROUND: WHEEL & SCRATCH CARD (COL SPAN 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-250/60 rounded-[2.5rem] p-6 space-y-6 shadow-sm text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* SPIN THE WHEEL GAME BLOCK */}
            <div className="space-y-4">
              <span className="flex items-center gap-1 bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-xl w-fit">
                🎡 NexaAI Spin Wheel Match
              </span>
              <p className="text-[11px] text-slate-520 font-medium">
                Cost of Entrance: <strong className="text-slate-800">20 Nexa Coins</strong> per spin drawing. Win exclusive high-save VIP codes or coin jackpots!
              </p>

              {/* Wheel graphics display */}
              <div className="flex flex-col items-center justify-center pt-2 space-y-5">
                <div className="relative w-40 h-40 rounded-full border-4 border-slate-950 flex items-center justify-center overflow-hidden shadow">
                  {/* CSS Wheel rotation block */}
                  <div 
                    className="absolute inset-0 transition-transform duration-4000 cubic-bezier(0.1, 0.8, 0.3, 1)"
                    style={{ transform: `rotate(${spinDeg}deg)` }}
                  >
                    {/* Visual segments representation */}
                    <div className="w-full h-full relative" style={{ background: "conic-gradient(#1E293B 0deg 60deg, #0F172A 60deg 120deg, #172554 120deg 180deg, #1E1B4B 180deg 240deg, #312E81 240deg 300deg, #1D4ED8 300deg 360deg)" }}>
                      {prizes.map((p, i) => (
                        <div 
                          key={i}
                          className="absolute text-[8px] font-mono text-slate-200 font-extrabold"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 60 + 30}deg) translateY(-54px)`,
                            transformOrigin: "center center"
                          }}
                        >
                          {p.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Central Hub Button Indicator */}
                  <div className="absolute w-10 h-10 rounded-full bg-white border-4 border-amber-500 shadow flex items-center justify-center z-10 text-slate-950">
                    <Zap size={14} className="fill-amber-500 text-amber-500" />
                  </div>

                  {/* Top Pointer Indicator */}
                  <div className="absolute top-0 left-12/12 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-amber-500 z-10"></div>
                </div>

                <div className="w-full space-y-2">
                  <button
                    onClick={handleSpinTheWheel}
                    disabled={isSpinning || loyaltyCoins < 20}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 disabled:bg-slate-200 text-white hover:text-amber-400 text-xs font-black uppercase tracking-wider rounded-xl transition shadow"
                  >
                    {isSpinning ? "Spinning..." : "SPIN FOR 20 COINS"}
                  </button>

                  {spinResult && (
                    <div className="text-center p-2 bg-indigo-50 border border-indigo-150 rounded-xl text-xs font-bold leading-relaxed text-indigo-900 animate-fade-in">
                      🎉 You won: <strong className="text-indigo-950 font-black">{spinResult}</strong>!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MYSTERY SCRATCH CARD BLOCK */}
            <div className="space-y-4">
              <span className="flex items-center gap-1 bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-xl w-fit">
                🔑 Interactive Golden Scratcher
              </span>
              <p className="text-[11px] text-slate-520 font-medium">
                Cost of scratch: <strong className="text-slate-800">30 Nexa Coins</strong>. Unlocks mystery payouts up to <strong className="text-amber-600">+150 Coins</strong>!
              </p>

              {/* Scratcher container display */}
              <div className="flex flex-col items-center justify-center pt-2 space-y-5">
                <div className="w-full h-40 bg-slate-100 border border-slate-200 rounded-2.5xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-4">
                  {scratchStatus === 'idle' && (
                    <div className="text-center space-y-2 relative z-10">
                      <span className="block text-2xl">⏳</span>
                      <strong className="block text-xs font-black text-slate-700">GOLDEN SCRATCH CARD</strong>
                      <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">30 Coin investment</span>
                    </div>
                  )}

                  {scratchStatus === 'scratching' && (
                    <div className="text-center space-y-2 animate-pulse">
                      <RefreshCw size={18} className="animate-spin text-indigo-650 mx-auto" />
                      <span className="block text-[10px] text-slate-500 font-bold uppercase font-mono tracking-widest">Scrubbing metallic overlay...</span>
                    </div>
                  )}

                  {scratchStatus === 'claimed' && scratchReward && (
                    <div className="text-center space-y-2 animate-fade-in relative z-10 bg-gradient-to-tr from-amber-50 to-indigo-50 border border-amber-200 p-4 rounded-xl shadow w-full">
                      <span className="text-2xl block">🌟</span>
                      <strong className="block text-[10px] uppercase font-black tracking-widest font-mono text-amber-800 leading-none">{scratchReward.label}</strong>
                      <span className="block text-2xl font-black font-mono text-indigo-900">+{scratchReward.coins} COINS</span>
                      <button 
                        onClick={handleResetScratch} 
                        className="text-[9px] font-bold underline font-mono text-slate-400 hover:text-slate-650 tracking-wide block mx-auto"
                      >
                        Buy Another Card
                      </button>
                    </div>
                  )}

                  {/* Grayed metallic scratch board cover overlay */}
                  {scratchStatus === 'idle' && (
                    <div className="absolute inset-2 bg-gradient-to-tr from-yellow-300 via-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow border border-yellow-250 select-none cursor-pointer">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#5C3005] animate-pulse">SCRATCH PORTAL</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleScratchAction}
                  disabled={scratchStatus !== 'idle' || loyaltyCoins < 30}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 disabled:bg-slate-200 text-white hover:text-amber-400 text-xs font-black uppercase tracking-wider rounded-xl transition shadow"
                >
                  {scratchStatus === 'scratching' ? "Scrubbing..." : "Scratch for 30 Coins"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* LOWER ROW: REVIEW AND EARN SCHEMES AND REFERRAL MILESTONES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        
        {/* REVIEW AND CLAIM REWARD PANEL */}
        <div className="bg-white border border-slate-250/60 rounded-[2.5rem] p-6 text-left flex flex-col justify-between space-y-5 shadow-sm">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
              <Award size={12} className="fill-amber-800 text-amber-800" />
              <span>REVIEW & EARN LOYALTY PORTAL</span>
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight leading-tight">
              Publish Feedback to Fuel Your Wallet!
            </h3>
            <p className="text-xs text-slate-520 font-medium leading-relaxed">
              We incentivize quality product assessments. Submit review logs on multi-vendor products to help buyers purchase with confidence, instantly unlocking **+35 Coins** per verified submission.
            </p>
          </div>

          {/* Form inside playground */}
          <form onSubmit={handleSubmitReviewEarn} className="bg-slate-50 border border-slate-200 rounded-2.5xl p-4.5 space-y-3">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block mb-1">Target Product Variant</label>
              <select 
                value={targetProduct} 
                onChange={(e) => setTargetProduct(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
                ))}
              </select>
            </div>

            {/* Rating Stars Selection */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">RATING:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(starNum => (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => setReviewRating(starNum)}
                    className="p-1 text-amber-500 group transition hover:scale-110"
                  >
                    <Star size={18} className={reviewRating >= starNum ? 'fill-amber-500 text-amber-500' : 'text-slate-300'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block mb-1">Write Feedback Comment</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Talk about component texture, shipping logs, sound quality, overall metrics..."
                rows={2}
                className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider"
            >
              Publish Review & Credit +35 Coins
            </button>
          </form>

          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs font-mono font-bold text-slate-500 leading-none">
            <span>Verified Escrow reviewer status:</span>
            <span className="text-emerald-600 uppercase font-black">🌟 ACTIVE AND ELIGIBLE</span>
          </div>
        </div>

        {/* EXCLUSIVE VIP MEMBERSHIP BENEFIT LIST */}
        <div className="bg-slate-950 text-white rounded-[2.5rem] p-6 text-left flex flex-col justify-between space-y-5 shadow-lg border border-slate-850">
          <div className="space-y-3.5">
            <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-305 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Trophy size={12} className="text-blue-400" />
              <span>SHOPNEXA EXCLUSIVE COIN PRIVILEGES</span>
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
              Unlock Elite Benefits as You level Up!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Your VIP status holds cash value. Spend on listings to build Experience Points and claim lifetime discounts directly integrated under checkout rules!
            </p>
          </div>

          {/* Benefits matrix lists */}
          <div className="space-y-3 pt-1">
            {[
              { tier: "🥉 Bronze Novice", spend: "Under 500 XP", perk: "Standard 100% Secure Escrow features, base checkout queues." },
              { tier: "🥈 Silver Explorer", spend: "500 - 1500 XP", perk: "2% lifetime discount surcharge deduction, early vendor catalog notifications." },
              { tier: "🥇 Gold Elite Member", spend: "1500 - 3000 XP", perk: "4% flat checkout savings, zero-cost express logistics upgrades." },
              { tier: "👑 Platinum Diamond VIP", spend: "Over 3000 XP", perk: "6% flat pricing drop on all multi-vendor listings, direct live support managers." }
            ].map((vipObj, idx) => {
              const isActive = (idx === 0 && experiencePoints < 500) || 
                               (idx === 1 && experiencePoints >= 500 && experiencePoints < 1500) ||
                               (idx === 2 && experiencePoints >= 1500 && experiencePoints < 3000) ||
                               (idx === 3 && experiencePoints >= 3000);

              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2.5xl flex flex-col justify-between gap-1.5 border transition ${isActive ? 'bg-indigo-950 border-blue-900/60 shadow-xl' : 'bg-slate-900 border-slate-850 opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black text-slate-100">{vipObj.tier}</strong>
                    <span className="font-mono text-[9px] font-black text-blue-400 uppercase tracking-widest">{vipObj.spend}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{vipObj.perk}</p>

                  {isActive && (
                    <span className="self-end text-[8.5px] font-mono font-black text-emerald-400 uppercase flex items-center gap-0.5 leading-none bg-emerald-950 px-2 py-0.5 rounded mt-1">
                      ✓ Active Account Level
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">
            ★ Settle escrow accounts safely under VIP terms of validation
          </p>
        </div>

      </div>

    </div>
  );
};
