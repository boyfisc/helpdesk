import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_AGENTS, OFFICIAL_SUPPORT_EMAIL, TAX_CENTERS } from './src/constants';
import {
  EmailNotification,
  PublicTicket,
  SubscriptionInfo,
  SystemAuditLog,
  Ticket,
  TicketHistoryItem,
  UserAgent,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Database for state management
let agents: UserAgent[] = [...INITIAL_AGENTS];

let ticketCounter = 128; // Start counter at 128

function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(ticketCounter++).padStart(6, '0');
  return `ST-${year}-${seq}`;
}

// Initial seed tickets
let tickets: Ticket[] = [
  {
    id: 't-101',
    ticketNumber: 'ST-2026-000121',
    objectType: 'SIGNALER UN INCIDENT TECHNIQUE',
    platform: 'SENTAX BACK OFFICE',
    matriculeNinea: 'NINEA-10982348',
    requesterName: 'Mamadou Diallo',
    position: 'Chef de Section Assiette',
    phone: '+221 77 123 99 88',
    email: 'm.diallo@dgid.sn',
    habilitation: 'Chef de Section / UGF',
    bureau: 'Bureau des Impôts indirects',
    centreFiscal: 'DAKAR-PLATEAU',
    description: 'Impossibilité de valider la quittance de paiement pour la déclaration du trimestre T2.',
    status: 'EN ATTENTE',
    createdAt: '2026-08-07T08:15:00Z',
  },
  {
    id: 't-102',
    ticketNumber: 'ST-2026-000122',
    objectType: 'EFFECTUER UNE REQUÊTE',
    platform: 'E-SERVICES',
    matriculeNinea: 'NINEA-88771234',
    requesterName: 'Société SENEGAL AGRI SA',
    position: 'Comptable Agréé',
    phone: '+221 33 821 00 11',
    email: 'contact@senegal-agri.sn',
    habilitation: 'Comptable',
    bureau: 'Bureau Recouvrement',
    centreFiscal: 'CENTRE DES MOYENNES ENTREPRISES DAKAR 1',
    description: 'Demande de réinitialisation du mot de passe de l\'espace télé-déclaration.',
    status: 'PRISE EN CHARGE',
    assignedAgentId: 'agent-002',
    assignedAgentName: 'Fatou Fall',
    takenAt: '2026-08-07T09:00:00Z',
    createdAt: '2026-08-07T08:30:00Z',
  },
  {
    id: 't-103',
    ticketNumber: 'ST-2026-000123',
    objectType: 'SIGNALER UN INCIDENT TECHNIQUE',
    platform: 'SEN-ETAFI',
    matriculeNinea: 'NINEA-55443322',
    requesterName: 'Aissatou Sene',
    position: 'Agent d\'Assiette',
    phone: '+221 78 444 33 22',
    email: 'aissatou.sene@dgid.sn',
    habilitation: 'Agent d\'Assiette',
    bureau: 'Bureau BCF',
    centreFiscal: 'THIES',
    description: 'Erreur 500 survenue lors de l\'importation de la liasse fiscale au format XML.',
    status: 'TRANSFÉRÉ',
    assignedAgentId: 'agent-003',
    assignedAgentName: 'Ousmane Ndiaye',
    takenAt: '2026-08-07T09:15:00Z',
    transferredAt: '2026-08-07T09:45:00Z',
    createdAt: '2026-08-07T08:45:00Z',
  },
  {
    id: 't-104',
    ticketNumber: 'ST-2026-000124',
    objectType: 'EFFECTUER UNE REQUÊTE',
    platform: 'SENTAX EBANQUE',
    matriculeNinea: 'NINEA-99001122',
    requesterName: 'Banque CBAO SENEGAL',
    position: 'Chef de Bureau Téléprocédures',
    phone: '+221 33 839 00 00',
    email: 'support.monetique@cbao.sn',
    habilitation: 'Chef de Bureau',
    bureau: 'Bureau E-Banque',
    centreFiscal: 'DIRECTION DES GRANDES ENTREPRISES',
    description: 'Demande d\'ajout des nouveaux certificats SSL pour la connexion directe webservices.',
    status: 'TERMINÉ',
    assignedAgentId: 'agent-001',
    assignedAgentName: 'Amadou Diagne',
    takenAt: '2026-08-07T07:30:00Z',
    completedAt: '2026-08-07T09:30:00Z',
    resolutionComment: 'Mise à jour des certificats SSL effectuée avec succès sur le gateway E-Banque. Test OK.',
    createdAt: '2026-08-07T07:00:00Z',
  },
  {
    id: 't-105',
    ticketNumber: 'ST-2026-000125',
    objectType: 'SIGNALER UN INCIDENT TECHNIQUE',
    platform: 'MPAY',
    matriculeNinea: 'NINEA-22334455',
    requesterName: 'Khadim Faye',
    position: 'Receveur des Domaines',
    phone: '+221 77 900 11 22',
    email: 'k.faye@dgid.sn',
    habilitation: 'Chef de Centre / Chef de Division',
    bureau: 'Bureau de la Recette',
    centreFiscal: 'SAINT-LOUIS',
    description: 'Bordereau de paiement MPAY généré mais non synchronisé dans le grand livre SENTAX.',
    status: 'EN ATTENTE',
    createdAt: '2026-08-07T10:00:00Z',
  },
];

