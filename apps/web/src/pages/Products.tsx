import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

type Product = { id: string; name: string; price: number; stock: number; active: boolean; createdAt: string };

const Products: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [busy, setBusy] = useState(false);

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
      await api(`/products`, { method: 'POST', body: JSON.stringify({ name, price: Number(price||0), stock: Number(stock||0) }) });
      setName(''); setPrice(''); setStock('');
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
              <button className="btn" onClick={()=>remove(p.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
