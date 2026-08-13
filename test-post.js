const http = require('http');

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

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/agents',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer NOT_VALID'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
