import mongoose from 'mongoose';
import { LocalRoadmapStore } from './LocalRoadmapStore.js';

const { Schema } = mongoose;

const roadmapSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        careerTitle: { type: String, required: true },
        careerSummary: { type: String, required: true },
        roadmapData: { type: Object, required: true },
        userSkills: { type: [String], default: [] },
    },
    { timestamps: true }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

// Helper: returns Mongoose model if DB is connected, otherwise local JSON store
export const getStore = () => {
    if (mongoose.connection.readyState === 1) {
        return Roadmap;
    }
    return LocalRoadmapStore;
};

export default Roadmap;
