import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border-default pt-16 pb-8 mt-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h1 className="font-display font-black text-2xl tracking-tighter text-text-primary italic">
                ecom<span className="text-brand-primary">.me</span>
              </h1>
            </Link>
            <p className="text-small text-text-secondary leading-relaxed max-w-sm">
              Discover a curated selection of premium products. Experience the future of shopping with our seamless, secure, and lightening-fast commerce infrastructure.
            </p>
            <div className="flex gap-4 mt-6">
               {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                 <a key={social} href="#" className="w-10 h-10 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all">
                   <span className="sr-only">{social}</span>
                   <div className="w-4 h-4 bg-current rounded-sm" />
                 </a>
               ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-text-primary mb-6 uppercase tracking-wider text-caption">Shop</h3>
            <ul className="space-y-4 text-small text-text-secondary">
              <li><Link to="/products" className="hover:text-brand-primary transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-brand-primary transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-brand-primary transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Home" className="hover:text-brand-primary transition-colors">Home & Living</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-text-primary mb-6 uppercase tracking-wider text-caption">Support</h3>
            <ul className="space-y-4 text-small text-text-secondary">
              <li><Link to="/orders" className="hover:text-brand-primary transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Return & Refund</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-text-primary mb-6 uppercase tracking-wider text-caption">Company</h3>
            <ul className="space-y-4 text-small text-text-secondary">
              <li><a href="#" className="hover:text-brand-primary transition-colors">About Us</a></li>
              <li><Link to="/seller/onboarding" className="hover:text-brand-primary transition-colors">Sell on ecom.me</Link></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-default flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption text-text-muted">
            © {new Date().getFullYear()} ecom.me. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex gap-2 grayscale opacity-50">
                <div className="w-8 h-5 bg-text-primary/20 rounded-sm" />
                <div className="w-8 h-5 bg-text-primary/20 rounded-sm" />
                <div className="w-8 h-5 bg-text-primary/20 rounded-sm" />
             </div>
             <p className="text-caption text-text-muted font-bold italic">Secure Checkout Guarantee</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
