-- Database Migration - January 4, 2026
-- Run this SQL on your local PostgreSQL database (CarRental)
-- This adds the created_at column for booking auto-cancellation feature

-- Add created_at column to bookings table (for tracking when bookings were created)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Update existing bookings to have a created_at value (set to now for existing records)
UPDATE bookings SET created_at = NOW() WHERE created_at IS NULL;
