const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Ensure app is exported
if (!content.includes('export const app = express();')) {
  content = content.replace('const app = express();', 'export const app = express();');
}

// Remove unconditional startServer()
content = content.replace('startServer();', 'if (!process.env.VERCEL) {\n  startServer();\n}');

fs.writeFileSync('server.ts', content);
