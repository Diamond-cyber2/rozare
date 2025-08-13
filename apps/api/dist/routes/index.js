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
const products_1 = require("../controllers/products");
const orders_1 = require("../controllers/orders");
const uploads_1 = require("../utils/uploads");
const settings_1 = require("../controllers/settings");
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
    // Products routes (protected)
    const products = new products_1.ProductsController();
    const p = (0, express_1.Router)();
    p.get('/', auth_1.authenticate, products.list);
    p.post('/', auth_1.authenticate, products.create);
    p.post('/upload', auth_1.authenticate, uploads_1.upload.single('image'), (req, res) => {
        const file = req.file;
        if (!file)
            return res.status(400).json({ message: 'No file' });
        return res.status(201).json({ url: `/uploads/${file.filename}` });
    });
    p.put('/:id', auth_1.authenticate, products.update);
    p.delete('/:id', auth_1.authenticate, products.remove);
    app.use('/products', p);
    // Orders routes (protected)
    const orders = new orders_1.OrdersController();
    const o = (0, express_1.Router)();
    o.get('/', auth_1.authenticate, orders.list);
    o.post('/', auth_1.authenticate, orders.create);
    o.put('/:id', auth_1.authenticate, orders.update);
    o.post('/:id/paid', auth_1.authenticate, orders.markPaid);
    app.use('/orders', o);
    // Settings routes (protected)
    const settings = new settings_1.SettingsController();
    const s = (0, express_1.Router)();
    s.get('/payment', auth_1.authenticate, settings.getPayment);
    s.post('/payment', auth_1.authenticate, settings.setPayment);
    s.post('/checkout', settings_1.createCheckoutSession);
    app.use('/settings', s);
};
exports.setRoutes = setRoutes;
