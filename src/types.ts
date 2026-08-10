export type TicketObjectType = 'SIGNALER UN INCIDENT TECHNIQUE' | 'EFFECTUER UNE REQUÊTE';

export type TicketStatus = 'EN ATTENTE' | 'PRISE EN CHARGE' | 'TRANSFÉRÉ' | 'TERMINÉ';

export type PlatformType =
  | 'SENTAX BACK OFFICE'
  | 'SENTAX CONTRIBUABLE'
  | 'SENTAX EBANQUE'
  | 'E-SERVICES'
  | 'MON ESPACE-PERSO'
  | 'SEN-ETAFI'
  | 'MPAY'
  | 'SENTIMBRES'
  | 'DGID-DIGITAL'
  | 'PCF'
  | 'COFI'
  | 'Autre';

export type HabilitationType =
  | 'Directeur / CT'
  | 'Chef de Centre / Chef de Division'
  | 'Chef de Bureau'
  | 'Chef de Section / UGF'
  | 'Agent d\'Assiette'
  | 'Comptable';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'AGENT';

export interface UserAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matricule: string;
  role: UserRole;
  habilitation: HabilitationType;
  poste: string;
  bureau: string;
  direction: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedTicketsCount?: number;
  createdAt: string;
}

export interface TicketAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // ST-2026-XXXXXX
  objectType: TicketObjectType;
  platform: PlatformType;
  platformOther?: string;
  matriculeNinea: string;
  requesterName: string; // Prénom, Nom ou Raison Sociale (Sensitive)
  position: string; // Poste occupé
  phone: string;
  email: string;
  habilitation: HabilitationType;
  bureau: string;
  centreFiscal: string;
  description?: string;
  attachments?: TicketAttachment[];
  status: TicketStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  resolutionComment?: string;
  createdAt: string;
  takenAt?: string;
  transferredAt?: string;
  completedAt?: string;
}

export interface PublicTicket {
  id: string;
  ticketNumber: string;
  objectType: TicketObjectType;
  platform: PlatformType;
  centreFiscal: string;
  createdAt: string;
  status: TicketStatus;
  assignedAgentName?: string;
}

export interface TicketHistoryItem {
  id: string;
  ticketId: string;
  ticketNumber: string;
  action: string;
  oldStatus?: TicketStatus;
  newStatus?: TicketStatus;
  fromAgentName?: string;
  toAgentName?: string;
  comment?: string;
  createdBy: string;
  createdAt: string;
}

export interface EmailNotification {
  id: string;
  ticketId: string;
  ticketNumber: string;
  type: 'NEW_TICKET_ADMIN' | 'TAKEN_OVER_ADMIN' | 'COMPLETED_DEMANDEUR';
  recipient: string;
  subject: string;
  bodyHtml: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  sentAt: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface SubscriptionInfo {
  organization: string;
  plan: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TRIAL';
  startDate: string;
  endDate: string;
  maxAgents: number;
  activeAgentsCount: number;
  monthlyTicketsCount: number;
  maxTicketsPerMonth: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAgent | null;
}
