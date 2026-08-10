import React, { useState } from 'react';
import { X, Shield, Lock, Mail, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { UserAgent } from '../types';
import { supabase } from '../lib/supabase';

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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (authError) {
          setError('Identifiants incorrects ou compte non autorisé.');
          setLoading(false);
          return;
        }
      }

      const found = allAgents.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        setError('Compte agent non trouvé dans la base.');
        setLoading(false);
        return;
      }

      onLoginSuccess(found);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!email.trim()) {
      setError('Veuillez renseigner votre email.');
      return;
    }

    setLoading(true);
    try {
      if (supabase) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin, 
        });

        if (resetError) {
          setError(resetError.message);
          setLoading(false);
          return;
        }
      }

      setSuccessMsg(`Un lien de réinitialisation a été envoyé à ${email}`);
      setIsResetMode(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    }
    setLoading(false);
  };

  const handleQuickSelect = (agent: UserAgent) => {
    setEmail(agent.email);
    setPassword(''); // Cleared for security
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-full max-w-md overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isResetMode ? 'Réinitialisation du mot de passe' : 'Connexion Backoffice Support'}
              </h2>
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
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isResetMode ? (
            <>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Mot de passe</label>
                    <button 
                      type="button" 
                      onClick={() => setIsResetMode(true)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
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
            </>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-600 mb-4">
                Entrez votre adresse email professionnelle. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
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
              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  ENVOYER LE LIEN
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  RETOUR À LA CONNEXION
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
