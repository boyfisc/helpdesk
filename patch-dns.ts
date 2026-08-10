import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace('import dns from "dns";\ndns.setDefaultResultOrder("ipv4first");', 'import dns from "dns";\ntry { dns.setDefaultResultOrder("ipv4first"); } catch (e) { console.error("DNS error", e); }');
fs.writeFileSync('server.ts', content);
