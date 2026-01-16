-- Create activity_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (
    action_type IN (
      'STATUS_UPDATED',
      'ROLE_CHANGED',
      'ANNOUNCEMENT_CREATED',
      'ANNOUNCEMENT_UPDATED',
      'ANNOUNCEMENT_DELETED',
      'FAQ_CREATED',
      'FAQ_EDITED',
      'FAQ_DELETED',
      'REQUEST_ASSIGNED',
      'NOTE_ADDED'
    )
  ),
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (
    target_type IN ('request', 'user', 'announcement', 'faq')
  ),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on created_at for faster chronological queries
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Create index on actor_email for filtering by admin
CREATE INDEX idx_activity_logs_actor_email ON activity_logs(actor_email);

-- Create index on action_type for filtering by action
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);

-- Create index on target_id for looking up logs for specific entities
CREATE INDEX idx_activity_logs_target_id ON activity_logs(target_id);

-- Enable Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view activity logs
CREATE POLICY "Admin can view activity logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Only admins can insert activity logs
CREATE POLICY "Admin can insert activity logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
