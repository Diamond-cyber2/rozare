import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { setRoutes } from './routes';

const app = express();

// Middleware
app.use(express.json());
// Enable CORS for local dev and general usage
const origins = process.env.CORS_ORIGIN?.split(',').map(s => s.trim());
app.use(cors(origins ? { origin: origins } : undefined));
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));
// serve uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'data', 'uploads')));

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.get('/', (_req: Request, res: Response) => res.send('Welcome to the API!'));

// Set up routes
setRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;