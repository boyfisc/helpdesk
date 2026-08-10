const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const tickets = [
  {
    ticket_number: 'ST-2026-000121',
    object_type: 'SIGNALER UN INCIDENT TECHNIQUE',
    platform: 'SENTAX BACK OFFICE',
    matricule_ninea: 'NINEA-10982348',
    requester_name: 'Mamadou Diallo',
    position: 'Chef de Section Assiette',
    phone: '+221 77 123 99 88',
    email: 'm.diallo@dgid.sn',
    habilitation: 'Chef de Section / UGF',
    bureau: 'Bureau des Impôts indirects',
    centre_fiscal: 'DAKAR-PLATEAU',
    description: 'Impossibilité de valider la quittance de paiement pour la déclaration du trimestre T2.',
    status: 'EN ATTENTE'
  },
  {
    ticket_number: 'ST-2026-000122',
    object_type: 'EFFECTUER UNE REQUÊTE',
    platform: 'E-SERVICES',
    matricule_ninea: 'NINEA-88771234',
    requester_name: 'Société SENEGAL AGRI SA',
    position: 'Comptable Agréé',
    phone: '+221 33 821 00 11',
    email: 'contact@senegal-agri.sn',
    habilitation: 'Comptable',
    bureau: 'Bureau Recouvrement',
    centre_fiscal: 'CENTRE DES MOYENNES ENTREPRISES DAKAR 1',
    description: 'Demande de réinitialisation du mot de passe de l\'espace télé-déclaration.',
    status: 'PRISE EN CHARGE',
    assigned_agent_id: null,
    taken_at: '2026-08-07T09:00:00Z',
  }
];

async function seed() {
  const { data: agents } = await supabase.from('agents').select('id, first_name');
  if (agents && agents.length > 1) {
    tickets[1].assigned_agent_id = agents.find(a => a.first_name === 'Fatou').id;
  }
  for (const t of tickets) {
    await supabase.from('tickets').upsert(t, { onConflict: 'ticket_number' });
  }
  console.log('Mock tickets seeded');
}

seed();
