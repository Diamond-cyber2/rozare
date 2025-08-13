import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import Stripe from 'stripe';

const dataDir = path.join(process.cwd(), 'data');
const paymentFile = path.join(dataDir, 'payment.json');
const productsFile = path.join(dataDir, 'products.json');

function ensurePayment() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(paymentFile)) fs.writeFileSync(paymentFile, JSON.stringify({ provider: 'manual', publicKey: '', secretKey: '' }, null, 2));
}

function getStripeKeys() {
  ensurePayment();
  try {
    const d = JSON.parse(fs.readFileSync(paymentFile, 'utf-8'));
    return { publicKey: d.publicKey || '', secretKey: d.secretKey || '' };
  } catch { return { publicKey: '', secretKey: '' }; }
}

export class SettingsController {
  getPayment = (_req: Request, res: Response) => {
    try { ensurePayment(); const raw = fs.readFileSync(paymentFile, 'utf-8'); res.json(JSON.parse(raw)); }
    catch { res.status(500).json({ message: 'Failed to read settings' }); }
  };
  setPayment = (req: Request, res: Response) => {
    try { ensurePayment(); fs.writeFileSync(paymentFile, JSON.stringify(req.body ?? {}, null, 2)); res.json({ ok: true }); }
    catch { res.status(500).json({ message: 'Failed to save settings' }); }
  };
}

export async function createCheckoutSession(req: Request, res: Response) {
  const { productId } = req.body || {};
  if (!productId) return res.status(400).json({ message: 'productId required' });
  if (!fs.existsSync(productsFile)) return res.status(404).json({ message: 'No products' });
  let products: any[] = [];
  try { products = JSON.parse(fs.readFileSync(productsFile, 'utf-8')); } catch { return res.status(500).json({ message: 'Failed to read products' }); }
  const prod = products.find(p => p.id === productId);
  if (!prod) return res.status(404).json({ message: 'Product not found' });

  const { secretKey } = getStripeKeys();
  if (!secretKey) return res.status(500).json({ message: 'Stripe not configured' });
  const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  try {
    const successBase = (req.headers.origin as string) || process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: { currency: 'usd', product_data: { name: prod.name }, unit_amount: Math.round(Number(prod.price) * 100) },
        quantity: 1,
      }],
      success_url: successBase + '/orders?paid=1&product=' + encodeURIComponent(prod.id),
      cancel_url: successBase + '/products?cancel=1',
    });
    res.json({ url: session.url });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Stripe error' });
  }
}
