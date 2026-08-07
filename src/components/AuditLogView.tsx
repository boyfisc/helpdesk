import React, { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw, Clock, User } from 'lucide-react';
import { SystemAuditLog } from '../types';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Journal d'Audit Sécurité</h2>
          <p className="text-xs text-slate-500">
            Traçabilité inaltérable des connexions et opérations sensibles effectuées sur le SaaS
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Horodatage</th>
                <th className="px-4 py-3.5">Utilisateur / Rôle</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Détails Opération</th>
                <th className="px-4 py-3.5 font-mono">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Aucun événement enregistré.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{log.userEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold font-mono text-emerald-800">
                      {log.action}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{log.details}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                      {log.ipAddress || '10.20.4.15'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
