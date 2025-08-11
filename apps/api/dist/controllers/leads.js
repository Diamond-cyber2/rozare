"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.join(process.cwd(), 'data');
const leadsFile = path_1.default.join(dataDir, 'leads.json');
function ensureStorage() {
    if (!fs_1.default.existsSync(dataDir))
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    if (!fs_1.default.existsSync(leadsFile))
        fs_1.default.writeFileSync(leadsFile, JSON.stringify([]));
}
class LeadsController {
    constructor() {
        this.list = (_req, res) => {
            try {
                ensureStorage();
                const raw = fs_1.default.readFileSync(leadsFile, 'utf-8');
                const leads = JSON.parse(raw);
                res.json({ leads });
            }
            catch (e) {
                res.status(500).json({ message: 'Failed to read leads' });
            }
        };
        this.create = (req, res) => {
            const { email } = req.body || {};
            if (!email || typeof email !== 'string') {
                return res.status(400).json({ message: 'Email is required' });
            }
            try {
                ensureStorage();
                const raw = fs_1.default.readFileSync(leadsFile, 'utf-8');
                const leads = JSON.parse(raw);
                const exists = leads.some((l) => l.email?.toLowerCase() === email.toLowerCase());
                if (!exists) {
                    leads.push({ email, ts: new Date().toISOString() });
                    fs_1.default.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
                }
                res.status(201).json({ ok: true });
            }
            catch (e) {
                res.status(500).json({ message: 'Failed to save lead' });
            }
        };
    }
}
exports.LeadsController = LeadsController;
