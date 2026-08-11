-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: agents
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  matricule TEXT UNIQUE,
  role TEXT DEFAULT 'AGENT',
  habilitation TEXT,
  poste TEXT,
  bureau TEXT,
  direction TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  object_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  platform_other TEXT,
  matricule_ninea TEXT,
  requester_name TEXT,
  position TEXT,
  phone TEXT,
  email TEXT,
  bureau TEXT,
  centre_fiscal TEXT,
  description TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'EN ATTENTE',
  assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  assigned_agent_name TEXT,
  resolution_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  taken_at TIMESTAMPTZ,
  transferred_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Table: ticket_history
CREATE TABLE IF NOT EXISTS ticket_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  from_agent_name TEXT,
  to_agent_name TEXT,
  comment TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: email_notifications
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL,
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT
);

-- Table: subscription_info
CREATE TABLE IF NOT EXISTS subscription_info (
  id SERIAL PRIMARY KEY,
  organization TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  max_agents INTEGER NOT NULL,
  max_tickets_per_month INTEGER NOT NULL
);

-- Insert demo subscription
INSERT INTO subscription_info (organization, plan, status, start_date, end_date, max_agents, max_tickets_per_month)
VALUES ('DGID', 'ENTERPRISE', 'ACTIVE', NOW(), NOW() + INTERVAL '1 year', 100, 10000)
ON CONFLICT DO NOTHING;
