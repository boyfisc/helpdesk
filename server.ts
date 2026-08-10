import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { supabaseAdmin } from './src/db/supabase-server';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;
app.use(express.json({ limit: '50mb' }));

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 'YOUR_GMAIL_APP_PASSWORD') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

import { NextFunction } from "express";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Non autorisé: Token manquant" });
  }
  const token = authHeader.split(" ")[1];
  if (!supabaseAdmin) return res.status(500).json({ error: "Supabase non configuré" });
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Non autorisé: Token invalide" });
  }
  (req as any).user = user;
  next();
};

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SENTAX DGID Support API', version: '2.0.0' });
});

app.get('/api/tickets/public', async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabaseAdmin
    .from('tickets')
    .select('id, ticket_number, object_type, platform, centre_fiscal, created_at, status, agents(first_name, last_name)')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  // Transform to match frontend types (camelCase)
  const formatted = data.map((t: any) => ({
    id: t.id,
    ticketNumber: t.ticket_number,
    objectType: t.object_type,
    platform: t.platform,
    centreFiscal: t.centre_fiscal,
    createdAt: t.created_at,
    status: t.status,
    assignedAgentName: t.agents ? `${t.agents.first_name} ${t.agents.last_name}` : undefined
  }));
  res.json(formatted);
});

app.get('/api/tickets/track/:number', async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { number } = req.params;
  const { data, error } = await supabaseAdmin
    .from('tickets')
    .select('*, ticket_history(*)')
    .eq('ticket_number', number)
    .single();
    
  if (error || !data) return res.status(404).json({ error: 'Ticket introuvable' });
  
  const historyFormatted = data.ticket_history.map((h: any) => ({
    id: h.id,
    ticketId: h.ticket_id,
    ticketNumber: h.ticket_number,
    action: h.action,
    oldStatus: h.old_status,
    newStatus: h.new_status,
    fromAgentName: h.from_agent_name,
    toAgentName: h.to_agent_name,
    comment: h.comment,
    createdBy: h.created_by,
    createdAt: h.created_at
  }));
  
  const formatted = {
    id: data.id,
    ticketNumber: data.ticket_number,
    objectType: data.object_type,
    platform: data.platform,
    platformOther: data.platform_other,
    matriculeNinea: data.matricule_ninea,
    requesterName: data.requester_name,
    position: data.position,
    phone: data.phone,
    email: data.email,
    habilitation: data.habilitation,
    bureau: data.bureau,
    centreFiscal: data.centre_fiscal,
    description: data.description,
    attachments: data.attachments,
    status: data.status,
    assignedAgentId: data.assigned_agent_id,
    resolutionComment: data.resolution_comment,
    createdAt: data.created_at,
    takenAt: data.taken_at,
    transferredAt: data.transferred_at,
    completedAt: data.completed_at,
    history: historyFormatted.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  };
  
  res.json(formatted);
});

app.get('/api/tickets/private', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  
  const { data: tickets, error } = await supabaseAdmin
    .from('tickets')
    .select('*, agents(first_name, last_name)')
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = tickets.map((t: any) => ({
    id: t.id,
    ticketNumber: t.ticket_number,
    objectType: t.object_type,
    platform: t.platform,
    platformOther: t.platform_other,
    matriculeNinea: t.matricule_ninea,
    requesterName: t.requester_name,
    position: t.position,
    phone: t.phone,
    email: t.email,
    habilitation: t.habilitation,
    bureau: t.bureau,
    centreFiscal: t.centre_fiscal,
    description: t.description,
    attachments: t.attachments,
    status: t.status,
    assignedAgentId: t.assigned_agent_id,
    assignedAgentName: t.agents ? `${t.agents.first_name} ${t.agents.last_name}` : undefined,
    resolutionComment: t.resolution_comment,
    createdAt: t.created_at,
    takenAt: t.taken_at,
    transferredAt: t.transferred_at,
    completedAt: t.completed_at
  }));
  
  res.json(formatted);
});

