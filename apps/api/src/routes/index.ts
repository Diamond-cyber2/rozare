import { Router, Express } from 'express';
import { IndexController } from '../controllers';
import { authenticate } from '../middlewares/auth';
import jwt from 'jsonwebtoken';
import { LeadsController } from '../controllers/leads';
import { ProductsController } from '../controllers/products';
import { OrdersController } from '../controllers/orders';

const indexController = new IndexController();

export const setRoutes = (app: Express) => {
    const router = Router();
    router.get('/', indexController.getIndex.bind(indexController));
    router.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

    app.use('/', router);

    // Leads routes
    const leads = new LeadsController();
    const leadsRouter = Router();
    leadsRouter.get('/', leads.list);
    leadsRouter.post('/', leads.create);
    app.use('/leads', leadsRouter);

    // Auth routes
    const auth = Router();
    auth.post('/login', (req, res) => {
        const { email, password } = req.body || {};
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin#2025';
        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ sub: 'admin', role: 'ADMIN', email }, process.env.JWT_SECRET || 'dev-secret', {
                expiresIn: '7d',
            });
            return res.json({ token });
        }
        return res.status(401).json({ message: 'Invalid credentials' });
    });

    auth.get('/me', authenticate, (req, res) => {
        res.json({ user: (req as any).user });
    });

    app.use('/admin', auth);

    // Products routes (protected)
    const products = new ProductsController();
    const p = Router();
    p.get('/', authenticate, products.list);
    p.post('/', authenticate, products.create);
    p.put('/:id', authenticate, products.update);
    p.delete('/:id', authenticate, products.remove);
    app.use('/products', p);

    // Orders routes (protected)
    const orders = new OrdersController();
    const o = Router();
    o.get('/', authenticate, orders.list);
    o.post('/', authenticate, orders.create);
    app.use('/orders', o);
};