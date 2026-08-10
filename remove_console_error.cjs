const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/console\.error\(/g, 'console.warn(');

fs.writeFileSync('src/App.tsx', code);
