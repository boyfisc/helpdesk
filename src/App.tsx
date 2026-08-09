import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { CreateTicketModal } from './components/CreateTicketModal';
import { TrackTicketModal } from './components/TrackTicketModal';
import { EmailHubModal } from './components/EmailHubModal';
import { LoginModal } from './components/LoginModal';
import { BackofficeLayout } from './components/BackofficeLayout';
import { DashboardView } from './components/DashboardView';
import { TicketsView } from './components/TicketsView';
import { AgentsView } from './components/AgentsView';
import { StatsView } from './components/StatsView';
import { SubscriptionView } from './components/SubscriptionView';
import { AuditLogView } from './components/AuditLogView';
import { TicketDetailDrawer } from './components/TicketDetailDrawer';
import { TransferModal } from './components/TransferModal';
import { ResolveModal } from './components/ResolveModal';
import { PublicTicket, Ticket, TicketObjectType, UserAgent } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'public-home' | 'backoffice'>('public-home');
  const [backofficeTab, setBackofficeTab] = useState<string>('dashboard');
  const [backofficeStatusFilter, setBackofficeStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [createTicketType, setCreateTicketType] = useState<TicketObjectType>('SIGNALER UN INCIDENT TECHNIQUE');

  const [isTrackTicketOpen, setIsTrackTicketOpen] = useState(false);
  const [trackNumber, setTrackNumber] = useState('');

  const [isEmailHubOpen, setIsEmailHubOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [selectedTicketForDrawer, setSelectedTicketForDrawer] = useState<Ticket | null>(null);
  const [selectedTicketForTransfer, setSelectedTicketForTransfer] = useState<Ticket | null>(null);
  const [selectedTicketForResolve, setSelectedTicketForResolve] = useState<Ticket | null>(null);

  // Data State
  const [publicTickets, setPublicTickets] = useState<PublicTicket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [allAgents, setAllAgents] = useState<UserAgent[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAgent | null>(null);
  const [loading, setLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    fetchPublicTickets();
    fetchAllAgents();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchPrivateTickets();
    }
  }, [currentUser]);

  const fetchPublicTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets/public');
      const data = await res.json();
      setPublicTickets(data);
    } catch (e) {
      console.error('Error fetching public tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivateTickets = async () => {
    try {
      const res = await fetch('/api/tickets/private');
      const data = await res.json();
      setAllTickets(data);
    } catch (e) {
      console.error('Error fetching private tickets:', e);
    }
  };

  const fetchAllAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAllAgents(data);
      if (data.length > 0 && !currentUser) {
        // Default connected agent for quick demo
        setCurrentUser(data[0]);
        setCurrentView('backoffice');
      }
    } catch (e) {
      console.error('Error fetching agents:', e);
    }
  };

  // Actions
  const handleOpenCreateTicket = (type: TicketObjectType) => {
    setCreateTicketType(type);
    setIsCreateTicketOpen(true);
  };

  const handleTicketCreated = (createdTicketNum: string) => {
    fetchPublicTickets();
    if (currentUser) {
      fetchPrivateTickets();
    }
  };

  const handleOpenTrackModal = (num?: string) => {
    if (num) setTrackNumber(num);
    setIsTrackTicketOpen(true);
  };

  const handleTakeOver = async (ticketId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PRISE_EN_CHARGE',
          agentId: currentUser.id,
          agentName: `${currentUser.firstName} ${currentUser.lastName}`,
        }),
      });

      if (res.ok) {
        fetchPublicTickets();
        fetchPrivateTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmTransfer = async (ticketId: string, targetAgent: UserAgent, reason: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TRANSFERER',
          agentName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Superviseur',
          targetAgentId: targetAgent.id,
          targetAgentName: `${targetAgent.firstName} ${targetAgent.lastName}`,
          transferReason: reason,
        }),
      });

      if (res.ok) {
        fetchPublicTickets();
        fetchPrivateTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmResolve = async (ticketId: string, resolutionComment: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TERMINER',
          agentName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Agent Support',
          resolutionComment,
        }),
      });

      if (res.ok) {
        fetchPublicTickets();
        fetchPrivateTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAgent = async (newAgentData: Partial<UserAgent>) => {
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgentData),
      });

      if (res.ok) {
        fetchAllAgents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateAgent = async (id: string, data: Partial<UserAgent>) => {
    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchAllAgents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectNotificationTicket = (ticketNumber?: string) => {
    if (!currentUser && allAgents.length > 0) {
      setCurrentUser(allAgents[0]);
    }
    setCurrentView('backoffice');
    setBackofficeTab('tickets');

    if (ticketNumber) {
      const match = allTickets.find((t) => t.ticketNumber === ticketNumber);
      if (match) {
        setSelectedTicketForDrawer(match);
      } else {
        fetchPrivateTickets().then(() => {
          const freshMatch = allTickets.find((t) => t.ticketNumber === ticketNumber);
          if (freshMatch) {
            setSelectedTicketForDrawer(freshMatch);
          } else if (allTickets.length > 0) {
            setSelectedTicketForDrawer(allTickets[0]);
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#e5ebe3] flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-600 selection:text-white relative p-2 sm:p-4 lg:p-6">
      {/* Outer Application Card Shell matching the desktop helpdesk screenshot */}
      <div className="max-w-[1600px] w-full mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col min-h-[calc(100vh-2rem)]">
        {/* Top Main Navbar */}
        <Navbar
          currentView={currentView}
          setCurrentView={(v) => {
            if (v === 'create-incident') {
              handleOpenCreateTicket('SIGNALER UN INCIDENT TECHNIQUE');
            } else if (v === 'create-request') {
              handleOpenCreateTicket('EFFECTUER UNE REQUÊTE');
            } else {
              setCurrentView(v as any);
            }
          }}
          user={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentView('public-home');
          }}
          onOpenEmailHub={() => setIsEmailHubOpen(true)}
          onOpenTrackModal={() => handleOpenTrackModal()}
          onQuickSelectAgent={(ag) => setCurrentUser(ag)}
          allAgents={allAgents}
          onSelectNotificationTicket={handleSelectNotificationTicket}
        />

        {/* Main Container */}
        {currentView === 'public-home' ? (
          <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-[#f8fafc]">
            <PublicHome
              publicTickets={publicTickets}
              onOpenCreateTicket={handleOpenCreateTicket}
              onOpenTrackTicket={handleOpenTrackModal}
              onRefreshPublicTickets={fetchPublicTickets}
              loading={loading}
              user={currentUser}
              onOpenTicketDetail={handleSelectNotificationTicket}
            />
          </main>
        ) : (
          currentUser && (
            <BackofficeLayout
              currentTab={backofficeTab}
              setCurrentTab={setBackofficeTab}
              user={currentUser}
              onOpenEmailHub={() => setIsEmailHubOpen(true)}
              onOpenCreateTicket={handleOpenCreateTicket}
              statusFilter={backofficeStatusFilter}
              setStatusFilter={setBackofficeStatusFilter}
            >
              {backofficeTab === 'dashboard' && (
                <DashboardView
                  user={currentUser}
                  tickets={allTickets}
                  onTakeOver={handleTakeOver}
                  onOpenTicketDetails={(t) => setSelectedTicketForDrawer(t)}
                  onOpenTransferModal={(t) => setSelectedTicketForTransfer(t)}
                  onOpenResolveModal={(t) => setSelectedTicketForResolve(t)}
                  onNavigateToFilter={(filter) => {
                    setBackofficeStatusFilter(filter);
                    setBackofficeTab('tickets');
                  }}
                />
              )}

              {backofficeTab === 'tickets' && (
                <TicketsView
                  tickets={allTickets}
                  currentUser={currentUser}
                  onTakeOver={handleTakeOver}
                  onOpenTransferModal={(t) => setSelectedTicketForTransfer(t)}
                  onOpenResolveModal={(t) => setSelectedTicketForResolve(t)}
                  onOpenTicketDetails={(t) => setSelectedTicketForDrawer(t)}
                  allAgents={allAgents}
                  forcedStatus={backofficeStatusFilter}
                />
              )}

              {backofficeTab === 'my-tickets' && (
                <TicketsView
                  tickets={allTickets.filter((t) => t.assignedAgentId === currentUser.id)}
                  currentUser={currentUser}
                  onTakeOver={handleTakeOver}
                  onOpenTransferModal={(t) => setSelectedTicketForTransfer(t)}
                  onOpenResolveModal={(t) => setSelectedTicketForResolve(t)}
                  onOpenTicketDetails={(t) => setSelectedTicketForDrawer(t)}
                  allAgents={allAgents}
                  forcedStatus={backofficeStatusFilter}
                />
              )}

              {backofficeTab === 'agents' && (
                <AgentsView
                  agents={allAgents}
                  onAddAgent={handleAddAgent}
                  onUpdateAgent={handleUpdateAgent}
                />
              )}

              {backofficeTab === 'stats' && <StatsView tickets={allTickets} />}

              {backofficeTab === 'subscription' && <SubscriptionView />}

              {backofficeTab === 'audit' && <AuditLogView />}
            </BackofficeLayout>
          )
        )}

        {/* Footer */}
        <Footer
          onOpenEmailHub={() => setIsEmailHubOpen(true)}
          onOpenTrackModal={() => handleOpenTrackModal()}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      </div>

      {/* MODALS & DRAWERS */}
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        initialObjectType={createTicketType}
        onClose={() => setIsCreateTicketOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      <TrackTicketModal
        isOpen={isTrackTicketOpen}
        initialSearchNumber={trackNumber}
        onClose={() => setIsTrackTicketOpen(false)}
      />

      <EmailHubModal isOpen={isEmailHubOpen} onClose={() => setIsEmailHubOpen(false)} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(ag) => {
          setCurrentUser(ag);
          setCurrentView('backoffice');
        }}
        allAgents={allAgents}
      />

      <TicketDetailDrawer
        ticket={selectedTicketForDrawer}
        onClose={() => setSelectedTicketForDrawer(null)}
        onTakeOver={handleTakeOver}
        onOpenTransferModal={(t) => setSelectedTicketForTransfer(t)}
        onOpenResolveModal={(t) => setSelectedTicketForResolve(t)}
      />

      <TransferModal
        isOpen={!!selectedTicketForTransfer}
        ticket={selectedTicketForTransfer}
        allAgents={allAgents}
        currentUser={currentUser || allAgents[0]}
        onClose={() => setSelectedTicketForTransfer(null)}
        onConfirmTransfer={handleConfirmTransfer}
      />

      <ResolveModal
        isOpen={!!selectedTicketForResolve}
        ticket={selectedTicketForResolve}
        onClose={() => setSelectedTicketForResolve(null)}
        onConfirmResolve={handleConfirmResolve}
      />
    </div>
  );
}