let ticketHistory: TicketHistoryItem[] = [
  {
    id: 'h-1',
    ticketId: 't-101',
    ticketNumber: 'ST-2026-000121',
    action: 'Création du ticket',
    newStatus: 'EN ATTENTE',
    createdBy: 'Système SENTAX',
    createdAt: '2026-08-07T08:15:00Z',
  },
  {
    id: 'h-2',
    ticketId: 't-102',
    ticketNumber: 'ST-2026-000122',
    action: 'Création du ticket',
    newStatus: 'EN ATTENTE',
    createdBy: 'Système SENTAX',
    createdAt: '2026-08-07T08:30:00Z',
  },
  {
    id: 'h-3',
    ticketId: 't-102',
    ticketNumber: 'ST-2026-000122',
    action: 'Prise en charge du ticket',
    oldStatus: 'EN ATTENTE',
    newStatus: 'PRISE EN CHARGE',
    toAgentName: 'Fatou Fall',
    createdBy: 'Fatou Fall',
    createdAt: '2026-08-07T09:00:00Z',
  },
  {
    id: 'h-4',
    ticketId: 't-103',
    ticketNumber: 'ST-2026-000123',
    action: 'Création du ticket',
    newStatus: 'EN ATTENTE',
    createdBy: 'Système SENTAX',
    createdAt: '2026-08-07T08:45:00Z',
  },
  {
    id: 'h-5',
    ticketId: 't-103',
    ticketNumber: 'ST-2026-000123',
    action: 'Prise en charge du ticket',
    oldStatus: 'EN ATTENTE',
    newStatus: 'PRISE EN CHARGE',
    toAgentName: 'Fatou Fall',
    createdBy: 'Fatou Fall',
    createdAt: '2026-08-07T09:15:00Z',
  },
  {
    id: 'h-6',
    ticketId: 't-103',
    ticketNumber: 'ST-2026-000123',
    action: 'Transfert du ticket',
    oldStatus: 'PRISE EN CHARGE',
    newStatus: 'TRANSFÉRÉ',
    fromAgentName: 'Fatou Fall',
    toAgentName: 'Ousmane Ndiaye',
    comment: 'Transféré à l\'équipe spécialisée SEN-ETAFI pour analyse approfondie du schéma XML.',
    createdBy: 'Fatou Fall',
    createdAt: '2026-08-07T09:45:00Z',
  },
  {
    id: 'h-7',
    ticketId: 't-104',
    ticketNumber: 'ST-2026-000124',
    action: 'Ticket clôturé',
    oldStatus: 'PRISE EN CHARGE',
    newStatus: 'TERMINÉ',
    toAgentName: 'Amadou Diagne',
    comment: 'Mise à jour des certificats SSL effectuée avec succès sur le gateway E-Banque. Test OK.',
    createdBy: 'Amadou Diagne',
    createdAt: '2026-08-07T09:30:00Z',
  },
];

