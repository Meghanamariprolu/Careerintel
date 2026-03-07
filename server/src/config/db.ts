import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoURI, {
            tls: true,
            tlsAllowInvalidCertificates: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB Connected Successfully');

        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ MongoDB connection failed: ${error.message}`);
            console.error('\n👉 Checklist:\n  1. Is your IP whitelisted in MongoDB Atlas? (Network Access → Add IP Address → Allow from Anywhere: 0.0.0.0/0)\n  2. Are credentials correct in MONGODB_URI?\n  3. Is cluster name correct?\n');
        } else {
            console.error('❌ An unknown error occurred while connecting to MongoDB');
        }
        process.exit(1);
    }
};

export default connectDB;


