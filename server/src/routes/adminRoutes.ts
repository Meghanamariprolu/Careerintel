import express from 'express';
import { getDashboardMetrics, getUsers } from '../controllers/adminController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.use(protect, admin);

router.route('/metrics').get(getDashboardMetrics);
router.route('/users').get(getUsers);

export default router;
