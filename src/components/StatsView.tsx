import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { Ticket } from '../types';

interface StatsViewProps {
  tickets: Ticket[];
}

export const StatsView: React.FC<StatsViewProps> = ({ tickets }) => {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [tickets]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStatsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !statsData) {
    return <div className="p-8 text-center text-xs text-slate-500">Chargement des statistiques...</div>;
  }

  const { kpis, byPlatform, byCentreFiscal, byAgent } = statsData;

  // Sorting Top 10 Platforms
  const topPlatforms = Object.entries(byPlatform)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);

  // Sorting Top 10 Tax Centers
  const topCenters = Object.entries(byCentreFiscal)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);

  // Incident vs Requête count
  const incidentsCount = tickets.filter((t) => t.objectType === 'SIGNALER UN INCIDENT TECHNIQUE').length;
  const requetesCount = tickets.filter((t) => t.objectType === 'EFFECTUER UNE REQUÊTE').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Tableau de Bord Statistique & Décisionnel</h2>
          <p className="text-xs text-slate-500">
            Analyse globale de la performance du support technique DGID / SENTAX
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Mettre à jour</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Volume Total</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{kpis.total}</div>
          <span className="text-[10px] text-slate-400 block">Tickets reçus</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Taux de Résolution</span>
          <div className="text-2xl font-black text-emerald-900 font-mono">{kpis.resolutionRate}%</div>
          <span className="text-[10px] text-emerald-700 block">Tickets clôturés</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Temps Moyen Prise en Charge</span>
          <div className="text-2xl font-black text-amber-900 font-mono">{kpis.avgTakeoverTimeMinutes} min</div>
          <span className="text-[10px] text-amber-700 block">Délai réactivité</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">Temps Moyen Résolution</span>
          <div className="text-2xl font-black text-sky-900 font-mono">{kpis.avgResolutionTimeHours} hrs</div>
          <span className="text-[10px] text-sky-700 block">Clôture moyenne</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 1: Incidents vs Requêtes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Incidents Techniques vs Requêtes</span>
          </h3>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-rose-900">
                <span>🔴 Incidents Techniques</span>
                <span className="font-mono">{incidentsCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${(incidentsCount / (kpis.total || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-sky-900">
                <span>🔵 Requêtes / Demandes</span>
                <span className="font-mono">{requetesCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${(requetesCount / (kpis.total || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Top 10 Platforms */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Top 10 Plateformes Générant le Plus de Tickets</span>
          </h3>

          <div className="space-y-2.5">
            {topPlatforms.map(([plat, count]: [string, any]) => {
              const numCount = Number(count);
              const maxVal = Number(topPlatforms[0]?.[1] || 1);
              const pct = Math.round((numCount / (maxVal || 1)) * 100);
              return (
                <div key={plat} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span className="truncate">{plat}</span>
                    <span className="font-mono font-bold text-slate-900">{numCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Top 10 Tax Centers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Top 10 Centres Fiscaux Sollicitant le Support</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topCenters.map(([cnt, count]: [string, any]) => {
              const numCount = Number(count);
              const maxVal = Number(topCenters[0]?.[1] || 1);
              const pct = Math.round((numCount / (maxVal || 1)) * 100);
              return (
                <div key={cnt} className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span className="truncate">{cnt}</span>
                    <span className="font-mono text-emerald-700">{numCount} ticket(s)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full"
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
