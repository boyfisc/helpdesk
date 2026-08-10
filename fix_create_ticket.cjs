const fs = require('fs');
let code = fs.readFileSync('src/components/CreateTicketModal.tsx', 'utf8');

// 1. Add file size limit
const fileUploadRegex = /const sizeKb = Math\.round\(file\.size \/ 1024\);/;
const fileUploadNew = `const sizeKb = Math.round(file.size / 1024);
      if (sizeKb > 2048) {
        setErrorMessage("Le fichier est trop volumineux (limite: 2 MB).");
        return;
      }`;
code = code.replace(fileUploadRegex, fileUploadNew);

// 2. Handle non-JSON responses
const parseRegex = /const data = await response\.json\(\);/;
const parseNew = `let data: any;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (text.includes("The page") || text.includes("413") || response.status === 413) {
          throw new Error("Le fichier est trop volumineux pour être envoyé.");
        }
        throw new Error("Erreur serveur: " + text.substring(0, 50));
      }`;
code = code.replace(parseRegex, parseNew);

fs.writeFileSync('src/components/CreateTicketModal.tsx', code);
