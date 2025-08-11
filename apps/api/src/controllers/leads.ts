import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const dataDir = path.join(process.cwd(), 'data');
const leadsFile = path.join(dataDir, 'leads.json');

function ensureStorage() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(leadsFile)) fs.writeFileSync(leadsFile, JSON.stringify([]));
}

export class LeadsController {
  list = (_req: Request, res: Response) => {
    try {
      ensureStorage();
      const raw = fs.readFileSync(leadsFile, 'utf-8');
      const leads = JSON.parse(raw);
      res.json({ leads });
    } catch (e) {
      res.status(500).json({ message: 'Failed to read leads' });
    }
  };

  create = (req: Request, res: Response) => {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }
    try {
      ensureStorage();
      const raw = fs.readFileSync(leadsFile, 'utf-8');
      const leads = JSON.parse(raw);
  const exists = (leads as Array<{ email: string }>).some((l) => l.email?.toLowerCase() === email.toLowerCase());
      if (!exists) {
        leads.push({ email, ts: new Date().toISOString() });
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
      }
      res.status(201).json({ ok: true });
    } catch (e) {
      res.status(500).json({ message: 'Failed to save lead' });
    }
  };
}
