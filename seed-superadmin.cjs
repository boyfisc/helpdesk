const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://etabrqpjzdnhedgxybxo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_2VK7X2reUHz_2WYQfXssPw_2XZfzcMr';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const { data, error } = await supabase.from('agents').upsert({
    first_name: 'Sembene',
    last_name: 'Impot',
    email: 'sembeneimpot@gmail.com',
    phone: '',
    matricule: 'SUPERADMIN-001',
    role: 'SUPERADMIN',
    habilitation: 'Directeur / CT',
    poste: 'Directeur',
    bureau: 'Direction Générale',
    direction: 'DGID',
    status: 'ACTIVE'
  }, { onConflict: 'email' }).select();

  if (error) {
    console.error('Error creating superadmin:', error);
  } else {
    console.log('Superadmin created successfully:', data);
  }
}

seed();
