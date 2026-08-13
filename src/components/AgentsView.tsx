import React, { useState } from 'react';
import { User, Plus, Shield, UserCheck, UserX, Mail, Phone, Briefcase, Building2, AlertCircle } from 'lucide-react';
import { HABILITATIONS } from '../constants';
import { HabilitationType, UserAgent, UserRole } from '../types';

interface AgentsViewProps {
  agents: UserAgent[];
  onAddAgent: (newAgent: Partial<UserAgent>) => Promise<{success: boolean, error?: string}>;
  onUpdateAgent: (id: string, data: Partial<UserAgent>) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ agents, onAddAgent, onUpdateAgent }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matricule, setMatricule] = useState('');
  const [role, setRole] = useState<UserRole>('AGENT');
  const [habilitation, setHabilitation] = useState<HabilitationType>('Agent d\'Assiette');
  const [poste, setPoste] = useState('Technicien Support');
  const [bureau, setBureau] = useState('Bureau DSI');
  const [direction, setDirection] = useState('Direction des Systèmes d\'Information');
  const [error, setError] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AgentsView] Starting form submission with:', { firstName, lastName, email, phone, matricule, role, habilitation });

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      const msg = 'Veuillez remplir le prénom, nom et email.';
      console.warn(`[AgentsView] Validation failed: ${msg}`);
      setError(msg);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const msg = 'Veuillez fournir une adresse email valide.';
      console.warn(`[AgentsView] Validation failed: ${msg}`);
      setError(msg);
      return;
    }

    console.log('[AgentsView] Validation passed, calling onAddAgent...');
    try {
      const res = await onAddAgent({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        matricule: matricule.trim(),
        role,
        habilitation,
        poste,
        bureau,
        direction,
        status: 'ACTIVE',
      });
      
      console.log('[AgentsView] onAddAgent response:', res);

      if (res.success) {
        console.log('[AgentsView] Agent added successfully. Resetting form.');
        setIsAdding(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMatricule('');
        setError('');
      } else {
        const errorMsg = res.error || "Une erreur s'est produite lors de la création.";
        console.error('[AgentsView] Error from server:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('[AgentsView] Unhandled exception during submission:', err);
      setError("Une erreur inattendue est survenue.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Gestion des Agents & Habilitations</h2>
          <p className="text-xs text-slate-500">
            Administration des comptes du personnel de support DSI DGID
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>NOUVEL AGENT</span>
        </button>
      </div>

      {/* Add Agent Modal */}
      {isAdding && (
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-300/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Création d'un Nouveau Compte Agent</span>
          </h3>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Nom *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Email professionnel *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@dgid.sn"
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Matricule</label>
              <input
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="DGID-XXXXXX"
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Rôle Système *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="AGENT">AGENT (Support de niveau 1 & 2)</option>
                <option value="ADMIN">ADMIN / SUPERVISEUR</option>
                <option value="SUPERADMIN">SUPERADMIN (Contrôle total)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Habilitation</label>
              <select
                value={habilitation}
                onChange={(e) => setHabilitation(e.target.value as HabilitationType)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {HABILITATIONS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Poste Occupé</label>
              <input
                type="text"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Bureau</label>
              <input
                type="text"
                value={bureau}
                onChange={(e) => setBureau(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-sm"
              >
                ENREGISTRER L'AGENT
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Agent</th>
                <th className="px-4 py-3.5">Contact / Email</th>
                <th className="px-4 py-3.5">Rôle Système</th>
                <th className="px-4 py-3.5">Habilitation / Poste</th>
                <th className="px-4 py-3.5">Tickets Assignés</th>
                <th className="px-4 py-3.5">Statut</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {agents.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">
                      {ag.firstName} {ag.lastName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{ag.matricule}</div>
                  </td>

                  <td className="px-4 py-3.5 font-mono">
                    <div className="text-emerald-800 font-medium">{ag.email}</div>
                    <div className="text-[10px] text-slate-500">{ag.phone}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        ag.role === 'SUPERADMIN'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : ag.role === 'ADMIN'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {ag.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-800">{ag.habilitation}</div>
                    <div className="text-[10px] text-slate-500">{ag.poste}</div>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-center">
                    {ag.assignedTicketsCount || 0}
                  </td>

                  <td className="px-4 py-3.5">
                    {ag.status === 'ACTIVE' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        ACTIF
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        INACTIF
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() =>
                        onUpdateAgent(ag.id, {
                          status: ag.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                        })
                      }
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                        ag.status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {ag.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
