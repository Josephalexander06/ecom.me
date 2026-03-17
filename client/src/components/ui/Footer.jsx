import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="mt-10 px-3 md:px-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="neo-panel rounded-2xl overflow-hidden"
      >
        <div className="bg-[#0b1530]/80 px-4 py-3 text-center text-sm text-cyan-100/90">
          You are browsing <span className="font-semibold text-cyan-200">ecom.me</span>, a modern ecommerce platform.
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-violet-200 mb-2">Platform</h3>
            <ul className="space-y-1 text-blue-100/85">
              <li>About ecom.me</li>
              <li>Careers</li>
              <li>Press feed</li>
              <li>Roadmap</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-violet-200 mb-2">Creator Network</h3>
            <ul className="space-y-1 text-blue-100/85">
              <li>Sell with us</li>
              <li>Affiliate links</li>
              <li>Live commerce</li>
              <li>Brand studio</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-violet-200 mb-2">Payments</h3>
            <ul className="space-y-1 text-blue-100/85">
              <li>Card vault</li>
              <li>Wallet sync</li>
              <li>Subscription billing</li>
              <li>Invoice center</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-violet-200 mb-2">Support</h3>
            <ul className="space-y-1 text-blue-100/85">
              <li>Track order</li>
              <li>Returns</li>
              <li>Shipping map</li>
              <li>Help center</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-blue-100/70">
          <div className="space-x-3">
            <Link to="/orders" className="hover:text-cyan-200">Orders</Link>
            <Link to="/seller/dashboard" className="hover:text-cyan-200">Seller Dashboard</Link>
            <Link to="/admin/dashboard" className="hover:text-cyan-200">Admin Dashboard</Link>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} ecom.me | Smart Commerce Infrastructure</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
