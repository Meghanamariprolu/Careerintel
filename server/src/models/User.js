import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { LocalUserStore } from './LocalStore.js';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        googleId: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        bio: { type: String, default: '' },
        location: { type: String, default: '' },
        skills: { type: [String], default: [] },
        profileImage: { type: String, default: '' },

        // Guided Workflow Fields
        careerGoal: { type: String, default: '' },
        education: { type: String, default: '' },
        interests: { type: [String], default: [] },
        experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', ''], default: '' },
        careerReadinessScore: { type: Number, default: 0 },
        skillsProgress: { 
            type: Map, 
            of: Number, 
            default: {} 
        },
        progressTracking: {
            completedModules: { type: [String], default: [] }, // Array of index/id strings
            coursesCompleted: { type: Number, default: 0 },
            projectsBuilt: { type: Number, default: 0 },
            skillsLearned: { type: Number, default: 0 }
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
};

const User = mongoose.model('User', userSchema);

// Helper: returns Mongoose model if DB is connected, otherwise local JSON store
export const getStore = () => {
    if (mongoose.connection.readyState === 1) {
        return User;
    }
    console.log('📂 Using local file store (MongoDB not connected)');
    return LocalUserStore;
};

export default User;

