const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace("const { createServer: createViteServer } = await import('vite');", "const viteModule = 'vite';\n    const { createServer: createViteServer } = await import(viteModule /* @vite-ignore */);");
fs.writeFileSync('server.ts', content);
