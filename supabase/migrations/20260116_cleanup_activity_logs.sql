-- Auto-delete activity logs older than 1 week
-- This helps maintain free tier storage limits

-- Create a function to delete old logs
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM activity_logs
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  -- Log the cleanup action
  RAISE NOTICE 'Cleaned up activity logs older than 7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job using pg_cron (if available on your Supabase tier)
-- Note: pg_cron may require enabling via Supabase dashboard
-- This runs daily at 2 AM UTC
SELECT cron.schedule(
  'cleanup_activity_logs_daily',
  '0 2 * * *',
  'SELECT cleanup_old_activity_logs()'
);

-- Alternative: If pg_cron is not available, use a trigger on INSERT
-- that occasionally runs cleanup (every 100 inserts)
CREATE OR REPLACE FUNCTION activity_logs_cleanup_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Run cleanup every 100 inserts (statistically)
  IF (SELECT COUNT(*) FROM activity_logs) % 100 = 0 THEN
    DELETE FROM activity_logs
    WHERE created_at < NOW() - INTERVAL '7 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_logs_cleanup_on_insert
AFTER INSERT ON activity_logs
FOR EACH ROW
EXECUTE FUNCTION activity_logs_cleanup_trigger();

-- Add a column to track if logs should be retained longer (optional)
ALTER TABLE activity_logs 
ADD COLUMN IF NOT EXISTS retain_until TIMESTAMPTZ;

-- Update the cleanup function to respect retain_until
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM activity_logs
  WHERE (retain_until IS NULL AND created_at < NOW() - INTERVAL '7 days')
     OR (retain_until IS NOT NULL AND retain_until < NOW());
  
  RAISE NOTICE 'Cleaned up activity logs';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
