import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useToast } from '../components/Toasts';

type Product = { id: string; name: string; price: number; stock: number; active: boolean; createdAt: string; imageUrl?: string; images?: string[]; categories?: string[]; description?: string };

type EditState = Product & { open: boolean };

const Products: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt'|'price'|'name'>('createdAt');
  const [order, setOrder] = useState<'asc'|'desc'>('desc');
  const [buyingId, setBuyingId] = useState<string|null>(null);
  const [edit, setEdit] = useState<EditState|null>(null);
  const isAdmin = Boolean(localStorage.getItem('token'));
  const { push } = useToast();

  const load = async () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
  params.set('page', String(page));
    params.set('pageSize', String(pageSize));
  params.set('sortBy', sortBy);
  params.set('order', order);
    const data = await api<{ products: Product[]; total: number; page: number; pageSize: number }>(`/products?${params.toString()}`);
    setItems(data.products); setTotal(data.total); setPage(data.page); setPageSize(data.pageSize);
  };

  useEffect(() => { load(); }, [q, category, page, pageSize, sortBy, order]);
  // Payment cancel feedback
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if (params.get('cancel')==='1') {
      push({ message: 'تم إلغاء الدفع', type: 'info' });
      const url = new URL(window.location.href); url.searchParams.delete('cancel'); window.history.replaceState({}, '', url.toString());
    }
  }, [push]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setBusy(true);
    try {
      let images: string[] = [];
      if (files.length) {
        for (const file of files) {
          const form = new FormData();
          form.append('image', file);
          const res = await fetch((import.meta as any).env?.VITE_API_BASE + '/products/upload', {
            method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')||''}` }, body: form,
          });
          if (res.ok) { const d = await res.json(); images.push(d.url); }
        }
      }
      await api(`/products`, { method: 'POST', body: JSON.stringify({ name, price: Number(price||0), stock: Number(stock||0), images }) });
      setName(''); setPrice(''); setStock('');
      setFiles([]); setPreviewUrls([]);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
  await api(`/products/${id}`, { method: 'DELETE' });
  push({ message: 'تم حذف المنتج', type: 'success' });
  await load();
  };

  // Derived categories list
  const allCategories: string[] = React.useMemo(() => {
    return Array.from(new Set(items.flatMap((p: Product) => p.categories || []))).filter(Boolean) as string[];
  }, [items]);

  const openEdit = (p: Product) => setEdit({ ...p, open: true });
  const closeEdit = () => setEdit(null);
  const handleEditChange = (field: keyof Product, value: any) => setEdit(e => e ? { ...e, [field]: value } : e);
  const handleEditImageAdd = async (fList: FileList|null) => {
    if (!fList || !edit) return;
    let newImages = edit.images ? [...edit.images] : [];
    for (const file of Array.from(fList)) {
      const form = new FormData(); form.append('image', file);
      const res = await fetch((import.meta as any).env?.VITE_API_BASE + '/products/upload', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')||''}` }, body: form });
      if (res.ok) { const d = await res.json(); newImages.push(d.url); }
    }
    setEdit(e => e ? { ...e, images: newImages } : e);
  };
  const handleEditImageRemove = (idx: number) => setEdit(e => e && e.images ? { ...e, images: e.images.filter((_,i)=>i!==idx) } : e);
  const saveEdit = async () => {
    if (!edit) return;
    await api(`/products/${edit.id}`, { method: 'PUT', body: JSON.stringify({
      name: edit.name,
      price: edit.price,
      stock: edit.stock,
      active: edit.active,
      categories: edit.categories,
      description: edit.description,
      images: edit.images,
    }) });
  closeEdit();
  push({ message: 'تم حفظ التعديل', type: 'success' });
  await load();
  };

  return (
    <div>
      <h2 className="hero-title">المنتجات</h2>
      <div className="card">
        <form className="form-row" onSubmit={add}>
          <input className="input" placeholder="اسم المنتج" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="السعر" value={price} onChange={e=>setPrice(e.target.value)} />
          <input className="input" placeholder="المخزون" value={stock} onChange={e=>setStock(e.target.value)} />
          <label className="sr-only" htmlFor="prod-images">رفع صور</label>
          <input id="prod-images" className="input" type="file" accept="image/*" multiple onChange={e=>{
            const filesArr = Array.from(e.target.files||[]);
            setFiles(filesArr);
            setPreviewUrls(filesArr.map(f=>URL.createObjectURL(f)));
          }} title="رفع صور" />
          {previewUrls.length > 0 && (
            <div className="row-center gap-12 mt-12">
              {previewUrls.map((url,i)=>(<img key={i} src={url} alt="معاينة" className="thumb" />))}
            </div>
          )}
          <button className="btn btn-primary" disabled={busy}>
            {busy? 'جارٍ الإضافة...' : 'إضافة'}
          </button>
        </form>
      </div>
      <div className="grid">
        {items.length === 0 ? (
          <div className="card center empty-products-card">
            <img src="/brand/hero2.jpg" alt="منتجات Rozare" className="empty-products-img" />
            <div>لا توجد منتجات بعد</div>
          </div>
        ) : items.map(p => (
          <div key={p.id} className="card">
            <div className="row-between">
              <div>
                <div className="fw-700">{p.name}</div>
                <div className="hero-sub">${p.price} • مخزون: {p.stock}</div>
              </div>
              <div className="row-center gap-12">
                {p.images?.slice(0,3).map((u,i)=>(<img key={i} className="thumb" src={u} alt={p.name} />))}
                {p.imageUrl && (!p.images || !p.images.length) ? <img className="thumb" src={p.imageUrl} alt={p.name} /> : null}
              </div>
              <div className="row-center gap-12">
                {isAdmin ? (
                  <>
                    <button className="btn" onClick={()=>openEdit(p)}>تعديل</button>
                    <button className="btn" onClick={()=>remove(p.id)}>حذف</button>
                  </>
                ) : (
                  <button className="btn btn-primary" disabled={buyingId===p.id} onClick={async()=>{
                    setBuyingId(p.id);
                    try {
                      const res = await fetch((import.meta as any).env?.VITE_API_BASE + '/settings/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: p.id }),
                      });
                      const d = await res.json();
                      if (res.ok && d.url) window.location.href = d.url;
                      else alert(d.message||'فشل بدء الدفع');
                    } finally {
                      setBuyingId(null);
                    }
                  }}>{buyingId===p.id?'...':'شراء'}</button>
                )}
              </div>
      {edit && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3 className="fw-700 mb-12">تعديل المنتج</h3>
            <div className="col gap-10">
              <input className="input" value={edit.name} onChange={e=>handleEditChange('name', e.target.value)} placeholder="اسم المنتج" />
              <input className="input" value={edit.price} onChange={e=>handleEditChange('price', Number(e.target.value))} placeholder="السعر" type="number" />
              <input className="input" value={edit.stock} onChange={e=>handleEditChange('stock', Number(e.target.value))} placeholder="المخزون" type="number" />
              <label><input type="checkbox" checked={edit.active} onChange={e=>handleEditChange('active', e.target.checked)} /> مفعل</label>
              <input className="input" value={edit.description||''} onChange={e=>handleEditChange('description', e.target.value)} placeholder="الوصف" />
              <div>
                <div>التصنيفات:</div>
                <div className="row-center gap-10 mt-12">
                  {allCategories.map((cat: string) => (
                    <button type="button" key={cat} className={edit.categories?.includes(cat)?'btn btn-primary':'btn'} onClick={()=>{
                      let cats = edit.categories ? [...edit.categories] : [];
                      if (cats.includes(cat)) cats = cats.filter(c=>c!==cat);
                      else cats.push(cat);
                      handleEditChange('categories', cats);
                    }}>{cat}</button>
                  ))}
                </div>
                <input className="input mt-12" value={edit.categories?.filter(c=>!allCategories.includes(c)).join(',')||''} onChange={e=>handleEditChange('categories', e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} placeholder="تصنيفات جديدة (مفصولة بفاصلة)" />
              </div>
              <div>
                <div>الصور:</div>
                <div className="row-center gap-12 mt-12">
                  {edit.images?.map((url,i)=>(
                    <span key={i} className="thumb-wrapper">
                      <img src={url} alt="صورة" className="thumb" />
                      <button type="button" className="btn btn-danger btn-small" onClick={()=>handleEditImageRemove(i)}>×</button>
                    </span>
                  ))}
                </div>
                <input className="input mt-12" type="file" accept="image/*" multiple onChange={e=>handleEditImageAdd(e.target.files)} />
              </div>
              <div className="row-center gap-12 mt-16">
                <button className="btn btn-primary" onClick={saveEdit}>حفظ</button>
                <button className="btn" onClick={closeEdit}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
            </div>
          </div>
        ))}
      </div>
      <div className="row-center gap-12 mt-16">
        <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>السابق</button>
        <span className="count-box">صفحة {page}</span>
        <button className="btn" disabled={(page*pageSize)>=total} onClick={()=>setPage(p=>p+1)}>التالي</button>
      </div>
    </div>
  );
};

export default Products;
