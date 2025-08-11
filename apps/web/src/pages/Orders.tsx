import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

type Order = { id: string; number: string; total: number; status: string; createdAt: string };

const Orders: React.FC = () => {
  const [items, setItems] = useState<Order[]>([]);
  const [total, setTotal] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const data = await api<{ orders: Order[] }>(`/orders`);
    setItems(data.orders);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api(`/orders`, { method: 'POST', body: JSON.stringify({ total: Number(total || 0), status: 'pending' }) });
      setTotal('');
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="hero-title">الطلبات</h2>
      <form className="form-row" onSubmit={add}>
        <input className="input" placeholder="إجمالي الطلب" value={total} onChange={e=>setTotal(e.target.value)} />
        <button className="btn btn-primary" disabled={busy}>{busy? 'جارٍ الإضافة...' : 'إضافة طلب'}</button>
      </form>
      <div className="grid">
        {items.map(o => (
          <div key={o.id} className="card">
            <div className="row-between">
              <div>
                <div className="fw-700">{o.number}</div>
                <div className="hero-sub">${o.total} • الحالة: {o.status}</div>
              </div>
              <span className="count-box">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
