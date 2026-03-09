import express from 'express';
import { getDashboardMetrics, getUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

router.route('/metrics').get(getDashboardMetrics);
router.route('/users').get(getUsers);

export default router;