let notifications: EmailNotification[] = [
  {
    id: 'email-1',
    ticketId: 't-101',
    ticketNumber: 'ST-2026-000121',
    type: 'NEW_TICKET_ADMIN',
    recipient: OFFICIAL_SUPPORT_EMAIL,
    subject: '[SENTAX] Nouveau ticket ST-2026-000121',
    bodyHtml: `<h3>Nouveau ticket ST-2026-000121</h3>
<p><strong>Plateforme:</strong> SENTAX BACK OFFICE</p>
<p><strong>Centre fiscal:</strong> DAKAR-PLATEAU</p>
<p><strong>Demandeur:</strong> Mamadou Diallo (Chef de Section Assiette)</p>
<p><strong>Statut:</strong> EN ATTENTE</p>`,
    status: 'SENT',
    sentAt: '2026-08-07T08:15:01Z',
  },
  {
    id: 'email-2',
    ticketId: 't-104',
    ticketNumber: 'ST-2026-000124',
    type: 'COMPLETED_DEMANDEUR',
    recipient: 'support.monetique@cbao.sn',
    subject: '[SENTAX] Votre ticket ST-2026-000124 est terminé',
    bodyHtml: `<p>Bonjour,</p>
<p>Votre demande portant le numéro <strong>ST-2026-000124</strong> a été traitée par nos services.</p>
<p><strong>Statut:</strong> TERMINÉ</p>
<p><strong>Commentaire de résolution:</strong> Mise à jour des certificats SSL effectuée avec succès sur le gateway E-Banque. Test OK.</p>
<p>Merci d'avoir utilisé le support technique SENTAX / DGID.</p>`,
    status: 'SENT',
    sentAt: '2026-08-07T09:30:05Z',
  },
];

let auditLogs: SystemAuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-08-07T07:00:00Z',
    userEmail: 'amadou.diagne@dgid.sn',
    userName: 'Amadou Diagne',
    userRole: 'SUPERADMIN',
    action: 'CONNEXION_BACKOFFICE',
    details: 'Connexion réussie au Backoffice Support',
    ipAddress: '10.20.4.15',
  },
  {
    id: 'audit-2',
    timestamp: '2026-08-07T08:15:00Z',
    userEmail: 'system@dgid.sn',
    userName: 'Système Public',
    userRole: 'AGENT',
    action: 'CREATION_TICKET',
    details: 'Ticket ST-2026-000121 créé par l\'utilisateur externe (NINEA-10982348)',
    ipAddress: '197.220.10.4',
  },
  {
    id: 'audit-3',
    timestamp: '2026-08-07T09:30:00Z',
    userEmail: 'amadou.diagne@dgid.sn',
    userName: 'Amadou Diagne',
    userRole: 'SUPERADMIN',
    action: 'CLOTURE_TICKET',
    details: 'Clôture du ticket ST-2026-000124 avec avis de résolution.',
    ipAddress: '10.20.4.15',
  },
];

let subscription: SubscriptionInfo = {
  organization: 'Direction Générale des Impôts et des Domaines (DGID)',
  plan: 'ENTREPRISE GOV',
  status: 'ACTIVE',
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T23:59:59Z',
  maxAgents: 50,
  activeAgentsCount: agents.filter((a) => a.status === 'ACTIVE').length,
  monthlyTicketsCount: 1248,
  maxTicketsPerMonth: 10000,
};

// ======================= API ROUTES =======================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SENTAX DGID Support API', version: '2.0.0' });
});

// 2. Public Tickets Endpoint (NEVER returns sensitive personal info!)
app.get('/api/tickets/public', (req: Request, res: Response) => {
  const publicList: PublicTicket[] = tickets.map((t) => ({
    id: t.id,
    ticketNumber: t.ticketNumber,
    objectType: t.objectType,
    platform: t.platform,
    centreFiscal: t.centreFiscal,
    createdAt: t.createdAt,
    status: t.status,
  }));
  res.json(publicList);
});

// 3. Track Ticket Endpoint (Public status tracker by Ticket Number)
app.get('/api/tickets/track/:number', (req: Request, res: Response) => {
  const ticketNum = req.params.number.trim().toUpperCase();
  const ticket = tickets.find((t) => t.ticketNumber.toUpperCase() === ticketNum);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket introuvable.' });
  }

  // Return public sanitized information + non-sensitive timeline
  const history = ticketHistory.filter((h) => h.ticketId === ticket.id);
  
  res.json({
    ticketNumber: ticket.ticketNumber,
    objectType: ticket.objectType,
    platform: ticket.platform,
    centreFiscal: ticket.centreFiscal,
    status: ticket.status,
    createdAt: ticket.createdAt,
    takenAt: ticket.takenAt,
    completedAt: ticket.completedAt,
    resolutionComment: ticket.status === 'TERMINÉ' ? ticket.resolutionComment : undefined,
    history: history.map((h) => ({
      action: h.action,
      newStatus: h.newStatus,
      createdAt: h.createdAt,
      comment: h.action === 'Ticket clôturé' ? h.comment : undefined,
    })),
  });
});

// 4. Private Tickets Endpoint (Full backoffice view)
app.get('/api/tickets/private', (req: Request, res: Response) => {
  res.json(tickets);
});

