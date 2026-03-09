"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.post('/logout', authController_1.logoutUser);
// @ts-ignore
router.get('/profile', auth_1.protect, authController_1.getUserProfile);
// @ts-ignore
router.put('/profile', auth_1.protect, authController_1.updateProfile);
router.post('/forgotpassword', authController_1.forgotPassword);
router.put('/resetpassword/:resettoken', authController_1.resetPassword);
exports.default = router;
