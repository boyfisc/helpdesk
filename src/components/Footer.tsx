import React from 'react';
import { Shield, Phone, Mail, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenEmailHub: () => void;
  onOpenTrackModal: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEmailHub, onOpenTrackModal, onOpenLogin }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                DGID
              </div>
              <span className="text-white font-bold text-base tracking-tight">SENTAX — Support</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SaaS Officiel de gestion des incidents et requêtes techniques pour les agents et usagers des plateformes numériques de la Direction Générale des Impôts et des Domaines (DGID Senegal).
            </p>
            <div className="pt-2 text-xs text-emerald-400 flex items-center space-x-1.5 font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Système sécurisé et audité</span>
            </div>
          </div>

          {/* Col 2: Services & Platforms */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Plateformes Prises en Charge
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>SENTAX Backoffice & Contribuables</li>
              <li>SENTAX E-Banque & E-Services</li>
              <li>SEN-ETAFI & MPAY</li>
              <li>Mon Espace-Perso & SENTIMBRES</li>
              <li>DGID Digital, PCF, COFI</li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Liens Rapides
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenTrackModal} className="hover:text-emerald-400 flex items-center space-x-1 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suivre le statut d'un ticket</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenEmailHub} className="hover:text-emerald-400 flex items-center space-x-1 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Consulter le journal des notifications mail</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenLogin} className="hover:text-emerald-400 flex items-center space-x-1 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Accès Backoffice Agents / Admin</span>
                </button>
              </li>
              <li>
                <a
                  href="https://dgid.sn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center space-x-1 transition-colors"
                >
                  <span>Portail officiel DGID.sn</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact */}
          <div className="space-y-2 text-xs">
            <h4 className="text-white font-semibold uppercase tracking-wider mb-3">
              Support Technique DGID
            </h4>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Direction des Systèmes d'Information (DSI)<br />Rue de Thiong, Dakar, Sénégal</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>+221 33 889 20 02 / Support DSI</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-mono text-emerald-300">support-technique-sentax@dgid.sn</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Direction Générale des Impôts et des Domaines (DGID) — République du Sénégal.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4 text-[11px]">
            <span>Version 2.4.0 (SENTAX ITSM)</span>
            <span>•</span>
            <span>Règles de Confidentialité RGPD / CDP SÉNÉGAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
