import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the useEffect block for supabase
const target = `    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsUpdatePasswordOpen(true);
        }
      });`;

const replacement = `    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          fetchApi('/api/agents')
            .then(res => res.json())
            .then((data) => {
              const found = data.find((a: UserAgent) => a.email === session.user.email);
              if (found) {
                setCurrentUser(found);
                setCurrentView('backoffice');
              }
            })
            .catch(console.error);
        }
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsUpdatePasswordOpen(true);
        } else if (event === "SIGNED_IN" && session?.user?.email) {
          fetchApi('/api/agents')
            .then(res => res.json())
            .then((data) => {
              const found = data.find((a: UserAgent) => a.email === session.user.email);
              if (found) {
                setCurrentUser(found);
              }
            })
            .catch(console.error);
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          setCurrentView('public-home');
        }
      });`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
