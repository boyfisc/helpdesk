const fs = require('fs');

let viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
if (!viteConfig.includes('envPrefix')) {
  viteConfig = viteConfig.replace(
    'plugins: [react(), tailwindcss()],',
    'envPrefix: [\'VITE_\', \'NEXT_PUBLIC_\'],\n    plugins: [react(), tailwindcss()],'
  );
  fs.writeFileSync('vite.config.ts', viteConfig);
}

let supabaseClient = fs.readFileSync('src/lib/supabase.ts', 'utf8');
supabaseClient = supabaseClient.replace(
  'const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;',
  'const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL;'
);
supabaseClient = supabaseClient.replace(
  'const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;',
  'const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY;'
);
fs.writeFileSync('src/lib/supabase.ts', supabaseClient);

let supabaseServer = fs.readFileSync('src/db/supabase-server.ts', 'utf8');
if (!supabaseServer.includes('NEXT_PUBLIC_SUPABASE_URL')) {
  supabaseServer = supabaseServer.replace(
    'process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;',
    'process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;'
  );
  fs.writeFileSync('src/db/supabase-server.ts', supabaseServer);
}
