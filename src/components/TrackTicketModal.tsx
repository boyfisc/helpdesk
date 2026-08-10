import { fetchApi } from "../lib/api";
import React, { useState } from 'react';
import { X, Search, AlertCircle, CheckCircle2, Clock, ArrowRight, ShieldCheck, FileText, CornerDownRight } from 'lucide-react';

interface TrackTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchNumber?: string;
}

export const TrackTicketModal: React.FC<TrackTicketModalProps> = ({
  isOpen,
  onClose,
  initialSearchNumber = '',
}) => {
  const [searchNumber, setSearchNumber] = useState(initialSearchNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketData, setTicketData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;

    setLoading(true);
    setError('');
    setTicketData(null);

    try {
      const response = await fetchApi(`/api/tickets/track/${encodeURIComponent(searchNumber.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ticket non trouvé.');
      }

      setTicketData(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur s\'est produite.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EN ATTENTE':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">🟡 EN ATTENTE</span>;
      case 'PRISE EN CHARGE':
        return <span className="bg-sky-100 text-sky-800 border border-sky-300 text-xs px-2.5 py-1 rounded-full font-bold">🔵 PRISE EN CHARGE</span>;
      case 'TRANSFÉRÉ':
        return <span className="bg-orange-100 text-orange-800 border border-orange-300 text-xs px-2.5 py-1 rounded-full font-bold">🟠 TRANSFÉRÉ</span>;
      case 'TERMINÉ':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">🟢 TERMINÉ</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 w-full max-w-xl overflow-hidden my-6 transform transition-all">
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Suivi Public d'un Ticket SENTAX</h2>
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
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Numéro de Ticket (ex: ST-2026-000125)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                placeholder="Saisissez votre numéro ST-2026-XXXXXX"
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Recherche...' : 'Rechercher'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Ticket Results */}
          {ticketData && (
            <div className="space-y-6 pt-2 border-t border-slate-100">
              {/* Header Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                    {ticketData.ticketNumber}
                  </span>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {ticketData.objectType} — <span className="font-semibold">{ticketData.platform}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Centre fiscal : {ticketData.centreFiscal}
                  </p>
                </div>
                <div>{getStatusBadge(ticketData.status)}</div>
              </div>

              {/* Step Timeline Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Avancement et Historique du Traitement</span>
                </h4>

                <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                  {ticketData.history && ticketData.history.length > 0 ? (
                    ticketData.history.map((step: any, idx: number) => (
                      <div key={idx} className="relative pl-4">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                        <div className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                          <span>{step.action}</span>
                          {step.newStatus && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({step.newStatus})
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {new Date(step.createdAt).toLocaleString('fr-FR')}
                        </span>
                        {step.comment && (
                          <div className="mt-1 bg-emerald-50 text-emerald-900 text-xs p-2.5 rounded-lg border border-emerald-200 font-medium">
                            <strong>Note :</strong> {step.comment}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">Aucun historique disponible.</div>
                  )}
                </div>
              </div>

              {/* Resolution Banner if Terminé */}
              {ticketData.status === 'TERMINÉ' && ticketData.resolutionComment && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 text-xs space-y-1">
                  <strong className="font-bold flex items-center space-x-1 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Commentaire de résolution :</span>
                  </strong>
                  <p className="text-slate-700 leading-relaxed pl-5">
                    "{ticketData.resolutionComment}"
                  </p>
                </div>
              )}

              {/* Sensitive Info Privacy notice */}
              <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-500 border border-slate-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Les identités nominatives sont masquées dans ce mode public pour des raisons de confidentialité administrative.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
