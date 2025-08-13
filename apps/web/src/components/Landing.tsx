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
    <section className="hero">
      <div className="container">
        <img src="/brand/hero1.jpg" alt="Rozare brand" style={{maxWidth:'320px',margin:'0 auto 24px',display:'block',borderRadius:'18px',boxShadow:'0 2px 16px #0002'}} />
        <h2 className="hero-title">Rozare — منصّتك لصناعة متاجر الدروبشيبنغ</h2>
        <p className="hero-sub">إدارة المتاجر، المنتجات، الطلبات، المحفظة، والنقاط — كل ذلك من لوحة واحدة.</p>
        <div className="countdown" role="timer" aria-live="polite">
          <div className="count-box">{fmt(left.d)} يوم</div>
          <div className="count-box">{fmt(left.h)} ساعة</div>
          <div className="count-box">{fmt(left.m)} دقيقة</div>
          <div className="count-box">{fmt(left.s)} ثانية</div>
        </div>
        {sent ? (
          <div className="status success">تم الاشتراك. سنراسلك فور الإطلاق ✨</div>
        ) : (
          <form onSubmit={onSubmit} className="form-row" noValidate>
            <input
              className="input"
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="البريد الإلكتروني"
              required
            />
            <button type="submit" className="btn btn-primary">سجل اهتمامك</button>
          </form>
        )}
        {err && <div className="status error">{err}</div>}
        <div id="features" className="grid">
          <div className="card">محفظة ونقاط</div>
          <div className="card">متجر إضافات</div>
          <div className="card">ثيمات متعددة</div>
          <div className="card">إشعارات واتساب</div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
