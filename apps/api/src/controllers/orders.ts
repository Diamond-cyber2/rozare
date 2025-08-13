import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
const file = path.join(dataDir, 'orders.json');

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
}

type Order = {
  id: string;
  number: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
};

export class OrdersController {
  list = (req: Request, res: Response) => {
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      let items: Order[] = JSON.parse(raw);
      const status = (req.query.status as Order['status']) || '';
      if (status) items = items.filter(o => o.status === status);
      res.json({ orders: items });
    } catch {
      res.status(500).json({ message: 'Failed to read orders' });
    }
  };

  create = (req: Request, res: Response) => {
    const { total, status } = req.body || {};
    const t = Number(total ?? 0);
    const st = (status as Order['status']) || 'pending';
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Order[] = JSON.parse(raw);
      const id = crypto.randomUUID();
      const ord: Order = { id, number: `#${(items.length + 1001)}`, total: isNaN(t) ? 0 : t, status: st, createdAt: new Date().toISOString() };
      items.push(ord);
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      res.status(201).json({ order: ord });
    } catch {
      res.status(500).json({ message: 'Failed to create order' });
    }
  };

  update = (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ message: 'status required' });
    if (!['pending','paid','shipped','cancelled'].includes(status)) return res.status(400).json({ message: 'invalid status' });
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Order[] = JSON.parse(raw);
      const idx = items.findIndex(o => o.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Not found' });
      items[idx].status = status as Order['status'];
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      res.json({ order: items[idx] });
    } catch {
      res.status(500).json({ message: 'Failed to update order' });
    }
  };

  markPaid = (req: Request, res: Response) => {
    // simplistic: mark by id
    const id = req.params.id;
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Order[] = JSON.parse(raw);
      const idx = items.findIndex(o=>o.id===id);
      if (idx === -1) return res.status(404).json({ message: 'Not found' });
      items[idx].status = 'paid';
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      res.json({ order: items[idx] });
    } catch {
      res.status(500).json({ message: 'Failed to mark paid' });
    }
  };
}
