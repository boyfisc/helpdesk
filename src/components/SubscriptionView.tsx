import { fetchApi } from "../lib/api";
import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Zap, Calendar, Users, FileText, Server } from 'lucide-react';
import { SubscriptionInfo } from '../types';

export const SubscriptionView: React.FC = () => {
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    fetchApi('/api/subscription')
      .then((res) => res.json())
      .then((data) => setSub(data))
      .catch(console.warn);
  }, []);

  if (!sub) return <div className="p-8 text-center text-xs text-slate-500">Chargement des données de souscription...</div>;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
              SaaS
            </div>
            <div>
              <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest block">
                Licence & Souscription Organisation
              </span>
              <h2 className="text-xl font-extrabold text-white">{sub.organization}</h2>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/30 font-mono">
            ● STATUT : {sub.status}
          </span>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-2 relative z-10">
          <div>Formule Actuelle : <strong className="text-white font-mono">{sub.plan}</strong></div>
          <div>Expiration Licence : <strong className="text-emerald-400 font-mono">{new Date(sub.endDate).toLocaleDateString('fr-FR')}</strong></div>
        </div>
      </div>

      {/* Quotas Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Agents Quota */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Agents d'Assistance Autorisés</span>
            </div>
            <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {sub.activeAgentsCount} / {sub.maxAgents}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${(sub.activeAgentsCount / sub.maxAgents) * 100}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-500">
            {sub.maxAgents - sub.activeAgentsCount} emplacements d'agents restants sur votre formule Entreprise.
          </p>
        </div>

        {/* Tickets Volume Quota */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <FileText className="w-5 h-5 text-sky-600" />
              <span>Volume Mensuel de Tickets</span>
            </div>
            <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {sub.monthlyTicketsCount} / {sub.maxTicketsPerMonth}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full rounded-full"
              style={{ width: `${(sub.monthlyTicketsCount / sub.maxTicketsPerMonth) * 100}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-500">
            Quota mensuel illimité inclus pour la DGID Sénégal.
          </p>
        </div>
      </div>

      {/* Activated Features */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Fonctionnalités Incluses dans la Licence
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Base de Données Relationnelle Isolée</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Génération de Tickets uniques ST-AAAA-XXXXXX</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Masquage automatique des données personnelles (RGPD)</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Notifications Email automatiques SMTP / API</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Contrôle d'accès par rôle (RBAC) & Audit Logs</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dashboard Statistique & Tableaux de Bord DSI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
