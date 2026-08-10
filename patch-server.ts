import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

// We want to export app
content = content.replace("const app = express();", "export const app = express();\n\n// Add export default for Vercel\nexport default app;");

const serverStart = `async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}
startServer();`;

const replacement = `async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production (e.g. Railway), serve static files
    // NOTE: On Vercel, static files are served by Vercel automatically.
    // We only need to serve them here if not on Vercel.
    if (!process.env.VERCEL) {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }
  
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  }
}

// Only start the server if not running on Vercel
if (!process.env.VERCEL) {
  startServer();
}`;

content = content.replace(serverStart, replacement);
fs.writeFileSync('server.ts', content);
