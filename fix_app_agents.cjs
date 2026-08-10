const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const data = await res\.json\(\);\s+setAllAgents\(data\);/m;
const newCode = `const data = await res.json();
      if (Array.isArray(data)) {
        setAllAgents(data);
      }`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/App.tsx', code);
