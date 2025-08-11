import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const dataDir = path.join(process.cwd(), 'data');
const file = path.join(dataDir, 'payment.json');

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ provider: 'manual', publicKey: '', secretKey: '' }));
}

export class SettingsController {
  getPayment = (_req: Request, res: Response) => {
    try { ensure(); const raw = fs.readFileSync(file, 'utf-8'); res.json(JSON.parse(raw)); }
    catch { res.status(500).json({ message: 'Failed to read settings' }); }
  };
  setPayment = (req: Request, res: Response) => {
    try { ensure(); fs.writeFileSync(file, JSON.stringify(req.body ?? {}, null, 2)); res.json({ ok: true }); }
    catch { res.status(500).json({ message: 'Failed to save settings' }); }
  };
}