app.get('/api/tickets/:id', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('tickets')
    .select('*, agents(first_name, last_name)')
    .eq('id', id)
    .single();
    
  if (error || !data) return res.status(404).json({ error: 'Ticket non trouvé' });
  
  const formatted = {
    id: data.id,
    ticketNumber: data.ticket_number,
    objectType: data.object_type,
    platform: data.platform,
    platformOther: data.platform_other,
    matriculeNinea: data.matricule_ninea,
    requesterName: data.requester_name,
    position: data.position,
    phone: data.phone,
    email: data.email,
    habilitation: data.habilitation,
    bureau: data.bureau,
    centreFiscal: data.centre_fiscal,
    description: data.description,
    attachments: data.attachments,
    status: data.status,
    assignedAgentId: data.assigned_agent_id,
    assignedAgentName: data.agents ? `${data.agents.first_name} ${data.agents.last_name}` : undefined,
    resolutionComment: data.resolution_comment,
    createdAt: data.created_at,
    takenAt: data.taken_at,
    transferredAt: data.transferred_at,
    completedAt: data.completed_at
  };
  
  res.json(formatted);
});

async function logAudit(action: string, details: string, email: string = 'dsi.dgid@gmail.com', name: string = 'Système', role: string = 'SYSTEM') {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from('audit_logs').insert({
    user_email: email,
    user_name: name,
    user_role: role,
    action: action,
    details: details
  });
}

