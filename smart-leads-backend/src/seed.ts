import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import Lead from './models/lead.model';

// Load the environment variables (.env)
dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('🌱 Connected to MongoDB. Starting database seed...');

    // 2. Wipe the existing data clean (so we don't get duplicates if you run it twice)
    await User.deleteMany();
    await Lead.deleteMany();
    console.log('🗑️  Cleared old data.');

    // 3. Create our Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123', // Our model will automatically hash this!
      role: 'Admin'
    });
    console.log('👤 Admin user created (admin@test.com / password123)');

    // 4. Create dummy leads attached to this Admin
    const dummyLeads = [
      { name: 'Alice Johnson', email: 'alice@corp.com', status: 'New', source: 'Website', createdBy: admin._id },
      { name: 'Bob Smith', email: 'bob@startup.io', status: 'Contacted', source: 'Referral', createdBy: admin._id },
      { name: 'Charlie Davis', email: 'charlie@design.net', status: 'Qualified', source: 'Instagram', createdBy: admin._id },
      { name: 'Diana Prince', email: 'diana@amazon.com', status: 'Lost', source: 'Website', createdBy: admin._id },
      { name: 'Evan Wright', email: 'evan@tech.org', status: 'New', source: 'Instagram', createdBy: admin._id },
      { name: 'Fiona Gallagher', email: 'fiona@southside.com', status: 'Qualified', source: 'Referral', createdBy: admin._id },
    ];

    await Lead.insertMany(dummyLeads);
    console.log(`📊 Injected ${dummyLeads.length} dummy leads into the system.`);

    console.log('✅ Seeding completely finished! You can close this script.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the function
seedDatabase();