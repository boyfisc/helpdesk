#!/bin/bash
awk '
/^\/\/ Health check/ {
  print "import { NextFunction } from \"express\";"
  print ""
  print "const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {"
  print "  const authHeader = req.headers.authorization;"
  print "  if (!authHeader) {"
  print "    return res.status(401).json({ error: \"Non autorisé: Token manquant\" });"
  print "  }"
  print "  const token = authHeader.split(\" \")[1];"
  print "  if (!supabaseAdmin) return res.status(500).json({ error: \"Supabase non configuré\" });"
  print "  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);"
  print "  if (error || !user) {"
  print "    return res.status(401).json({ error: \"Non autorisé: Token invalide\" });"
  print "  }"
  print "  (req as any).user = user;"
  print "  next();"
  print "};"
  print ""
}
{ print $0 }
' server.ts > server_temp.ts
mv server_temp.ts server.ts
