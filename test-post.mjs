import fetch from 'node-fetch'; // if available? Or just use built-in fetch in Node 18+

const data = JSON.stringify({
  firstName: "Test",
  lastName: "User",
  email: "test_duplicate_123@example.com",
  phone: "123456789",
  matricule: "M123",
  role: "AGENT",
  habilitation: "Agent d'Assiette",
  poste: "Technicien Support",
  bureau: "Bureau DSI",
  direction: "Direction des Systèmes d'Information"
});

async function run() {
  const res = await fetch('http://localhost:3000/api/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
run();
