"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Enable CORS for local dev and general usage
const origins = process.env.CORS_ORIGIN?.split(',').map(s => s.trim());
app.use((0, cors_1.default)(origins ? { origin: origins } : undefined));
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 200 }));
// serve uploads
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'data', 'uploads')));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.send('Welcome to the API!'));
// Set up routes
(0, routes_1.setRoutes)(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
