import mongoose from 'mongoose';

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

export default mongoose.model('Roadmap', roadmapSchema);
