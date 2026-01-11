-- Adds IDNP + driver license image URLs to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS idnp VARCHAR(13);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS driver_license_front_url VARCHAR(255);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS driver_license_back_url VARCHAR(255);
