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
  let res;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    console.error('Fetch network error:', err);
    throw new Error('Erreur de connexion (Failed to fetch). Le serveur est peut-être en cours de redémarrage.');
  }

  if (!res.ok) {
    let errorMsg = 'Erreur inattendue';
    try {
      const textData = await res.text();
      console.error('API Error Response Text:', textData);
      const errData = JSON.parse(textData);
      if (errData.error) errorMsg = errData.error;
    } catch(e) {
      errorMsg = `Erreur serveur (${res.status})`;
    }
    throw new Error(errorMsg);
  }
  return res;
};
