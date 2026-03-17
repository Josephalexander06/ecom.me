import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';

const SellerCard = ({ seller }) => (
  <div className="bg-white border border-border-default rounded-pro p-6 flex flex-col items-center text-center hover:shadow-premium transition-all">
    <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-light mb-4 border-2 border-brand-primary/10">
      <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex items-center gap-1.5 mb-1">
      <h3 className="font-bold text-text-primary">{seller.name}</h3>
      <CheckCircle2 size={14} className="text-brand-primary" fill="currentColor" fillOpacity={0.1} />
    </div>
    <p className="text-caption text-text-secondary mb-4">{seller.tagline}</p>
    
    <div className="flex items-center gap-1 text-rating mb-6">
      <Star size={14} fill="currentColor" />
      <span className="text-caption font-bold ml-1">{seller.rating}</span>
      <span className="text-caption text-text-muted">({seller.reviewCount} reviews)</span>
    </div>

    <Link 
      to={`/seller/${seller.id}`} 
      className="w-full py-2 bg-surface-secondary hover:bg-surface-tertiary text-small font-bold text-text-primary rounded-pill transition-colors"
    >
      Visit Store
    </Link>
  </div>
);

const SellerSpotlight = () => {
  const sellers = [
    {
      id: 's1',
      name: 'TechHub Elite',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80',
      tagline: 'Premium Gadgets & Hardware',
      rating: 4.9,
      reviewCount: '12.4k'
    },
    {
      id: 's2',
      name: 'Moda Luxe',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=100&q=80',
      tagline: 'Contemporary High-End Fashion',
      rating: 4.8,
      reviewCount: '8.1k'
    },
    {
      id: 's3',
      name: 'EcoLiving',
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=100&q=80',
      tagline: 'Sustainable Home Essentials',
      rating: 4.7,
      reviewCount: '5.2k'
    },
    {
      id: 's4',
      name: 'ActivePeak',
      logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      tagline: 'Professional Sports Gear',
      rating: 4.9,
      reviewCount: '9.8k'
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-bold tracking-widest mb-2">
          TRUSTED SELLERS
        </div>
        <h2 className="text-h3 md:text-h2 font-display text-text-primary">Top Sellers on ecom.me</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sellers.map(seller => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </div>
  );
};

export default SellerSpotlight;
