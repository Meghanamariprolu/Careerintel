import express from 'express';
import { generateRoadmap, getMyRoadmaps, getRoadmapById, deleteRoadmap, updateRoadmap } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All roadmap routes are protected
router.use(protect);

router.route('/')
    .get(getMyRoadmaps);

router.route('/generate')
    .post(generateRoadmap);

router.route('/:id')
    .get(getRoadmapById)
    .put(updateRoadmap)
    .delete(deleteRoadmap);

export default router;
