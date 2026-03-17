import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1598327105666-5b89a81a1bb4?auto=format&fit=crop&w=150&q=80' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=150&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=150&q=80' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=150&q=80' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=150&q=80' },
  { name: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=150&q=80' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1524578271613-d550ecccbaeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=150&q=80' },
  { name: 'Toys', image: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&w=150&q=80' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80' },
];

const CategoryQuickLinks = () => {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between md:justify-center gap-6 md:gap-12 min-w-max md:min-w-0">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            to={`/products?category=${cat.name}`}
            className="group flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-full overflow-hidden border border-border-default group-hover:border-brand-primary group-hover:scale-110 transition-all duration-300">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
              />
            </div>
            <span className="text-caption font-bold text-text-secondary group-hover:text-text-primary transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryQuickLinks;
