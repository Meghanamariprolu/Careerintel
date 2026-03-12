import fs from 'fs';
import bcrypt from 'bcryptjs';

async function resetPasswords() {
    console.log('Generating hash for "password123"...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    
    const usersPath = 'c:/Users/marup/Desktop/Careerintel/server/data/users.json';
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    let updatedCount = 0;
    users.forEach(u => {
        u.password = hash;
        updatedCount++;
    });
    
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log(`Successfully reset ${updatedCount} passwords to "password123".`);
}

resetPasswords();
