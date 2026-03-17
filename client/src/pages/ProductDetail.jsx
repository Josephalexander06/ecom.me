import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  CreditCard, 
  Info,
  ChevronRight,
  Layers,
  Cpu,
  Monitor
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock highly technical product data
  const product = {
    id: id,
    name: "Synapse-X Core Link v4.0",
    brand: "Neural Core Labs",
    rating: 4.8,
    reviews: 1250,
    price: 2499,
    originalPrice: 2999,
    description: "The Synapse-X Core Link represents the pinnacle of human-machine interface technology. With sub-0.002ms latency and direct neural pathway synchronization, it provides seamless control over external exoskeletons and digital environments.",
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    ],
    variants: [
      { name: "Obsidian Black", color: "#1a1a1a", priceDelta: 0 },
      { name: "Cyan Pulse", color: "#10ced1", priceDelta: 150 },
      { name: "Bio-Organic", color: "#a3e635", priceDelta: 300 }
    ],
    specs: [
      { label: "Neural Bandwidth", value: "12.4 TB/s", icon: Zap },
      { label: "Processing Latency", value: "0.002 ms", icon: Cpu },
      { label: "Battery Cycle", value: "14 Days", icon: RotateCcw },
      { label: "Display Link", value: "8K Holographic", icon: Monitor }
    ]
  };

  return (
    <div className="bg-bg-primary min-h-screen text-text-main">
      <Navbar />
      
      <main className="max-w-[1500px] mx-auto px-4 py-8 lg:py-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-muted mb-8 overflow-hidden whitespace-nowrap">
           <a href="#" className="hover:text-accent-primary">Electronics</a>
           <ChevronRight size={10} />
           <a href="#" className="hover:text-accent-primary">Neural Augments</a>
           <ChevronRight size={10} />
           <span className="text-text-main font-bold truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Section 1: Visual Stack */}
           <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-bg-surface border border-border-main group">
                 <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={product.images[selectedImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute top-6 left-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <Zap size={24} className="text-accent-primary animate-pulse" />
                 </div>
              </div>

              <div className="flex gap-4">
                 {product.images.map((img, i) => (
                    <button 
                       key={i}
                       onClick={() => setSelectedImage(i)}
                       className={`flex-1 aspect-video rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-accent-primary' : 'border-border-main hover:border-text-dim'}`}
                    >
                       <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                 ))}
              </div>
           </div>

           {/* Section 2: Command Center (Buy Box) */}
           <div className="lg:col-span-5 space-y-8">
              <header className="space-y-4">
                 <div className="flex items-center gap-2 text-accent-primary font-mono text-xs uppercase tracking-[0.2em] font-black">
                    <Layers size={14} /> Neural Interface Generation 4
                 </div>
                 <h1 className="text-4xl lg:text-5xl font-display font-black italic tracking-tighter leading-none">
                    {product.name.split(' ').slice(0, -1).join(' ')} <span className="text-accent-primary">{product.name.split(' ').slice(-1)}</span>
                 </h1>
                 
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                       <div className="flex text-accent-warning">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                          ))}
                       </div>
                       <span className="text-sm font-bold font-mono ml-1">{product.rating}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-border-main" />
                    <span className="text-sm text-text-muted hover:text-accent-primary cursor-pointer underline underline-offset-4 font-mono">{product.reviews} In-situ Reviews</span>
                 </div>
              </header>

              <div className="h-[2px] w-full bg-gradient-to-r from-accent-primary/20 via-border-main to-transparent" />

              <div className="space-y-6">
                 <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-display font-black text-text-main">${product.price + product.variants[selectedVariant].priceDelta}</span>
                    <span className="text-xl text-text-dim line-through font-mono">${product.originalPrice}</span>
                    <span className="px-3 py-1 bg-accent-warning text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                       Limit-Time Deal
                    </span>
                 </div>
                 <p className="text-text-muted leading-relaxed font-body">
                    {product.description}
                 </p>
              </div>

              {/* Variants Selector */}
              <div className="space-y-4">
                 <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted flex items-center justify-between">
                    Color Profile: <span className="text-text-main font-bold">{product.variants[selectedVariant].name}</span>
                 </span>
                 <div className="flex gap-4">
                    {product.variants.map((variant, i) => (
                       <button 
                          key={i}
                          onClick={() => setSelectedVariant(i)}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${selectedVariant === i ? 'border-accent-primary scale-110 shadow-[0_0_20px_rgba(16,206,209,0.3)]' : 'border-bg-surface hover:border-text-dim'}`}
                          style={{ backgroundColor: variant.color }}
                       />
                    ))}
                 </div>
              </div>

              {/* Technical Grid */}
              <div className="grid grid-cols-2 gap-4">
                 {product.specs.map((spec, i) => {
                    const Icon = spec.icon;
                    return (
                       <div key={i} className="p-4 bg-bg-surface rounded-2xl border border-border-main flex items-center gap-4 group hover:border-accent-primary/30 transition-all">
                          <div className="p-2 bg-accent-primary/5 text-accent-primary rounded-xl group-hover:bg-accent-primary group-hover:text-white transition-colors">
                             <Icon size={18} />
                          </div>
                          <div>
                             <p className="text-[8px] text-text-dim uppercase tracking-widest font-bold">{spec.label}</p>
                             <p className="text-xs font-mono font-black text-text-main">{spec.value}</p>
                          </div>
                       </div>
                    );
                 })}
              </div>

              {/* Action Stacks */}
              <div className="pt-8 space-y-4">
                 <div className="flex gap-4">
                    <div className="w-32 bg-bg-surface rounded-2xl border border-border-main flex items-center justify-center gap-4 px-4 overflow-hidden">
                       <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-text-muted hover:text-text-main">-</button>
                       <span className="font-mono font-bold text-text-main">{quantity}</span>
                       <button onClick={() => setQuantity(q => q + 1)} className="text-text-muted hover:text-text-main">+</button>
                    </div>
                    <button className="flex-1 bg-accent-primary hover:bg-text-main text-white hover:text-bg-primary py-5 rounded-2xl font-display font-black italic text-lg transition-all flex items-center justify-center gap-3 shadow-2xl group active:scale-95">
                       <ShoppingCart size={24} className="group-hover:translate-x-1 transition-transform" />
                       Initialize Uplink
                    </button>
                 </div>
                 
                 <button className="w-full bg-bg-secondary hover:bg-border-main text-text-main py-5 rounded-2xl font-mono text-[10px] uppercase tracking-[0.3em] font-black transition-all border border-border-main flex items-center justify-center gap-3">
                    <CreditCard size={18} /> Direct Buy 0x7E
                 </button>
              </div>

              {/* Safety/Trust Badges */}
              <div className="flex items-center justify-between p-6 bg-accent-success/5 border border-accent-success/20 rounded-2xl opacity-80">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-accent-success" />
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-text-main font-bold">Bio-Privacy Guaranteed</p>
                        <p className="text-[8px] text-text-muted font-body">Section 9 Neural Protection Shield active.</p>
                    </div>
                 </div>
                 <Info size={16} className="text-text-dim cursor-help" />
              </div>
           </div>
        </div>
        
        {/* Technical Deep-Dive (Specs Comparison) */}
        <section className="mt-24 space-y-12">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-display font-black italic">Technical Blueprint.</h2>
                <p className="text-text-muted max-w-2xl mx-auto font-body">Every Synapse-X unit is meticulously calibrated in our orbital laboratories to ensure biological parity and maximum neural bandwidth.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { title: "Quantum Logic Density", desc: "4.2 petasynapses per square millimeter for unparalleled processing power.", icon: Cpu },
                 { title: "Neural Sync Shield", desc: "Military-grade 2048-bit cerebral encryption prevents unauthorized neural breaches.", icon: ShieldCheck },
                 { title: "Haptic Micro-motors", desc: "3,000 localized haptic nodes provide ultra-precise sensory feedback.", icon: Zap }
               ].map((feature, i) => (
                  <div key={i} className="bg-bg-surface p-10 rounded-[2.5rem] border border-border-main hover:shadow-xl transition-all group">
                     <div className="w-14 h-14 rounded-3xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-8 group-hover:scale-110 transition-transform">
                        <feature.icon size={28} />
                     </div>
                     <h4 className="text-xl font-display font-bold italic mb-4">{feature.title}</h4>
                     <p className="text-text-muted text-sm leading-relaxed font-body">{feature.desc}</p>
                  </div>
               ))}
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
