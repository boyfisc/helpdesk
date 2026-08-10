import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace('const formatted = data.map((t: any) => ({', 'const formatted = (data || []).map((t: any) => ({');
content = content.replace('const historyFormatted = data.ticket_history.map((h: any) => ({', 'const historyFormatted = (data.ticket_history || []).map((h: any) => ({');
content = content.replace('const formatted = data.map(a => ({', 'const formatted = (data || []).map(a => ({');
content = content.replace('const total = data.length;', 'const total = (data || []).length;');
content = content.replace('data.forEach(t => {', '(data || []).forEach(t => {');
content = content.replace('const formatted = data.map(e => ({', 'const formatted = (data || []).map(e => ({');
fs.writeFileSync('server.ts', content);
