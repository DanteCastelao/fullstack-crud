import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from './models/User';
import { env } from './utils/env';

/**
 * Database seed script.
 * Creates an initial admin user for first-time setup.
 *
 * Usage: npm run seed
 */
async function seed(): Promise<void> {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists. Skipping seed.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
        });

        await admin.save();

        console.log('✅ Admin user created:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('');
        console.log('⚠️  Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
