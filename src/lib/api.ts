import { supabase } from './supabase';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }
    } catch (e) {
      console.warn('Supabase auth getSession failed:', e);
    }
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMsg = 'Failed to fetch';
    try {
      const errData = await res.json();
      if (errData.error) errorMsg = errData.error;
    } catch(e) {}
    throw new Error(errorMsg);
  }
  return res;
};
