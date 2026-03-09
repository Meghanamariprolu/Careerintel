"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsMiddleware = void 0;
const Analytics_1 = __importDefault(require("../models/Analytics"));
const analyticsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const responseTime = Date.now() - start;
        Analytics_1.default.create({
            endpoint: req.originalUrl,
            method: req.method,
            responseTime,
            statusCode: res.statusCode,
        }).catch((err) => console.error('Analytics tracking error:', err));
    });
    next();
};
exports.analyticsMiddleware = analyticsMiddleware;
