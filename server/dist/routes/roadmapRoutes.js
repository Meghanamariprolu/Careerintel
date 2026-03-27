"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roadmapController_1 = require("../controllers/roadmapController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All roadmap routes are protected
router.use(auth_1.protect);
router.route('/')
    .get(roadmapController_1.getMyRoadmaps);
router.route('/generate')
    // @ts-ignore
    .post(roadmapController_1.generateRoadmap);
router.route('/:id')
    .get(roadmapController_1.getRoadmapById)
    .put(roadmapController_1.updateRoadmap)
    .delete(roadmapController_1.deleteRoadmap);
exports.default = router;
