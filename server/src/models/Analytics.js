import mongoose from 'mongoose';

const { Schema } = mongoose;

const analyticsSchema = new Schema(
    {
        endpoint: { type: String, required: true },
        method: { type: String, required: true },
        responseTime: { type: Number, required: true },
        statusCode: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now, index: true },
    },
    { timeseries: { timeField: 'timestamp', metaField: 'endpoint', granularity: 'minutes' } }
);

export default mongoose.model('Analytics', analyticsSchema);
