import { Request, Response } from 'express';

type LeadBody = { email?: string };

export async function createLead(
  req: Request<unknown, unknown, LeadBody>,
  res: Response
) {
  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'email required' });

  // ...existing code... (حفظ الإيميل)
  return res.status(201).json({ ok: true });
}

export async function listLeads(_req: Request, res: Response) {
  // ...existing code... (جلب الإيميلات)
  return res.json({ leads: [] });
}

export class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the API!');
    }
}
