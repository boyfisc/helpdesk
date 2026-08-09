import React from 'react';
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  User,
  ShieldCheck,
  AlertCircle,
  Building2,
  BarChart3,
  Send,
} from 'lucide-react';
import { Ticket, UserAgent } from '../types';

interface DashboardViewProps {
  user: UserAgent;
  tickets: Ticket[];
  onTakeOver: (ticketId: string) => void;
  onOpenTicketDetails: (ticket: Ticket) => void;
  onOpenTransferModal: (ticket: Ticket) => void;
  onOpenResolveModal: (ticket: Ticket) => void;
  onNavigateToFilter?: (filter: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tickets,
  onTakeOver,
  onOpenTicketDetails,
  onOpenTransferModal,
  onOpenResolveModal,
  onNavigateToFilter,
}) => {
  const total = tickets.length;
  const enAttente = tickets.filter((t) => t.status === 'EN ATTENTE');
  const enPriseEnCharge = tickets.filter((t) => t.status === 'PRISE EN CHARGE');
  const transferes = tickets.filter((t) => t.status === 'TRANSFÉRÉ');
  const termines = tickets.filter((t) => t.status === 'TERMINÉ');

  // My Tickets
  const myTickets = tickets.filter((t) => t.assignedAgentId === user.id && t.status !== 'TERMINÉ');

  // Platform breakdown counts
  const platformCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    platformCounts[t.platform] = (platformCounts[t.platform] || 0) + 1;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Agent Greeting Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-black text-white">
              Bonjour {user.firstName} {user.lastName} 👋
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded font-mono border border-emerald-500/30 font-bold">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {user.poste} • {user.direction} ({user.bureau})
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-inner">
          <button 
            onClick={() => onNavigateToFilter?.('ACTIFS')}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mes Tickets Actifs</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{myTickets.length}</span>
          </button>
          <div className="h-8 border-r border-slate-800"></div>
          <button
            onClick={() => onNavigateToFilter?.('EN ATTENTE')}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Queue Globale</span>
            <span className="text-lg font-black text-amber-400 font-mono">{enAttente.length}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <button 
          onClick={() => onNavigateToFilter?.('ALL')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:shadow-md transition-shadow text-left"
        >
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Tickets</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">{total}</span>
            <TicketIcon className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-500 block">Enregistrés ce mois</span>
        </button>

        {/* En Attente */}
        <button
          onClick={() => onNavigateToFilter?.('EN ATTENTE')}
          className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2 hover:shadow-md transition-shadow text-left"
        >
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">🟡 En Attente</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-900 font-mono">{enAttente.length}</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] text-amber-700 block">À traiter d'urgence</span>
        </button>

        {/* Prise en Charge */}
        <button
          onClick={() => onNavigateToFilter?.('PRISE EN CHARGE')}
          className="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-2 hover:shadow-md transition-shadow text-left"
        >
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">🔵 En Cours</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-sky-900 font-mono">{enPriseEnCharge.length}</span>
            <TrendingUp className="w-5 h-5 text-sky-600" />
          </div>
          <span className="text-[11px] text-sky-700 block">Sous traitement agent</span>
        </button>

        {/* Transférés */}
        <button
          onClick={() => onNavigateToFilter?.('TRANSFÉRÉ')}
          className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm space-y-2 hover:shadow-md transition-shadow text-left"
        >
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">🟠 Transférés</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-900 font-mono">{transferes.length}</span>
            <Send className="w-5 h-5 text-orange-600" />
          </div>
          <span className="text-[11px] text-orange-700 block">Ré-attribués</span>
        </button>

        {/* Terminés */}
        <button
          onClick={() => onNavigateToFilter?.('TERMINÉ')}
          className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2 hover:shadow-md transition-shadow text-left"
        >
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">🟢 Terminés</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-900 font-mono">{termines.length}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] text-emerald-700 block">Tickets clôturés</span>
        </button>
      </div>

      {/* Main Grid: Priority Queue & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>File Prioritaire — Tickets en Attente ({enAttente.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Tickets récemment créés nécessitant une prise en charge immédiate</p>
            </div>
          </div>

          {enAttente.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              🎉 Aucun ticket en attente dans la file d'attente globale !
            </div>
          ) : (
            <div className="space-y-3">
              {enAttente.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {t.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{t.objectType}</span>
                      <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {t.platform}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      Demandeur : <strong>{t.requesterName}</strong> ({t.position}) — {t.centreFiscal}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {t.description || 'Aucune précision fournie.'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onOpenTicketDetails(t)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => onTakeOver(t.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center space-x-1"
                    >
                      <span>PRENDRE EN CHARGE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Breakdown Side Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Tickets par Plateforme</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(platformCounts).map(([plat, count]) => {
              const pct = Math.round((count / total) * 100) || 0;
              return (
                <div key={plat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="truncate">{plat}</span>
                    <span className="font-mono font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
