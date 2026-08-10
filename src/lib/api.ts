import { supabase } from './supabase';

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }
  return fetch(url, options);
};
