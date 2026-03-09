import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, updateProfile, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// @ts-ignore
router.get('/profile', protect, getUserProfile);
// @ts-ignore
router.put('/profile', protect, updateProfile);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
