import { useCallback, useMemo } from 'react';

export function useAuth() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const isAuthed = useMemo(() => Boolean(token), [token]);
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }, []);
  return { token, isAuthed, logout };
}
