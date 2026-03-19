const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
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
        globalAnnouncementEnabled: false,
        globalAnnouncementText: 'Welcome to ecom.me',
        freeShippingThreshold: 5000,
        defaultShippingCharge: 499
      }
    });
    console.log('Seeded site config.');

    const passwordHash = await bcrypt.hash('Password@123', 10);
    const [adminUser, sellerUser, regularUser, electroSeller, fashionSeller, homeSeller] = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@ecomme.local',
        password: passwordHash,
        role: 'admin',
        isAdmin: true,
        isSeller: false,
        sellerStatus: 'None'
      },
      {
        name: 'Seller User',
        email: 'seller@ecomme.local',
        password: passwordHash,
        role: 'seller',
        isAdmin: false,
        isSeller: true,
        sellerStatus: 'Approved',
        storeName: 'Matrix Tech Store',
        bankAccount: '111122223333'
      },
      {
        name: 'Regular User',
        email: 'user@ecomme.local',
        password: passwordHash,
        role: 'user',
        isAdmin: false,
        isSeller: false,
        sellerStatus: 'None',
        savedAddresses: [{
          street: '123 Cyber Street, Sector 5',
          city: 'Mumbai',
          zip: '400001',
          isDefault: true
        }]
      },
      {
        name: 'Electro Hub',
        email: 'electro@ecomme.local',
        password: passwordHash,
        role: 'seller',
        isAdmin: false,
        isSeller: true,
        sellerStatus: 'Approved',
        storeName: 'Electro Hub',
        bankAccount: '444455556666'
      },
      {
        name: 'Fashion Nova',
        email: 'fashion@ecomme.local',
        password: passwordHash,
        role: 'seller',
        isAdmin: false,
        isSeller: true,
        sellerStatus: 'Approved',
        storeName: 'Fashion Nova',
        bankAccount: '777788889999'
      },
      {
        name: 'Home Comforts',
        email: 'home@ecomme.local',
        password: passwordHash,
        role: 'seller',
        isAdmin: false,
        isSeller: true,
        sellerStatus: 'Approved',
        storeName: 'Home Comforts',
        bankAccount: '000011112222'
      }
    ]);
    console.log('Seeded test users: admin, seller, user, and 3 specialized sellers');

    const products = [
      {
        sellerId: sellerUser._id,
        name: 'Neural Link V4',
        brand: 'AETHER',
        category: 'Neural Wearables',
        description: 'The industry standard in neural interfacing. 0.2ms latency, full sensory immersion with liquid haptics and 5-core telemetry.',
        price: 2499,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#10ced1',
        tags: ['neural', 'wearable', 'fast', 'pro', 'connectivity', 'low-latency'],
        variants: [{ color: 'Obsidian', size: 'Standard' }, { color: 'Teal', size: 'Standard', priceDelta: 200 }],
        features: [
          { name: 'Synaptic Bridge', description: 'Dual-core processing for hyper-realistic data input.', position: { x: 0, y: 1, z: 0 } },
          { name: 'Heat Dissipator', description: 'Nono-carbon cooling mesh.', position: { x: 1, y: 0.5, z: 0.2 } }
        ],
        soldCount: 1542
      },
      {
        sellerId: electroSeller._id,
        name: 'Quantum Laptop X1',
        brand: 'SYNAPSE',
        category: 'Electronics',
        description: 'Next-gen computing with quantum processing cores. 1TB Q-RAM, Infinite battery life via ambient heat harvesting.',
        price: 3499,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#0066ff',
        tags: ['laptop', 'quantum', 'fast', 'pro', 'workstation'],
        soldCount: 45
      },
      {
        sellerId: electroSeller._id,
        name: 'Cyber Phone S10',
        brand: 'SYNAPSE',
        category: 'Electronics',
        description: 'Foldable holographic display with neural sync. 6G connectivity and 200MP bio-sensor camera.',
        price: 1299,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#ff0055',
        tags: ['phone', 'mobile', 'holographic', 'camera'],
        soldCount: 230
      },
      {
        sellerId: fashionSeller._id,
        name: 'Aero-Mesh Sneakers',
        brand: 'NOVA',
        category: 'Fashion',
        description: 'Self-adjusting fit with liquid cooling mesh. Gravity-defying propulsion soles.',
        price: 299,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#ff6600',
        tags: ['shoes', 'sneakers', 'fashion', 'sport'],
        soldCount: 540
      },
      {
        sellerId: fashionSeller._id,
        name: 'Titanium Fabric Jacket',
        brand: 'NOVA',
        category: 'Fashion',
        description: 'Bulletproof yet breathable. Integrated climate control system.',
        price: 899,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#333333',
        tags: ['jacket', 'fashion', 'techwear', 'outerwear'],
        soldCount: 88
      },
      {
        sellerId: homeSeller._id,
        name: 'Levitating Smart Lamp',
        brand: 'COMFORT',
        category: 'Home',
        description: 'Maglev technology for a floating light experience. 16 million colors with circadian sync.',
        price: 450,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#ffff00',
        tags: ['lamp', 'home', 'smart', 'lighting'],
        soldCount: 156
      },
      {
        sellerId: homeSeller._id,
        name: 'Ergo-Grip AI Chair',
        brand: 'COMFORT',
        category: 'Home',
        description: 'Dynamic lumbar support that learns your posture. Integrated massage and heating modules.',
        price: 1200,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#663300',
        tags: ['chair', 'furniture', 'home', 'office'],
        soldCount: 42
      }
    ];

    await Product.insertMany(products);
    console.log('Seeded products successfully.');
    console.log('Login credentials for all seeded users: Password@123');
    console.log(`Admin: ${adminUser.email}`);
    console.log(`Seller: ${sellerUser.email}`);
    console.log(`Regular User: ${regularUser.email}`);
    console.log(`Electro Seller: ${electroSeller.email}`);
    console.log(`Fashion Seller: ${fashionSeller.email}`);
    console.log(`Home Seller: ${homeSeller.email}`);

    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
