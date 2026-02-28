import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
    endpoint: string;
    method: string;
    responseTime: number;
    statusCode: number;
    timestamp: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
    {
        endpoint: { type: String, required: true },
        method: { type: String, required: true },
        responseTime: { type: Number, required: true },
        statusCode: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now, index: true },
    },
    { timeseries: { timeField: 'timestamp', metaField: 'endpoint', granularity: 'minutes' } }
);

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
