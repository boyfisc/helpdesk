import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace('app.use((err: any, req: Request, res: Response, next: NextFunction) => {\n  console.error("Unhandled error:", err);\n  res.status(500).json({ error: "Internal Server Error", details: err.message });\n});\nexport default app;', 'export default app;');

content = content.replace('async function startServer() {', 'app.use((err: any, req: Request, res: Response, next: NextFunction) => {\n  console.error("Unhandled error:", err);\n  res.status(500).json({ error: "Internal Server Error", details: err.message });\n});\n\nasync function startServer() {');

fs.writeFileSync('server.ts', content);
