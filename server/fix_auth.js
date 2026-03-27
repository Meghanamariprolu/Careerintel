import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fix() {
    const usersPath = path.join(__dirname, 'data', 'users.json');
    if (!fs.existsSync(usersPath)) {
        console.error('Users file not found at:', usersPath);
        return;
    }

    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const targetEmail = 'meghanamariprolu@gmail.com';
    const user = users.find(u => u.email === targetEmail);

    if (!user) {
        console.error('User not found:', targetEmail);
        return;
    }

    console.log('Generating hash for "password123"...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    user.password = hash;
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log('Successfully updated password for', targetEmail, 'to "password123"');
}

fix();
