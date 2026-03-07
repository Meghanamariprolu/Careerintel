import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoURI);

        console.log('✅ MongoDB Connected Successfully');

        mongoose.connection.on('error', (err: Error) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected.');
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ MongoDB connection failed: ${error.message}`);
        } else {
            console.error('❌ An unknown error occurred while connecting to MongoDB');
        }
        process.exit(1);
    }
};

export default connectDB;
