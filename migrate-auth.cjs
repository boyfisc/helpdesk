const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  const { data: agents, error } = await supabase.from('agents').select('*');
  if (error) {
    console.error('Error fetching agents:', error);
    return;
  }
  
  for (const agent of agents) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: agent.email,
      password: 'dgid2026', // Default password
      email_confirm: true
    });
    
    if (authError) {
      console.log(`Failed to create auth user for ${agent.email}:`, authError.message);
    } else {
      console.log(`Created auth user for ${agent.email}`);
    }
  }
}

migrate();