// 5. Get Single Ticket Details (Private/Detailed)
app.get('/api/tickets/:id', (req: Request, res: Response) => {
  const ticket = tickets.find((t) => t.id === req.params.id || t.ticketNumber === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket non trouvé' });
  }
  const history = ticketHistory.filter((h) => h.ticketId === ticket.id);
  res.json({ ticket, history });
});

// 6. Create Ticket
app.post('/api/tickets', (req: Request, res: Response) => {
  const {
    objectType,
    platform,
    platformOther,
    matriculeNinea,
    requesterName,
    position,
    phone,
    email,
    habilitation,
    bureau,
    centreFiscal,
    description,
    attachments,
  } = req.body;

  if (!objectType || !platform || !matriculeNinea || !requesterName || !position || !phone || !email || !habilitation || !bureau || !centreFiscal) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires du formulaire.' });
  }

  const newTicketNumber = generateTicketNumber();
  const now = new Date().toISOString();

  const newTicket: Ticket = {
    id: `t-${Date.now()}`,
    ticketNumber: newTicketNumber,
    objectType,
    platform,
    platformOther: platform === 'Autre' ? platformOther : undefined,
    matriculeNinea,
    requesterName,
    position,
    phone,
    email,
    habilitation,
    bureau,
    centreFiscal,
    description,
    attachments: attachments || [],
    status: 'EN ATTENTE',
    createdAt: now,
  };

  tickets.unshift(newTicket);

  // Record History
  const historyItem: TicketHistoryItem = {
    id: `h-${Date.now()}`,
    ticketId: newTicket.id,
    ticketNumber: newTicketNumber,
    action: 'Création du ticket',
    newStatus: 'EN ATTENTE',
    createdBy: 'Système Portails',
    createdAt: now,
  };
  ticketHistory.push(historyItem);

  // Record Notification to support-technique-sentax@dgid.sn
  const emailItem: EmailNotification = {
    id: `email-${Date.now()}`,
    ticketId: newTicket.id,
    ticketNumber: newTicketNumber,
    type: 'NEW_TICKET_ADMIN',
    recipient: OFFICIAL_SUPPORT_EMAIL,
    subject: `[SENTAX] Nouveau ticket ${newTicketNumber}`,
    bodyHtml: `<h3>Nouveau Ticket Enregistré</h3>
<p><strong>Numéro:</strong> ${newTicketNumber}</p>
<p><strong>Objet:</strong> ${objectType}</p>
<p><strong>Plateforme:</strong> ${platform}${platformOther ? ` (${platformOther})` : ''}</p>
<p><strong>Matricule/NINEA:</strong> ${matriculeNinea}</p>
<p><strong>Demandeur:</strong> ${requesterName} (${position})</p>
<p><strong>Habilitation:</strong> ${habilitation}</p>
<p><strong>Bureau:</strong> ${bureau}</p>
<p><strong>Centre fiscal:</strong> ${centreFiscal}</p>
<p><strong>Téléphone:</strong> ${phone} | <strong>Email:</strong> ${email}</p>
<p><strong>Description:</strong> ${description || 'Aucune précision'}</p>
<p><strong>Statut initial:</strong> EN ATTENTE</p>`,
    status: 'SENT',
    sentAt: now,
  };
  notifications.unshift(emailItem);

  // Record Audit
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: now,
    userEmail: email,
    userName: requesterName,
    userRole: 'AGENT',
    action: 'CREATION_TICKET',
    details: `Nouveau ticket ${newTicketNumber} pour la plateforme ${platform} (${centreFiscal})`,
  });

  subscription.monthlyTicketsCount += 1;

  res.status(201).json({
    message: 'Votre ticket a été créé avec succès.',
    ticketNumber: newTicketNumber,
    ticket: newTicket,
  });
});

