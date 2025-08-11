import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

type Product = { id: string; name: string; price: number; stock: number; active: boolean; createdAt: string; imageUrl?: string };

const Products: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    const data = await api<{ products: Product[] }>(`/products`);
    setItems(data.products);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setBusy(true);
    try {
      let imageUrl: string | undefined;
      if (file) {
        const form = new FormData();
        form.append('image', file);
        const res = await fetch((import.meta as any).env?.VITE_API_BASE + '/products/upload', {
          method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')||''}` }, body: form,
        });
        if (res.ok) { const d = await res.json(); imageUrl = d.url; }
      }
      await api(`/products`, { method: 'POST', body: JSON.stringify({ name, price: Number(price||0), stock: Number(stock||0), imageUrl }) });
      setName(''); setPrice(''); setStock('');
      setFile(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await api(`/products/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div>
      <h2 className="hero-title">المنتجات</h2>
  <form className="form-row" onSubmit={add}>
        <input className="input" placeholder="اسم المنتج" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="السعر" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="input" placeholder="المخزون" value={stock} onChange={e=>setStock(e.target.value)} />
    <label className="sr-only" htmlFor="prod-image">رفع صورة</label>
    <input id="prod-image" className="input" type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} title="رفع صورة" />
        <button className="btn btn-primary" disabled={busy}>
          {busy? 'جارٍ الإضافة...' : 'إضافة'}
        </button>
      </form>
      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card">
            <div className="row-between">
              <div>
                <div className="fw-700">{p.name}</div>
                <div className="hero-sub">${p.price} • مخزون: {p.stock}</div>
              </div>
      {p.imageUrl ? <img className="thumb" src={p.imageUrl} alt={p.name} /> : null}
              <button className="btn" onClick={()=>remove(p.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
