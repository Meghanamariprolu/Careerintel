import express from 'express';
import dotenv from 'dotenv';

console.log('Starting test...');
dotenv.config();
console.log('Dotenv config loaded.');
console.log('PORT:', process.env.PORT);

const app = express();
console.log('Express app created.');

app.get('/', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    process.exit(0);
});
