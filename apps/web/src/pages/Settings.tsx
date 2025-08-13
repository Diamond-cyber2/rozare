import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const Settings: React.FC = () => {
  const [provider, setProvider] = useState('manual');
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [msg, setMsg] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const d = await api<any>('/settings/payment');
        setProvider(d.provider || 'manual');
        setPublicKey(d.publicKey || '');
        setSecretKey(d.secretKey || '');
      } catch {}
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/settings/payment', { method: 'POST', body: JSON.stringify({ provider, publicKey, secretKey }) });
      setMsg('تم الحفظ');
      setTimeout(() => setMsg(''), 1500);
    } catch {}
  };

  const testStripe = async () => {
    setTestResult('');
    try {
      // Placeholder: simulate test
      if (!publicKey || !secretKey) throw new Error('يرجى إدخال المفاتيح');
      setTestResult('تم الاتصال بنجاح (محاكاة)');
    } catch (e: any) {
      setTestResult(e.message || 'فشل الاتصال');
    }
  };
  return (
    <div>
      <h2 className="hero-title">الإعدادات</h2>
      <div className="card">
        <form className="form-row" onSubmit={save}>
          <label className="sr-only" htmlFor="pay-provider">مزود الدفع</label>
          <select id="pay-provider" className="input" value={provider} onChange={(e)=>setProvider(e.target.value)} title="مزود الدفع">
            <option value="manual">Manual</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
          </select>
          <input className="input" placeholder="Public Key" value={publicKey} onChange={e=>setPublicKey(e.target.value)} />
          <input className="input" placeholder="Secret Key" value={secretKey} onChange={e=>setSecretKey(e.target.value)} />
          <button className="btn btn-primary">حفظ</button>
        </form>
        {msg && <div className="status success">{msg}</div>}
      </div>
        <div className="mt-16">
          <button className="btn" onClick={testStripe} type="button">اختبار الاتصال بـ Stripe</button>
          {testResult && <div className="status mt-8">{testResult}</div>}
          <div className="mt-12 muted-note">
            <b>ملاحظة:</b> استخدم مفاتيح وضع الاختبار من Stripe. سيتم تفعيل الدفع الحقيقي بعد ربط حسابك.
          </div>
        </div>
    </div>
  );
};

export default Settings;
