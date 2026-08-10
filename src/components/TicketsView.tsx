import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Send,
  User,
  Clock,
  Eye,
  MoreVertical,
  ShieldAlert,
  Building2,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  X,
  History,
} from 'lucide-react';
import { PLATFORMS, TAX_CENTERS } from '../constants';
import { Ticket, UserAgent } from '../types';

interface TicketsViewProps {
  tickets: Ticket[];
  currentUser: UserAgent;
  onTakeOver: (ticketId: string) => void;
  onOpenTransferModal: (ticket: Ticket) => void;
  onOpenResolveModal: (ticket: Ticket) => void;
  onOpenTicketDetails: (ticket: Ticket) => void;
  allAgents: UserAgent[];
  forcedStatus?: string;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  currentUser,
  onTakeOver,
  onOpenTransferModal,
  onOpenResolveModal,
  onOpenTicketDetails,
  allAgents,
  forcedStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedCenter, setSelectedCenter] = useState('ALL');
  const [selectedAgent, setSelectedAgent] = useState('ALL');

  React.useEffect(() => {
    if (forcedStatus) {
      setSelectedStatus(forcedStatus);
    }
  }, [forcedStatus]);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.matriculeNinea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      selectedStatus === 'ALL' ? true : 
      selectedStatus === 'ACTIFS' ? t.status !== 'TERMINÉ' : 
      t.status === selectedStatus;

    const matchesPlatform = selectedPlatform === 'ALL' || t.platform === selectedPlatform;
    const matchesCenter = selectedCenter === 'ALL' || t.centreFiscal === selectedCenter;
    const matchesAgent =
      selectedAgent === 'ALL' ||
      (selectedAgent === 'UNASSIGNED' ? !t.assignedAgentId : t.assignedAgentId === selectedAgent);

    return matchesSearch && matchesStatus && matchesPlatform && matchesCenter && matchesAgent;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    const baseClass = "text-[11px] px-2.5 py-1 rounded-full font-bold inline-flex items-center space-x-1.5 truncate max-w-full align-middle";
    switch (status) {
      case 'EN ATTENTE':
        return (
          <span className={`bg-[#e6f4ea] text-[#137333] border border-[#ceead6] ${baseClass}`} title="EN ATTENTE">
            <span className="w-2 h-2 rounded-full bg-[#137333] shrink-0"></span>
            <span className="truncate">EN ATTENTE</span>
          </span>
        );
      case 'PRISE EN CHARGE':
        return (
          <span className={`bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff] ${baseClass}`} title="PRISE EN CHARGE">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8] shrink-0"></span>
            <span className="truncate">PRISE EN CHARGE</span>
          </span>
        );
      case 'TRANSFÉRÉ':
        return (
          <span className={`bg-[#fef7e0] text-[#b06000] border border-[#feefc3] ${baseClass}`} title="TRANSFÉRÉ">
            <span className="w-2 h-2 rounded-full bg-[#b06000] shrink-0"></span>
            <span className="truncate">TRANSFÉRÉ</span>
          </span>
        );
      case 'TERMINÉ':
        return (
          <span className={`bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0] ${baseClass}`} title="TERMINÉ / FERMÉ">
            <span className="w-2 h-2 rounded-full bg-[#5f6368] shrink-0"></span>
            <span className="truncate">TERMINÉ / FERMÉ</span>
          </span>
        );
      default:
        return (
          <span className={`bg-slate-100 text-slate-800 border border-slate-200 ${baseClass}`} title={status}>
            <span className="truncate">{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Gestion Intégrale des Tickets Support</h2>
          <p className="text-xs text-slate-500">
            Backoffice de prise en charge, réattribution et clôture des requêtes DGID / SENTAX
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-mono border border-slate-200">
          <span>Total tickets filtrés: <strong className="text-emerald-700">{filteredTickets.length}</strong></span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, Matricule NINEA, Téléphone, Email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIFS">⚡ ACTIFS (Non terminés)</option>
              <option value="EN ATTENTE">🟡 EN ATTENTE</option>
              <option value="PRISE EN CHARGE">🔵 PRISE EN CHARGE</option>
              <option value="TRANSFÉRÉ">🟠 TRANSFÉRÉ</option>
              <option value="TERMINÉ">🟢 TERMINÉ</option>
            </select>
          </div>

          {/* Filter Platform */}
          <div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Toutes les plateformes</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Agent */}
          <div>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Tous les agents</option>
              <option value="UNASSIGNED">Non assigné</option>
              {allAgents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.firstName} {ag.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f1f5f9] text-slate-700 font-extrabold tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">N° Ticket</th>
                <th className="px-4 py-3.5">Objet / Incident</th>
                <th className="px-4 py-3.5">Demandeur</th>
                <th className="px-4 py-3.5">Centre Fiscal</th>
                <th className="px-4 py-3.5">Statut</th>
                <th className="px-4 py-3.5">Agent Assigné</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Aucun ticket ne correspond à vos filtres.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={`${idx % 2 === 1 ? 'bg-[#f8fafc]' : 'bg-white'} hover:bg-emerald-50/40 transition-colors`}
                  >
                    <td className="px-4 py-3.5 font-mono font-extrabold text-[#008738]">
                      <div>{t.ticketNumber}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(t.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{t.objectType}</div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">
                        {t.platform}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{t.requesterName}</div>
                      <div className="text-[11px] text-slate-500">{t.position}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {t.phone} | {t.email}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700 max-w-[160px] truncate">
                      {t.centreFiscal}
                    </td>

                    <td className="px-4 py-3.5 max-w-[130px]">{getStatusBadge(t.status)}</td>

                    <td className="px-4 py-3.5">
                      {t.assignedAgentName ? (
                        <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 inline-flex items-center space-x-1">
                          <span>👤</span>
                          <span>{t.assignedAgentName}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onTakeOver(t.id)}
                          className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 transition-colors inline-flex items-center space-x-1"
                        >
                          <span>+ Attribuer</span>
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Details */}
                        <button
                          onClick={() => onOpenTicketDetails(t)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold border border-slate-200 transition-colors"
                          title="Voir dossier complet"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status Change Dropdown */}
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'PRISE_EN_CHARGE') onTakeOver(t.id);
                            else if (val === 'TRANSFERER') onOpenTransferModal(t);
                            else if (val === 'TERMINER') onOpenResolveModal(t);
                          }}
                          className="bg-[#008738] hover:bg-[#007530] text-white font-bold text-[11px] px-2 py-1.5 rounded-md cursor-pointer transition-colors focus:outline-none"
                        >
                          <option value="" disabled className="bg-slate-900 text-white">
                            Actions ▼
                          </option>
                          {t.status === 'EN ATTENTE' && (
                            <option value="PRISE_EN_CHARGE" className="bg-white text-slate-900">
                              Prise en charge
                            </option>
                          )}
                          {t.status !== 'TERMINÉ' && (
                          <option value="TRANSFERER" className="bg-white text-slate-900">
                            Transférer agent
                          </option>
                          )}
                          {t.status !== 'TERMINÉ' && (
                            <option value="TERMINER" className="bg-white text-slate-900">
                              Clôturer ticket
                            </option>
                          )}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Table Footer Pagination matching screenshot */}
        <div className="bg-[#f8fafc] border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span>Afficher de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredTickets.length)} sur {filteredTickets.length}</span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                «
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded font-bold ${
                    currentPage === i + 1
                      ? 'bg-[#008738] text-white'
                      : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
