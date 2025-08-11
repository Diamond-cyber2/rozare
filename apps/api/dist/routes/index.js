"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../middlewares/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const leads_1 = require("../controllers/leads");
const indexController = new controllers_1.IndexController();
const setRoutes = (app) => {
    const router = (0, express_1.Router)();
    router.get('/', indexController.getIndex.bind(indexController));
    router.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
    app.use('/', router);
    // Leads routes
    const leads = new leads_1.LeadsController();
    const leadsRouter = (0, express_1.Router)();
    leadsRouter.get('/', leads.list);
    leadsRouter.post('/', leads.create);
    app.use('/leads', leadsRouter);
    // Auth routes
    const auth = (0, express_1.Router)();
    auth.post('/login', (req, res) => {
        const { email, password } = req.body || {};
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin#2025';
        if (email === adminEmail && password === adminPassword) {
            const token = jsonwebtoken_1.default.sign({ sub: 'admin', role: 'ADMIN', email }, process.env.JWT_SECRET || 'dev-secret', {
                expiresIn: '7d',
            });
            return res.json({ token });
        }
        return res.status(401).json({ message: 'Invalid credentials' });
    });
    auth.get('/me', auth_1.authenticate, (req, res) => {
        res.json({ user: req.user });
    });
    app.use('/admin', auth);
};
exports.setRoutes = setRoutes;
