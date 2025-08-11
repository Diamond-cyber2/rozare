const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000';

export function getToken() {
  return localStorage.getItem('token') || '';
}

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as any),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}
