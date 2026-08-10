import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Mail, ShieldCheck } from 'lucide-react';
import { Ticket } from '../types';

interface ResolveModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onConfirmResolve: (ticketId: string, resolutionComment: string) => void;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  isOpen,
  ticket,
  onClose,
  onConfirmResolve,
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Veuillez saisir un commentaire de résolution.');
      return;
    }

    onConfirmResolve(ticket.id, comment);
    setComment('');
    onClose();
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
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Clôture du Ticket (Terminé)</h2>
              <p className="text-xs text-slate-400 font-mono">{ticket.ticketNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900 flex items-start space-x-2">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Notification Automatique :</strong> Un email sera automatiquement transmis au demandeur à l'adresse <strong className="font-mono">{ticket.email}</strong>.
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Commentaire de résolution <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez les actions correctives effectuées (ex: Incident corrigé en base de données. Le service est de nouveau fonctionnel.)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-sm"
            >
              CLÔTURER LE TICKET
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
