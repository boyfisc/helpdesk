import { supabase } from './src/lib/supabase';
async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test_duplicate_123456@example.com',
    password: 'Password123!'
  });
  console.log(data?.session?.access_token);
}
run();
