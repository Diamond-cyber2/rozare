"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexController = exports.listLeads = exports.createLead = void 0;
async function createLead(req, res) {
    const { email } = req.body ?? {};
    if (!email)
        return res.status(400).json({ error: 'email required' });
    // ...existing code... (حفظ الإيميل)
    return res.status(201).json({ ok: true });
}
exports.createLead = createLead;
async function listLeads(_req, res) {
    // ...existing code... (جلب الإيميلات)
    return res.json({ leads: [] });
}
exports.listLeads = listLeads;
class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the API!');
    }
}
exports.IndexController = IndexController;
