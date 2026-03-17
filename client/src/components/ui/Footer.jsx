import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-8">
      <div className="bg-[#37475A] text-white text-center py-3 text-sm">Back to top</div>

      <div className="bg-[#232F3E] text-white">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Get to Know Us</h3>
            <ul className="space-y-1 text-gray-200">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Investor Relations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Make Money with Us</h3>
            <ul className="space-y-1 text-gray-200">
              <li>Sell products</li>
              <li>Advertise</li>
              <li>Affiliate</li>
              <li>Vendor support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Payment Products</h3>
            <ul className="space-y-1 text-gray-200">
              <li>Business Card</li>
              <li>Shop with Points</li>
              <li>Reload balance</li>
              <li>Currency converter</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Let Us Help You</h3>
            <ul className="space-y-1 text-gray-200">
              <li>Your account</li>
              <li>Your orders</li>
              <li>Shipping rates</li>
              <li>Help</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#131A22] text-gray-300 py-4 text-center text-xs px-3">
        <div className="space-x-3">
          <Link to="/orders" className="hover:underline">Orders</Link>
          <Link to="/seller/dashboard" className="hover:underline">Seller Dashboard</Link>
          <Link to="/admin/dashboard" className="hover:underline">Admin Dashboard</Link>
        </div>
        <p className="mt-2">© 2026 ecomme marketplace</p>
      </div>
    </footer>
  );
};

export default Footer;
