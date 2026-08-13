import { supabaseAdmin } from './src/db/supabase-server';

async function run() {
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const u = users.find(u => u.email === 'test_duplicate_123456@example.com');
  console.log(u?.id);
}
run();
