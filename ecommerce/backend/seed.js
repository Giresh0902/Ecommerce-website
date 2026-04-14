const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality. Perfect for music lovers and remote workers.', price: 79.99, originalPrice: 129.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', brand: 'SoundPro', stock: 50, featured: true, rating: 4.5, numReviews: 12 },
  { name: 'Running Shoes - Men', description: 'Lightweight and responsive running shoes with breathable mesh upper and cushioned midsole. Ideal for road running and gym workouts.', price: 89.99, originalPrice: 120.00, category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', brand: 'SpeedRun', stock: 35, featured: true, rating: 4.3, numReviews: 8 },
  { name: 'Stainless Steel Water Bottle', description: '32oz insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid, wide mouth for easy cleaning.', price: 24.99, originalPrice: 34.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', brand: 'HydroFlask', stock: 100, featured: true, rating: 4.7, numReviews: 20 },
  { name: 'Mechanical Keyboard', description: 'Compact TKL mechanical keyboard with blue switches, RGB backlight, and durable aluminum frame. Great for gaming and typing.', price: 59.99, originalPrice: 89.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', brand: 'KeyMaster', stock: 25, featured: false, rating: 4.6, numReviews: 15 },
  { name: 'Yoga Mat Premium', description: 'Extra thick 6mm non-slip yoga mat with alignment lines, carrying strap included. Made from eco-friendly TPE material.', price: 34.99, originalPrice: 49.99, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925228010-d8b901d0a0b3?w=500', brand: 'ZenFlex', stock: 60, featured: false, rating: 4.4, numReviews: 10 },
  { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handcrafted ceramic mugs, 12oz each. Microwave and dishwasher safe. Modern minimalist design in earthy tones.', price: 29.99, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', brand: 'CeraHome', stock: 80, featured: false, rating: 4.2, numReviews: 6 },
  { name: 'Men\'s Classic T-Shirt', description: '100% organic cotton classic fit t-shirt. Pre-shrunk, double-stitched for durability. Available in multiple colors.', price: 19.99, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', brand: 'BasicWear', stock: 150, featured: false, rating: 4.0, numReviews: 22 },
  { name: 'Portable Bluetooth Speaker', description: '360° surround sound with 20W output, waterproof IPX7 rating, 12-hour playtime. Compact and perfect for outdoor adventures.', price: 49.99, originalPrice: 69.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', brand: 'SoundPro', stock: 40, featured: true, rating: 4.5, numReviews: 18 },
  { name: 'Leather Wallet - Slim', description: 'Genuine leather bifold slim wallet with RFID blocking. Holds up to 8 cards plus cash pocket. Minimalist and stylish.', price: 39.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', brand: 'LeatherCraft', stock: 70, featured: false, rating: 4.6, numReviews: 14 },
  { name: 'Smart Watch Fitness Tracker', description: 'Track heart rate, steps, sleep, and 20+ workout modes. 7-day battery life, water resistant, smartphone notifications.', price: 99.99, originalPrice: 149.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', brand: 'FitTech', stock: 30, featured: true, rating: 4.4, numReviews: 25 },
  { name: 'Wooden Desk Organizer', description: 'Bamboo desktop organizer with 5 compartments for pens, phone, documents and more. Eco-friendly and modern design.', price: 22.99, category: 'Office', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', brand: 'EcoDesk', stock: 45, featured: false, rating: 4.1, numReviews: 7 },
  { name: 'Sunglasses Polarized', description: 'UV400 polarized lenses with lightweight TR90 frame. Scratch-resistant coating, includes hard case and cleaning cloth.', price: 44.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', brand: 'SunShield', stock: 55, featured: false, rating: 4.3, numReviews: 11 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      isAdmin: true,
    });

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
    });

    // Insert products
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@ecommerce.com / admin123');
    console.log('👤 User:  john@example.com / user123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
