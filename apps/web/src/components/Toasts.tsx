import React, { createContext, useCallback, useContext, useState } from 'react';

export type Toast = { id: string; message: string; type?: 'success'|'error'|'info'; timeout?: number };

type ToastCtx = { toasts: Toast[]; push: (t: Omit<Toast,'id'>) => void; remove: (id: string) => void };
const C = createContext<ToastCtx|null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const remove = useCallback((id: string) => setToasts(ts => ts.filter(t=>t.id!==id)), []);
  const push = useCallback((t: Omit<Toast,'id'>) => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, timeout: 4000, ...t };
    setToasts(ts => [...ts, toast]);
    if (toast.timeout) setTimeout(()=>remove(id), toast.timeout);
  }, [remove]);
  return <C.Provider value={{ toasts, push, remove }}>
    {children}
    <div className="toast-stack" dir="rtl">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type||'info'}`}>{t.message}</div>
      ))}
    </div>
  </C.Provider>;
};

export function useToast() {
  const ctx = useContext(C); if (!ctx) throw new Error('Missing ToastProvider'); return ctx;
}
