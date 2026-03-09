import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log(`📡 Attempting to connect to: ${mongoURI.split('@')[1] || 'Local DB'}`);

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Keep it short to fail fast
            socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
            family: 4                      // Use IPv4, skip trying IPv6
        });

        console.log('✅ MongoDB Connected Successfully');

        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected.');
        });

    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
