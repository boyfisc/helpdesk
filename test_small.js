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
  attachments: []
};
require('fs').writeFileSync('payload_small.json', JSON.stringify(payload));
