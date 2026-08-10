const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace("import { createServer as createViteServer } from 'vite';", "");
content = content.replace("const vite = await createViteServer({", "const { createServer: createViteServer } = await import('vite');\n    const vite = await createViteServer({");
fs.writeFileSync('server.ts', content);
