
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email accounts table
CREATE TABLE email_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

CREATE INDEX idx_email_accounts_user_id ON email_accounts(user_id);
CREATE INDEX idx_email_accounts_email ON email_accounts(email);

-- Emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_email TEXT NOT NULL,
  external_id TEXT NOT NULL,
  thread_id TEXT,
  subject TEXT NOT NULL,
  "from" TEXT NOT NULL,
  "to" TEXT[] DEFAULT '{}',
  cc TEXT[] DEFAULT '{}',
  bcc TEXT[] DEFAULT '{}',
  body TEXT NOT NULL,
  body_html TEXT,
  snippet TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  folder TEXT DEFAULT 'inbox',
  labels TEXT[] DEFAULT '{}',
  is_processed BOOLEAN DEFAULT false,
  audio_url TEXT,
  summary TEXT,
  urgency_level TEXT,
  is_lead BOOLEAN DEFAULT false,
  is_job_offer BOOLEAN DEFAULT false,
  is_junk BOOLEAN,
  junk_confirmed BOOLEAN DEFAULT false,
  ai_reason TEXT,
  confidence FLOAT,
  has_attachments BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, external_id)
);

CREATE INDEX idx_emails_user_folder ON emails(user_id, folder);
CREATE INDEX idx_emails_user_processed ON emails(user_id, is_processed);
CREATE INDEX idx_emails_user_junk ON emails(user_id, is_junk);
CREATE INDEX idx_emails_received_at ON emails(user_id, received_at DESC);
CREATE INDEX idx_emails_account ON emails(account_email);

-- Insights table
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_email_id ON insights(email_id);
CREATE INDEX idx_insights_type ON insights(type);

-- Attachments table
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attachments_email_id ON attachments(email_id);

-- Voice settings table
CREATE TABLE voice_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  voice_id TEXT DEFAULT '21m00Tcm4TlvDq8ikWAM',
  voice_name TEXT DEFAULT 'Rachel',
  model_id TEXT DEFAULT 'eleven_turbo_v2_5',
  stability FLOAT DEFAULT 0.6,
  similarity_boost FLOAT DEFAULT 0.8,
  style FLOAT DEFAULT 0.2,
  use_speaker_boost BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_voice_settings_user_id ON voice_settings(user_id);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  emails_processed INTEGER DEFAULT 0,
  emails_limit INTEGER DEFAULT 50,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Audio files table
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_id UUID REFERENCES emails(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  duration FLOAT,
  size INTEGER NOT NULL,
  mime_type TEXT DEFAULT 'audio/mpeg',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audio_files_user_id ON audio_files(user_id);
CREATE INDEX idx_audio_files_email_id ON audio_files(email_id);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON email_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_settings_updated_at BEFORE UPDATE ON voice_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();