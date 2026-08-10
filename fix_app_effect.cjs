const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /if \(currentUser\) \{\s+fetchPrivateTickets\(\);\s+\}/m;
const newCode = `if (currentUser) {
      fetchPrivateTickets();
      fetchAllAgents();
    }`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/App.tsx', code);
