"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const roadmapRoutes_1 = __importDefault(require("./routes/roadmapRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const analytics_1 = require("./middleware/analytics");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_URL || 'http://localhost:3006', 'http://127.0.0.1:3006'],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
// Connect to Database
(0, db_1.default)();
// Track Analytics
app.use(analytics_1.analyticsMiddleware);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/roadmaps', roadmapRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// restart trigger
