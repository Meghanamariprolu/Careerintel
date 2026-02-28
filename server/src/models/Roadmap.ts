import mongoose, { Schema, Document } from 'mongoose';

export interface IRoadmap extends Document {
    userId: mongoose.Types.ObjectId;
    careerTitle: string;
    careerSummary: string;
    roadmapData: {
        phases: {
            name: string;
            description: string;
            skills: string[];
        }[];
        technicalSkills: string[];
        softSkills: string[];
        tools: string[];
        certifications: string[];
        portfolioProjects: string[];
        internshipSuggestions: string[];
        salaryRange: string;
        marketDemandScore: number;
        futureGrowthPrediction: string;
        skillGapAnalysis: string;
        careerReadinessScore: number;
        learningPlan: { week: number; focus: string; tasks: string[] }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const roadmapSchema = new Schema<IRoadmap>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        careerTitle: { type: String, required: true },
        careerSummary: { type: String, required: true },
        roadmapData: { type: Object, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IRoadmap>('Roadmap', roadmapSchema);
