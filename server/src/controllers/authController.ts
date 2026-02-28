import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { catchAsync } from '../utils/catchAsync';

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
export const registerUser = catchAsync(async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        throw new Error(parsed.error.errors[0].message);
    }

    const { name, email, password } = parsed.data;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        generateToken(res, user._id as string, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = catchAsync(async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        throw new Error(parsed.error.errors[0].message);
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        generateToken(res, user._id as string, user.role);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = catchAsync(async (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
// @ts-ignore
export const getUserProfile = catchAsync(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
