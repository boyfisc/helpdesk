import React from 'react';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  UserCheck,
  Users,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Mail,
  Filter,
  Plus,
  Layers,
  Grid,
  CheckSquare,
  ShieldAlert,
} from 'lucide-react';
import { UserAgent } from '../types';

interface BackofficeLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserAgent;
  onOpenEmailHub: () => void;
  onOpenCreateTicket?: (type: any) => void;
  children: React.ReactNode;
}

export const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenEmailHub,
  onOpenCreateTicket,
  children,
}) => {
  const isSuperadmin = user.role === 'SUPERADMIN';
  const isAdminOrSuper = user.role === 'ADMIN' || user.role === 'SUPERADMIN';

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#f8fafc] relative">
      {/* Left Vibrant Green Sidebar matching screenshot */}
      <aside className="w-full md:w-16 lg:w-16 bg-[#008738] text-white shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-start py-4 px-2 space-y-0 md:space-y-6 shadow-md z-30">
        {/* Top App Icon */}
        <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-400/30 flex items-center justify-center text-white font-black text-xl shadow-inner">
          <div className="w-4 h-4 bg-yellow-400 rounded-xs transform rotate-45 flex items-center justify-center">
            <span className="text-[9px] text-emerald-950 font-black">N</span>
          </div>
        </div>

        {/* Sidebar Nav Icons matching screenshot */}
        <nav className="flex flex-row md:flex-col items-center space-x-2 md:space-x-0 md:space-y-3 w-full">
          {/* Dashboard / Accueil */}
          <div className="relative w-full flex justify-center group">
            {currentTab === 'dashboard' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-yellow-400 rounded-r-md hidden md:block"></div>
            )}
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`p-3 rounded-xl transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-900/80 text-white shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
              title="Tableau de bord"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          </div>

          {/* Tous les Tickets */}
          <div className="relative w-full flex justify-center group">
            {currentTab === 'tickets' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-yellow-400 rounded-r-md hidden md:block"></div>
            )}
            <button
              onClick={() => setCurrentTab('tickets')}
              className={`p-3 rounded-xl transition-all ${
                currentTab === 'tickets'
                  ? 'bg-emerald-900/80 text-white shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
              title="Tous les tickets"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>

          {/* Mes Tickets */}
          <div className="relative w-full flex justify-center group">
            {currentTab === 'my-tickets' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-yellow-400 rounded-r-md hidden md:block"></div>
            )}
            <button
              onClick={() => setCurrentTab('my-tickets')}
              className={`p-3 rounded-xl transition-all ${
                currentTab === 'my-tickets'
                  ? 'bg-emerald-900/80 text-white shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
              title="Mes tickets assignés"
            >
              <UserCheck className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="relative w-full flex justify-center group">
            {currentTab === 'stats' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-yellow-400 rounded-r-md hidden md:block"></div>
            )}
            <button
              onClick={() => setCurrentTab('stats')}
              className={`p-3 rounded-xl transition-all ${
                currentTab === 'stats'
                  ? 'bg-emerald-900/80 text-white shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
              title="Statistiques DSI"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>

          {/* Admin / Agents */}
          {isAdminOrSuper && (
            <div className="relative w-full flex justify-center group">
              {(currentTab === 'agents' || currentTab === 'subscription' || currentTab === 'audit') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-yellow-400 rounded-r-md hidden md:block"></div>
              )}
              <button
                onClick={() => setCurrentTab('agents')}
                className={`p-3 rounded-xl transition-all ${
                  currentTab === 'agents' || currentTab === 'subscription' || currentTab === 'audit'
                    ? 'bg-emerald-900/80 text-white shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                }`}
                title="Gestion des agents et paramètres"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Container with Top Tab Toolbar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Status Tabs Bar matching screenshot */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs with count badges */}
          <div className="flex items-center space-x-2 sm:space-x-6 text-xs overflow-x-auto">
            <button
              onClick={() => setCurrentTab('tickets')}
              className={`pb-1 font-bold flex items-center space-x-2 transition-all border-b-2 ${
                currentTab === 'tickets' || currentTab === 'dashboard'
                  ? 'border-[#008738] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Toutes les demandes</span>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                44
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('tickets')}
              className="pb-1 font-semibold flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all border-b-2 border-transparent"
            >
              <span>Actifs</span>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                22
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('tickets')}
              className="pb-1 font-semibold flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all border-b-2 border-transparent"
            >
              <span>Urgents</span>
              <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                8
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('tickets')}
              className="pb-1 font-semibold flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all border-b-2 border-transparent"
            >
              <span>Fermés</span>
              <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                14
              </span>
            </button>
          </div>

          {/* Right Toolbar Options matching screenshot */}
          <div className="flex items-center space-x-3">
            {/* Uniquement mes tickets filter checkbox */}
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentTab === 'my-tickets'}
                onChange={(e) => setCurrentTab(e.target.checked ? 'my-tickets' : 'tickets')}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Uniquement mes tickets</span>
            </label>

            {/* Filter button */}
            <button
              onClick={() => setCurrentTab('tickets')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filtres</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                0
              </span>
            </button>

            {/* Primary Action Button: + Nouveau ticket */}
            <button
              onClick={() => onOpenCreateTicket && onOpenCreateTicket('SIGNALER UN INCIDENT TECHNIQUE')}
              className="bg-[#00a83e] hover:bg-[#009135] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau ticket</span>
            </button>
          </div>
        </div>

        {/* Backoffice Page Sub-Navigation (if admin/super) */}
        {isAdminOrSuper && (
          <div className="bg-slate-100/80 border-b border-slate-200 px-6 py-2 flex items-center space-x-4 text-xs font-medium text-slate-600">
            <span className="font-bold text-slate-800">Sections DSI:</span>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-emerald-700 ${currentTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setCurrentTab('tickets')}
              className={`hover:text-emerald-700 ${currentTab === 'tickets' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Tous les tickets
            </button>
            <button
              onClick={() => setCurrentTab('agents')}
              className={`hover:text-emerald-700 ${currentTab === 'agents' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Gestion Agents
            </button>
            <button
              onClick={() => setCurrentTab('stats')}
              className={`hover:text-emerald-700 ${currentTab === 'stats' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Statistiques DSI
            </button>
            {isSuperadmin && (
              <>
                <button
                  onClick={() => setCurrentTab('subscription')}
                  className={`hover:text-emerald-700 ${currentTab === 'subscription' ? 'text-emerald-700 font-bold' : ''}`}
                >
                  Souscription
                </button>
                <button
                  onClick={() => setCurrentTab('audit')}
                  className={`hover:text-emerald-700 ${currentTab === 'audit' ? 'text-emerald-700 font-bold' : ''}`}
                >
                  Audit Sécurité
                </button>
              </>
            )}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#f8fafc] overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
