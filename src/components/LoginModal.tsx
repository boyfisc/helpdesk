import React, { useState } from 'react';
import { X, Shield, Lock, Mail, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { UserAgent } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (agent: UserAgent) => void;
  allAgents: UserAgent[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  allAgents,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('dgid2026');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const found = allAgents.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setError('Identifiants incorrects ou compte non autorisé.');
      return;
    }

    onLoginSuccess(found);
    onClose();
  };

  const handleQuickSelect = (agent: UserAgent) => {
    setEmail(agent.email);
    onLoginSuccess(agent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-full max-w-md overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Connexion Backoffice Support</h2>
              <p className="text-xs text-slate-400">Direction Générale des Impôts et des Domaines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Selectors */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Comptes Démonstration pré-configurés
            </span>
            <div className="grid grid-cols-1 gap-2">
              {allAgents.map((ag) => (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => handleQuickSelect(ag)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                      {ag.firstName} {ag.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {ag.email}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    ag.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                    ag.role === 'ADMIN' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ag.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">Ou Saisie Manuelle</span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email professionnel</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.prenom@dgid.sn"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm"
            >
              SE CONNECTER AU BACKOFFICE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
