import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = "import 'express-async-errors';\n" + content;
content = content.replace('export default app;', 'app.use((err: any, req: Request, res: Response, next: NextFunction) => {\n  console.error("Unhandled error:", err);\n  res.status(500).json({ error: "Internal Server Error", details: err.message });\n});\nexport default app;');
fs.writeFileSync('server.ts', content);
