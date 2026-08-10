import React, { useState, useEffect } from 'react';
import { Shield, LogIn, LogOut, Mail, Search, Settings, Bell, Plus, FileText, AlertCircle, LayoutDashboard, CheckCircle2, UserCheck, Clock, Menu, X } from 'lucide-react';
import { UserAgent } from '../types';
import { fetchApi } from '../lib/api';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'ticket' | 'transfer' | 'resolve' | 'alert';
  ticketNumber?: string;
}

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: UserAgent | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenEmailHub: () => void;
  onOpenTrackModal: () => void;
  onQuickSelectAgent: (agent: UserAgent) => void;
  allAgents: UserAgent[];
  onSelectNotificationTicket?: (ticketNumber?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenLogin,
  onLogout,
  onOpenEmailHub,
  onOpenTrackModal,
  onQuickSelectAgent,
  allAgents,
  onSelectNotificationTicket,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      const loadPendingTickets = async () => {
        try {
          const res = await fetchApi('/api/tickets/private');
          if (res.ok) {
            const data = await res.json();
            const pending = data.filter((t: any) => t.status === 'EN ATTENTE').slice(0, 5);
            setNotifications(pending.map((t: any) => ({
              id: t.id,
              title: `Nouveau ticket #${t.ticketNumber}`,
              message: t.objectType,
              time: new Date(t.createdAt).toLocaleDateString(),
              isRead: false,
              type: 'ticket',
              ticketNumber: t.ticketNumber,
            })));
          }
        } catch (err) {
          console.error("Failed to load notifications", err);
        }
      };
      loadPendingTickets();
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ticket':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'transfer':
        return <UserCheck className="w-4 h-4 text-sky-500" />;
      case 'resolve':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'alert':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with DGID Identity */}
      <div className="bg-[#f8fafc] text-slate-600 text-[11px] px-4 sm:px-6 py-1 flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center space-x-1 sm:space-x-2 font-medium">
          <span className="font-extrabold text-emerald-700 uppercase tracking-wider text-[9px] sm:text-[11px]">RÉPUBLIQUE DU SÉNÉGAL</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-bold text-slate-800 text-[9px] sm:text-[11px]">DGID/DSI-SUPPORT</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* Left Brand Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => setCurrentView('public-home')}>
          <div className="w-auto px-2 sm:px-2.5 h-7 sm:h-9 rounded-xl bg-[#008738] flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-sm tracking-wider">
            DGID
          </div>
          <div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0f172a]">Helpdesk</span>
              <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-200">
                support
              </span>
            </div>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={() => setCurrentView('public-home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'public-home'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Accueil Portail
          </button>



          {user && (
            <button
              onClick={() => setCurrentView('backoffice')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                currentView === 'backoffice'
                  ? 'bg-[#008738] text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Espace Backoffice</span>
            </button>
          )}
        </div>

        {/* Right Header Toolbar matching screenshot (Search, Gear, Bell Badge, User Profile) */}
        <div className="flex items-center space-x-2">
          {/* Quick Action Icons matching screenshot */}
          <button
            onClick={onOpenTrackModal}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 transition-all"
            title="Recherche de tickets"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Suivi Ticket</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
              title="Centre de notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white font-bold text-[9px] px-1 py-0 rounded-full border border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Header */}
                  <div className="bg-[#f8fafc] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span className="font-extrabold text-sm text-slate-900">Notifications DSI</span>
                      {unreadCount > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            if (onSelectNotificationTicket) {
                              onSelectNotificationTicket(notif.ticketNumber);
                            } else {
                              setCurrentView('backoffice');
                            }
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-3.5 hover:bg-emerald-50/40 transition-colors cursor-pointer flex items-start space-x-3 ${
                            !notif.isRead ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">{getNotifIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`text-xs ${!notif.isRead ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                {notif.title}
                              </span>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 ml-2"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium block mt-1">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-center">
                    <button
                      onClick={() => {
                        setCurrentView('backoffice');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs font-bold text-[#008738] hover:text-emerald-800 transition-colors"
                    >
                      Voir tout dans l'Espace Backoffice →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-5 border-r border-slate-200 mx-1 hidden sm:block"></div>

          {/* User Account / Profile */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 p-1 pr-1.5 rounded-full border border-slate-200 transition-all max-w-[240px]">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden border border-slate-300 shrink-0">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-bold text-slate-900 text-[10px] leading-tight truncate max-w-[100px]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[9px] text-slate-500 leading-tight truncate max-w-[100px]">
                  {user.role}
                </span>
              </div>


              <button
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-full transition-colors ml-0.5 shrink-0"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-[#008738] hover:bg-[#007530] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors ml-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col space-y-2">
          <button
            onClick={() => {
              setCurrentView('public-home');
              setIsMobileMenuOpen(false);
            }}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold text-left transition-all ${
              currentView === 'public-home'
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Accueil Portail
          </button>
          <button
            onClick={() => {
              onOpenTrackModal();
              setIsMobileMenuOpen(false);
            }}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-200 text-left flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Suivi Ticket</span>
          </button>
          {user && (
            <button
              onClick={() => {
                setCurrentView('backoffice');
                setIsMobileMenuOpen(false);
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold text-left flex items-center space-x-2 ${
                currentView === 'backoffice'
                  ? 'bg-[#008738] text-white'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Espace Backoffice</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
