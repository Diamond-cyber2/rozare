import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { setRoutes } from './routes';

const app = express();

// Middleware
app.use(express.json());
// Enable CORS for local dev and general usage
app.use(cors({ origin: true }));

// Set up routes
setRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;