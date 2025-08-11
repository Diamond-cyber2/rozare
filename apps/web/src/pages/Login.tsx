import React, { useState } from 'react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error('invalid');
      }
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        throw new Error('invalid');
      }
    } catch {
      setErr('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container hero">
      <h2 className="hero-title">تسجيل الدخول</h2>
      <p className="hero-sub">استخدم بيانات المسؤول للدخول إلى لوحة التحكم.</p>
      <form className="form-row" onSubmit={onSubmit} noValidate>
        <input className="input" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'جارٍ الدخول...' : 'دخول'}</button>
      </form>
      {err && <div className="status error">{err}</div>}
    </div>
  );
};

export default Login;
