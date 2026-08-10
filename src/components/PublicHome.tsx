import React, { useState } from 'react';
import { AlertCircle, FileText, Search, Filter, ShieldCheck, Clock, CheckCircle2, RefreshCw, Plus, User } from 'lucide-react';
import { PLATFORMS, TAX_CENTERS } from '../constants';
import { PublicTicket, TicketObjectType, UserAgent } from '../types';

interface PublicHomeProps {
  publicTickets: PublicTicket[];
  onOpenCreateTicket: (type: TicketObjectType) => void;
  onOpenTrackTicket: (ticketNum?: string) => void;
  onRefreshPublicTickets: () => void;
  loading: boolean;
  user?: UserAgent | null;
  onOpenTicketDetail?: (ticketNum?: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  publicTickets,
  onOpenCreateTicket,
  onOpenTrackTicket,
  onRefreshPublicTickets,
  loading,
  user,
  onOpenTicketDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedCenter, setSelectedCenter] = useState('ALL');

  // Filter public tickets
  const filteredTickets = publicTickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.centreFiscal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || ticket.status === selectedStatus;
    const matchesPlatform = selectedPlatform === 'ALL' || ticket.platform === selectedPlatform;
    const matchesCenter = selectedCenter === 'ALL' || ticket.centreFiscal === selectedCenter;

    return matchesSearch && matchesStatus && matchesPlatform && matchesCenter;
  });

  const getStatusBadge = (status: string) => {
    const baseClass = "text-[11px] px-2.5 py-0.5 rounded-full font-bold truncate max-w-full inline-block align-middle";
    switch (status) {
      case 'EN ATTENTE':
        return (
          <span className={`bg-amber-100 text-amber-800 border border-amber-300 ${baseClass}`} title="En attente">
            🟡 En attente
          </span>
        );
      case 'PRISE EN CHARGE':
        return (
          <span className={`bg-sky-100 text-sky-800 border border-sky-300 ${baseClass}`} title="Prise en charge">
            🔵 Prise en charge
          </span>
        );
      case 'TRANSFÉRÉ':
        return (
          <span className={`bg-orange-100 text-orange-800 border border-orange-300 ${baseClass}`} title="Transféré">
            🟠 Transféré
          </span>
        );
      case 'TERMINÉ':
        return (
          <span className={`bg-emerald-100 text-emerald-800 border border-emerald-300 ${baseClass}`} title="Terminé">
            🟢 Terminé
          </span>
        );
      default:
        return <span className={`bg-slate-100 text-slate-800 border border-slate-200 ${baseClass}`} title={status}>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* SECTION — Tableau Public des Tickets */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
        {/* Table Header & Privacy Banner */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tableau Public des Tickets Récents</h2>
              <p className="text-xs text-slate-500">
                Suivi transparent du flux d'activité du support technique DGID / SENTAX
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onOpenCreateTicket('SIGNALER UN INCIDENT TECHNIQUE')}
                className="bg-[#008738] hover:bg-[#007530] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau ticket</span>
              </button>
              <button
                onClick={onRefreshPublicTickets}
                className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 text-xs font-semibold flex items-center space-x-1 transition-colors"
                title="Actualiser la liste"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* Strict Security Rule Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold text-emerald-900">Règle de Confidentialité :</strong> Les noms, prénoms, numéros de téléphone, emails et matricules des demandeurs sont <strong>strictement masqués</strong> sur l'espace public.
            </div>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher ticket ou mot-clé..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Filter Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="EN ATTENTE">🟡 En attente</option>
                <option value="PRISE EN CHARGE">🔵 Prise en charge</option>
                <option value="TRANSFÉRÉ">🟠 Transféré</option>
                <option value="TERMINÉ">🟢 Terminé</option>
              </select>
            </div>

            {/* Filter Platform */}
            <div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">Toutes les plateformes</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tax Center */}
            <div>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">Tous les centres fiscaux</option>
                {TAX_CENTERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Public Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">N° Ticket</th>
                <th className="px-4 py-3">Objet</th>
                <th className="px-4 py-3">Plateforme</th>
                <th className="px-4 py-3">Centre Fiscal</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Agent assigné</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Aucun ticket trouvé selon les critères choisis.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800">
                      {t.ticketNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {t.objectType}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 border border-slate-200">
                        {t.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">
                      {t.centreFiscal}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                      {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 max-w-[120px]">{getStatusBadge(t.status)}</td>
                    <td className="px-4 py-3">
                      {t.assignedAgentName ? (
                        <div className="flex items-center space-x-1 text-slate-700">
                          <User className="w-3 h-3 text-emerald-600" />
                          <span className="truncate max-w-[120px]">{t.assignedAgentName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Non assigné</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Affichage de {filteredTickets.length} ticket(s) public(s)</span>
          <span className="text-[11px]">Mise à jour en temps réel</span>
        </div>
      </section>
    </div>
  );
};
