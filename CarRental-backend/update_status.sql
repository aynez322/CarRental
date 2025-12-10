ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'active', 'cancelled', 'completed'));
ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'pending';

UPDATE bookings SET status = 'active' WHERE status IS NULL;
