import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConn = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log("Checking URI:", uri.split('@')[1]);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to MongoDB!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: ", err.message);
        process.exit(1);
    }
};

testConn();
