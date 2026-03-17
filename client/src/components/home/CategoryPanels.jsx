import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Panel = ({ title, products = [] }) => (
  <div className="bg-white border border-border-default rounded-pro p-5 flex flex-col hover:shadow-premium transition-all">
    <h3 className="text-h4 font-display text-text-primary mb-4">{title}</h3>
    <div className="grid grid-cols-2 gap-3 mb-5">
      {products.map((p, i) => (
        <Link 
          key={i} 
          to="/products"
          className="aspect-square bg-surface-secondary rounded-img overflow-hidden group/thumb"
        >
          <img 
            src={p.image} 
            alt={title} 
            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
          />
        </Link>
      ))}
    </div>
    <Link 
      to="/products" 
      className="mt-auto text-brand-primary text-small font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all"
    >
      Explore all <ArrowRight size={16} />
    </Link>
  </div>
);

const CategoryPanels = () => {
  const panelData = [
    {
      title: 'Top Picks in Mobiles',
      products: [
        { image: 'https://images.unsplash.com/photo-1592890678913-e92708307c08?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1556656793-062ff98782a7?auto=format&fit=crop&w=200&q=80' },
      ]
    },
    {
      title: 'Fashion for You',
      products: [
        { image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1490481658045-342d8a393046?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80' },
      ]
    },
    {
      title: 'Smart Home Hub',
      products: [
        { image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1586024486164-ce9b3d87408f?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1544101270-2a81878f7129?auto=format&fit=crop&w=200&q=80' },
      ]
    },
    {
      title: 'Gaming Essentials',
      products: [
        { image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80' },
        { image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?auto=format&fit=crop&w=200&q=80' },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {panelData.map((data, i) => (
        <Panel key={i} {...data} />
      ))}
    </div>
  );
};

export default CategoryPanels;
