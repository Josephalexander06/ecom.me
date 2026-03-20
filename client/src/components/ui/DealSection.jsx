import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart, Clock } from 'lucide-react';
import SafeImage from './SafeImage';

const deals = [
  {
    id: 1,
    name: "Basic Neural Uplink - Batch 04",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/deal_basic_uplink_1773542364923.png",
    discount: 45,
    originalPrice: 1200,
    dealPrice: 660,
    sold: 78,
    stock: 100
  },
  {
    id: 2,
    name: "Combat Retinal V1 (Factory Second)",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/deal_combat_retinal_1773542387108.png",
    discount: 60,
    originalPrice: 3500,
    dealPrice: 1400,
    sold: 92,
    stock: 120
  },
  {
    id: 3,
    name: "Somatic Vibe-Patch (5-pack)",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/deal_vibration_haptics_1773542401669.png",
    discount: 30,
    originalPrice: 450,
    dealPrice: 315,
    sold: 45,
    stock: 150
  },
  {
    id: 4,
    name: "Organic Bio-Drive 256GB",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/deal_bio_drive_1773542416382.png",
    discount: 25,
    originalPrice: 800,
    dealPrice: 600,
    sold: 12,
    stock: 80
  }
];

const DealSection = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-6 md:py-8 px-4 md:px-6 shadow-sm mb-6 rounded-sm">
      <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <h2 className="text-text-main text-xl font-bold tracking-tight">Deals of the Day</h2>
          <div className="flex items-center gap-2">
             <Clock size={18} className="text-accent-primary" />
             <span className="text-text-dim text-sm font-medium">
               {String(timeLeft.h).padStart(2, '0')}h : {String(timeLeft.m).padStart(2, '0')}m : {String(timeLeft.s).padStart(2, '0')}s Left
             </span>
          </div>
        </div>
        <button className="bg-accent-primary text-white text-xs font-bold px-6 py-2.5 rounded-sm shadow-md hover:brightness-110 transition-all uppercase">
          View All
        </button>
      </div>

      <div className="flex gap-4 md:gap-10 overflow-x-auto no-scrollbar pb-2 pt-2">
        {deals.map((deal) => (
          <div key={deal.id} className="min-w-[150px] md:min-w-[200px] flex flex-col items-center text-center group cursor-pointer transition-transform hover:scale-105">
             <div className="w-24 h-24 md:w-40 md:h-40 mb-4 flex items-center justify-center p-2">
                <SafeImage src={deal.image} alt={deal.name} className="max-w-full max-h-full object-contain" />
             </div>
             <h3 className="text-[14px] font-medium text-text-main mb-1 line-clamp-1">{deal.name}</h3>
             <div className="flex flex-col gap-0.5">
                <span className="text-accent-success text-[14px] font-medium">Extra {deal.discount}% Off</span>
                <span className="text-text-muted text-[12px] opacity-70">Grab it Now!</span>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealSection;