async function sendEmailNotification(ticketId: string, ticketNumber: string, type: string, recipient: string, subject: string, bodyHtml: string, attachments: any[] = []) {
  if (!supabaseAdmin) return;
  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 'YOUR_GMAIL_APP_PASSWORD') {
      const mailAttachments = attachments.map(att => {
        if (att.url && att.url.startsWith('data:')) {
          const arr = att.url.split(',');
          const bstr = Buffer.from(arr[1], 'base64');
          return {
            filename: att.name,
            content: bstr
          };
        }
        if (att.url && att.url.startsWith('http')) {
          return { filename: att.name, path: att.url };
        }
        return { filename: att.name, content: att.url || '' };
      });

      const mailer = getTransporter();
      if (mailer) {
        await mailer.sendMail({
          from: `"Support DGID" <${process.env.SMTP_USER}>`,
          to: recipient,
          subject: subject,
          html: bodyHtml,
          attachments: mailAttachments.filter(a => a.content || a.path)
        });
      } else {
        console.warn('SMTP credentials not configured properly, skipping actual email send.');
      }
    } else {
      console.warn('SMTP credentials not configured, skipping actual email send.');
    }

    await supabaseAdmin.from('email_notifications').insert({
      ticket_id: ticketId,
      ticket_number: ticketNumber,
      type: type,
      recipient: recipient,
      subject: subject,
      body_html: bodyHtml,
      status: 'ENVOYÉ'
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

async function processAttachments(ticketNumber: string, attachments: any[]) {
  if (!supabaseAdmin || !attachments || attachments.length === 0) return attachments;
  
  const processedAttachments = [];
  
  for (const att of attachments) {
    if (att.url && att.url.startsWith('data:')) {
      try {
        const arr = att.url.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const contentType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const bstr = Buffer.from(arr[1], 'base64');
        
        const ext = att.name.split('.').pop() || 'file';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `${ticketNumber}/${fileName}`;
        
        const { error } = await supabaseAdmin.storage
          .from('attachments')
          .upload(filePath, bstr, {
            contentType,
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading attachment to Supabase Storage:', error);
          processedAttachments.push(att);
        } else {
          const { data: { publicUrl } } = supabaseAdmin.storage.from('attachments').getPublicUrl(filePath);
          processedAttachments.push({
            name: att.name,
            size: att.size,
            type: att.type,
            url: publicUrl
          });
        }
      } catch (err) {
        console.error('Failed to process attachment:', err);
        processedAttachments.push(att);
      }
    } else {
      processedAttachments.push(att);
    }
  }
  
  return processedAttachments;
}

app.post('/api/tickets', async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const payload = req.body;
  
  const year = new Date().getFullYear();
  // Get latest ticket to generate next number
  const { data: latest } = await supabaseAdmin
    .from('tickets')
    .select('ticket_number')
    .order('created_at', { ascending: false })
    .limit(1);
    
  let seq = 1;
  if (latest && latest.length > 0) {
    const lastNum = latest[0].ticket_number;
    const parts = lastNum.split('-');
    if (parts.length === 3 && parts[1] == year.toString()) {
       seq = parseInt(parts[2], 10) + 1;
    }
  }
  const ticketNumber = `ST-${year}-${String(seq).padStart(6, '0')}`;
  
  const processedAttachments = await processAttachments(ticketNumber, payload.attachments || []);
  
  const { data: newTicket, error } = await supabaseAdmin.from('tickets').insert({
    ticket_number: ticketNumber,
    object_type: payload.objectType,
    platform: payload.platform,
    platform_other: payload.platformOther,
    matricule_ninea: payload.matriculeNinea,
    requester_name: payload.requesterName,
    position: payload.position,
    phone: payload.phone,
    email: payload.email,
    habilitation: payload.habilitation,
    bureau: payload.bureau,
    centre_fiscal: payload.centreFiscal,
    description: payload.description,
    attachments: processedAttachments,
    status: 'EN ATTENTE'
  }).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  
  await supabaseAdmin.from('ticket_history').insert({
    ticket_id: newTicket.id,
    ticket_number: newTicket.ticket_number,
    action: 'CREATION',
    new_status: 'EN ATTENTE',
    created_by: payload.requesterName
  });
  
  await logAudit('CREATION_TICKET', `Ticket ${newTicket.ticket_number} créé par externe (${newTicket.matricule_ninea})`);
  
  if (payload.email) {
    const subject = `Accusé de réception - Ticket ${newTicket.ticket_number}`;
    const bodyHtml = `<p>Bonjour ${payload.requesterName},</p><p>Votre ticket <strong>${newTicket.ticket_number}</strong> concernant "<em>${payload.objectType}</em>" a bien été pris en compte.</p><p>Notre équipe technique vous contactera dans les meilleurs délais.</p><p>Cordialement,<br>L'équipe Support DGID</p>`;
    sendEmailNotification(newTicket.id, newTicket.ticket_number, 'CREATION', payload.email, subject, bodyHtml, processedAttachments).catch(console.error);
  }

  res.status(201).json({ 
    id: newTicket.id, 
    ticketNumber: newTicket.ticket_number 
  });
});

app.patch('/api/tickets/:id/status', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const { status, action, agentId, agentName, targetAgentId, targetAgentName, resolutionComment, userEmail, userRole } = req.body;
  
  const { data: oldTicket, error: fetchErr } = await supabaseAdmin.from('tickets').select('*').eq('id', id).single();
  if (fetchErr || !oldTicket) return res.status(404).json({ error: 'Ticket not found' });
  
  const updateData: any = { status };
  
  if (action === 'TAKE_OVER') {
    updateData.assigned_agent_id = agentId;
    updateData.taken_at = new Date().toISOString();
  } else if (action === 'TRANSFER') {
    updateData.assigned_agent_id = targetAgentId;
    updateData.transferred_at = new Date().toISOString();
  } else if (action === 'RESOLVE') {
    updateData.resolution_comment = resolutionComment;
    updateData.completed_at = new Date().toISOString();
  }
  
  const { error: updateErr } = await supabaseAdmin.from('tickets').update(updateData).eq('id', id);
  if (updateErr) return res.status(500).json({ error: updateErr.message });
  
  let comment = '';
  if (action === 'TRANSFER') comment = `Transféré à ${targetAgentName}`;
  else if (action === 'RESOLVE') comment = resolutionComment || '';
  
  await supabaseAdmin.from('ticket_history').insert({
    ticket_id: oldTicket.id,
    ticket_number: oldTicket.ticket_number,
    action: action,
    old_status: oldTicket.status,
    new_status: status,
    from_agent_name: action === 'TRANSFER' ? agentName : undefined,
    to_agent_name: action === 'TRANSFER' ? targetAgentName : undefined,
    comment: comment,
    created_by: agentName || 'Système'
  });
  
  await logAudit(`${action}_TICKET`, `Action ${action} sur ${oldTicket.ticket_number}`, userEmail, agentName, userRole);
  
  if (action === 'RESOLVE' && oldTicket.email) {
    const subject = `Clôture de votre ticket - ${oldTicket.ticket_number}`;
    const bodyHtml = `<p>Bonjour ${oldTicket.requester_name},</p><p>Nous vous informons que votre ticket <strong>${oldTicket.ticket_number}</strong> a été traité et clôturé par notre équipe technique.</p><p>Commentaire de résolution : ${resolutionComment || 'Aucun commentaire'}</p><p>Cordialement,<br>L'équipe Support DGID</p>`;
    sendEmailNotification(oldTicket.id, oldTicket.ticket_number, 'CLOTURE', oldTicket.email, subject, bodyHtml, oldTicket.attachments || []).catch(console.error);
  }

  res.json({ success: true });
});

app.get('/api/agents', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabaseAdmin.from('agents').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = data.map(a => ({
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    email: a.email,
    phone: a.phone,
    matricule: a.matricule,
    role: a.role,
    habilitation: a.habilitation,
    poste: a.poste,
    bureau: a.bureau,
    direction: a.direction,
    status: a.status,
    createdAt: a.created_at
  }));
  res.json(formatted);
});

