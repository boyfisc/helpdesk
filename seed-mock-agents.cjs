const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_AGENTS = [
  {
    first_name: 'Amadou',
    last_name: 'Diagne',
    email: 'amadou.diagne@dgid.sn',
    phone: '+221 77 654 32 10',
    matricule: 'DGID-654321',
    role: 'SUPERADMIN',
    habilitation: 'Chef de Centre / Chef de Division',
    poste: 'Administrateur Système Support SENTAX',
    bureau: 'Bureau Informatique DSI',
    direction: 'Direction des Systèmes d\'Information',
    status: 'ACTIVE'
  },
  {
    first_name: 'Fatou',
    last_name: 'Fall',
    email: 'fatou.fall@dgid.sn',
    phone: '+221 78 123 45 67',
    matricule: 'DGID-781234',
    role: 'ADMIN',
    habilitation: 'Chef de Bureau',
    poste: 'Superviseur Support Technique',
    bureau: 'Bureau Assistance Utilisateurs',
    direction: 'Direction des Systèmes d\'Information',
    status: 'ACTIVE'
  },
  {
    first_name: 'Ousmane',
    last_name: 'Ndiaye',
    email: 'ousmane.ndiaye@dgid.sn',
    phone: '+221 70 987 65 43',
    matricule: 'DGID-709876',
    role: 'AGENT',
    habilitation: 'Agent d\'Assiette',
    poste: 'Agent Support Niveau 1',
    bureau: 'Bureau Assistance Utilisateurs',
    direction: 'Direction des Systèmes d\'Information',
    status: 'ACTIVE'
  }
];

async function seed() {
  for (const agent of INITIAL_AGENTS) {
    await supabase.from('agents').upsert(agent, { onConflict: 'email' });
  }
  console.log('Mock agents created successfully');
}

seed();
