import fs from 'fs';
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Add user to props
content = content.replace("interface FooterProps {", "import { UserAgent } from '../types';\n\ninterface FooterProps {\n  user?: UserAgent | null;");
content = content.replace("export const Footer: React.FC<FooterProps> = ({ onOpenEmailHub, onOpenTrackModal, onOpenLogin }) => {", "export const Footer: React.FC<FooterProps> = ({ user, onOpenEmailHub, onOpenTrackModal, onOpenLogin }) => {");

// Reduce paddings
content = content.replace('py-10', 'py-6');
content = content.replace('gap-8', 'gap-4');
content = content.replace('mt-8 pt-6', 'mt-4 pt-4');
content = content.replace('space-y-3', 'space-y-2');
content = content.replace('space-y-2 text-xs', 'space-y-1.5 text-xs');
content = content.replace('mb-3', 'mb-2').replace('mb-3', 'mb-2').replace('mb-3', 'mb-2');

// Hide Liens Rapides
content = content.replace(
  "{/* Col 3: Quick Navigation */}",
  "{/* Col 3: Quick Navigation */}\n          {user?.role === 'SUPER_ADMIN' && ("
);

content = content.replace(
  "{/* Col 4: Official Contact */}",
  ")}\n\n          {/* Col 4: Official Contact */}"
);

fs.writeFileSync('src/components/Footer.tsx', content);
