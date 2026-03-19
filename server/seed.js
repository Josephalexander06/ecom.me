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
    console.log('Cleared existing products and users.');

    const passwordHash = await bcrypt.hash('Password@123', 10);
    const [adminUser, sellerUser, regularUser] = await User.insertMany([
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
        sellerStatus: 'None'
      }
    ]);
    console.log('Seeded test users: admin, seller, user');

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
        sellerId: sellerUser._id,
        name: 'Retinal Iris Pro',
        brand: 'OPTIC',
        category: 'Visual Augmentation',
        description: 'Hyper-visual overlays with 16K resolution directly to your optic nerve. Integrated spatial computing core for real-time mesh mapping.',
        price: 1899,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1576086213369-9713438b11ad?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#7000ff',
        tags: ['eye', 'optic', 'vision', '4K', 'augmented-reality', 'spatial'],
        isDeal: true,
        dealPrice: 1599,
        dealExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      },
      {
        sellerId: sellerUser._id,
        name: 'Haptic Glove S1',
        brand: 'SENSE',
        category: 'Tactile Peripherals',
        description: 'Feel the virtual as if it were physical. 4096 pressure points per finger and active temperature feedback.',
        price: 999,
        stock: 22,
        images: ['https://images.unsplash.com/photo-1558444479-2706fa53002d?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#00ff62',
        tags: ['hand', 'tactile', 'sense', 'immersion', 'feedback'],
        soldCount: 843
      },
      {
        sellerId: sellerUser._id,
        name: 'Cognitive Thread',
        brand: 'AETHER',
        category: 'Bio-Computing',
        description: 'Minimally invasive cerebral expansion threads. Increase your calculation speed by 400x using the AETHER network.',
        price: 4999,
        stock: 2,
        images: ['https://images.unsplash.com/photo-1614850523296-e8c041de8c2e?auto=format&fit=crop&q=80&w=800'],
        dominantColor: '#ffb700',
        tags: ['bio', 'compute', 'brain', 'expansion', 'server'],
        soldCount: 124
      }
    ];

    await Product.insertMany(products);
    console.log('Seeded products successfully.');
    console.log('Login credentials for all seeded users: Password@123');
    console.log(`Admin: ${adminUser.email}`);
    console.log(`Seller: ${sellerUser.email}`);
    console.log(`User: ${regularUser.email}`);

    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
