import React, { useState } from 'react';
import { X, Send, AlertCircle, User, ArrowRight } from 'lucide-react';
import { Ticket, UserAgent } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  allAgents: UserAgent[];
  currentUser: UserAgent;
  onClose: () => void;
  onConfirmTransfer: (ticketId: string, targetAgent: UserAgent, reason: string) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  ticket,
  allAgents,
  currentUser,
  onClose,
  onConfirmTransfer,
}) => {
  const [targetAgentId, setTargetAgentId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAgentId) {
      setError('Veuillez sélectionner un agent destinataire.');
      return;
    }

    const targetAgent = allAgents.find((a) => a.id === targetAgentId);
    if (!targetAgent) {
      setError('Agent introuvable.');
      return;
    }

    onConfirmTransfer(ticket.id, targetAgent, transferReason);
    setTransferReason('');
    setTargetAgentId('');
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
            <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center text-white font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Transfert du Ticket</h2>
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

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Sélectionner l'agent destinataire <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={targetAgentId}
              onChange={(e) => setTargetAgentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="">-- Choisissez un agent du support --</option>
              {allAgents
                .filter((a) => a.id !== currentUser.id && a.status === 'ACTIVE')
                .map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.firstName} {ag.lastName} — {ag.poste} ({ag.role})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Motif du transfert
            </label>
            <textarea
              rows={3}
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder="Expliquez la raison du transfert (compétence technique spécifique, réallocation de charge...)"
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
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-sm"
            >
              CONFIRMER LE TRANSFERT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
