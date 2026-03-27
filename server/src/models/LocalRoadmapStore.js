import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const ROADMAPS_FILE = path.join(DATA_DIR, 'roadmaps.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load roadmaps from file
const loadRoadmaps = () => {
    try {
        if (fs.existsSync(ROADMAPS_FILE)) {
            return JSON.parse(fs.readFileSync(ROADMAPS_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Error loading roadmaps file:', e.message);
    }
    return [];
};

// Save roadmaps to file
const saveRoadmaps = (roadmaps) => {
    fs.writeFileSync(ROADMAPS_FILE, JSON.stringify(roadmaps, null, 2), 'utf-8');
};

// Generate a unique ID
const generateId = () => crypto.randomBytes(12).toString('hex');

export const LocalRoadmapStore = {
    find: (query = {}) => {
        // Return a proxy that supports .sort()
        const roadmaps = loadRoadmaps();
        const filtered = roadmaps.filter(r => {
            return Object.keys(query).every(key => {
                if (key === 'userId' && typeof query[key] === 'object') {
                    return r[key] === query[key].toString();
                }
                return r[key] === query[key];
            });
        });

        // Mocking Mongoose chainable methods
        const result = filtered.map(r => createRoadmapObject(r));
        
        result.sort = function(sortQuery) {
            // Very basic sort implementation for createdAt
            if (sortQuery.createdAt === -1) {
                this.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return this;
        };

        return result;
    },

    findById: async (id) => {
        const roadmaps = loadRoadmaps();
        const roadmap = roadmaps.find(r => r._id === id);
        if (!roadmap) return null;
        return createRoadmapObject(roadmap);
    },

    create: async (roadmapData) => {
        const roadmaps = loadRoadmaps();
        const newRoadmap = {
            _id: generateId(),
            ...roadmapData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Ensure userId is string
        if (newRoadmap.userId && typeof newRoadmap.userId === 'object') {
            newRoadmap.userId = newRoadmap.userId.toString();
        }

        roadmaps.push(newRoadmap);
        saveRoadmaps(roadmaps);
        return createRoadmapObject(newRoadmap);
    },
};

function createRoadmapObject(roadmapData) {
    const obj = { ...roadmapData };

    obj.save = async function () {
        const roadmaps = loadRoadmaps();
        const idx = roadmaps.findIndex(r => r._id === obj._id);
        if (idx !== -1) {
            obj.updatedAt = new Date().toISOString();
            roadmaps[idx] = { ...obj };
            delete roadmaps[idx].save;
            delete roadmaps[idx].deleteOne;
            saveRoadmaps(roadmaps);
        }
        return obj;
    };

    obj.deleteOne = async function () {
        const roadmaps = loadRoadmaps();
        const filtered = roadmaps.filter(r => r._id !== obj._id);
        saveRoadmaps(filtered);
        return { deletedCount: 1 };
    };

    return obj;
}

export default LocalRoadmapStore;
