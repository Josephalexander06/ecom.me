import React from 'react';
import { motion } from 'framer-motion';
import SafeImage from './SafeImage';

const gridData = [
  {
    title: "Top in Neural Devices",
    link: "neural-devices",
    items: [
      { name: "Mind Mesh", image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/grid_neural_1_1773542535774.png" },
      { name: "Nerve Node", image: "https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=300" },
      { name: "Aura Band", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300" },
      { name: "Signal Core", image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=300" },
    ]
  },
  {
    title: "New in Wearables",
    link: "wearables",
    items: [
      { name: "Haptic Vest", image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/grid_wearable_1_1773542549672.png" },
      { name: "Smart Iris", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" },
      { name: "Grip Glove", image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=300" },
      { name: "Pulse Patch", image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=300" },
    ]
  },
  {
    title: "Cybernetic Augments",
    link: "augments",
    items: [
      { name: "Bio-Shell", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300" },
      { name: "Flex-Joint", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=300" },
      { name: "Synth-Skin", image: "https://images.unsplash.com/photo-1504333638930-c8787321eba0?auto=format&fit=crop&q=80&w=300" },
      { name: "Optic v2", image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=300" },
    ]
  }
];

const DiscoveryGrids = () => {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridData.map((panel, pIdx) => (
          <motion.div
            key={panel.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: pIdx * 0.1 }}
            className="bg-white p-6 rounded-sm shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <h2 className="text-text-main font-bold text-xl mb-4">{panel.title}</h2>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
              {panel.items.map((item, iIdx) => (
                <div key={iIdx} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-50 rounded-sm overflow-hidden mb-2">
                    <SafeImage 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[14px] text-text-main font-medium group-hover:text-accent-primary transition-colors block text-center">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-8 text-accent-primary text-[10px] font-bold uppercase tracking-[0.2em] text-left hover:underline">
              Explore Collection
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DiscoveryGrids;
