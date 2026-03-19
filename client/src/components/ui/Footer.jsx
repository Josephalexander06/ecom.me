import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border-default/80 bg-white/70 backdrop-blur-sm">
      <div className="site-shell py-12 md:py-14">
        <div className="panel p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 md:gap-10">
            <div className="xl:col-span-2">
              <Link to="/" className="inline-block">
                <h2 className="font-display font-extrabold text-2xl tracking-[-0.04em]">
                  ecom<span className="text-brand-primary">.me</span>
                </h2>
              </Link>
              <p className="mt-4 text-sm md:text-base text-text-secondary max-w-md leading-relaxed">
                Enterprise-grade commerce experience with curated products, trusted delivery partners,
                and seamless checkout flows.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="h-9 w-9 rounded-full border border-border-default bg-white hover:border-brand-primary/60 text-text-muted hover:text-brand-primary grid place-items-center transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <span className="h-3.5 w-3.5 rounded-sm bg-current" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-text-muted">Shop</h3>
              <div className="mt-4 space-y-2.5 text-sm text-text-secondary">
                <Link to="/products" className="block hover:text-brand-primary">All Products</Link>
                <Link to="/products?category=Electronics" className="block hover:text-brand-primary">Electronics</Link>
                <Link to="/products?category=Fashion" className="block hover:text-brand-primary">Fashion</Link>
                <Link to="/products?category=Home" className="block hover:text-brand-primary">Home & Living</Link>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-text-muted">Support</h3>
              <div className="mt-4 space-y-2.5 text-sm text-text-secondary">
                <Link to="/orders" className="block hover:text-brand-primary">Track Order</Link>
                <a href="#" className="block hover:text-brand-primary">Shipping Policy</a>
                <a href="#" className="block hover:text-brand-primary">Return & Refund</a>
                <a href="#" className="block hover:text-brand-primary">Help Center</a>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-text-muted">Company</h3>
              <div className="mt-4 space-y-2.5 text-sm text-text-secondary">
                <a href="#" className="block hover:text-brand-primary">About</a>
                <Link to="/seller/onboarding" className="block hover:text-brand-primary">Sell on ecom.me</Link>
                <a href="#" className="block hover:text-brand-primary">Careers</a>
                <a href="#" className="block hover:text-brand-primary">Privacy</a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-5 border-t border-border-default/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-xs text-text-muted">© {new Date().getFullYear()} ecom.me. All rights reserved.</p>
            <p className="text-xs font-semibold text-text-secondary">Secure checkout. Transparent returns. Verified sellers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
