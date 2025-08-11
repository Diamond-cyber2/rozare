import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { setRoutes } from './routes';

const app = express();

// Middleware
app.use(express.json());
// Enable CORS for local dev and general usage
app.use(cors({ origin: true }));

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.get('/', (_req: Request, res: Response) => res.send('Welcome to the API!'));

// Set up routes
setRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;