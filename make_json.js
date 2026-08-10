const fs = require('fs');
const b64 = fs.readFileSync('test.b64', 'utf8').replace(/\n/g, '');
const payload = {
  objectType: "INCIDENT",
  requesterName: "test",
  matriculeNinea: "123",
  position: "dev",
  phone: "123",
  email: "test@test.com",
  habilitation: "Agent",
  bureau: "Dakar",
  centreFiscal: "Dakar",
  description: "test",
  attachments: [{
    name: "test.bin",
    size: "2 MB",
    type: "application/octet-stream",
    url: "data:application/octet-stream;base64," + b64
  }]
};
fs.writeFileSync('payload.json', JSON.stringify(payload));
