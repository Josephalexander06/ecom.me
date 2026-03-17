import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Menu, Search, ShoppingCart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, categories } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const topLinks = useMemo(
    () => [
      { label: "Today's Deals", to: '/products?sort=deals' },
      { label: 'Customer Service', to: '/products' },
      { label: 'Registry', to: '/products' },
      { label: 'Gift Cards', to: '/products' },
      { label: 'Sell', to: '/seller/dashboard' }
    ],
    []
  );

  const onSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (category && category !== 'All') params.set('category', category);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-30 shadow">
      <div className="bg-[#131921] text-white px-3 md:px-6 py-2">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 md:gap-4">
          <Link to="/" className="font-extrabold tracking-wide text-lg md:text-2xl">
            ec<span className="text-[#ff9900]">omme</span>
          </Link>

          <div className="hidden md:flex items-center text-xs leading-tight">
            <MapPin size={16} className="mr-1 text-gray-300" />
            <div>
              <p className="text-gray-300">Deliver to</p>
              <p className="font-semibold">United States</p>
            </div>
          </div>

          <form onSubmit={onSearch} className="flex-1 flex min-w-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="hidden sm:block bg-[#f3f3f3] text-black rounded-l-md px-2 text-sm border-r border-gray-300"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="w-full min-w-0 px-3 py-2 text-sm text-black bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-black px-3 rounded-r-md"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          <nav className="hidden lg:flex items-center gap-4 text-sm">
            <Link to="/orders" className="hover:underline">
              Returns & Orders
            </Link>
            <Link to="/admin/dashboard" className="hover:underline">
              Admin
            </Link>
            <Link to="/seller/dashboard" className="hover:underline">
              Seller
            </Link>
          </nav>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1 font-semibold"
          >
            <ShoppingCart size={24} />
            <span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-2 left-4 text-[#ff9900] text-sm font-bold">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#232f3e] text-white text-sm px-3 md:px-6 py-2">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar">
          <Link to="/products" className="inline-flex items-center gap-1 whitespace-nowrap font-semibold">
            <Menu size={16} /> All
          </Link>
          {topLinks.map((link) => (
            <Link key={link.label} to={link.to} className="whitespace-nowrap hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Navbar;
