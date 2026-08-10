const fs = require('fs');
let code = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');

const regex = /const found = allAgents\.find[^;]+;[\s\S]+?onClose\(\);/m;

const loginNew = `const res = await fetchApi('/api/agents');
      const data = await res.json();
      if (Array.isArray(data)) {
        const found = data.find((a: any) => a.email.toLowerCase() === email.trim().toLowerCase());
        if (!found) {
          setError('Compte agent non trouvé dans la base.');
          setLoading(false);
          return;
        }
        onLoginSuccess(found);
        onClose();
      } else {
        // Fallback or error
        if (Array.isArray(allAgents)) {
          const fallbackFound = allAgents.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
          if (fallbackFound) {
            onLoginSuccess(fallbackFound);
            onClose();
            return;
          }
        }
        setError('Compte agent non trouvé dans la base.');
      }`;

code = code.replace(regex, loginNew);
fs.writeFileSync('src/components/LoginModal.tsx', code);
