import crypto from 'crypto';
import { z } from 'zod';
import { getStore } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';

const registerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = catchAsync(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        throw new Error(parsed.error.issues[0].message);
    }

    const { name, email, password } = parsed.data;
    const Store = getStore();

    const userExists = await Store.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await Store.create({
        name,
        email,
        password,
    });

    if (user) {
        const token = generateToken(res, user._id.toString(), user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = catchAsync(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        throw new Error(parsed.error.issues[0].message);
    }

    const { email, password } = parsed.data;
    const Store = getStore();

    const user = await Store.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        const token = generateToken(res, user._id.toString(), user.role);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = catchAsync(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = catchAsync(async (req, res) => {
    const Store = getStore();
    const user = await Store.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            location: user.location,
            skills: user.skills,
            profileImage: user.profileImage,
            careerGoal: user.careerGoal,
            education: user.education,
            interests: user.interests,
            experienceLevel: user.experienceLevel,
            careerReadinessScore: user.careerReadinessScore,
            progressTracking: user.progressTracking,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = catchAsync(async (req, res) => {
    const Store = getStore();
    const user = await Store.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.location = req.body.location || user.location;
        user.skills = req.body.skills || user.skills;
        user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;

        user.careerGoal = req.body.careerGoal !== undefined ? req.body.careerGoal : user.careerGoal;
        user.education = req.body.education !== undefined ? req.body.education : user.education;
        user.interests = req.body.interests !== undefined ? req.body.interests : user.interests;
        user.experienceLevel = req.body.experienceLevel !== undefined ? req.body.experienceLevel : user.experienceLevel;
        user.careerReadinessScore = req.body.careerReadinessScore !== undefined ? req.body.careerReadinessScore : user.careerReadinessScore;
        user.progressTracking = req.body.progressTracking !== undefined ? req.body.progressTracking : user.progressTracking;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            bio: updatedUser.bio,
            location: updatedUser.location,
            skills: updatedUser.skills,
            profileImage: updatedUser.profileImage,
            careerGoal: updatedUser.careerGoal,
            education: updatedUser.education,
            interests: updatedUser.interests,
            experienceLevel: updatedUser.experienceLevel,
            careerReadinessScore: updatedUser.careerReadinessScore,
            progressTracking: updatedUser.progressTracking,
            token: generateToken(res, updatedUser._id.toString(), updatedUser.role),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = catchAsync(async (req, res) => {
    const Store = getStore();
    const user = await Store.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // In a real application, you would send this token via email (e.g., SendGrid, Nodemailer)
    // For now, we return it in the response for development purposes
    const resetUrl = `${process.env.CLIENT_URL || 'http://127.0.0.1:3005'}/reset-password/${resetToken}`;

    console.log(`Password reset link: ${resetUrl}`);

    res.status(200).json({
        success: true,
        message: 'Password reset link sent (check console in development)',
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined // Only return token in dev
    });
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = catchAsync(async (req, res) => {
    const Store = getStore();
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await Store.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired password reset token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(res, user._id.toString(), user.role);

    res.status(200).json({
        success: true,
        message: 'Password reset successful',
        token,
    });
});

