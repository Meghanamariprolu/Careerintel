const baseURL = 'http://localhost:5000/api/auth';

async function testAuth() {
    console.log('--- Testing Registration ---');
    const testUser = {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    try {
        const regRes = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log('Registration Data:', regData);

        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Data:', loginData);
        
        if (loginData.token) {
            console.log('\n--- Testing Profile Retrieval ---');
            const profileRes = await fetch(`${baseURL}/profile`, {
                headers: { 'Authorization': `Bearer ${loginData.token}` }
            });
            const profileData = await profileRes.json();
            console.log('Profile Status:', profileRes.status);
            console.log('Profile Data (Email):', profileData.email);
        }
    } catch (error) {
        console.error('Auth Test Failed:', error);
    }
}

testAuth();
