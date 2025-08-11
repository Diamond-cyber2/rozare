import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
const file = path.join(dataDir, 'products.json');

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
}

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  imageUrl?: string;
};

export class ProductsController {
  list = (_req: Request, res: Response) => {
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items = JSON.parse(raw);
      res.json({ products: items });
    } catch {
      res.status(500).json({ message: 'Failed to read products' });
    }
  };

  create = (req: Request, res: Response) => {
    const { name, price, stock, active, imageUrl } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ message: 'name required' });
    const p = Number(price);
    const s = Number(stock ?? 0);
    const a = Boolean(active ?? true);
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Product[] = JSON.parse(raw);
  const prod: Product = { id: crypto.randomUUID(), name, price: isNaN(p) ? 0 : p, stock: isNaN(s) ? 0 : s, active: a, createdAt: new Date().toISOString(), imageUrl };
      items.push(prod);
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      res.status(201).json({ product: prod });
    } catch {
      res.status(500).json({ message: 'Failed to save product' });
    }
  };

  update = (req: Request, res: Response) => {
    const id = (req.params as any)?.id as string;
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Product[] = JSON.parse(raw);
      const idx = items.findIndex((x) => x.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Not found' });
      const current = items[idx];
      const body = req.body || {};
      items[idx] = {
        ...current,
        name: body.name ?? current.name,
        price: body.price != null ? Number(body.price) : current.price,
        stock: body.stock != null ? Number(body.stock) : current.stock,
        active: body.active != null ? Boolean(body.active) : current.active,
      };
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      res.json({ product: items[idx] });
    } catch {
      res.status(500).json({ message: 'Failed to update product' });
    }
  };

  remove = (req: Request, res: Response) => {
    const id = (req.params as any)?.id as string;
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Product[] = JSON.parse(raw);
      const next = items.filter((x) => x.id !== id);
      fs.writeFileSync(file, JSON.stringify(next, null, 2));
      res.json({ ok: true });
    } catch {
      res.status(500).json({ message: 'Failed to delete product' });
    }
  };
}
