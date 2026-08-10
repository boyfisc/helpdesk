const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const fetchPublicTickets = async \(\) => \{\n\s+setLoading\(true\);\n\s+try \{\n\s+const res = await fetchApi\('\/api\/tickets\/public'\);\n\s+const data = await res\.json\(\);\n\s+setPublicTickets\(data\);/m,
  `const fetchPublicTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/api/tickets/public');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPublicTickets(data);
      } else {
        console.error('Invalid data received for public tickets:', data);
        setPublicTickets([]);
      }`
);

code = code.replace(
  /const fetchPrivateTickets = async \(\) => \{\n\s+try \{\n\s+const res = await fetchApi\('\/api\/tickets\/private'\);\n\s+const data = await res\.json\(\);\n\s+setAllTickets\(data\);/m,
  `const fetchPrivateTickets = async () => {
    try {
      const res = await fetchApi('/api/tickets/private');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllTickets(data);
      } else {
        console.error('Invalid data received for private tickets:', data);
        setAllTickets([]);
      }`
);

fs.writeFileSync('src/App.tsx', code);
