import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../ui/SafeImage';

const CategoryGrid = ({ title, items, link, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="bg-white border border-border-default rounded-pro p-6 flex flex-col h-full hover:shadow-premium transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-0 bg-brand-primary group-hover:h-full transition-all duration-700" />
      
      <h3 className="text-body font-bold text-text-primary mb-6 leading-tight group-hover:text-brand-primary transition-colors">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-4 flex-grow mb-8">
        {items.map((item, idx) => (
          <Link key={idx} to={link} className="flex flex-col gap-2 group/item cursor-pointer">
            <div className="aspect-square bg-surface-secondary rounded-xl overflow-hidden border border-border-default shadow-sm group-hover/item:border-brand-primary/30 transition-all">
               <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700 ease-out" />
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider group-hover/item:text-brand-primary transition-colors text-center line-clamp-1">{item.name}</span>
          </Link>
        ))}
      </div>

      <Link 
        to={link} 
        className="inline-flex items-center gap-2 text-caption font-bold text-brand-primary group-hover:translate-x-1 transition-transform mt-auto"
      >
        <span>Explore Collection</span>
        <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
};

const CategoryPanels = () => {
  const categories = [
    {
      title: 'Up to 60% off | Styles for men',
      link: '/products?category=Fashion',
      delay: 0,
      items: [
        { name: 'Clothing', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=300&q=80' },
        { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
        { name: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80' },
        { name: 'Bags & Luggages', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      title: 'Upgrade your home | Amazon Brands & more',
      link: '/products?category=Home',
      delay: 0.1,
      items: [
        { name: 'Smart TVs', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=300&q=80' },
        { name: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80' },
        { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80' },
        { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      title: 'Starting ₹149 | Headphones',
      link: '/products?category=Electronics',
      delay: 0.2,
      items: [
        { name: 'boAt', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=300&q=80' },
        { name: 'Sony', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80' },
        { name: 'JBL', image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?auto=format&fit=crop&w=300&q=80' },
        { name: 'Noise', image: 'https://images.unsplash.com/photo-1572569533902-3e59f217bfc1?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      title: 'Automotive essentials | Up to 60% off',
      link: '/products',
      delay: 0.3,
      items: [
        { name: 'Cleaning kits', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=300&q=80' },
        { name: 'Tyre care', image: 'https://images.unsplash.com/photo-1534005852504-20ce45ddfdd8?auto=format&fit=crop&w=300&q=80' },
        { name: 'Helmets', image: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cb9?auto=format&fit=crop&w=300&q=80' },
        { name: 'Vacuum parts', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=300&q=80' }
      ]
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <CategoryGrid key={i} {...cat} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPanels;
