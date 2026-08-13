import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log("1");
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: "test_duplicate_12345@example.com",
    password: 'Password123!',
    email_confirm: true
  });
  console.log("authError:", authError?.message);

  const { data: authData2, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
    email: "test_duplicate_12345@example.com",
    password: 'Password123!',
    email_confirm: true
  });
  console.log("authError2:", authError2?.message);

  const { data: existingAgent, error: exErr } = await supabaseAdmin.from('agents').select('id').eq('email', "test_duplicate_12345@example.com").single();
  console.log("existingAgent:", existingAgent, "exErr:", exErr?.message);

  const { data, error } = await supabaseAdmin.from('agents').insert({
    first_name: "Test",
    last_name: "User",
    email: "test_duplicate_12345@example.com",
    phone: "123",
    matricule: "123",
    role: "AGENT",
    habilitation: "Agent d'Assiette",
    poste: "Technicien",
    bureau: "Bureau",
    direction: "Dir",
    status: 'ACTIVE'
  }).select().single();
  console.log("Insert data:", data, "error:", error?.message);
}
run();
