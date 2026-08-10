const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /onLogout=\{\(\) => \{\s+setCurrentUser\(null\);\s+setCurrentView\('public-home'\);\s+\}\}/m;
const newCode = `onLogout={async () => {
            if (supabase) await supabase.auth.signOut();
            setCurrentUser(null);
            setCurrentView('public-home');
          }}`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/App.tsx', code);
