import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import useIsDesktop from '../../hooks/useIsDesktop';
import SafeImage from './SafeImage';

gsap.registerPlugin(ScrollTrigger);

const featuredProducts = [
  {
    id: 1,
    name: 'Neural Link V4',
    brand: 'AETHER',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
    color: '#10ced1'
  },
  {
    id: 2,
    name: 'Retinal Iris Pro',
    brand: 'OPTIC',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1576086213369-9713438b11ad?auto=format&fit=crop&q=80&w=800',
    color: '#7000ff'
  },
  {
    id: 3,
    name: 'Haptic Glove S1',
    brand: 'SENSE',
    price: 999,
    image: 'https://images.unsplash.com/photo-1558444479-2706fa53002d?auto=format&fit=crop&q=80&w=800',
    color: '#00ff62'
  },
  {
    id: 4,
    name: 'Cognitive Thread',
    brand: 'AETHER',
    price: 799,
    image: 'https://images.unsplash.com/photo-1614850523296-e8c041de8c2e?auto=format&fit=crop&q=80&w=800',
    color: '#ffb700'
  }
];

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isDesktop) return;

    const scrollWidth = scrollRef.current.offsetWidth;
    const windowWidth = window.innerWidth;

    let ctx = gsap.context(() => {
      gsap.to(scrollRef.current, {
        x: -(scrollWidth - windowWidth + 100),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section 
      ref={containerRef} 
      className={`min-h-screen bg-bg-surface flex flex-col justify-center px-6 md:px-12 py-24 ${isDesktop ? 'h-screen overflow-hidden' : ''}`}
    >
      <div className="mb-12">
        <h2 className="font-display text-text-main italic">Featured Gear.</h2>
        <p className="text-text-muted font-mono tracking-widest uppercase text-[10px] mt-2">Latest Neural Hardware // 2040</p>
      </div>

      <div 
        ref={scrollRef} 
        className={`${
          isDesktop 
            ? 'flex gap-8 w-max px-12' 
            : 'grid grid-cols-1 sm:grid-cols-2 gap-6'
        }`}
      >
        {featuredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial="rest"
            whileInView="visible"
            whileHover="hover"
            variants={{
              rest: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
              hover: {}
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate(`/product/${product.id}`)}
            className={`
              relative group cursor-pointer
              ${isDesktop ? 'w-[450px] h-[650px]' : 'w-full h-[500px]'}
            `}
          >
            {/* Card Main Body */}
            <div className="absolute inset-0 glass rounded-[3.5rem] border-white/5 bg-white/[0.02] overflow-hidden">
               {/* Content Block */}
               <div className="absolute bottom-12 left-12 right-12 z-20">
                  <span className="font-mono text-[8px] text-accent-primary tracking-[0.4em] mb-2 block font-bold">
                    {product.brand} // PRIME
                  </span>
                  <h3 className="text-3xl font-display text-white italic mb-4 leading-none">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono text-white/40">$ {product.price}</span>
                    <motion.div 
                        variants={{ hover: { x: 5, opacity: 1 }, rest: { x: 0, opacity: 0.5 } }}
                        className="p-3 rounded-full border border-white/10 text-white"
                    >
                        <ArrowRight size={20} />
                    </motion.div>
                  </div>
               </div>

               {/* Background Glow */}
               <div 
                  className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-1000 blur-[100px]"
                  style={{ backgroundColor: product.color }}
               />
            </div>

            {/* Spatial Product Image - Floating/Layered */}
            <motion.div 
              variants={{
                rest: { scale: 0.9, y: 0, rotate: 2 },
                hover: { scale: 1, y: -20, rotate: 0 }
              }}
              className="absolute top-12 left-10 right-10 aspect-[4/5] z-10"
            >
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <SafeImage 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[1.2s]"
                    />
                    
                    {/* Holographic Subtle Scan */}
                    <motion.div 
                      variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                      className="absolute inset-0 bg-accent-primary/5 pointer-events-none"
                    >
                         <div className="absolute top-0 left-0 w-full h-1 bg-accent-primary/40 shadow-[0_0_20px_var(--accent-primary)] animate-scan" style={{ animationDuration: '4s' }} />
                    </motion.div>
                </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
