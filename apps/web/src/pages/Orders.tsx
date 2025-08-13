import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useToast } from '../components/Toasts';

type Order = { id: string; number: string; total: number; status: string; createdAt: string };


const statusList = ['pending','paid','shipped','cancelled'];

const Orders: React.FC = () => {
  const [items, setItems] = useState<Order[]>([]);
  const [total, setTotal] = useState('');
  const [busy, setBusy] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { push } = useToast();

  const load = async () => {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    const data = await api<{ orders: Order[] }>(`/orders${params}`);
    setItems(data.orders);
  };

  useEffect(() => { load(); }, [statusFilter]);
  // Detect payment redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid')==='1') {
      push({ message: 'تم الدفع بنجاح', type: 'success' });
      const url = new URL(window.location.href); url.searchParams.delete('paid'); url.searchParams.delete('product'); window.history.replaceState({}, '', url.toString());
    } else if (params.get('cancel')==='1') {
      push({ message: 'تم إلغاء عملية الدفع', type: 'info' });
      const url = new URL(window.location.href); url.searchParams.delete('cancel'); window.history.replaceState({}, '', url.toString());
    }
  }, [push]);

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

  const updateStatus = async (id: string, status: string) => {
    await api(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    await load();
  };

  const exportCSV = () => {
    const header = 'رقم الطلب,الحالة,الإجمالي,تاريخ الإنشاء\n';
    const rows = items.map(o => `${o.number},${o.status},${o.total},${new Date(o.createdAt).toLocaleString('ar-EG')}`);
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="hero-title">الطلبات</h2>
      <form className="form-row" onSubmit={add}>
        <input className="input" placeholder="إجمالي الطلب" value={total} onChange={e=>setTotal(e.target.value)} />
        <button className="btn btn-primary" disabled={busy}>{busy? 'جارٍ الإضافة...' : 'إضافة طلب'}</button>
      </form>
      <div className="row-center gap-12 mt-12">
        <button className={statusFilter===''?'btn btn-primary':'btn'} onClick={()=>setStatusFilter('')}>الكل</button>
        {statusList.map(s=>(<button key={s} className={statusFilter===s?'btn btn-primary':'btn'} onClick={()=>setStatusFilter(s)}>{s}</button>))}
        <button className="btn" onClick={exportCSV}>تصدير CSV</button>
      </div>
      <div className="grid mt-16">
        {items.map(o => (
          <div key={o.id} className="card">
            <div className="row-between">
              <div>
                <div className="fw-700">طلب {o.number}</div>
                <div className="hero-sub">{o.status} • {new Date(o.createdAt).toLocaleString('ar-EG')}</div>
                <div>الإجمالي: ${o.total}</div>
              </div>
              <div className="col gap-10">
                <select className="input" value={o.status} onChange={e=>updateStatus(o.id, e.target.value)}>
                  {statusList.map(s=>(<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
