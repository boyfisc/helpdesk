import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function check() {
  const { data: agents } = await supabase.from('agents').select('email');
  const { data: authData } = await supabase.auth.admin.listUsers();
  console.log('Agents in DB:', agents?.map(a => a.email));
  console.log('Auth users:', authData?.users.map(u => u.email));
}
check();
