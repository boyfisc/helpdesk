import { fetchApi } from "../lib/api";
import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  Paperclip,
  History,
  Send,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Ticket, TicketHistoryItem } from '../types';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
  onTakeOver: (ticketId: string) => void;
  onOpenTransferModal: (ticket: Ticket) => void;
  onOpenResolveModal: (ticket: Ticket) => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  ticket,
  onClose,
  onTakeOver,
  onOpenTransferModal,
  onOpenResolveModal,
}) => {
  const [history, setHistory] = useState<TicketHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (ticket) {
      fetchTicketHistory();
    }
  }, [ticket]);

  const fetchTicketHistory = async () => {
    if (!ticket) return;
    setLoadingHistory(true);
    try {
      const res = await fetchApi(`/api/tickets/${ticket.id}`);
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-md flex justify-end" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden transform transition-all border-l border-white/60">
        {/* Top Header */}
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-emerald-400 font-extrabold text-lg">{ticket.ticketNumber}</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                {ticket.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {ticket.objectType} • {ticket.platform}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons Bar */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-700">Actions Rapides :</span>
          <div className="flex items-center space-x-2">
            {ticket.status === 'EN ATTENTE' && (
              <button
                onClick={() => {
                  onTakeOver(ticket.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-sm transition-colors"
              >
                🔵 Prendre en charge
              </button>
            )}

            {ticket.status !== 'TERMINÉ' && (
            <button
              onClick={() => {
                onOpenTransferModal(ticket);
                onClose();
              }}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold shadow-sm transition-colors"
            >
              🟠 Transférer
            </button>
            )}

            {ticket.status !== 'TERMINÉ' && (
              <button
                onClick={() => {
                  onOpenResolveModal(ticket);
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold shadow-sm transition-colors"
              >
                🟢 Clôturer (Terminé)
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section: Demandeur */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center space-x-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Informations Demandeur (Accès Agent Sécurisé)</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Nom / Raison Sociale :</span>
                <strong className="text-slate-900 font-semibold">{ticket.requesterName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Matricule / NINEA :</span>
                <strong className="text-slate-900 font-mono">{ticket.matriculeNinea}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Poste Occupé :</span>
                <strong className="text-slate-900">{ticket.position}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Habilitation :</span>
                <strong className="text-slate-900">{ticket.habilitation}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Téléphone :</span>
                <strong className="text-slate-900 font-mono">{ticket.phone}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Email :</span>
                <strong className="text-slate-900 font-mono text-emerald-700">{ticket.email}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Bureau :</span>
                <strong className="text-slate-900">{ticket.bureau}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Centre Fiscal :</span>
                <strong className="text-slate-900">{ticket.centreFiscal}</strong>
              </div>
            </div>
          </div>

          {/* Section: Description & Attachments */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Description de la Demande</span>
            </h4>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 leading-relaxed font-medium">
              {ticket.description || 'Aucune précision saisie par le demandeur.'}
            </div>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="pt-2 space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">Pièces Jointes :</span>
                {ticket.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-slate-100 p-2 rounded border border-slate-200 text-xs font-mono">
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>{att.name} ({att.size})</span>
                    {att.url && (
                      <a 
                        href={att.url} 
                        download={att.name}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-emerald-600 hover:text-emerald-800 text-[11px] font-bold underline"
                      >
                        Consulter
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Resolution comment if Terminé */}
          {ticket.status === 'TERMINÉ' && ticket.resolutionComment && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 space-y-1">
              <strong className="font-bold block text-emerald-800">Commentaire de Résolution :</strong>
              <p className="text-slate-800 leading-relaxed font-medium">"{ticket.resolutionComment}"</p>
            </div>
          )}

          {/* Section: Immutable History Timeline */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center space-x-2 border-b border-slate-200 pb-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Historique Inaltérable des Actions</span>
            </h4>

            {loadingHistory ? (
              <div className="text-slate-400">Chargement de l'historique...</div>
            ) : (
              <div className="space-y-3 pl-3 border-l-2 border-slate-200">
                {history.map((item) => (
                  <div key={item.id} className="relative pl-4 space-y-1">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white"></div>
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{item.action}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-normal">
                        {new Date(item.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Par: <strong className="text-slate-800">{item.createdBy}</strong>
                      {item.fromAgentName && ` (De: ${item.fromAgentName})`}
                      {item.toAgentName && ` (Vers: ${item.toAgentName})`}
                    </div>
                    {item.comment && (
                      <div className="bg-slate-100 p-2 rounded text-slate-700 italic border border-slate-200 mt-1">
                        "{item.comment}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
