import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

const targetTs = () => {
  const now = new Date();
  const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  return inFiveDays;
};

const fmt = (n: number) => n.toString().padStart(2, '0');

const Landing: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number }>({ d: 0, h: 0, m: 0, s: 0 });
  const target = useMemo(() => targetTs(), []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, target.getTime() - now);
      const d = Math.floor(diff / (24 * 3600 * 1000));
      const h = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
      const m = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const s = Math.floor((diff % (60 * 1000)) / 1000);
      setLeft({ d, h, m, s });
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('من فضلك أدخل بريد إلكتروني صالح');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('failed');
      setSent(true);
    } catch (e) {
      setErr('حدث خطأ أثناء الإرسال. حاول مرة أخرى');
    }
  };

  return (
    <section style={{ padding: '48px 16px', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 36, marginBottom: 12 }}>Rozare — منصتك لصناعة متاجر الدروبشيبنج</h2>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>إدارة المتاجر، المنتجات، الطلبات، المحفظة، والنقاط — كل ذلك من لوحة واحدة.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ padding: 12, border: '1px solid #334155', borderRadius: 8, minWidth: 80 }}>{fmt(left.d)} يوم</div>
        <div style={{ padding: 12, border: '1px solid #334155', borderRadius: 8, minWidth: 80 }}>{fmt(left.h)} ساعة</div>
        <div style={{ padding: 12, border: '1px solid #334155', borderRadius: 8, minWidth: 80 }}>{fmt(left.m)} دقيقة</div>
        <div style={{ padding: 12, border: '1px solid #334155', borderRadius: 8, minWidth: 80 }}>{fmt(left.s)} ثانية</div>
      </div>
      {sent ? (
        <div style={{ color: '#22c55e', fontWeight: 600 }}>تم الاشتراك. سنراسلك فور الإطلاق ✨</div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px 16px', minWidth: 280, borderRadius: 8, border: '1px solid #475569' }}
          />
          <button type="submit" style={{ padding: '12px 16px', borderRadius: 8 }}>سجل اهتمامك</button>
        </form>
      )}
      {err && <div style={{ color: '#ef4444', marginTop: 8 }}>{err}</div>}
      <div id="features" style={{ marginTop: 48, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div style={{ border: '1px solid #334155', borderRadius: 8, padding: 16 }}>محفظة ونقاط</div>
        <div style={{ border: '1px solid #334155', borderRadius: 8, padding: 16 }}>متجر إضافات</div>
        <div style={{ border: '1px solid #334155', borderRadius: 8, padding: 16 }}>ثيمات متعددة</div>
        <div style={{ border: '1px solid #334155', borderRadius: 8, padding: 16 }}>إشعارات واتساب</div>
      </div>
    </section>
  );
};

export default Landing;
