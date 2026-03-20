const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const TOTAL_PRODUCTS = 500;
const TOTAL_SELLERS = 24;

const categoryConfig = {
  Electronics: {
    brands: ['Sony', 'Samsung', 'LG', 'Panasonic', 'Philips', 'Bose', 'JBL'],
    adjectives: ['Ultra', 'Smart', 'Quantum', 'Pro', 'Advanced', 'Prime'],
    nouns: ['Soundbar', 'Headphones', 'TV', 'Speaker', 'Projector', 'Monitor'],
    minPrice: 1500,
    maxPrice: 120000,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Mobiles: {
    brands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo', 'Google'],
    adjectives: ['Neo', 'Turbo', 'Max', 'Ultra', 'Edge', 'Prime'],
    nouns: ['Phone', 'Smartphone', '5G Edition', 'Pro Edition', 'Lite Edition'],
    minPrice: 9000,
    maxPrice: 175000,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89a81a1bb4?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Fashion: {
    brands: ['Zara', 'H&M', 'Levis', 'Puma', 'Nike', 'Adidas', 'Roadster'],
    adjectives: ['Urban', 'Classic', 'Bold', 'Casual', 'Premium', 'Essential'],
    nouns: ['Jacket', 'Sneakers', 'Shirt', 'Jeans', 'Hoodie', 'Dress'],
    minPrice: 499,
    maxPrice: 18000,
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Home: {
    brands: ['Ikea', 'Urban Ladder', 'Home Centre', 'Cello', 'Nilkamal', 'Sleepyhead'],
    adjectives: ['Comfort', 'Zen', 'Modern', 'Minimal', 'Classic', 'Aura'],
    nouns: ['Sofa', 'Chair', 'Lamp', 'Table', 'Mattress', 'Shelf'],
    minPrice: 799,
    maxPrice: 65000,
    images: [
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Books: {
    brands: ['Penguin', 'HarperCollins', 'Bloomsbury', 'Oxford', 'Scribner'],
    adjectives: ['Complete', 'Essential', 'Illustrated', 'Definitive', 'Pocket'],
    nouns: ['Guide', 'Collection', 'Manual', 'Series', 'Companion'],
    minPrice: 199,
    maxPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1524578271613-d550ecccbaeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Beauty: {
    brands: ['Maybelline', 'Lakme', 'LOréal', 'Nykaa', 'Mamaearth', 'Minimalist'],
    adjectives: ['Glow', 'Hydra', 'Radiant', 'Pure', 'Silk', 'Natural'],
    nouns: ['Serum', 'Kit', 'Cleanser', 'Sunscreen', 'Moisturizer', 'Palette'],
    minPrice: 249,
    maxPrice: 7500,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Groceries: {
    brands: ['Organic India', 'Tata', 'Patanjali', 'Aashirvaad', 'Saffola', 'Fortune'],
    adjectives: ['Fresh', 'Healthy', 'Daily', 'Family', 'Organic', 'Value'],
    nouns: ['Pack', 'Combo', 'Essentials', 'Basket', 'Selection'],
    minPrice: 99,
    maxPrice: 3000,
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1615486363972-f79e15278092?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Appliances: {
    brands: ['Whirlpool', 'IFB', 'Samsung', 'LG', 'Bosch', 'Haier'],
    adjectives: ['Turbo', 'Eco', 'Silent', 'Smart', 'Digital', 'Rapid'],
    nouns: ['Washing Machine', 'Microwave', 'Air Fryer', 'Mixer', 'Refrigerator'],
    minPrice: 1200,
    maxPrice: 95000,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Sports: {
    brands: ['Nike', 'Puma', 'Adidas', 'Decathlon', 'Yonex', 'Nivia'],
    adjectives: ['Active', 'Power', 'Endurance', 'Athlete', 'Performance', 'Rapid'],
    nouns: ['Kit', 'Shoes', 'Racket', 'Dumbbell Set', 'Treadmill', 'Gloves'],
    minPrice: 399,
    maxPrice: 45000,
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Toys: {
    brands: ['Lego', 'Hot Wheels', 'Funskool', 'Hasbro', 'Mattel', 'Nerf'],
    adjectives: ['Mega', 'Fun', 'Creative', 'Junior', 'Adventure', 'Play'],
    nouns: ['Set', 'Car', 'Puzzle', 'Board Game', 'Doll House', 'Blaster'],
    minPrice: 199,
    maxPrice: 12000,
    images: [
      'https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Computers: {
    brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'],
    adjectives: ['Gaming', 'Creator', 'Office', 'Ultra', 'Performance', 'Elite'],
    nouns: ['Laptop', 'Desktop', 'Keyboard', 'Mouse', 'SSD', 'Monitor'],
    minPrice: 599,
    maxPrice: 210000,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Automotive: {
    brands: ['Bosch', '3M', 'Castrol', 'Motul', 'GoMechanic', 'Michelin'],
    adjectives: ['Road', 'Drive', 'Turbo', 'Pro', 'Shield', 'Power'],
    nouns: ['Dash Cam', 'Air Pump', 'Car Cover', 'Cleaning Kit', 'Oil Pack'],
    minPrice: 399,
    maxPrice: 35000,
    images: [
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    ],
  },
  Health: {
    brands: ['Omron', 'Dr Trust', 'AccuCheck', 'Boldfit', 'HealthSense', 'PowerMax'],
    adjectives: ['Fit', 'Care', 'Vital', 'Health', 'Pro', 'Active'],
    nouns: ['Monitor', 'Massager', 'Band', 'Weighing Scale', 'Thermometer'],
    minPrice: 499,
    maxPrice: 28000,
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
    ],
  },
};

const categoryNames = Object.keys(categoryConfig);

const sellerPrefixes = ['Prime', 'Urban', 'Metro', 'Nova', 'Apex', 'Swift', 'Elite', 'Bright', 'Zen', 'Max', 'Hyper', 'Orbit'];
const sellerSuffixes = ['Mart', 'Hub', 'Store', 'Retail', 'Deals', 'Commerce', 'World', 'Bazaar', 'Point', 'Center', 'Spot', 'Depot'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildSellerUsers = (passwordHash) => {
  const sellers = [
    {
      name: 'Demo Seller Owner',
      email: 'seller@ecomme.local',
      password: passwordHash,
      role: 'seller',
      isAdmin: false,
      isSeller: true,
      sellerStatus: 'Approved',
      storeName: 'Demo Seller Store',
      bankAccount: '900000000000',
    },
  ];
  for (let i = 1; i < TOTAL_SELLERS; i += 1) {
    const storeName = `${sellerPrefixes[(i - 1) % sellerPrefixes.length]} ${sellerSuffixes[(i - 1) % sellerSuffixes.length]} ${i}`;
    sellers.push({
      name: `${storeName} Owner`,
      email: `seller${i}@ecomme.local`,
      password: passwordHash,
      role: 'seller',
      isAdmin: false,
      isSeller: true,
      sellerStatus: 'Approved',
      storeName,
      bankAccount: `9000${String(i).padStart(8, '0')}`,
    });
  }
  return sellers;
};

const buildProducts = (sellerUsers) => {
  const products = [];

  for (let i = 0; i < TOTAL_PRODUCTS; i += 1) {
    const category = categoryNames[i % categoryNames.length];
    const cfg = categoryConfig[category];

    const brand = getRandom(cfg.brands);
    const adjective = getRandom(cfg.adjectives);
    const noun = getRandom(cfg.nouns);

    const price = randomInt(cfg.minPrice, cfg.maxPrice);
    const isDeal = Math.random() < 0.22;
    const dealPercent = randomInt(8, 30);
    const dealPrice = isDeal ? Math.max(Math.floor(price * (1 - dealPercent / 100)), Math.floor(price * 0.6)) : undefined;

    const stock = randomInt(4, 180);
    const soldCount = randomInt(10, 4500);
    const views = soldCount * randomInt(4, 20);
    const avgRating = Number((Math.random() * 1.4 + 3.6).toFixed(1));
    const reviewCount = randomInt(5, 900);

    const seller = sellerUsers[i % sellerUsers.length];
    const productName = `${adjective} ${brand} ${noun} ${randomInt(100, 9999)}`;

    products.push({
      sellerId: seller._id,
      name: productName,
      brand,
      category,
      description: `${productName} is curated for ${category.toLowerCase()} shoppers seeking reliability, value, and modern features. Built with high quality standards and seller-backed support for daily use.`,
      price,
      stock,
      images: [getRandom(cfg.images)],
      dominantColor: ['#1859ff', '#2ed3b7', '#f97316', '#0f172a', '#16a34a'][i % 5],
      tags: [
        category.toLowerCase(),
        brand.toLowerCase().replace(/\s+/g, '-'),
        adjective.toLowerCase(),
        noun.toLowerCase().replace(/\s+/g, '-'),
      ],
      variants: [
        {
          color: ['Black', 'Blue', 'Silver', 'White', 'Green'][i % 5],
          size: ['Standard', 'M', 'L'][i % 3],
          priceDelta: randomInt(0, 500),
        },
      ],
      soldCount,
      views,
      averageRating: avgRating,
      reviewCount,
      isDeal,
      dealPrice,
      dealExpiresAt: isDeal ? new Date(Date.now() + randomInt(2, 14) * 24 * 60 * 60 * 1000) : undefined,
    });
  }

  return products;
};

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    await User.deleteMany({});
    const SiteConfig = require('./models/SiteConfig');
    await SiteConfig.deleteMany({});
    console.log('Cleared existing products, users, and site config.');

    await SiteConfig.create({
      key: 'global',
      config: {
        showDealsSection: true,
        showRecommended: true,
        showCategoryPanels: true,
        showWideBanner: true,
        showBestsellers: true,
        showNewArrivals: true,
        showSellerSpotlight: true,
        showRecentlyViewed: true,
        globalAnnouncementEnabled: true,
        globalAnnouncementText: 'Mega catalog drop: 500+ products from verified sellers now live.',
        freeShippingThreshold: 5000,
        defaultShippingCharge: 499,
      },
    });
    console.log('Seeded site config.');

    const passwordHash = await bcrypt.hash('Password@123', 10);

    const [adminUser, regularUser] = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@ecomme.local',
        password: passwordHash,
        role: 'admin',
        isAdmin: true,
        isSeller: false,
        sellerStatus: 'None',
      },
      {
        name: 'Regular User',
        email: 'user@ecomme.local',
        password: passwordHash,
        role: 'user',
        isAdmin: false,
        isSeller: false,
        sellerStatus: 'None',
        savedAddresses: [
          {
            street: '123 Cyber Street, Sector 5',
            city: 'Mumbai',
            zip: '400001',
            isDefault: true,
          },
        ],
      },
    ]);

    const sellerUsers = await User.insertMany(buildSellerUsers(passwordHash));
    console.log(`Seeded ${sellerUsers.length} sellers + admin + user.`);

    const products = buildProducts(sellerUsers);
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products across ${categoryNames.length} categories.`);

    console.log('Login password for all seeded users: Password@123');
    console.log(`Admin: ${adminUser.email}`);
    console.log(`Regular User: ${regularUser.email}`);
    console.log(`Sample Seller: ${sellerUsers[0].email}`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
