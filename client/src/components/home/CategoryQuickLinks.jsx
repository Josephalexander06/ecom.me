import React from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';

const categories = [
  { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1598327105666-5b89a81a1bb4?auto=format&fit=crop&w=150&q=80' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=150&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=150&q=80' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=150&q=80' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=150&q=80' },
  { name: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=150&q=80' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1524578271613-d550ecccbaeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=150&q=80' },
];

const CategoryQuickLinks = () => {
  return (
    <div className="overflow-x-auto no-scrollbar pb-1">
      <div className="flex items-center gap-3 md:gap-4 min-w-max">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/products?category=${cat.name}`}
            className="group panel-soft hover-lift flex flex-col items-center justify-center gap-2 min-w-[92px] md:min-w-[110px] px-3 py-3"
          >
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden ring-2 ring-white/80 shadow-sm">
              <SafeImage
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-[11px] md:text-xs font-semibold text-text-secondary group-hover:text-text-primary text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryQuickLinks;
