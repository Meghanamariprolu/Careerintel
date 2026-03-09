import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load users from file
const loadUsers = () => {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Error loading users file:', e.message);
    }
    return [];
};

// Save users to file
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

// Generate a unique ID
const generateId = () => crypto.randomBytes(12).toString('hex');

export const LocalUserStore = {
    findOne: async (query) => {
        const users = loadUsers();
        const user = users.find(u => {
            return Object.keys(query).every(key => u[key] === query[key]);
        });
        if (!user) return null;
        // Return a user-like object with methods
        return createUserObject(user);
    },

    findById: async (id) => {
        const users = loadUsers();
        const user = users.find(u => u._id === id);
        if (!user) return null;
        return createUserObject(user);
    },

    create: async (userData) => {
        const users = loadUsers();

        // Check for duplicate email
        if (users.find(u => u.email === userData.email)) {
            throw new Error('User already exists');
        }

        const bcrypt = (await import('bcryptjs')).default;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = {
            _id: generateId(),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'user',
            bio: userData.bio || '',
            location: userData.location || '',
            skills: userData.skills || [],
            profileImage: userData.profileImage || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);
        return createUserObject(newUser);
    },
};

function createUserObject(userData) {
    const obj = { ...userData };

    obj.comparePassword = async function (candidatePassword) {
        if (!obj.password) return false;
        const bcrypt = (await import('bcryptjs')).default;
        return bcrypt.compare(candidatePassword, obj.password);
    };

    obj.getResetPasswordToken = function () {
        const resetToken = crypto.randomBytes(20).toString('hex');
        obj.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        obj.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        // Persist changes
        const users = loadUsers();
        const idx = users.findIndex(u => u._id === obj._id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], resetPasswordToken: obj.resetPasswordToken, resetPasswordExpire: obj.resetPasswordExpire };
            saveUsers(users);
        }
        return resetToken;
    };

    obj.save = async function (options) {
        const users = loadUsers();
        const idx = users.findIndex(u => u._id === obj._id);
        if (idx !== -1) {
            // If password was modified and validateBeforeSave is not false
            if (options?.validateBeforeSave !== false && obj._passwordModified) {
                const bcrypt = (await import('bcryptjs')).default;
                const salt = await bcrypt.genSalt(10);
                obj.password = await bcrypt.hash(obj.password, salt);
            }
            obj.updatedAt = new Date().toISOString();
            users[idx] = { ...obj };
            // Remove methods before saving
            delete users[idx].comparePassword;
            delete users[idx].getResetPasswordToken;
            delete users[idx].save;
            delete users[idx]._passwordModified;
            saveUsers(users);
        }
        return obj;
    };

    // Proxy to track password changes
    const originalObj = obj;
    return new Proxy(originalObj, {
        set(target, prop, value) {
            if (prop === 'password' && value !== target.password) {
                target._passwordModified = true;
            }
            target[prop] = value;
            return true;
        }
    });
}

export default LocalUserStore;
