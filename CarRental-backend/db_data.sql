CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin'))
);
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
    gearbox VARCHAR(20) NOT NULL CHECK (gearbox IN ('Manual', 'Automatic')),
    passengers INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    location VARCHAR(100),
    description TEXT
);
CREATE TABLE car_images (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    pickup_location VARCHAR(100) NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE RESTRICT
);
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(50) DEFAULT 'Cluj-Napoca',
    is_active BOOLEAN DEFAULT TRUE
);
-- Insert locations
INSERT INTO locations (name, address, is_active) VALUES
('"Avram Iancu" International Airport', 'Aeroportul Internațional Cluj', TRUE),
('Autogara Beta', 'Str. Gării nr. 1', TRUE);


-- Insert cars
INSERT INTO cars (brand, model, year, price_per_day, fuel_type, gearbox, passengers, status, location) VALUES
('Toyota', 'Camry', 2020, 50.00, 'Petrol', 'Automatic', 4, 'available', 'aeroport'),
('Honda', 'Civic', 2020, 45.00, 'Petrol', 'Automatic', 4, 'available', 'aeroport'),
('BMW', '5 Series', 2024, 200.00, 'Petrol', 'Automatic', 5, 'available', 'autogara'),
('Audi', 'A6', 2024, 200.00, 'Petrol', 'Automatic', 5, 'available', 'aeroport'),
('Peugeot', 'Expert', 2025, 100.00, 'Petrol', 'Automatic', 9, 'available', 'autogara'),
('Mercedes-Benz', 'CLS', 2021, 150.00, 'Petrol', 'Automatic', 4, 'rented', 'aeroport');

-- Insert car images
INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES
(1, '/images/cars/camry.jpg', TRUE, 1),
(2, '/images/cars/honda.jpg', TRUE, 1),
(3, '/images/cars/bmw5.jpg', TRUE, 1),
(4, '/images/cars/audia6.jpg', TRUE, 1),
(5, '/images/cars/peugeot.png', TRUE, 1),
(6, '/images/cars/mercedescls.jpg', TRUE, 1);

-- Sample bookings
INSERT INTO bookings (user_id, car_id, pickup_location, pickup_date, return_date, total_price, status, customer_name, customer_email, customer_phone) VALUES
(2, 6, 'aeroport', '2025-11-08', '2025-11-15', 1050.00, 'active', 'John Doe', 'john@example.com', '+40712345678'),
(2, 2, 'aeroport', '2025-10-01', '2025-10-05', 180.00, 'completed', 'John Doe', 'john@example.com', '+40712345678'),
(2, 1, 'aeroport', '2025-09-15', '2025-09-20', 250.00, 'cancelled', 'John Doe', 'john@example.com', '+40712345678');