app.post('/api/agents', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const payload = req.body;
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: payload.email,
    password: 'Password123!',
    email_confirm: true
  });

  if (authError) {
    return res.status(400).json({ error: 'Erreur lors de la création du compte auth: ' + authError.message });
  }

  
  const { data, error } = await supabaseAdmin.from('agents').insert({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    matricule: payload.matricule,
    role: payload.role,
    habilitation: payload.habilitation,
    poste: payload.poste,
    bureau: payload.bureau,
    direction: payload.direction,
    status: payload.status || 'ACTIVE'
  }).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  await logAudit('CREATION_AGENT', `Agent ${payload.email} créé`);
  res.status(201).json(data);
});

app.patch('/api/agents/:id', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { id } = req.params;
  const payload = req.body;
  
  const updateData: any = {};
  if (payload.status !== undefined) updateData.status = payload.status;
  if (payload.role !== undefined) updateData.role = payload.role;
  
  const { error } = await supabaseAdmin.from('agents').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  
  await logAudit('MODIFICATION_AGENT', `Agent ${id} modifié`);
  res.json({ success: true });
});

app.get('/api/stats', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabaseAdmin.from('tickets').select('status, platform, object_type, created_at');
  if (error) return res.status(500).json({ error: error.message });
  
  const total = data.length;
  const byStatus: Record<string, number> = { 'EN ATTENTE': 0, 'PRISE EN CHARGE': 0, 'TRANSFÉRÉ': 0, 'TERMINÉ': 0 };
  const byPlatform: Record<string, number> = {};
  const byType: Record<string, number> = { 'SIGNALER UN INCIDENT TECHNIQUE': 0, 'EFFECTUER UNE REQUÊTE': 0 };
  
  const monthlyData: Record<string, number> = {};
  
  data.forEach(t => {
    if (byStatus[t.status] !== undefined) byStatus[t.status]++;
    byPlatform[t.platform] = (byPlatform[t.platform] || 0) + 1;
    if (byType[t.object_type] !== undefined) byType[t.object_type]++;
    
    const d = new Date(t.created_at);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[m] = (monthlyData[m] || 0) + 1;
  });
  
  res.json({
    totalTickets: total,
    byStatus,
    byPlatform,
    byType,
    monthlyTrend: Object.keys(monthlyData).sort().map(k => ({ month: k, count: monthlyData[k] }))
  });
});

app.get('/api/emails', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabaseAdmin.from('email_notifications').select('*').order('sent_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = data.map(e => ({
    id: e.id,
    ticketId: e.ticket_id,
    ticketNumber: e.ticket_number,
    type: e.type,
    recipient: e.recipient,
    subject: e.subject,
    bodyHtml: e.body_html,
    status: e.status,
    sentAt: e.sent_at
  }));
  res.json(formatted);
});

app.get('/api/audit', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabaseAdmin.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(100);
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = data.map(a => ({
    id: a.id,
    timestamp: a.timestamp,
    userEmail: a.user_email,
    userName: a.user_name,
    userRole: a.user_role,
    action: a.action,
    details: a.details,
    ipAddress: a.ip_address
  }));
  res.json(formatted);
});

app.get('/api/subscription', authMiddleware, async (req: Request, res: Response) => {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase non configuré' });
  const { data, error } = await supabaseAdmin.from('subscription_info').select('*').eq('id', 1).single();
  if (error || !data) return res.status(500).json({ error: 'Information non trouvée' });
  
  const { count } = await supabaseAdmin.from('agents').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE');
  
  res.json({
    organization: data.organization,
    plan: data.plan,
    status: data.status,
    startDate: data.start_date,
    endDate: data.end_date,
    maxAgents: data.max_agents,
    activeAgentsCount: count || 0,
    monthlyTicketsCount: 0,
    maxTicketsPerMonth: data.max_tickets_per_month
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
