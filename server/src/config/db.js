import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error('Database URI (MONGODB_URI or MONGO_URI) is not defined');
        }

        console.log(`📡 Attempting to connect to: ${mongoURI.split('@')[1] || 'Local DB'}`);

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 15000,        
            family: 4                      
        });

        console.log('✅ MongoDB Connected Successfully');

        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected.');
        });

    } catch (error) {
        if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
            console.error('❌ MongoDB Connection: Authentication Failed');
            console.error('👉 Tip: Check your MONGO_URI in server/.env for correct username/password.');
            console.error('👉 Tip: Ensure your current IP address is whitelisted in MongoDB Atlas.');
        } else if (error.message.includes('ENOTFOUND') || error.code === 'ENOTFOUND') {
            console.error('❌ MongoDB Connection: DNS Resolution Failed (ENOTFOUND)');
            console.error('👉 Tip: Check your internet connection or if you are behind a VPN/Firewall.');
        } else if (error.message.includes('ETIMEDOUT') || error.code === 'ETIMEDOUT') {
            console.error('❌ MongoDB Connection: Request Timed Out (ETIMEDOUT)');
        } else {
            console.error(`❌ MongoDB connection failed: ${error.message}`);
        }
        console.warn('⚠️ Server will continue running with Local storage fallback.');
    }
};

export default connectDB;
