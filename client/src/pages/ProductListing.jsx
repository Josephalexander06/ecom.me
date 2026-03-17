import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import PageWrapper from '../components/ui/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import QuickView from '../components/product/QuickView';
import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import useIsDesktop from '../hooks/useIsDesktop';

const products = [
  {
    id: 1,
    name: 'Neural Link V4',
    brand: 'AETHER',
    description: 'The industry standard in neural interfacing. 0.2ms latency, full sensory immersion.',
    price: 2499,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800'],
    dominantColor: '#10ced1'
  },
  {
    id: 2,
    name: 'Retinal Iris Pro',
    brand: 'OPTIC',
    description: 'Hyper-visual overlays with 16K resolution directly to your optic nerve.',
    price: 1899,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1576086213369-9713438b11ad?auto=format&fit=crop&q=80&w=800'],
    dominantColor: '#7000ff'
  },
  {
    id: 3,
    name: 'Haptic Glove S1',
    brand: 'SENSE',
    description: 'Feel the digital world with sub-micron precision. Absolute physical feedback.',
    price: 999,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1558444479-2706fa53002d?auto=format&fit=crop&q=80&w=800'],
    dominantColor: '#00ff62'
  },
  {
    id: 4,
    name: 'Cognitive Thread',
    brand: 'AETHER',
    description: 'Smart-fabric apparel that monitors and interfaces with your neural bio-rhythms.',
    price: 799,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1614850523296-e8c041de8c2e?auto=format&fit=crop&q=80&w=800'],
    dominantColor: '#ffb700'
  }
];

const ProductListing = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isDesktop = useIsDesktop();
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current.querySelectorAll('.product-card');
    if (cards.length === 0) return;
    
    let ctx = gsap.context(() => {
      gsap.fromTo(cards, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: isDesktop ? 0.1 : 0.05, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <PageWrapper>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      <QuickView 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <div className="pt-20 md:pt-32 min-h-screen bg-bg-deep">
        {/* Category Banner */}
        <div className="relative h-[25vh] md:h-[40vh] w-full overflow-hidden flex items-center px-6 md:px-12">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover grayscale opacity-20"
              alt="Category Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-transparent to-bg-deep" />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <h1 className="font-display text-text-main italic">Neural Wearables</h1>
            <p className="mt-2 md:mt-4 font-mono text-accent-primary tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs">Archive 01 // Product Pool</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-20 md:top-24 z-40 px-4 md:px-12 py-3 md:py-6 glass my-4 md:my-8 flex items-center justify-between mx-auto max-w-[95%] rounded-2xl md:rounded-3xl border border-white/5">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 md:gap-3 text-white hover:text-accent-primary transition-all font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold group h-11 px-4 rounded-xl hover:bg-white/5"
            >
              <Filter size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">Configure Filter</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-white/40 font-mono text-[9px] md:text-[10px] uppercase tracking-widest">
              {products.length} Matches
            </span>
          </div>

          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 text-white hover:text-accent-primary transition-colors font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold h-11 px-4 rounded-xl hover:bg-white/5">
              Sort
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div 
          ref={gridRef} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 p-6 md:p-12 pb-24 mx-auto max-w-[1500px]"
        >
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductListing;
