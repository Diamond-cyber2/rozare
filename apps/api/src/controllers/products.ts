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
  images?: string[];
  categories?: string[];
  description?: string;
};

export class ProductsController {
  list = (req: Request, res: Response) => {
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      let items: Product[] = JSON.parse(raw);

      // Filters
      const q = (req.query.q as string) || '';
      const category = (req.query.category as string) || '';
      if (q) {
        const Q = q.toLowerCase();
        items = items.filter((p) => p.name.toLowerCase().includes(Q));
      }
      if (category) {
        items = items.filter((p) => (p.categories || []).includes(category));
      }

      // Sort
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const order = ((req.query.order as string) || 'desc').toLowerCase();
      items = items.sort((a, b) => {
        const dir = order === 'asc' ? 1 : -1;
        const va: any = (a as any)[sortBy];
        const vb: any = (b as any)[sortBy];
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });

      // Pagination
      const page = Math.max(1, Number(req.query.page || 1));
      const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize || 10)));
      const total = items.length;
      const start = (page - 1) * pageSize;
      const paged = items.slice(start, start + pageSize);

      res.json({ products: paged, total, page, pageSize });
    } catch {
      res.status(500).json({ message: 'Failed to read products' });
    }
  };

  create = (req: Request, res: Response) => {
    const { name, price, stock, active, imageUrl, images, categories, description } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ message: 'name required' });
    const p = Number(price);
    const s = Number(stock ?? 0);
    const a = Boolean(active ?? true);
    try {
      ensure();
      const raw = fs.readFileSync(file, 'utf-8');
      const items: Product[] = JSON.parse(raw);
      const cats = Array.isArray(categories)
        ? (categories as any[]).map(String)
        : typeof categories === 'string' && categories
        ? categories.split(',').map((x) => x.trim()).filter(Boolean)
        : [];
      const imgs = Array.isArray(images) ? images.map(String) : imageUrl ? [String(imageUrl)] : [];
      const prod: Product = {
        id: crypto.randomUUID(),
        name,
        price: isNaN(p) ? 0 : p,
        stock: isNaN(s) ? 0 : s,
        active: a,
        createdAt: new Date().toISOString(),
        imageUrl,
        images: imgs,
        categories: cats,
        description: description ? String(description) : undefined,
      };
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
        imageUrl: body.imageUrl != null ? String(body.imageUrl) : current.imageUrl,
        images: body.images ? (Array.isArray(body.images) ? body.images.map(String) : current.images) : current.images,
        categories:
          body.categories != null
            ? Array.isArray(body.categories)
              ? body.categories.map(String)
              : typeof body.categories === 'string'
              ? body.categories.split(',').map((x: string) => x.trim()).filter(Boolean)
              : current.categories
            : current.categories,
        description: body.description != null ? String(body.description) : current.description,
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
