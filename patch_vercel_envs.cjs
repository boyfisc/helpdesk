const fs = require('fs');

let supabaseClient = fs.readFileSync('src/lib/supabase.ts', 'utf8');
supabaseClient = supabaseClient.replace(
  'const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL;',
  'const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL || (import.meta as any).env.VITE_PUBLIC_SUPABASE_URL;'
);
supabaseClient = supabaseClient.replace(
  'const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY;',
  'const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (import.meta as any).env.VITE_PUBLIC_SUPABASE_ANON_KEY;'
);
fs.writeFileSync('src/lib/supabase.ts', supabaseClient);

let supabaseServer = fs.readFileSync('src/db/supabase-server.ts', 'utf8');
supabaseServer = supabaseServer.replace(
  'process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;',
  'process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;'
);
fs.writeFileSync('src/db/supabase-server.ts', supabaseServer);