// 7. Update Ticket Status (Prise en charge, Transférer, Terminer)
app.patch('/api/tickets/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, agentId, agentName, targetAgentId, targetAgentName, transferReason, resolutionComment } = req.body;

  const ticketIndex = tickets.findIndex((t) => t.id === id || t.ticketNumber === id);
  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket non trouvé.' });
  }

  const ticket = tickets[ticketIndex];
  const oldStatus = ticket.status;
  const now = new Date().toISOString();

  if (action === 'PRISE_EN_CHARGE') {
    ticket.status = 'PRISE EN CHARGE';
    ticket.assignedAgentId = agentId;
    ticket.assignedAgentName = agentName;
    ticket.takenAt = now;

    // Record history
    ticketHistory.push({
      id: `h-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      action: 'Prise en charge du ticket',
      oldStatus,
      newStatus: 'PRISE EN CHARGE',
      toAgentName: agentName,
      createdBy: agentName,
      createdAt: now,
    });

    // Record notification email to support-technique-sentax@dgid.sn
    notifications.unshift({
      id: `email-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      type: 'TAKEN_OVER_ADMIN',
      recipient: OFFICIAL_SUPPORT_EMAIL,
      subject: `[SENTAX] Ticket ${ticket.ticketNumber} pris en charge`,
      bodyHtml: `<p>Le ticket <strong>${ticket.ticketNumber}</strong> vient d'être pris en charge.</p>
<p><strong>Agent responsable:</strong> ${agentName}</p>
<p><strong>Plateforme:</strong> ${ticket.platform}</p>
<p><strong>Objet:</strong> ${ticket.objectType}</p>
<p><strong>Centre fiscal:</strong> ${ticket.centreFiscal}</p>
<p><strong>Date:</strong> ${new Date(now).toLocaleString('fr-FR')}</p>
<p><strong>Statut:</strong> PRISE EN CHARGE</p>`,
      status: 'SENT',
      sentAt: now,
    });

    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: now,
      userEmail: `${agentName.toLowerCase().replace(' ', '.')}@dgid.sn`,
      userName: agentName,
      userRole: 'AGENT',
      action: 'PRISE_EN_CHARGE',
      details: `Prise en charge du ticket ${ticket.ticketNumber}`,
    });
  } else if (action === 'TRANSFERER') {
    ticket.status = 'TRANSFÉRÉ';
    const oldAgent = ticket.assignedAgentName || 'Non assigné';
    ticket.assignedAgentId = targetAgentId;
    ticket.assignedAgentName = targetAgentName;
    ticket.transferredAt = now;

    ticketHistory.push({
      id: `h-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      action: 'Transfert du ticket',
      oldStatus,
      newStatus: 'TRANSFÉRÉ',
      fromAgentName: oldAgent,
      toAgentName: targetAgentName,
      comment: transferReason || 'Transfert de compétences',
      createdBy: agentName || 'Superviseur',
      createdAt: now,
    });

    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: now,
      userEmail: 'support@dgid.sn',
      userName: agentName || 'Agent Support',
      userRole: 'AGENT',
      action: 'TRANSFERT_TICKET',
      details: `Ticket ${ticket.ticketNumber} transféré de ${oldAgent} vers ${targetAgentName}`,
    });
  } else if (action === 'TERMINER') {
    ticket.status = 'TERMINÉ';
    ticket.completedAt = now;
    ticket.resolutionComment = resolutionComment || 'Incident résolu par le support technique.';

    ticketHistory.push({
      id: `h-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      action: 'Ticket clôturé',
      oldStatus,
      newStatus: 'TERMINÉ',
      toAgentName: agentName || ticket.assignedAgentName || 'Agent Support',
      comment: ticket.resolutionComment,
      createdBy: agentName || 'Agent Support',
      createdAt: now,
    });

    // Send Automatic Email to Requester
    notifications.unshift({
      id: `email-${Date.now()}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      type: 'COMPLETED_DEMANDEUR',
      recipient: ticket.email,
      subject: `[SENTAX] Votre ticket ${ticket.ticketNumber} est terminé`,
      bodyHtml: `<p>Bonjour,</p>
<p>Votre demande portant le numéro <strong>${ticket.ticketNumber}</strong> a été traitée par nos services.</p>
<p><strong>Statut:</strong> TERMINÉ</p>
<p><strong>Plateforme:</strong> ${ticket.platform}</p>
<p><strong>Objet:</strong> ${ticket.objectType}</p>
<p><strong>Commentaire de résolution:</strong></p>
<blockquote style="background:#f1f5f9; padding:12px; border-left:4px solid #10b981; margin:10px 0;">
${ticket.resolutionComment}
</blockquote>
<p>Merci d'avoir utilisé le support technique SENTAX / DGID.</p>`,
      status: 'SENT',
      sentAt: now,
    });

    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: now,
      userEmail: `${(agentName || 'agent').toLowerCase().replace(' ', '.')}@dgid.sn`,
      userName: agentName || 'Agent Support',
      userRole: 'AGENT',
      action: 'CLOTURE_TICKET',
      details: `Clôture du ticket ${ticket.ticketNumber} avec motif: ${ticket.resolutionComment}`,
    });
  }

  tickets[ticketIndex] = ticket;
  res.json({ message: 'Statut du ticket mis à jour avec succès.', ticket });
});

