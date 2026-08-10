import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      if (supabase) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-full max-w-md overflow-hidden my-6 transform transition-all">
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white">Créer un nouveau mot de passe</h2>
          </div>
          {!success && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-6 rounded-lg flex flex-col items-center space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              <div>
                <h3 className="font-bold text-emerald-900 mb-1">Mot de passe mis à jour !</h3>
                <p className="text-xs text-emerald-700">Votre mot de passe a été modifié avec succès.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'ENREGISTREMENT...' : 'ENREGISTRER LE MOT DE PASSE'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