// 8. Agents Management APIs
app.get('/api/agents', (req: Request, res: Response) => {
  const agentsWithCounts = agents.map((agent) => {
    const assignedCount = tickets.filter(
      (t) => t.assignedAgentId === agent.id && t.status !== 'TERMINÉ'
    ).length;
    return { ...agent, assignedTicketsCount: assignedCount };
  });
  res.json(agentsWithCounts);
});

app.post('/api/agents', (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, matricule, role, habilitation, poste, bureau, direction } = req.body;

  if (!firstName || !lastName || !email || !role) {
    return res.status(400).json({ error: 'Nom, prénom, email et rôle sont obligatoires.' });
  }

  const newAgent: UserAgent = {
    id: `agent-${Date.now()}`,
    firstName,
    lastName,
    email,
    phone: phone || '',
    matricule: matricule || `DGID-${Math.floor(100000 + Math.random() * 900000)}`,
    role,
    habilitation: habilitation || 'Agent d\'Assiette',
    poste: poste || 'Agent Support Technique',
    bureau: bureau || 'Bureau Informatique',
    direction: direction || 'Direction des Systèmes d\'Information',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  agents.push(newAgent);
  subscription.activeAgentsCount = agents.filter((a) => a.status === 'ACTIVE').length;

  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail: 'admin@dgid.sn',
    userName: 'Superadmin',
    userRole: 'SUPERADMIN',
    action: 'CREATION_AGENT',
    details: `Création du compte agent pour ${firstName} ${lastName} (${email}) - Rôle: ${role}`,
  });

  res.status(201).json(newAgent);
});

app.patch('/api/agents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const agentIndex = agents.findIndex((a) => a.id === id);

  if (agentIndex === -1) {
    return res.status(404).json({ error: 'Agent non trouvé' });
  }

  agents[agentIndex] = { ...agents[agentIndex], ...req.body };
  subscription.activeAgentsCount = agents.filter((a) => a.status === 'ACTIVE').length;

  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail: 'admin@dgid.sn',
    userName: 'Superadmin',
    userRole: 'SUPERADMIN',
    action: 'MODIFICATION_AGENT',
    details: `Mise à jour de l'agent ${agents[agentIndex].firstName} ${agents[agentIndex].lastName}`,
  });

  res.json(agents[agentIndex]);
});

// 9. Statistics Endpoint
app.get('/api/stats', (req: Request, res: Response) => {
  const total = tickets.length;
  const enAttente = tickets.filter((t) => t.status === 'EN ATTENTE').length;
  const enPriseEnCharge = tickets.filter((t) => t.status === 'PRISE EN CHARGE').length;
  const transferes = tickets.filter((t) => t.status === 'TRANSFÉRÉ').length;
  const termines = tickets.filter((t) => t.status === 'TERMINÉ').length;

  const resolutionRate = total > 0 ? Math.round((termines / total) * 100) : 0;

  // Breakdown by Platform
  const byPlatform: Record<string, number> = {};
  tickets.forEach((t) => {
    byPlatform[t.platform] = (byPlatform[t.platform] || 0) + 1;
  });

  // Breakdown by Tax Center
  const byCentreFiscal: Record<string, number> = {};
  tickets.forEach((t) => {
    byCentreFiscal[t.centreFiscal] = (byCentreFiscal[t.centreFiscal] || 0) + 1;
  });

  // Breakdown by Agent
  const byAgent: Record<string, number> = {};
  tickets.forEach((t) => {
    const name = t.assignedAgentName || 'Non Assigné';
    byAgent[name] = (byAgent[name] || 0) + 1;
  });

  res.json({
    kpis: {
      total,
      enAttente,
      enPriseEnCharge,
      transferes,
      termines,
      resolutionRate,
      avgTakeoverTimeMinutes: 18,
      avgResolutionTimeHours: 2.4,
    },
    byPlatform,
    byCentreFiscal,
    byAgent,
  });
});

// 10. Email Notifications Log Endpoint
app.get('/api/emails', (req: Request, res: Response) => {
  res.json(notifications);
});

// 11. System Audit Logs Endpoint
app.get('/api/audit', (req: Request, res: Response) => {
  res.json(auditLogs);
});

// 12. SaaS Subscription Info
app.get('/api/subscription', (req: Request, res: Response) => {
  res.json(subscription);
});

// Server Initialization
async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SENTAX DGID Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
